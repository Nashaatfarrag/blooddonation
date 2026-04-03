<template>
  <v-app dir="rtl">
    <v-app-bar elevation="0" class="app-bar-gradient">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="hidden-md-and-up" color="white"></v-app-bar-nav-icon>
      
      <div class="d-flex align-center">
        <v-icon size="32" color="white" class="me-2">mdi-water</v-icon>
        <v-app-bar-title class="font-weight-bold text-h5 text-white">
          نظام التبرع بالدم
        </v-app-bar-title>
      </div>
      
      <v-spacer></v-spacer>
      
      <!-- Desktop Navigation -->
      <div class="d-none d-md-flex ga-3">
        <v-btn 
          to="/" 
          variant="flat"
          :class="$route.path === '/' ? 'nav-btn-active' : 'nav-btn'"
          rounded="pill"
          class="px-6"
        >
          <v-icon start>mdi-account-multiple</v-icon>
          المتبرعون
        </v-btn>
        <v-btn 
          to="/add" 
          variant="flat"
          :class="$route.path === '/add' ? 'nav-btn-active' : 'nav-btn'"
          rounded="pill"
          class="px-6"
        >
          <v-icon start>mdi-plus-circle</v-icon>
          تسجيل متبرع
        </v-btn>
        <v-btn 
          to="/doctors" 
          variant="flat"
          :class="$route.path === '/doctors' ? 'nav-btn-active' : 'nav-btn'"
          rounded="pill"
          class="px-6"
        >
          <v-icon start>mdi-doctor</v-icon>
          دليل الأطباء
        </v-btn>
      </div>
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer 
      v-model="drawer" 
      temporary
      class="hidden-md-and-up"
    >
      <div class="drawer-header pa-6">
        <v-icon size="48" color="white">mdi-water</v-icon>
        <h3 class="text-white mt-2">نظام التبرع بالدم</h3>
      </div>
      <v-list class="mt-2">
        <v-list-item 
          to="/"
          :active="$route.path === '/'"
          @click="drawer = false"
          class="mb-1 mx-2"
          rounded="lg"
          active-color="primary"
        >
          <template v-slot:prepend>
            <v-icon>mdi-account-multiple</v-icon>
          </template>
          <v-list-item-title class="font-weight-bold">المتبرعون</v-list-item-title>
        </v-list-item>

        <v-list-item 
          to="/add"
          :active="$route.path === '/add'"
          @click="drawer = false"
          class="mx-2 mb-1"
          rounded="lg"
          active-color="primary"
        >
          <template v-slot:prepend>
            <v-icon>mdi-plus-circle</v-icon>
          </template>
          <v-list-item-title class="font-weight-bold">تسجيل متبرع</v-list-item-title>
        </v-list-item>

        <v-list-item 
          to="/doctors"
          :active="$route.path === '/doctors'"
          @click="drawer = false"
          class="mx-2"
          rounded="lg"
          active-color="primary"
        >
          <template v-slot:prepend>
            <v-icon>mdi-doctor</v-icon>
          </template>
          <v-list-item-title class="font-weight-bold">دليل الأطباء</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    
    <v-main class="main-bg">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
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
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      drawer: false
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

.nav-btn-active {
  background: white !important;
  color: #C62828 !important;
  font-weight: 700;
}

.main-bg {
  background: linear-gradient(180deg, #fef2f2 0%, #fafafa 30%);
  min-height: 100vh;
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
</style>