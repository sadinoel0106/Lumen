# Lumen · 观读

一款面向英语学习的 Windows 桌面阅读应用。用简洁的浅色界面，连接英文媒体、大学和研究机构，在原文阅读中积累词汇、理解句子。

**[下载 Lumen 1.0.6 · Windows x64](https://github.com/sadinoel0106/Lumen/releases/download/v1.0.6/Lumen-Setup-1.0.6.exe)** · [完整源码 ZIP](https://github.com/sadinoel0106/Lumen/releases/download/v1.0.6/Lumen-Source-1.0.6.zip) · [版本说明](https://github.com/sadinoel0106/Lumen/releases/tag/v1.0.6)

项目自有源码已按 **[MIT 许可证](LICENSE)** 开源。第三方源码保留原许可证，详见 [第三方声明](THIRD_PARTY_NOTICES.md)。媒体内容、商标和外部服务的权利由各自所有者保留。

## 可以做什么

- **综合推荐**：结合时效、来源影响力、跨来源同题覆盖、前沿性与学习信号，展示可查看依据的推荐。评分是规则分析，不代表实测流量或全文事实核查。
- **各站前三**：汇总 123 个英文媒体与机构，区分首页候选和订阅顺序，并显示更新时间。网站访问限制可能导致部分来源暂时没有结果。
- **原文与双语精读**：直接阅读原站；精读视图过滤广告、导航等独立区域，将译文放在英文段落下方。分页和未加载内容会影响提取范围，界面提供相应提示。
- **划词与翻译**：查词、句段翻译，默认使用微软官方翻译网页；可配置自己的 Microsoft Translator 或 DeepL API。
- **词句本与复习**：保存词句、间隔复习、收藏文章，并支持学习资料备份与 CSV 导出。
- **阅读时随时提问**：右侧窄栏可打开 ChatGPT 官方网页，使用自己的账户；问题由你自行输入并发送。
- **便捷导航与十款主题**：连续返回上一步、返回首页，随时切换浅色配色。
- **足迹与缓存管理**：删除阅读足迹、清理各类缓存，或启用轻量存储模式。

## 安装与升级

1. 下载 **Lumen-Setup-1.0.6.exe**。
2. 关闭正在运行的旧版 Lumen，运行安装程序并选择安装目录。
3. 升级可安装到原目录；学习资料保存在独立用户资料目录，具体位置可在应用设置中查看。

适用于 **Windows x64**。安装包未配置代码签名证书。安装包的 SHA256：

```text
319AC2A1BE39F4734A6BFBCA101292EAABD4AFB10FE289FE775DC9960DF37E7B
```

## 从源码运行

需要 Node.js 24 或更高版本、npm 和 Git。桌面功能与 Windows 安装包在 Windows x64 上验收。

```sh
git clone https://github.com/sadinoel0106/Lumen.git
cd Lumen
npm ci
npm start
```

第三方扩展的原始源码已随仓库提供，安装依赖时会自动准备兼容副本。无需使用开发者电脑上的额外文件夹。

```sh
npm test               # 核心测试
npm run test:desktop   # Windows 桌面检查
npm run dist           # 构建 Windows 安装包
```

代码结构、专项测试、可选 GitHub Actions 模板和贡献说明见 [开发文档](docs/DEVELOPMENT.md)。可复现的开源快照使用标签 [`v1.0.6-source`](https://github.com/sadinoel0106/Lumen/tree/v1.0.6-source)；本页源码 ZIP 也打包自该标签。

## 数据与服务

仅确认公开可读的正文自动发送到所选翻译服务；登录后、付费或无法确认公开性的文章逐篇征求同意。API 密钥通过系统能力加密保存，学习备份不包含密钥。Microsoft Translator、DeepL 等 API 使用自己的账户，配额与费用由服务商决定。

ChatGPT 窄栏连接官方网页，需要自己的登录；不会自动发送文章或问题。关闭轻量存储模式并重启后，原文会话可加载随应用附带的第三方扩展；原许可证保留在安装资源中，效果受站点规则和网络影响。

欢迎通过 [Issues](https://github.com/sadinoel0106/Lumen/issues) 反馈问题或提出建议；也欢迎提交 pull request。反馈时请注明应用版本、操作步骤与错误提示。
