<template>
  <nav
    class="flex items-center justify-between flex-wrap bg-teal-500 py-2 px-3"
  >
    <div class="flex items-center flex-shrink-0 text-white mr-6">
      <svg
        class="fill-current h-8 w-8 mr-2"
        width="54"
        height="54"
        viewBox="0 0 54 54"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"
        />
      </svg>
      <router-link to="/"
        ><span class="font-semibold text-xl tracking-tight"
          >Spread Eagle</span
        ></router-link
      >
    </div>
    <div class="text-sm flex-grow">
      <!-- <a href="#responsive-header" class="inline-block text-teal-200 hover:text-white mr-4">
        Docs
      </a>
      <a href="#responsive-header" class="inline-block text-teal-200 hover:text-white mr-4">
        Examples
      </a>
      <a href="#responsive-header" class="inline-block text-teal-200 hover:text-white">
        Blog
      </a> -->
    </div>
    <div v-if="!isLoading">
      <div class="flex items-center px-6" v-if="currentUser">
        <router-link to="/submit">
          <button class="bevelButton">
            Submit
          </button>
        </router-link>
        <!-- <img
          class="block mx-0 flex-shrink-0 h-8 rounded-full ml-5"
          src="https://randomuser.me/api/portraits/women/17.jpg"
          alt="Avatar"
        />
        <div class="flex items-center text-white font-bold text-left">
          <p class="text-lg leading-tight m-3">Username</p>
          <div
            class="text-white bg-purple-500 border border-purple-500 text-xs font-semibold rounded p-1 leading-normal"
          >
            4,383
          </div>
        </div> -->
        <UserBadge
          :user="currentUser.name"
          class="text-white font-bold h-8 ml-5"
        />
      </div>
      <router-link to="/login" v-if="!currentUser">
        <button class="bevelButton">
          Login
        </button>
      </router-link>
    </div>
  </nav>
</template>

<script>
import UserBadge from "@/components/UserBadge.vue";
import firebase from "firebase";

export default {
  name: "navbar",
  components: {
    UserBadge
  },
  data() {
    return {
      isLoading: true,
      currentUser: null
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(() => {
      this.currentUser = firebase.auth().currentUser;
      firebase
        .firestore()
        .collection("users")
        .where("uid", "==", this.currentUser.uid)
        .get()
        .then(snapshot => {
          this.currentUser.name = snapshot.docs[0].id;
          this.isLoading = false;
        });
    });
  }
};
</script>
