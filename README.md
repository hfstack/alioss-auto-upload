# 阿里云oss自动上传工具

## Usage

1.package.json
``` json
autoupload: 'git+ssh://git@github.com:hfstack/alioss-auto-upload.git#1.0.1'
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
    accessKeySecret: '',
    bucket: '',
    internal: 'false', // access OSS with aliyun internal network or not, default is false. If your servers are running on aliyun too, you can set true to save lot of money.
    region: '' // oss区域 默认 oss-cn-hangzhou
  })

  await autoupload.start()
})()

```