import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '拾光集 · 校园二手好物' }
  },
  {
    path: '/items',
    name: 'ItemList',
    component: () => import('@/views/ItemListView.vue'),
    meta: { title: '全部好物 · 拾光集' }
  },
  {
    path: '/category/:type',
    name: 'Category',
    component: () => import('@/views/CategoryView.vue'),
    meta: { title: '分类浏览 · 拾光集' }
  },
  {
    path: '/search',
    name: 'SearchResult',
    component: () => import('@/views/SearchResultView.vue'),
    meta: { title: '搜索结果 · 拾光集' }
  },
  {
    path: '/items/:id',
    name: 'ItemDetail',
    component: () => import('@/views/ItemDetailView.vue'),
    meta: { title: '商品详情 · 拾光集' }
  },
  {
    path: '/publish',
    name: 'Publish',
    component: () => import('@/views/PublishView.vue'),
    meta: { title: '发布好物 · 拾光集', requireAuth: true }
  },
  {
    path: '/edit/:id',
    name: 'EditItem',
    component: () => import('@/views/EditItemView.vue'),
    meta: { title: '编辑商品 · 拾光集', requireAuth: true }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/CartView.vue'),
    meta: { title: '购物车 · 拾光集' }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/CheckoutView.vue'),
    meta: { title: '确认订单 · 拾光集', requireAuth: true }
  },
  {
    path: '/order/:id',
    name: 'OrderDetail',
    component: () => import('@/views/OrderDetailView.vue'),
    meta: { title: '订单详情 · 拾光集', requireAuth: true }
  },
  {
    path: '/chat/:id',
    name: 'Chat',
    component: () => import('@/views/ChatView.vue'),
    meta: { title: '私信 · 拾光集', requireAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requireAuth: true },
    redirect: '/profile/publish',
    children: [
      {
        path: 'publish',
        name: 'MyPublish',
        component: () => import('@/views/MyPublishView.vue'),
        meta: { title: '我的发布 · 拾光集' }
      },
      {
        path: 'orders',
        name: 'MyOrders',
        component: () => import('@/views/MyOrderView.vue'),
        meta: { title: '我的订单 · 拾光集' }
      },
      {
        path: 'favorite',
        name: 'MyFavorite',
        component: () => import('@/views/MyFavoriteView.vue'),
        meta: { title: '我的收藏 · 拾光集' }
      },
      {
        path: 'chats',
        name: 'MyChats',
        component: () => import('@/views/ChatListView.vue'),
        meta: { title: '私信 · 拾光集' }
      },
      {
        path: 'messages',
        name: 'MyMessage',
        component: () => import('@/views/MyMessageView.vue'),
        meta: { title: '站内消息 · 拾光集' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '页面走丢了 · 拾光集' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' })
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (to.meta.requireAuth) {
    const userStore = useUserStore()
    if (!userStore.isLoggedIn) {
      userStore.openLoginDialog()
      next(from.path === to.path ? false : from.path || '/')
      return
    }
  }
  next()
})

export default router
