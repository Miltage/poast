<template>
  <div class="flex overflow-hidden h-full">
    <div
      class="flex-1 bg-white shadow rounded overflow-y-scroll text-left my-4 ml-4"
    >
      <div class="my-10">
        <UserBadge
          :user="user"
          size="w-16 h-16"
          class="cursor-pointer font-bold h-8"
          @click.native="showList = !showList"
        />
      </div>
      <transition-group name="post-list" tag="span">
        <template v-for="post in postList">
          <Post
            class="post-list-item"
            :id="post.id"
            :data="post.data()"
            v-bind:key="post.id"
            prefix="user"
          />
        </template>
      </transition-group>
    </div>
    <div id="post-body" class="flex-1 shadow text-center m-4 overflow-y-scroll">
      <PostBody />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Post from "@/components/Post.vue";
import PostBody from "@/components/PostBody.vue";
import UserBadge from "@/components/UserBadge.vue";
import firebase from "firebase";

export default {
  name: "profile",
  components: {
    Post,
    PostBody,
    UserBadge
  },
  data() {
    return {
      postList: [],
      user: this.$route.params.name
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
      this.user = this.$route.params.name;
      if (this.user) {
        firebase
          .firestore()
          .collection("posts")
          .orderBy("created", "desc")
          .where("author", "==", this.$route.params.name)
          .onSnapshot(snapshot => {
            this.postList = snapshot.docs;
          });
      }
    }
  }
};
</script>
