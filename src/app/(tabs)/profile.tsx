// src/app/(tabs)/profile.tsx  ← copy nguyên cái này đè lên file cũ
import { useAuth } from '@/src/contexts/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

export default function Profile() {
  const { signOut } = useAuth()
  const router = useRouter()

  const logout = async () => {
    await signOut()
    router.replace('/auth/login')
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <View style={{ alignItems: 'center', paddingTop: 60, paddingBottom: 30, backgroundColor: '#e3f2fd' }}>
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: 'https://via.placeholder.com/120' }}
            style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: 'white' }}
          />
          <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#1976d2', padding: 10, borderRadius: 30 }}>
            <Ionicons name="camera" size={24} color="white" />
          </View>
        </View>

        <Text style={{ fontSize: 28, fontWeight: 'bold', marginTop: 16 }}>Chunnỳ</Text>
        <Text style={{ fontSize: 18, color: '#1976d2', marginTop: 4 }}>@vibechunny3</Text>

        <TouchableOpacity style={{ marginTop: 20, backgroundColor: '#1976d2', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 30 }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20 }}>
        <Item icon="settings-outline" title="Cài đặt" />
        <Item icon="card-outline" title="Thông tin thanh toán" />
        <Item icon="people-outline" title="Quản lý bạn bè" />
        <Item icon="information-circle-outline" title="Thông tin ứng dụng" />
        <Item icon="log-out-outline" title="Đăng xuất" color="#d32f2f" onPress={logout} />
      </View>
    </ScrollView>
  )
}

function Item({ icon, title, color = '#212121', onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', padding: 18, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#eee' }}>
      <Ionicons name={icon} size={28} color={color} />
      <Text style={{ flex: 1, marginLeft: 16, fontSize: 18, color }}>{title}</Text>
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  )
}