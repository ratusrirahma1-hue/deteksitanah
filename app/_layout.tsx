import { Stack } from 'expo-router';
// 1. Import Provider dari context pertanianmu (sesuaikan path foldernya jika berbeda)
import { PetaniAuthProvider } from './petani/_PetaniAuthContext'; 

export default function RootLayout() {
  return (
    // 2. Bungkus Stack bawaan Expo dengan Provider ini
    <PetaniAuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="petani/register" />
        <Stack.Screen name="petani/login" />
      </Stack>
    </PetaniAuthProvider>
  );
}