<template>
  <div class="flex h-full">
    <div class="flex-1 rounded text-left my-4">
      <!--{{ $route.params.name }}-->
      <template v-for="post in postList">
        <Post :id="post.id" :data="post.data()" v-bind:key="post.id" />
      </template>
    </div>
    <div class="flex-1 text-center m-4">
      <router-view />
    </div>
  </div>
</template>

<script>
import Post from "@/components/Post.vue";
import firebase from "firebase";

export default {
  name: "ChannelBody",
  props: {},
  components: {
    Post
  },
  data() {
    return {
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
      let path = `channels/${this.$route.params.name}/posts`;
      this.postList = [];
      firebase
        .firestore()
        .collection(path)
        .onSnapshot(snapshot => {
          this.postList = snapshot.docs;

          if (snapshot.empty) {
            // nothing here yet
            return;
          }
        });
    }
  }
};
</script>
