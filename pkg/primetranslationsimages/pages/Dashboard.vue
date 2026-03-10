

<script>
import { mapGetters } from 'vuex';
import { isRancherPrime } from '@shell/config/version';
import { IMAGES_ASSET_PATH } from '../config/constants';
import Loading from '@shell/components/Loading';
import versions from '@shell/utils/versions';

  export default {
    name: 'DashboardPage',
    components: {
      Loading,
    },
    async fetch(){
      await versions.fetch({ store: this.$store })
    },
    computed: {
      ...mapGetters({ theme: 'prefs/theme' }),

      isDarkTheme() {
        return this.theme === 'dark';
      },

      isRancherPrime() {
        return isRancherPrime();
      },

      themeType() {
        return this.isDarkTheme ? 'DARK' : 'LIGHT';
      },

      rancherType() {
        return this.isRancherPrime ? 'PRIME' : 'COMMUNITY';
      },

      logoPath() {
        return require(`../assets/${IMAGES_ASSET_PATH[this.rancherType][this.themeType].LOGO}`);
      },

      landscapePath() {
        return require(`../assets/${IMAGES_ASSET_PATH[this.rancherType][this.themeType].LANDSCAPE}`);
      }
    },
  }
</script>

<template>
  <Loading v-if="$fetchState.pending" />
  <div v-else>
    <h1 class="mb-20">{{ t('dashboard.welcome_message', null, true) }}</h1>
    <h3 class="mb-40">{{ t('dashboard.description') }} {{ t('dashboard.rancherType') }}</h3>
    <div class="mb-40">
      <img class="logo" :src="logoPath" alt="Demo Logo" />
    </div> 
     <img class="mb-20 landscape" :src="landscapePath" alt="Demo Landscape" />
    <h4>{{ t('dashboard.imageDescription', null, true) }}</h4>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  width: 300px;
}

.landscape {
  width: 100%;
  height: 100px;
}
</style>