var fs = require('fs');
// var path = require('path');
var fork = require('child_process').fork;
var directories = ["../db/combined", "../db/fb_pages"];
var filesToRemove = ["../db/pages", "../db/stats"];

directories = directories.map(function(d){
  return __dirname + "/" + d;
})

filesToRemove = filesToRemove.map(function(d){
  return __dirname + "/"+ d;
})

for(var i = 0; i < filesToRemove.length; i++){
  removeFile(filesToRemove[i]);
}

for(var i = 0; i < directories.length; i++){
	rmAllInDir(directories[i], true);
}

var child = fork(__dirname + '/addPage');

function removeFile(filePath){
  fs.access(filePath, fs.F_OK, function(err) {
      if (!err) {
          fs.unlinkSync(filePath);
          console.log("Removed " + filePath);
      } else {
          // It isn't accessible
      }
  });
  console.log("Removed file ", filePath)
}

function rmAllInDir(dirPath, topDir) {
  try { var files = fs.readdirSync(dirPath); }
  catch(e) { return; }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile())
        fs.unlinkSync(filePath);
      else
        rmAllInDir(filePath, false);
    }
    if(!topDir){
		fs.rmdirSync(dirPath);    	
    }
    console.log("Removed files in directory " + dirPath)
};