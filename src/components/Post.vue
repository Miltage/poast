<template>
  <div
    @click="viewPost"
    class="flex items-center cursor-pointer px-4 py-4 hover:bg-gray-200"
    v-bind:class="{
      'font-bold bg-teal-400 text-white hover:bg-teal-400':
        $route.params.id == id
    }"
  >
    <img
      v-if="contentType == 'image'"
      class="content-icon"
      src="../assets/icons/picture.svg"
    />
    <img
      v-if="contentType == 'youtube'"
      class="content-icon"
      src="../assets/icons/video-player.svg"
    />
    <img
      v-if="contentType == 'soundcloud'"
      class="content-icon"
      src="../assets/icons/quavers.svg"
    />
    <div class="flex-1 mx-4">{{ data.title }}</div>
  </div>
</template>

<script>
import shared from "../shared";

export default {
  name: "Post",
  props: {
    id: String,
    data: Object,
    prefix: String
  },
  computed: {
    contentType: shared.detectContentType
  },
  methods: {
    viewPost: function() {
      this.$router.push({
        path: `/${this.prefix}/${this.$route.params.name}/${this.id}`
      });
    }
  }
};
</script>

<style>
.content-icon {
  min-width: 2rem;
  @apply flex-initial w-1/12;
}
</style>
