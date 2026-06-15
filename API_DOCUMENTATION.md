# 拾光集 GleanCampus — 后端微服务 API 接口文档

> **版本**：v1.0.0
> **基础路径**：`/api`
> **协议**：HTTPS
> **数据格式**：JSON
> **字符编码**：UTF-8

---

## 目录

1. [概述](#1-概述)
2. [微服务架构](#2-微服务架构)
3. [通用规范](#3-通用规范)
4. [认证服务 Auth Service](#4-认证服务-auth-service)
5. [用户服务 User Service](#5-用户服务-user-service)
6. [商品服务 Item Service](#6-商品服务-item-service)
7. [分类服务 Category Service](#7-分类服务-category-service)
8. [购物车服务 Cart Service](#8-购物车服务-cart-service)
9. [订单服务 Order Service](#9-订单服务-order-service)
10. [收藏服务 Favorite Service](#10-收藏服务-favorite-service)
11. [消息服务 Message Service](#11-消息服务-message-service)
12. [聊天服务 Chat Service](#12-聊天服务-chat-service)
13. [数据模型](#13-数据模型)
14. [错误码参考](#14-错误码参考)
15. [附录](#15-附录)

---

## 1. 概述

### 1.1 文档说明

本文档定义了**拾光集**校园二手交易平台后端微服务的完整 API 接口规范。文档涵盖 8 个微服务模块，共计 **50+ 个接口端点**。

### 1.2 服务清单

| 服务 | 前缀 | 职责 |
|------|------|------|
| 认证服务 | `/api/auth` | 登录、注册、Token 管理 |
| 用户服务 | `/api/users` | 用户资料查询与编辑 |
| 商品服务 | `/api/items` | 商品 CRUD、搜索、评论 |
| 分类服务 | `/api/categories` | 分类与子分类查询 |
| 购物车服务 | `/api/cart` | 购物车增删改查 |
| 订单服务 | `/api/orders` | 订单创建、状态流转 |
| 收藏服务 | `/api/favorites` | 收藏增删查 |
| 消息服务 | `/api/messages` | 站内通知 |
| 聊天服务 | `/api/conversations` | 私信会话与消息 |

### 1.3 认证方式

除登录/注册接口外，所有接口均需在请求头中携带 JWT Token：

```
Authorization: Bearer <token>
```

---

## 2. 微服务架构

```
                              ┌─────────────┐
                              │   Gateway    │
                              │  /api/**     │
                              └──────┬───────┘
                                     │
        ┌────────┬────────┬──────────┼──────────┬────────┬────────┬────────┐
        ▼        ▼        ▼          ▼          ▼        ▼        ▼        ▼
   ┌────────┐┌───────┐┌────────┐┌─────────┐┌───────┐┌───────┐┌───────┐┌───────┐
   │  Auth  ││ User  ││  Item  ││Category ││ Cart  ││ Order ││Favort ││Message│
   │Service ││Service││Service ││ Service ││Service││Service││Service││Service│
   └────────┘└───────┘└────────┘└─────────┘└───────┘└───────┘└───────┘└───────┘
        │        │        │          │          │        │        │        │
        ▼        ▼        ▼          ▼          ▼        ▼        ▼        ▼
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                        PostgreSQL / MySQL                               │
   │                     (各服务独立 Schema 或独立库)                          │
   └─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 通用规范

### 3.1 响应信封格式

所有接口统一返回以下信封结构：

```jsonc
{
  "code": 0,           // 状态码，0 表示成功，非 0 表示错误
  "msg": "success",    // 状态描述
  "data": { ... }      // 响应数据（成功时）
}
```

### 3.2 分页请求参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|:----:|--------|------|
| `page` | `integer` | 否 | `1` | 页码，从 1 开始 |
| `size` | `integer` | 否 | `12` | 每页条数，最大 100 |

### 3.3 分页响应结构

```jsonc
{
  "code": 0,
  "data": {
    "list": [],          // 当前页数据数组
    "total": 100,        // 匹配总条数
    "page": 1,           // 当前页码
    "size": 12,          // 每页条数
    "totalPages": 9      // 总页数
  }
}
```

### 3.4 时间格式

所有时间字段统一使用 **ISO 8601** 格式：

```
2026-06-15T14:30:00+08:00
```

### 3.5 ID 格式

| 实体 | 格式 | 示例 |
|------|------|------|
| 用户 | `u_` + 雪花ID | `u_1800000000001` |
| 商品 | `i_` + 雪花ID | `i_1800000000001` |
| 订单 | `ORD` + 雪花ID | `ORD1800000000001` |
| 评论 | `c_` + 雪花ID | `c_1800000000001` |
| 会话 | `conv_` + 雪花ID | `conv_1800000000001` |
| 消息 | `msg_` + 雪花ID | `msg_1800000000001` |

### 3.6 HTTP 状态码映射

| 业务 code | HTTP 状态码 | 说明 |
|-----------|-------------|------|
| `0` | `200` | 成功 |
| `1001` | `401` | 未登录 / Token 过期 |
| `1002` | `401` | Token 无效 |
| `1003` | `403` | 无权限 |
| `2001` | `400` | 参数错误 |
| `2002` | `404` | 资源不存在 |
| `2003` | `409` | 资源冲突（如用户名已存在） |
| `3001` | `500` | 服务器内部错误 |

---

## 4. 认证服务 Auth Service

### 4.1 用户登录

```
POST /api/auth/login
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `username` | `string` | ✓ | 用户名 |
| `password` | `string` | ✓ | 密码 |

**请求示例：**

```json
{
  "username": "admin",
  "password": "123456"
}
```

**成功响应：**

```jsonc
{
  "code": 0,
  "msg": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "u_1800000000001",
      "username": "admin",
      "nickname": "拾光君",
      "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=admin",
      "campus": "中心校区",
      "phone": "",
      "createTime": "2026-01-01T00:00:00+08:00"
    }
  }
}
```

**错误响应：**

```jsonc
{ "code": 2001, "msg": "用户名或密码错误" }
```

---

### 4.2 用户注册

```
POST /api/auth/register
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `username` | `string` | ✓ | 用户名，唯一 |
| `password` | `string` | ✓ | 密码，至少 6 位 |
| `nickname` | `string` | 否 | 昵称，默认等于用户名 |
| `campus` | `string` | 否 | 校区，默认"中心校区" |
| `phone` | `string` | 否 | 手机号 |

**请求示例：**

```json
{
  "username": "zhangsan",
  "password": "abc123",
  "nickname": "张三",
  "campus": "东校区",
  "phone": "13800138000"
}
```

**成功响应：**

```jsonc
{
  "code": 0,
  "msg": "注册成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "u_1800000000002",
      "username": "zhangsan",
      "nickname": "张三",
      "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=zhangsan",
      "campus": "东校区",
      "phone": "13800138000",
      "createTime": "2026-06-15T14:30:00+08:00"
    }
  }
}
```

**错误响应：**

```jsonc
{ "code": 2003, "msg": "用户名已存在" }
```

---

### 4.3 刷新 Token

```
POST /api/auth/refresh
```

**请求头：**

```
Authorization: Bearer <old_token>
```

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...(new)"
  }
}
```

---

### 4.4 退出登录

```
POST /api/auth/logout
```

**请求头：**

```
Authorization: Bearer <token>
```

**成功响应：**

```jsonc
{ "code": 0, "msg": "退出成功" }
```

---

## 5. 用户服务 User Service

### 5.1 获取当前用户信息

```
GET /api/users/me
```

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "id": "u_1800000000001",
    "username": "admin",
    "nickname": "拾光君",
    "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=admin",
    "campus": "中心校区",
    "phone": "",
    "createTime": "2026-01-01T00:00:00+08:00",
    "stats": {
      "publishedCount": 5,
      "orderCount": 12,
      "favoriteCount": 8,
      "chatCount": 3
    }
  }
}
```

---

### 5.2 获取指定用户公开信息

```
GET /api/users/:id
```

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 用户 ID |

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "id": "u_1800000000001",
    "nickname": "拾光君",
    "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=admin",
    "campus": "中心校区",
    "createTime": "2026-01-01T00:00:00+08:00",
    "stats": {
      "publishedCount": 5,
      "soldCount": 3
    }
  }
}
```

---

### 5.3 更新当前用户资料

```
PUT /api/users/me
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `nickname` | `string` | 否 | 昵称，最多 20 字 |
| `avatar` | `string` | 否 | 头像 URL |
| `campus` | `string` | 否 | 校区 |
| `phone` | `string` | 否 | 手机号 |

**请求示例：**

```json
{
  "nickname": "新昵称",
  "campus": "南校区"
}
```

**成功响应：**

```jsonc
{
  "code": 0,
  "msg": "更新成功",
  "data": {
    "id": "u_1800000000001",
    "username": "admin",
    "nickname": "新昵称",
    "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=admin",
    "campus": "南校区",
    "phone": "",
    "createTime": "2026-01-01T00:00:00+08:00"
  }
}
```

---

### 5.4 修改密码

```
PUT /api/users/me/password
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `oldPassword` | `string` | ✓ | 原密码 |
| `newPassword` | `string` | ✓ | 新密码，至少 6 位 |

**成功响应：**

```jsonc
{ "code": 0, "msg": "密码修改成功" }
```

**错误响应：**

```jsonc
{ "code": 2001, "msg": "原密码错误" }
```

---

### 5.5 上传头像

```
POST /api/users/me/avatar
```

**请求格式：** `multipart/form-data`

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `file` | `File` | ✓ | 图片文件，支持 jpg/png/webp，最大 2MB |

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "url": "https://cdn.gleancampus.com/avatars/u_1800000000001.jpg"
  }
}
```

---

## 6. 商品服务 Item Service

### 6.1 获取商品列表

```
GET /api/items
```

**查询参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|:----:|--------|------|
| `category` | `string` | 否 | - | 分类 key，不传或传 `all` 为全部 |
| `keyword` | `string` | 否 | - | 搜索关键词，匹配标题/描述/子分类 |
| `sort` | `string` | 否 | `latest` | 排序方式：`latest` / `priceAsc` / `priceDesc` / `hot` |
| `minPrice` | `number` | 否 | `0` | 最低价格 |
| `maxPrice` | `number` | 否 | `999999` | 最高价格 |
| `condition` | `string` | 否 | - | 成色筛选 |
| `sellerId` | `string` | 否 | - | 卖家 ID 筛选 |
| `status` | `string` | 否 | `on` | 商品状态：`on` / `off` / `sold` |
| `page` | `integer` | 否 | `1` | 页码 |
| `size` | `integer` | 否 | `12` | 每页条数 |

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": "i_1800000000001",
        "title": "高等数学同济第七版 上下册",
        "category": "books",
        "categoryName": "教材书籍",
        "sub": "考研教材",
        "price": 25,
        "originalPrice": 89,
        "condition": "9成新",
        "cover": "https://picsum.photos/seed/books-1-0/800/800",
        "images": [
          "https://picsum.photos/seed/books-1-0/800/800",
          "https://picsum.photos/seed/books-1-1/800/800",
          "https://picsum.photos/seed/books-1-2/800/800"
        ],
        "description": "高数上下册，有少量笔记标注...",
        "sellerId": "u_1800000000001",
        "sellerName": "拾光君",
        "sellerAvatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=admin",
        "sellerCampus": "中心校区",
        "sellerContact": "WeChat: glean_admin",
        "views": 156,
        "favorites": 23,
        "status": "on",
        "tags": ["可面交", "支持邮寄"],
        "createdAt": "2026-06-10T09:00:00+08:00",
        "commentCount": 5
      }
    ],
    "total": 30,
    "page": 1,
    "size": 12,
    "totalPages": 3
  }
}
```

---

### 6.2 获取商品详情

```
GET /api/items/:id
```

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 商品 ID |

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "id": "i_1800000000001",
    "title": "高等数学同济第七版 上下册",
    "category": "books",
    "categoryName": "教材书籍",
    "sub": "考研教材",
    "price": 25,
    "originalPrice": 89,
    "condition": "9成新",
    "cover": "https://picsum.photos/seed/books-1-0/800/800",
    "images": [
      "https://picsum.photos/seed/books-1-0/800/800",
      "https://picsum.photos/seed/books-1-1/800/800",
      "https://picsum.photos/seed/books-1-2/800/800"
    ],
    "description": "高数上下册，有少量笔记标注，不影响阅读。考完研用不上了，低价出。",
    "sellerId": "u_1800000000001",
    "sellerName": "拾光君",
    "sellerAvatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=admin",
    "sellerCampus": "中心校区",
    "sellerContact": "WeChat: glean_admin",
    "views": 157,
    "favorites": 23,
    "status": "on",
    "tags": ["可面交", "支持邮寄"],
    "createdAt": "2026-06-10T09:00:00+08:00",
    "comments": [
      {
        "id": "c_1800000000001",
        "userId": "u_1800000000002",
        "nickname": "小拾",
        "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=demo",
        "content": "还在吗？能便宜点吗？",
        "time": "2026-06-12T10:30:00+08:00"
      }
    ],
    "isFavorited": false
  }
}
```

**错误响应：**

```jsonc
{ "code": 2002, "msg": "商品不存在" }
```

> **注意**：每次访问会自动将 `views` +1

---

### 6.3 发布商品

```
POST /api/items
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `title` | `string` | ✓ | 商品标题，最多 40 字 |
| `category` | `string` | ✓ | 分类 key |
| `categoryName` | `string` | ✓ | 分类中文名 |
| `sub` | `string` | ✓ | 子分类名 |
| `price` | `number` | ✓ | 售价（元） |
| `originalPrice` | `number` | 否 | 原价 |
| `condition` | `string` | ✓ | 成色：全新 / 99新 / 95新 / 9成新 / 8成新 |
| `images` | `string[]` | ✓ | 图片 URL 数组，1-9 张 |
| `description` | `string` | ✓ | 商品描述，最多 500 字 |
| `tags` | `string[]` | 否 | 交易方式标签 |

**请求示例：**

```json
{
  "title": "高等数学同济第七版 上下册",
  "category": "books",
  "categoryName": "教材书籍",
  "sub": "考研教材",
  "price": 25,
  "originalPrice": 89,
  "condition": "9成新",
  "images": [
    "https://cdn.gleancampus.com/items/i_001_1.jpg",
    "https://cdn.gleancampus.com/items/i_001_2.jpg"
  ],
  "description": "高数上下册，有少量笔记标注...",
  "tags": ["可面交", "支持邮寄"]
}
```

**成功响应：**

```jsonc
{
  "code": 0,
  "msg": "发布成功",
  "data": {
    "id": "i_1800000000031",
    "title": "高等数学同济第七版 上下册",
    // ... 完整商品对象
    "sellerId": "u_1800000000001",
    "sellerName": "拾光君",
    "sellerAvatar": "...",
    "sellerCampus": "中心校区",
    "sellerContact": "WeChat: glean_admin",
    "views": 0,
    "favorites": 0,
    "status": "on",
    "createdAt": "2026-06-15T14:30:00+08:00",
    "comments": []
  }
}
```

> **注意**：`sellerId`、`sellerName`、`sellerAvatar`、`sellerCampus`、`sellerContact` 从当前登录用户信息自动获取，无需前端传入。

---

### 6.4 编辑商品

```
PUT /api/items/:id
```

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 商品 ID |

**请求体：** 部分更新，只需传入要修改的字段

```json
{
  "title": "高等数学同济第七版 上下册（修订版）",
  "price": 20,
  "status": "off"
}
```

**成功响应：**

```jsonc
{
  "code": 0,
  "msg": "更新成功",
  "data": { /* 完整商品对象 */ }
}
```

**错误响应：**

```jsonc
{ "code": 2002, "msg": "商品不存在" }
{ "code": 1003, "msg": "无权修改此商品" }
```

---

### 6.5 删除商品

```
DELETE /api/items/:id
```

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 商品 ID |

**成功响应：**

```jsonc
{ "code": 0, "msg": "删除成功" }
```

**错误响应：**

```jsonc
{ "code": 2002, "msg": "商品不存在" }
{ "code": 1003, "msg": "无权删除此商品" }
```

---

### 6.6 商品上下架

```
PUT /api/items/:id/status
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `status` | `string` | ✓ | `on`（上架） / `off`（下架） |

**成功响应：**

```jsonc
{
  "code": 0,
  "msg": "操作成功",
  "data": { "id": "i_1800000000001", "status": "off" }
}
```

---

### 6.7 获取商品评论列表

```
GET /api/items/:id/comments
```

**查询参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|:----:|--------|------|
| `page` | `integer` | 否 | `1` | 页码 |
| `size` | `integer` | 否 | `20` | 每页条数 |

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": "c_1800000000001",
        "userId": "u_1800000000002",
        "nickname": "小拾",
        "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=demo",
        "content": "还在吗？能便宜点吗？",
        "time": "2026-06-12T10:30:00+08:00"
      }
    ],
    "total": 5,
    "page": 1,
    "size": 20
  }
}
```

---

### 6.8 发表评论

```
POST /api/items/:id/comments
```

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 商品 ID |

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `content` | `string` | ✓ | 评论内容 |

> **注意**：`userId`、`nickname`、`avatar` 从当前登录用户自动获取。

**成功响应：**

```jsonc
{
  "code": 0,
  "msg": "评论成功",
  "data": {
    "id": "c_1800000000002",
    "userId": "u_1800000000001",
    "nickname": "拾光君",
    "avatar": "https://api.dicebear.com/7.x/lorelei/svg?seed=admin",
    "content": "价格可以商量，私信我",
    "time": "2026-06-15T15:00:00+08:00"
  }
}
```

---

### 6.9 上传商品图片

```
POST /api/items/images
```

**请求格式：** `multipart/form-data`

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `files` | `File[]` | ✓ | 图片文件数组，最多 9 张，单张最大 5MB |

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "urls": [
      "https://cdn.gleancampus.com/items/i_001_1.jpg",
      "https://cdn.gleancampus.com/items/i_001_2.jpg"
    ]
  }
}
```

---

## 7. 分类服务 Category Service

### 7.1 获取所有分类

```
GET /api/categories
```

**成功响应：**

```jsonc
{
  "code": 0,
  "data": [
    {
      "key": "books",
      "name": "教材书籍",
      "icon": "📖",
      "sub": ["考研教材", "专业课本", "四六级", "课外书"]
    },
    {
      "key": "digital",
      "name": "数码电子",
      "icon": "💻",
      "sub": ["手机", "电脑", "平板", "耳机", "相机", "配件"]
    },
    {
      "key": "life",
      "name": "生活用品",
      "icon": "🏠",
      "sub": ["家具", "厨电", "收纳", "灯饰", "清洁"]
    },
    {
      "key": "fashion",
      "name": "服饰鞋包",
      "icon": "👕",
      "sub": ["上装", "下装", "鞋", "包", "配饰"]
    },
    {
      "key": "sports",
      "name": "运动户外",
      "icon": "⚽",
      "sub": ["球类", "健身", "户外", "骑行"]
    },
    {
      "key": "others",
      "name": "其他好物",
      "icon": "🎁",
      "sub": ["乐器", "文具", "美妆", "票券", "杂项"]
    }
  ]
}
```

---

### 7.2 获取单个分类详情

```
GET /api/categories/:key
```

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `key` | `string` | 分类 key |

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "key": "books",
    "name": "教材书籍",
    "icon": "📖",
    "sub": ["考研教材", "专业课本", "四六级", "课外书"],
    "itemCount": 45
  }
}
```

---

## 8. 购物车服务 Cart Service

### 8.1 获取购物车列表

```
GET /api/cart
```

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "items": [
      {
        "id": "cart_1800000000001",
        "itemId": "i_1800000000001",
        "title": "高等数学同济第七版",
        "price": 25,
        "cover": "https://picsum.photos/seed/books-1-0/800/800",
        "condition": "9成新",
        "categoryName": "教材书籍",
        "sellerId": "u_1800000000001",
        "sellerName": "拾光君",
        "sellerAvatar": "...",
        "addedAt": "2026-06-15T10:00:00+08:00"
      }
    ],
    "count": 3,
    "totalPrice": 275
  }
}
```

---

### 8.2 添加商品到购物车

```
POST /api/cart
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `itemId` | `string` | ✓ | 商品 ID |

**成功响应：**

```jsonc
{
  "code": 0,
  "msg": "已加入购物车",
  "data": {
    "id": "cart_1800000000002",
    "itemId": "i_1800000000001",
    "title": "高等数学同济第七版",
    "price": 25,
    "cover": "...",
    "addedAt": "2026-06-15T14:30:00+08:00"
  }
}
```

**错误响应：**

```jsonc
{ "code": 2003, "msg": "该商品已在购物车中" }
{ "code": 2002, "msg": "商品不存在" }
{ "code": 2001, "msg": "不能将自己的商品加入购物车" }
```

---

### 8.3 从购物车移除商品

```
DELETE /api/cart/:itemId
```

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `itemId` | `string` | 商品 ID |

**成功响应：**

```jsonc
{ "code": 0, "msg": "已移除" }
```

---

### 8.4 批量移除购物车商品

```
DELETE /api/cart/batch
```

**请求体：**

```json
{
  "itemIds": ["i_1800000000001", "i_1800000000002"]
}
```

**成功响应：**

```jsonc
{ "code": 0, "msg": "已移除 2 件商品" }
```

---

### 8.5 清空购物车

```
DELETE /api/cart
```

**成功响应：**

```jsonc
{ "code": 0, "msg": "购物车已清空" }
```

---

### 8.6 检查商品是否在购物车

```
GET /api/cart/check/:itemId
```

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "inCart": true
  }
}
```

---

## 9. 订单服务 Order Service

### 9.1 创建订单

```
POST /api/orders
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `itemIds` | `string[]` | ✓ | 商品 ID 数组（来自购物车） |
| `address` | `string` | ✓ | 交易地址 / 收货地址 |
| `tradeMethod` | `string` | ✓ | 交易方式：`meet`（面交） / `express`（快递） / `pickup`（自提） |
| `note` | `string` | 否 | 买家留言 |

**请求示例：**

```json
{
  "itemIds": ["i_1800000000001", "i_1800000000002"],
  "address": "中心校区图书馆门口",
  "tradeMethod": "meet",
  "note": "周六下午方便交易"
}
```

**成功响应：**

```jsonc
{
  "code": 0,
  "msg": "下单成功",
  "data": {
    "id": "ORD1800000000001",
    "buyerId": "u_1800000000001",
    "buyerName": "拾光君",
    "buyerAvatar": "...",
    "buyerCampus": "中心校区",
    "items": [
      {
        "id": "i_1800000000001",
        "title": "高等数学同济第七版",
        "price": 25,
        "cover": "...",
        "condition": "9成新",
        "categoryName": "教材书籍",
        "sellerId": "u_1800000000002",
        "sellerName": "小拾",
        "sellerAvatar": "..."
      }
    ],
    "totalPrice": 275,
    "address": "中心校区图书馆门口",
    "tradeMethod": "meet",
    "note": "周六下午方便交易",
    "status": "pending",
    "statusText": "待卖家确认",
    "createdAt": "2026-06-15T14:30:00+08:00",
    "timeline": [
      {
        "time": "2026-06-15T14:30:00+08:00",
        "text": "订单已创建",
        "type": "created"
      }
    ]
  }
}
```

> **注意**：创建订单后，购物车中对应商品自动移除。

---

### 9.2 获取我的订单（买家）

```
GET /api/orders
```

**查询参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|:----:|--------|------|
| `status` | `string` | 否 | `all` | 状态筛选：`all` / `pending` / `confirmed` / `completed` / `cancelled` |
| `page` | `integer` | 否 | `1` | 页码 |
| `size` | `integer` | 否 | `10` | 每页条数 |

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": "ORD1800000000001",
        "items": [
          {
            "id": "i_1800000000001",
            "title": "高等数学同济第七版",
            "price": 25,
            "cover": "...",
            "condition": "9成新"
          }
        ],
        "totalPrice": 275,
        "status": "pending",
        "statusText": "待卖家确认",
        "sellerName": "小拾",
        "sellerAvatar": "...",
        "createdAt": "2026-06-15T14:30:00+08:00"
      }
    ],
    "total": 12,
    "page": 1,
    "size": 10,
    "counts": {
      "all": 12,
      "pending": 3,
      "confirmed": 2,
      "completed": 5,
      "cancelled": 2
    }
  }
}
```

---

### 9.3 获取我的销售（卖家）

```
GET /api/orders/sales
```

**查询参数：** 同"获取我的订单"

**成功响应：** 结构同上

---

### 9.4 获取订单详情

```
GET /api/orders/:id
```

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "id": "ORD1800000000001",
    "buyerId": "u_1800000000001",
    "buyerName": "拾光君",
    "buyerAvatar": "...",
    "buyerCampus": "中心校区",
    "sellerId": "u_1800000000002",
    "sellerName": "小拾",
    "sellerAvatar": "...",
    "items": [
      {
        "id": "i_1800000000001",
        "title": "高等数学同济第七版",
        "price": 25,
        "cover": "...",
        "condition": "9成新",
        "categoryName": "教材书籍"
      }
    ],
    "totalPrice": 275,
    "address": "中心校区图书馆门口",
    "tradeMethod": "meet",
    "note": "周六下午方便交易",
    "status": "pending",
    "statusText": "待卖家确认",
    "createdAt": "2026-06-15T14:30:00+08:00",
    "timeline": [
      {
        "time": "2026-06-15T14:30:00+08:00",
        "text": "订单已创建",
        "type": "created"
      }
    ]
  }
}
```

---

### 9.5 确认订单（卖家）

```
PUT /api/orders/:id/confirm
```

**说明**：卖家确认订单，状态从 `pending` 变为 `confirmed`。

**成功响应：**

```jsonc
{
  "code": 0,
  "msg": "已确认",
  "data": {
    "id": "ORD1800000000001",
    "status": "confirmed",
    "statusText": "卖家已确认",
    "timeline": [
      { "time": "2026-06-15T14:30:00+08:00", "text": "订单已创建", "type": "created" },
      { "time": "2026-06-15T16:00:00+08:00", "text": "卖家已确认", "type": "confirmed" }
    ]
  }
}
```

---

### 9.6 完成订单

```
PUT /api/orders/:id/complete
```

**说明**：买家确认收货，状态从 `confirmed` 变为 `completed`。

**成功响应：**

```jsonc
{
  "code": 0,
  "msg": "交易完成",
  "data": {
    "id": "ORD1800000000001",
    "status": "completed",
    "statusText": "交易完成",
    "timeline": [
      { "time": "...", "text": "订单已创建", "type": "created" },
      { "time": "...", "text": "卖家已确认", "type": "confirmed" },
      { "time": "...", "text": "交易完成", "type": "completed" }
    ]
  }
}
```

---

### 9.7 取消订单

```
PUT /api/orders/:id/cancel
```

**说明**：买家取消订单，状态从 `pending` 变为 `cancelled`。

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `reason` | `string` | 否 | 取消原因 |

**成功响应：**

```jsonc
{
  "code": 0,
  "msg": "已取消",
  "data": {
    "id": "ORD1800000000001",
    "status": "cancelled",
    "statusText": "已取消",
    "timeline": [
      { "time": "...", "text": "订单已创建", "type": "created" },
      { "time": "...", "text": "买家取消了订单", "type": "cancelled" }
    ]
  }
}
```

---

### 9.8 订单状态流转规则

```
  pending ──(卖家确认)──▶ confirmed ──(买家收货)──▶ completed
     │
     └──(买家取消)──▶ cancelled
```

| 当前状态 | 允许操作 | 目标状态 | 操作人 |
|----------|----------|----------|--------|
| `pending` | 确认 | `confirmed` | 卖家 |
| `pending` | 取消 | `cancelled` | 买家 |
| `confirmed` | 完成 | `completed` | 买家 |

---

## 10. 收藏服务 Favorite Service

### 10.1 获取收藏列表

```
GET /api/favorites
```

**查询参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|:----:|--------|------|
| `page` | `integer` | 否 | `1` | 页码 |
| `size` | `integer` | 否 | `12` | 每页条数 |

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": "fav_1800000000001",
        "itemId": "i_1800000000001",
        "title": "高等数学同济第七版",
        "price": 25,
        "originalPrice": 89,
        "condition": "9成新",
        "cover": "...",
        "categoryName": "教材书籍",
        "sellerName": "拾光君",
        "sellerAvatar": "...",
        "sellerCampus": "中心校区",
        "favoritedAt": "2026-06-15T10:00:00+08:00"
      }
    ],
    "total": 8,
    "page": 1,
    "size": 12
  }
}
```

---

### 10.2 添加收藏

```
POST /api/favorites
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `itemId` | `string` | ✓ | 商品 ID |

**成功响应：**

```jsonc
{
  "code": 0,
  "msg": "已收藏",
  "data": {
    "id": "fav_1800000000002",
    "itemId": "i_1800000000001",
    "favoritedAt": "2026-06-15T14:30:00+08:00"
  }
}
```

**错误响应：**

```jsonc
{ "code": 2003, "msg": "已收藏过该商品" }
```

---

### 10.3 取消收藏

```
DELETE /api/favorites/:itemId
```

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `itemId` | `string` | 商品 ID |

**成功响应：**

```jsonc
{ "code": 0, "msg": "已取消收藏" }
```

---

### 10.4 检查是否已收藏

```
GET /api/favorites/check/:itemId
```

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "isFavorited": true,
    "favoriteId": "fav_1800000000001"
  }
}
```

---

### 10.5 批量取消收藏

```
DELETE /api/favorites/batch
```

**请求体：**

```json
{
  "itemIds": ["i_1800000000001", "i_1800000000002"]
}
```

**成功响应：**

```jsonc
{ "code": 0, "msg": "已取消 2 个收藏" }
```

---

## 11. 消息服务 Message Service

### 11.1 获取站内消息列表

```
GET /api/messages
```

**查询参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|:----:|--------|------|
| `type` | `string` | 否 | `all` | 消息类型：`all` / `comment` / `favorite` / `system` |
| `read` | `boolean` | 否 | - | 已读状态筛选 |
| `page` | `integer` | 否 | `1` | 页码 |
| `size` | `integer` | 否 | `20` | 每页条数 |

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": "m_1800000000001",
        "type": "comment",
        "title": "有人评论了你的商品",
        "content": "\"这个价格能再低点吗？\"",
        "link": "/items/i_1800000000001",
        "read": false,
        "createdAt": "2026-06-15T14:30:00+08:00"
      },
      {
        "id": "m_1800000000002",
        "type": "favorite",
        "title": "有人收藏了你的商品",
        "content": "用户 小拾 收藏了你的 \"高等数学同济第七版\"",
        "link": "/items/i_1800000000001",
        "read": false,
        "createdAt": "2026-06-15T12:00:00+08:00"
      },
      {
        "id": "m_1800000000003",
        "type": "system",
        "title": "欢迎加入拾光集",
        "content": "你的账号已注册成功，快去发布你的第一件好物吧！",
        "link": "/publish",
        "read": true,
        "createdAt": "2026-06-14T10:00:00+08:00"
      }
    ],
    "total": 4,
    "unreadCount": 2,
    "page": 1,
    "size": 20
  }
}
```

---

### 11.2 标记单条消息已读

```
PUT /api/messages/:id/read
```

**成功响应：**

```jsonc
{ "code": 0, "msg": "已标记已读" }
```

---

### 11.3 标记全部消息已读

```
PUT /api/messages/read-all
```

**成功响应：**

```jsonc
{ "code": 0, "msg": "已全部标记已读" }
```

---

### 11.4 删除消息

```
DELETE /api/messages/:id
```

**成功响应：**

```jsonc
{ "code": 0, "msg": "已删除" }
```

---

### 11.5 清空消息

```
DELETE /api/messages
```

**成功响应：**

```jsonc
{ "code": 0, "msg": "已清空" }
```

---

### 11.6 获取未读消息数

```
GET /api/messages/unread-count
```

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "total": 5,
    "byType": {
      "comment": 2,
      "favorite": 1,
      "system": 2
    }
  }
}
```

---

## 12. 聊天服务 Chat Service

### 12.1 获取会话列表

```
GET /api/conversations
```

**查询参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|:----:|--------|------|
| `page` | `integer` | 否 | `1` | 页码 |
| `size` | `integer` | 否 | `20` | 每页条数 |

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": "conv_1800000000001",
        "otherUser": {
          "id": "u_1800000000002",
          "nickname": "小拾",
          "avatar": "...",
          "campus": "东校区"
        },
        "item": {
          "id": "i_1800000000001",
          "title": "高等数学同济第七版",
          "cover": "...",
          "price": 25
        },
        "lastMessage": "好的，周六图书馆门口见",
        "lastTime": "2026-06-15T15:00:00+08:00",
        "unreadCount": 2,
        "createdAt": "2026-06-15T10:00:00+08:00"
      }
    ],
    "total": 3,
    "unreadTotal": 5,
    "page": 1,
    "size": 20
  }
}
```

---

### 12.2 获取或创建会话

```
POST /api/conversations
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `otherUserId` | `string` | ✓ | 对方用户 ID |
| `itemId` | `string` | ✓ | 关联商品 ID |

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "id": "conv_1800000000001",
    "otherUser": {
      "id": "u_1800000000002",
      "nickname": "小拾",
      "avatar": "...",
      "campus": "东校区"
    },
    "item": {
      "id": "i_1800000000001",
      "title": "高等数学同济第七版",
      "cover": "...",
      "price": 25
    },
    "messages": [],
    "createdAt": "2026-06-15T14:30:00+08:00"
  }
}
```

---

### 12.3 获取会话详情

```
GET /api/conversations/:id
```

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "id": "conv_1800000000001",
    "otherUser": {
      "id": "u_1800000000002",
      "nickname": "小拾",
      "avatar": "...",
      "campus": "东校区"
    },
    "item": {
      "id": "i_1800000000001",
      "title": "高等数学同济第七版",
      "cover": "...",
      "price": 25
    },
    "messages": [
      {
        "id": "msg_1800000000001",
        "content": "你好，请问还在吗？",
        "isMine": true,
        "time": "2026-06-15T10:00:00+08:00",
        "read": true
      },
      {
        "id": "msg_1800000000002",
        "content": "在的，你想要吗？",
        "isMine": false,
        "time": "2026-06-15T10:05:00+08:00",
        "read": true
      }
    ],
    "createdAt": "2026-06-15T10:00:00+08:00"
  }
}
```

---

### 12.4 获取会话消息列表（分页）

```
GET /api/conversations/:id/messages
```

**查询参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|:----:|--------|------|
| `page` | `integer` | 否 | `1` | 页码 |
| `size` | `integer` | 否 | `50` | 每页条数 |
| `before` | `string` | 否 | - | 分页游标，加载更早的消息 |

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": "msg_1800000000001",
        "content": "你好，请问还在吗？",
        "isMine": true,
        "time": "2026-06-15T10:00:00+08:00",
        "read": true
      }
    ],
    "total": 15,
    "page": 1,
    "size": 50,
    "hasMore": false
  }
}
```

---

### 12.5 发送消息

```
POST /api/conversations/:id/messages
```

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 会话 ID |

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `content` | `string` | ✓ | 消息内容，最多 500 字 |

**成功响应：**

```jsonc
{
  "code": 0,
  "data": {
    "id": "msg_1800000000003",
    "content": "好的，周六图书馆门口见",
    "isMine": true,
    "time": "2026-06-15T15:00:00+08:00",
    "read": false
  }
}
```

**WebSocket 推送：** 发送成功后，通过 WebSocket 向对方推送新消息事件。

---

### 12.6 标记会话已读

```
PUT /api/conversations/:id/read
```

**成功响应：**

```jsonc
{ "code": 0, "msg": "已标记已读" }
```

---

### 12.7 删除会话

```
DELETE /api/conversations/:id
```

**成功响应：**

```jsonc
{ "code": 0, "msg": "会话已删除" }
```

---

### 12.8 WebSocket 消息推送

**连接地址：**

```
wss://api.gleancampus.com/ws?token=<jwt_token>
```

**推送事件类型：**

| 事件 | 说明 | 数据格式 |
|------|------|----------|
| `new_message` | 收到新消息 | `{ conversationId, message: MessageObject }` |
| `message_read` | 对方已读 | `{ conversationId }` |
| `order_status` | 订单状态变更 | `{ orderId, status, statusText }` |
| `new_favorite` | 商品被收藏 | `{ itemId, itemTitle, userId, userName }` |
| `new_comment` | 商品被评论 | `{ itemId, itemTitle, userId, userName, content }` |

**客户端发送心跳：**

```jsonc
{ "type": "ping" }
```

**服务端响应：**

```jsonc
{ "type": "pong" }
```

---

## 13. 数据模型

### 13.1 User（用户）

```sql
CREATE TABLE users (
  id          VARCHAR(32) PRIMARY KEY,
  username    VARCHAR(50) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,        -- bcrypt 加密存储
  nickname    VARCHAR(50) NOT NULL,
  avatar      VARCHAR(500) DEFAULT '',
  campus      VARCHAR(50) DEFAULT '中心校区',
  phone       VARCHAR(20) DEFAULT '',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `id` | `string` | - | 主键，雪花算法生成 |
| `username` | `string` | ✓ | 用户名，唯一 |
| `password` | `string` | ✓ | bcrypt 加密密码 |
| `nickname` | `string` | ✓ | 昵称 |
| `avatar` | `string` | 否 | 头像 URL |
| `campus` | `string` | 否 | 校区 |
| `phone` | `string` | 否 | 手机号 |
| `created_at` | `timestamp` | - | 创建时间 |
| `updated_at` | `timestamp` | - | 更新时间 |

---

### 13.2 Item（商品）

```sql
CREATE TABLE items (
  id              VARCHAR(32) PRIMARY KEY,
  title           VARCHAR(100) NOT NULL,
  category        VARCHAR(20) NOT NULL,
  category_name   VARCHAR(20) NOT NULL,
  sub             VARCHAR(50) NOT NULL,
  price           DECIMAL(10,2) NOT NULL,
  original_price  DECIMAL(10,2),
  condition       VARCHAR(10) NOT NULL,
  cover           VARCHAR(500),
  images          JSON,                      -- ["url1", "url2", ...]
  description     TEXT,
  seller_id       VARCHAR(32) NOT NULL,
  views           INT DEFAULT 0,
  favorites       INT DEFAULT 0,
  status          VARCHAR(10) DEFAULT 'on',  -- on / off / sold
  tags            JSON,                      -- ["可面交", "支持邮寄"]
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id)
);
```

---

### 13.3 Comment（评论）

```sql
CREATE TABLE comments (
  id        VARCHAR(32) PRIMARY KEY,
  item_id   VARCHAR(32) NOT NULL,
  user_id   VARCHAR(32) NOT NULL,
  content   TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

### 13.4 CartItem（购物车）

```sql
CREATE TABLE cart_items (
  id        VARCHAR(32) PRIMARY KEY,
  user_id   VARCHAR(32) NOT NULL,
  item_id   VARCHAR(32) NOT NULL,
  added_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, item_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (item_id) REFERENCES items(id)
);
```

---

### 13.5 Order（订单）

```sql
CREATE TABLE orders (
  id            VARCHAR(32) PRIMARY KEY,
  buyer_id      VARCHAR(32) NOT NULL,
  address       VARCHAR(500) NOT NULL,
  trade_method  VARCHAR(20) NOT NULL,        -- meet / express / pickup
  note          VARCHAR(500) DEFAULT '',
  total_price   DECIMAL(10,2) NOT NULL,
  status        VARCHAR(20) DEFAULT 'pending', -- pending / confirmed / completed / cancelled
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id          VARCHAR(32) PRIMARY KEY,
  order_id    VARCHAR(32) NOT NULL,
  item_id     VARCHAR(32) NOT NULL,
  seller_id   VARCHAR(32) NOT NULL,
  title       VARCHAR(100),
  price       DECIMAL(10,2),
  cover       VARCHAR(500),
  condition   VARCHAR(10),
  category_name VARCHAR(20),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id),
  FOREIGN KEY (seller_id) REFERENCES users(id)
);
```

---

### 13.6 Favorite（收藏）

```sql
CREATE TABLE favorites (
  id        VARCHAR(32) PRIMARY KEY,
  user_id   VARCHAR(32) NOT NULL,
  item_id   VARCHAR(32) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, item_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);
```

---

### 13.7 Conversation（会话）

```sql
CREATE TABLE conversations (
  id          VARCHAR(32) PRIMARY KEY,
  user_a_id   VARCHAR(32) NOT NULL,
  user_b_id   VARCHAR(32) NOT NULL,
  item_id     VARCHAR(32),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_a_id) REFERENCES users(id),
  FOREIGN KEY (user_b_id) REFERENCES users(id),
  FOREIGN KEY (item_id) REFERENCES items(id)
);
```

---

### 13.8 Message（消息）

```sql
CREATE TABLE messages (
  id              VARCHAR(32) PRIMARY KEY,
  conversation_id VARCHAR(32) NOT NULL,
  sender_id       VARCHAR(32) NOT NULL,
  content         TEXT NOT NULL,
  read            BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id)
);
```

---

### 13.9 Notification（通知）

```sql
CREATE TABLE notifications (
  id        VARCHAR(32) PRIMARY KEY,
  user_id   VARCHAR(32) NOT NULL,
  type      VARCHAR(20) NOT NULL,        -- comment / favorite / system
  title     VARCHAR(100) NOT NULL,
  content   TEXT,
  link      VARCHAR(500),
  read      BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 14. 错误码参考

| 错误码 | HTTP 状态码 | 说明 | 常见场景 |
|--------|-------------|------|----------|
| `0` | `200` | 成功 | - |
| `1001` | `401` | 未登录 | 未携带 Token |
| `1002` | `401` | Token 无效或过期 | Token 格式错误 / 已过期 |
| `1003` | `403` | 无权限操作 | 修改他人商品 |
| `2001` | `400` | 参数错误 | 缺少必填字段 / 格式错误 |
| `2002` | `404` | 资源不存在 | 商品/订单/用户不存在 |
| `2003` | `409` | 资源冲突 | 用户名重复 / 重复收藏 |
| `2004` | `400` | 状态不允许 | 已取消的订单无法确认 |
| `3001` | `500` | 服务器内部错误 | 数据库异常 |
| `3002` | `503` | 服务不可用 | 服务维护中 |

**统一错误响应格式：**

```jsonc
{
  "code": 2002,
  "msg": "商品不存在",
  "data": null
}
```

---

## 15. 附录

### 15.1 枚举值参考

**商品分类（category）：**

| key | 中文名 |
|-----|--------|
| `books` | 教材书籍 |
| `digital` | 数码电子 |
| `life` | 生活用品 |
| `fashion` | 服饰鞋包 |
| `sports` | 运动户外 |
| `others` | 其他好物 |

**商品成色（condition）：**

| 值 | 说明 |
|----|------|
| `全新` | 未使用，有包装 |
| `99新` | 几乎无使用痕迹 |
| `95新` | 轻微使用痕迹 |
| `9成新` | 有一定使用痕迹 |
| `8成新` | 明显使用痕迹 |

**商品状态（status）：**

| 值 | 说明 |
|----|------|
| `on` | 在售 |
| `off` | 已下架 |
| `sold` | 已售出 |

**排序方式（sort）：**

| 值 | 说明 |
|----|------|
| `latest` | 最新发布 |
| `priceAsc` | 价格升序 |
| `priceDesc` | 价格降序 |
| `hot` | 最热（浏览量降序） |

**订单状态（status）：**

| 值 | 中文 | 说明 |
|----|------|------|
| `pending` | 待确认 | 等待卖家确认 |
| `confirmed` | 已确认 | 卖家已确认，等待交易 |
| `completed` | 已完成 | 交易完成 |
| `cancelled` | 已取消 | 买家取消 |

**交易方式（tradeMethod）：**

| 值 | 说明 |
|----|------|
| `meet` | 校内面交 |
| `express` | 快递邮寄 |
| `pickup` | 自提 |

**消息类型（type）：**

| 值 | 说明 |
|----|------|
| `comment` | 评论通知 |
| `favorite` | 收藏通知 |
| `system` | 系统消息 |

**校区列表（campus）：**

| 值 |
|----|
| `东校区` |
| `南校区` |
| `西校区` |
| `北校区` |
| `中心校区` |

---

### 15.2 请求头规范

| 请求头 | 必填 | 说明 |
|--------|:----:|------|
| `Content-Type` | ✓ | `application/json`（默认） |
| `Authorization` | ✓* | `Bearer <token>`（除登录/注册外） |
| `Accept-Language` | 否 | `zh-CN`（默认） |

---

### 15.3 接口总览

| # | 方法 | 接口 | 说明 | 认证 |
|---|------|------|------|:----:|
| 1 | POST | `/api/auth/login` | 登录 | ✗ |
| 2 | POST | `/api/auth/register` | 注册 | ✗ |
| 3 | POST | `/api/auth/refresh` | 刷新 Token | ✓ |
| 4 | POST | `/api/auth/logout` | 退出 | ✓ |
| 5 | GET | `/api/users/me` | 获取当前用户 | ✓ |
| 6 | GET | `/api/users/:id` | 获取用户公开信息 | ✗ |
| 7 | PUT | `/api/users/me` | 更新资料 | ✓ |
| 8 | PUT | `/api/users/me/password` | 修改密码 | ✓ |
| 9 | POST | `/api/users/me/avatar` | 上传头像 | ✓ |
| 10 | GET | `/api/items` | 商品列表 | ✗ |
| 11 | GET | `/api/items/:id` | 商品详情 | ✗ |
| 12 | POST | `/api/items` | 发布商品 | ✓ |
| 13 | PUT | `/api/items/:id` | 编辑商品 | ✓ |
| 14 | DELETE | `/api/items/:id` | 删除商品 | ✓ |
| 15 | PUT | `/api/items/:id/status` | 上下架 | ✓ |
| 16 | GET | `/api/items/:id/comments` | 评论列表 | ✗ |
| 17 | POST | `/api/items/:id/comments` | 发表评论 | ✓ |
| 18 | POST | `/api/items/images` | 上传图片 | ✓ |
| 19 | GET | `/api/categories` | 全部分类 | ✗ |
| 20 | GET | `/api/categories/:key` | 分类详情 | ✗ |
| 21 | GET | `/api/cart` | 购物车列表 | ✓ |
| 22 | POST | `/api/cart` | 加入购物车 | ✓ |
| 23 | DELETE | `/api/cart/:itemId` | 移除商品 | ✓ |
| 24 | DELETE | `/api/cart/batch` | 批量移除 | ✓ |
| 25 | DELETE | `/api/cart` | 清空购物车 | ✓ |
| 26 | GET | `/api/cart/check/:itemId` | 检查是否在购物车 | ✓ |
| 27 | POST | `/api/orders` | 创建订单 | ✓ |
| 28 | GET | `/api/orders` | 我的订单 | ✓ |
| 29 | GET | `/api/orders/sales` | 我的销售 | ✓ |
| 30 | GET | `/api/orders/:id` | 订单详情 | ✓ |
| 31 | PUT | `/api/orders/:id/confirm` | 确认订单 | ✓ |
| 32 | PUT | `/api/orders/:id/complete` | 完成订单 | ✓ |
| 33 | PUT | `/api/orders/:id/cancel` | 取消订单 | ✓ |
| 34 | GET | `/api/favorites` | 收藏列表 | ✓ |
| 35 | POST | `/api/favorites` | 添加收藏 | ✓ |
| 36 | DELETE | `/api/favorites/:itemId` | 取消收藏 | ✓ |
| 37 | GET | `/api/favorites/check/:itemId` | 检查是否收藏 | ✓ |
| 38 | DELETE | `/api/favorites/batch` | 批量取消 | ✓ |
| 39 | GET | `/api/messages` | 消息列表 | ✓ |
| 40 | PUT | `/api/messages/:id/read` | 标记已读 | ✓ |
| 41 | PUT | `/api/messages/read-all` | 全部已读 | ✓ |
| 42 | DELETE | `/api/messages/:id` | 删除消息 | ✓ |
| 43 | DELETE | `/api/messages` | 清空消息 | ✓ |
| 44 | GET | `/api/messages/unread-count` | 未读数 | ✓ |
| 45 | GET | `/api/conversations` | 会话列表 | ✓ |
| 46 | POST | `/api/conversations` | 创建/获取会话 | ✓ |
| 47 | GET | `/api/conversations/:id` | 会话详情 | ✓ |
| 48 | GET | `/api/conversations/:id/messages` | 消息列表 | ✓ |
| 49 | POST | `/api/conversations/:id/messages` | 发送消息 | ✓ |
| 50 | PUT | `/api/conversations/:id/read` | 标记已读 | ✓ |
| 51 | DELETE | `/api/conversations/:id` | 删除会话 | ✓ |

---

> **文档版本**：v1.0.0
> **最后更新**：2026-06-15
> **维护者**：拾光集开发团队
