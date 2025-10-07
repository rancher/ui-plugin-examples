import { importTypes } from '@rancher/auto-import';
import { UI_PLUGIN } from '@shell/config/types';
import { IPlugin } from '@shell/core/types';

// Init the package
export default function(plugin: IPlugin) {
  // Auto-import model, detail, edit from the folders
  importTypes(plugin);

  // Provide plugin metadata from package.json
  plugin.metadata = require('./package.json');

  // Load a product
  plugin.addProduct(require('./product'));

  // Ensure that the `catalog.cattle.io.uiplugin` list uses server-side pagination
  plugin.enableServerSidePagination?.({
    cluster: {
      resources: {
        enableSome: {
          enabled: [UI_PLUGIN],
        }
      }
    }
  })
}
