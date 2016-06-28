export const getImageDimension = (url, callback) => {
  var img = new Image();
  img.onload = function () {
    callback({
      width: this.width,
      height: this.height
    });
  };
  img.src = url;
};
