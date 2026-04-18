import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import VueGtag from 'vue-gtag-next'

import App from './App.vue'

// Lazy-loaded route components for better performance
const DonorsTable = () => import('./pages/DonorsTable.vue')
const AddDonor = () => import('./pages/AddDonor.vue')
const Doctors = () => import('./pages/Doctors.vue')
const Dashboard = () => import('./pages/Dashboard.vue')
const EligibilityChecker = () => import('./pages/EligibilityChecker.vue')
const ShareRequest = () => import('./pages/ShareRequest.vue')
const AuthPage = () => import('./pages/Auth.vue')
const AuditLog = () => import('./pages/AuditLog.vue')

import { supabase } from './utils/auth'

const vuetify = createVuetify({
  components,
  directives,
  rtl: true,
  theme: {
    defaultTheme: 'lightTheme',
    themes: {
      lightTheme: {
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
      },
      darkTheme: {
        dark: true,
        colors: {
          background: '#121212',
          surface: '#1E1E1E',
          primary: '#EF5350',
          'primary-darken-1': '#C62828',
          secondary: '#FF8A80',
          'secondary-darken-1': '#EF5350',
          accent: '#FF8A80',
          error: '#EF5350',
          info: '#42A5F5',
          success: '#66BB6A',
          warning: '#FFCA28',
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
  { path: '/', name: 'Donors', component: DonorsTable, meta: { title: 'المتبرعون', requiresAuth: true } },
  { path: '/add', name: 'AddDonor', component: AddDonor, meta: { title: 'تسجيل متبرع' } },
  { path: '/doctors', name: 'Doctors', component: Doctors, meta: { title: 'دليل الأطباء' } },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { title: 'لوحة المعلومات', requiresAuth: true, requiresAdmin: true } },
  { path: '/eligibility', name: 'Eligibility', component: EligibilityChecker, meta: { title: 'اختبار الأهلية' } },
  { path: '/emergency', name: 'Emergency', component: ShareRequest, meta: { title: 'طلب دم عاجل' } },
  { path: '/audit', name: 'AuditLog', component: AuditLog, meta: { title: 'سجل النشاطات', requiresAuth: true, requiresAdmin: true } },
  { path: '/auth', name: 'Auth', component: AuthPage, meta: { title: 'تسجيل الدخول / الحساب' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard routes requiring auth
router.beforeEach(async (to, from) => {
  console.log(`[Router Guard] Navigating to: ${to.path}`, 'requiresAuth:', to.meta.requiresAuth)
  
  if (to.meta.requiresAuth) {
    if (!supabase) {
      console.warn('[Router Guard] Supabase client is null. Redirecting to /auth')
      return { path: '/auth', query: { redirect: to.fullPath } }
    }
    
    try {
      const { data } = await supabase.auth.getSession()
      console.log('[Router Guard] Session check:', data.session ? 'Valid session found' : 'No session')
      
      if (!data.session) {
        return { path: '/auth', query: { redirect: to.fullPath } }
      }

      // Check for Admin role if route requires it
      if (to.meta.requiresAdmin) {
        const role = data.session.user?.app_metadata?.role
        if (role !== 'admin') {
          console.warn('[Router Guard] Access denied. User is not an admin.')
          return { path: '/' }
        }
      }
    } catch (err) {
      console.error('[Router Guard] Auth check failed:', err)
      return { path: '/auth', query: { redirect: to.fullPath } }
    }
  }
})

// Update page title on route change
router.afterEach((to) => {
  document.title = `${to.meta.title || 'الرئيسية'} — بنك الدم بقرية تطاي`
})

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.use(VueGtag, {
  property: {
    id: 'G-D9DN1V31LJ'
  },
  isEnabled: import.meta.env.PROD
}, router)
app.mount('#app')