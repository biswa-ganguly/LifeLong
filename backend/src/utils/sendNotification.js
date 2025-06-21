import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase service account key
const serviceAccount = JSON.parse(
  readFileSync(path.join(__dirname, "../../firebase-adminsdk.json"))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const sendPushNotification = async (messages) => {
  try {
    const response = await admin.messaging().sendEach(messages);
    console.log("Notifications sent:", response.successCount);
    return response;
  } catch (error) {
    console.error("Error sending notifications:", error);
    throw error;
  }
};