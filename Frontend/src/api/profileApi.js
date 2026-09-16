import client from './client'

export const profileApi = {
  me: () => client.get('/profile/me').then(r => r.data),
  uploadAvatar: (file) => {
    const form = new FormData()
    form.append('file', file)
    return client.post('/profile/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
  },
  updateName: (name) => client.put('/profile/name', { name }).then(r => r.data),
}