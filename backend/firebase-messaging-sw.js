// Content of firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase with your config (same as in fcm-token.html)
firebase.initializeApp({
  apiKey: "AIzaSyCWBhum16lwheuLT8WGKHVjSCno_Ha2FA4",
        authDomain: "emergency-app-ec4e3.firebaseapp.com",
        projectId: "emergency-app-ec4e3",
        storageBucket: "emergency-app-ec4e3.firebasestorage.app",
        messagingSenderId: "753417943673",
        appId: "1:753417943673:web:ced67c4b0eb6cc0da832a8"
});

const messaging = firebase.messaging();

// Optional: Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log('Background message:', payload);
  const { title, body } = payload.notification;
  self.registration.showNotification(title, { body });
});