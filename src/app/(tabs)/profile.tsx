// src/app/(tabs)/profile.tsx
import { authAPI } from '@/src/api/auth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const { colorScheme } = useColorScheme();
  const router = useRouter();

  // Form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    birthDate: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await authAPI.getCurrentUser();
      if (user) {
        setUser(user);
        setForm({
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
          username: user.user_metadata?.username || '',
          password: '',
          birthDate: user.user_metadata?.birth_date || '01.02.1999',
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await authAPI.signOut();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  // const handleSaveProfile = async () => {
  //   try {
  //     const updates = {
  //       data: {
  //         //birth_date: form.birthdate,
  //         username: form.username,
  //         full_name: form.name,
  //         //avatar_url?: form.avatar_url
  //       },
  //     };

  //     // if (form.password) {
  //     //   await profileAPI.updateUser({ password: form.password });
  //     // }

  //     const { error } = await profileAPI.updateProfile(updates);
  //     if (error) {
  //       Alert.alert('Lỗi', error.message);
  //       return;
  //     }

  //     Alert.alert('Thành công', 'Cập nhật hồ sơ thành công!');
  //     setEditModalVisible(false);
  //     fetchUserProfile();
  //   } catch (error: any) {
  //     Alert.alert('Lỗi', error.message);
  //   }
  // };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
        <Text className="text-gray-500">Đang tải...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header Profile */}
      <View className="bg-white dark:bg-gray-800 px-6 pt-12 pb-8">
        <View className="items-center">
          <View className="relative">
            <Image
              source={{
                uri: user?.user_metadata?.avatar_url ||
                  'https://ui-avatars.com/api/?name=' + encodeURIComponent(form.name || 'User') + '&background=random',
              }}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full border-4 border-white">
              <Ionicons name="camera" size={18} color="white" />
            </TouchableOpacity>
          </View>

          <Text className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">
            {form.name || 'Tên người dùng'}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">
            @{form.username || 'username'}
          </Text>

          <TouchableOpacity
            onPress={() => setEditModalVisible(true)}
            className="mt-4 bg-blue-500 px-6 py-3 rounded-full"
          >
            <Text className="text-white font-medium">Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Items */}
      <View className="mt-6 bg-white dark:bg-gray-800">
        {[
          { icon: 'settings-outline', label: 'Settings', onPress: () => router.push('/') },
          { icon: 'card-outline', label: 'Billing Details', onPress: () => {} },
          { icon: 'people-outline', label: 'User Management', onPress: () => {} },
          { icon: 'information-circle-outline', label: 'Information', onPress: () => {} },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            className="flex-row items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700"
          >
            <Ionicons name={item.icon as any} size={24} color={colorScheme === 'dark' ? '#94a3b8' : '#64748b'} />
            <Text className="ml-4 text-lg text-gray-800 dark:text-gray-200 flex-1">
              {item.label}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center px-6 py-4"
        >
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          <Text className="ml-4 text-lg text-red-500 font-medium">Log out</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} animationType="slide">
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
          <View className="bg-white dark:bg-gray-800 px-6 py-4 flex-row justify-between items-center">
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Ionicons name="arrow-back" size={28} color={colorScheme === 'dark' ? 'white' : 'black'} />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</Text>
            <View className="w-8" />
          </View>

          <ScrollView className="flex-1 px-6 mt-6">
            <View className="space-y-5">
              {[
                { label: 'Name', value: form.name, key: 'name' },
                { label: 'Email Address', value: form.email, key: 'email', editable: false },
                { label: 'Username', value: form.username, key: 'username', prefix: '@' },
                { label: 'Password', value: form.password, key: 'password', secure: true },
                { label: 'Birth Date', value: form.birthDate, key: 'birthDate' },
              ].map((field) => (
                <View key={field.key}>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">{field.label}</Text>
                  <View className="bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3">
                    {field.prefix ? (
                      <View className="flex-row items-center">
                        <Text className="text-gray-500">@</Text>
                        <TextInput
                          className="flex-1 ml-1 text-gray-900 dark:text-white"
                          value={field.prefix ? form[field.key as keyof typeof form].replace('@', '') : form[field.key as keyof typeof form]}
                          onChangeText={(text) => setForm({ ...form, [field.key]: field.prefix ? text : text })}
                          editable={field.editable !== false}
                          secureTextEntry={field.secure}
                        />
                      </View>
                    ) : (
                      <TextInput
                        className="text-gray-900 dark:text-white"
                        value={form[field.key as keyof typeof form]}
                        onChangeText={(text) => setForm({ ...form, [field.key]: text })}
                        editable={field.editable !== false}
                        secureTextEntry={field.secure}
                        placeholder={field.label}
                        placeholderTextColor="#94a3b8"
                      />
                    )}
                  </View>
                </View>
              ))}

              <View className="mt-6">
                <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">Joined</Text>
                <Text className="text-lg text-gray-900 dark:text-white">April 2022</Text>
              </View>

              <TouchableOpacity
                //onPress={handleSaveProfile}
                className="mt-8 bg-blue-500 py-4 rounded-full"
              >
                <Text className="text-white text-center font-semibold text-lg">Save Changes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                className="mt-4 bg-red-500 py-4 rounded-full"
              >
                <Text className="text-white text-center font-semibold text-lg">Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}









// // src/app/(tabs)/profile.tsx  ← copy nguyên cái này đè lên file cũ
// import { useAuth } from '@/src/contexts/AuthContext'
// import { Ionicons } from '@expo/vector-icons'
// import { useRouter } from 'expo-router'
// import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

// export default function Profile() {
//   const { signOut } = useAuth()
//   const router = useRouter()

//   const logout = async () => {
//     await signOut()
//     router.replace('/auth/login')
//   }

//   return (
//     <ScrollView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
//       <View style={{ alignItems: 'center', paddingTop: 60, paddingBottom: 30, backgroundColor: '#e3f2fd' }}>
//         <View style={{ position: 'relative' }}>
//           <Image
//             source={{ uri: 'https://via.placeholder.com/120' }}
//             style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: 'white' }}
//           />
//           <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#1976d2', padding: 10, borderRadius: 30 }}>
//             <Ionicons name="camera" size={24} color="white" />
//           </View>
//         </View>

//         <Text style={{ fontSize: 28, fontWeight: 'bold', marginTop: 16 }}>Chunnỳ</Text>
//         <Text style={{ fontSize: 18, color: '#1976d2', marginTop: 4 }}>@vibechunny3</Text>

//         <TouchableOpacity style={{ marginTop: 20, backgroundColor: '#1976d2', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 30 }}>
//           <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Chỉnh sửa hồ sơ</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={{ marginTop: 20 }}>
//         <Item icon="settings-outline" title="Cài đặt" />
//         <Item icon="card-outline" title="Thông tin thanh toán" />
//         <Item icon="people-outline" title="Quản lý bạn bè" />
//         <Item icon="information-circle-outline" title="Thông tin ứng dụng" />
//         <Item icon="log-out-outline" title="Đăng xuất" color="#d32f2f" onPress={logout} />
//       </View>
//     </ScrollView>
//   )
// }

// function Item({ icon, title, color = '#212121', onPress }: any) {
//   return (
//     <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', padding: 18, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#eee' }}>
//       <Ionicons name={icon} size={28} color={color} />
//       <Text style={{ flex: 1, marginLeft: 16, fontSize: 18, color }}>{title}</Text>
//       <Ionicons name="chevron-forward" size={24} color="#999" />
//     </TouchableOpacity>
//   )
// }