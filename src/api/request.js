import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 8000
})

request.interceptors.response.use(
  res => {
    const data = res.data
    if (data && data.code === 0) return data
    return Promise.reject(new Error(data?.msg || '请求失败'))
  },
  err => Promise.reject(err)
)

export default request
