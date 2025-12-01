// src/app/auth/login.tsx
//import { useAuth } from '@/src/contexts/AuthContext'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, ImageBackground, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { authAPI } from '../../api/auth'
const blurhash = '|rF?hV%-2t=kIWj@XCadJB$4R%xgUk%fljs8f6jb|AD'

export default function LoginScreen() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    try {
      await authAPI.signInWithUsername(username, password)
      // ĐĂNG NHẬP THÀNH CÔNG → TỰ ĐỘNG CHUYỂN SANG PROFILE
      router.replace('../(tabs)/profile')   // ← DÒNG QUAN TRỌNG NHẤT!
    } catch (error: any) {
      Alert.alert('Lỗi đăng nhập', error.message)
    }
  }

  return (
    <ImageBackground
      source={require('../../../assets/images/login-bg.jpg')}  // để 1 ảnh nền mờ pastel
      blurRadius={10}
      style={{ flex: 1 }}
    >
      <LinearGradient colors={['#FF9AE680', '#FFD4B280']} style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'center', padding: 30 }}>
          
          {/* Logo + tiêu đề */}
          <View style={{ alignItems: 'center', marginBottom: 50 }}>
            <Image 
              source={require('../../../assets/images/logo-2.jpg')} 
              placeholder={blurhash}
              style={{ width: 120, height: 120, borderRadius: 30, marginBottom: 20 }}
            />
            <Text style={{ fontSize: 36, fontWeight: '800', color: '#fff' }}>Sờ quít memory</Text>
            <Text style={{ fontSize: 16, color: '#fff8', marginTop: 8 }}>Lưu giữ khoảnh khắc</Text>
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
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20, fontSize: 16 }}
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              onPress={handleLogin}
              style={{ backgroundColor: '#FF6AC1', padding: 16, borderRadius: 12, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>Đăng nhập</Text>
            </TouchableOpacity>

            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <Text style={{ color: '#fff8' }}>hoặc</Text>
            </View>

            {/* Nút Google */}
            <TouchableOpacity
              //onPress={}
              style={{ backgroundColor: '#fff', padding: 14, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}
            >
              <Image source={require('../../../assets/images/google.png')} style={{ width: 24, height: 24 }} />
              <Text style={{ fontSize: 16, fontWeight: '600' }}>Tiếp tục với Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ alignItems: 'center', marginTop: 20 }}>
              <Text style={{ color: '#fff', textDecorationLine: 'underline' }}>Chưa có tài khoản? Đăng ký ngay →</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  )
}