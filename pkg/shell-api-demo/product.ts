// this is the definition of a "blank cluster" for Rancher Dashboard
// definition of a "blank cluster" in Rancher Dashboard
const BLANK_CLUSTER = '_';

export function init($plugin:any, store:any) {
  const YOUR_PRODUCT_NAME = 'shell-api-demo';
  const CUSTOM_PAGE_NAME = 'demo-page';

  const {
    product,
    virtualType,
    basicType
  } = $plugin.DSL(store, YOUR_PRODUCT_NAME);

  // registering a top-level product
  product({
    icon:    'star',
    inStore: 'management',
    weight:  100,
    to:      {
      name:   `${ YOUR_PRODUCT_NAME }-c-cluster-${ CUSTOM_PAGE_NAME }`,
      params: {
        product: YOUR_PRODUCT_NAME,
        cluster: BLANK_CLUSTER
      }
    }
  });

  // creating a custom page
  virtualType({
    labelKey: 'some.translation.key',
    name:     CUSTOM_PAGE_NAME,
    route:    {
      name:   `${ YOUR_PRODUCT_NAME }-c-cluster-${ CUSTOM_PAGE_NAME }`,
      params: {
        product: YOUR_PRODUCT_NAME,
        cluster: BLANK_CLUSTER
      }
    }
  });
  // registering the defined pages as side-menu entries
  basicType([CUSTOM_PAGE_NAME]);
}
