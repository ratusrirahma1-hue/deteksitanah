import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, Mail, User, Sprout, LogIn } from 'lucide-react-native';
import { usePetaniAuth } from './_PetaniAuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = usePetaniAuth();
  
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nama || !email || !password) {
      Alert.alert("Gagal", "Semua kolom pendaftaran wajib diisi.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Gagal", "Kata sandi minimal harus 6 karakter.");
      return;
    }

    setLoading(true);
    try {
      const result = await register(nama, email, password);
      
      if (result && result.success) {
        Alert.alert("Sukses", "Akun berhasil dibuat! Silakan masuk.", [
          { text: "OK", onPress: () => router.replace('/petani/login') }
        ]);
      } else {
        Alert.alert("Pendaftaran Gagal", result?.message || "Terjadi kesalahan pada sistem database cloud.");
      }
    } catch (error: any) {
      Alert.alert("Error Sistem", error.message || "Gagal terhubung ke Firebase Server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F0" />

      <View style={styles.headerSection}>
        <View style={styles.logoCircle}>
          <Sprout color="#606C38" size={32} />
        </View>
        <Text style={styles.title}>Daftar Akun Petani</Text>
        <Text style={styles.subtitle}>Bergabunglah dengan ekosistem pertanian modern berbasis kecerdasan buatan</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.inputLabel}>Nama Lengkap</Text>
        <View style={styles.inputWrapper}>
          <User color="#A0A699" size={20} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Nama lengkap Anda"
            placeholderTextColor="#A0A699"
            value={nama}
            onChangeText={setNama}
            editable={!loading}
          />
        </View>

        <Text style={styles.inputLabel}>Alamat Email</Text>
        <View style={styles.inputWrapper}>
          <Mail color="#A0A699" size={20} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="contoh@petani.com"
            placeholderTextColor="#A0A699"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />
        </View>

        <Text style={styles.inputLabel}>Kata Sandi Baru</Text>
        <View style={styles.inputWrapper}>
          <Lock color="#A0A699" size={20} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Minimal 6 karakter"
            placeholderTextColor="#A0A699"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
        </View>

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FEFAE0" size="small" />
          ) : (
            <>
              <Text style={styles.buttonText}>Buat Akun Sekarang</Text>
              <Sprout color="#FEFAE0" size={18} />
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footerSection}>
        <Text style={styles.footerText}>Sudah memiliki akun? </Text>
        <TouchableOpacity onPress={() => router.replace('/petani/login')} style={styles.footerLinkWrapper}>
          <LogIn color="#606C38" size={14} />
          <Text style={styles.footerLink}>Masuk Aplikasi</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F3F4F0',
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 74,
    height: 74,
    borderRadius: 24,
    backgroundColor: '#EAF0E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E1E5DC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#283618',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#606C38',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
    fontWeight: '500',
  },
  formSection: {
    width: '100%',
    zIndex: 10,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#283618',
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E1E5DC',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    shadowColor: '#283618',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#283618',
    fontSize: 14,
    fontWeight: '600',
    height: '100%',
  },
  buttonPrimary: {
    backgroundColor: '#606C38',
    height: 54,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 32,
    elevation: 2,
    shadowColor: '#283618',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonText: {
    color: '#FEFAE0',
    fontSize: 15,
    fontWeight: '700',
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E1E5DC',
    alignSelf: 'center',
    zIndex: 10,
  },
  footerText: {
    fontSize: 13,
    color: '#606C38',
    fontWeight: '500',
  },
  footerLinkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#283618',
  },
});