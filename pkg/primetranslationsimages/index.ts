import { importTypes } from '@rancher/auto-import';
import { IPlugin } from '@shell/core/types';
import myRoutes from './my-routes';
import { mergeWithReplace } from '@shell/utils/object';

// Init the package
export default function(plugin: IPlugin, store: any): void {
  // Auto-import model, detail, edit from the folders
  importTypes(plugin);

  // Provide plugin metadata from package.json
  plugin.metadata = require('./package.json');

  plugin.addProduct(require('./my-config'));

  plugin.addRoutes(myRoutes);

  // this is how we handle translations in Prime, we merge the base translations 
  // with the prime-specific ones and register the merged result
  // 'en-us-prime.yaml' contains translations that are only relevant for Rancher Prime, 
  // while 'en-us.yaml' contains translations that are common for both editions
  if (plugin.environment.isPrime) {
    const base = require('./l10n/en-us.yaml');
    const prime = require('./l10n/en-us-prime.yaml');
    const merged = mergeWithReplace(base, prime, { mutateOriginal: true });

    plugin.register('l10n', 'en-us', merged);
  }
}
