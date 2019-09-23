import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Logout from "./views/Logout.vue";
import Submit from "./views/Submit.vue";
import Register from "./views/Register.vue";
import Settings from "./views/Settings.vue";
import Profile from "./views/Profile.vue";
import Featured from "./views/Featured.vue";

import firebase from "firebase";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/featured",
      name: "featured",
      component: Featured
    },
    {
      path: "/submit",
      component: Submit,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/channel/:name",
      component: Home
    },
    {
      path: "/channel/:name/:id",
      component: Home
    },
    {
      path: "/user/:name",
      component: Profile
    },
    {
      path: "/user/:name/:id",
      component: Profile
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/logout",
      name: "logout",
      component: Logout
    },
    {
      path: "/register",
      name: "register",
      component: Register
    },
    {
      path: "/settings",
      name: "settings",
      component: Settings
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next("login");
  else next();
});

export default router;
