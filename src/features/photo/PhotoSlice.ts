import { db } from "../../services/firebase";

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const apiKey: string | undefined = process.env.REACT_APP_API_KEY;
const baseURL: string = "https://api.nasa.gov/planetary/apod";

const buildFullUrl = (startDate: string) => {
  return `${baseURL}?api_key=${apiKey}&start_date=${startDate}&end_date=${startDate}`;
};

interface FavoritesObjProps {
  date: string;
  copyright: string;
  explanation: string;
  hd_url: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

type initState = {
  loading: boolean;
  photo: object;
  errors: string;
  description: string;
  additionalMsg: string;
  selectedDate: any;
  prevDayPhoto: object;
  nextDayPhoto: object;
  favorites: FavoritesObjProps | any; //TODO check type
};

export const initialState: initState = {
  loading: false,
  photo: {},
  errors: "",
  description: "",
  additionalMsg: "",
  selectedDate: new Date().toISOString(),
  favorites: [],
  prevDayPhoto: {},
  nextDayPhoto: {},
};

const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    setPhoto: (state: initState, { payload }) => {
      state.photo = payload;
    },
    setPrevPhoto: (state: initState, { payload }) => {
      state.photo = payload;
    },
    setNextPhoto: (state: initState, { payload }) => {
      state.photo = payload;
    },
    setLoading: (state: initState, { payload }) => {
      state.loading = payload;
    },
    setErrors: (state: initState, { payload }) => {
      state.errors = payload;
    },
    setDescription: (state: initState, { payload }) => {
      state.description = payload;
    },
    setAdditionalMsg: (state: initState, { payload }) => {
      state.additionalMsg = payload;
    },
    setSelectedDate: (state: initState, { payload }) => {
      state.selectedDate = payload;
    },
    savePOTDToLocalStorage: (state: initState, { payload }) => {
      interface Photo {
        date: string;
      }

      let POTDInStorage: any = localStorage.getItem("POTD");
      let data: any = [];

      if (POTDInStorage) {
        POTDInStorage = JSON.parse(POTDInStorage);
        POTDInStorage.map((photo: Photo) => {
          if (photo.date !== payload.date) {
            data.push(photo);
          }
          return null;
        });
        data.push(payload);
        state.favorites = data;
        localStorage.setItem("POTD", JSON.stringify(data));
      } else {
        data.push(payload);
        state.favorites = data;
        localStorage.setItem("POTD", JSON.stringify(data));
      }
    },
    getFavorites: (state: initState) => {
      let POTDInStorage: any = localStorage.getItem("POTD");
      state.favorites = JSON.parse(POTDInStorage);
    },
  },
});
export const {
  setPhoto,
  setPrevPhoto,
  setNextPhoto,
  setLoading,
  setErrors,
  setDescription,
  setSelectedDate,
  setAdditionalMsg,
  savePOTDToLocalStorage,
  getFavorites,
} = photoSlice.actions;

export default photoSlice.reducer;

export const photoSelector = (state: { photo: any }) => state.photo;

// GET TODAY's PHOTO
export const getTodaysPhoto = () => {
  return async (dispatch: (arg0: { payload: any; type: string }) => void) => {
    try {
      dispatch(setLoading(true));
      dispatch(setErrors(""));

      let todaysDate: any = new Date().toLocaleDateString().split("/");
      let dateString = `${todaysDate[2]}-${todaysDate[1]}-${todaysDate[0]}`;
      const res = await axios.get(buildFullUrl(dateString));

      // if a picture has not been released for the day
      if (res.data.length < 1) {
        throw new Error(
          "No picture of the day available. Please select a different date."
        );
      }
      dispatch(setPhoto(res.data[0]));
      dispatch(setLoading(false));
    } catch (error) {
      if (error.message === "Request failed with status code 504") {
        return dispatch(
          setErrors(
            "Looks like NASA's servers are down. Please try again later."
          )
        );
      }
      if (error.message === "Request failed with status code 400") {
        return dispatch(setErrors("It's a problem from us. Please try again."));
      }
      dispatch(setErrors(error.message));
      dispatch(setLoading(false));
    }
  };
};

// GET Photo from other days
export const getOtherDaysPhoto = (
  dateToFind: string,
  prevDayDateStr: string,
  nextDayDateString: string
) => {
  return async (dispatch: (arg0: { payload: any; type: string }) => void) => {
    dispatch(setLoading(true));
    dispatch(setErrors(""));
    try {
      const res = await axios.get(buildFullUrl(dateToFind));
      // TODO reformat to use undefined ? TypeScript method
      // For use in creating previews
      if (prevDayDateStr !== "NONE") {
        getPreviews(prevDayDateStr, "PREV_DAY");
      }

      if (nextDayDateString !== "NONE") {
        getPreviews(nextDayDateString, "NEXT_DAY");
      }

      if (res.data.length < 1) {
        throw new Error(
          "No picture of the day available. Please select a different date."
        );
      }
      dispatch(setPhoto(res.data[0]));

      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setErrors(error.message));
      dispatch(setLoading(false));
    }
  };
};

// GET previews
export const getPreviews = (dateToFind: string, dayToPreview: string) => {
  return async (dispatch: (arg0: { payload: any; type: string }) => void) => {
    try {
      const res = await axios.get(buildFullUrl(dateToFind));
      if (res.data.length < 1) {
        throw new Error(
          "No picture of the day available. Please select a different date."
        );
      }
      if (dayToPreview === "PREV_DAY") {
        dispatch(setPrevPhoto(res.data[0]));
      } else if (dayToPreview === "NEXT_DAY") {
        dispatch(setNextPhoto(res.data[0]));
      }

      dispatch(setLoading(false));
    } catch (error) {
      console.log(error.message);
    }
  };
};

// SAVE Favorites to LocalStorage
export const saveToStorage = (photo: object) => {
  return async (dispatch: (arg0: { payload: any; type: string }) => void) => {
    try {
      // await sendToFireStore(photo);  // IF ENABLED, SENDS FAVORITE TO FIRESTORE
      dispatch(savePOTDToLocalStorage(photo));
    } catch (error) {
      dispatch(setErrors("There was an issue saving to the DB."));
    }
  };
};

// DELETE all favorites from localStorage
export const deleteAllFromStorage = () => {
  return (dispatch: (arg0: { type: string }) => void) => {
    localStorage.clear();
    dispatch(getFavorites());
    console.log("deleted all");
  };
};

// DELETE a  favorite from localStorage
export const deleteOneFromStorage = (dateOfPhotoToDelete: string) => {
  return (dispatch: (arg0: { type: string }) => void) => {
    let POTDInStorage: any = localStorage.getItem("POTD");
    if (POTDInStorage) {
      POTDInStorage = JSON.parse(POTDInStorage);
      POTDInStorage = POTDInStorage.filter(
        (photo: any) => photo.date !== dateOfPhotoToDelete
      );
      if (POTDInStorage.length < 1) {
        localStorage.clear();
      } else {
        localStorage.setItem("POTD", JSON.stringify(POTDInStorage));
      }

      dispatch(getFavorites());
    }
  };
};

// See Details about a Photo in Favorites
export const seeMoreAboutFavPhoto = (photo: object) => {
  return async (dispatch: (arg0: { payload: any; type: string }) => void) => {
    dispatch(setLoading(true));
    dispatch(setErrors(""));
    try {
      dispatch(setPhoto(photo));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
    }
  };
};

////// FIRESTORE IMPLEMENTATION ////

// Helper Fn to Post Photos to Firestore

// const sendToFireStore = (photo: object) => {
//   return db.collection("photos").doc().set(photo);
// };

// Helper Fn to get Photos from Firestore

const getFromFireStore = () => {
  return db.collection("photos").get();
};

// Get photos from DB
export const getPhotosFromDb = () => {
  return async () => {
    try {
      console.log("loading");
      let arr: any = [];
      const photosInDb = await getFromFireStore();
      console.log("done");
      photosInDb.forEach((doc) => {
        arr.push(doc.data());
      });
      console.log(arr);
    } catch (error) {
      console.log("error");
    }
  };
};
