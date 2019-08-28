<template>
  <div class="home h-screen">
    <div class="flex h-full">
      <ul class="flex-initial rounded bg-white text-center m-4">
        <template v-for="channel in channelList">
          <channel :name="channel.id" v-bind:key="channel.id" />
        </template>
      </ul>
      <div class="flex-1 h-full">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Channel from "@/components/Channel.vue";
import firebase from "firebase";

export default {
  name: "home",
  components: {
    channel: Channel
  },
  data() {
    return {
      channelList: []
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      firebase
        .firestore()
        .collection("channels")
        .onSnapshot(snapshot => {
          this.channelList = snapshot.docs;
        });
    }
  }
};
</script>
