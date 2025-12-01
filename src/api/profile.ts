// src/api/profile.ts
import { supabase } from './client'
import type { Profile } from './type'

export const profileAPI = {
  getMyProfile: async (): Promise<Profile> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Chưa đăng nhập')

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, qr_code, created_at')
    .eq('id', user.id)           // tường minh: chỉ lấy của mình
    .single()

  if (error) throw error
  return data
},


  // getAllProfile: async (): Promise<Profile> => {
  //   const { data, error } = await supabase
  //     .from('profiles')
  //     .select('*')
  //     .single()
  //   if (error) throw error
  //   return data
  // },

  updateProfile: async (updates: Partial<Profile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
    if (error) throw error
    return data
  },

  uploadAvatar: async (file: File | Blob) => {
    const userId = (await supabase.auth.getUser()).data.user?.id
    const fileExt = file.type.split('/')[1] || 'png'
    const fileName = `${userId}/avatar.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    await profileAPI.updateProfile({ avatar_url: publicUrl })
    return publicUrl
  },

  // Cập nhật thông tin trong auth.users (password, phone, birthdate...)
  updateAuthUser: async (updates: {
    password?: string
    phone?: string
    user_metadata?: { birth_date?: string; full_name?: string }
  }) => {
    const { data, error } = await supabase.auth.updateUser(updates)
    if (error) throw error
    return data
  },
}