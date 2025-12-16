import { createApp } from "vue";
import 'vuetify/styles'
import App from "./App.vue";
import router from "./router";
import VAnimateCss from "v-animate-css";
import VueSweetalert2 from "vue-sweetalert2";
import clipboardPlugin from "./plugins/clipboard";

// If you don't need the styles, do not connect
import "sweetalert2/dist/sweetalert2.min.css";

import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText,
} from "@fortawesome/vue-fontawesome";

import vuetify from "./plugins/vuetify";
import { createGtag } from "vue-gtag";

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.component("font-awesome-layers", FontAwesomeLayers);
app.component("font-awesome-layers-text", FontAwesomeLayersText);

app.use(clipboardPlugin);
app.use(VueSweetalert2);

app.use(createGtag, {
  config: {
    id: "G-D9DN1V31LJ",
  },
});

app.use(VAnimateCss);
app.use(router);
app.use(vuetify);

app.mount("#app");
