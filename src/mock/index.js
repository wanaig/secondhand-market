// ============================================
//  GleanCampus · Mock 数据接口
// ============================================
import Mock from 'mockjs'

const Random = Mock.Random

// —— 分类 ——
const categories = [
  { key: 'books',     name: '教材书籍', icon: '〔 书 〕', sub: ['考研教材', '专业课本', '四六级', '课外书'] },
  { key: 'digital',   name: '数码电子', icon: '〔 码 〕', sub: ['手机', '电脑', '平板', '耳机', '相机', '配件'] },
  { key: 'life',      name: '生活用品', icon: '〔 居 〕', sub: ['家具', '厨电', '收纳', '灯饰', '清洁'] },
  { key: 'fashion',   name: '服饰鞋包', icon: '〔 衣 〕', sub: ['上装', '下装', '鞋', '包', '配饰'] },
  { key: 'sports',    name: '运动户外', icon: '〔 动 〕', sub: ['球类', '健身', '户外', '骑行'] },
  { key: 'others',    name: '其他好物', icon: '〔 杂 〕', sub: ['乐器', '文具', '美妆', '票券', '杂项'] }
]

const titlesByCategory = {
  books: [
    '《算法导论》第三版 几乎全新', '考研数学张宇全套含笔记', '微积分教材 同济第七版',
    '英语四六级真题集 含听力', '考研政治肖秀荣全套', '《围城》钱钟书 精装'
  ],
  digital: [
    '9成新 iPad Air 5 紫色 256G', '索尼WH-1000XM4 降噪耳机', 'MacBook Pro 2021 M1Pro 16寸',
    '罗技 MX Master 3S 无线鼠标', '机械键盘 Cherry MX 红轴', '佳能 EOS R6 微单相机',
    'Apple Watch S8 GPS版', '小米平板6 Pro 128G'
  ],
  life: [
    '宜家比尔书桌 白色 九成新', '小米台灯 Pro 护眼版', '宿舍迷你冰箱 美的50L',
    '飞利浦空气炸锅 HD9651', '保温杯 膳魔师 500ml', '美式滴漏咖啡机',
    '宜家穆多床头柜', '加湿器 大容量3L'
  ],
  fashion: [
    'Nike Air Force 1 白色 42码', '北面双肩包 26L 黑色', 'ZARA 碎花连衣裙 S码',
    '优衣库羽绒服 男 M码', '玛丽珍鞋 36码 仅试穿', 'Crocs 洞洞鞋 39码',
    '帆布托特包 全新未拆'
  ],
  sports: [
    '捷安特 ATX660 自行车 墨绿', '尤尼克斯羽毛球拍 ARC-7', '运动哑铃套装 30kg',
    'Switch 健身环大冒险套装', '瑜伽垫 加厚防滑 紫色', '李宁羽毛球鞋 41码'
  ],
  others: [
    '雅马哈 F310 民谣吉他', '油画初学者套装', '卡西欧 fx-991CNX 计算器',
    '飞利浦电动牙刷 HX6730', '蓝牙音箱 JBL Flip5', '便当盒 玻璃双层'
  ]
}

const conditions = ['全新', '99新', '95新', '9成新', '8成新']
const campuses = ['东校区', '南校区', '西校区', '北校区', '中心校区']

// 评论模板
const commentTemplates = [
  '同学，请问这个还在吗？可以私信我吗？',
  '价格能再便宜点不？我可以自取~',
  '看起来成色非常好，明天有空看实物吗？',
  '这个型号很经典啊，我之前也用过，真的好评。',
  '位置在哪个校区？我这边不方便跨校区。',
  '很喜欢这个配色，请问还有原盒吗？',
  '介意分期吗？我学生党经费有限~',
  '可以走闲鱼担保交易吗？比较放心。',
  '已收藏，等周末来看哦！',
  '私聊了请注意查收。'
]

// —— 用户池（评论/卖家用） ——
const userPool = Array.from({ length: 12 }).map((_, i) => ({
  id: 'u' + (i + 1),
  nickname: ['林夏', '柚子', '南鸢', '青衫', '漫漫', '阿吉', '牧野', '清欢', '风铃', '陆离', '夏目', '橘子'][i],
  avatar: `https://api.dicebear.com/7.x/lorelei/svg?seed=glean${i + 1}`,
  campus: campuses[i % campuses.length],
  contact: `WeChat: glean_${i + 1}`,
  joined: Random.date('yyyy-MM-dd')
}))

// —— 生成 30 条商品数据 ——
function generateItems() {
  const list = []
  let id = 1
  categories.forEach(cat => {
    const titles = titlesByCategory[cat.key]
    titles.forEach(title => {
      const seller = userPool[Random.integer(0, userPool.length - 1)]
      const imgCount = Random.integer(3, 5)
      const seedBase = `${cat.key}-${id}`
      const images = Array.from({ length: imgCount }).map((_, idx) =>
        `https://picsum.photos/seed/${seedBase}-${idx}/800/800`
      )
      const price = Random.integer(15, 4500)
      const original = price + Random.integer(50, 1500)
      list.push({
        id: 'i' + id,
        title,
        category: cat.key,
        categoryName: cat.name,
        sub: cat.sub[Random.integer(0, cat.sub.length - 1)],
        price,
        originalPrice: original,
        condition: conditions[Random.integer(0, conditions.length - 1)],
        cover: images[0],
        images,
        description: `这件「${title}」自己使用过一段时间，状态良好，几乎没有明显使用痕迹。\n出二手主要因为搬寝、毕业、换新。诚意出，可面交也可寄送，价格可小刀，不刀勿扰~`,
        sellerId: seller.id,
        sellerName: seller.nickname,
        sellerAvatar: seller.avatar,
        sellerCampus: seller.campus,
        sellerContact: seller.contact,
        views: Random.integer(20, 1800),
        favorites: Random.integer(0, 120),
        status: 'on',
        tags: ['可面交', Math.random() > 0.5 ? '支持邮寄' : '仅自取', Math.random() > 0.6 ? '小刀勿扰' : '价可商'],
        createdAt: Random.datetime('yyyy-MM-dd HH:mm'),
        comments: Array.from({ length: Random.integer(2, 6) }).map((__, ci) => {
          const u = userPool[Random.integer(0, userPool.length - 1)]
          return {
            id: `c-${id}-${ci}`,
            userId: u.id,
            nickname: u.nickname,
            avatar: u.avatar,
            content: commentTemplates[Random.integer(0, commentTemplates.length - 1)],
            time: Random.datetime('yyyy-MM-dd HH:mm')
          }
        })
      })
      id++
    })
  })
  return list
}

const itemsDB = generateItems()

// —— 拦截：商品列表 ——
Mock.mock(/\/api\/items(\?.*)?$/, 'get', (options) => {
  const url = new URL('http://x.com' + options.url)
  const params = url.searchParams
  const category = params.get('category')
  const keyword = (params.get('keyword') || '').trim()
  const sort = params.get('sort') || 'latest'
  const minP = parseFloat(params.get('minPrice') || '0')
  const maxP = parseFloat(params.get('maxPrice') || '999999')
  const page = parseInt(params.get('page') || '1')
  const size = parseInt(params.get('size') || '12')

  let result = itemsDB.slice()

  if (category && category !== 'all') {
    result = result.filter(i => i.category === category)
  }
  if (keyword) {
    const kw = keyword.toLowerCase()
    result = result.filter(i =>
      i.title.toLowerCase().includes(kw) ||
      i.description.toLowerCase().includes(kw) ||
      i.sub.toLowerCase().includes(kw)
    )
  }
  result = result.filter(i => i.price >= minP && i.price <= maxP)

  if (sort === 'priceAsc') result.sort((a, b) => a.price - b.price)
  else if (sort === 'priceDesc') result.sort((a, b) => b.price - a.price)
  else if (sort === 'hot') result.sort((a, b) => b.views - a.views)
  else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const total = result.length
  const start = (page - 1) * size
  const list = result.slice(start, start + size)

  return { code: 0, data: { list, total, page, size } }
})

// —— 商品详情 ——
Mock.mock(/\/api\/items\/i\d+$/, 'get', (options) => {
  const id = options.url.split('/').pop()
  const item = itemsDB.find(x => x.id === id)
  if (!item) return { code: 1, msg: '商品不存在' }
  item.views += 1
  return { code: 0, data: item }
})

// —— 创建商品 ——
Mock.mock(/\/api\/items$/, 'post', (options) => {
  const body = JSON.parse(options.body || '{}')
  const newId = 'i' + (itemsDB.length + 1 + Math.floor(Math.random() * 1000))
  const newItem = {
    id: newId,
    views: 0,
    favorites: 0,
    status: 'on',
    comments: [],
    createdAt: new Date().toLocaleString('zh-CN'),
    ...body
  }
  itemsDB.unshift(newItem)
  return { code: 0, data: newItem }
})

// —— 更新商品 ——
Mock.mock(/\/api\/items\/i\d+$/, 'put', (options) => {
  const id = options.url.split('/').pop()
  const body = JSON.parse(options.body || '{}')
  const idx = itemsDB.findIndex(x => x.id === id)
  if (idx === -1) return { code: 1, msg: '商品不存在' }
  itemsDB[idx] = { ...itemsDB[idx], ...body }
  return { code: 0, data: itemsDB[idx] }
})

// —— 删除商品 ——
Mock.mock(/\/api\/items\/i\d+$/, 'delete', (options) => {
  const id = options.url.split('/').pop()
  const idx = itemsDB.findIndex(x => x.id === id)
  if (idx > -1) itemsDB.splice(idx, 1)
  return { code: 0 }
})

// —— 分类 ——
Mock.mock(/\/api\/categories$/, 'get', () => ({
  code: 0,
  data: categories
}))

// —— 添加评论 ——
Mock.mock(/\/api\/items\/i\d+\/comments$/, 'post', (options) => {
  const id = options.url.match(/\/api\/items\/(i\d+)\/comments/)[1]
  const body = JSON.parse(options.body || '{}')
  const item = itemsDB.find(x => x.id === id)
  if (!item) return { code: 1, msg: '商品不存在' }
  const c = {
    id: 'c-' + Date.now(),
    time: new Date().toLocaleString('zh-CN'),
    ...body
  }
  item.comments.unshift(c)
  return { code: 0, data: c }
})

export { itemsDB, categories, userPool }
