import React from "react";
import logo from "./logo.png";

const Loading = () => {
  return (
    <div className="min-h-screen flex m-auto justify-center items-center bg-gray-100">
      <div className="flex flex-col">
        <img
          src={logo}
          alt="nasa logo"
          style={{ height: "300px", width: "350px" }}
        />
        <div className="font-bold text-center text-xl my-4 text-blue-700">
          Connecting to NASA ...
        </div>
      </div>
    </div>
  );
};

export default Loading;
