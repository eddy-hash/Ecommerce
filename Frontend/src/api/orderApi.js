import client from './client'

export const orderApi = {
  create:    (items) => client.post('/orders', { items }).then(r => r.data),
  mine:      ()      => client.get('/orders/mine').then(r => r.data),
  pay:       (id)    => client.post(`/orders/${id}/pay`).then(r => r.data),

  received:  ()      => client.get('/orders/received').then(r => r.data),
  stats:     ()      => client.get('/orders/stats').then(r => r.data),
  ship:      (id)    => client.post(`/orders/${id}/ship`).then(r => r.data),
  deliver:   (id)    => client.post(`/orders/${id}/deliver`).then(r => r.data),
  cancel:    (id)    => client.post(`/orders/${id}/cancel`).then(r => r.data),
}