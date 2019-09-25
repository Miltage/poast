<template>
  <div class="rounded overflow-hidden shadow bg-white max-w-md mb-5">
    <PostContent :url="url" />
    <div class="px-6 py-4">
      <div class="font-bold text-xl mb-2">{{ data.title }}</div>
      <p class="text-gray-700 text-base mb-2" v-if="data.desc">
        {{ data.desc }}
      </p>
    </div>
    <div class="px-6 pb-4">
      <template v-if="data.categories">
        <router-link
          v-for="cat in data.categories"
          :to="{ path: '/channel/' + cat.toLowerCase().trim() }"
          v-bind:key="cat"
        >
          <span
            class="inline-block cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            >#{{ cat }}</span
          >
        </router-link>
      </template>
      <template v-else>
        <router-link
          v-for="channel in data.channels"
          :to="{ path: '/channel/' + channel.toLowerCase().trim() }"
          v-bind:key="channel"
        >
          <span
            class="inline-block cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            >#{{ channel }}</span
          >
        </router-link>
      </template>
    </div>
    <div class="mb-4" v-if="author">
      <span class="italic px-1">{{
        data.created.toDate() | moment("from")
      }}</span>
      by
      <router-link
        :to="/user/ + data.author"
        class="text-orange-500 hover:text-purple-500 font-bold"
        >{{ author.displayName }}</router-link
      >
    </div>
  </div>
</template>

<script>
import PostContent from "@/components/PostContent.vue";
import shared from "../shared";
import firebase from "firebase";

export default {
  name: "postcard",
  props: {
    data: Object
  },
  data() {
    return {
      author: null
    };
  },
  components: {
    PostContent
  },
  computed: {
    url: function() {
      return shared.parseContent(this.data.content);
    }
  },
  created() {
    this.getAuthor();
  },
  methods: {
    getAuthor() {
      let doc = firebase
        .firestore()
        .collection("users")
        .doc(this.data.author);

      doc.onSnapshot(snapshot => {
        this.author = snapshot.data();
      });
    }
  }
};
</script>

<style></style>
