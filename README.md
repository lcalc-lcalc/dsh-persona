# dsh-persona

给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的插件：在左侧栏「新会话」下方加入「人设」入口，用可视化页面管理 AI 的系统提示词（人设），并控制模型是否使用中文思维链。

## 功能

- **多套人设**：新建、重命名、编辑、删除，随时切换。
- **默认人设**：设为默认后立即生效，并自动带入每一个新对话。
- **中文思维链**：开关式引导，要求模型在内部推理中使用简体中文，先拆解再作答；提示词可在「高级」里自定义。
- **即改即生效**：读写走 Harness 的 Settings 服务，保存后下一个模型请求就使用新人设，无需重启。
- **主题一致**：只使用宿主 `--dsw-alias-*` 设计变量，自适应浅色 / 深色，并尊重 `prefers-reduced-motion`。

## 安装

在 Harness 里通过插件管理器安装本包（推荐），或一行命令装进某个 profile（会自动登记 `dsh.profile.bundles`）：

```bash
dsh plugin --profile web add github:lcalc-lcalc/dsh-persona
```

也可以先 clone 再安装本地目录（适合改代码）：

```bash
git clone https://github.com/lcalc-lcalc/dsh-persona
dsh plugin --profile web add ./dsh-persona
```

> 桌面版（`desktop` profile）由 Electron 独占，CLI 不能直接写入；请在 Harness 的「插件」页面安装，或按下面的方式手工登记。

然后在 profile 的 `package.json` 中确认：

```json
{
  "dependencies": { "dsh-persona": "file:/path/to/dsh-persona" },
  "dsh": { "profile": { "bundles": ["@deepseek-ai/dsh-base", "@deepseek-ai/dsh-web-app", "dsh-persona"] } }
}
```

用 `link` / 目录联接安装时，注意本包对 `@deepseek-ai/schemastery` 的解析：打包安装会从 profile 解析；链接安装若解析不到，会自动回退到包内 `vendor/` 副本。

## 使用

1. 左侧栏点「人设」。
2. 在左列选择或新建一套人设。
3. 编辑名称与提示词；需要中文推理时保持「中文思维链」开启。
4. 点「保存」写入配置；点卡片上的星标或编辑器右上角的「设为默认」把它设为新对话的默认人设。

默认人设是示例文本（`seed.js`），请替换成你自己的内容。

## 工作原理

Agent preset 已经在其作用域里注册了 `deployment:persona-prefix`，所以本插件不注册同名 section，而是在 `system-prompt/assemble` 瀑布中改写这一段文本：

- 替换人设段的文字，保留原有的顺序与插值设置；人设为空时整段移除。
- 子代理会话（带 `parentSessionId`）保持自己的委派人设，不受影响。
- 文本在每次组装时读取实时 Config，因此修改对已有对话与新对话都立即生效。

配置字段（均为可热更字段）：

| 字段 | 说明 |
|---|---|
| `personas` | `{ id, name, prompt }[]`，人设列表 |
| `activeId` | 当前默认人设的 `id` |
| `chineseCot` | 是否注入中文思维链要求 |
| `cotPrompt` | 中文思维链要求的文本 |

## 目录

| 文件 | 作用 |
|---|---|
| `index.js` | Host 半：可热更 Config + 提示词瀑布改写 |
| `client.js` | 浏览器半：侧边栏图标与主面板页面（`window.__ModuleLoader__` 懒加载工厂） |
| `cordis.patch.yml` | 组合补丁：插入 `persona` 行 |
| `seed.js` | 示例人设文本 |
| `vendor/` | `schemastery` 与 `cosmokit` 的副本，用于链接安装时的依赖回退（MIT，见各自 LICENSE） |
| `locale/*.json` | 插件管理器显示的标题与描述 |

## 彩蛋

- 页面底部有一行很小很小的「彻柑可可制作 · Made by Chegan Coco」，鼠标放上去爱心会跳一下。
- 保存成功时，提示语会在「已保存 / 记下啦～ / 人设已就位 ✨」里随机挑一句。
- 打开开发者工具，控制台里留了一行签名。

fork 之后欢迎把署名换成你自己——毕竟这行字是给会看页脚的人看的。

## 已知限制

- 若某个 Agent preset 使用 `complete: true` 的完整提示词段，该段会在瀑布之后覆盖人设改写。
- 页面需要宿主提供可编辑的 `persona` 配置项；若插件行未启用，页面会显示「人设插件尚未激活」。

## License

MIT © dsh-persona contributors
