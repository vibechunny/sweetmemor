// src/api/friends.ts
import { supabase } from './client'
import type { Friendship, Profile } from './type'

export const friendsAPI = {
  // Quét QR → lấy profile của người đó
  getProfileByQR: async (qrCode: string): Promise<Profile> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('qr_code', qrCode)
      .single()
    if (error) throw error
    return data
  },

  // Gửi kết bạn
  sendFriendRequest: async (friendId: string) => {
    const userId = (await supabase.auth.getUser()).data.user?.id
    const { data, error } = await supabase
      .from('friendships')
      .insert({ user_id: userId, friend_id: friendId })
      .select()
    if (error) throw error
    return data
  },

  // Chấp nhận / từ chối
  respondFriendRequest: async (requestId: string, status: 'accepted' | 'rejected') => {
    const { data, error } = await supabase
      .from('friendships')
      .update({ status })
      .eq('id', requestId)
    if (error) throw error
    return data
  },

  // Danh sách bạn bè + pending
  getFriendsList: async (): Promise<Friendship[]> => {
    const userId = (await supabase.auth.getUser()).data.user?.id
    const { data, error } = await supabase
      .from('friendships')
      .select('*, friend:friend_id (*)') // join profile bạn bè
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },
}