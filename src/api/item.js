import request from './request'

export function getItems(params) {
  return request({ url: '/items', method: 'get', params })
}

export function getItem(id) {
  return request({ url: `/items/${id}`, method: 'get' })
}

export function createItem(data) {
  return request({ url: '/items', method: 'post', data })
}

export function updateItem(id, data) {
  return request({ url: `/items/${id}`, method: 'put', data })
}

export function deleteItem(id) {
  return request({ url: `/items/${id}`, method: 'delete' })
}

export function getCategories() {
  return request({ url: '/categories', method: 'get' })
}

export function addComment(itemId, data) {
  return request({ url: `/items/${itemId}/comments`, method: 'post', data })
}
