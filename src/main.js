// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

// Add global components
import DefaultLayout from "~/layouts/default/Default.vue";

// Import Bootstrap plugins
import { BootstrapVue } from "bootstrap-vue";

import './assets/style/bootstrap.scss'

// Import global styles
import "~/assets/style/index.scss";

export default function(Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component("Layout", DefaultLayout);
  Vue.use( BootstrapVue );
}
