<template>
  <div class="home h-screen">
    <div class="flex h-full">
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
      <div class="flex-1 text-center m-4">
        <postBody />
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
