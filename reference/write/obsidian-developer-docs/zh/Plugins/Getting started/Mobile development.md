了解如何针对移动设备开发插件。

## 在桌面端模拟移动设备

你可以通过开发者工具直接模拟 Obsidian 在移动设备上的运行效果。

1. 打开 **开发者工具（Developer Tools）**。
2. 选择 **控制台（Console）** 标签页。
3. 输入下列内容后按 `Enter`。

   ```ts
   this.app.emulateMobile(true);
   ```

若要关闭移动模拟，输入下列内容并按 `Enter`：

```ts
this.app.emulateMobile(false);
```


> [!tip]
> 若要在开启 / 关闭移动模拟之间切换，可使用 `this.app.isMobile` 标志：
>
> ```ts
> this.app.emulateMobile(!this.app.isMobile);
> ```

## 在真实移动设备上检查 WebView

### Android

若在 Android 的开发者选项中启用 USB 调试，即可检查在 Android 设备上运行的 Obsidian。随后在桌面 / 笔记本电脑上打开基于 Chromium 的浏览器，访问 chrome://inspect/。若设置正确，在手机 / 平板通过 USB 连接电脑且浏览器停留在该地址时，应能看到设备出现，并可在其上使用常规的开发者工具。

更深入说明见：https://developer.chrome.com/docs/devtools/remote-debugging

### iOS

你可以在运行 iOS 16.4 或更高版本的设备上检查 Obsidian，并使用 macOS 电脑。设置步骤见：https://webkit.org/web-inspector/enabling-web-inspector/

## 平台相关能力

若要检测插件所处的平台，可使用 [[Platform]]：

```ts
import { Platform } from 'obsidian';

if (Platform.isIosApp) {
  // ...
}

if (Platform.isAndroidApp) {
  // ...
}
```

## 在移动设备上禁用插件

若你的插件依赖 Node.js 或 Electron API，可以阻止用户在移动设备上安装该插件。

若仅支持桌面应用，请在 [[Manifest]] 中将 `isDesktopOnly` 设为 `true`。

## 故障排除

本节列出面向移动设备开发时的常见问题。

### Node 与 Electron API

移动设备上不可用 Node.js API 与 Electron API。插件或其依赖若调用这些接口，可能导致插件崩溃。

### 正则表达式中的后向断言（Lookbehind）

正则中的后向断言仅在 iOS 16.4 及以上版本受支持，部分 iPhone 与 iPad 用户可能仍在使用更早系统。要为 iOS 用户提供回退方案，可参考上文 [[#平台相关能力]]，或使用 JavaScript 库检测具体浏览器版本。

更多信息与精确版本统计见 [Can I Use](https://caniuse.com/js-regexp-lookbehind)。查找 「Safari on iOS」。
