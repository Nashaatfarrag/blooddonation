import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VAnimateCss from "v-animate-css";

import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

import BootstrapVue from "bootstrap-vue";


Vue.use(BootstrapVue);
Vue.use(VAnimateCss);
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
