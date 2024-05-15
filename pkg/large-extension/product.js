export const NAME = 'large-extension';
const BLANK_CLUSTER = '_';

export function init(plugin, store) {
  const { product } = plugin.DSL(store, NAME);

  product({
    icon:    'globe',
    inStore: 'management',
    weight:  100,
    to:      {
      name:   `${ NAME }-c-cluster`,
      params: {
        product: NAME,
        cluster: BLANK_CLUSTER
      }
    }
  });
}
