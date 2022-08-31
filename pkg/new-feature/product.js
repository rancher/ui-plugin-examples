export const NAME = 'new-feature';

export function init(plugin, store) {
  const {
    product,
    basicType,
    configureType,
    virtualType,
    headers,
    hideBulkActions,
  } = plugin.DSL(store, NAME);

  product({
    inStore:             'management',
    icon:                'globe',
    label:               'New Feature',
    removable:           false,
    showClusterSwitcher: false,
    category:            'global',
    to:                  'new-feature'
  });

}
