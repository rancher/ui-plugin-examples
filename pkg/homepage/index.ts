import { importTypes } from '@rancher/auto-import';
import { IPlugin } from '@shell/core/types';
import NewHomeComponent from './NewHomeComponent.vue';

// Init the package
export default function(plugin: IPlugin) {
  // Auto-import model, detail, edit from the folders
  importTypes(plugin);

  // Provide plugin metadata from package.json
  plugin.metadata = require('./package.json');

  plugin.addRoute({
    name:      'homeRoute',
    path:      '/home',
    component: NewHomeComponent
  });
}
