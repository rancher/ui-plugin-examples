export const NAME = 'clock';

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
    label:               'Clock',
    removable:           false,
    showClusterSwitcher: false,
    category:            'global',
    to:                  { name: 'clock', params: { cluster: 'local'} }
  });

}
