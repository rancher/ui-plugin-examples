import ListResource from '@shell/pages/c/_cluster/_product/_resource/index.vue';
import CreateResource from '@shell/pages/c/_cluster/_product/_resource/create.vue';
import ViewResource from '@shell/pages/c/_cluster/_product/_resource/_id.vue';
import ViewNamespacedResource from '@shell/pages/c/_cluster/_product/_resource/_namespace/_id.vue';

import { Product } from '../types/product';

import Dashboard from '../pages/index.vue';

const CUSTOM_PAGE_NAME = 'page1';

const routes = [
  {
    name:      `asd`,
    path:      `asd`,
    component: Dashboard,
    meta:      { product: Product.name },
  },
  {
    name:      `c-cluster-${ Product.name }-resource`,
    path:      `/c/:cluster/${ Product.name }/:resource`,
    component: ListResource,
    meta:      { product: Product.name },
  },
  {
    name:      `c-cluster-${ Product.name }-resource-create`,
    path:      `/c/:cluster/${ Product.name }/:resource/create`,
    component: CreateResource,
    meta:      { product: Product.name },
  },
  {
    name:      `c-cluster-${ Product.name }-resource-id`,
    path:      `/c/:cluster/${ Product.name }/:resource/:id`,
    component: ViewResource,
    meta:      { product: Product.name },
  },
  {
    name:      `c-cluster-${ Product.name }-resource-namespace-id`,
    path:      `/:cluster/${ Product.name }/:resource/:namespace/:id`,
    component: ViewNamespacedResource,
    meta:      { product: Product.name },
  }
];

export default routes;
