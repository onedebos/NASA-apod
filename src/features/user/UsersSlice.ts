import { createSlice } from "@reduxjs/toolkit";

type initState = {
  loading: boolean;
  user: object;
  errors: string;
  loggedIn: boolean;
  signUpMessage: string;
};

export const initialState: initState = {
  loading: false,
  user: {},
  errors: "",
  loggedIn: false,
  signUpMessage: "",
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
    setErrors: (state, { payload }) => {
      state.errors = payload;
    },
    setLoggedIn: (state, { payload }) => {
      state.loggedIn = payload;
    },
    setSignUpMessage: (state, { payload }) => {
      state.signUpMessage = payload;
    },
    logOutUser: (state) => {
      state.user = {};
      state.errors = "";
      state.loggedIn = false;
      localStorage.clear();
    },
  },
});
export const {
  setUser,
  setSignUpMessage,
  setLoggedIn,
  setLoading,
  setErrors,
  logOutUser,
} = usersSlice.actions;

export default usersSlice.reducer;

export const usersSelector = (state: { users: any }) => state.users;

// SIGN IN ALL USERS
// export const signIn = () => {
//   return async (dispatch: (arg0: { payload: any; type: string }) => void) => {
//     try {
//       const res = await functionToLogoutUser();
//       dispatch(setUser(res.data));
//     } catch (error) {
//       dispatch(setErrors(error));
//     }
//   };
// };
