// src/api/types.ts
export type Profile = {
  id: string
  username: string
  full_name?: string
  avatar_url?: string
  qr_code?: string
  created_at: string
}

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected' | 'blocked'

export type Friendship = {
  id: string
  user_id: string
  friend_id: string
  status: FriendshipStatus
  created_at: string
  friend?: Profile  // khi join sẽ có
}