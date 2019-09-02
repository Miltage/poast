<template>
  <div class="login h-screen">
    <div class="flex flex-col h-full">
      <NavBar />
      <div class="overflow-y-scroll">
        <div class="flex items-center justify-center m-10">
          <div class="w-full max-w-lg text-left">
            <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div class="mb-4">
                <label
                  class="block text-gray-700 text-sm font-bold mb-2"
                  for="title"
                >
                  Title
                </label>
                <input
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="title"
                  type="text"
                  placeholder="eg. Super Awesome Post!"
                  v-model="title"
                />
              </div>
              <div class="mb-4">
                <label
                  class="block text-gray-700 text-sm font-bold mb-2"
                  for="desc"
                >
                  Description
                </label>
                <textarea
                  class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-1 h-24 leading-tight focus:outline-none focus:shadow-outline"
                  id="desc"
                  type="password"
                  v-model="desc"
                  placeholder="eg. Here's a little bit about this thing..."
                />
                <p class="text-red-500 text-xs italic">Generic error.</p>
              </div>
              <div class="mb-4">
                <label
                  class="block text-gray-700 text-sm font-bold mb-2"
                  for="title"
                >
                  URL
                </label>
                <input
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="title"
                  type="text"
                  placeholder="eg. https://www.youtube.com/watch?v=l3g0xkMAMrE"
                  v-model="content"
                />
              </div>
              <div class="mb-6">
                <label class="text-gray-700 text-sm font-bold mb-2" for="title">
                  Channels
                </label>
                <p class="text-xs italic mb-2">Select up to five.</p>
                <Multiselect
                  v-model="value"
                  tag-placeholder="Add this channel"
                  placeholder="Start typing..."
                  label="name"
                  track-by="code"
                  :options="options"
                  :multiple="true"
                  :taggable="true"
                  @tag="addTag"
                  :max="5"
                ></Multiselect>
              </div>
              <div class="flex items-center justify-between">
                <button
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  @click="submit"
                  v-bind:class="{ 'opacity-50 cursor-not-allowed': isWorking }"
                >
                  Submit
                </button>
              </div>
            </form>
            <p class="text-center text-white text-xs">
              &copy;2019 Spread Eagle. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import Multiselect from "vue-multiselect";
import firebase from "firebase";

export default {
  name: "login",
  data() {
    return {
      url: "",
      title: "",
      desc: "",
      content: "",
      isWorking: false,
      value: [],
      options: []
    };
  },
  components: {
    NavBar,
    Multiselect
  },
  created() {
    this.fetchData();
  },
  methods: {
    submit: function() {
      this.isWorking = true;
      /*firebase
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
        );*/
    },
    fetchData() {
      firebase
        .firestore()
        .collection("channels")
        .onSnapshot(snapshot => {
          snapshot.forEach(doc => {
            this.options.push({ name: doc.id, code: doc.id });
          });
        });
    },
    addTag(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000)
      };
      this.options.push(tag);
      this.value.push(tag);
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
