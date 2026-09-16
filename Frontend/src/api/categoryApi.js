import client from './client'
export const categoryApi = {
  list:   ()     => client.get('/categories').then(r => r.data),
  create: (name) => client.post('/categories', { name }).then(r => r.data),
}