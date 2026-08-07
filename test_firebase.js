import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAD5brfUUCMfxxjqFke4vJtFx8eyhGE9us",
  authDomain: "environmental-shapers-network.firebaseapp.com",
  projectId: "environmental-shapers-network",
  storageBucket: "environmental-shapers-network.firebasestorage.app",
  messagingSenderId: "834783600290",
  appId: "1:834783600290:web:6b08ba48f099bd2c0c81fb",
  measurementId: "G-M1DV3S0X1R"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testWrite() {
  console.log("Attempting to write to Firestore...");
  try {
    const docRef = doc(db, "site_data", "test_key");
    await setDoc(docRef, { value: "test" }, { merge: true });
    console.log("Successfully wrote to Firestore! Database is NOT empty.");
    process.exit(0);
  } catch (e) {
    console.error("Firestore write failed:", e);
    process.exit(1);
  }
}

testWrite();
