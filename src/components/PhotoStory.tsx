import React from "react";
import { PhotoObj } from "../common/types";
import { Link } from "react-router-dom";
import DirectionalButton from "./DirectionalButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface PhotoStoryProps {
  photo: PhotoObj;
  handleSaveToDb: () => void;
  handlePrevDate: () => void;
  handleNextDate: () => void;
  handleSaveFavoritesToStorage: () => void;
  handleChange: (date: any) => void;
  errors: string;
  disableDates: Date | null | undefined;
  handleClose: () => void;
  selectedDate: string;
  isImg: boolean;
  handleImgNotLoading: () => void;
}

const PhotoStory: React.FC<PhotoStoryProps> = ({
  photo,
  handleSaveToDb,
  handlePrevDate,
  handleNextDate,
  handleSaveFavoritesToStorage,
  handleClose,
  errors,
  disableDates,
  selectedDate,
  handleChange,
  isImg,
  handleImgNotLoading,
}) => {
  return (
    <section className="mt-3 py-2">
      <div style={{ maxHeight: "50vh" }} className="mb-1">
        {isImg ? (
          <img
            src={photo.url}
            alt={photo.explanation}
            onError={handleImgNotLoading}
            style={{
              maxHeight: "50vh",
              minHeight: "50vh",
              margin: "0em auto",
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
          maxDate={disableDates}
          selected={new Date(selectedDate)}
          onChange={handleChange}
          onCalendarClose={handleClose}
          className="text-right p-3 mt-2 md:mt-0 rounded-sm font-semibold border border-orange-800 w-full"
        />
      </div>
      <h1 className="font-bold text-3xl mt-6">{photo.title}</h1>
      <div className="flex justify-start bg-gray-200 p-2 mb-2 text-lg md flex-col w-full lg:w-1/2">
        <div>
          <h3 className="font-bold rounded-sm">
            Photo by: <span className="font-semibold ">{photo.copyright}</span>
          </h3>
        </div>
        <div>
          <h3 className="font-bold rounded-sm">
            Picture for: <span className="font-semibold ">{photo.date}</span>
          </h3>
        </div>
      </div>
      <p>{photo.explanation}</p>
      <div className="md:flex justify-center">
        <button
          className="shadow-md rounded-sm w-1/4 bg-gray-300 p-3 rounded-sm font-semibold hover:bg-green-200 transition ease-in-out w-full md:w-1/3 focus:outline-none mt-1 md:mt-4 mb-4"
          onClick={handleSaveToDb}
        >
          Super Like!
        </button>
        <Link
          to="/favorites"
          className="shadow-md rounded-sm w-1/4 bg-gray-600 p-3 rounded-sm font-semibold transition ease-in-out w-full md:w-1/3 focus:outline-none mt-1 md:mt-4 mb-4 md:ml-2 text-white"
        >
          See Favs!
        </Link>
      </div>
      <hr />
    </section>
  );
};

export default PhotoStory;
