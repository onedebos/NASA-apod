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

import moment from "moment";
import { Snackbar } from "@material-ui/core";
import Favorites from "./Favorites";
import Loading from "./Loading";
import PhotoStory from "../components/PhotoStory";
import DirectionalButton from "../components/DirectionalButton";
import { v4 as uuidv4 } from "uuid";

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

  const handleChange = (date: any) => {
    dispatch(setSelectedDate(date.toISOString()));
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

  const handleSaveToDb = () => {
    const id = uuidv4();
    const photoWithId: any = { photo, id };
    dispatch(saveToDb(photoWithId));
  };
  useEffect(() => {
    dispatch(getTodaysPhoto());
    dispatch(getFavorites());
    return () => {};
  }, [dispatch]);

  if (loading || errors) {
    return <Loading message="Hold tight! Connecting to NASA....." />;
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
          <PhotoStory
            isImg={isImg}
            handleImgNotLoading={handleImgNotLoading}
            photo={photo}
            handleSaveToDb={handleSaveToDb}
            handlePrevDate={handlePrevDate}
            handleNextDate={handleNextDate}
            handleClose={handleClose}
            handleSaveFavoritesToStorage={handleSaveFavoritesToStorage}
            errors={errors}
            disableDates={disableDates(new Date(), 0)}
            selectedDate={selectedDate}
            handleChange={(date: any) => handleChange(date)}
          />
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
