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
|core 领域层|纯规则、纯数据模型，负责业务计算|类 / 接口、纯函数、原始数据模型，选词、经验计算、升级判断等业务规则|ref、DOM操作、localStorage、Vue生命周期、任何副作用，框架相关API|
|composables 适配胶水层|引入core，包装为Vue响应式；处理副作用，连接领域层与视图|ref/reactive、生命周期钩子、localStorage读写、事件绑定，对外暴露状态与方法|复杂业务计算公式，核心业务规则|
|components 视图渲染层|DOM渲染、捕获用户原生事件|template页面结构、css样式、捕获键盘/点击事件，调用composables暴露的方法|业务规则计算，直接操作core领域实体|
