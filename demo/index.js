const path  = require('path');
const TuiaAutoUpload = require('../');
const uploader = new TuiaAutoUpload({
  dir: path.join(__dirname, './dist/'),
  originDir: '/tuia/dist/'
});
uploader.start();