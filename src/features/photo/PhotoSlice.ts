import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const apiKey: string = "DE8fsud7knGnE2BZLsKkookQDDZlaIz9YXY6wwpO";
const baseURL: string = "https://api.nasa.gov/planetary/apod";

const buildFullUrl = (startDate: string) => {
  return `${baseURL}?api_key=${apiKey}&start_date=${startDate}&end_date=${startDate}`;
};

type initState = {
  loading: boolean;
  photo: object;
  errors: string;
  description: string;
  additionalMsg: string;
};

export const initialState: initState = {
  loading: false,
  photo: {},
  errors: "",
  description: "",
  additionalMsg: "",
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
  },
});
export const {
  setPhoto,
  setLoading,
  setErrors,
  setDescription,
  setAdditionalMsg,
} = photoSlice.actions;

export default photoSlice.reducer;

export const photoSelector = (state: { photo: any }) => state.photo;

// GET TODAY's PHOTO
export const getPhoto = (date: undefined | string = undefined) => {
  return async (dispatch: (arg0: { payload: any; type: string }) => void) => {
    dispatch(setLoading(true));
    try {
      let dateToFind: string | undefined = date;
      if (!dateToFind) {
        let todaysDate: any = new Date().toLocaleDateString().split("/");
        const yesterdaysDay: string = (new Date().getDate() - 1).toString();
        let dateString = `${todaysDate[2]}-${todaysDate[1]}-${todaysDate[0]}`;
        const res = await axios.get(buildFullUrl(dateString));

        // if a picture has not been released for the day
        if (res.data.length < 1) {
          todaysDate[0] = yesterdaysDay;
          dateString = `${todaysDate[2]}-${todaysDate[1]}-${todaysDate[0]}`;
          const res = await axios.get(buildFullUrl(dateString));
          dispatch(setLoading(false));
          console.log(res.data);
          dispatch(setPhoto(res.data[0]));
          dispatch(
            setAdditionalMsg(
              "Showing Picture from yesterday as today's picture is not available at the moment"
            )
          );
        }
      } else {
        const res = await axios.get(buildFullUrl(dateToFind));
        dispatch(setLoading(false));
        console.log(res.data);
      }
    } catch (error) {
      console.log(error.response);
      // dispatch(setErrors(error));
      dispatch(setLoading(false));
    }
  };
};
