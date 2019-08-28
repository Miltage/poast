<template>
  <div
    @click="viewPost"
    class="rounded cursor-pointer px-4 py-4 hover:bg-gray-200"
    v-bind:class="{ 'font-bold': $route.params.id == id }"
  >
    {{ data.title }} ({{ id }})
  </div>
</template>

<script>
export default {
  name: "Post",
  props: {
    id: String,
    data: Object
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
