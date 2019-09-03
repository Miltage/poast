<template>
  <div class="login h-screen flex items-center justify-center">
    <div class="w-full max-w-xs text-left">
      <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="text"
            placeholder="example@domain.com"
            v-model="email"
            v-bind:class="{ 'border-red-500': emailError }"
          />
          <p v-if="emailError" class="text-red-500 text-xs italic">
            {{ emailError }}
          </p>
        </div>
        <div class="mb-6">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="password"
          >
            Password
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="**********"
            v-model="password"
            v-bind:class="{ 'border-red-500': passwordError }"
          />
          <p v-if="passwordError" class="text-red-500 text-xs italic">
            {{ passwordError }}
          </p>
          <p v-if="generalError" class="text-red-500 text-xs italic mt-4">
            {{ generalError }}
          </p>
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
        <div class="flex justify-center">
          <a
            class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 mt-6"
            href="#"
          >
            Create Account
          </a>
        </div>
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
      isWorking: false,
      emailError: null,
      passwordError: null,
      generalError: null
    };
  },
  methods: {
    login: function() {
      if (!this.validate()) return;

      this.isWorking = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          () => {
            this.$router.push({ name: "home" });
          },
          err => {
            this.generalError = err.message;
            this.isWorking = false;
          }
        );
    },

    validate() {
      let errors = 0;

      if (this.email.length == 0) {
        errors++;
        this.emailError = "You need to enter your email please.";
      } else this.emailError = null;

      if (this.password.length == 0) {
        errors++;
        this.passwordError = "You forgot to enter a password.";
      } else this.passwordError = null;

      return errors == 0;
    }
  }
};
</script>
