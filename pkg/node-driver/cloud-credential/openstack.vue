<script>
import Banner from '@components/Banner/Banner.vue';
import { LabeledInput } from '@components/Form/LabeledInput';
import LabeledSelect from '@shell/components/form/LabeledSelect';
import { parse as parseUrl } from '@shell/utils/url';
import { _CREATE } from '@shell/config/query-params';
import BusyButton from '../components/BusyButton.vue';
import { Openstack } from '../openstack.ts';

export default {
  components: {
    Banner,
    BusyButton,
    LabeledInput,
    LabeledSelect,
  },

  props: {
    mode: {
      type:     String,
      required: true,
    },

    value: {
      type:     Object,
      required: true,
    },
  },

  async fetch() {
    this.driver = await this.$store.dispatch('rancher/find', {
      type: 'nodedriver',
      id:   'openstack'
    });
  },

  data() {
    if (this.mode !== _CREATE) {
      this.value.decodedData.username = this.value.annotations['openstack.cattle.io/username'];
      this.value.decodedData.domainName = this.value.annotations['openstack.cattle.io/domainName'];
      this.value.decodedData.endpoint = this.value.annotations['openstack.cattle.io/endpoint'];
    }

    return {
      projects:       null,
      regions:        null,
      step:           1,
      busy:           false,
      project:        '',
      region:         '',
      errorAllowHost: false,
      driver:         {},
      allowBusy:      false,
      error:          '',
    };
  },

  computed: {
    projectOptions() {
      const sorted = (this.projects || []).sort((a, b) => a.name.localeCompare(b.name));

      return sorted.map((p) => {
        return {
          label: p.name,
          value: p.id
        };
      });
    },

    regionOptions() {
      const sorted = (this.regions || []).sort((a, b) => a.name.localeCompare(b.name));

      return sorted.map((p) => {
        return {
          label: p.id,
          value: p.id
        };
      });
    },

    hostname() {
      const u = parseUrl(this.value.decodedData.endpoint);

      return u?.host || '';
    },

    canAuthenticate() {
      return !!this.value?.decodedData?.endpoint &&
        !!this.value?.decodedData?.domainName &&
        !!this.value?.decodedData?.username &&
        !!this.value?.decodedData?.password;
    }
  },

  created() {
    this.$emit('validationChanged', false);
  },

  methods: {
    // TODO: Validate that we can get a token for the project that the user has selected
    test() {
      // In the cluster creation flow, annotations is not set, so ensure it is set first
      this.value.annotations = this.value.annotations || {};

      this.value.annotations['openstack.cattle.io/username'] = this.value.decodedData.username;
      this.value.annotations['openstack.cattle.io/domainName'] = this.value.decodedData.domainName;
      this.value.annotations['openstack.cattle.io/endpoint'] = this.value.decodedData.endpoint;

      const project = this.projects.find(p => p.id === this.project);

      if (project) {
        this.value.annotations['openstack.cattle.io/projectName'] = project.name;
        this.value.annotations['openstack.cattle.io/projectId'] = project.id;
        this.value.annotations['openstack.cattle.io/projectDomainName'] = project.domain_id;
      }

      if (this.region) {
        this.value.annotations['openstack.cattle.io/region'] = this.region;
      }

      return true;
    },

    // When the user clicked 'Edit Auth Config', clear the projects and set the step back to 1
    // so the user can modify the credentials needed to fetch the projects
    clear() {
      this.$set(this, 'step', 1);
      this.$set(this, 'projects', null);
      this.$set(this, 'errorAllowHost', false);

      // Tell parent that the form is not invalid
      this.$emit('validationChanged', false);
    },

    hostInAllowList() {
      if (!this.driver?.whitelistDomains) {
        return false;
      }

      const u = parseUrl(this.value.decodedData.endpoint);

      if (!u.host) {
        return true;
      }

      return (this.driver?.whitelistDomains || []).includes(u.host);
    },

    async addHostToAllowList() {
      this.$set(this, 'allowBusy', true);
      const u = parseUrl(this.value.decodedData.endpoint);

      this.driver.whitelistDomains = this.driver.whitelistDomains || [];

      if (!this.hostInAllowList()) {
        this.driver.whitelistDomains.push(u.host);
      }

      try {
        await this.driver.save();

        this.$refs.connect.$el.click();
      } catch (e) {
        console.error('Could not update driver', e); // eslint-disable-line no-console
        this.$set(this, 'allowBusy', false);
      }
    },

    async connect(cb) {
      this.$set(this, 'error', '');
      this.$set(this, 'errorAllowHost', false);

      let okay = false;

      if (!this.value.decodedData.endpoint) {
        return cb(okay);
      }

      const os = new Openstack(this.$store, {
        endpoint:   this.value.decodedData.endpoint,
        domainName: this.value.decodedData.domainName,
        username:   this.value.decodedData.username,
        password:   this.value.decodedData.password,
      });

      this.$set(this, 'allowBusy', false);
      this.$set(this, 'step', 2);
      this.$set(this, 'busy', true);

      const res = await os.getToken();

      if (res.error) {
        console.error(res.error); // eslint-disable-line no-console
        okay = false;

        this.$set(this, 'step', 1);
        this.$set(this, 'projects', null);

        if (res.error._status === 502 && !this.hostInAllowList()) {
          this.$set(this, 'errorAllowHost', true);
        } else {
          if (res.error._status === 502) {
            // Still got 502, even with URL in the allow list
            this.$set(this, 'error', this.t('driver.openstack.auth.errors.badGateway'));
          } else if (res.error._status === 401) {
            this.$set(this, 'error', this.t('driver.openstack.auth.errors.unauthorized'));
          } else {
            // Generic error
            this.$set(this, 'error', res.error.message || this.t('driver.openstack.auth.errors.other'));
          }
        }
      } else {
        const projects = await os.getProjects();

        if (!projects.error) {
          this.$set(this, 'projects', projects);
          okay = true;
        } else {
          this.$set(this, 'error', projects.error.message);
        }

        const regions = await os.getRegions();

        if (!regions.error) {
          this.$set(this, 'regions', regions);
          okay = true;
        } else {
          // Could not list regions, so infer them from the project
          const prj = this.projectOptions[0].value;
          const project = this.projects.find(p => p.id === prj);

          if (project) {
            const osRegions = new Openstack(this.$store, {
              ...os,
              projectName: project.name,
              projectId: project.id,
              projectDomainName: project.domain_id
            });

            // Fetch a token with the project, so we get the endpoint catalog
            await osRegions.getToken().then(() => {
              this.$set(this, 'regions', osRegions.regionsFromCatalog);
            });
          }

          // this.$set(this, 'error', regions.error.message || this.t('driver.openstack.auth.errors.regions'));
        }
      }
      this.$set(this, 'busy', false);
      this.$set(this, 'project', this.projectOptions[0]?.value);
      this.$set(this, 'region', this.regionOptions[0]?.value);
      this.$emit('validationChanged', okay);

      cb(okay);
    }
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-6">
        <LabeledInput
          :value="value.decodedData.endpoint"
          :disabled="step !== 1"
          label-key="driver.openstack.auth.fields.endpoint"
          placeholder-key="driver.openstack.auth.placeholders.endpoint"
          type="text"
          :mode="mode"
          @input="value.setData('endpoint', $event);"
        />
      </div>
      <div class="col span-6">
        <LabeledInput
          :value="value.decodedData.domainName"
          :disabled="step !== 1"
          label-key="driver.openstack.auth.fields.domainName"
          placeholder-key="driver.openstack.auth.placeholders.domainName"
          type="text"
          :mode="mode"
          @input="value.setData('domainName', $event);"
        />
      </div>
    </div>
    <div class="row">
      <div class="col span-6">
        <LabeledInput
          :value="value.decodedData.username"
          :disabled="step !== 1"
          class="mt-20"
          label-key="driver.openstack.auth.fields.username"
          placeholder-key="driver.openstack.auth.placeholders.username"
          type="text"
          :mode="mode"
          @input="value.setData('username', $event);"
        />
      </div>
      <div class="col span-6">
        <LabeledInput
          :value="value.decodedData.password"
          :disabled="step !== 1"
          class="mt-20"
          label-key="driver.openstack.auth.fields.password"
          placeholder-key="driver.openstack.auth.placeholders.password"
          type="password"
          :mode="mode"
          @input="value.setData('password', $event);"
        />
      </div>
    </div>

    <BusyButton
      ref="connect"
      label-key="driver.openstack.auth.actions.authenticate"
      :disabled="step !== 1 || !canAuthenticate"
      class="mt-20"
      @click="connect"
    />

    <button
      class="btn role-primary mt-20 ml-20"
      :disabled="busy || step === 1"
      @click="clear"
    >
      {{ t('driver.openstack.auth.actions.edit') }}
    </button>

    <Banner
      v-if="error"
      class="mt-20"
      color="error"
    >
      {{ error }}
    </Banner>

    <Banner
      v-if="errorAllowHost"
      color="error"
      class="allow-list-error"
    >
      <div>
        {{ t('driver.openstack.auth.errors.notAllowed', { hostname }) }}
      </div>
      <button
        :disabled="allowBusy"
        class="btn ml-10 role-primary"
        @click="addHostToAllowList"
      >
        {{ t('driver.openstack.auth.actions.addToAllowList') }}
      </button>
    </Banner>
    <div
      v-if="projects"
      class="row mt-20"
    >
      <div class="col span-6">
        <LabeledSelect
          v-model="project"
          label-key="driver.openstack.auth.fields.project"
          :options="projectOptions"
          :searchable="false"
        />
      </div>
      <div
        v-if="regions"
        class="col span-6"
      >
        <LabeledSelect
          v-model="region"
          label-key="driver.openstack.auth.fields.region"
          :options="regionOptions"
          :searchable="false"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .allow-list-error {
    display: flex;

    > :first-child {
      flex: 1;
    }
  }
</style>
