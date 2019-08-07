const fs = require('fs');
const path = require('path');

const OSS = require('ali-oss');

const chalk = require('chalk');
const ProgressBar = require('progress');

// const NODE_ENV = process.env.NODE_ENV;
// const isLocal = NODE_ENV === 'local' || NODE_ENV === 'development' || NODE_ENV === 'dev' || NODE_ENV === undefined;

class AliOssAutoUpload {
  constructor(props) {
    const defaultOptions = {
      dir: undefined,
      originDir: undefined,
      bucket: '',
      accessKeyId: '',
      accessKeySecret: '',
      region: 'oss-cn-hangzhou',
      internal: false // access OSS with aliyun internal network or not, default is false. If your servers are running on aliyun too, you can set true to save lot of money.
    }
    this.options = Object.assign({}, defaultOptions, props);
    if (!this.options.dir || !this.options.originDir) {
      console.log(chalk.red('缺少参数，初始化失败'))
      return;
    }
    this.init();
  }
  init() {
    this.client = new OSS({
      region: this.options.region,
      internal: this.options.internal,
      accessKeyId: this.options.accessKeyId,
      accessKeySecret: this.options.accessKeySecret,
      bucket: this.options.bucket
    });

    const startTime = new Date() * 1;

    this.bar = new ProgressBar(chalk.yellow(`  文件上传中 [:bar] :current/${this.files().length} :percent :elapseds`), {
      complete: '●',
      incomplete: '○',
      width: 20,
      total: this.files().length,
      callback: () => {
        console.log(chalk.green('\n  All complete.'));
        console.log(chalk.blue(`\n  本次队列文件共${this.files().length}个，已存在文件${this.existFiles}个，上传文件${this.uploadFiles}个，消耗时间：${parseFloat((new Date() * 1 - startTime) / 1000)} s\n`));
      }
    })
    return this;
  }
  readDirSync(dir) {
    const files = [];
    function loop(childrenDir) {
      const allFiles = fs.readdirSync(childrenDir);
      allFiles.forEach((ele, index) => {
        const info = fs.statSync(`${childrenDir}/${ele}`);
        if (info.isDirectory()) {
          loop(`${childrenDir}/${ele}`);
        } else {
          files.push(path.join(childrenDir, ele));
        }
      });
    }
    loop(dir);
    return files;
  }
  files() {
    return this.readDirSync(this.options.dir);
  }
  async start() {
    const files = this.files();

    this.existFiles = 0;
    this.uploadFiles = 0;
    this.errorFiles = 0;

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const originPath = path.join(this.options.originDir, file.replace(this.options.dir, '')).replace(/\\/g, '/');

      let originFile;

      try {
        originFile = await this.client.head(originPath);
      } catch (error) {
        originFile = error;
      }

      if (originFile.status === 404) {
        try {
          await this.client.put(originPath, file);        
          this.uploadFiles += 1;
        } catch (error) {
          console.error(error);
          process.exit(1);
        }
      } else {
        this.existFiles += 1;
      }
      this.bar.tick();
    }
  }
}

module.exports = AliOssAutoUpload;