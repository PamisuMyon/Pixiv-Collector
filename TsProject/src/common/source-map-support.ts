var csharp = require("csharp");
var puerts = require("puerts");

puerts.registerBuildinModule("path", {
    dirname(path: any) {
        return csharp.System.IO.Path.GetDirectoryName(path);
    },
    resolve(dir: any, url: any) {
        url = url.replace(/\\/g, "/");
        while (url.startsWith("../")) {
            dir = csharp.System.IO.Path.GetDirectoryName(dir);
            url = url.substr(3);
        }
        return csharp.System.IO.Path.Combine(dir, url);
    },
});
puerts.registerBuildinModule("fs", {
    existsSync(path: any) {
        return csharp.System.IO.File.Exists(path);
    },
    readFileSync(path: any) {
        return csharp.System.IO.File.ReadAllText(path);
    },
});
(function () {
    let global = this ?? globalThis;
    global["Buffer"] = global["Buffer"] ?? {};
    //使用inline-source-map模式, 需要额外安装buffer模块
    //global["Buffer"] = global["Buffer"] ?? require("buffer").Buffer;
})();

// https://www.npmjs.com/package/source-map-support
require('source-map-support').install()
// require('source-map-support').install({
//     retrieveSourceMap: function (source: string) {
//         console.log(`source-map: ${source}`);
//         if (source.endsWith('bundle.cjs')
//             || source.endsWith('bundle.js')) {
//             let mapFile = csharp.System.IO.Path.Combine(csharp.UnityEngine.Application.dataPath, '../TsProject/output/bundle.js.map');
//             if (csharp.System.IO.File.Exists(mapFile)) {
//                 return {
//                     url: source,
//                     map: csharp.System.IO.File.ReadAllText(mapFile)
//                 };
//             }
//         }
//         return null;
//     }
// });