import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPhotosFromDb,
  photoSelector,
  seeMoreAboutFavPhoto,
  deleteFromDb,
} from "../features/photo/PhotoSlice";
import Favorite from "../components/Favorite";
import Loading from "./Loading";
import { Link } from "react-router-dom";

const AllFavorites = () => {
  const dispatch = useDispatch();
  const { photosInDb, loading } = useSelector(photoSelector);

  useEffect(() => {
    dispatch(getPhotosFromDb());
  }, [dispatch]);

  const handleDeletePicture = (id: string) => {
    dispatch(deleteFromDb(id));
  };

  if (loading) {
    return <Loading message="Hold on a sec!..." />;
  }

  return (
    <section>
      <h1 className="text-center font-bold text-2xl mt-4">
        Everyone's Favorite Pictures!
      </h1>

      <div className="flex justify-center py-3">
        <div className="min-h-screen md:grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {photosInDb.map((potd: any) => {
            const { photo, id } = potd;
            return (
              <div className="col-span-1 mt-3 md:mt-0" key={id}>
                <Favorite
                  photo={photo}
                  handleDeletePicture={() => handleDeletePicture(id)}
                  seeMoreAboutPhoto={() =>
                    dispatch(seeMoreAboutFavPhoto(photo))
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="text-center py-3">
        <Link to="/" className="text-center text-blue-600 font-bold text-xl">
          Back to Home
        </Link>
      </div>
    </section>
  );
};

export default AllFavorites;
