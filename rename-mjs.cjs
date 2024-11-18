// rename-mjs.js
const fs = require('fs');
const path = require('path');

// 指定要重命名的目录
const dir = path.join(__dirname, 'dist/esm');

// 读取目录中的所有文件
fs.readdir(dir, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }

    files.forEach(file => {
        if (file.endsWith('.js')) {
            const oldPath = path.join(dir, file);
            const newPath = path.join(dir, file.slice(0, -3) + '.mjs');
            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Renamed: ${file} -> ${path.basename(newPath)}`);
                }
            });
        }
    });
});
