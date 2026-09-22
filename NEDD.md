# 产品需求分析

技术选型 : vue3 + nust3 

## 英语单词 日语单词  页


## 打字与数据流动

`单词库json` → OOP 实例随机取出单词 → composable 把数据转成 Vue 响应式 → 组件 template 渲染字符

键盘事件 → 组件捕获 → 传给 composable 的 handleKeyInput → 更新 charStates（触发回弹动画）

单词全部打完 → OOP.finishWord () → exp+1，判断升级 → 存档写入 localStorage → 加载下一个单词

打错单词回弹必须打对　

语音播放单词  语音接入 大模型语音 角色虚拟语音

接入自己的 api 进行搜索 


##  Live2D 页

大模型用来做对话交互（LLM接口） chatbot

一定等级切换live2D 模型  切换


脚本绑定DOM v-pet-xxxx="'123'" live2d对应单词碎碎念


Live2D角色做出对应表情/动作可以推进剧情，像GAL一样对话 WebGL渲染角色画面 单独页面

##  经验（二元币）进度设计 什么破代称 暂定

每日签到--->二元币

作文话题题目 ----> agent分析评分----> 加经验 阈值设定

歌曲敲学单词 ---> 一首歌对应多少经验  要不给经验换个好听的名字 二元币 --->  版经验

单词听写正确 ----> 获取二元币 


## 二元币到一定数购买物品设计

live2d   购买切换 切换 

触发 Galgame剧情  ---> 这做到感情系统里面？


## 情感系统

这个要+吗? 每日签到

日历标注 ----> live2d 角色生日

越来越像app开发了


##  每个账户对应不同的进度 不是localstroge 浏览器缓存

上数据库了

## 结合 PWA (Progressive Web App) 

这是什么？