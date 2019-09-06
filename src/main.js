import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import firebase from "firebase";
import AsyncComputed from "vue-async-computed";

Vue.config.productionTip = false;
Vue.use(require("vue-moment"));
Vue.use(AsyncComputed);

const firebaseConfig = require("../firebase.config.json");

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(() => {
  new Vue({
    router,
    render: h => h(App)
  }).$mount("#app");
});
