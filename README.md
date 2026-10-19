# 项目架构

```txt
live2d-nuxt/
├── core/                        # 【核心层 - OOP 编程的主战场】处理业务逻辑
│   ├── live2d/
│   │   ├── Live2dManager.ts     # Live2D 渲染与模型加载总控类 (Class)
│   │   └── MotionController.ts  # 表情/动作队列控制器类 (Class)
│   ├── typing/
│   │   └── TypingEngine.ts      # 打字判定引擎、WPM 速率计算、正确率统计 (Class)
│   └── llm/
│       └── ChatBotManager.ts    # 大模型对话流与上下文管理类 (Class)
│
├── libs/                        # 【第三方库/SDK 封装】
│   └── live2d-sdk/             # 放置 Live2D 底层 SDK 依赖文件
│
├── composables/                 # 【桥接层 - 连接 OOP Core 与 Vue UI】 组合逻辑业务和页面渲染
│   ├── useGameCore.ts          # 桥接 TypingEngine & Live2dManager
│   └── useLLMChat.ts           # 桥接 ChatBotManager
│
├── components/                  # 【UI 组件层】 组件渲染层
│   ├── live2d/
│   │   └── Canvas.vue          # Live2D WebGL 挂载画布组件
│   └── typing/
│       ├── Keyboard.vue        # 虚拟键盘/打字反馈组件
│       └── DialogBox.vue       # GALGAME 式对话框组件
│
├── pages/                       # 【页面路由层】
│   ├── (game)/                 # 路由分组（括号不计入 URL 路径）
│   │   ├── practice.vue        # 打字练习主界面
│   │   └── story.vue           # GALGAME 剧情推图模式
│   ├── index.vue               # 首页 / 模式选择页
│   └── setting.vue             # 设置页（切换模型、配置 API Key）
│
├── server/                      # 【服务端 API (Nitro)】
│   └── api/
│       └── chat.ts             # 转发 LLM API 接口（安全隐藏 Key）
│
├── plugins/                     # 【Vue 插件】
│   └── directives.ts           # 注册你的 v-pet-xxxx 自定义指令
│
├── types/                       # 【全局 TS 类型定义】
│   └── index.d.ts              # 包含接口定义 (interface / type)
│
├── app.vue                      # 根视图组件（包含 <NuxtPage />）
└── nuxt.config.ts               # Nuxt 配置文件
```

|分层|职责|允许内容|禁止内容|
| ---- | ---- | ---- | ---- |
|core 领域层|纯规则、纯数据模型，负责业务计算|类 / 接口、纯函数、原始数据模型，选词、经验计算、升级判断等业务规则|
|composables 适配胶水层|引入core，包装为Vue响应式；处理副作用，连接领域层与视图|ref/reactive、生命周期钩子、localStorage读写、事件绑定，对外暴露状态与方法|复杂业务计算公式，核心业务规则|
|components 视图渲染层|DOM渲染、捕获用户原生事件|template页面结构、css样式、捕获键盘/点击事件，调用composables暴露的方法|业务规则计算，直接操作core领域实体|

* **TypeScript**
  * **深度要求**：全量 TypeScript 开发，需要熟练掌握类型定义、泛型、接口（Interfaces）以及 Vue 全家桶中的 TS 类型推导与扩展。
* **Nuxt 3 / Vue 3**
  * **Vue 3 Composition API**：熟练运用 `<script setup>` 语法糖，掌握 `ref`、`reactive`、`computed`、`watch` / `watchEffect` 等响应式 API。
  * **Nuxt 3 架构机制**：理解 Nuxt 的自动导入（Auto-imports）、基于文件系统的路由、服务端渲染（SSR）与静态站点生成（SSG / `nuxt generate`）。
* **UnoCSS / Tailwind CSS**
  * **原子化 CSS**：理解 Atomic CSS 设计理念，熟练掌握响应式布局、Flex/Grid 布局及主题样式的配置与扩展（见 `uno.config.ts`）。


* **Pinia (状态管理)**
  * **应用场景**：管理用户设置（音效、皮肤、快捷键）、当前打字模式、学习计划、全局进度等状态。
* **浏览器本地存储 (Browser Storage)**
  * **IndexedDB**：用于存储大容量的本地词库、文章库、错题集以及用户的历史练习记录（避免占用主线程内存）。
  * **LocalStorage / SessionStorage**：用于轻量级的持久化状态（如音量设置、界面主题切换等）。


  ### ⌨️ 打字交互与事件机制
* **DOM 键盘事件处理**：精准监听 `keydown` / `keyup` 事件，捕获键码（`event.key` / `event.code`），妥善处理退格键（Backspace）、空格（Space）、组合快捷键及防误触逻辑。
* **文本比对与高亮渲染**：实时对比“目标字符串”与“已输入字符”，计算当前 Cursor 状态，并高频驱动 UI 状态更新（如正确/错误标红/标绿）。
* **打字音效引擎**：基于 Web Audio API 或 `<audio>` 播放按键反馈音效、拼写正确/错误音效。

### 🔊 语音合成与发音 (TTS)
* **Web Speech API**：利用 `window.speechSynthesis` 进行文本转语音（TTS）朗读。
* **第三方音源集成**：理解网络音频流异步加载与缓存控制，提供标准美音/英音发音。

### 🧠 记忆算法与数据统计
* **间隔重复算法 (SRS)**：智能模式下如何结合艾宾浩斯遗忘曲线，根据用户的拼写错率、打字延迟自动安排复习频率。
* **打字指标计算**：
  * **WPM** (Words Per Minute / 每分钟词数)
  * **CPM** (Characters Per Minute / 每分钟字符数)
  * **Accuracy** (实时正确率 %)

<details>
<summary>单词与经验绑定</summary>

interface 接口 实现json 全部字段 变成 对象.value 实现在渲染层渲染



</details>