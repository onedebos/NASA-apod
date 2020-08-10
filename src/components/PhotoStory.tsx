import React from "react";

interface iPhoto {
  title: string;
  copyright: string;
  date: string;
  explanation: string;
}
interface iPhotoStoryProps {
  photo: iPhoto;
}

const PhotoStory: React.FC<iPhotoStoryProps> = ({ photo }) => {
  return (
    <section className="mt-3 py-2">
      <h1 className="font-bold text-3xl">{photo.title}</h1>
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
    </section>
  );
};

export default PhotoStory;
