<template>
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
          :src="
            'https://www.youtube.com/embed/' + getYouTubeID(this.data.content)
          "
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
        <div class="px-6 py-4">
          <div class="font-bold text-xl mb-2">{{ data.title }} ({{ id }})</div>
          <p class="text-gray-700 text-base">
            {{ data.desc }}
          </p>
        </div>
        <div class="px-6 py-4">
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
      </template>
    </template>
  </div>
</template>

<script>
import firebase from "firebase";
import Post from "@/components/Post.vue";

export default {
  name: "PostBody",
  data() {
    return {
      loading: false,
      id: null,
      data: {}
    };
  },
  computed: {
    contentType: Post.contentType
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

    getYouTubeID(url) {
      var idregex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i;
      return url.match(idregex)[1];
    }
  }
};
</script>
