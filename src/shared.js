export default {
  detectContentType: function() {
    if (
      this.data.content.includes("youtube.com") ||
      this.data.content.includes("youtu.be")
    )
      return "youtube";
    return "image";
  }
};
