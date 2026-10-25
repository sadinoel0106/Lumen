# 开发、测试与构建

## 环境

- Node.js 24 或更高版本，npm，Git。
- Windows x64 用于桌面验收和构建当前的 NSIS 安装包。
- 核心逻辑测试也可在 Linux 上运行。macOS/Linux 安装包尚未配置或验收。

```sh
git clone https://github.com/sadinoel0106/Lumen.git
cd Lumen
npm ci
npm start
```

`npm ci` 根据锁文件安装依赖，并运行扩展准备脚本。Electron 45 的运行组件在首次启动、桌面测试或打包前由官方安装器自动下载；准备脚本会启用 Node 对环境代理的支持，也可单独执行 `npm run electron:install`。第三方扩展原始源码随仓库提供，不依赖开发者电脑上的其他文件夹，也不需要下载不固定版本的扩展。生成的 `vendor/reader-extension/` 不提交到 Git。

若使用了 `npm ci --ignore-scripts`，在运行桌面程序前自行执行 `npm run extensions:prepare`；核心测试无需下载 Electron 运行组件。需要使用不同的本地扩展源码时，可通过 `LUMEN_EXTENSION_SOURCE` 指向含 manifest.json 和原许可证的完整源码目录。

## 测试

```sh
npm test
npm run test:desktop
```

核心测试覆盖推荐排序、来源目录、翻译请求格式、公开正文核查、缓存策略、正文提取、各站前三与扩展构建。桌面测试使用本地合成文章、独立测试资料目录和模拟 API 响应，不使用真实 API 密钥，不读取日常学习资料。

可按需执行专项桌面检查：

```sh
node scripts/test-106.cjs
node scripts/navigation-test.cjs
node scripts/storage-test.cjs
node scripts/test-reader-extension.cjs
node scripts/extension-fixture-debug.cjs
```

测试生成文件位于被忽略的 `test-results/`。桌面测试会打开独立应用窗口；只在具备桌面环境的 Windows 机器上运行。少数原站/服务连通性检查仍依赖网络，不应据此声称所有媒体或付费翻译账户已通过真实内容验收。

## Windows 安装包

```sh
npm run dist
```

安装包位于 `release/Lumen-Setup-1.0.6.exe`；解包程序位于 `release/win-unpacked/Lumen.exe`，运行时需保留整个目录。构建缓存和临时文件分别位于项目内的 `build-cache/` 与 `build-tmp/`。当前不配置代码签名，构建不会自动发布到 GitHub。

`docs/workflows/` 提供可选的 GitHub Actions 模板。维护者将其复制到 `.github/workflows/` 后可启用：核心测试自动运行；Windows 打包仅手动触发，成功后生成可下载的构建附件，不自动覆盖 Releases。

## 刷新公开来源快照

```sh
node --use-env-proxy scripts/check-feeds.cjs
node --use-env-proxy scripts/check-newsroom.cjs
```

这些命令联网访问公开订阅与来源首页，并更新 data 下的快照文件。应用本身也能在界面中更新文章。快照时间不等同于文章发布时间；失败、旧快照和不足三篇应保持如实显示。

## 代码结构

| 目录 | 用途 |
| --- | --- |
| `electron/` | 桌面主进程、网络、翻译、正文提取、权限和数据存储 |
| `ui/` | 本地界面、主题、导航与学习交互 |
| `data/` | 来源目录与带出处的新闻元数据快照 |
| `scripts/` | 构建和可重复运行的检查工具 |
| `tests/` | Node 核心测试 |
| `vendor/reader-extension-source/` | 保留原许可证的第三方扩展原始源码 |

## 贡献前

修改后运行相关测试，在 pull request 中说明问题、最终行为与验证结果。不要提交 API 密钥、浏览器资料、学习备份、个人足迹、安装包或缓存。测试凭据仅使用明显的虚构值。

翻译发送必须继续遵守“只自动翻译公开文章，其他文章逐篇确认”的规则。第三方网页不得获得 Node 或本地应用 API；原文扩展只在原文持久会话中加载。推荐依据和快照范围应准确呈现，不能把启发式评分当作真实流量或事实核查。

项目自有代码采用 MIT；修改第三方部分时保留原版权与许可证，并同步更新 `THIRD_PARTY_NOTICES.md`。
