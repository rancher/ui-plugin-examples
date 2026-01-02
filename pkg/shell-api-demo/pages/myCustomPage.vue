
<script>
import HelloWorldComponent from '../components/HelloWorld.vue';
import { NotificationLevel } from '@shell/types/notifications';
import RcButton from '@components/RcButton/RcButton.vue';

export default {
  name: 'ShellApiDemoPage',
  components: {
    RcButton,
  },
  mounted () {
    console.log('Shell API Demo Page mounted', this.$shell);
  },
  data() {
    return {
      systemApiData: 'No System Info yet. Press the button to fetch it.'
    }
  },
  methods: {
    slideInTrigger() {
      this.$shell.slideIn.open(HelloWorldComponent, {
        title: 'Hello from SlideIn panel!'
      });
    },
    modalTrigger() {
      this.$shell.modal.open(HelloWorldComponent, {
        props: { title: 'Hello Modal' }
      });
    },
    notificationTrigger() {
      this.$shell.notification.send(NotificationLevel.Success, 'Some notification title', 'Hello world! Success!', {});
    },
    systemApiTrigger() {
      this.systemApiData = {
        gitCommit: this.$shell.system.gitCommit,
        isDevBuild: this.$shell.system.isDevBuild,
        isPrereleaseVersion: this.$shell.system.isPrereleaseVersion,
        isRancherPrime: this.$shell.system.isRancherPrime,  
        kubernetesVersion: this.$shell.system.kubernetesVersion,
        rancherVersion: this.$shell.system.rancherVersion,
        uiVersion: this.$shell.system.uiVersion          
      }
    }
  },
}
</script>

<template>
  <div>
    <h2>Shell API Demo</h2>
    <p>This is a custom page to showcase the Shell API capabilities.</p>
    <RcButton primary class="mt-40 mb-10" @click="slideInTrigger">Test Slide-in API</RcButton>
    <a class="mb-20" href="https://extensions.rancher.io/extensions/next/shell-api/interfaces/SlideInApi" target="_blank" rel="noopener noreferrer">Documentation Reference</a>
    <code>
      this.$shell.slideIn.open(HelloWorldComponent, {
        title: 'Hello from SlideIn panel!'
      });
    </code>
    <RcButton primary class="mt-40 mb-10" @click="modalTrigger">Test Modal API</RcButton>
    <a class="mb-20" href="https://extensions.rancher.io/extensions/next/shell-api/interfaces/ModalApi" target="_blank" rel="noopener noreferrer">Documentation Reference</a>
    <code>
      this.$shell.modal.open(HelloWorldComponent, {
        props: { title: 'Hello Modal' }
      });
    </code>
    <RcButton primary class="mt-40 mb-10" @click="notificationTrigger">Test Notification API</RcButton>
    <a class="mb-20" href="https://extensions.rancher.io/extensions/next/shell-api/interfaces/NotificationApi" target="_blank" rel="noopener noreferrer">Documentation Reference</a>
    <code>
      this.$shell.notification.send(NotificationLevel.Success, 'Some notification title', 'Hello world! Success!', {});
    </code>
    <RcButton primary class="mt-40 mb-10" @click="systemApiTrigger">Test System API</RcButton>
    <a class="mb-20" href="https://extensions.rancher.io/extensions/next/shell-api/interfaces/SystemApi" target="_blank" rel="noopener noreferrer">Documentation Reference</a>
    <code>
      {
        gitCommit: this.$shell.system.gitCommit,
        isDevBuild: this.$shell.system.isDevBuild,
        isPrereleaseVersion: this.$shell.system.isPrereleaseVersion,
        isRancherPrime: this.$shell.system.isRancherPrime,  
        kubernetesVersion: this.$shell.system.kubernetesVersion,
        rancherVersion: this.$shell.system.rancherVersion,
        uiVersion: this.$shell.system.uiVersion          
      }
    </code>
    <p class="mt-40 mb-20">System API Data:</p>
    <code>
      {{ systemApiData }}
    </code>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  max-width: fit-content;
}
</style>
