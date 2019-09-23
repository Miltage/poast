<template>
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
              class="appearance-none border rounded w-full mb-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              placeholder="eg. Super Awesome Post!"
              v-model="title"
              v-bind:class="{ 'border-red-500': titleError }"
            />
            <p v-if="titleError" class="text-red-500 text-xs italic">
              {{ titleError }}
            </p>
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="desc"
            >
              Description
            </label>
            <textarea
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 h-24 leading-tight focus:outline-none focus:shadow-outline"
              id="desc"
              type="password"
              v-model="desc"
              placeholder="eg. Here's a little bit about this thing..."
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Content Type
            </label>
            <div class="flex">
              <div
                @click="contentType = 'image'"
                class="content-option"
                v-bind:class="{ selected: contentType == 'image' }"
              >
                <img
                  src="../assets/icons/picture.svg"
                  alt="Image"
                  title="Image"
                />
              </div>
              <div
                @click="contentType = 'audio'"
                class="content-option"
                v-bind:class="{ selected: contentType == 'audio' }"
              >
                <img
                  src="../assets/icons/quavers.svg"
                  alt="audio"
                  title="Audio"
                />
              </div>
              <div
                @click="contentType = 'youtube'"
                class="content-option"
                v-bind:class="{ selected: contentType == 'youtube' }"
              >
                <img
                  src="../assets/icons/video-player.svg"
                  alt="youtube"
                  title="Youtube"
                />
              </div>
            </div>
            <p
              v-if="contentTypeError"
              class="block text-red-500 text-xs italic mt-2"
            >
              {{ contentTypeError }}
            </p>
          </div>
          <div class="mb-4" v-if="contentType">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="content"
            >
              URL
            </label>
            <input
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline"
              id="content"
              type="text"
              :placeholder="contentPlaceholder"
              v-model="content"
              v-bind:class="{ 'border-red-500': contentError }"
            />
            <p v-if="contentError" class="text-red-500 text-xs italic">
              {{ contentError }}
            </p>
          </div>
          <div class="mb-6">
            <label class="text-gray-700 text-sm font-bold mb-2" for="channels">
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
              class="mb-1"
              v-bind:class="{
                'border-red-500 border rounded': channelError
              }"
            ></Multiselect>
            <p v-if="channelError" class="text-red-500 text-xs italic">
              {{ channelError }}
            </p>
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
        <p class="text-center text-gray-800 text-xs mb-10">
          &copy;2019 Poast. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
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
      titleError: null,
      contentError: null,
      contentTypeError: null,
      channelError: null,
      isWorking: false,
      count: 0,
      value: [],
      options: [],
      contentType: null,
      contentTypes: [
        { name: "image", icon: "picture" },
        { name: "youtube", icon: "video-player" },
        { name: "audio", icon: "quavers" }
      ],
      placeholders: {
        image: "eg. https://i.imgur.com/XqrHojK.jpg",
        youtube: "eg. https://www.youtube.com/watch?v=6RFOkS4jOh8",
        audio: "eg. https://soundcloud.com/oddboy18/slowpoke-speedway"
      }
    };
  },
  computed: {
    contentPlaceholder: function() {
      return this.placeholders[this.contentType];
    }
  },
  components: {
    Multiselect
  },
  created() {
    this.fetchData();
  },
  methods: {
    submit: function() {
      if (!this.validate()) return;

      this.isWorking = true;
      this.getUniqueID(this.title);
    },

    fetchData() {
      firebase
        .firestore()
        .collection("channels")
        .onSnapshot(snapshot => {
          this.options = [];
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
    },

    slugify(text) {
      return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w-]+/g, "") // Remove all non-word chars
        .replace(/--+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, ""); // Trim - from end of text
    },

    getUniqueID(text) {
      let id = this.slugify(text);
      firebase
        .firestore()
        .collection("posts")
        .doc(id)
        .get()
        .then(doc => {
          if (!doc.exists) {
            // post with this id doesn't exist yet
            this.createPost(id);
          } else {
            // post already exists on server
            this.count++;
            this.getUniqueID(text + "-" + this.count);
          }
        });
      return id;
    },

    createPost(id) {
      console.log("Create post with id (" + id + ")");
      let channels = [];
      let categories = [];
      this.value.forEach(v => {
        categories.push(v.name);
        channels.push(v.name.toLowerCase().trim());
      });

      let data = {
        title: this.title,
        desc: this.desc,
        content: this.content,
        channels: channels,
        categories: categories,
        created: new Date(),
        author: firebase.auth().currentUser.displayName,
        score: 0
      };

      firebase
        .firestore()
        .collection("posts")
        .doc(id)
        .set(data)
        .then(() => {
          this.$router.replace("channel/" + channels[0] + "/" + id);
        });
    },

    validate() {
      let errors = 0;

      if (this.title.length < 3) {
        this.titleError = "You need to enter at least 3 characters here.";
        errors++;
      } else this.titleError = null;

      if (this.contentType == null) {
        this.contentTypeError = "You need to select a content type.";
        errors++;
      } else this.contentTypeError = null;

      if (this.content.length == 0) {
        this.contentError = "Definitely can't leave this blank, bro!";
        errors++;
      } else this.contentError = null;

      if (this.value.length == 0) {
        this.channelError =
          "You're gonna need to select at least one channel here, pal.";
        errors++;
      } else this.channelError = null;

      return errors == 0;
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
.content-option {
  @apply flex items-center justify-center cursor-pointer py-2 px-4 rounded-lg w-20 h-20 m-1;
}
.content-option:hover {
  @apply bg-gray-300;
}
.content-option:active {
  @apply bg-blue-200;
}
.content-option img {
  @apply w-4/5 py-3 inline;
}
.content-option.selected {
  @apply bg-blue-300;
}
</style>
