<template>
  <div class="settings h-screen flex items-center justify-center">
    <div class="w-full max-w-xl text-left">
      <div
        class="flex flex-col bg-white shadow-md rounded items-center px-8 pt-6 pb-8 mb-4"
      >
        <div class="flex items-center w-full p-10">
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
        <div class="w-full p-10">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="channels"
          >
            My Channels
          </label>
          <Multiselect
            v-model="value"
            tag-placeholder="Add this channel"
            placeholder="Select some channels..."
            label="name"
            track-by="code"
            :options="options"
            :multiple="true"
            :taggable="true"
            @tag="addChannel"
            @remove="removeChannel"
            @select="selectChannel"
            class="block mb-1"
          ></Multiselect>
        </div>
      </div>
      <p class="text-center text-gray-800 text-xs mb-10">
        &copy;2019 Poast. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import firebase from "firebase";

export default {
  name: "settings",
  components: {
    Multiselect
  },
  data() {
    return {
      isUploading: false,
      avatarUploadText: "Change",
      defaultAvatarPath: require("../assets/default.jpg"),
      avatarURL: null,
      value: [],
      options: []
    };
  },
  created() {
    this.updateAvatar();
    this.fetchChannels();
  },
  asyncComputed: {},
  methods: {
    fetchChannels() {
      firebase
        .firestore()
        .collection(
          "users/" + firebase.auth().currentUser.displayName + "/channels"
        )
        .get()
        .then(snapshot => {
          this.value = [];
          snapshot.docs.forEach(v => {
            this.value.push({ name: v.id, code: v.id });
          });
        });

      firebase
        .firestore()
        .collection("channels")
        .onSnapshot(snapshot => {
          this.options = [];
          snapshot.docs.forEach(v => {
            this.options.push({ name: v.id, code: v.id });
          });
        });
    },

    selectChannel(channel) {
      firebase
        .firestore()
        .collection(
          "users/" + firebase.auth().currentUser.displayName + "/channels"
        )
        .doc(channel.name)
        .set({});
    },

    addChannel(newChannel) {
      const channel = {
        name: newChannel,
        code: newChannel.substring(0, 2) + Math.floor(Math.random() * 10000000)
      };
      this.options.push(channel);
      this.value.push(channel);

      this.selectChannel(channel);
    },

    removeChannel(oldChannel) {
      firebase
        .firestore()
        .collection(
          "users/" + firebase.auth().currentUser.displayName + "/channels"
        )
        .doc(oldChannel.name)
        .delete();
    },

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
