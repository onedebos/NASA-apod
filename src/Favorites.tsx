import React from "react";

interface FavoritesProps {
  // date: string;
  // copyright: string;
  // explanation: string;
  // hd_url: string;
  // media_type: string;
  // service_version: string;
  // title: string;
  // url: string;
  favoritePhotos: any;
}

const Favorites: React.FC<FavoritesProps> = ({ favoritePhotos }) => {
  return (
    <div className="md:max-w-lg lg:max-w-full m-auto px-6">
      <h1 className="font-bold text-3xl">Favorites!</h1>
      <h3 className="font-semibold text-gray-600">All your saved images.</h3>
    </div>
  );
};

export default Favorites;
