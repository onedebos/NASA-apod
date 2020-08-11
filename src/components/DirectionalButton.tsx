import React from "react";

interface ButtonsProp {
  direction: string;
  handleDirection: () => void;
  hiddenOnMobile: boolean;
}

const DirectionalButton: React.FC<ButtonsProp> = ({
  direction,
  handleDirection,
  hiddenOnMobile,
}) => {
  return (
    <button
      className={`col-span-1 text-center justify-center flex items-center m-auto p-3 w-1/4 transition duration-200 ease-in-out bg-blue-400 hover:bg-blue-800 text-white font-semibold transform rounded-md focus:outline-none md:w-1/2 lg:w-1/2 ${
        hiddenOnMobile ? "hidden md:block" : "block w-full mt-1 md:hidden"
      }`}
      onClick={handleDirection}
    >
      {direction}
    </button>
  );
};

export default DirectionalButton;
