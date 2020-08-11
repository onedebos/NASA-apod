import axios from "axios";
import { db } from "./firebase";
import { PhotoObj } from "../common/types";

const apiKey: string | undefined = process.env.REACT_APP_API_KEY;
const baseURL: string = "https://api.nasa.gov/planetary/apod";

export const getPictureData = async (startDate: string) => {
  const res = await axios.get(
    `${baseURL}?api_key=${apiKey}&start_date=${startDate}&end_date=${startDate}`
  );
  return res;
};

export const getFromFireStore = async () => {
  return db.collection("photos").get();
};

export const sendToFireStore = async (photo: PhotoObj) => {
  return db.collection("photos").doc(photo.id).set(photo);
};

export const deleteFromFireStore = async (id: string) => {
  return db.collection("photos").doc(id).delete();
};
