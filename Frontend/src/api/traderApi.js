import client from './client'
export const traderApi = {
  list: () => client.get('/traders').then(r => r.data),
}