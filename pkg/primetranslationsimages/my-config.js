import { PROD_NAME, DASHBOARD_PAGE, BLANK_CLUSTER } from './config/constants.js';

export function init($plugin, store) {
  const {
    product, virtualType, basicType
  } = $plugin.DSL(store, $plugin.name);

  // app in sidebar
  product({
    name:                PROD_NAME,
    icon:                'gear',
    inStore:             'management',
    removable:           false,
    showClusterSwitcher: false,
    to:                  {
      name: `${PROD_NAME}-c-cluster`,
      params: {
        product: PROD_NAME,
        cluster: BLANK_CLUSTER
      },
      meta: {
        product: PROD_NAME,
        cluster: BLANK_CLUSTER
      }
    }
  });

  // dashboard menu entry
  virtualType({
    label:        store.getters['i18n/t']('dashboard.pageLabel'),
    icon:         'folder',
    namespaced:   false,
    name:         DASHBOARD_PAGE,
    route:        {
      name: `${PROD_NAME}-c-cluster`,
      params: {
        product: PROD_NAME,
        cluster: BLANK_CLUSTER
      },
      meta: {
        product: PROD_NAME,
        cluster: BLANK_CLUSTER
      }
    }
  });

  basicType([
    DASHBOARD_PAGE
  ]);
}
