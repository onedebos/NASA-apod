import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPhotosFromDb,
  photoSelector,
  seeMoreAboutFavPhoto,
} from "../features/photo/PhotoSlice";
import { PhotoObj } from "../common/types";
import Favorite from "./Favorite";
import { v4 as uuidv4 } from "uuid";
import Loading from "./Loading";
import { Link } from "react-router-dom";

const AllFavorites = () => {
  const dispatch = useDispatch();
  const { photosInDb, loading } = useSelector(photoSelector);

  useEffect(() => {
    dispatch(getPhotosFromDb());
  }, [dispatch]);

  const handleDeletePicture = (url: string) => {
    console.log("will delete picture from db.");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section>
      <h1 className="text-center font-bold text-2xl mt-4">
        Everyone's Favorite Pictures!
      </h1>

      <div className="flex flex-wrap justify-center py-6">
        <div className="min-h-screen md:grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {photosInDb.map((photo: PhotoObj) => {
            return (
              <div className="col-span-1 mt-5 md:mt-0" key={uuidv4()}>
                <Favorite
                  photo={photo}
                  handleDeletePicture={() => handleDeletePicture(photo.url)}
                  seeMoreAboutPhoto={() =>
                    dispatch(seeMoreAboutFavPhoto(photo))
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
      <Link to="/" className="text-center text-blue-600 font-bold text-xl">
        Back to Home
      </Link>
    </section>
  );
};

export default AllFavorites;
