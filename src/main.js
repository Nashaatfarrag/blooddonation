import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VAnimateCss from "v-animate-css";
import VueSweetalert2 from "vue-sweetalert2";
import Clipboard from "v-clipboard";
// import BootstrapVue from "bootstrap-vue";

// If you don't need the styles, do not connect
import "sweetalert2/dist/sweetalert2.min.css";

import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText,
} from "@fortawesome/vue-fontawesome";

import vuetify from "./plugins/vuetify";
import VueGtag from "vue-gtag";

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("font-awesome-layers", FontAwesomeLayers);
Vue.component("font-awesome-layers-text", FontAwesomeLayersText);

Vue.use(Clipboard);
Vue.use(VueSweetalert2);
let x = {};
if (process.env.NODE_ENV === "production") {
  x = {
    id: "UA-146314933-1",
    router,
  };
}

Vue.use(VueGtag, {
  config: x,
});
// Vue.use(VueAnalytics, x);

// Vue.use(BootstrapVue);
Vue.use(VAnimateCss);
Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
