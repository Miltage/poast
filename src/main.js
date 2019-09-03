import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import firebase from "firebase";

Vue.config.productionTip = false;
Vue.use(require("vue-moment"));

const firebaseConfig = require("../firebase.config.json");

firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

firebase.auth().onAuthStateChanged(() => {
  let user = firebase.auth().currentUser;
  if (user == null) Vue.prototype.$globalUser = null;
  else
    firebase
      .firestore()
      .collection("users")
      .where("uid", "==", user.uid)
      .get()
      .then(snapshot => {
        user.name = snapshot.docs[0].id;
        Vue.prototype.$globalUser = user.name;
      });
});
