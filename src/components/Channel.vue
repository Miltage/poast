<template>
  <li
    @click="changeChannel"
    class="w-auto block py-2 cursor-pointer hover:bg-gray-200"
    v-bind:class="{ 'font-bold': $route.params.name == name }"
  >
    #{{ name }}
  </li>
</template>

<script>
export default {
  name: "channel",
  props: {
    name: String,
    routeChannel: String
  },
  components: {},
  methods: {
    changeChannel: function() {
      this.$router.push({ path: `/channel/${this.name}` });
    }
  }
};
</script>
