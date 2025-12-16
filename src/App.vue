<template>
  <v-app dir="rtl">
    <v-app-bar color="primary" elevation="4">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="hidden-md-and-up"></v-app-bar-nav-icon>
      <v-app-bar-title class="font-weight-bold text-h5">نظام التبرع بالدم</v-app-bar-title>
      <v-spacer></v-spacer>
      
      <!-- Desktop Navigation -->
      <div class="d-none d-md-flex gap-2">
        <v-btn 
          to="/" 
          variant="elevated"
          color="white"
          :active="$route.path === '/'"
          class="px-6"
        >
          <v-icon start>mdi-account-multiple</v-icon>
          المتبرعون
        </v-btn>
        <v-btn 
          to="/add" 
          variant="elevated"
          color="success"
          :active="$route.path === '/add'"
          class="px-6"
        >
          <v-icon start>mdi-plus-circle</v-icon>
          تسجيل متبرع
        </v-btn>
      </div>
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer 
      v-model="drawer" 
      temporary
      class="hidden-md-and-up"
    >
      <v-list>
        <v-list-item 
          to="/"
          :active="$route.path === '/'"
          @click="drawer = false"
          class="mb-2"
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
        >
          <template v-slot:prepend>
            <v-icon>mdi-plus-circle</v-icon>
          </template>
          <v-list-item-title class="font-weight-bold">تسجيل متبرع</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    
    <v-main>
      <router-view></router-view>
    </v-main>
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