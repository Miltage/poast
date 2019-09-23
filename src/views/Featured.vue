<template>
  <div class="flex">
    <div class="flex flex-col ml-5 mt-5">
      <PostCard
        v-for="post in column1"
        :data="post.data()"
        v-bind:key="post.id"
      />
    </div>
    <div class="flex flex-col m-5 mb-0">
      <PostCard
        v-for="post in column2"
        :data="post.data()"
        v-bind:key="post.id"
      />
    </div>
    <div class="flex flex-col mr-5 mt-5">
      <PostCard
        v-for="post in column3"
        :data="post.data()"
        v-bind:key="post.id"
      />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import PostCard from "@/components/PostCard.vue";
import firebase from "firebase";

export default {
  name: "home",
  components: {
    PostCard
  },
  data() {
    return {
      column1: [],
      column2: [],
      column3: []
    };
  },
  created() {
    this.fetchPosts();
  },
  watch: {
    // call again the method if the route changes
    $route: "fetchPosts"
  },
  methods: {
    fetchPosts() {
      firebase
        .firestore()
        .collection("posts")
        .orderBy("created", "desc")
        .limit(18)
        .onSnapshot(snapshot => {
          var len = Math.floor(snapshot.docs.length / 3);
          this.column1 = snapshot.docs.slice(0, len);
          this.column2 = snapshot.docs.slice(len, len * 2);
          this.column3 = snapshot.docs.slice(len * 2, len * 3 - 1);
        });
    }
  }
};
</script>

<style></style>
