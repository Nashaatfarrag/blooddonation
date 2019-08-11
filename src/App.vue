<template>
  <div id="app">
    <div id="nav">
      <router-link class="btn btn-light m-1" to="/">إعرض المتبرعين</router-link>
      <router-link class="btn btn-light m-1" to="/add">تسجيل متبرع</router-link>
      <router-link class="btn btn-light m-1" to="/adddonation">أضف تبرعا</router-link>
      <router-link class="btn btn-light m-1" to="/about">عنا</router-link>
    </div>
    <router-view />
  </div>
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
  padding: 30px;
  font-family: myFirstFont;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #fb4334;
}
</style>
