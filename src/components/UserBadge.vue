<template>
  <div v-if="data" class="flex max-w-sm mx-auto">
    <div class="flex items-center justify-center">
      <img
        class="block mx-0 flex-shrink-0 h-full rounded-full"
        src="https://randomuser.me/api/portraits/women/17.jpg"
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
      data: null
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
      },
      err => {
        console.log(`Encountered error: ${err}`);
      }
    );
  }
};
</script>
