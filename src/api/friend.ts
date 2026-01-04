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

  getProfileByUsername: async (username: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, qr_code')
      .eq('username', username.trim())
      .single()
    if (error) throw error
    return { data, error }
  },
  // Gửi kết bạn
  sendFriendRequest: async (friendId: string) => {
    const userId = (await supabase.auth.getUser()).data.user?.id
    // check trùng
    const { data: existingRequest, error: checkError } = await supabase
      .from('friendships')
      .select('*')
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(friend_id.eq.${userId},user_id.eq.${friendId})`)
      .maybeSingle();

    if (checkError) throw checkError;
    if (existingRequest) {
    if (existingRequest.status === 'accepted') {
      throw new Error('Hai bạn đã là bạn bè rồi!');
    }
    throw new Error('Lời mời kết bạn đã tồn tại hoặc đang chờ xử lý');
  }
    const { data, error } = await supabase
      .from('friendships')
      .insert({ user_id: userId, friend_id: friendId })
      .select()
    if (error) throw error
    return data
  },

  // Chấp nhận / từ chối
  respondFriendRequest: async (requestId: string, status: 'accepted' | 'rejected' | 'blocked') => {
    const { data, error } = await supabase
      .from('friendships')
      .update({ status })
      .eq('id', requestId)
    if (error) throw error
    return data
  },

  // Danh sách bạn bè + pending
  getFriendsList: async (): Promise<Friendship[]> => {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return [];
    const { data: sentRequests, error: error1 } = await supabase
      .from('friendships')
      .select('*, friend:friend_id (*)') // join profile bạn bè
      .eq(`user_id`, userId)
      .order('created_at', { ascending: false })

    const { data: receivedRequests, error: error2 } = await supabase
      .from('friendships')
      .select('*, friend:user_id (*)') // join profile bạn bè
      .eq(`friend_id`, userId)
      .order('created_at', { ascending: false })

    if (error1 || error2) throw (error1 || error2);
    const allData = [...(sentRequests || []), ...(receivedRequests || [])];
    return allData.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  },

  unfriend: async (friendshipId: string) => {
    try {
    const userId = (await supabase.auth.getUser()).data.user?.id

    const { error } = await supabase
      .from('friendships')
      .delete()
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendshipId}),and(user_id.eq.${friendshipId},friend_id.eq.${userId})`)
    if (error) return error
  } 
   catch (err) {
    console.error("Lỗi hủy kết bạn:", err);
  }
  },
}