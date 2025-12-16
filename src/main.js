import { createApp, h } from 'vue'
import App from './App.vue'
import router from './router'
import VAnimateCss from "v-animate-css";

// If you don't need the styles, do not connect
import "sweetalert2/dist/sweetalert2.min.css";

import vuetify from './plugins/vuetify'
import 'vuetify/styles'

const app = createApp(App)

app.use(VAnimateCss)
app.use(router)
app.use(vuetify)

app.mount('#app')
