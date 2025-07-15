<script>
import Loading from '@shell/components/Loading';
import { Banner } from '@components/Banner';
import CreateEditView from '@shell/mixins/create-edit-view';
import LabeledSelect from '@shell/components/form/LabeledSelect';
import { LabeledInput } from '@components/Form/LabeledInput';
import { NORMAN, SECRET } from '@shell/config/types';
import { stringify } from '@shell/utils/error';
import { _VIEW } from '@shell/config/query-params';
import FileSelector from '../components/FileSelector';
import { Openstack } from '../openstack.ts';

function initOptions() {
  return {
    options:  [],
    selected: null,
    busy:     false,
    enabled:  false,
  };
}

export default {
  components: {
    Banner, FileSelector, Loading, LabeledInput, LabeledSelect
  },

  mixins: [CreateEditView],

  props: {
    uuid: {
      type:     String,
      required: true,
    },

    cluster: {
      type:    Object,
      default: () => ({})
    },

    credentialId: {
      type:     String,
      required: true,
    },

    disabled: {
      type:    Boolean,
      default: false
    },

    busy: {
      type:    Boolean,
      default: false
    },

    provider: {
      type:     String,
      required: true,
    }
  },

  async fetch() {
    this.errors = [];
    if ( !this.credentialId ) {
      return;
    }

    if (this.mode === _VIEW) {
      this.initForViewMode();

      return;
    }

    try {
      this.credential = await this.$store.dispatch('rancher/find', { type: NORMAN.CLOUD_CREDENTIAL, id: this.credentialId });
    } catch (e) {
      this.credential = null;
    }

    // Try and get the secret for the Cloud Credential as we need the plain-text password
    try {
      const id = this.credentialId.replace(':', '/');
      const secret = await this.$store.dispatch('management/find', { type: SECRET, id });
      const data = secret.data['openstackcredentialConfig-password'];
      const password = atob(data);

      this.password = password;
      this.havePassword = true;
      this.ready = true;
    } catch (e) {
      // this.credential = null;
      this.password = '';
      this.havePassword = false;
      console.error(e); // eslint-disable-line no-console
    }

    this.$set(this, 'authenticating', true);

    const os = new Openstack(this.$store, this.credential);

    os.password = this.password;

    this.os = os;

    // Fetch a token - if this succeeds, kick off async fetching the lists we need
    this.os.getToken().then((res) => {
      if (res.error) {
        this.$set(this, 'authenticating', false);
        this.$emit('validationChanged', false);

        this.errors.push('Unable to authenticate with the OpenStack server');

        return;
      }

      this.$set(this, 'authenticating', false);

      os.getFlavors(this.flavors, this.value?.flavorName);
      os.getImages(this.images, this.value?.imageName);
      os.getKeyPairs(this.keyPairs, this.value?.keypairName);
      os.getSecurityGroups(this.securityGroups, this.value?.secGroups);
      os.getFloatingIpPools(this.floatingIpPools, this.value?.floatingipPool);
      os.getNetworkNames(this.networks, this.value?.netName);
      os.getAvailabilityZones(this.availabilityZones, this.value?.availabilityZone);
    });

    this.$emit('validationChanged', false);
  },

  data() {
    return {
      authenticating:      false,
      ready:               false,
      os:                  null,
      password:            null,
      havePassword:        false,
      flavors:             initOptions(),
      images:              initOptions(),
      keyPairs:            initOptions(),
      securityGroups:      initOptions(),
      floatingIpPools:     initOptions(),
      networks:            initOptions(),
      availabilityZones:   initOptions(),
      sshUser:             this.value?.sshUser || 'root',
      privateKeyFile:      this.value?.privateKeyFile || '',
      filename:            this.value?.privateKeyFile ? 'Private Key Provided' : '',
      privateKeyFieldType: 'password',
      errors:              null,
    };
  },

  watch: {
    'credentialId'() {
      this.$fetch();
    },
  },

  methods: {
    stringify,

    initForViewMode() {
      this.fakeSelectOptions(this.flavors, this.value?.flavorName);
      this.fakeSelectOptions(this.images, this.value?.imageName);
      this.fakeSelectOptions(this.keyPairs, this.value?.keypairName);
      this.fakeSelectOptions(this.securityGroups, this.value?.secGroups);
      this.fakeSelectOptions(this.floatingIpPools, this.value?.floatingipPool);
      this.fakeSelectOptions(this.networks, this.value?.netName);
      this.fakeSelectOptions(this.availabilityZones, this.value?.availabilityZone);
    },

    fakeSelectOptions(list, value) {
      list.busy = false;
      list.enabled = false;
      list.options = [];

      if (value) {
        list.options.push({
          label: value,
          value,
        });
      }

      list.selected = value;
    },

    onPrivateKeyFileSelected(v) {
      this.filename = v.file.name;
      this.privateKeyFile = v.data;

      // On initial load, filename is shown as a password as we don't know what the filename was that was used - we just want to indicate there is a vlue
      // When a file is chosen, change the type to text, so that the user can see the filename of the file that they chose
      this.privateKeyFieldType = 'text';

      this.$emit('validationChanged', true);
    },

    syncValue() {
      // Note: We don't need to provide password as this is picked up via the credential

      // Copy the values from the form to the correct places on the value
      this.value.authUrl = this.os.endpoint;
      this.value.domainName = this.os.domainName;
      this.value.tenantDomainName = this.os.projectDomainName;
      this.value.username = this.os.username;
      this.value.userDomainName = this.os.domainName;
      this.value.tenantId = this.os.projectId;
      this.value.tenantName = this.os.projectName;
      this.value.availabilityZone = this.availabilityZones.selected?.name;
      this.value.flavorName = this.flavors.selected?.name;
      this.value.imageName = this.images.selected?.name;
      this.value.floatingipPool = this.floatingIpPools.selected?.name;
      this.value.keypairName = this.keyPairs.selected?.name;
      this.value.netName = this.networks.selected?.name;
      this.value.secGroups = this.securityGroups.selected?.name;
      this.value.sshUser = this.sshUser;
      this.value.privateKeyFile = this.privateKeyFile;
      this.value.region = this.os.region;

      // Not configurable
      this.value.endpointType = 'publicURL';
      this.value.insecure = true;
      this.value.bootFromVolume = false;
      this.value.sshPort = '22';
    },

    test() {
      this.syncValue();
    }
  }
};
</script>

<template>
  <div>
    <Loading
      v-if="$fetchState.pending"
      :delayed="true"
    />
    <div v-if="errors.length">
      <div
        v-for="(err, idx) in errors"
        :key="idx"
      >
        <Banner
          color="error"
          :label="stringify(err)"
        />
      </div>
    </div>
    <div>
      <div class="openstack-config">
        <div class="title">
          Openstack Configuration
        </div>
        <div
          v-if="authenticating"
          class="loading"
        >
          <i class="icon-spinner icon-spin icon-lg" />
          <span>
            Authenticating with the Openstack server ...
          </span>
        </div>
      </div>
      <div class="row mt-10">
        <div class="col span-6">
          <LabeledSelect
            v-model="flavors.selected"
            label="Flavor"
            :options="flavors.options"
            :disabled="!flavors.enabled || busy"
            :loading="flavors.busy"
            :searchable="false"
          />
        </div>

        <div class="col span-6">
          <LabeledSelect
            v-model="images.selected"
            label="Image"
            :options="images.options"
            :disabled="!images.enabled || busy"
            :loading="images.busy"
            :searchable="false"
          />
        </div>
      </div>
      <div class="row mt-10">
        <div class="col span-6">
          <LabeledSelect
            v-model="keyPairs.selected"
            label="Key Pair"
            :options="keyPairs.options"
            :disabled="!keyPairs.enabled || busy"
            :loading="keyPairs.busy"
            :searchable="false"
          />
        </div>
        <div class="col span-6">
          <LabeledInput
            v-model="filename"
            label="Private Key"
            :mode="mode"
            :type="privateKeyFieldType"
            :disabled="busy"
            :required="true"
          >
            <template v-slot:suffix>
              <div class="file-button">
                <FileSelector
                  label="..."
                  :mode="mode"
                  :include-file="true"
                  :disabled="busy"
                  class="btn-sm"
                  @selected="onPrivateKeyFileSelected"
                />
              </div>
            </template>
          </LabeledInput>
        </div>
      </div>
      <div class="row mt-10">
        <div class="col span-6">
          <LabeledSelect
            v-model="securityGroups.selected"
            label="Security Groups"
            :options="securityGroups.options"
            :disabled="!securityGroups.enabled || busy"
            :loading="securityGroups.busy"
            :searchable="false"
          />
        </div>
      </div>
      <div class="row mt-10">
        <div class="col span-6">
          <LabeledSelect
            v-model="availabilityZones.selected"
            label="Availability Zone"
            :options="availabilityZones.options"
            :disabled="!availabilityZones.enabled || busy"
            :loading="availabilityZones.busy"
            :searchable="false"
          />
        </div>
      </div>
      <div class="row mt-10">
        <div class="col span-6">
          <LabeledSelect
            v-model="floatingIpPools.selected"
            label="Floating IP Pools"
            :options="floatingIpPools.options"
            :disabled="!floatingIpPools.enabled || busy"
            :loading="floatingIpPools.busy"
            :searchable="false"
          />
        </div>
        <div class="col span-6">
          <LabeledSelect
            v-model="networks.selected"
            label="Networks"
            :options="networks.options"
            :disabled="!networks.enabled || busy"
            :loading="networks.busy"
            :searchable="false"
          />
        </div>
      </div>
      <div class="row mt-10">
        <div class="col span-6">
          <LabeledInput
            v-model="sshUser"
            :mode="mode"
            :disabled="busy"
            :required="true"
            label="SSH User ID"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  .file-button {
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    display: flex;

    > .file-selector {
      height: calc($input-height - 2px);
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }

  .openstack-config {
    display: flex;
    align-items: center;

    > .title {
      font-weight: bold;
      padding: 4px 0;
    }

    > .loading {
      margin-left: 20px;
      display: flex;
      align-items: center;

      > i {
        margin-right: 4px;;
      }
    }
  }
</style>
