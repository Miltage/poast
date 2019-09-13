export default {
  detectContentType: function() {
    if (
      this.data.content.includes("youtube.com") ||
      this.data.content.includes("youtu.be")
    )
      return "youtube";
    else if (this.data.content.includes("soundcloud.com")) return "soundcloud";

    return "image";
  }
};
