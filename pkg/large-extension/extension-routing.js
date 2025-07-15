// ./routing/extension-routing.ts
// definition of a "blank cluster" in Rancher Dashboard
import MyCustomPage from './NewFeature.vue';

const BLANK_CLUSTER = '_';

// to achieve naming consistency throughout the extension
// we recommend this to be defined on a config file and exported
// so that the developer can import it wherever it needs to be used
const NAME = 'large-extension';

const routes = [
  // this covers the "custom page"
  {
    name:      `${ NAME }-c-cluster`,
    path:      `/${ NAME }/c/:cluster`,
    component: MyCustomPage,
    meta:      {
      product: NAME,
      cluster: BLANK_CLUSTER
    },
  }
];

export default routes;
