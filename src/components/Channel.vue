<template>
  <li
    @click="changeChannel"
    class="w-auto block py-2 cursor-pointer hover:bg-gray-200 relative"
    v-bind:class="{ 'font-bold bg-gray-200': $route.params.name == name }"
  >
    #{{ name }}
    <div
      id="channel-spinner"
      v-if="isLoading"
      class="w-4 h-4 absolute right-0 mx-2 my-1"
    ></div>
  </li>
</template>

<script>
export default {
  name: "channel",
  props: {
    name: String,
    routeChannel: String,
    isLoading: Boolean
  },
  components: {},
  methods: {
    changeChannel: function() {
      this.isLoading = true;
      this.$router.push({ path: `/channel/${this.name}` });
    }
  }
};
</script>

<style>
#channel-spinner {
  display: inline-block;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  border-top-color: #000;
  animation: spin 0.6s ease-in-out infinite;
  -webkit-animation: spin 0.6s ease-in-out infinite;
}

@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>
