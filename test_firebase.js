import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

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

async function testConnection() {
  console.log("--------------------------------------------------");
  console.log("Testing Firestore Cloud Connection...");
  console.log("Project:", firebaseConfig.projectId);
  console.log("--------------------------------------------------");

  let readOk = false;
  let writeOk = false;

  try {
    const docRef = doc(db, "site_data", "esn_settings");
    const snap = await getDoc(docRef);
    console.log("✔ READ SUCCESS: 'site_data/esn_settings' exists =", snap.exists());
    if (snap.exists()) {
      console.log("  Current settings data:", JSON.stringify(snap.data()).slice(0, 100) + "...");
    }
    readOk = true;
  } catch (e) {
    console.error("❌ READ FAILED:", e.code || e.message);
  }

  try {
    const testDoc = doc(db, "site_data", "test_sync");
    await setDoc(testDoc, { ping: "ok", timestamp: new Date().toISOString() }, { merge: true });
    console.log("✔ WRITE SUCCESS: Cloud Firestore accepted test write.");
    writeOk = true;
  } catch (e) {
    console.error("❌ WRITE FAILED:", e.code || e.message);
  }

  console.log("--------------------------------------------------");
  if (readOk && writeOk) {
    console.log("🎉 Firestore is FULLY OPERATIONAL. Multi-device sync is WORKING!");
    process.exit(0);
  } else {
    console.log("⚠️ Firestore Permission Denied detected.");
    console.log("To fix this, update your Firestore Security Rules in Firebase Console:");
    console.log("URL: https://console.firebase.google.com/project/" + firebaseConfig.projectId + "/firestore/rules");
    console.log("\nPaste the contents of firestore.rules into the console and click 'Publish'.");
    process.exit(1);
  }
}

testConnection();
