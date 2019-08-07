# 阿里云oss自动上传工具

## Usage

1.package.json
``` json
autoupload: 'git@github.com:hfstack/alioss-auto-upload.git#1.0.0'
```

2.
``` javascript
const path = require('path');

const AutoUpload = require('autoupload');

(async () => {
  const autoupload = new AutoUpload({
    dir: path.join(__dirname, '../dist/'),
    originDir: '/media-external/dist/',
    accessKeyId: '',
    accessKeySecret: ''
  })

  await autoupload.start()
})()

```