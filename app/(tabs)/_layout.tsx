import { Tabs } from 'expo-router';
import { Camera, Compass, Home, Leaf, UserRound } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF', // Warna ikon saat terpilih
        tabBarInactiveTintColor: '#7A8C72', // Warna ikon saat tidak terpilih
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.activeIconWrap]}>
              <Home size={22} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          href: null, // Disembunyikan dari navbar
        }}
      />

      <Tabs.Screen
        name="kamera"
        options={{
          title: 'Kamera',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.activeIconWrap]}>
              <Camera size={22} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="hasil"
        options={{
          title: 'Hasil',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.activeIconWrap]}>
              <Leaf size={22} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.activeIconWrap]}>
              <UserRound size={22} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 85,
    paddingTop: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#F7FFF5',
    borderTopWidth: 0,
    position: 'absolute', // Membuat navbar terlihat floating di atas konten
    elevation: 10,
    shadowColor: '#2D5A27',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  iconWrap: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  activeIconWrap: {
    backgroundColor: '#2D5A27', // Ikon yang aktif akan memiliki background hijau
    marginTop: -10, // Memberikan efek "melompat/menonjol" ke atas
    shadowColor: '#2D5A27',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});