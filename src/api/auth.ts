// src/api/auth.ts
import { supabase } from './client'

export const authAPI = {
  // Đăng ký + username bắt buộc
  signUp: async (
    username: string,
    password: string,
    email?: string,           // ← optional
    full_name?: string
  ) => {
    // Kiểm tra username có hợp lệ không (tránh lỗi)
    if (!username || username.trim().length < 3) {
      throw new Error('Username phải ít nhất 3 ký tự')
    }

    const { data, error } = await supabase.auth.signUp({
      // Email có thể là null → Supabase vẫn tạo user bình thường
      email: email || `${username}@sweetmemory.local`,
      password,
      options: {
        data: {
          username: username.trim().toLowerCase(), // lưu lowercase để dễ check unique
          full_name,
        },
      },
    })

    if (error) {
      // Nếu lỗi duplicate username → bắt lỗi rõ ràng hơn
      if (error.message.includes('unique') || error.message.includes('username')) {
        throw new Error('Username đã tồn tại!')
      }
      throw error
    }

    return data
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  signInWithUsername: async (username: string, password: string) => {
    if (!username || !password) {
      throw new Error('Vui lòng nhập username và mật khẩu')
    }

    const { data: userData, error: rpcError } = await supabase.rpc('signin_with_username', {
      input_username: username.trim()
    })

    if (rpcError || !userData) {
        console.error('RPC Error:', rpcError)   ;
        console.error('user:', userData)   ;
      throw new Error('Username hoặc mật khẩu sai')
    }

    // Bước 2: Dùng email thật để login (Supabase bắt buộc)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email || `${username}@sweetmemory.local`, // fallback nếu không có email
      password,
    })

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Mật khẩu sai')
      }
      throw error
    }

    return data
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  changePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
    return data
  },

  getCurrentUser: () => supabase.auth.getUser(),
}