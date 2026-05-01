<template>
  <v-app dir="rtl">
    <v-app-bar elevation="0" class="app-bar-gradient">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="hidden-lg-and-up" color="white"></v-app-bar-nav-icon>
      
      <div class="d-flex align-center">
        <v-icon size="32" color="white" class="me-2">mdi-water</v-icon>
        <v-app-bar-title class="font-weight-bold text-h5 text-white">
          بنك الدم لقرية تطاي
        </v-app-bar-title>
      </div>
      
      <v-spacer></v-spacer>
      
      <!-- Desktop Navigation -->
      <div class="d-none d-lg-flex ga-2 align-center">
        <v-btn 
          v-for="item in filteredNavItems" :key="item.path"
          :to="item.path" 
          variant="flat"
          :class="$route.path === item.path ? 'nav-btn-active' : 'nav-btn'"
          rounded="pill"
          class="px-5"
          size="small"
        >
          <v-icon start size="18">{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>

        <!-- Auth Button -->
        <div v-if="session" class="d-flex align-center ms-2 ga-2">
          <v-chip
            to="/profile"
            color="white"
            variant="outlined"
            size="small"
            class="font-weight-bold px-3 nav-chip"
          >
            <v-icon start size="16">mdi-account-circle</v-icon>
            {{ session.user.user_metadata?.full_name || session.user.email }}
          </v-chip>
          <v-btn
            @click="handleLogout"
            variant="tonal"
            color="white"
            rounded="pill"
            class="px-5"
            size="small"
          >
            <v-icon start size="18">mdi-logout</v-icon>
            خروج
          </v-btn>
        </div>
        <v-btn
          v-else
          to="/auth"
          variant="tonal"
          color="white"
          rounded="pill"
          class="px-5 ms-2"
          size="small"
        >
          <v-icon start size="18">mdi-login</v-icon>
          دخول
        </v-btn>
      </div>
      
      <!-- Dark Mode Toggle -->
      <v-btn 
        icon 
        variant="text" 
        color="white" 
        @click="toggleDarkMode"
        class="ms-2"
        :aria-label="isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'"
      >
        <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer 
      v-model="drawer" 
      temporary
      class="hidden-lg-and-up"
    >
      <div class="drawer-header pa-6">
        <v-icon size="48" color="white">mdi-water</v-icon>
        <h3 class="text-white mt-2">بنك الدم لقرية تطاي</h3>
        <div v-if="session" class="mt-2 text-white d-flex align-center" style="opacity: 0.9;" @click="$router.push('/profile')">
          <v-icon size="18" class="me-2 text-white">mdi-account-circle</v-icon>
          <span class="text-body-2 font-weight-bold" style="cursor: pointer;">{{ session.user.user_metadata?.full_name || session.user.email }}</span>
        </div>
      </div>
      <v-list class="mt-2">
        <v-list-item 
          v-for="item in filteredNavItems" :key="item.path"
          :to="item.path"
          :active="$route.path === item.path"
          @click="drawer = false"
          class="mb-1 mx-2"
          rounded="lg"
          color="primary"
        >
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title class="font-weight-bold">{{ item.title }}</v-list-item-title>
          <v-list-item-subtitle v-if="item.subtitle" class="text-caption">{{ item.subtitle }}</v-list-item-subtitle>
        </v-list-item>

        <v-divider class="my-2"></v-divider>

        <v-list-item
          v-if="session"
          @click="drawer = false; handleLogout()"
          class="mb-1 mx-2 text-error"
          rounded="lg"
        >
          <template v-slot:prepend><v-icon color="error">mdi-logout</v-icon></template>
          <v-list-item-title class="font-weight-bold">تسجيل الخروج</v-list-item-title>
        </v-list-item>
        <v-list-item
          v-else
          to="/auth"
          @click="drawer = false"
          class="mb-1 mx-2"
          rounded="lg"
          color="primary"
        >
          <template v-slot:prepend><v-icon>mdi-login</v-icon></template>
          <v-list-item-title class="font-weight-bold">تسجيل الدخول</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    
    <v-main class="main-bg">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" @show-toast="showToast" />
        </transition>
      </router-view>
    </v-main>

    <!-- Footer -->
    <v-footer class="footer-gradient text-center d-flex flex-column pa-4">
      <div class="text-white text-body-2 opacity-80">
        <v-icon size="16" class="me-1">mdi-heart-pulse</v-icon>
        تبرعك بالدم ينقذ حياة
      </div>
    </v-footer>

    <!-- Global Toast Notifications -->
    <v-snackbar
      v-model="toast.show"
      :color="toast.color"
      :timeout="toast.timeout"
      location="top"
      rounded="lg"
    >
      <div class="d-flex align-center">
        <v-icon class="me-2">{{ toast.icon }}</v-icon>
        {{ toast.message }}
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="toast.show = false" icon="mdi-close" size="small"></v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { useTheme } from 'vuetify'
import { getSession, onAuthStateChange, logout, logAudit } from '@/utils/auth'

export default {
  setup() {
    const theme = useTheme()
    return { theme }
  },
  name: 'App',
  data() {
    return {
      drawer: false,
      isDark: false,
      session: null,
      isAdmin: false,
      authListenerUnsubscribe: null,
      toast: {
        show: false,
        message: '',
        color: 'success',
        icon: 'mdi-check-circle',
        timeout: 3000
      },
      navItems: [
        { path: '/emergency', title: 'طلب دم عاجل', icon: 'mdi-alert-circle', subtitle: 'طلب تبرع طارئ' },
        { path: '/', title: 'المتبرعون', icon: 'mdi-account-multiple', subtitle: 'قائمة المتبرعين' },
        { path: '/add', title: 'تسجيل متبرع', icon: 'mdi-plus-circle', subtitle: 'إضافة متبرع جديد' },
        { path: '/eligibility', title: 'اختبار الأهلية', icon: 'mdi-clipboard-check', subtitle: 'هل يمكنك التبرع؟' },
        { path: '/doctors', title: 'دليل الأطباء', icon: 'mdi-doctor', subtitle: 'بيانات الأطباء' },
        { path: '/profile', title: 'الملف الشخصي', icon: 'mdi-account-cog', subtitle: 'إعدادات الحساب', authOnly: true },
        { path: '/dashboard', title: 'لوحة المعلومات', icon: 'mdi-chart-pie', subtitle: 'إحصائيات وتحليلات', adminOnly: true },
        { path: '/audit', title: 'سجل النشاطات', icon: 'mdi-history', subtitle: 'مراقبة النظام', adminOnly: true }
      ]
    }
  },
  computed: {
    filteredNavItems() {
      return this.navItems.filter(item => {
        if (item.adminOnly && !this.isAdmin) return false
        if (item.authOnly && !this.session) return false
        return true
      })
    }
  },
  mounted() {
    // Restore dark mode preference
    const savedTheme = localStorage.getItem('blood-theme')
    if (savedTheme === 'dark') {
      this.isDark = true
      this.applyTheme()
    }
    
    this.initAuth()
  },
  unmounted() {
    if (this.authListenerUnsubscribe) {
      this.authListenerUnsubscribe()
    }
  },
  methods: {
    async initAuth() {
      this.session = await getSession()
      this.checkAdminLog(this.session)
      
      this.authListenerUnsubscribe = onAuthStateChange((event, session) => {
        this.session = session
        this.checkAdminLog(session)
      })
    },
    checkAdminLog(session) {
      if (session && session.user?.app_metadata?.role === 'admin') {
        this.isAdmin = true
        console.log('👑 Welcome Admin! Full access granted.')
      } else {
        this.isAdmin = false
      }
    },
    async handleLogout() {
      await logout()
      this.showToast({ message: 'تم تسجيل الخروج بنجاح', color: 'info' })
      if (this.$route.meta.requiresAuth || this.$route.meta.requiresAdmin) {
        this.$router.push('/')
      }
    },
    toggleDarkMode() {
      this.isDark = !this.isDark
      localStorage.setItem('blood-theme', this.isDark ? 'dark' : 'light')
      this.applyTheme()
    },
    applyTheme() {
      this.theme.global.name.value = this.isDark ? 'darkTheme' : 'lightTheme'
    },
    showToast({ message, color = 'success', icon = 'mdi-check-circle', timeout = 3000 }) {
      this.toast = { show: true, message, color, icon, timeout }
    }
  }
}
</script>

<style>
.app-bar-gradient {
  background: linear-gradient(135deg, #C62828 0%, #8E0000 100%) !important;
}

.drawer-header {
  background: linear-gradient(135deg, #C62828 0%, #8E0000 100%);
}

.footer-gradient {
  background: linear-gradient(135deg, #C62828 0%, #8E0000 100%) !important;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.15) !important;
  color: white !important;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3) !important;
}

.nav-chip {
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-chip:hover {
  background: rgba(255, 255, 255, 0.2) !important;
}

.nav-btn-active {
  background: white !important;
  color: #C62828 !important;
  font-weight: 700;
}

.main-bg {
  background: linear-gradient(180deg, #fef2f2 0%, #fafafa 30%);
  min-height: 100vh;
}

.v-theme--darkTheme .main-bg {
  background: linear-gradient(180deg, #1a1a1a 0%, #121212 30%);
}

/* Route transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* Smooth scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(198, 40, 40, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(198, 40, 40, 0.5);
}
</style>