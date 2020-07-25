import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  photoSelector,
  getTodaysPhoto,
  getOtherDaysPhoto,
  setSelectedDate,
  saveToStorage,
  getFavorites,
  // getPhotosFromDb,
} from "./features/photo/PhotoSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Snackbar } from "@material-ui/core";
import Favorites from "./Favorites";
import Loading from "./Loading";

const Photo: React.FC = () => {
  const {
    photo,
    loading,
    errors,
    selectedDate,
    favorites,
    // prevDayPhoto,
    // nextDayPhoto,
  } = useSelector(photoSelector);
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const dispatch = useDispatch();
  const dateRef = useRef<any>(moment(selectedDate));

  const handleClose = () => {
    let dateSelected = moment(new Date(selectedDate));
    if (selectedDate === dateRef.current) {
      return;
    }
    const formattedDate = dateSelected.format("YYYY-MM-DD");
    dispatch(getOtherDaysPhoto(formattedDate, "NONE", "NONE"));
    dateRef.current = selectedDate;
  };

  const disableDates = (date: any, days: number) => {
    const today = new Date(Number(date));
    today.setDate(date.getDate() + days);
    return today;
  };

  const handlePrevDate = () => {
    let currDate: any = dateRef.current;
    currDate = moment(currDate);
    let prevDate = currDate.subtract(2, "days");
    let nextDate = currDate.add(2, "days");
    currDate = currDate.subtract(1, "days");

    // TODO extract to fn

    currDate = currDate.format("YYYY-MM-DD");
    prevDate = prevDate.format("YYYY-MM-DD");
    nextDate = nextDate.format("YYYY-MM-DD");

    if (moment(nextDate).isAfter(moment())) {
      nextDate = "NONE";
    }
    dispatch(getOtherDaysPhoto(currDate, prevDate, nextDate));

    dateRef.current = currDate;
  };

  const handleNextDate = () => {
    let currDate: any = dateRef.current;
    let momentFormatted = moment(dateRef.current);

    currDate = momentFormatted.add(1, "days").format("YYYY-MM-DD");
    if (moment(currDate).isAfter(moment())) {
      setMessage("No new pictures to show!");
      setOpenSnackBar(true);
      setTimeout(() => setOpenSnackBar(false), 2000);
      return;
    }
    dateRef.current = currDate;
    dispatch(getOtherDaysPhoto(currDate, "NONE", "NONE"));
  };

  const handleSaveFavoritesToStorage = () => {
    // TODO if favorites increase show saved to favorites
    // else show already saved

    setMessage("Saved to Favorites! Scroll down to see.");
    setOpenSnackBar(true);
    setTimeout(() => setOpenSnackBar(false), 2000);
    dispatch(saveToStorage(photo));
  };

  useEffect(() => {
    dispatch(getTodaysPhoto());
    dispatch(getFavorites());
    // dispatch(getPhotosFromDb()); Shows all favorites in DB
    return () => {};
  }, [dispatch]);

  if (loading || errors) {
    return <Loading />;
  }

  return (
    <div>
      <div className="px-8 md:p-0 md:grid grid-cols-4" id="see-more">
        <button
          className="col-span-1 text-center justify-center flex items-center m-auto p-3 w-1/4 transition duration-200 ease-in-out bg-blue-400 hover:bg-blue-800 text-white font-semibold transform rounded-md focus:outline-none md:w-1/2 lg:w-1/2 hidden md:block"
          onClick={handlePrevDate}
        >
          Previous Day
        </button>
        <div className="flex flex-col justify-center m-auto min-w-full min-h-screen col-span-2">
          <div style={{ maxHeight: "50vh" }}>
            <img
              src={photo.url}
              alt={photo.explanation}
              style={{
                maxHeight: "50vh",
                minHeight: "50vh",
                margin: "1.5em auto",
              }}
            />
          </div>

          <div className="flex md:justify-between flex-col md:flex-row mt-1">
            <button
              className="col-span-1 text-center justify-center flex items-center m-auto p-3 w-1/4 transition duration-200 ease-in-out bg-blue-400 hover:bg-blue-800 text-white font-semibold transform rounded-sm focus:outline-none w-full md:hidden mt-6"
              onClick={handlePrevDate}
            >
              Previous Day
            </button>
            <button
              className="col-span-1 text-center justify-center flex items-center m-auto p-3 w-1/4 transition duration-200 ease-in-out bg-blue-400 hover:bg-blue-800 text-white font-semibold transform rounded-sm focus:outline-none w-full md:hidden mt-1"
              onClick={handleNextDate}
            >
              Next Day
            </button>
            <button
              className="bg-gray-300 p-3 rounded-sm font-semibold hover:bg-green-200 transition ease-in-out w-full md:w-1/3 save-to-storage focus:outline-none mt-1 md:mt-0"
              onClick={handleSaveFavoritesToStorage}
              type="button"
              disabled={errors ? true : false}
            >
              Favorite
              <span>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c8/Love_Heart_symbol.svg"
                  alt="favorite"
                  className="ml-3"
                  style={{
                    height: "20px",
                    width: "20px",
                    display: "inline-block",
                  }}
                />
              </span>
            </button>
            <DatePicker
              dateFormat="yyyy/MM/dd"
              maxDate={disableDates(new Date(), 0)}
              selected={new Date(selectedDate)}
              onChange={(date: any) =>
                dispatch(setSelectedDate(date.toISOString()))
              }
              onCalendarClose={handleClose}
              className="text-right p-3 mt-2 md:mt-0 rounded-sm font-semibold border border-orange-800"
            />
          </div>
          <div className="mt-3 py-5">
            <div>
              <h1 className="font-bold text-3xl">{photo.title}</h1>
              <div className="flex justify-start bg-gray-200 p-2 mb-2 text-lg md flex-col w-full lg:w-1/2">
                <div>
                  <h3 className="font-bold rounded-sm">
                    Photo by:{" "}
                    <span className="font-semibold ">{photo.copyright}</span>
                  </h3>
                </div>
                <div>
                  <h3 className="font-bold rounded-sm">
                    Picture for:{" "}
                    <span className="font-semibold ">{photo.date}</span>
                  </h3>
                </div>
              </div>
              <p>{photo.explanation}</p>
            </div>
          </div>
        </div>
        <button
          className="col-span-1 text-center justify-center flex items-center m-auto p-3 w-1/4 transition duration-200 ease-in-out bg-blue-500 hover:bg-blue-800 text-white font-semibold transform rounded-md focus:outline-none md:w-1/2 lg:w-1/2 hidden md:block"
          onClick={handleNextDate}
        >
          Next Day
        </button>
      </div>
      <Snackbar open={openSnackBar} autoHideDuration={1000} message={message} />
      <Favorites favoritePhotos={favorites} />
    </div>
  );
};

export default Photo;
