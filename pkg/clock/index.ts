import { importTypes } from '@rancher/auto-import';
import { IPlugin } from '@shell/core/types';
import NewFeature from './NewFeature.vue';

// Init the package
export default function(plugin: IPlugin) {
  // Auto-import model, detail, edit from the folders
  importTypes(plugin);

  // Provide plugin metadata from package.json
  plugin.metadata = require('./package.json');

  // Load a product
  plugin.addProduct(require('./product'));

  plugin.addRoute({
    name:      'clock',
    path:      '/clock',
    component: NewFeature
  });
}
