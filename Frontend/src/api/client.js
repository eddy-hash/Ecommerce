import axios from 'axios'

const client = axios.create({ baseURL: '/api' })

client.interceptors.request.use((config) => {
  const url = config.url || ''
  const method = (config.method || 'get').toLowerCase()

  const isAuthRoute = url.startsWith('/auth/')

  const isPublicGet =
    method === 'get' &&
    !url.startsWith('/products/mine') &&
    (url === '/products' ||
     url.startsWith('/products?') ||
     /^\/products\/\d+(\?|$)/.test(url) ||
     url.startsWith('/categories') ||
     url.startsWith('/traders') ||
     url.startsWith('/files'))

  if (!isAuthRoute && !isPublicGet) {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = 'Bearer ' + token
  }

  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default client
