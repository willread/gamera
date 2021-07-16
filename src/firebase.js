import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
var firebaseConfig = {
    apiKey: 'AIzaSyB0OdTaI452TCg66WpvmNhmZfM5E1FxewY',
    authDomain: 'gamera-dev.firebaseapp.com',
    projectId: 'gamera-dev',
    storageBucket: 'gamera-dev.appspot.com',
    messagingSenderId: '52947056331',
    appId: '1:52947056331:web:d583ed595f6bbefe20cd4e',
    measurementId: 'G-T4T3ENQRDB',
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

export const db = firebase.firestore();
