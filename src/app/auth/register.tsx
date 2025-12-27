// src/app/auth/login.tsx
//import { useAuth } from '@/src/contexts/AuthContext'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, ImageBackground, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { authAPI } from '../../api/auth'

export default function RegisterScreen() {
  const router = useRouter()
   // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cfmPassword, setCfmPassword] = useState('');
  const [fullname, setcFullName] = useState('');

  const handleRegister = async () => {
    try {
      await authAPI.signUp(username, password, '', fullname)
      Alert.alert('Đăng ký thành công', `Bạn đã đăng ký tài khoản thành công. Mời ${fullname} đăng nhập!!!`);
      router.replace('../(tabs)/home')  
    } catch (error: any) {
      Alert.alert('Lỗi đăng nhập', error.message)
    }
  }

  return (
    <ImageBackground
      source={require('../../../assets/images/login-bg.jpg')}  
      blurRadius={10}
      style={{ flex: 1 }}
    >
      <LinearGradient colors={['#FF9AE680', '#FFD4B280']} style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'center', padding: 30 }}>
          
          {/* Logo + tiêu đề */}
          <View style={{ alignItems: 'center', marginBottom: 50 }}>

            <Text style={{ fontSize: 36, fontWeight: '800', color: '#fff' }}>Swmemory</Text>
            <Text style={{ fontSize: 16, color: '#fff8', marginTop: 8 }}>Bạn chưa có tài khoản hả?</Text>
          </View>

          {/* Form */}
          <View style={{ backgroundColor: '#ffffff30', borderRadius: 20, padding: 20, backdropFilter: 'blur(10px)', borderWidth: 1, borderColor: '#ffffff40' }}>
            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 15, fontSize: 16 }}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="full_name"
              value={fullname}
              onChangeText={setcFullName}
              autoCapitalize="none"
              autoCorrect={false}
              style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 15, fontSize: 16 }}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20, fontSize: 16 }}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder="Xác nhận"
              value={cfmPassword}
              onChangeText={setCfmPassword}
              secureTextEntry
              style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20, fontSize: 16 }}
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              onPress={handleRegister}
              style={{ backgroundColor: '#FF6AC1', padding: 16, borderRadius: 12, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>Đăng ký</Text>
            </TouchableOpacity>

            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <Text style={{ color: '#fff8' }}>hoặc</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  )
}