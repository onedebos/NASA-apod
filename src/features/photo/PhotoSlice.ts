import moment from "moment";
import { createSlice } from "@reduxjs/toolkit";
import {
  getPictureData,
  getFromFireStore,
  sendToFireStore,
  deleteFromFireStore,
} from "../../services/service";
import { PhotoObj, PhotoState } from "../../common/types";

export const initialState: PhotoState = {
  loading: false,
  photo: {
    date: "",
    copyright: "",
    explanation: "",
    hd_url: "",
    media_type: "",
    service_version: "",
    title: "",
    url: "",
  },
  errors: "",
  description: "",
  additionalMsg: "",
  selectedDate: new Date().toISOString(),
  favorites: [],
  photosInDb: [],
};

const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    setPhoto: (state: PhotoState, { payload }) => {
      state.photo = payload;
    },
    setPrevPhoto: (state: PhotoState, { payload }) => {
      state.photo = payload;
    },
    setNextPhoto: (state: PhotoState, { payload }) => {
      state.photo = payload;
    },
    setLoading: (state: PhotoState, { payload }) => {
      state.loading = payload;
    },
    setErrors: (state: PhotoState, { payload }) => {
      state.errors = payload;
    },
    setDescription: (state: PhotoState, { payload }) => {
      state.description = payload;
    },
    setAdditionalMsg: (state: PhotoState, { payload }) => {
      state.additionalMsg = payload;
    },
    setSelectedDate: (state: PhotoState, { payload }) => {
      state.selectedDate = payload;
    },
    savePOTDToLocalStorage: (state: PhotoState, { payload }) => {
      const POTDInStorage: string | null = localStorage.getItem("POTD");
      let data: Array<PhotoObj> = [];

      if (POTDInStorage) {
        const photosInStorage: Array<PhotoObj> = JSON.parse(POTDInStorage);
        photosInStorage.map((photo: PhotoObj) => {
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
    getFavorites: (state: PhotoState) => {
      const POTDInStorage: any = localStorage.getItem("POTD");
      state.favorites = JSON.parse(POTDInStorage);
    },
    setPhotosFromDb: (state: PhotoState, { payload }) => {
      state.photosInDb = payload;
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
  setPhotosFromDb,
} = photoSlice.actions;

export default photoSlice.reducer;

export const photoSelector = (state: { photo: PhotoState }) => state.photo;

// GET TODAY's PHOTO
export const getTodaysPhoto = () => {
  return async (
    dispatch: (arg0: { payload: Array<PhotoObj>; type: string }) => void
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
export const getOtherDaysPhoto = (dateToFind: string) => {
  return async (
    dispatch: (arg0: { payload: Array<PhotoObj>; type: string }) => void
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setErrors(""));

      const res = await getPictureData(dateToFind);

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
export const getPreviews = (dayBefore: any, dayAfter: any) => {
  return async (
    dispatch: (arg0: { payload: Array<PhotoObj>; type: string }) => void
  ) => {
    //   try {
    //     const previewDayBefore = await getPictureData(dayBefore);
    //     const previewDayAfter = await getPictureData(dayAfter);

    console.log(dayBefore, dayAfter);
  };
};

// SAVE Favorites to LocalStorage
export const saveToStorage = (photo: PhotoObj) => {
  return async (
    dispatch: (arg0: { payload: Array<PhotoObj>; type: string }) => void
  ) => {
    try {
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
      let photosFromStorage: Array<PhotoObj> = JSON.parse(POTDInStorage);
      photosFromStorage = photosFromStorage.filter(
        (photo: PhotoObj) => photo.date !== dateOfPhotoToDelete
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
    dispatch: (arg0: { payload: PhotoObj; type: string }) => void
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

// Save Photos to DB

export const saveToDb = (photo: PhotoObj) => {
  return async (
    dispatch: (arg0: { payload: PhotoObj; type: string }) => void
  ) => {
    dispatch(setLoading(true));
    dispatch(setErrors(""));
    try {
      await sendToFireStore(photo);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setErrors(error));
    }
  };
};

// Get photos from DB
export const getPhotosFromDb = () => {
  return async (
    dispatch: (arg0: { payload: PhotoObj; type: string }) => void
  ) => {
    dispatch(setLoading(true));
    try {
      let arr: Array<object> = [];
      const photosInDatabase = await getFromFireStore();
      dispatch(setLoading(false));
      photosInDatabase.forEach((doc) => {
        arr.push(doc.data());
      });

      dispatch(setPhotosFromDb(arr));
    } catch (error) {
      console.log("error");
      dispatch(setLoading(false));
    }
  };
};
