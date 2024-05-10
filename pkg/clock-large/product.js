export const NAME = 'clock-large';

export function init(plugin, store) {
  const { product } = plugin.DSL(store, NAME);

  product({
    inStore:             'management',
    icon:                'globe',
    label:               'Clock',
    removable:           false,
    showClusterSwitcher: false,
    category:            'global',
    to:                  { name: 'clock-large', params: { cluster: 'local' } }
  });
}
