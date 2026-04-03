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
import Doctors from './pages/Doctors.vue'

const vuetify = createVuetify({
  components,
  directives,
  rtl: true,
  theme: {
    defaultTheme: 'bloodTheme',
    themes: {
      bloodTheme: {
        dark: false,
        colors: {
          background: '#FAFAFA',
          surface: '#FFFFFF',
          primary: '#C62828',
          'primary-darken-1': '#8E0000',
          secondary: '#EF5350',
          'secondary-darken-1': '#B71C1C',
          accent: '#FF8A80',
          error: '#D32F2F',
          info: '#1565C0',
          success: '#2E7D32',
          warning: '#F9A825',
        }
      }
    }
  },
  defaults: {
    VBtn: {
      rounded: 'lg',
    },
    VCard: {
      rounded: 'xl',
      elevation: 2,
    },
    VTextField: {
      rounded: 'lg',
      variant: 'outlined',
    },
    VSelect: {
      rounded: 'lg',
      variant: 'outlined',
    },
  }
})

const routes = [
  { path: '/', name: 'Donors', component: DonorsTable },
  { path: '/add', name: 'Add Donor', component: AddDonor },
  { path: '/doctors', name: 'Doctors', component: Doctors }
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