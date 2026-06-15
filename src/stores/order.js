import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const KEY = 'glean_orders'

export const useOrderStore = defineStore('order', () => {
  const orders = ref(JSON.parse(localStorage.getItem(KEY) || '[]'))

  const pendingCount = computed(() => orders.value.filter(o => o.status === 'pending').length)

  function getMyOrders(userId) {
    return orders.value
      .filter(o => o.buyerId === userId)
      .sort((a, b) => b.createdAt - a.createdAt)
  }

  function getMySales(userId) {
    return orders.value
      .filter(o => o.sellerId === userId)
      .sort((a, b) => b.createdAt - a.createdAt)
  }

  function createOrder(buyer, items, address, note) {
    const orderId = 'ORD' + Date.now().toString(36).toUpperCase()
    const order = {
      id: orderId,
      buyerId: buyer.id,
      buyerName: buyer.nickname,
      buyerAvatar: buyer.avatar,
      buyerCampus: buyer.campus,
      sellerId: items[0].sellerId || 'u_seed_1',
      sellerName: items[0].sellerName,
      sellerAvatar: items[0].sellerAvatar,
      items: items.map(i => ({
        id: i.id,
        title: i.title,
        price: i.price,
        cover: i.cover,
        condition: i.condition,
        categoryName: i.categoryName
      })),
      totalPrice: items.reduce((s, i) => s + i.price, 0),
      address: address || buyer.campus + ' 面交',
      note: note || '',
      status: 'pending',
      statusText: '待卖家确认',
      createdAt: Date.now(),
      createdText: new Date().toLocaleString('zh-CN'),
      timeline: [
        { time: new Date().toLocaleString('zh-CN'), text: '订单已提交', type: 'created' }
      ]
    }
    orders.value.unshift(order)
    persist()
    return order
  }

  function updateOrderStatus(orderId, status, text) {
    const order = orders.value.find(o => o.id === orderId)
    if (!order) return
    order.status = status
    order.statusText = text
    order.timeline.push({
      time: new Date().toLocaleString('zh-CN'),
      text,
      type: status
    })
    persist()
  }

  function cancelOrder(orderId) {
    updateOrderStatus(orderId, 'cancelled', '已取消')
  }

  function confirmOrder(orderId) {
    updateOrderStatus(orderId, 'confirmed', '卖家已确认')
  }

  function completeOrder(orderId) {
    updateOrderStatus(orderId, 'completed', '交易完成')
  }

  function persist() {
    localStorage.setItem(KEY, JSON.stringify(orders.value))
  }

  return {
    orders, pendingCount,
    getMyOrders, getMySales,
    createOrder, updateOrderStatus,
    cancelOrder, confirmOrder, completeOrder
  }
})
