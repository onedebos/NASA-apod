import React, { useState } from "react";
import ScrollIntoView from "react-scroll-into-view";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import { Snackbar } from "@material-ui/core";
import { useDispatch } from "react-redux";
import {
  deleteAllFromStorage,
  deleteOneFromStorage,
  seeMoreAboutFavPhoto,
} from "../features/photo/PhotoSlice";
import NoFavPhotos from "../components/NoFavPhotos";

interface IFavoriteProps {
  date: string;
  copyright: string;
  hd_url: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
  explanation: string;
}

interface IFavProps {
  favoritePhotos: Array<PhotoType>;
}

interface PhotoType {
  photo: IFavoriteProps;
  url: string;
  title: string;
  date: string;
  explanation: string;
}

const Favorites: React.FC<IFavProps> = ({ favoritePhotos }) => {
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const dispatch = useDispatch();

  const handleDeleteAllFavorites = () => {
    dispatch(deleteAllFromStorage());
    setOpenSnackBar(true);
    setMessage("Deleted all your favorites!");
    setTimeout(() => setOpenSnackBar(false), 2000);
  };

  const handleDeletePictureFromStorage = (date: string) => {
    dispatch(deleteOneFromStorage(date));
    setOpenSnackBar(true);
    setMessage("Deleted that photo!");
    setTimeout(() => setOpenSnackBar(false), 2000);
  };

  if (!favoritePhotos) {
    return <NoFavPhotos />;
  }
  return (
    <section className="md:max-w-lg lg:max-w-4xl m-auto px-6 pb-6">
      <h1 className="font-bold text-5xl">Favorites!</h1>

      <button
        className="bg-red-500 p-2 rounded-sm text-white font-bold mb-4 hover:bg-red-700 focus:outline-none clear-all"
        type="button"
        onClick={handleDeleteAllFavorites}
      >
        Delete all <DeleteRoundedIcon style={{ color: "white" }} />
      </button>

      <div className="md:grid grid-cols-2 lg:grid-cols-3 gap-6 mt-3 lg:max-w-3xl">
        {favoritePhotos.map((photo: PhotoType, index: number) => {
          return (
            <div className="col-span-1 mt-5 md:mt-0" key={index}>
              <img
                src={photo.url}
                alt={photo.explanation}
                onError={(e: any) => {
                  e.target.alt = "This is a video. Click See more to watch.";
                }}
                style={{
                  height: "300px",
                  width: "300px",
                  borderRadius: "10px",
                }}
              />

              <div className="flex justify-start mt-2 pr-3 md:pr-0">
                <div className="bg-gray-500 p-2 text-white rounded-md hover:bg-gray-700 w-full text-center">
                  <ScrollIntoView selector="#see-more">
                    <button
                      className="focus:outline-none font-bold"
                      onClick={() => {
                        dispatch(seeMoreAboutFavPhoto(photo));
                      }}
                    >
                      See more
                    </button>
                  </ScrollIntoView>
                </div>
                <button
                  className="bg-red-500 p-2 text-white rounded-md font-bold ml-4 hover:bg-red-700 w-full focus:outline-none"
                  onClick={() => handleDeletePictureFromStorage(photo.date)}
                >
                  Delete
                  <DeleteRoundedIcon style={{ color: "white" }} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <Snackbar open={openSnackBar} autoHideDuration={1000} message={message} />
    </section>
  );
};

export default Favorites;
