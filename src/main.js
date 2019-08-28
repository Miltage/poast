import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import firebase from "firebase";

Vue.config.productionTip = false;

const firebaseConfig = require("../firebase.config.json");

firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
