import MyCustomPage from '../pages/myCustomPage.vue';

const BLANK_CLUSTER = '_';
// to achieve naming consistency throughout the extension
// we recommend this to be defined on a config file and exported
// so that the developer can import it wherever it needs to be used
const YOUR_PRODUCT_NAME = 'shell-api-demo';
const CUSTOM_PAGE_NAME = 'demo-page';

const routes = [
  // this covers the "custom page"
  {
    name:      `${ YOUR_PRODUCT_NAME }-c-cluster-${ CUSTOM_PAGE_NAME }`,
    path:      `/${ YOUR_PRODUCT_NAME }/c/:cluster/${ CUSTOM_PAGE_NAME }`,
    component: MyCustomPage,
    meta:      {
      product: YOUR_PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  }
];

export default routes;
