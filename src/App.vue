<template>
  <div id="app" class="bg-teal-200 h-screen">
    <div class="flex flex-col h-full">
      <NavBar />
      <div class="flex-auto w-full h-full overflow-y-scroll">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";

export default {
  components: {
    NavBar
  }
};
</script>

<style>
@tailwind base;
@tailwind components;

@import "./assets/styles/default.css";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

@tailwind utilities;
</style>
