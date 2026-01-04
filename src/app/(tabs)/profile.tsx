// src/app/(tabs)/profile.tsx
import { authAPI } from '@/src/api/auth';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { supabase } from '../../api/client';
import { profileAPI } from '../../api/profile';
  const { width }= Dimensions.get('window');

export default function ProfileScreen() {
  //const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [visibleQR, setVisibleQR] = useState(false);

  const { colorScheme } = useColorScheme();
  const router = useRouter();
  // Form state
  const [form, setForm] = useState({
    full_name: '',
    username: ''
  });

  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await authAPI.getCurrentUser();
      if (user) {
        let { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        //setUser(user);
        setForm({
          full_name: data?.full_name || '',
          username: data?.username || ''
        });

        setAvatarUrl(data?.avatar_url || null);
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

  const handleSaveProfile = async () => {
    try {
      const updates = {
          username: form.username,
          full_name: form.full_name,
          qr_code: form.username
      };

      const { error } = await profileAPI.updateProfile(updates);
      if (error) {
        Alert.alert('Lỗi', error.message);
        return;
      }

      Alert.alert('Thành công', 'Cập nhật hồ sơ thành công!');
      setEditModalVisible(false);
      fetchUserProfile();
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
        <Text className="text-gray-500">Đang tải...</Text>
      </View>
    );
  }

  const handleAvatarChange = async () => {
    // 1. Mở thư viện ảnh
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,      // cho crop tròn đẹp
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;

    const file = result.assets[0];
    const fileUri = file.uri;
    const fileExt = fileUri.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    // 2. Lấy user id
    const { data: { user } } = await authAPI.getCurrentUser();
    if (!user) {
      Alert.alert('Lỗi', 'Bạn cần đăng nhập');
      return;
    }
    
    const response = await fetch(fileUri);

    const arrayBuffer = await response.arrayBuffer();

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, arrayBuffer, {
        contentType: file.mimeType || 'image/jpeg',
        upsert: true
      });

    if (error) throw error;

    // 6. Lấy URL public
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // 7. Cập nhật vào bảng profiles
    await profileAPI.updateProfile({ avatar_url: publicUrl });

    // 8. Cập nhật UI ngay lập tức
    setAvatarUrl(publicUrl); 

    Alert.alert('Thành công', 'Avatar đã được cập nhật');
    return data.path;
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header Profile */}
      <View className="bg-white dark:bg-gray-800 px-6 pt-12 pb-8">
        <View className="items-center">
          <View className="relative">
            <Image
              source={{
                uri: avatar_url ||
                  'https://ui-avatars.com/api/?name=' + encodeURIComponent(form.full_name || 'User') + '&background=random',
              }}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <TouchableOpacity onPress={handleAvatarChange} className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full border-4 border-white">
              <Ionicons name="camera" size={18} color="white"/>
            </TouchableOpacity>
          </View>

          <Text className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">
            {form.full_name || 'Tên người dùng'}
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
         
          { icon: 'information-circle-outline', label: 'Information', onPress: () => {} },

          { icon: 'qr', label: 'My QR Code', onPress: () => setVisibleQR(true) },

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
                { label: 'Name', value: form.full_name, key: 'full_name' },
                { label: 'Username', value: form.username, key: 'username', prefix: '@' },
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
                          editable={true}
                          secureTextEntry={false}
                        />
                      </View>
                    ) : (
                      <TextInput
                        className="text-gray-900 dark:text-white"
                        value={form[field.key as keyof typeof form]}
                        onChangeText={(text) => setForm({ ...form, [field.key]: text })}
                        editable={true}
                        secureTextEntry={false}
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
                onPress={handleSaveProfile}
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

      <Modal
      animationType="fade"
      transparent={true}
      visible={visibleQR}
    >
      {/* Lớp nền mờ phía sau */}
      <View style={styles.overlay}>
        
        <View style={styles.modalContainer}>
          {/* Header của Modal */}
          <Text style={styles.title}>Mã QR của tôi</Text>
          <Text style={styles.subtitle}>@{form.username}</Text>

          {/* Vùng chứa QR Code */}
          <View style={styles.qrWrapper}>
            {form.username ? (
              <QRCode
                value={form.username}
                size={width * 0.5} // Tự động co giãn theo màn hình
                color="#000"
                backgroundColor="#fff"
              />
            ) : (
              <Text>Đang tải...</Text>
            )}
          </View>

          <Text style={styles.instruction}>
            Đưa mã này cho bạn bè để họ quét và kết bạn với bạn nhanh hơn.
          </Text>

          {/* Nút Đóng */}
          <TouchableOpacity style={styles.closeButton} onPress={() => setVisibleQR(false)}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>

      </View>
    </Modal>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Làm tối màn hình nền
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 10, // Đổ bóng cho Android
    shadowColor: '#000', // Đổ bóng cho iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  qrWrapper: {
    padding: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 15,
    marginBottom: 20,
  },
  instruction: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginBottom: 25,
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: '#007AFF', // Màu xanh đặc trưng iOS
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


