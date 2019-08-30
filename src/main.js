import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import firebase from "firebase";

Vue.config.productionTip = false;
Vue.use(require("vue-moment"));

const firebaseConfig = require("../firebase.config.json");

firebase.initializeApp(firebaseConfig);

/*firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  console.log(errorCode, errorMessage);
  // ...
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    console.log(isAnonymous, uid);
    // ...
  } else {
    // User is signed out.
    // ...
  }
  // ...
});*/

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
