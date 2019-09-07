<template>
  <div class="flex overflow-hidden h-full">
    <ul
      id="channel-nav"
      class="flex-initial w-48 shadow rounded overflow-y-scroll bg-white text-center m-4"
    >
      <template v-for="channel in channelList">
        <Channel :name="channel.id" v-bind:key="channel.id" />
      </template>
    </ul>
    <div
      class="flex-1 bg-white shadow rounded overflow-y-scroll text-left my-4"
    >
      <template v-for="post in postList">
        <Post :id="post.id" :data="post.data()" v-bind:key="post.id" />
      </template>
    </div>
    <div id="post-body" class="flex-1 shadow text-center m-4 overflow-y-scroll">
      <PostBody />
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
    Channel,
    Post,
    PostBody
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
          .orderBy("score", "desc")
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

#channel-nav {
  min-width: 120px;
}

#post-body {
  min-width: 400px;
  max-width: 600px;
}
</style>
