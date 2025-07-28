import { client } from "./client"

export const authApi = {
  // Login user
  login: async (data: { email: string; password: string }) => {
    const res = await client.auth.login.$post(data)
    return await res.json()
  },

  // Sign up user
  signup: async (data: { name: string; email: string; password: string }) => {
    const res = await client.auth.signup.$post(data)
    return await res.json()
  },

  // Get user by ID
  getUser: async (id: number) => {
    const res = await client.auth.getUser.$get({ id })
    return await res.json()
  },

  // Update user profile
  updateUser: async (data: { id: number; name?: string; avatar?: string }) => {
    const res = await client.auth.updateUser.$post(data)
    return await res.json()
  },

  // Change password
  changePassword: async (data: { id: number; currentPassword: string; newPassword: string }) => {
    const res = await client.auth.changePassword.$post(data)
    return await res.json()
  },
} 