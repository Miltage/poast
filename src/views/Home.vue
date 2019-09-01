<template>
  <div class="home h-screen">
    <div class="flex flex-col h-full">
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
        <div class="w-auto block flex-grow flex items-center">
          <div class="text-sm flex-grow">
            <!--<a href="#responsive-header" class="inline-block text-teal-200 hover:text-white mr-4">
              Docs
            </a>
            <a href="#responsive-header" class="inline-block text-teal-200 hover:text-white mr-4">
              Examples
            </a>
            <a href="#responsive-header" class="inline-block text-teal-200 hover:text-white">
              Blog
            </a>-->
          </div>
          <div>
            <div class="flex items-center px-6" v-if="currentUser">
              <button class="bevelButton">
                Submit
              </button>
              <img
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
              </div>
            </div>
            <router-link to="/login" v-if="!currentUser">
              <button class="bevelButton">
                Login
              </button>
            </router-link>
          </div>
        </div>
      </nav>

      <div class="flex overflow-hidden h-full">
        <ul
          class="flex-initial w-48 rounded overflow-y-scroll bg-white text-center m-4"
        >
          <template v-for="channel in channelList">
            <channel :name="channel.id" v-bind:key="channel.id" />
          </template>
        </ul>
        <div class="flex-1 bg-white rounded overflow-y-scroll text-left my-4">
          <template v-for="post in postList">
            <post :id="post.id" :data="post.data()" v-bind:key="post.id" />
          </template>
        </div>
        <div class="flex-1 text-center m-4 overflow-y-scroll">
          <postBody />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Channel from "@/components/Channel.vue";
import Post from "@/components/Post.vue";
import PostBody from "@/components/PostBody.vue";
import firebase from "firebase";

export default {
  name: "home",
  components: {
    channel: Channel,
    post: Post,
    postBody: PostBody
  },
  data() {
    return {
      channelList: [],
      postList: [],
      currentUser: null
    };
  },
  created() {
    this.fetchData();
    firebase.auth().onAuthStateChanged(() => {
      this.currentUser = firebase.auth().currentUser;
      console.log(this.currentUser);
    });
  },
  watch: {
    // call again the method if the route changes
    $route: "fetchData"
  },
  methods: {
    fetchData() {
      firebase
        .firestore()
        .collection("channels")
        .onSnapshot(snapshot => {
          this.channelList = snapshot.docs;
        });

      if (this.$route.params.name) {
        firebase
          .firestore()
          .collection("posts")
          .where("channels", "array-contains", this.$route.params.name)
          .onSnapshot(snapshot => {
            this.postList = snapshot.docs;
          });
      }
    }
  }
};
</script>

<style>
.bevelButton {
  @apply bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow;
}
.bevelButton:hover {
  @apply bg-gray-100;
}
.bevelButton:active {
  @apply bg-gray-300;
}
.bevelButton:focus {
  @apply outline-none;
}
</style>
