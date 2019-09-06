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
      <div class="flex top-0 right-0 items-center px-6" v-if="currentUser">
        <router-link to="/submit">
          <button class="bevelButton">
            Submit
          </button>
        </router-link>
        <UserBadge
          :user="currentUser.displayName"
          class="cursor-pointer text-white font-bold h-8 ml-5"
          @click.native="showList = !showList"
        />
        <div
          v-if="showList"
          class="absolute flex justify-center right-0 mr-5 mt-16 w-32 flex px-4 py-2 bg-white rounded-lg shadow"
        >
          <ul>
            <li class="cursor-pointer hover:text-blue-400">Settings</li>
            <li @click="logout" class="cursor-pointer hover:text-blue-400">
              Log out
            </li>
          </ul>
        </div>
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
      currentUser: null,
      showList: false
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(() => {
      this.isLoading = true;
      this.showList = false;
      this.currentUser = firebase.auth().currentUser;
      this.isLoading = false;
    });
  },
  methods: {
    logout() {
      firebase.auth().signOut();
    }
  }
};
</script>
