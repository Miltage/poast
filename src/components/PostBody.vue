<template>
  <!-- Post ID: ({{ id }}) -->
  <div class="rounded bg-white overflow-y-scroll shadow-lg h-full">
    <template v-if="id">
      <div
        v-if="isLoading"
        class="px-6 py-4 mt-24 flex items-center justify-center"
      >
        <img id="loading" class="w-16" src="../assets/icons/loading.svg" />
      </div>
      <template v-if="!isLoading">
        <img
          v-if="contentType == 'image'"
          class="w-full"
          :src="data.content"
          :alt="data.title"
        />
        <iframe
          v-if="contentType == 'youtube'"
          class="w-full"
          height="315"
          :src="'https://www.youtube.com/embed/' + getYouTubeID()"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
        <iframe
          v-if="contentType == 'soundcloud' && trackId"
          width="100%"
          height="200"
          scrolling="no"
          frameborder="no"
          allow="autoplay"
          :src="
            'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' +
              trackId +
              '&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true'
          "
        ></iframe>

        <div v-show="loaded < 3" class="h-24"></div>
        <transition name="fade">
          <div
            v-show="loaded >= 3"
            class="flex items-center justify-around px-10 my-4 h-24 select-none"
          >
            <div
              class="post-icon"
              v-bind:class="{ depressed: vote > 0 }"
              @click="castVote(1)"
            >
              <img src="../assets/icons/like.svg" />
            </div>
            <div
              class="post-icon"
              v-bind:class="{ depressed: vote < 0 }"
              @click="castVote(-1)"
            >
              <img src="../assets/icons/dislike.svg" />
            </div>
            <div
              class="post-icon"
              v-bind:class="{ depressed: isSaved }"
              @click="savePost()"
            >
              <img src="../assets/icons/bookmark.svg" />
            </div>
            <div
              class="post-icon"
              v-bind:class="{ depressed: isFlagged }"
              @click="flagPost()"
            >
              <img src="../assets/icons/flag.svg" />
            </div>
          </div>
        </transition>

        <div
          v-if="authError"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-10"
          role="alert"
        >
          <span class="block sm:inline"
            >You need to be logged in to do that.</span
          >
        </div>

        <div class="px-6">
          <div class="font-bold text-xl">{{ data.title }}</div>
          <p class="text-gray-700 text-base py-4">
            {{ data.desc }}
          </p>
        </div>
        <div class="px-6">
          <template v-for="channel in data.channels">
            <router-link
              :to="{ path: '/channel/' + channel }"
              v-bind:key="channel"
            >
              <span
                class="inline-block cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
                >#{{ channel }}</span
              >
            </router-link>
          </template>
        </div>

        <UserBadge
          v-if="data.author"
          :user="data.author"
          size="w-16 h-16"
          class="h-12 my-6"
        />
        <span v-if="data.created" class="inline-block text-sm italic"
          >Posted {{ data.created.toDate() | moment("from") }}</span
        >
        <div class="h-10"></div>
      </template>
    </template>
  </div>
</template>

<script>
import UserBadge from "@/components/UserBadge.vue";
import firebase from "firebase";
import shared from "../shared";

export default {
  name: "PostBody",
  data() {
    return {
      isLoading: false,
      isWorking: false,
      id: null,
      data: {},
      vote: 0,
      isFlagged: false,
      isSaved: false,
      loaded: 0,
      authError: false
    };
  },
  components: {
    UserBadge
  },
  computed: {
    contentType: shared.detectContentType
  },
  asyncComputed: {
    trackId() {
      if (!this.data.content) return null;
      if (this.contentType != "soundcloud") return null;

      return new Promise(resolve => {
        fetch(
          "https://soundcloud.com/oembed?url=" +
            encodeURI(this.data.content) +
            "&format=json"
        ).then(response => {
          return response.json().then(json => {
            resolve(json.html.match(/tracks%2F(.*?)&/s)[1]);
          });
        });
      });
    }
  },
  watch: {
    // call again the method if the route changes
    $route: "init"
  },
  created() {
    this.init();
  },

  methods: {
    init() {
      if (!this.$route.params.id) return;

      this.loaded = !firebase.auth().currentUser ? 5 : 0;
      this.fetchData();
    },

    fetchData() {
      this.isLoading = true;
      let path = `posts/${this.$route.params.id}`;
      firebase
        .firestore()
        .doc(path)
        .get()
        .then(doc => {
          this.isLoading = false;
          this.id = doc.id;
          this.data = doc.data();

          this.data.content = shared.parseContent(this.data.content);

          this.getBookmarkStatus();
          this.getFlaggedStatus();
          this.getVoteStatus();
        });
    },

    getYouTubeID() {
      var idregex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i;
      return this.data.content.match(idregex)[1];
    },

    getSoundcloudID() {
      fetch(
        "https://soundcloud.com/oembed?url=" +
          encodeURI(this.data.content) +
          "&format=json"
      ).then(response => {
        return response.json().then(json => {
          this.trackId = json.html.match(/tracks%2F(.*?)&/s)[1];
        });
      });
    },

    getBookmarkStatus() {
      if (!firebase.auth().currentUser) return;

      var bookmark = firebase
        .firestore()
        .collection(
          `users/${firebase.auth().currentUser.displayName}/bookmarks`
        )
        .doc(this.id);

      bookmark.get().then(doc => {
        this.isSaved = doc.exists;
        this.loaded++;
      });
    },

    savePost() {
      if (!firebase.auth().currentUser) {
        this.authError = true;
        return;
      }
      if (this.isWorking) return;

      this.isWorking = true;
      this.isSaved = !this.isSaved;

      let path = `users/${firebase.auth().currentUser.displayName}/bookmarks`;
      let bookmark = firebase
        .firestore()
        .collection(path)
        .doc(this.id);

      bookmark.get().then(doc => {
        if (doc.exists)
          bookmark.delete().then(() => {
            this.isWorking = false;
          });
        else
          bookmark.set({}).then(() => {
            this.isWorking = false;
          });
      });
    },

    getFlaggedStatus() {
      if (!firebase.auth().currentUser) return;

      var flag = firebase
        .firestore()
        .collection(`posts/${this.id}/flags`)
        .doc(firebase.auth().currentUser.displayName);

      flag.get().then(doc => {
        this.isFlagged = doc.exists;
        this.loaded++;
      });
    },

    flagPost() {
      if (!firebase.auth().currentUser) {
        this.authError = true;
        return;
      }
      if (this.isWorking) return;

      this.isWorking = true;
      this.isFlagged = !this.isFlagged;

      let path = `posts/${this.id}/flags`;
      let flag = firebase
        .firestore()
        .collection(path)
        .doc(firebase.auth().currentUser.displayName);

      flag.get().then(doc => {
        if (doc.exists)
          flag.delete().then(() => {
            this.isWorking = false;
          });
        else
          flag.set({}).then(() => {
            this.isWorking = false;
          });
      });
    },

    getVoteStatus() {
      if (!firebase.auth().currentUser) return;

      let path = `posts/${this.id}/votes`;
      let vote = firebase
        .firestore()
        .collection(path)
        .doc(firebase.auth().currentUser.displayName);

      vote.get().then(doc => {
        if (doc.exists) this.vote = doc.data().value;
        else this.vote = 0;
        this.loaded++;
      });
    },

    castVote(alignment) {
      if (!firebase.auth().currentUser) {
        this.authError = true;
        return;
      }

      var oldVote = this.vote;
      this.vote = alignment;

      let path = `posts/${this.id}/votes`;
      let vote = firebase
        .firestore()
        .collection(path)
        .doc(firebase.auth().currentUser.displayName);

      let author = firebase
        .firestore()
        .collection("users")
        .doc(this.data.author);

      //vote.set({ value: alignment });

      return firebase
        .firestore()
        .runTransaction(transaction => {
          // This code may get re-run multiple times if there are conflicts.
          return transaction.get(author).then(doc => {
            transaction.update(author, {
              klout: doc.data().klout - oldVote + this.vote
            });

            transaction.set(vote, { value: alignment });
          });
        })
        .then(function() {
          console.log("Transaction successfully committed!");
        })
        .catch(function(error) {
          console.log("Transaction failed: ", error);
        });
    }
  }
};
</script>

<style>
.post-icon {
  @apply flex items-center justify-center cursor-pointer py-2 px-4 rounded-lg w-20 h-20;
}
.post-icon:hover {
  @apply bg-gray-300;
}
.post-icon:active {
  @apply bg-blue-200;
}
.post-icon img {
  @apply w-4/5 py-3 inline;
}
.post-icon.depressed {
  @apply bg-blue-300;
}

#loading {
  -webkit-animation: rotation 2s infinite linear;
}

@-webkit-keyframes rotation {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
