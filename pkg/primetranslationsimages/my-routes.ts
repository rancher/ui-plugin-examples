import { PROD_NAME, BLANK_CLUSTER } from './config/constants.js';
import Dashboard from './pages/Dashboard.vue';

const routes = [
  {
    name:      `${PROD_NAME}-c-cluster`,
    path:      `/${PROD_NAME}/c/:cluster/dashboard`,
    component: Dashboard,
    meta:      {
      product: PROD_NAME,
      cluster: BLANK_CLUSTER,
      pkg:     PROD_NAME
    }
  }
];

export default routes;
