<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" v-if="drawer" absolute right temporary>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item to="/">
            <v-list-item-title>الرئيسية</v-list-item-title>
          </v-list-item>

          <v-list-item to="/add">
            <v-list-item-title>تسجيل متبرع</v-list-item-title>
          </v-list-item>
          <v-list-item to="/adddonation">
            <v-list-item-title>أضف أخر تبرعا لك</v-list-item-title>
          </v-list-item>


          <v-list-item to="/about">
            <v-list-item-title>عنا</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>


    <v-main>
          <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>
      <!-- <div id="particles-js">
        <router-view />
      </div> -->
      <router-view></router-view>
    </v-main>

    <v-footer>
      <v-row>
        <v-col class="text-center">
          <a href="mailto:nashaatfarrag@gmail.com">
            <v-icon color="primary">mdi-mail</v-icon>
          </a>
          &copy; Copyright 2022
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  mounted() {
    this.$vuetify.rtl = true;
  },

  data: () => ({
    group: null,
    drawer: false,
    //
  }),
};
</script>

<style>
/* *{
  border : 1px red solid ;
} */

#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;

  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
}
@font-face {
  font-family: myFirstFont;
  src: url("./font/HelveticaNeueW23forSKY-Bd.ttf");
}
@font-face {
  font-family: mySecFont;
  src: url("./font/UniversNextArabic-Regular_2.ttf");
}
/* #main {
  background-color: whitesmoke;
} */
#main {
  font-family: "Helvetica", Helvetica, Arial, sans-serif;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  /* color: #2c3e50; */
}

/* #nav a {
  font-weight: bold;
  color: #2c3e50;
} */

/* #nav a.router-link-exact-active {
  color: #fb4334;
} */
.mainHeader {
  font-family: myFirstFont;
  /* color: #f5f5f5; */
}
</style>
