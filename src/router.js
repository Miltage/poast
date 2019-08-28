import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import ChannelBody from "./components/ChannelBody.vue";
import PostBody from "./components/PostBody.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/channel/:name",
      component: Home,
      children: [
        {
          path: "",
          component: ChannelBody
        }
      ]
    },
    {
      path: "/channel/:name/:id",
      component: Home,
      children: [
        {
          path: "",
          component: ChannelBody,
          children: [
            {
              path: "",
              component: PostBody
            }
          ]
        }
      ]
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
