import { importTypes } from '@rancher/auto-import';
import { IPlugin } from '@shell/core/types';

// Init the package
export default function(plugin: IPlugin) {
  console.error('ADD LOCALE !!!!!!!!!!!!!!1');

  // Auto-import model, detail, edit from the folders
  importTypes(plugin);

  // Provide plugin metadata from package.json
  plugin.metadata = require('./package.json');

  // Add the new locale
  plugin.addLocale('en-uk', 'UK English');
}
