<template>
  <div class="login h-screen flex items-center justify-center">
    <div class="w-full max-w-xl text-left">
      <div
        class="flex bg-white shadow-md rounded items-center px-8 pt-6 pb-8 mb-4"
      >
        <img
          class="object-cover mx-0 flex-shrink-0 h-32 w-32 rounded-full"
          :src="avatarURL ? avatarURL : defaultAvatarPath"
          @load="loaded"
          alt="Avatar"
        />
        <div class="flex-auto mx-10 justify-center">
          <input
            type="file"
            name="avatar"
            :disabled="isUploading"
            @change="uploadAvatar($event)"
            ref="avatarInput"
            accept="image/*"
            class="hidden"
          />
          <button
            @click="$refs.avatarInput.click()"
            class="bevelButton"
            :disabled="isUploading"
          >
            {{ avatarUploadText }}
          </button>
        </div>
      </div>
      <p class="text-center text-gray-800 text-xs mb-10">
        &copy;2019 Poast. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "settings",
  data() {
    return {
      isUploading: false,
      avatarUploadText: "Change",
      defaultAvatarPath: require("../assets/default.jpg"),
      avatarURL: null
    };
  },
  created() {
    this.updateAvatar();
  },
  asyncComputed: {},
  methods: {
    uploadAvatar(event) {
      var avatarRef = firebase
        .storage()
        .ref("avatars/" + firebase.auth().currentUser.displayName + ".jpg");
      var file = event.target.files[0];

      avatarRef.put(file).then(() => {
        this.updateAvatar();
      });

      this.avatarUploadText = "Uploading...";
      this.isUploading = true;
    },

    updateAvatar() {
      var avatarRef = firebase
        .storage()
        .ref("avatars/" + firebase.auth().currentUser.displayName + ".jpg");
      avatarRef
        .getDownloadURL()
        .then(url => {
          this.avatarURL = url;
        })
        .catch(function() {
          // couldn't download file
        });
    },

    loaded() {
      this.avatarUploadText = "Change";
      this.isUploading = false;
    }
  }
};
</script>
