import firebase from 'firebase/app';
import 'firebase/auth'


let config = {
    // apiKey: "AIzaSyCYjq8QEAo9hDsmP9uezCcEryKQeeACAKE",
    // authDomain: "milife-learner.firebaseapp.com",
    // databaseURL: "https://milife-learner.firebaseio.com",
    // projectId: "milife-learner",
    // storageBucket: "XXXX",
    // messagingSenderId: "XXXX"
    apiKey: "AIzaSyCR911hB_Enz17WTN2-L17pbOt5Fdgl5hY",
    authDomain: "midigi1.firebaseapp.com",
    // databaseURL: "https://milife-learner.firebaseio.com",
    projectId: "midigi1",

};
firebase.initializeApp(config);

export default firebase;