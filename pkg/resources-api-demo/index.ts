import { importTypes } from '@rancher/auto-import';
import {
  IPlugin
} from '@shell/core/types';
import { ProductMetadata, ProductChildCustomPage } from '@shell/core/plugin-products-external';

// Init the package
export default function (extension: IPlugin) {
  // Auto-import model, detail, edit from the folders
  importTypes(extension);

  // Provide extension metadata from package.json
  extension.metadata = require('./package.json');

  const product: ProductMetadata = {
    name:      'resources-api',
    label:     'Resources API',
    sideBar:   { icon: { name: 'globe' } }
  };

  const resourcesApiPage: ProductChildCustomPage = {
    name:      'mgmt-api-demo',
    label:     'Management API Demo',
    component: () => import('./pages/MgmtApiDemoPage.vue')
  };

  const clusterApiPage: ProductChildCustomPage = {
    name:      'cluster-api-demo',
    label:     'Cluster API Demo',
    component: () => import('./pages/ClusterApiDemoPage.vue')
  };

  extension.extendProduct('explorer', [resourcesApiPage, clusterApiPage]);
}
