import { IPlugin } from '@shell/core/types';

import { Product } from './types/product';

export const NAME = 'clock';

export function init($plugin: IPlugin, store: any) {
  const {
    product,
  } = $plugin.DSL(store, Product.name);

  // registering a cluster-level product
  product({
    inStore: 'management',
    icon: 'globe',
    label: 'Clock',
    removable: false,
    showClusterSwitcher: false,
    category: 'global',
    to: { name: 'clock', params: { cluster: 'local' } }
  } as any);
}
