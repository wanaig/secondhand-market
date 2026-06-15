# 拾光集 · GleanCampus

> 校园二手物品交易平台 · Vue 3 + Vue CLI

一个面向校园学生的二手物品交易平台。让闲置好物在校园里再次流转。

## ✨ 项目特点

- **完整流程** 浏览 → 搜索 → 详情 → 收藏 → 发布 → 个人中心
- **27+ 组件** 12 个页面 + 15 个公共组件
- **独特视觉** Editorial Luxury 风格，奶油暖底 + 深墨绿 + 焦糖橙
- **响应式** 适配 PC + 平板 + 手机
- **纯前端** Mock.js 模拟接口，localStorage 模拟持久化

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 (Composition API) |
| 脚手架 | Vue CLI 5 |
| 路由 | Vue Router 4 |
| 状态管理 | Pinia 2 |
| UI | Element Plus 2 |
| HTTP | Axios + Mock.js |
| 样式 | SCSS |
| 字体 | DM Serif Display / Plus Jakarta Sans |

## 📁 项目结构

```
secondhand-market/
├── public/
├── src/
│   ├── api/              # 接口封装
│   ├── assets/styles/    # 全局样式 (variables / reset)
│   ├── components/       # 15 个公共组件
│   │   ├── NavBar.vue
│   │   ├── FooterBar.vue
│   │   ├── SearchBar.vue
│   │   ├── CategoryFilter.vue
│   │   ├── PriceFilter.vue
│   │   ├── SortBar.vue
│   │   ├── ItemCard.vue
│   │   ├── ImageCarousel.vue
│   │   ├── ImageUploader.vue
│   │   ├── LoginDialog.vue
│   │   ├── RegisterDialog.vue
│   │   ├── CommentList.vue
│   │   ├── SellerCard.vue
│   │   └── EmptyState.vue
│   ├── views/            # 12 个页面组件
│   │   ├── HomeView.vue
│   │   ├── ItemListView.vue
│   │   ├── CategoryView.vue
│   │   ├── SearchResultView.vue
│   │   ├── ItemDetailView.vue
│   │   ├── PublishView.vue
│   │   ├── EditItemView.vue
│   │   ├── ProfileView.vue
│   │   ├── MyPublishView.vue
│   │   ├── MyFavoriteView.vue
│   │   ├── MyMessageView.vue
│   │   └── NotFoundView.vue
│   ├── mock/             # Mock 数据
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia 状态
│   ├── utils/            # 工具函数
│   ├── App.vue
│   └── main.js
└── package.json
```

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run serve

# 构建生产包
npm run build
```

打开 http://localhost:8080 即可访问。

## 🔑 测试账号

| 用户名 | 密码 | 说明 |
|--------|------|------|
| admin  | 123456 | 默认账号 |
| demo   | 123456 | 演示账号 |

也可以通过注册创建新账号（数据存储在 localStorage）。

## 📋 功能清单

### 浏览
- [x] 首页 - Hero 区 / 分类卡 / 最新上架 / 价值主张 / CTA
- [x] 商品列表 - 筛选 / 排序 / 价格区间 / 分页
- [x] 分类浏览 - 6 大分类 / 子分类筛选
- [x] 关键词搜索 - 历史记录 / 实时筛选
- [x] 商品详情 - 图片轮播 / 留言评论 / 卖家信息 / 联系方式

### 交易
- [x] 发布商品 - 表单上传 / 图片预览 / 标签选择
- [x] 编辑商品 - 修改信息 / 上下架管理
- [x] 收藏好物 - 一键收藏 / 取消收藏 / 持久化
- [x] 联系卖家 - 联系方式弹窗

### 用户
- [x] 注册登录 - 弹窗式登录 / 注册校验
- [x] 个人中心 - 用户信息卡 / 数据统计
- [x] 我的发布 / 我的收藏 / 我的消息

### 其他
- [x] 路由守卫 - 未登录拦截
- [x] 404 页面
- [x] 响应式布局 - PC / 平板 / 手机
- [x] 页面过渡动画 / 卡片入场动画 / 悬浮交互

## 🎨 设计系统

```scss
// 主色调
$cream-100:  #FAF7F2;   // 奶油底
$ink-900:    #14201A;   // 深墨绿主文本
$accent-caramel: #C8632B;  // 焦糖橙点缀
$accent-moss:    #5A7A4E;  // 苔藓绿

// 字体
$font-display: 'DM Serif Display'  // 标题：意大利文艺风衬线
$font-sans:    'Plus Jakarta Sans' // 正文：现代简洁无衬线
$font-mono:    'JetBrains Mono'    // 数据：精确等宽
```

## 📝 学习建议

- 启动后从首页开始体验
- 使用 admin/123456 登录后体验发布、收藏、消息等功能
- 所有数据存储在浏览器 localStorage，清除浏览器数据可重置

---

Made with care for campus life · © 2025 GleanCampus
