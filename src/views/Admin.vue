<template>
  <div class="flex overflow-hidden h-full">
    <div
      class="flex-initial w-48 shadow rounded overflow-y-scroll bg-white text-center m-4"
    >
      <ul>
        <router-link
          v-for="nav in navList"
          :to="'/admin/' + nav"
          v-bind:key="nav"
        >
          <li
            class="w-auto block py-2 cursor-pointer hover:bg-teal-100 relative"
            v-bind:class="{
              'font-bold bg-teal-300 text-white hover:bg-teal-300':
                $route.params.dest == nav
            }"
          >
            {{ nav }}
          </li>
        </router-link>
      </ul>
    </div>
    <div
      class="flex-1 bg-white shadow rounded overflow-y-scroll text-left my-4 mr-4"
    >
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "admin",
  data() {
    return {
      navList: ["dashboard", "users", "reports", "comments"]
    };
  }
};
</script>
