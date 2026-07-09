import { usePetaniAuth } from '@/app/petani/_PetaniAuthContext';
import { router } from 'expo-router';
import { User as FirebaseUser, getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import {
  ChevronRight,
  Clock,
  HelpCircle,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Settings,
  ShieldCheck,
  User
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfilScreen() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { petani, isReady } = usePetaniAuth();
  
  // Ambil instance Firebase auth
  const auth = getAuth();

  useEffect(() => {
    // Berlangganan status autentikasi firebase secara real-time
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    Alert.alert('Keluar Akun', 'Apakah Anda yakin ingin keluar dari aplikasi?', [
      { text: 'Batal', style: 'cancel' },
      { 
        text: 'Keluar', 
        style: 'destructive', 
        onPress: async () => {
          try {
            await signOut(auth);
            Alert.alert('Sukses', 'Anda berhasil keluar.');
          } catch (error: any) {
            Alert.alert('Gagal Keluar', error.message);
          }
        } 
      },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profil', 'Fitur edit profil akan segera hadir di versi berikutnya.');
  };

  const handleContactSupport = () => {
    Alert.alert('Hubungi Bantuan', 'Silakan kirim pesan ke WhatsApp support +62 812-3456-7890.');
  };

  const displayName = currentUser?.displayName || petani?.nama || currentUser?.email?.split('@')[0] || 'Petani Unsur Hara';
  const displayEmail = currentUser?.email || petani?.email || 'Belum tersedia';
  const isAuthenticated = Boolean(currentUser || petani);

  if (!isReady && !petani && loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#606C38" />
        <Text style={styles.loadingText}>Memuat profil Anda...</Text>
      </View>
    );
  }

  // 1. TAMPILAN JIKA BELUM REGISTRASI / LOGIN
  if (!isAuthenticated && isReady && !loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F3F4F0" />
        <View style={styles.authWrapper}>
          <View style={styles.authIconContainer}>
            <User color="#606C38" size={48} />
          </View>
          <Text style={styles.authTitle}>Belum Masuk Akun</Text>
          <Text style={styles.authSubtitle}>
            Silakan registrasi atau login terlebih dahulu untuk memantau data hara tanah dan riwayat analisis Anda secara permanen.
          </Text>

          <TouchableOpacity 
            style={styles.primaryAuthBtn} 
            onPress={() => router.push('/petani/register')}
          >
            <User size={18} color="#FFF" />
            <Text style={styles.primaryAuthBtnText}>Registrasi Akun Baru</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryAuthBtn} 
            onPress={() => router.push('/petani/login')}
          >
            <LogIn size={18} color="#606C38" />
            <Text style={styles.secondaryAuthBtnText}>Sudah Punya Akun? Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 2. TAMPILAN JIKA SUDAH LOGIN (MUNCUL NAMA & EMAIL DARI FIREBASE)
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#283618" />

      {/* HEADER DASHBOARD */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.avatarContainer}>
            <User color="#283618" size={36} />
          </View>
          <View style={styles.headerText}>
            {/* Fallback menggunakan bagian email depan jika DisplayName kosong */}
            <Text style={styles.titleName}>{displayName}</Text>
            <Text style={styles.subtitle}>Pemilik lahan aktif</Text>
          </View>
        </View>

        <View style={styles.badgePeran}>
          <ShieldCheck size={14} color="#FEFAE0" />
          <Text style={styles.badgeText}>Terverifikasi</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Lahan Aktif</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>Riwayat</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>OK</Text>
            <Text style={styles.statLabel}>Koneksi</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Informasi Akun</Text>

          <View style={styles.infoCard}>
            <Mail size={20} color="#606C38" />
            <View style={styles.textGroup}>
              <Text style={styles.label}>Email Aktif</Text>
              <Text style={styles.value}>{displayEmail}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Phone size={20} color="#606C38" />
            <View style={styles.textGroup}>
              <Text style={styles.label}>Nomor WhatsApp</Text>
              <Text style={styles.value}>081234567890</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <MapPin size={20} color="#606C38" />
            <View style={styles.textGroup}>
              <Text style={styles.label}>Lokasi Lahan</Text>
              <Text style={styles.value}>Cilegon, Banten</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Fitur & Bantuan</Text>

          <TouchableOpacity style={styles.actionRow} onPress={handleEditProfile}>
            <View style={styles.actionIcon}>
              <Settings size={18} color="#606C38" />
            </View>
            <View style={styles.actionTextGroup}>
              <Text style={styles.actionTitle}>Edit Profil</Text>
              <Text style={styles.actionSubtitle}>Perbarui nama, email, dan data lahan</Text>
            </View>
            <ChevronRight size={18} color="#A0A699" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} onPress={handleContactSupport}>
            <View style={styles.actionIcon}>
              <MessageSquare size={18} color="#606C38" />
            </View>
            <View style={styles.actionTextGroup}>
              <Text style={styles.actionTitle}>Bantuan & Dukungan</Text>
              <Text style={styles.actionSubtitle}>Hubungi tim support bila butuh bantuan</Text>
            </View>
            <ChevronRight size={18} color="#A0A699" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => Alert.alert('Pusat Bantuan', 'Buka dokumentasi aplikasi dan tips merawat tanah.')}
          >
            <View style={styles.actionIcon}>
              <HelpCircle size={18} color="#606C38" />
            </View>
            <View style={styles.actionTextGroup}>
              <Text style={styles.actionTitle}>Panduan Lahan</Text>
              <Text style={styles.actionSubtitle}>Tips pemupukan dan pemeliharaan tanah</Text>
            </View>
            <ChevronRight size={18} color="#A0A699" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardSection}>
          <View style={styles.statusCard}>
            <View style={styles.statusIcon}>
              <Clock size={18} color="#606C38" />
            </View>
            <View>
              <Text style={styles.statusLabel}>Terakhir Sinkron</Text>
              <Text style={styles.statusValue}>2 jam lalu</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={18} color="#FFF" />
            <Text style={styles.logoutText}>Keluar dari Akun</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F0' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F0' },
  loadingText: { marginTop: 12, color: '#606C38', fontSize: 14, fontWeight: '600' },
  
  // Desain Layar Alternatif Belum Login (Aesthetic Sage)
  authWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  authIconContainer: { width: 90, height: 90, borderRadius: 30, backgroundColor: '#EAF0E6', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  authTitle: { fontSize: 22, fontWeight: 'bold', color: '#283618', marginBottom: 10 },
  authSubtitle: { fontSize: 13, color: '#606C38', textAlign: 'center', lineHeight: 20, marginBottom: 30 },
  primaryAuthBtn: { flexDirection: 'row', backgroundColor: '#606C38', width: '100%', height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 10, elevation: 2, shadowColor: '#283618', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  primaryAuthBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  secondaryAuthBtn: { flexDirection: 'row', backgroundColor: '#EAF0E6', width: '100%', height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 12, borderWidth: 1, borderColor: '#E1E5DC' },
  secondaryAuthBtnText: { color: '#606C38', fontWeight: '700', fontSize: 15 },

  // Desain Sudah Login
  header: {
    backgroundColor: '#283618', // Olive tua pekat murni tumbuhan
    paddingTop: 60,
    paddingBottom: 26,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 3,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: '#FEFAE0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: { flex: 1 },
  titleName: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  subtitle: { fontSize: 13, color: '#D4A373', marginTop: 4, fontWeight: '500' },
  badgePeran: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: { color: '#FEFAE0', fontSize: 11, fontWeight: '700' },
  statsRow: { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  statLabel: { fontSize: 11, color: '#FEFAE0', marginTop: 4, opacity: 0.8 },
  
  contentContainer: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  cardSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#283618', marginBottom: 12, marginLeft: 4 },
  infoCard: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E1E5DC',
  },
  textGroup: { marginLeft: 14, flex: 1 },
  label: { fontSize: 11, color: '#A0A699', fontWeight: '600' },
  value: { fontSize: 15, color: '#283618', fontWeight: '700', marginTop: 3 },
  actionRow: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E1E5DC',
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EAF0E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionTextGroup: { flex: 1 },
  actionTitle: { fontSize: 14, color: '#283618', fontWeight: '700' },
  actionSubtitle: { fontSize: 12, color: '#606C38', marginTop: 3 },
  statusCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#E1E5DC',
    marginBottom: 16,
  },
  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EAF0E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusLabel: { fontSize: 11, color: '#A0A699', marginBottom: 3 },
  statusValue: { fontSize: 15, color: '#283618', fontWeight: '700' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#BC4749', // Warna merah earthy kalem / terakota tua
    borderRadius: 20,
    paddingVertical: 14,
  },
  logoutText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
});