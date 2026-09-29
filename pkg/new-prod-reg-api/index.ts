// ./index.ts
import { importTypes } from '@rancher/auto-import';
import { IPlugin } from '@shell/core/types';
import {
  ProductMetadata,
  ProductChildCustomPage,
  ProductChildResourcePage,
  ProductChildGroup
} from '@shell/core/plugin-products-external';

export default function(extension: IPlugin) {
  importTypes(extension);
  extension.metadata = require('./package.json');

  // Standalone page (outside any group)
  const homePage: ProductChildCustomPage = {
    name:      'home',
    label:     'Home',
    component: () => import('./pages/Home.vue'),
    sideMenu:  { weight: 10 },
  };

  // "Monitoring" group with two pages (one custom page + one resource page)
  const alertsPage: ProductChildCustomPage = {
    name:      'alerts',
    label:     'Alerts',
    component: () => import('./pages/Alerts.vue'),
  };

  const mgmtClustersPage: ProductChildResourcePage = {
    type: 'management.cattle.io.cluster',
    label:    'Mgmt clusters'
  };

  // monitoring group definition
  const monitoringGroup: ProductChildGroup = {
    name:    'monitoring',
    label:   'Monitoring',
    sideMenu: {
      weight:   5,
      children: [alertsPage, mgmtClustersPage],
    },
  };

  // "Admin" group with two pages (one custom page + one resource page)
  const rolesPage: ProductChildCustomPage = {
    name:      'roles',
    label:     'Roles',
    component: () => import('./pages/Roles.vue'),
  };

  const globalRoleBindingsPage: ProductChildResourcePage = {
    type:      'management.cattle.io.globalrolebinding',
    label:     'Global Role Bindings'
  };

  // Admin group definition w/ overview page
  const adminGroup: ProductChildGroup = {
    name:    'admin',
    label:   'Administration',
    component: () => import('./pages/Overview.vue'),
    sideMenu: {
      weight:   1,
      children: [rolesPage, globalRoleBindingsPage],
    },
  };

  const product: ProductMetadata = {
    name:  'my-new-prod-reg',
    label: 'New Product - Prod. Reg. API',
  };

  // group definition for extend product
  const extendProductGroup: ProductChildGroup = {
    name:    'extend-prod',
    label:   'Extend Product - Prod. Reg. API',
    sideMenu: {
      weight:   1000,
      children: [homePage, monitoringGroup, adminGroup],
    },
  };

  extension.addProduct(product, [homePage, monitoringGroup, adminGroup]);

  extension.extendProduct('explorer', [extendProductGroup]);
}