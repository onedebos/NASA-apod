import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  photoSelector,
  getTodaysPhoto,
  getOtherDaysPhoto,
  setSelectedDate,
  saveToStorage,
  getFavorites,
  getPhotosFromDb,
} from "./features/photo/PhotoSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Snackbar } from "@material-ui/core";
import Favorites from "./Favorites";

const Photo: React.FC = () => {
  const { photo, loading, errors, selectedDate, favorites } = useSelector(
    photoSelector
  );
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const dispatch = useDispatch();
  const dateRef = useRef<any>(moment(selectedDate));

  const handleClose = () => {
    const dateSelected = new Date(selectedDate);
    if (selectedDate === dateRef.current) {
      return;
    }
    const dateArray = dateSelected.toLocaleDateString().split("/");
    const buildDateStr = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
    dispatch(getOtherDaysPhoto(buildDateStr));
    dateRef.current = selectedDate;
    console.log(buildDateStr);
  };

  const disableDates = (date: any, days: number) => {
    const today = new Date(Number(date));
    today.setDate(date.getDate() + days);
    return today;
  };

  const handlePrevDate = () => {
    let currDate: any = dateRef.current;
    currDate = moment(currDate);
    currDate = currDate.subtract(1, "days");
    currDate = currDate.format("YYYY-MM-DD");
    const dateArray = currDate.split("-");
    const buildDateStr = `${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`;
    dispatch(getOtherDaysPhoto(buildDateStr));

    dateRef.current = currDate;
    console.log("In Prev", currDate);
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
    console.log("In Next", currDate);

    const dateArray = currDate.split("-");
    const buildDateStr = `${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`;
    dispatch(getOtherDaysPhoto(buildDateStr));
  };

  const handleSaveFavoritesToStorage = () => {
    // TODO if favorites increase show saved to favorites
    // else show already saved
    setMessage("Saved to Favorites!");
    setOpenSnackBar(true);
    setTimeout(() => setOpenSnackBar(false), 2000);
    dispatch(saveToStorage(photo));
  };

  useEffect(() => {
    dispatch(getTodaysPhoto());
    dispatch(getFavorites());
    dispatch(getPhotosFromDb());
    return () => {};
  }, [dispatch]);

  return (
    <div>
      <div className="grid grid-cols-4">
        <button
          className="col-span-1 text-center justify-center flex items-center m-auto p-3 w-1/4 transition duration-200 ease-in-out bg-orange-400 hover:bg-orange-800 text-white font-semibold transform rounded-md focus:outline-none"
          onClick={handlePrevDate}
        >
          Prev
        </button>
        <div className="flex flex-col justify-center m-auto min-w-full min-h-screen col-span-2">
          {loading ? (
            <h1 className="font-bold text-2xl text-white p-3">loading......</h1>
          ) : (
            <div style={{ maxHeight: "50vh" }}>
              {errors ? (
                <h1 className="bg-red-500 font-bold text-2xl text-white p-3">
                  {errors}
                </h1>
              ) : (
                <img
                  src={photo.url}
                  alt={photo.explanation}
                  style={{
                    maxHeight: "50vh",
                    minHeight: "50vh",
                    margin: "1.5em auto",
                  }}
                />
              )}
            </div>
          )}
          <div className="flex justify-between mt-1">
            <button
              className={`bg-gray-300 p-3 rounded-sm font-semibold ${
                errors ? "" : "hover:bg-green-200"
              }  transition ease-in-out w-1/3 save-to-storage focus:outline-none`}
              onClick={handleSaveFavoritesToStorage}
              type="button"
              disabled={errors || loading ? true : false}
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
              className="text-right p-3 rounded-sm font-semibold border border-orange-800"
            />
          </div>
          <div className="mt-3 py-5">
            {!loading && !errors ? (
              <div>
                <h1 className="font-bold text-3xl">{photo.title}</h1>
                <div className="flex justify-start bg-gray-200 p-2 mb-2">
                  <div>
                    <h3 className="font-bold rounded-sm">
                      Photo by:{" "}
                      <span className="font-semibold ">{photo.copyright}</span>
                    </h3>
                  </div>
                  <div>
                    <h3 className="font-bold rounded-sm ml-4">
                      Picture for:{" "}
                      <span className="font-semibold ">{photo.date}</span>
                    </h3>
                  </div>
                </div>
                <p>{photo.explanation}</p>
              </div>
            ) : (
              <> </>
            )}
          </div>
        </div>
        <button
          className="col-span-1 text-center justify-center flex items-center m-auto p-3 w-1/4 transition duration-200 ease-in-out bg-orange-400 hover:bg-orange-800 text-white font-semibold transform rounded-md focus:outline-none"
          onClick={handleNextDate}
        >
          Next
        </button>
      </div>
      <Snackbar open={openSnackBar} autoHideDuration={1000} message={message} />
      <Favorites favoritePhotos={favorites} />
    </div>
  );
};

export default Photo;
