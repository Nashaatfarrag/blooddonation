<template>
  <b-container fluid id="app">
    <b-row class="mainHeader p-2 bg-dark">
      <b-col class="text-center " >بنك دم تطاي</b-col>
    </b-row>
    <b-row id="nav" style="border-bottom:2px solid black" class="justify-content-center">
      <router-link class="btn btn-light m-1" to="/">إعرض المتبرعين</router-link>
      <router-link class="btn btn-light m-1" to="/add">تسجيل متبرع</router-link>
      <router-link class="btn btn-light m-1" to="/adddonation">أضف أخر تبرعا لك</router-link>
      <router-link class="btn btn-light m-1" to="/about">عنا</router-link>
    </b-row>
    <router-view />
  </b-container>
</template>

<style>
@font-face {
  font-family: myFirstFont;
  src: url("./font/HelveticaNeueW23forSKY-Bd.ttf");
}
@font-face {
  font-family: mySecFont;
  src: url("./font/UniversNextArabic-Regular_2.ttf");
}
#app {
  font-family: "Helvetica", Helvetica, Arial, sans-serif;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: whitesmoke;
  color: #2c3e50;
}
#nav {
  padding: 10px;
  font-family: myFirstFont;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #fb4334;
}
.mainHeader {
  font-family: myFirstFont ; 
  color: #F5F5F5 ;
}
</style>
