<template>
  <div
    @click="viewPost"
    class="flex items-center cursor-pointer px-4 py-4 hover:bg-gray-200"
    v-bind:class="{ 'font-bold': $route.params.id == id }"
  >
    <img
      v-if="contentType == 'image'"
      class="w-1/12 flex-initial"
      src="../assets/icons/picture.svg"
    />
    <img
      v-if="contentType == 'youtube'"
      class="w-1/12 flex-initial"
      src="../assets/icons/video-player.svg"
    />
    <div class="flex-1 mx-4">{{ data.title }}</div>
  </div>
</template>

<script>
export default {
  name: "Post",
  props: {
    id: String,
    data: Object
  },
  computed: {
    contentType: function() {
      if (this.data.content.includes("youtube.com")) return "youtube";
      return "image";
    }
  },
  methods: {
    viewPost: function() {
      this.$router.push({
        path: `/channel/${this.$route.params.name}/${this.id}`
      });
    }
  }
};
</script>
