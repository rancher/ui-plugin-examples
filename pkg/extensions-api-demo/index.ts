import { importTypes } from '@rancher/auto-import';
import {
  IPlugin,
  ActionLocation,
  PanelLocation,
  TabLocation,
  CardLocation,
  TableColumnLocation,
  ActionOpts,
} from '@shell/core/types';

// Init the package
export default function (plugin: IPlugin) {
  // Auto-import model, detail, edit from the folders
  importTypes(plugin);

  // Provide plugin metadata from package.json
  plugin.metadata = require('./package.json');

  // Load a product
  // plugin.addProduct(require('./product'));

  // HEADER ACTION - GLOBAL
  plugin.addAction(
    ActionLocation.HEADER,
    {},
    {
      tooltipKey: 'plugin-examples.header-action-one',
      tooltip: 'Test Action1',
      shortcut: 'm',
      icon: 'icon-pipeline',
      invoke(opts: any, resources: any) {
        console.log('action executed 1', this); // eslint-disable-line no-console
        console.log(opts); // eslint-disable-line no-console
        console.log(resources); // eslint-disable-line no-console
      }
    }
  );

  // HEADER ACTION - BOUND TO A PRODUCT
  plugin.addAction(
    ActionLocation.HEADER,
    { product: ['explorer'] },
    {
      tooltipKey: 'plugin-examples.header-action-two',
      tooltip: 'Test Action2',
      shortcut: 'b',
      icon: 'icon-rancher-desktop',
      enabled(ctx: any) {
        return true;
      },
      invoke(opts: any, resources: any) {
        console.log('action executed 2', this); // eslint-disable-line no-console
        console.log(opts); // eslint-disable-line no-console
        console.log(resources); // eslint-disable-line no-console
      }
    }
  );

  // ADDS TAB TO "ResourceTabs" COMPONENT
  plugin.addTab(
    TabLocation.RESOURCE_DETAIL,
    { resource: ['pod'] },
    {
      name: 'some-name',
      labelKey: 'plugin-examples.tab-label',
      label: 'some-label',
      weight: -5,
      showHeader: true,
      tooltip: 'this is a tooltip message',
      component: () => import('./components/MyTabComponent.vue')
    }
  );

  // TABLE ACTIONS - ROW ACTION
  plugin.addAction(
    ActionLocation.TABLE,
    { resource: ['catalog.cattle.io.clusterrepo'] },
    {
      label: 'some-extension-action',
      labelKey: 'plugin-examples.table-action-one',
      icon: 'icon-pipeline',
      invoke(opts: ActionOpts, values: any[]) {
        console.log('table action executed 1', this, opts, values); // eslint-disable-line no-console
      }
    }
  );

  // TABLE ACTIONS - ROW + BULKABLE
  plugin.addAction(
    ActionLocation.TABLE,
    { resource: ['catalog.cattle.io.clusterrepo'] },
    {
      label: 'some-bulkable-action',
      labelKey: 'plugin-examples.table-action-two',
      icon: 'icon-rancher-desktop',
      multiple: true,
      invoke(opts: ActionOpts, values: any[]) {
        console.log('table action executed 2', this); // eslint-disable-line no-console
        console.log(opts); // eslint-disable-line no-console
        console.log(values); // eslint-disable-line no-console
      },
    }
  );

  // DETAILS VIEW MASTHEAD DATA
  plugin.addPanel(
    PanelLocation.DETAILS_MASTHEAD,
    { resource: ['catalog.cattle.io.clusterrepo'] },
    { component: () => import('./components/MastheadDetailsComponent.vue') }); // component to be rendered

  // DETAILS VIEW MASTHEAD DATA - CONFIG VIEW
  plugin.addPanel(
    PanelLocation.DETAILS_MASTHEAD,
    { resource: ['catalog.cattle.io.clusterrepo'], mode: ['config'] },
    { component: () => import('./components/MastheadDetailsComponentConfig.vue') }); // component to be rendered

  // DETAILS VIEW MASTHEAD DATA - EDIT VIEW
  plugin.addPanel(
    PanelLocation.DETAILS_MASTHEAD,
    { resource: ['catalog.cattle.io.clusterrepo'], mode: ['edit'] },
    { component: () => import('./components/MastheadDetailsComponentEdit.vue') }); // component to be rendered

  // DETAILS VIEW "DetailTop" DATA
  plugin.addPanel(
    PanelLocation.DETAIL_TOP,
    { resource: ['catalog.cattle.io.clusterrepo'] },
    { component: () => import('./components/DetailTopComponent.vue') }); // component to be rendered

  // DATA ABOVE LIST VIEW
  plugin.addPanel(
    PanelLocation.RESOURCE_LIST,
    { resource: ['catalog.cattle.io.app'] },
    { component: () => import('./components/BannerComponent.vue') }); // component to be rendered

  // CLUSTER DASHBOARD CARD
  plugin.addCard(
    CardLocation.CLUSTER_DASHBOARD_CARD,
    { cluster: ['local'] },
    {
      label: 'some-label',
      labelKey: 'plugin-examples.card-title-one',
      component: () => import('./components/MastheadDetailsComponent.vue')
    }
  );

  // CLUSTER DASHBOARD CARD
  plugin.addCard(
    CardLocation.CLUSTER_DASHBOARD_CARD,
    { cluster: ['local'] },
    {
      label: 'some-label1',
      labelKey: 'plugin-examples.card-title-two',
      component: () => import('./components/ClusterDashboardCard.vue')
    }
  );

  // CLUSTER DASHBOARD CARD
  plugin.addCard(
    CardLocation.CLUSTER_DASHBOARD_CARD,
    { cluster: ['local'] },
    {
      label: 'some-label2',
      labelKey: 'plugin-examples.card-title-three',
      component: () => import('./components/MastheadDetailsComponent.vue')
    }
  );

  // Create a column that shows in the configmap and secret tables
  plugin.addTableColumn(
    TableColumnLocation.RESOURCE,
    { resource: ['configmap', 'secret'] },
    { // Column definition used when server-side pagination is DISABLED and ENABLED
      name: 'column-example-1-basic',
      labelKey: 'plugin-examples.table.col-example-1-basic',
      sort: 'id', // Works for both server-side pagination disabled (path on the local instance of the resource) and disabled (path on the server-side instance of the resource)
      search: 'id', // As per sort, this is a path on the local and server-side instance of the resource
      getValue: (row: any) => {
        return `Custom Cell Value: ${row.id}`;
      },
    }
  );

  // Create a column that shows in the pods table. It will present the value of a label ('extension-label) which can be sorted/searched on
  // when server-side pagination is enabled or disabled
  plugin.addTableColumn(
    TableColumnLocation.RESOURCE,
    { resource: ['pod'] },
    { // Column definition used when server-side pagination is DISABLED
      name: 'column-example-2-basic',
      labelKey: 'plugin-examples.table.col-example-2-basic',
      getValue: (row: any) => {
        // This text can be constructed locally in the browser and usable by local sort + search
        return row.metadata.labels["extension-label"] || 'empty';
      },
    },
    { // Column definition used when server-side pagination is ENABLED
      name: 'column-example-2-pagination',
      labelKey: 'plugin-examples.table.col-example-2-pagination',
      // value, sort and search all must be a path to a property in the resource, they cannot be computed locally.
      value: 'metadata.labels.extension-label',
      sort: 'metadata.labels.extension-label',
      search: 'metadata.labels.extension-label',
    }
  );
}
