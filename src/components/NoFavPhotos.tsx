import React from "react";

const NoFavPhotos: React.FC = () => {
  return (
    <section className="md:max-w-lg lg:max-w-4xl m-auto px-6 pb-6">
      <h1 className="font-bold text-2xl md:text-5xl">Your Favorites!</h1>
      <h3 className="font-semibold text-gray-800 text-xl md:text-2xl p-4 bg-gray-100 leading-none mb-2">
        You currently have no saved images.
        <p className="font-bold md:text-xl text-gray-600 leading-none">
          Start adding some to see them here.
        </p>
      </h3>
    </section>
  );
};

export default NoFavPhotos;
