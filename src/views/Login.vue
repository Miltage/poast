<template>
  <div class="login h-screen flex items-center justify-center">
    <div class="w-full max-w-xs text-left">
      <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="text"
            placeholder="example@domain.com"
            v-model="email"
          />
        </div>
        <div class="mb-6">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="password"
          >
            Password
          </label>
          <input
            class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            v-model="password"
            placeholder="**********"
          />
          <p class="text-red-500 text-xs italic">Please choose a password.</p>
        </div>
        <div class="flex items-center justify-between">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            @click="login"
            v-bind:class="{ 'opacity-50 cursor-not-allowed': isWorking }"
          >
            Sign In
          </button>
          <a
            class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            href="#"
          >
            Forgot Password?
          </a>
        </div>
        <a
          class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 mt-6"
          href="#"
        >
          Create Account
        </a>
      </form>
      <p class="text-center text-white text-xs">
        &copy;2019 Spread Eagle. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "login",
  data() {
    return {
      email: "",
      password: "",
      isWorking: false
    };
  },
  methods: {
    login: function() {
      this.isWorking = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          () => {
            this.$router.push({ name: "home" });
          },
          err => {
            alert("Oops... " + err.message);
            this.isWorking = false;
          }
        );
    }
  }
};
</script>
