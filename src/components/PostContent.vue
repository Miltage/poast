<template>
  <div v-if="isLoading" class="px-6 py-4 flex items-center justify-center">
    <img id="loading" class="w-8" src="../assets/icons/loading.svg" />
  </div>
  <div v-else>
    <img v-if="contentType == 'image'" class="w-full" :src="url" :alt="url" />
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
  </div>
</template>

<script>
import shared from "../shared";

export default {
  name: "PostBody",
  props: {
    url: String
  },
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    contentType: shared.detectContentType
  },
  asyncComputed: {
    trackId() {
      if (!this.url) return null;
      if (this.contentType != "soundcloud") return null;

      return new Promise(resolve => {
        fetch(
          "https://soundcloud.com/oembed?url=" +
            encodeURI(this.url) +
            "&format=json"
        ).then(response => {
          return response.json().then(json => {
            resolve(json.html.match(/tracks%2F(.*?)&/s)[1]);
          });
        });
      });
    }
  },

  methods: {
    getYouTubeID() {
      var idregex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i;
      this.isLoading = false;
      return this.url.match(idregex)[1];
    },

    getSoundcloudID() {
      fetch(
        "https://soundcloud.com/oembed?url=" +
          encodeURI(this.url) +
          "&format=json"
      ).then(response => {
        return response.json().then(json => {
          this.trackId = json.html.match(/tracks%2F(.*?)&/s)[1];
        });
      });
    }
  }
};
</script>

<style>
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
