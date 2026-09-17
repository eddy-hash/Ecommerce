import client from './client'

export const adminApi = {
  stats:         ()         => client.get('/admin/stats').then(r => r.data),
  users:         ()         => client.get('/admin/users').then(r => r.data),
  verify:        (id)       => client.post(`/admin/users/${id}/verify`).then(r => r.data),
  deleteUser:    (id)       => client.delete(`/admin/users/${id}`),
  products:      ()         => client.get('/admin/products').then(r => r.data),
  deleteProduct: (id)       => client.delete(`/admin/products/${id}`),
  orders:        ()         => client.get('/admin/orders').then(r => r.data),
}