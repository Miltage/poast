export default {
  detectContentType: function() {
    if (this.url.includes("youtube.com") || this.url.includes("youtu.be"))
      return "youtube";
    else if (this.url.includes("soundcloud.com")) return "soundcloud";

    return "image";
  },

  parseContent: function(content) {
    var imgur = /https?:\/\/imgur.com\/([A-z]+)/i;
    if (content.match(imgur)) {
      return "https://i.imgur.com/" + content.match(imgur)[1] + ".jpg";
    }

    return content;
  }
};
