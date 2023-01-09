const fs = require("fs");
const path = require("path");
class file_utility {

  static movefile(image_path) {
    console.log(image_path, 'before replace')
    var new_image_path = image_path.replace(/\\/g,'/')
    console.log(new_image_path,'2 replace')
    let pathparts = new_image_path.split("/");
    console.log(pathparts,'23');
    let filename = pathparts[pathparts.length - 1];
    console.log(filename,'45');
   
    const destinationPath = __dirname.substring(0,__dirname.length-9).replace(/\\/g,'/')+      "uploads/permanent" +
      "/" +
      filename;
      console.log(destinationPath,'56')
    fs.rename(image_path, destinationPath, function (err) {
      if (err) {
        throw err;
      }
    });
    
    return destinationPath;
  }
  static deletefile(images) {
    
    for (let i = 0; i < images.length; i++) {
      var image_path = images[i].path;
      fs.unlinkSync(image_path, (err) => {
        if (err) console.log(err);
      });
    }
  }
}
module.exports = { file_utility };
