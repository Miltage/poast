import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import firebase from "firebase";

Vue.config.productionTip = false;
Vue.use(require("vue-moment"));

const firebaseConfig = require("../firebase.config.json");

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(() => {
  new Vue({
    router,
    render: h => h(App)
  }).$mount("#app");

  let user = firebase.auth().currentUser;
  if (user != null && user.displayName == null) {
    firebase
      .firestore()
      .collection("users")
      .where("uid", "==", user.uid)
      .get()
      .then(snapshot => {
        let name = snapshot.docs[0].id;
        user.updateProfile({
          displayName: name,
          photoURL: "https://example.com/jane-q-user/profile.jpg"
        });
      });
  }
});
