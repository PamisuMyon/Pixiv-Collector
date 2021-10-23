# Pixiv Collector
Pixiv画作收集GUI，用于人工筛选画作，以构建特定范围的画作数据库。

[Pixiv画作收集服务端](https://github.com/pmisu/Pixiv-Collector-Server)

WIP: 目前仅有UI，毫无UX，BUG较多，未做优化，考虑重构中。

# 使用
## 设置
使用前需要在左上角菜单->设置中进行一些设置：

![](https://i.loli.net/2021/10/23/X69LUY8WnzMNkAe.png)

![](https://i.loli.net/2021/10/23/Wa6GkgScloTLdCQ.png)

`Refresh Token`获取可参考[Retrieving Auth Token (with Selenium)](https://gist.github.com/upbit/6edda27cb1644e94183291109b8a5fde)

`代理`为请求Pixiv API与图片url代理，如果勾选`启用pixiv.cat图片代理`，图片url请求则不会经过这里设置的代理，而是直接请求pixiv.cat。

`收集服务`为画作收集服务端地址，不经过代理。

`接口连续请求间隔`为连续拉取数据时的请求间隔，单位秒。

## 搜索
登录后默认拉取推荐列表：

![](https://i.loli.net/2021/10/23/ve6fJ5qHhz7l1ax.png)

搜索：

![](https://i.loli.net/2021/10/23/1mUqKbuNxgvtOVJ.png)

按收藏量筛选时，将拉取一页并过滤不符合条件者，如果未满一页则会继续拉取，直到数量满一页或无数据为止。

## 收录
收录按钮可展开收录相关操作：

![](https://i.loli.net/2021/10/23/2qL3r6MHScDtVzK.png)

收录操作需要服务端支持，点击收录后将画作数据提交至画作收集服务端。

# 感谢
[PixivPy](https://github.com/upbit/pixivpy)

[xLua](https://github.com/Tencent/xLua)

[Recyclable Scroll Rect](https://github.com/MdIqubal/Recyclable-Scroll-Rect)

[Flexible Grid Layout](https://github.com/mohsinkhan26/flex-grid-layout)
