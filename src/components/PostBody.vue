<template>
  <div class="rounded overflow-y-scroll shadow-lg h-full">
    <!--<img class="w-full" src="https://source.unsplash.com/random" alt="Sunset in the mountains">-->
    <iframe
      class="w-full"
      height="315"
      src="https://www.youtube.com/embed/fOAcSwA8LnU"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
    <div v-if="loading" class="px-6 py-4">
      Loading...
    </div>
    <template v-if="!loading">
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">
          {{ data.title }} ({{ $route.params.id }})
        </div>
        <p class="text-gray-700 text-base">
          {{ data.desc }}
        </p>
      </div>
      <div class="px-6 py-4">
        <span
          class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
          >#photography</span
        >
        <span
          class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
          >#travel</span
        >
        <span
          class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
          >#winter</span
        >
      </div>
    </template>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "PostBody",
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      data: {}
    };
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
      this.loading = true;
      let path = `channels/${this.$route.params.name}/posts/${this.$route.params.id}`;
      firebase
        .firestore()
        .doc(path)
        .get()
        .then(doc => {
          this.loading = false;
          this.data = doc.data();
        });
    }
  }
};
</script>
