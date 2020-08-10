import { db } from "../../services/firebase";
import moment from "moment";
import { createSlice } from "@reduxjs/toolkit";
import getPictureData from "../../services/service";

interface IFavoriteObjProps {
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
  selectedDate: string;
  prevDayPhoto: object;
  nextDayPhoto: object;
  favorites: Array<IFavoriteObjProps> | object; //TODO check type
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

      const POTDInStorage: string | null = localStorage.getItem("POTD");
      let data: Array<object> = [];

      if (POTDInStorage) {
        const photosInStorage: Array<Photo> = JSON.parse(POTDInStorage);
        photosInStorage.map((photo: Photo) => {
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
      const POTDInStorage: any = localStorage.getItem("POTD");

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
  return async (
    dispatch: (arg0: {
      payload: Array<IFavoriteObjProps>;
      type: string;
    }) => void
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setErrors(""));

      let todaysDate: any = moment(new Date());
      todaysDate = todaysDate.format("YYYY-MM-DD");

      const res = await getPictureData(todaysDate);
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
  return async (
    dispatch: (arg0: {
      payload: Array<IFavoriteObjProps>;
      type: string;
    }) => void
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setErrors(""));

      const res = await getPictureData(dateToFind);
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
  return async (
    dispatch: (arg0: {
      payload: Array<IFavoriteObjProps>;
      type: string;
    }) => void
  ) => {
    try {
      const res = await getPictureData(dateToFind);
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
  return async (
    dispatch: (arg0: {
      payload: Array<IFavoriteObjProps>;
      type: string;
    }) => void
  ) => {
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
    const POTDInStorage: string | null = localStorage.getItem("POTD");
    if (POTDInStorage) {
      let photosFromStorage: Array<IFavoriteObjProps> = JSON.parse(
        POTDInStorage
      );
      photosFromStorage = photosFromStorage.filter(
        (photo: IFavoriteObjProps) => photo.date !== dateOfPhotoToDelete
      );

      if (photosFromStorage.length < 1) {
        localStorage.clear();
      } else {
        localStorage.setItem("POTD", JSON.stringify(photosFromStorage));
      }

      dispatch(getFavorites());
    }
  };
};

// See Details about a Photo in Favorites
export const seeMoreAboutFavPhoto = (photo: object) => {
  return async (
    dispatch: (arg0: { payload: IFavoriteObjProps; type: string }) => void
  ) => {
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
      let arr: Array<object> = [];
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
