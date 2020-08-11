import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  photoSelector,
  getTodaysPhoto,
  getOtherDaysPhoto,
  setSelectedDate,
  saveToStorage,
  getFavorites,
  getPreviews,
  saveToDb,
} from "../features/photo/PhotoSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Snackbar } from "@material-ui/core";
import Favorites from "./Favorites";
import Loading from "./Loading";
import PhotoStory from "../components/PhotoStory";
import DirectionalButton from "../components/DirectionalButton";
import { Link } from "react-router-dom";

const Photo: React.FC = () => {
  const { photo, loading, errors, selectedDate, favorites } = useSelector(
    photoSelector
  );
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const dispatch = useDispatch();
  const dateRef = useRef<any>(moment(selectedDate));
  const [isImg, setIsImg] = useState<boolean>(true);

  const isDayUnavailable = (currDate: any) => {
    if (moment(currDate).isAfter(moment())) {
      return true;
    } else {
      return false;
    }
  };

  const handleClose = () => {
    setIsImg(true);
    let dateSelected = moment(new Date(selectedDate));
    if (selectedDate === dateRef.current) {
      return;
    }
    const formattedDate = dateSelected.format("YYYY-MM-DD");
    dispatch(getOtherDaysPhoto(formattedDate));
    dateRef.current = selectedDate;
  };

  const disableDates = (date: any, days: number) => {
    const today = new Date(Number(date));
    today.setDate(date.getDate() + days);
    return today;
  };

  const handlePrevDate = () => {
    setIsImg(true);
    let currDate = moment(dateRef.current)
      .subtract(1, "days")
      .format("YYYY-MM-DD");

    // get Previous and Next dates for use in Previews
    const dayBefore = moment(dateRef.current)
      .subtract(2, "days")
      .format("YYYY-MM-DD");
    const dayAfter = moment(dayBefore).add(2, "days").format("YYYY-MM-DD");

    dispatch(
      getPreviews(dayBefore, isDayUnavailable(dayAfter) ? currDate : dayAfter)
    );

    //
    dispatch(getOtherDaysPhoto(currDate));
    dateRef.current = currDate;
  };

  const handleNextDate = () => {
    setIsImg(true);
    let currDate = moment(dateRef.current).add(1, "days").format("YYYY-MM-DD");

    if (isDayUnavailable(currDate)) {
      setMessage("No new pictures to show!");
      setOpenSnackBar(true);
      setTimeout(() => setOpenSnackBar(false), 2000);
      return;
    }
    dateRef.current = currDate;
    dispatch(getOtherDaysPhoto(currDate));
  };

  const handleSaveFavoritesToStorage = () => {
    setIsImg(true);
    setMessage("Saved to Favorites! Scroll down to see.");
    setOpenSnackBar(true);
    setTimeout(() => setOpenSnackBar(false), 2000);
    dispatch(saveToStorage(photo));
  };

  const handleImgNotLoading = () => {
    setIsImg(false);
  };
  useEffect(() => {
    dispatch(getTodaysPhoto());
    dispatch(getFavorites());
    return () => {};
  }, [dispatch]);

  if (loading || errors) {
    return <Loading />;
  }

  return (
    <div>
      <div className="px-8 md:p-0 md:grid grid-cols-4" id="see-more">
        <DirectionalButton
          direction="Previous Day"
          handleDirection={handlePrevDate}
          hiddenOnMobile={true}
        />
        <div className="flex flex-col justify-center m-auto min-w-full min-h-screen col-span-2">
          <div style={{ maxHeight: "50vh" }} className="mb-1">
            {isImg ? (
              <img
                src={photo.url}
                alt={photo.explanation}
                onError={handleImgNotLoading}
                style={{
                  maxHeight: "50vh",
                  minHeight: "50vh",
                  margin: "1.5em auto",
                }}
              />
            ) : (
              <iframe
                className="w-full"
                style={{
                  maxHeight: "50vh",
                  minHeight: "50vh",
                  maxWidth: "100vw",
                  margin: "0.5em auto",
                }}
                src={photo.url}
                title={photo.title}
              />
            )}
          </div>

          <div className="flex md:justify-between flex-col md:flex-row mt-1">
            <DirectionalButton
              direction="Previous Day"
              handleDirection={handlePrevDate}
              hiddenOnMobile={false}
            />
            <DirectionalButton
              direction="Next Day"
              handleDirection={handleNextDate}
              hiddenOnMobile={false}
            />

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
              className="text-right p-3 mt-2 md:mt-0 rounded-sm font-semibold border border-orange-800 w-full"
            />
          </div>

          <PhotoStory photo={photo} />
          <div className="md:flex">
            <button
              className="shadow-md rounded-sm w-1/4 bg-gray-300 p-3 rounded-sm font-semibold hover:bg-green-200 transition ease-in-out w-full md:w-1/3 focus:outline-none mt-1 md:mt-0 mb-4"
              onClick={() => dispatch(saveToDb(photo))}
            >
              Super Like!
            </button>
            <Link
              to="/favorites"
              className="shadow-md rounded-sm w-1/4 bg-gray-600 p-3 rounded-sm font-semibold transition ease-in-out w-full md:w-1/3 focus:outline-none mt-1 md:mt-0 mb-4 md:ml-2 text-white"
            >
              See Favs!
            </Link>
          </div>
        </div>
        <DirectionalButton
          direction="Next Day"
          handleDirection={handleNextDate}
          hiddenOnMobile={true}
        />
      </div>
      <Snackbar open={openSnackBar} autoHideDuration={1000} message={message} />
      <Favorites favoritePhotos={favorites} />
    </div>
  );
};

export default Photo;
