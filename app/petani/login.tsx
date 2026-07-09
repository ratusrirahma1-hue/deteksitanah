import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Leaf, Lock, Mail, ArrowRight, UserPlus } from 'lucide-react-native';
import { auth } from './_petaniAuthService';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Gagal", "Semua kolom wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      // Proses autentikasi langsung ke Firebase
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/');
    } catch (error: any) {
      let errorMsg = "Email atau password salah.";
      if (error.code === 'auth/invalid-email') errorMsg = "Format email tidak valid.";
      if (error.code === 'auth/user-not-found') errorMsg = "Pengguna tidak ditemukan.";
      if (error.code === 'auth/wrong-password') errorMsg = "Password yang Anda masukkan salah.";
      
      Alert.alert("Login Gagal", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.headerSection}>
        <View style={styles.logoCircle}>
          <Leaf color="#2D5A27" size={36} />
        </View>
        <Text style={styles.title}>Selamat Datang Kembali</Text>
        <Text style={styles.subtitle}>Masuk untuk memantau kondisi sawah dan diagnosa AI Anda</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.inputLabel}>Alamat Email</Text>
        <View style={styles.inputWrapper}>
          <Mail color="#999" size={20} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="contoh@petani.com"
            placeholderTextColor="#AAA"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={styles.inputLabel}>Kata Sandi</Text>
        <View style={styles.inputWrapper}>
          <Lock color="#999" size={20} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Masukkan kata sandi"
            placeholderTextColor="#AAA"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              <Text style={styles.buttonText}>Masuk Sekarang</Text>
              <ArrowRight color="#FFF" size={18} />
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footerSection}>
        <Text style={styles.footerText}>Belum punya akun petani? </Text>
        <TouchableOpacity onPress={() => router.push('/petani/register')} style={styles.footerLinkWrapper}>
          <UserPlus color="#2D5A27" size={14} />
          <Text style={styles.footerLink}>Daftar Disini</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 30,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 35,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 15,
  },
  formSection: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
    marginTop: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 52,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 15,
    height: '100%',
  },
  buttonPrimary: {
    backgroundColor: '#2D5A27',
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    fontSize: 13,
    color: '#666',
  },
  footerLinkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2D5A27',
  },
});