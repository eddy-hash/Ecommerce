import client from './client'

export const productApi = {
  list:   (params = {}) => client.get('/products', { params }).then(r => r.data),
  get:    (id)          => client.get(`/products/${id}`).then(r => r.data),
  mine:   ()            => client.get('/products/mine').then(r => r.data),
  create: (data)        => client.post('/products', data).then(r => r.data),
  update: (id, data)    => client.put(`/products/${id}`, data).then(r => r.data),
  remove: (id)          => client.delete(`/products/${id}`).then(r => r.data),
  uploadImage: (id, file) => {
    const form = new FormData()
    form.append('file', file)
    return client.post(`/products/${id}/image`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
  },
}