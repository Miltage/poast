export default {
  detectContentType: function() {
    if (this.data.content.includes("youtube.com")) return "youtube";
    return "image";
  }
};
