
// === Firebase Config (replace with your own) ===
const firebaseConfig = {
  apiKey: "AIzaSyAlJuyVF0UmpIgkcZ38vH3oXO0t7l-ELEQ",
  authDomain: "camera-29af9.firebaseapp.com",
  projectId: "camera-29af9",
  storageBucket: "camera-29af9.appspot.com",
  messagingSenderId: "137294129723",
  appId: "1:137294129723:web:d49391307e9c05db524a1e",
  measurementId: "G-SYG1MG5KTB"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

// === Camera & Capture Logic ===
const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const statusEl = document.getElementById("status");

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    statusEl.textContent = "Camera started. Capturing every second...";
    startCapturing();
  } catch (err) {
    console.error("Camera error:", err);
    statusEl.textContent = "Camera permission denied or error.";
  }
}

function startCapturing() {
  const ctx = canvas.getContext("2d");
  setInterval(() => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const timestamp = Date.now();
      const storageRef = storage.ref().child(`captures/${timestamp}.jpg`);

      storageRef.put(blob).then(() => {
        statusEl.textContent = `Uploaded: ${timestamp}.jpg`;
        console.log("Uploaded", timestamp);
      }).catch((err) => {
        console.error("Upload error:", err);
        statusEl.textContent = "Upload failed.";
      });
    }, "image/jpeg");
  }, 1000); // 1 capture per second
}

startCamera();
