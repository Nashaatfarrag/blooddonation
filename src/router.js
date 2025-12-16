import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Add from "./components/Add.vue";
import addDonation from "./components/AddDonation.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/about",
    name: "about",
    component: () => import(/* webpackChunkName: "about" */ "./views/About.vue"),
  },
  {
    path: "/add",
    name: "Add",
    component: Add,
  },
  {
    path: "/adddonation",
    name: "addDonation",
    component: addDonation,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

export default createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
