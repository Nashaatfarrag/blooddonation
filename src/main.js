import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import VueGtag from 'vue-gtag-next'

import App from './App.vue'
import DonorsTable from './pages/DonorsTable.vue'
import AddDonor from './pages/AddDonor.vue'

const vuetify = createVuetify({
  components,
  directives,
  rtl: true,
  theme: {
    defaultTheme: 'light'
  }
})

const routes = [
  { path: '/', name: 'Donors', component: DonorsTable },
  { path: '/add', name: 'Add Donor', component: AddDonor }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.use(VueGtag, {
  property: {
    id: 'G-D9DN1V31LJ'
  },
  isEnabled: import.meta.env.PROD // Only enable in production
}, router)
app.mount('#app')