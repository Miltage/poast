<template>
  <div v-if="data" class="flex max-w-sm mx-auto justify-center items-center">
    <img
      class="block mx-0 flex-shrink-0 object-cover rounded-full"
      :src="avatarURL ? avatarURL : defaultAvatarPath"
      :class="size"
      alt="Avatar"
    />
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
  methods: {},
  data() {
    return {
      data: null,
      defaultAvatarPath: require("../assets/default.jpg"),
      avatarURL: null
    };
  },
  created() {
    let doc = firebase
      .firestore()
      .collection("users")
      .doc(this.user);

    doc.onSnapshot(
      snapshot => {
        this.data = snapshot.data();
        var avatarRef = firebase.storage().ref(`avatars/${this.user}.jpg`);
        avatarRef.getDownloadURL().then(url => {
          this.avatarURL = url;
        });
      },
      err => {
        console.log(`Encountered error: ${err}`);
      }
    );
  }
};
</script>
