import * as Location from 'expo-location';
import { Compass, Droplets, Layers, MapPin, RefreshCw, Shovel, Sun, Thermometer } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Svg, { Circle, Line } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function SoilDashboardScreen() {
  const [iotData, setIotData] = useState({
    ph: 6.5,
    moisture: 72,
    temperature: 28.4,
    nitrogen: 140,
  });
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState({
    latitude: -6.015,
    longitude: 106.051,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      setCurrentLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }
    })();
  }, []);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIotData({
        ph: parseFloat((6.2 + Math.random() * 0.8).toFixed(1)),
        moisture: Math.floor(65 + Math.random() * 15),
        temperature: parseFloat((27.5 + Math.random() * 2).toFixed(1)),
        nitrogen: Math.floor(130 + Math.random() * 25),
      });
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F0" />
      
      {/* HEADER DASHBOARD */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Selamat Datang</Text>
          <Text style={styles.subWelcome}>Sistem Monitoring Unsur Hara Tanah</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={handleRefreshData} disabled={isRefreshing}>
          <RefreshCw size={18} color="#606C38" style={isRefreshing ? styles.rotating : {}} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* INTEGRASI MAPS / PETA LAHAN */}
        <View style={styles.mapCard}>
          <View style={styles.cardHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MapPin size={18} color="#606C38" />
              <Text style={styles.cardTitle}>Lokasi Lahan Pantauan</Text>
            </View>
            <View style={styles.statusLive}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>TERKONEKSI</Text>
            </View>
          </View>
          
          <View style={styles.mapWrapper}>
            <MapView
              ref={(ref) => { mapRef.current = ref; }}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={region}
              mapType="hybrid"
              showsUserLocation
              followsUserLocation
            >
              <Marker
                coordinate={{ latitude: -6.015, longitude: 106.051 }}
                title="Lahan Utama Budi"
                description="Status Tanah: Optimal / Subur"
              />
              {currentLocation ? (
                <Marker
                  coordinate={{
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                  }}
                  title="Lokasi GPS Anda"
                  pinColor="#606C38"
                />
              ) : null}
            </MapView>
            <View style={styles.mapOverlayInfo}>
              <Compass size={13} color="#FEFAE0" />
              <Text style={styles.mapOverlayText}>
                {currentLocation ? 'GPS Aktif' : 'Mencari GPS...'}
              </Text>
            </View>
          </View>
        </View>

        {/* METRICS GRID INDIKATOR TANAH (IoT) */}
        <Text style={styles.sectionTitle}>Indikator Real-time Lahan</Text>
        <View style={styles.gridContainer}>
          
          {/* PH TANAH */}
          <View style={styles.metricCard}>
            <View style={[styles.iconIconBg, { backgroundColor: '#EAF0E6' }]}>
              <Shovel size={20} color="#606C38" />
            </View>
            <Text style={styles.metricLabel}>Tingkat pH</Text>
            <Text style={styles.metricValue}>{iotData.ph}</Text>
            <Text style={[styles.metricStatus, { color: iotData.ph >= 6.5 ? '#283618' : '#A67C00' }]}>
              {iotData.ph >= 6.5 ? 'Normal (Netral)' : 'Agak Asam'}
            </Text>
          </View>

          {/* KELEMBABAN */}
          <View style={styles.metricCard}>
            <View style={[styles.iconIconBg, { backgroundColor: '#E3F2FD' }]}>
              <Droplets size={20} color="#1E88E5" />
            </View>
            <Text style={styles.metricLabel}>Kelembaban</Text>
            <Text style={styles.metricValue}>{iotData.moisture}%</Text>
            <Text style={[styles.metricStatus, { color: '#283618' }]}>Optimal</Text>
          </View>

          {/* SUHU */}
          <View style={styles.metricCard}>
            <View style={[styles.iconIconBg, { backgroundColor: '#FDF0ED' }]}>
              <Thermometer size={20} color="#E05A47" />
            </View>
            <Text style={styles.metricLabel}>Suhu Tanah</Text>
            <Text style={styles.metricValue}>{iotData.temperature}°C</Text>
            <Text style={[styles.metricStatus, { color: '#283618' }]}>Normal</Text>
          </View>

          {/* NITROGEN */}
          <View style={styles.metricCard}>
            <View style={[styles.iconIconBg, { backgroundColor: '#FEFAE0' }]}>
              <Sun size={20} color="#D4A373" />
            </View>
            <Text style={styles.metricLabel}>Kandungan N</Text>
            <Text style={styles.metricValue}>{iotData.nitrogen} <Text style={{fontSize:10, fontWeight:'400'}}>mg/kg</Text></Text>
            <Text style={[styles.metricStatus, { color: '#283618' }]}>Cukup</Text>
          </View>
        </View>

        {/* GRAFIK PERKEMBANGAN TANAH */}
        <View style={styles.chartCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 15 }}>
            <Layers size={18} color="#606C38" />
            <Text style={styles.cardTitle}>Tren Stabilitas Keasaman (pH)</Text>
          </View>

          <View style={styles.chartWrapper}>
            <Svg height="100" width={width - 70}>
              <Line x1="0" y1="20" x2={width - 70} y2="20" stroke="#ECEFF1" strokeWidth="1" />
              <Line x1="0" y1="50" x2={width - 70} y2="50" stroke="#ECEFF1" strokeWidth="1" />
              <Line x1="0" y1="80" x2={width - 70} y2="80" stroke="#ECEFF1" strokeWidth="1" />
              
              {/* Garis Tren Hijau Aesthetic */}
              <Line x1="10" y1="75" x2="80" y2="45" stroke="#606C38" strokeWidth="3" strokeLinecap="round" />
              <Line x1="80" y1="45" x2="150" y2="55" stroke="#606C38" strokeWidth="3" strokeLinecap="round" />
              <Line x1="150" y1="55" x2="220" y2="30" stroke="#606C38" strokeWidth="3" strokeLinecap="round" />
              <Line x1="220" y1="30" x2="290" y2="40" stroke="#606C38" strokeWidth="3" strokeLinecap="round" />

              {/* Titik Simpul Terakota Mentah */}
              <Circle cx="10" cy="75" r="4.5" fill="#D4A373" />
              <Circle cx="80" cy="45" r="4.5" fill="#D4A373" />
              <Circle cx="150" cy="55" r="4.5" fill="#D4A373" />
              <Circle cx="220" cy="30" r="4.5" fill="#D4A373" />
              <Circle cx="290" cy="40" r="4.5" fill="#D4A373" />
            </Svg>
            
            <View style={styles.chartLabelsRow}>
              <Text style={styles.chartLabelText}>Sen</Text>
              <Text style={styles.chartLabelText}>Sel</Text>
              <Text style={styles.chartLabelText}>Rab</Text>
              <Text style={styles.chartLabelText}>Kam</Text>
              <Text style={styles.chartLabelText}>Jum</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F0' }, // Latar hangat abu-hijau pucat lembut
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#EAECE6' },
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#283618' }, // Hijau tua pekat asli tumbuhan
  subWelcome: { fontSize: 12, color: '#606C38', marginTop: 3, fontWeight: '500' }, // Sage Green text
  refreshBtn: { width: 38, height: 38, backgroundColor: '#EAF0E6', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  rotating: { transform: [{ rotate: '45deg' }] },
  
  scrollContainer: { padding: 20, paddingBottom: 40 },
  
  // Card Maps Custom Design
  mapCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#E1E5DC', elevation: 1, shadowColor: '#283618', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#283618' },
  statusLive: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#EAF0E6', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  liveDot: { width: 6, height: 6, backgroundColor: '#606C38', borderRadius: 3 },
  liveText: { fontSize: 9, fontWeight: '700', color: '#606C38', letterSpacing: 0.5 },
  mapWrapper: { height: 190, borderRadius: 18, overflow: 'hidden', position: 'relative' },
  map: { flex: 1 },
  mapOverlayInfo: { position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(40, 54, 24, 0.85)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 5 },
  mapOverlayText: { color: '#FEFAE0', fontSize: 10, fontWeight: '600' },

  // Grid Indikator Minimalis
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#283618', marginBottom: 14, marginLeft: 4, letterSpacing: 0.3 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 20 },
  metricCard: { backgroundColor: '#FFF', width: (width - 54) / 2, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#E1E5DC' },
  iconIconBg: { width: 40, height: 40, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  metricLabel: { fontSize: 12, color: '#6D7466', fontWeight: '600' },
  metricValue: { fontSize: 22, fontWeight: 'bold', color: '#283618', marginVertical: 4, letterSpacing: -0.5 },
  metricStatus: { fontSize: 11, fontWeight: '700', marginTop: 2 },

  // Grafik Perkembangan Card
  chartCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#E1E5DC', elevation: 1, shadowColor: '#283618', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  chartWrapper: { alignItems: 'center', marginTop: 5 },
  chartLabelsRow: { flexDirection: 'row', justifyContent: 'space-between', width: width - 70, paddingHorizontal: 12, marginTop: 10 },
  chartLabelText: { fontSize: 11, color: '#A0A699', fontWeight: '600' },
});