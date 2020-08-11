import React, { useState } from "react";
import { Snackbar } from "@material-ui/core";
import { useDispatch } from "react-redux";
import {
  deleteAllFromStorage,
  deleteOneFromStorage,
  seeMoreAboutFavPhoto,
} from "../features/photo/PhotoSlice";
import NoFavPhotos from "../components/NoFavPhotos";
import { v4 as uuidv4 } from "uuid";
import Favorite from "../components/Favorite";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import { PhotoObj } from "../common/types";

interface FavProps {
  favoritePhotos: Array<PhotoObj>;
}

const Favorites: React.FC<FavProps> = ({ favoritePhotos }) => {
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
        {favoritePhotos.map((photo: PhotoObj) => {
          return (
            <div className="col-span-1 mt-5 md:mt-0" key={uuidv4()}>
              <Favorite
                photo={photo}
                handleDeletePicture={() =>
                  handleDeletePictureFromStorage(photo.date)
                }
                seeMoreAboutPhoto={() => dispatch(seeMoreAboutFavPhoto(photo))}
              />
            </div>
          );
        })}
      </div>
      <Snackbar open={openSnackBar} autoHideDuration={1000} message={message} />
    </section>
  );
};

export default Favorites;
