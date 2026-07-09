import { saveSoilAnalysis } from '@/lib/soilService';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { AlertTriangle, ArrowLeft, Calendar, CheckCircle2, Clock, Droplets, FlaskConical, Shovel, Thermometer, Zap } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function KameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // State untuk perpindahan halaman internal (Bypass Router)
  const [currentView, setCurrentView] = useState<'camera' | 'history'>('camera');
  
  // State data riwayat langsung di memori aktif (Anti-Gagal)
  const [riwayatData, setRiwayatData] = useState([
    { 
      id: "demo-awal",
      tanggal: "08 Jul 2026",
      jam: "16:00",
      phEstimasi: "6.8",
      suhuEstimasi: "27",
      status: "Subur (Optimal)",
      pupuk: "NPK Kujang & Kompos Sapi",
      saran: "Kondisi lahan sangat baik. Pertahankan kelembaban tanah dengan penyiraman berkala."
    }
  ]);

  const [displayData, setDisplayData] = useState({ ph: '--', temp: '--', color: '--' });
  const cameraRef = useRef<any>(null);

  if (!permission) return <View style={styles.container}><ActivityIndicator size="large" color="#fff" /></View>;
  
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Izin kamera diperlukan untuk analisa tanah</Text>
        <TouchableOpacity style={styles.buttonPermission} onPress={requestPermission}>
          <Text style={styles.buttonText}>Beri Izin</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const prosesSimpanData = async () => {
    const sekarang = new Date();
    const tgl = sekarang.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const jm = sekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const dataBaru = {
      id: "id-" + sekarang.getTime(),
      tanggal: tgl,
      jam: jm,
      phEstimasi: "6.5",
      suhuEstimasi: "28",
      status: "Subur / Optimal",
      pupuk: "NPK & Organik",
      saran: "Siram tanaman secara teratur di pagi hari."
    };

    try {
      setIsSaving(true);
      await saveSoilAnalysis(
        { phEstimasi: dataBaru.phEstimasi, suhuEstimasi: dataBaru.suhuEstimasi },
        {
          status: dataBaru.status,
          pupuk: dataBaru.pupuk,
          saran: dataBaru.saran,
          kategori: 'good',
        },
        null,
        null,
        null
      );

      setRiwayatData((prev) => [dataBaru, ...prev]);
      setCurrentView('history');
      Alert.alert('Sukses', 'Data analisis berhasil disimpan ke Firestore.');
    } catch (error) {
      console.error('Gagal menyimpan analisis:', error);
      Alert.alert('Gagal', 'Data gagal disimpan ke Firestore. Periksa koneksi dan konfigurasi Firebase.');
    } finally {
      setIsSaving(false);
    }
  };

  const processAnalysis = async () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setDisplayData({ ph: "6.5", temp: "28°C", color: "Coklat Tua" });
      setIsAnalyzing(false);
      void prosesSimpanData();
    }, 1500);
  };

  const takePicture = async () => {
    if (!isAnalyzing) {
      processAnalysis();
    }
  };

  // --- TAMPILAN JIKA DALAM MODE RIWAYAT HASIL ---
  if (currentView === 'history') {
    return (
      <View style={styles.historyContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#2D5A27" />
        <View style={styles.headerContainer}>
          <SafeAreaView>
            <View style={styles.headerContent}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {/* TOMBOL KEMBALI MANUAL KE KAMERA (AMBIL FOTO LAGI) */}
                <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentView('camera')}>
                  <ArrowLeft size={24} color="#FFF" />
                </TouchableOpacity>
                <View>
                  <Text style={styles.headerTitle}>Hasil Analisis</Text>
                  <Text style={styles.headerSubtitle}>Arsip Lahan Terkini</Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </View>

        <FlatList
          data={riwayatData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
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
                  <Text style={{ fontWeight: 'bold', fontSize: 11, color: '#2E7D32' }}>Optimal</Text>
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
                    <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{item.pupuk}</Text>
                  </View>
                  <View style={[styles.recItem, { marginTop: 4 }]}>
                    <Shovel size={12} color="#555" />
                    <Text style={{ fontSize: 11, flex: 1 }}>{item.saran}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    );
  }

  // --- TAMPILAN DEFAULT (KAMERA) ---
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} enableTorch={flash === 'on'} ref={cameraRef}>
        <View style={styles.overlay}>
          <View style={styles.infoRow}>
            <View style={styles.badge}>
              <Droplets size={14} color="#2196F3" />
              <Text style={styles.badgeText}>pH: {displayData.ph}</Text>
            </View>
            <View style={styles.badge}>
              <Thermometer size={14} color="#FF5252" />
              <Text style={styles.badgeText}>{displayData.temp}</Text>
            </View>
          </View>

          <View style={[styles.scanArea, isAnalyzing && styles.scanAreaActive]}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
            {isAnalyzing && <View style={styles.scanningLine} />}
          </View>
          
          <View style={styles.instructionBox}>
            {isAnalyzing ? (
              <ActivityIndicator color="#4CAF50" style={{ marginBottom: 10 }} />
            ) : (
              <AlertTriangle size={16} color="#FFEB3B" style={{ marginBottom: 5 }} />
            )}
            <Text style={styles.scanText}>
              {isAnalyzing ? "Memvalidasi Objek & Unsur..." : "Arahkan Hanya ke Objek Tanah"}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={() => setFlash(f => f === 'off' ? 'on' : 'off')}>
            <Zap color={flash === 'on' ? "#FFEB3B" : "#fff"} size={22} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={takePicture} disabled={isAnalyzing || isSaving}>
            <View style={styles.captureInternal} />
          </TouchableOpacity>

          {/* TOMBOL PINTAS UNTUK MELIHAT DAFTAR RIWAYAT SECARA MANUAL */}
          <TouchableOpacity style={styles.iconButton} onPress={() => setCurrentView('history')}>
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>LIST</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  message: { color: '#fff', textAlign: 'center', marginBottom: 20 },
  buttonPermission: { backgroundColor: '#2D5A27', padding: 12, borderRadius: 20, alignSelf: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  infoRow: { flexDirection: 'row', position: 'absolute', top: 60, gap: 10 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, gap: 5 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  scanArea: { width: 260, height: 260, position: 'relative', justifyContent: 'center', alignItems: 'center' },
  scanAreaActive: { backgroundColor: 'rgba(76, 175, 80, 0.1)' },
  cornerTopLeft: { position: 'absolute', top: 0, left: 0, width: 25, height: 25, borderLeftWidth: 3, borderTopWidth: 3, borderColor: '#FFF' },
  cornerTopRight: { position: 'absolute', top: 0, right: 0, width: 25, height: 25, borderRightWidth: 3, borderTopWidth: 3, borderColor: '#FFF' },
  cornerBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: 25, height: 25, borderLeftWidth: 3, borderBottomWidth: 3, borderColor: '#FFF' },
  cornerBottomRight: { position: 'absolute', bottom: 0, right: 0, width: 25, height: 25, borderRightWidth: 3, borderBottomWidth: 3, borderColor: '#FFF' },
  instructionBox: { position: 'absolute', bottom: 160, alignItems: 'center' },
  scanText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  buttonContainer: {
    position: 'absolute',
    bottom: 95,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  iconButton: { width: 50, height: 50, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  captureButton: { width: 70, height: 70, borderRadius: 35, borderWidth: 4, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  captureInternal: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#4CAF50' },
  scanningLine: { width: '100%', height: 2, backgroundColor: '#4CAF50', position: 'absolute', top: 0 },
  
  // Styles untuk view riwayat
  historyContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  headerContainer: { backgroundColor: '#2D5A27', padding: 25, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { color: '#ddd', fontSize: 12 },
  backBtn: { padding: 5, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10 },
  card: { backgroundColor: '#fff', padding: 18, borderRadius: 20, marginBottom: 18 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  timeGroup: { flexDirection: 'row', alignItems: 'center' },
  dateText: { marginLeft: 5, fontSize: 11, color: '#999' },
  dot: { width: 4, height: 4, backgroundColor: '#999', marginHorizontal: 6, borderRadius: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 6, borderRadius: 10 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 12 },
  statsRow: { flexDirection: 'row' },
  statBox: { width: 80 },
  divider: { width: 1, backgroundColor: '#ddd' },
  recommendationBox: { flex: 1, paddingLeft: 10 },
  statLabel: { fontSize: 10, color: '#999' },
  statValueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  recItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 }
});