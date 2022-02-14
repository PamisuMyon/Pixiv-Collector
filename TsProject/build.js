var fs = require('fs');
var path = require('path');
var copyFolderRecursiveSync = require('./copyJsFile').copyFolderRecursiveSync;

var outputFolder = 'output';
var targetFolder = '../Assets/BundleResources/TypeScripts';

// https://esbuild.github.io/api/#build-api
var options = {
    bundle: true,
    entryPoints: ["src/app.ts"],
    incremental: true,
    minify: process.env.NODE_ENV === "production",
    outfile: outputFolder + "/bundle.js",
    platform: "node",
    tsconfig: "./tsconfig.json",
    sourcemap: process.env.NODE_ENV === "production" ? false : true,
    external: ['csharp', 'puerts', 'path', 'fs'],
    target: 'es2020',
    treeShaking: true,
    logLevel: 'error'
};

// Watch mode
var watchMode = false;
for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] == 'watch') {
        watchMode = true;
        break;
    }
}

if (watchMode) {
    options.watch = {
        onRebuild(error, result) {
            if (error) {
                console.error('watch build failed:', error);
            } else {
                copyFolderRecursiveSync(outputFolder, targetFolder);
                console.log('watch build succeeded:', result);
            }
        }
    }
} else if (process.env.NODE_ENV === "production") {
    // 正式打包时将删除输出目录下所有文件
    const fs = require('fs');
    const path = require('path');
    fs.rmSync(path.dirname(options.outfile), { recursive: true, force: true })
}

require('esbuild').build(options)
    .then(() => {
        copyFolderRecursiveSync(outputFolder, targetFolder);
    })
    .then(() => {
        if (watchMode)
            console.log('👀Watching...');
        else {
            console.log('🔨Build finished.');
            process.exit(0);
        }
    });