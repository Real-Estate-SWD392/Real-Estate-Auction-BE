// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const multer = require("multer");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQhU2k38We3miJL4zcvFnTrXJO9piKYx0",
  authDomain: "real-estate-auction-551e9.firebaseapp.com",
  projectId: "real-estate-auction-551e9",
  storageBucket: "real-estate-auction-551e9.appspot.com",
  messagingSenderId: "507658367734",
  appId: "1:507658367734:web:5bf8f6a61bac8f6b8c72d7",
  measurementId: "G-5B41SV9K2S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const uploadFiles = (files, folder) => {
  return Promise.all(
    files.map((file) => {
      return new Promise((resolve, reject) => {
        if (!file) {
          reject({ error: true, message: "File not found" });
        } else {
          const fileName = Date.now() + "-" + file.originalname;
          const storageRef = ref(storage, `${folder}/${fileName}`);
          uploadBytes(storageRef, file.buffer, { contentType: file.mimetype })
            .then(() => getDownloadURL(storageRef))
            .then((downloadURL) => {
              console.log("File uploaded successfully:", downloadURL);
              resolve(downloadURL);
            })
            .catch((error) => {
              reject(error);
            });
        }
      });
    })
  );
};

const upload = multer({
  storage: multer.memoryStorage(),
});

module.exports = { uploadFiles, upload };
