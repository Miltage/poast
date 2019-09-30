<template>
  <div
    v-if="data"
    class="flex max-w-sm mx-auto justify-center items-center select-none"
  >
    <img
      v-if="avatarURL"
      v-show="isLoaded"
      class="block mx-0 flex-shrink-0 object-cover rounded-full"
      :src="avatarURL"
      :class="size"
      alt="Avatar"
      @load="isLoaded = true"
    />
    <span
      v-if="!isLoaded"
      class="avatar-placeholder block mx-0 flex-shrink-0 bg-gray-500 rounded-full"
      :class="size"
    ></span>
    <div class="flex items-center text-center text-left">
      <p class="text-lg leading-tight m-3">{{ data.displayName }}</p>
      <div
        class="text-white bg-purple-500 border border-purple-500 text-xs font-semibold rounded p-1 leading-normal"
      >
        {{ data.klout }}
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "userbadge",
  props: {
    user: String,
    size: String
  },
  components: {},
  data() {
    return {
      data: null,
      defaultAvatarPath: require("../assets/default.jpg"),
      avatarURL: null,
      isLoaded: false
    };
  },
  watch: {
    user: "fetchUser"
  },
  created() {
    this.fetchUser();
  },
  methods: {
    fetchUser() {
      let doc = firebase
        .firestore()
        .collection("users")
        .doc(this.user);

      doc.onSnapshot(
        snapshot => {
          this.data = snapshot.data();
          var avatarRef = firebase.storage().ref(`avatars/${this.user}.jpg`);
          avatarRef
            .getDownloadURL()
            .then(url => {
              this.avatarURL = url;
            })
            .catch(() => {
              // couldn't download file
              this.avatarURL = this.defaultAvatarPath;
            });
        },
        err => {
          console.log(`Encountered error: ${err}`);
        }
      );
    }
  }
};
</script>

<style>
@keyframes changeColor {
  0% {
    @apply bg-gray-400;
  }

  50% {
    @apply bg-gray-500;
  }

  100% {
    @apply bg-gray-400;
  }
}

.avatar-placeholder {
  animation: changeColor ease;
  animation-iteration-count: infinite;
  animation-duration: 1s;
  animation-fill-mode: both;
}
</style>
