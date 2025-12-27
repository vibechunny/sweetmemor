// src/app/_layout.tsx
import { supabase } from '@/src/api/client'; // Đường dẫn đến file khởi tạo supabase của bạn
import { Session } from '@supabase/supabase-js';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import "../../global.css";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null nghĩa là đang kiểm tra
  const segments = useSegments();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  // GIẢ LẬP: Kiểm tra trạng thái đăng nhập từ Storage hoặc Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    // 2. Lắng nghe thay đổi trạng thái (Login/Logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!session && !inAuthGroup) {
      // 1. Nếu chưa login và đang ở ngoài trang auth -> Bắt về Login
      router.replace('/auth/login');
    } else if (session && inAuthGroup) {
      // 2. Nếu đã login mà lại ở trang auth -> Đẩy vào Home
      router.replace('/(tabs)/home');
    }
  }, [session, initialized, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}