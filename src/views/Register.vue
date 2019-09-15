<template>
  <div class="login h-screen flex items-center justify-center">
    <div class="w-full max-w-xs text-left">
      <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="username"
          >
            Username
          </label>
          <input
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none"
            id="username"
            type="text"
            placeholder="AwesomeDood54"
            v-model.trim="username"
            v-bind:class="{
              'border-red-500':
                username.length > 0 &&
                (!usernameValid || usernameError || usernameTaken),
              'border-green-400':
                !usernameTaken && usernameValid && username.length > 0
            }"
          />
          <p v-if="usernameError" class="text-red-500 text-xs italic">
            {{ usernameError }}
          </p>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none"
            id="email"
            type="text"
            placeholder="example@domain.com"
            v-model.trim="email"
            v-bind:class="{ 'border-red-500': emailError }"
          />
          <p v-if="emailError" class="text-red-500 text-xs italic">
            {{ emailError }}
          </p>
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="password"
          >
            Password
          </label>
          <input
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none"
            id="password"
            type="password"
            placeholder="**********"
            v-model="password"
            v-bind:class="{ 'border-red-500': passwordError }"
          />
          <p v-if="passwordError" class="text-red-500 text-xs italic">
            {{ passwordError }}
          </p>
        </div>
        <div class="mb-6">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="password2"
          >
            Confirm Password
          </label>
          <input
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none"
            id="password2"
            type="password"
            placeholder="**********"
            v-model="password2"
            v-bind:class="{ 'border-red-500': password2Error }"
          />
          <p v-if="password2Error" class="text-red-500 text-xs italic">
            {{ password2Error }}
          </p>
          <p v-if="generalError" class="text-red-500 text-xs italic mt-4">
            {{ generalError }}
          </p>
        </div>
        <div class="flex items-center justify-center">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
            type="button"
            v-bind:class="{ 'opacity-50 cursor-not-allowed': isWorking }"
            @click="register"
          >
            Sign Up
          </button>
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
  name: "register",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      password2: "",
      isWorking: false,
      emailError: null,
      passwordError: null,
      password2Error: null,
      generalError: null,
      usernameError: null
    };
  },
  asyncComputed: {
    usernameValid() {
      var usernameRegex = /^[a-zA-Z0-9](_(?!(_))|(?![_]])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/;
      return usernameRegex.test(this.username);
    },
    usernameTaken() {
      if (this.username.length == 0) return false;

      this.isWorking = true;

      return new Promise(resolve => {
        var flag = firebase
          .firestore()
          .collection("users")
          .doc(this.username.toLowerCase());

        flag.get().then(doc => {
          resolve(doc.exists);
          this.isWorking = false;
        });
      });
    }
  },
  methods: {
    register: function() {
      if (!this.validate()) return;

      this.isWorking = true;
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
          () => {
            firebase
              .firestore()
              .collection("users")
              .doc(this.username.toLowerCase())
              .set({
                klout: 0,
                displayName: this.username,
                created: new Date(),
                uid: firebase.auth().currentUser.uid
              })
              .then(() => {
                this.$router.push({ name: "home" });
              });
          },
          err => {
            this.generalError = err.message;
            this.isWorking = false;
          }
        );
    },

    validate() {
      let errors = 0;

      var emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (this.username.length == 0) {
        errors++;
        this.usernameError = "You need to pick a username...";
      } else if (this.usernameTaken) {
        errors++;
        this.usernameError = "This username is already taken.";
      } else if (this.username.length > 20) {
        errors++;
        this.usernameError = "Username is too long.";
      } else if (this.username.length < 2) {
        errors++;
        this.usernameError = "Username is too short.";
      } else if (!this.usernameValid) {
        errors++;
        this.usernameError =
          "Your username may only conatin alphanumeric characters and the underscore (_).";
      } else this.usernameError = null;

      if (this.email.length == 0) {
        errors++;
        this.emailError = "You need to enter your email please.";
      } else if (!emailRegex.test(this.email.toLowerCase())) {
        errors++;
        this.emailError =
          "Sorry, this doesn't look like a valid email address.";
      } else this.emailError = null;

      if (this.password.length == 0) {
        errors++;
        this.passwordError = "You forgot to enter a password.";
      } else this.passwordError = null;

      if (this.password != this.password2) {
        errors++;
        this.password2Error = "Your passwords do not match.";
      } else this.password2Error = null;

      return errors == 0;
    }
  }
};
</script>
