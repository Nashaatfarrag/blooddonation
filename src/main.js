import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VAnimateCss from "v-animate-css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faUserSecret);
Vue.component("font-awesome-icon", FontAwesomeIcon);
import BootstrapVue from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.use(VAnimateCss);
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
