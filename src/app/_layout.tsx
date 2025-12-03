// src/app/_layout.tsx
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import "../../global.css";
function RootLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    )
  }

  return (
    <>
      {user ? (
        <Redirect href="../(tabs)/profile" />
      ) : (
        <Redirect href="/auth/login" />
      )}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth/login" />
      </Stack>
    </>
  )
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  )
}