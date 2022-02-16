# Pixiv Collector
Pixiv画作收集GUI，用于人工筛选画作，以构建特定范围的画作数据库。

[Pixiv画作收集服务端](https://github.com/pmisu/Pixiv-Collector-Server)

WIP

# 使用
## 设置
使用前需要在菜单->设置中进行一些设置：

![](https://s2.loli.net/2022/02/16/fY3TJQNeUFbKnyP.png)

`Proxy`为请求Pixiv API与图片url代理。

`Collector Server`为画作收集服务端地址，不经过代理。

`Pixiv API Request Interval`为连续拉取数据时的请求间隔，单位毫秒。

暂时使用Refresh Token登录，获取可参考[Retrieving Auth Token (with Selenium)](https://gist.github.com/upbit/6edda27cb1644e94183291109b8a5fde)，后续考虑改进。

## 搜索
登录后默认拉取推荐列表：

![](https://s2.loli.net/2022/02/16/FXhErvsLpVZaNw6.png)

搜索：

![](https://s2.loli.net/2022/02/16/E9Gul2yKQs4CxpJ.png)

按收藏量筛选时，将拉取一页并过滤不符合条件者，如果未满一页则会继续拉取，直到数量满一页或无数据为止。

## 快捷键

|   操作   | 快捷键 |
| -------- | ------- |
| 返回   | Esc / A |
| 收录   | C       |
| 取消收录 | V       |

# 感谢
[PixivPy](https://github.com/upbit/pixivpy)

[Puerts](https://github.com/Tencent/puerts)

[fairygui-puerts-unity](https://github.com/fy0/fairygui-puerts-unity)
