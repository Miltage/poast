<template>
  <div class="home h-screen">
    <div class="flex flex-col h-full">
      <NavBar />
      <div class="flex overflow-hidden h-full">
        <ul
          class="flex-initial w-48 rounded overflow-y-scroll bg-white text-center m-4"
        >
          <template v-for="channel in channelList">
            <Channel :name="channel.id" v-bind:key="channel.id" />
          </template>
        </ul>
        <div class="flex-1 bg-white rounded overflow-y-scroll text-left my-4">
          <template v-for="post in postList">
            <Post :id="post.id" :data="post.data()" v-bind:key="post.id" />
          </template>
        </div>
        <div class="flex-1 text-center m-4 overflow-y-scroll">
          <PostBody />
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
import NavBar from "@/components/NavBar.vue";
import firebase from "firebase";

export default {
  name: "home",
  components: {
    Channel,
    Post,
    PostBody,
    NavBar
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
      //console.log(this.currentUser);
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
