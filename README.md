# LibSongInfo

一个 BetterNCM 插件，用于向其他插件提供获取原生正在播放音乐的信息。

## 简便使用方法

为保障加载插件顺序，请先在 `manifest.json` 的 `loadAfter` 数组中加入本依赖 ID `libsonginfo`。

获取正在播放的音乐信息：

```javascript
loadedPlugins.libsonginfo.getPlaying(); // 调用获取
console.log(loadedPlugins.libsonginfo.trackPlaying); // 直接获取属性
```

监听播放中的音乐的变更，回调内可以再次调用上方的 `getPlaying()` 或 `trackPlaying` 来获取最新的音乐信息。

```javascript
loadedPlugins.libsonginfo.addEventListener("playing-updated", () => {});
```

### 简便函数

获取正在播放的音乐 ID，如果为 `0` 则为未找到：

```javascript
loadedPlugins.libsonginfo.getMusicId();
```

获取当前播放状态，返回 `1` 则为正在播放，返回 `2` 则为暂停中：

```javascript
loadedPlugins.libsonginfo.playState();
```

更多 API 请参阅源代码
