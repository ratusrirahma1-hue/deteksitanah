import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Droplets,
  FlaskConical,
  History,
  Shovel,
  Trash2,
} from 'lucide-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// Struktur data lokal
interface LocalSoilRecord {
  id: string;
  tanggal: string;
  jam: string;
  phEstimasi: string;
  suhuEstimasi: string;
  status: string;
  pupuk: string;
  saran: string;
}

export default function HasilScreen() {
  const router = useRouter();
  const [data, setData] = useState<LocalSoilRecord[]>([]);

  useEffect(() => {
    loadLocalData();
  }, []);

  const loadLocalData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@soil_history');
      if (jsonValue != null) {
        const parsed = JSON.parse(jsonValue) as LocalSoilRecord[];
        setData(Array.isArray(parsed) ? parsed : []);
      } else {
        const dummyInitial: LocalSoilRecord[] = [
          {
            id: 'initial-dummy-1',
            tanggal: '08 Jul 2026',
            jam: '16:00',
            phEstimasi: '6.8',
            suhuEstimasi: '27',
            status: 'Subur (Optimal)',
            pupuk: 'NPK Kujang & Kompos Sapi',
            saran: 'Kondisi lahan sangat baik. Pertahankan kelembaban tanah dengan penyiraman berkala.',
          },
        ];
        await AsyncStorage.setItem('@soil_history', JSON.stringify(dummyInitial));
        setData(dummyInitial);
      }
    } catch (e) {
      console.log('Gagal memuat data lokal:', e);
      setData([]);
    }
  };

  const injectDataLokal = async () => {
    try {
      const sekarang = new Date();
      const tgl = sekarang.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
      const jm = sekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      const newData: LocalSoilRecord = {
        id: 'local-' + sekarang.getTime(),
        tanggal: tgl,
        jam: jm,
        phEstimasi: '6.5',
        suhuEstimasi: '28',
        status: 'Subur / Optimal',
        pupuk: 'NPK & Organik',
        saran: 'Siram tanaman secara teratur di pagi hari.',
      };

      setData((prev) => {
        const updateList = [newData, ...prev];
        void AsyncStorage.setItem('@soil_history', JSON.stringify(updateList));
        return updateList;
      });
      Alert.alert('Sukses', 'Data berhasil ditambahkan ke riwayat!');
    } catch (e) {
      Alert.alert('Gagal', 'Gagal menyimpan data lokal.');
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Hapus Riwayat', 'Yakin ingin menghapus data analisis ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            setData((prev) => {
              const filtered = prev.filter((item) => item.id !== id);
              void AsyncStorage.setItem('@soil_history', JSON.stringify(filtered));
              return filtered;
            });
          } catch (e) {
            Alert.alert('Gagal', 'Tidak dapat menghapus data.');
          }
        },
      },
    ]);
  };

  const downloadPDF = async (item: LocalSoilRecord) => {
    try {
      const html = `
      <html>
      <body style="padding:30px;font-family:Arial">
      <h1>Hasil Deteksi Kesuburan Tanah</h1>
      <hr/>
      <p><b>Tanggal :</b> ${item.tanggal}</p>
      <p><b>Jam :</b> ${item.jam}</p>
      <h2>Status Tanah : ${item.status}</h2>
      <p><b>pH Tanah :</b> ${item.phEstimasi}</p>
      <p><b>Suhu Tanah :</b> ${item.suhuEstimasi}°C</p>
      <p><b>Rekomendasi Pupuk :</b></p>
      <p>${item.pupuk}</p>
      <p><b>Saran :</b></p>
      <p>${item.saran}</p>
      <br/>
      <small>Sistem Deteksi Kesuburan Tanah - Local Storage Mode</small>
      </body>
      </html>
      `;

      const file = await Print.printToFileAsync({ html });
      if (file?.uri) {
        await Sharing.shareAsync(file.uri);
      }
    } catch {
      Alert.alert('Gagal', 'PDF tidak berhasil dibuat');
    }
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const renderItem = ({ item }: { item: LocalSoilRecord }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.timeGroup}>
            <Calendar size={13} color="#999" />
            <Text style={styles.dateText}>{item.tanggal}</Text>
            <View style={styles.dot} />
            <Clock size={13} color="#999" />
            <Text style={styles.dateText}>{item.jam}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: '#E8F5E9' }]}>
            <CheckCircle2 size={14} color="#2E7D32" />
            <Text style={[styles.statusLabel, { color: '#2E7D32' }]}>Optimal</Text>
          </View>
        </View>

        <Text style={styles.resultTitle}>Tanah {item.status}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>pH TANAH</Text>
            <View style={styles.statValueRow}>
              <Droplets size={16} color="#1976D2" />
              <Text style={styles.statValue}>{item.phEstimasi}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.recommendationBox}>
            <View style={styles.recItem}>
              <FlaskConical size={12} color="#555" />
              <Text style={styles.recTextBold}>{item.pupuk}</Text>
            </View>
            <View style={[styles.recItem, { marginTop: 4 }]}>
              <Shovel size={12} color="#555" />
              <Text style={styles.saranText}>{item.saran}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.downloadButton} onPress={() => downloadPDF(item)}>
            <Download size={16} color="#FFF" />
            <Text style={styles.downloadText}>Download PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
            <Trash2 size={16} color="#C62828" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2D5A27" />
      
      {/* HEADER UTAMA */}
      <View style={styles.headerContainer}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Riwayat Lahan</Text>
              <Text style={styles.headerSubtitle}>Mode Arsip Lokal (Aman Demo)</Text>
            </View>
            <View style={styles.iconHeaderBg}>
              <History size={24} color="#FFF" />
            </View>
          </View>
        </SafeAreaView>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
      />

      {/* TOMBOL KEMBALI MELAYANG (FLOATING) - PASTI KELIHATAN */}
      <TouchableOpacity 
        style={styles.floatingBackButton} 
        onPress={handleBackPress}
      >
        <ArrowLeft size={20} color="#FFF" />
        <Text style={styles.floatingBackText}>Kembali</Text>
      </TouchableOpacity>

      {/* TOMBOL SUNTIK DATA INSTAN */}
      <TouchableOpacity 
        style={styles.emergencyButton}
        onPress={injectDataLokal}
      >
        <Text style={styles.emergencyButtonText}>➕ TAMBAH DATA RIWAYAT BARU</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  headerContainer: { backgroundColor: '#2D5A27', padding: 25, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { color: '#ddd' },
  iconHeaderBg: { padding: 10 },

  floatingBackButton: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    backgroundColor: '#2D5A27',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 9999,
  },
  floatingBackText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  listPadding: { padding: 20, paddingBottom: 150 },
  card: { backgroundColor: '#fff', padding: 18, borderRadius: 20, marginBottom: 18 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  timeGroup: { flexDirection: 'row', alignItems: 'center' },
  dateText: { marginLeft: 5, fontSize: 11 },
  dot: { width: 4, height: 4, backgroundColor: '#999', marginHorizontal: 6, borderRadius: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 8, borderRadius: 10 },
  statusLabel: { fontWeight: 'bold', fontSize: 11 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 15 },
  statsRow: { flexDirection: 'row' },
  statBox: { width: 80 },
  divider: { width: 1, backgroundColor: '#ddd' },
  recommendationBox: { flex: 1, paddingLeft: 10 },
  statLabel: { fontSize: 10 },
  statValueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  recItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  recTextBold: { fontWeight: 'bold', fontSize: 12 },
  saranText: { fontSize: 11, flex: 1 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  downloadButton: { flex: 1, backgroundColor: '#2D5A27', padding: 14, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  downloadText: { color: '#FFF', fontWeight: 'bold' },
  deleteButton: { width: 48, backgroundColor: '#FFEBEE', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  emergencyButton: { backgroundColor: '#EF6C00', padding: 15, margin: 20, borderRadius: 14, alignItems: 'center' },
  emergencyButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 }
});