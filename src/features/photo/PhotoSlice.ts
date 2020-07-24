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
};

const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    setPhoto: (state: initState, { payload }) => {
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
        console.log(data);
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
      dispatch(setPhoto(res.data[0]));

      dispatch(setLoading(false));

      // if a picture has not been released for the day
      if (res.data.length < 1) {
        throw new Error("No picture of the day available.");
      }
    } catch (error) {
      console.log(error);
      dispatch(setErrors("No picture of the day available."));
      dispatch(setLoading(false));
    }
  };
};

// GET Photo from other days
export const getOtherDaysPhoto = (dateToFind: string) => {
  return async (dispatch: (arg0: { payload: any; type: string }) => void) => {
    dispatch(setLoading(true));
    dispatch(setErrors(""));
    try {
      const res = await axios.get(buildFullUrl(dateToFind));
      if (res.data.length < 1) {
        throw new Error("No picture of the day available.");
      }
      dispatch(setPhoto(res.data[0]));

      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
      dispatch(setErrors("No picture of the day available."));
      dispatch(setLoading(false));
    }
  };
};

// SAVE Favorites to LocalStorage
export const saveToStorage = (photo: object) => {
  return async (dispatch: (arg0: { payload: any; type: string }) => void) => {
    console.log("saved");
    dispatch(savePOTDToLocalStorage(photo));
  };
};
