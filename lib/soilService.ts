import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface SoilAnalysisRecord {
  id: string;
  facts: Record<string, any>;
  diagnosis: {
    status: string;
    kategori: string;
    pupuk: string;
    saran: string;
    [key: string]: any;
  };
  imgUrl?: string | null;
  lat?: number | null;
  long?: number | null;
  createdAt?: Timestamp | Date | null;
}

export const saveSoilAnalysis = async (
  facts: any,
  diagnosis: any,
  imgUrl: any,
  lat: any,
  long: any
) => {
  return await addDoc(collection(db, 'analisisTanah'), {
    facts,
    diagnosis,
    imgUrl,
    lat,
    long,
    createdAt: new Date(),
  });
};

export const subscribeToSoilHistory = (
  onNext: (items: SoilAnalysisRecord[]) => void,
  onError?: (error: Error) => void
) => {
  const q = query(collection(db, 'analisisTanah'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<SoilAnalysisRecord, 'id'>),
      }));
      onNext(items);
    },
    (error) => {
      if (onError) {
        onError(error);
      }
    }
  );
};

export const deleteSoilAnalysis = async (id: string) => {
  await deleteDoc(doc(db, 'analisisTanah', id));
};