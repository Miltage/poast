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
  name: "featured",
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
    this.getLatest();
  },
  watch: {
    // call again the method if the route changes
    $route: "fetchPosts"
  },
  methods: {
    getLatest() {
      firebase
        .firestore()
        .collection("posts")
        .orderBy("created", "desc")
        .limit(18)
        .onSnapshot(snapshot => {
          var docs = snapshot.docs;
          for (var i = 0; i < docs.length; i++) {
            switch (i % 3) {
              case 0:
                this.column1.push(docs.shift());
                break;
              case 1:
                this.column2.push(docs.shift());
                break;
              case 2:
                this.column3.push(docs.shift());
                break;
            }
          }
        });
    }
  }
};
</script>

<style></style>
