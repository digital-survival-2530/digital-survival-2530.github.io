const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'source', '_posts');
const imagesDir = path.join(__dirname, 'source', 'images');

function printDirectoryContents() {
  console.log(`Checking contents of posts directory: ${postsDir}`);
  fs.readdir(postsDir, (err, files) => {
    if (err) {
      console.error(`读取文章目录时出错: ${err}`);
      return;
    }
    console.log('Posts Directory Contents:', files);
  });

  console.log(`Checking contents of images directory: ${imagesDir}`);
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error(`读取图片目录时出错: ${err}`);
      return;
    }
    console.log('Images Directory Contents:', files);
  });
}

function organizeImages() {
  fs.readdir(postsDir, (err, files) => {
    if (err) {
      console.error(`读取文章目录时出错: ${err}`);
      return;
    }

    files.forEach(file => {
      if (path.extname(file) === '.md') {
        const postName = path.basename(file, '.md');
        const postDir = path.join(postsDir, postName);

        // 创建与文章同名的目录
        if (!fs.existsSync(postDir)) {
          fs.mkdirSync(postDir);
          console.log(`创建目录: ${postDir}`);
        } else {
          console.log(`目录已存在: ${postDir}`);
        }

        // 查找并移动相关图片
        fs.readdir(imagesDir, (err, imageFiles) => {
          if (err) {
            console.error(`读取图片目录时出错: ${err}`);
            return;
          }

          imageFiles.forEach(imageFile => {
            if (imageFile.startsWith(postName)) {
              const oldPath = path.join(imagesDir, imageFile);
              const newPath = path.join(postDir, imageFile);
              fs.renameSync(oldPath, newPath);
              console.log(`移动图片 ${imageFile} 到 ${postDir}`);
            }
          });

          // 更新文章中的图片路径
          const postPath = path.join(postsDir, file);
          let content = fs.readFileSync(postPath, 'utf8');
          const newContent = content.replace(new RegExp(`!\\[(.*?)\\]\\(\\/images\\/${postName}-(.*?)\\)`, 'g'), `![$1](${postName}/$2)`);

          if (content !== newContent) {
            fs.writeFileSync(postPath, newContent, 'utf8');
            console.log(`更新文章 ${file} 中的图片路径`);
          }
        });
      }
    });
  });
}

printDirectoryContents();
organizeImages();
