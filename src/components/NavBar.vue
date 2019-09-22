<template>
  <nav
    class="flex items-center justify-between flex-wrap bg-teal-500 py-2 px-3 z-10"
  >
    <div class="flex items-center flex-shrink-0 text-white mr-6">
      <svg
        class="fill-current h-8 w-8 mr-1"
        width="54"
        height="54"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 5.918c1.357 0 2.634.53 3.594 1.49 1.98 1.98 1.98 5.204 0 7.185-.96.96-2.237 1.49-3.594 1.49s-2.634-.53-3.594-1.49c-1.98-1.98-1.98-5.205 0-7.186.96-.96 2.237-1.49 3.594-1.49M11 1c-2.56 0-5.12.976-7.07 2.93-3.906 3.904-3.906 10.236 0 14.14C5.88 20.024 8.44 21 11 21s5.12-.976 7.07-2.93c3.906-3.904 3.906-10.236 0-14.14C16.12 1.976 13.56 1 11 1z"
        />
      </svg>
      <router-link to="/"
        ><span class="font-semibold text-xl tracking-tight"
          >Poast</span
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
          size="w-10 h-10"
          class="cursor-pointer text-white font-bold h-8 ml-5"
          @click.native="showList = !showList"
        />
        <div
          v-if="showList"
          @click="showList = false"
          class="absolute flex justify-center right-0 mr-5 mt-16 w-32 flex px-4 py-2 bg-white rounded-lg shadow"
        >
          <ul>
            <router-link :to="/user/ + currentUser.displayName"
              ><li class="cursor-pointer hover:text-blue-400">
                Profile
              </li></router-link
            >
            <router-link to="/settings"
              ><li class="cursor-pointer hover:text-blue-400">
                Settings
              </li></router-link
            >
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

      if (this.currentUser != null && this.currentUser.displayName == null) {
        firebase
          .firestore()
          .collection("users")
          .where("uid", "==", this.currentUser.uid)
          .get()
          .then(snapshot => {
            let name = snapshot.docs[0].id;
            this.currentUser
              .updateProfile({
                displayName: name,
                photoURL: "https://example.com/jane-q-user/profile.jpg"
              })
              .then(() => {
                console.log("updated");
                this.currentUser = firebase.auth().currentUser;
                this.isLoading = false;
              });
          });
      } else this.isLoading = false;
    });
  },
  methods: {
    logout() {
      firebase.auth().signOut();
    }
  }
};
</script>
