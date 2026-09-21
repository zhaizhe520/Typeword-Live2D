# 项目架构

```txt
live2d-nuxt/
├── core/                        # 【核心层 - OOP 编程的主战场】
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
├── composables/                 # 【桥接层 - 连接 OOP Core 与 Vue UI】
│   ├── useGameCore.ts          # 桥接 TypingEngine & Live2dManager
│   └── useLLMChat.ts           # 桥接 ChatBotManager
│
├── components/                  # 【UI 组件层】
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

核心业务/引擎用 OOP 封装，上层 UI/状态用 FP 响应式桥接。

核心系统与引擎（必须面向 OOP 编程）

涉及 Live2D 渲染管理、动作队列、LLM 对话流控制器、音频播放器 等。

这些本质上是独立的“系统”，有极强的状态封装性、生命周期和内部逻辑，用 Class 写绝对是最好的选择！

Vue/Nuxt 视图层（使用 FP 组合式桥接）
# 产品需求

## 打字正确

加经验、升级

## 经验变动 

Live2D角色做出对应表情/动作可以推进剧情，像GAL一样对话 WebGL渲染角色画面

##  Live2D

大模型用来做对话交互（LLM接口） chatbot

一定等级切换live2D 模型

脚本绑定DOM v-pet-xxxx="'123'"



<details>
<summary>经验进度设计</summary>

</details>