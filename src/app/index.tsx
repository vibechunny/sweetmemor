// // src/app/index.tsx   ← màn hình đầu tiên app chạy vào
// import { useAuth } from '@/src/contexts/AuthContext'
// import { Redirect } from 'expo-router'
// import { ActivityIndicator, Text, View } from 'react-native'

// export default function Index() {
//   const { user, loading } = useAuth()

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
//         <ActivityIndicator size="large" color="#ff5a5f" />
//         <Text style={{ marginTop: 20 }}>Đang tải SweetMemory...</Text>
//       </View>
//     )
//   }

//   // Chưa login → đẩy qua login
//   // Đã login → vào tab chính
//   return <Redirect href={user ? '/(tabs)' : '/auth/login'} />
// }
// src/app/index.tsx
import { Redirect } from 'expo-router'

export default function Index() {
  return <Redirect href="../auth/login" />   // ← chạy thẳng vào test
}