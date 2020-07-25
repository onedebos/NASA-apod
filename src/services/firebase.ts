import * as firebase from "firebase/app";
import "firebase/firestore";

interface configTypes {
  apiKey: string | undefined;
  databaseURL: string | undefined;
  projectId: string | undefined;
}

const firebaseConfig: configTypes = {
  apiKey: process.env.REACT_APP_apiKey,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
};

export const firebaseInit = firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
