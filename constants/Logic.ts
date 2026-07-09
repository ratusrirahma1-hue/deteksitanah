// 1. Definisi struktur data Fakta yang diterima dari Kamera
export interface Facts {
  warnaTanah: string;
  phEstimasi: number;
  suhuEstimasi: number;
}

// 2. Definisi Struktur Hasil Diagnosa
export interface DiagnosisResult {
  status: string;
  masalah: string;
  saran: string;
  warnaUI: string; // Untuk indikator warna di aplikasi
}

/**
 * Algoritma Forward Chaining
 * Menentukan kesuburan berdasarkan pH, Suhu, dan Warna Tanah
 */
export const analyzeSoil = (facts: Facts): DiagnosisResult => {
  
  // Aturan 1: Kondisi Optimal (Subur)
  if (
    facts.phEstimasi >= 6.0 && 
    facts.phEstimasi <= 7.0 && 
    facts.suhuEstimasi >= 24 && 
    facts.suhuEstimasi <= 30
  ) {
    return {
      status: "Sangat Subur",
      masalah: "Kondisi Tanah Optimal",
      saran: "Pertahankan sistem irigasi dan lakukan pemupukan organik rutin.",
      warnaUI: "#4CAF50"
    };
  }

  // Aturan 2: Tanah Masam (pH Rendah)
  if (facts.phEstimasi < 5.5) {
    return {
      status: "Tanah Masam",
      masalah: "Tingkat Keasaman Tinggi (pH Rendah)",
      saran: "Berikan Kapur Dolomit untuk menaikkan pH tanah ke angka netral.",
      warnaUI: "#F44336"
    };
  }

  // Aturan 3: Tanah Terlalu Basa (pH Tinggi)
  if (facts.phEstimasi > 7.5) {
    return {
      status: "Tanah Alkali",
      masalah: "Tingkat Kebasaan Tinggi (pH Tinggi)",
      saran: "Tambahkan belerang (sulfur) atau pupuk amonium sulfat.",
      warnaUI: "#2196F3"
    };
  }

  // Aturan 4: Tanah Terlalu Panas (Suhu Tinggi)
  if (facts.suhuEstimasi > 32) {
    return {
      status: "Stres Panas",
      masalah: "Suhu Tanah Terlalu Tinggi",
      saran: "Lakukan penggenangan air (irigasi) untuk mendinginkan suhu perakaran.",
      warnaUI: "#FF9800"
    };
  }

  // Aturan 5: Analisis berdasarkan Warna (Contoh: Tanah Pucat/Pasir)
  if (facts.warnaTanah.includes("Pucat") || facts.warnaTanah.includes("Terang")) {
    return {
      status: "Kurang Hara",
      masalah: "Kandungan Bahan Organik Rendah",
      saran: "Tambahkan pupuk kandang atau kompos dalam jumlah besar.",
      warnaUI: "#795548"
    };
  }

  // Aturan Default jika data berada di tengah-tengah
  return {
    status: "Cukup Subur",
    masalah: "Perlu Penyesuaian Ringan",
    saran: "Cek ketersediaan air dan tambahkan sedikit pupuk NPK.",
    warnaUI: "#8BC34A"
  };
};