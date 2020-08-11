import React from "react";
import { PhotoObj } from "../common/types";
import ScrollIntoView from "react-scroll-into-view";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";

interface FavoriteProps {
  photo: PhotoObj;
  handleDeletePicture: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => void | ((date: string) => void);
  seeMoreAboutPhoto: () => void;
}

const Favorite: React.FC<FavoriteProps> = ({
  photo,
  handleDeletePicture,
  seeMoreAboutPhoto,
}) => {
  return (
    <React.Fragment>
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
              onClick={seeMoreAboutPhoto}
            >
              See more
            </button>
          </ScrollIntoView>
        </div>
        <button
          className="bg-red-500 p-2 text-white rounded-md font-bold ml-4 hover:bg-red-700 w-full focus:outline-none"
          onClick={handleDeletePicture}
        >
          Delete
          <DeleteRoundedIcon style={{ color: "white" }} />
        </button>
      </div>
    </React.Fragment>
  );
};

export default Favorite;
