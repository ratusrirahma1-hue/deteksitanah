import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Droplets,
  FlaskConical,
  History,
  Shovel,
  Sprout,
  Trash2,
} from 'lucide-react-native';

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { deleteSoilAnalysis, SoilAnalysisRecord, subscribeToSoilHistory } from '@/lib/soilService';

export default function HasilScreen() {
  const [data, setData] = useState<SoilAnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToSoilHistory(
      (items) => {
        setData(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.warn('Firestore error:', err);
        setError('Gagal memuat riwayat. Periksa koneksi & konfigurasi Firebase.');
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const formatTanggalJam = (record: SoilAnalysisRecord) => {
    if (!record.createdAt) return { tanggal: '-', jam: '-' };

    const date = record.createdAt instanceof Date
      ? record.createdAt
      : typeof (record.createdAt as { toDate?: () => Date }).toDate === 'function'
        ? (record.createdAt as { toDate: () => Date }).toDate()
        : new Date();

    const tanggal = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const jam = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    return { tanggal, jam };
  };

  const handleDelete = (id: string) => {
    Alert.alert('Hapus Riwayat', 'Yakin ingin menghapus data analisis ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSoilAnalysis(id);
          } catch {
            Alert.alert('Gagal', 'Tidak dapat menghapus data.');
          }
        },
      },
    ]);
  };

  const downloadPDF = async (record: SoilAnalysisRecord) => {
    try {
      const { tanggal, jam } = formatTanggalJam(record);
      const { diagnosis, facts } = record;

      const html = `
      <html>
      <body style="padding:30px;font-family:Arial">

      <h1>Hasil Deteksi Kesuburan Tanah</h1>

      <hr/>

      <p><b>Tanggal :</b> ${tanggal}</p>
      <p><b>Jam :</b> ${jam}</p>

      <h2>Status Tanah : ${diagnosis.status}</h2>

      <p><b>pH Tanah :</b> ${facts.phEstimasi}</p>
      <p><b>Suhu Tanah :</b> ${facts.suhuEstimasi}°C</p>

      <p><b>Rekomendasi Pupuk :</b></p>
      <p>${diagnosis.pupuk}</p>

      <p><b>Saran :</b></p>
      <p>${diagnosis.saran}</p>

      <br/>

      <small>
      Sistem Deteksi Kesuburan Tanah
      Forward Chaining
      </small>

      </body>
      </html>
      `;

      const file = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(file.uri);
    } catch {
      Alert.alert('Gagal', 'PDF tidak berhasil dibuat');
    }
  };

  const getStatusTheme = (kategori: string) => {
    switch (kategori) {
      case 'good':
        return { bg: '#E8F5E9', text: '#2E7D32', icon: <CheckCircle2 size={14} color="#2E7D32" />, label: 'Optimal' };
      case 'critical':
        return { bg: '#FFEBEE', text: '#C62828', icon: <AlertCircle size={14} color="#C62828" />, label: 'Tindakan' };
      default:
        return { bg: '#FFF3E0', text: '#EF6C00', icon: <AlertCircle size={14} color="#EF6C00" />, label: 'Pantau' };
    }
  };

  const renderItem = ({ item }: { item: SoilAnalysisRecord }) => {
    const { tanggal, jam } = formatTanggalJam(item);
    const theme = getStatusTheme(item.diagnosis.kategori);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.timeGroup}>
            <Calendar size={13} color="#999" />
            <Text style={styles.dateText}>{tanggal}</Text>
            <View style={styles.dot} />
            <Clock size={13} color="#999" />
            <Text style={styles.dateText}>{jam}</Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: theme.bg }]}>
            {theme.icon}
            <Text style={[styles.statusLabel, { color: theme.text }]}>{theme.label}</Text>
          </View>
        </View>

        <Text style={styles.resultTitle}>Tanah {item.diagnosis.status}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>pH TANAH</Text>
            <View style={styles.statValueRow}>
              <Droplets size={16} color="#1976D2" />
              <Text style={styles.statValue}>{item.facts.phEstimasi}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.recommendationBox}>
            <View style={styles.recItem}>
              <FlaskConical size={12} color="#555" />
              <Text style={styles.recTextBold}>{item.diagnosis.pupuk}</Text>
            </View>
            <View style={[styles.recItem, { marginTop: 4 }]}>
              <Shovel size={12} color="#555" />
              <Text style={styles.saranText}>{item.diagnosis.saran}</Text>
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

      <View style={styles.headerContainer}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Riwayat Lahan</Text>
              <Text style={styles.headerSubtitle}>Arsip Diagnosa (Firestore)</Text>
            </View>
            <View style={styles.iconHeaderBg}>
              <History size={24} color="#FFF" />
            </View>
          </View>
        </SafeAreaView>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#2D5A27" />
          <Text style={styles.centerText}>Memuat riwayat...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <AlertCircle size={32} color="#C62828" />
          <Text style={styles.centerText}>{error}</Text>
        </View>
      ) : data.length === 0 ? (
        <View style={styles.centerBox}>
          <Sprout size={32} color="#A0A0A0" />
          <Text style={styles.centerText}>Belum ada riwayat analisis.{'\n'}Yuk pindai tanah di menu Pindai.</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listPadding}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  headerContainer: { backgroundColor: '#2D5A27', padding: 25, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between' },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { color: '#ddd' },
  iconHeaderBg: { padding: 10 },
  listPadding: { padding: 20 },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30, gap: 12 },
  centerText: { textAlign: 'center', color: '#888', fontSize: 13, lineHeight: 20 },
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
});
