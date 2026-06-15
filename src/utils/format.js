import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

export function formatPrice(price) {
  if (price == null) return '—'
  return Number(price).toFixed(0)
}

export function formatDate(time, format = 'YYYY-MM-DD HH:mm') {
  if (!time) return ''
  return dayjs(time).format(format)
}

export function fromNow(time) {
  if (!time) return ''
  return dayjs(time).fromNow()
}

export function maskName(name = '') {
  if (name.length <= 1) return name
  if (name.length === 2) return name[0] + '*'
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
}
