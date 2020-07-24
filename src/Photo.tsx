import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  photoSelector,
  getTodaysPhoto,
  getOtherDaysPhoto,
  setErrors,
  setSelectedDate,
} from "./features/photo/PhotoSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const Photo: React.FC = () => {
  const { photo, loading, errors, selectedDate } = useSelector(photoSelector);
  const dispatch = useDispatch();
  const ref = useRef<number>(0);
  const dateRef = useRef<any>(moment(selectedDate));

  // const updateCnt = (
  //   shouldAdd: boolean,
  //   shouldSubtract: boolean,
  //   newCnt: number
  // ) => {
  //   if (shouldAdd) {
  //     ref.current = ref.current + newCnt;
  //   }
  //   if (shouldSubtract) {
  //     ref.current = ref.current - newCnt;
  //     if (ref.current < 0) {
  //       ref.current = 0;
  //     }
  //   }

  //   if (!shouldAdd && !shouldSubtract) {
  //     ref.current = newCnt;
  //   }
  // };

  const handleClose = () => {
    const dateSelected = new Date(selectedDate);
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
    // if (ref.current < 0) {
    //   updateCnt(false, false, 0);
    // }
    // if (ref.current === 0) {
    //   updateCnt(true, false, 1);
    // }
    currDate = currDate.subtract(1, "days");
    currDate = currDate.format("YYYY-MM-DD");
    const dateArray = currDate.split("-");
    const buildDateStr = `${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`;
    dispatch(getOtherDaysPhoto(buildDateStr));
    // updateCnt(true, false, 1);
    dateRef.current = currDate;
    console.log("In Prev", currDate);
  };

  const handleNextDate = () => {
    let currDate: any = dateRef.current;
    let momentFormatted = moment(dateRef.current);
    // updateCnt(false, true, 1);

    currDate = momentFormatted.add(1, "days").format("YYYY-MM-DD");
    if (moment(currDate).isAfter(moment())) {
      return setErrors("No Picture of the day available");
    }
    dateRef.current = currDate;
    console.log("In Next", currDate);

    // if (ref.current < 0) {
    //   updateCnt(false, false, 0);
    //   return setErrors("No Picture of the day available");
    // }

    const dateArray = currDate.split("-");
    const buildDateStr = `${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`;
    dispatch(getOtherDaysPhoto(buildDateStr));
  };

  useEffect(() => {
    dispatch(getTodaysPhoto());
    return () => {};
  }, [dispatch]);

  return (
    <div>
      <div className="grid grid-cols-4">
        <button
          className="col-span-1 text-center justify-center flex items-center m-auto p-3 w-1/4 transition duration-200 ease-in-out bg-blue-500 hover:bg-blue-800 text-white font-semibold transform rounded-md"
          onClick={handlePrevDate}
        >
          Prev
        </button>
        <div className="flex flex-col justify-center m-auto min-w-full min-h-screen col-span-2">
          {loading ? (
            "loading......"
          ) : (
            <div>
              <h1 className="font-bold text-2xl text-center mb-2">
                {photo.title}
              </h1>
              {errors ? (
                <h1 className="bg-red-500 font-bold text-2xl">{errors}</h1>
              ) : (
                <img
                  src={photo.url}
                  alt={photo.explanation}
                  style={{ maxHeight: "100vh", minHeight: "50vh" }}
                />
              )}
            </div>
          )}
          <div className="flex justify-between mt-1">
            <button className="bg-gray-300 p-3 rounded-sm font-semibold hover:bg-green-200 transition ease-in-out">
              Set Favorite
            </button>
            <DatePicker
              dateFormat="yyyy/MM/dd"
              maxDate={disableDates(new Date(), 0)}
              selected={new Date(selectedDate)}
              onChange={(date: any) =>
                dispatch(setSelectedDate(date.toISOString()))
              }
              onCalendarClose={handleClose}
              className="text-right p-3 rounded-sm font-semibold"
            />
          </div>
          <div className="mt-3 ">
            <p>{photo.explanation}</p>
          </div>
        </div>
        <button
          className="col-span-1 text-center justify-center flex items-center m-auto p-3 w-1/4 transition duration-200 ease-in-out bg-blue-500 hover:bg-blue-800 text-white font-semibold transform rounded-md"
          onClick={handleNextDate}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Photo;
