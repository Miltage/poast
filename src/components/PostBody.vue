<template>
  <!-- Post ID: ({{ id }}) -->
  <div class="rounded bg-white overflow-y-scroll shadow-lg h-full">
    <template v-if="id">
      <div v-if="loading" class="px-6 py-4">
        Loading...
      </div>
      <template v-if="!loading">
        <img
          v-if="contentType == 'image'"
          class="w-full"
          :src="data.content"
          :alt="data.title"
        />
        <iframe
          v-if="contentType == 'youtube'"
          class="w-full"
          height="315"
          :src="'https://www.youtube.com/embed/' + getYouTubeID()"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>

        <div class="flex items-center justify-around px-10 my-4">
          <div class="post-icon">
            <img src="../assets/icons/like.svg" />
          </div>
          <div class="post-icon">
            <img src="../assets/icons/dislike.svg" />
          </div>
          <div class="post-icon">
            <img src="../assets/icons/bookmark.svg" />
          </div>
          <div class="post-icon">
            <img src="../assets/icons/flag.svg" />
          </div>
        </div>

        <div class="px-6">
          <div class="font-bold text-xl">{{ data.title }}</div>
          <p class="text-gray-700 text-base py-4">
            {{ data.desc }}
          </p>
        </div>
        <div class="px-6">
          <template v-for="channel in data.channels">
            <router-link
              :to="{ path: '/channel/' + channel }"
              v-bind:key="channel"
            >
              <span
                class="inline-block cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
                >#{{ channel }}</span
              >
            </router-link>
          </template>
        </div>

        <UserBadge :user="data.author" class="h-12 my-5" />
        <span v-if="data.created" class="inline-block text-sm italic"
          >Posted {{ data.created.toDate() | moment("from") }}</span
        >
        <div class="h-10"></div>
      </template>
    </template>
  </div>
</template>

<script>
import UserBadge from "@/components/UserBadge.vue";
import firebase from "firebase";
import shared from "../shared";

export default {
  name: "PostBody",
  data() {
    return {
      loading: false,
      id: null,
      data: {}
    };
  },
  components: {
    UserBadge
  },
  computed: {
    contentType: shared.detectContentType
  },
  watch: {
    // call again the method if the route changes
    $route: "fetchData"
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      if (!this.$route.params.id) return;

      this.loading = true;
      let path = `posts/${this.$route.params.id}`;
      firebase
        .firestore()
        .doc(path)
        .get()
        .then(doc => {
          this.loading = false;
          this.id = doc.id;
          this.data = doc.data();
        });
    },
    getYouTubeID() {
      var idregex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i;
      return this.data.content.match(idregex)[1];
    }
  }
};
</script>

<style>
.post-icon {
  @apply flex items-center justify-center cursor-pointer py-2 px-4 rounded-lg w-20 h-20;
}
.post-icon:hover {
  @apply bg-gray-300;
}
.post-icon:active {
  @apply bg-blue-200;
}
.post-icon img {
  @apply w-4/5 py-3 inline;
}
</style>
