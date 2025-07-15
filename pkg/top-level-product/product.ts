// this is the definition of a "blank cluster" for Rancher Dashboard
// definition of a "blank cluster" in Rancher Dashboard
const BLANK_CLUSTER = '_';

export function init($plugin:any, store:any) {
  const YOUR_PRODUCT_NAME = 'myProductName';
  const YOUR_K8S_RESOURCE_NAME = 'provisioning.cattle.io.cluster';
  const CUSTOM_PAGE_NAME = 'page1';

  const {
    product,
    configureType,
    virtualType,
    basicType
  } = $plugin.DSL(store, YOUR_PRODUCT_NAME);

  // registering a top-level product
  product({
    icon:    'gear',
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

  // defining a k8s resource as page
  configureType(YOUR_K8S_RESOURCE_NAME, {
    displayName: 'some-custom-name-you-wish-to-assign-to-this-resource',
    isCreatable: true,
    isEditable:  true,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    customRoute: {
      name:   `${ YOUR_PRODUCT_NAME }-c-cluster-resource`,
      params: {
        product:  YOUR_PRODUCT_NAME,
        cluster:  BLANK_CLUSTER,
        resource: YOUR_K8S_RESOURCE_NAME
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
  basicType([YOUR_K8S_RESOURCE_NAME, CUSTOM_PAGE_NAME]);
}
