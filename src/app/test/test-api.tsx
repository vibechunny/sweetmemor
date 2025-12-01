// src/app/test-api.tsx   ← tạo file này
import { Alert, ScrollView, Text, TouchableOpacity } from 'react-native'
import { friendsAPI } from '../../api/friend'
import { profileAPI } from '../../api/profile'
import { useAuth } from '../../contexts/AuthContext'

export default function TestAPIScreen() {
  const { user, signOut } = useAuth()

  const testAll = async () => {
    try {
      Alert.alert('Bắt đầu test', 'Theo dõi console nha!')

      // 1. Đăng ký (chỉ chạy lần đầu)
    //   console.log('1. Đăng ký...');
    //   await authAPI.signUp('vibechunny3', '123456', '', 'Pé chunny');
    //   console.log('OK')
        
      // 2. Đăng nhập
      // console.log('2. Đăng nhập...')
      // await authAPI.signInWithUsername('vibechunny3', '123456')

    //   // 3. Lấy profile
      // console.log('3. Lấy profile...')
      // const profile = await profileAPI.getMyProfile()
      // console.log('Profile:', profile)

      // 4. Test QR (tạo tài khoản thứ 2 để quét)
      // console.log('4. Tạo user thứ 2 để test QR...')
      // await authAPI.signUp('bumbum', '123456', '', 'Bum Bum')
      // await authAPI.signInWithUsername('bumbum', '123456')

      //const profile2 = await profileAPI.getMyProfile()
      //console.log('User 2 QR:', profile2.qr_code)

      // Quay lại user 1
      //await authAPI.signInWithUsername('vibechunny3', '123456')

      // 5. Quét QR + gửi kết bạn
      console.log('5. Gửi kết bạn...')
      let profile = await profileAPI.getMyProfile();
      await friendsAPI.sendFriendRequest(profile.id)

      // 6. Lấy danh sách bạn bè
    //   console.log('6. Danh sách bạn bè...')
    //   const friends = await friendsAPI.getFriendsList()
    //   console.log('Friends:', friends)

      Alert.alert('THÀNH CÔNG', 'Toàn bộ API chạy ngon lành! Check console đi đại ca!')
    } catch (e: any) {
      Alert.alert('Lỗi ở bước nào đó', e.message)
      console.error(e)
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        {user ? `Đã login: ${user.email}` : 'Chưa login'}
      </Text>

      <TouchableOpacity
        onPress={testAll}
        style={{ backgroundColor: '#ff5a5f', padding: 15, borderRadius: 10, marginBottom: 10 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontSize: 18 }}>CHẠY TEST TOÀN BỘ API</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={signOut}
        style={{ backgroundColor: '#333', padding: 15, borderRadius: 10 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}