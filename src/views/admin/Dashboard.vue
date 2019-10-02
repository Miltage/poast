<template>
  <div class="flex text-center justify-around m-10">
    <div class="flex-1 text-xl font-semibold">
      Users
      <span class="block text-teal-500" style="font-size: 4rem">{{
        userCount
      }}</span>
    </div>
    <div class="flex-1 text-xl font-semibold">
      Posts
      <span class="block text-teal-500" style="font-size: 4rem">{{
        postCount
      }}</span>
    </div>
    <div class="flex-1 text-xl font-semibold">
      Posts today
      <span class="block text-teal-500" style="font-size: 4rem">{{
        todayCount
      }}</span>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from "firebase";
import moment from "moment";

export default {
  name: "dashboard",
  components: {},
  data() {
    return {
      userCount: 0,
      postCount: 0,
      todayCount: 0
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      // WARNING: not scalable! Implement counters in the future!
      // https://stackoverflow.com/questions/46554091/firebase-firestore-collection-count

      firebase
        .firestore()
        .collection("users")
        .get()
        .then(snap => {
          this.userCount = snap.size;
        });

      firebase
        .firestore()
        .collection("posts")
        .get()
        .then(snap => {
          this.postCount = snap.size;
        });

      var today = moment().startOf("day");

      firebase
        .firestore()
        .collection("posts")
        .where("created", ">=", today.toDate())
        .get()
        .then(snap => {
          this.todayCount = snap.size;
        });
    }
  }
};
</script>
