// === Firebase Config ===
const firebaseConfig = {
  apiKey: "AIzaSyAlJuyVF0UmpIgkcZ38vH3oXO0t7l-ELEQ",
  authDomain: "camera-29af9.firebaseapp.com",
  projectId: "camera-29af9",
  storageBucket: "camera-29af9.appspot.com",
  messagingSenderId: "137294129723",
  appId: "1:137294129723:web:d49391307e9c05db524a1e",
  measurementId: "G-SYG1MG5KTB"
};

// Initialize Firebase (compat)
const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

// Camera & capture logic
const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const statusEl = document.getElementById("status");

// Capture settings
const CAPTURE_INTERVAL_MS = 5000; // every 5 seconds
const CAPTURE_WIDTH = 640;        // low-res width
const CAPTURE_HEIGHT = 480;       // low-res height

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    statusEl.textContent = "Camera started. Capturing every 5 seconds...";
    startCapturing();
  } catch (err) {
    console.error("Camera error:", err);
    statusEl.textContent = "Camera permission denied or error.";
  }
}

function startCapturing() {
  const ctx = canvas.getContext("2d");

  setInterval(() => {
    canvas.width = CAPTURE_WIDTH;
    canvas.height = CAPTURE_HEIGHT;
    ctx.drawImage(video, 0, 0, CAPTURE_WIDTH, CAPTURE_HEIGHT);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const timestamp = Date.now();
      const storageRef = storage.ref().child(`captures/${timestamp}.jpg`);

      storageRef.put(blob)
        .then(() => {
          statusEl.textContent = `Uploaded: ${timestamp}.jpg`;
          console.log("Uploaded", timestamp);
        })
        .catch((err) => {
          console.error("Upload error:", err);
          statusEl.textContent = "Upload failed.";
        });
    }, "image/jpeg", 0.7); // 0.7 quality to reduce size
  }, CAPTURE_INTERVAL_MS);
}

startCamera();
