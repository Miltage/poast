<template>
  <div class="home h-screen">
    <div class="flex flex-col h-full">
      <nav class="flex items-center justify-between flex-wrap bg-teal-500 p-3">
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
            <button class="bevelButton">
              Submit
            </button>
            <button class="bevelButton">
              Login
            </button>
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
      postList: []
    };
  },
  created() {
    this.fetchData();
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
  @apply bg-blue-500 text-white font-bold py-2 px-4 border-b-4 border-blue-700 rounded;
}
.bevelButton:hover {
  @apply bg-blue-400 border-blue-500;
}
.bevelButton:active {
  @apply border-b-0 border-t-4 bg-blue-600 border-blue-700 text-gray-300;
}
.bevelButton:focus {
  @apply outline-none;
}
</style>
