import React from "react";
import logo from "../assets/images/logo.png";
import { useSelector } from "react-redux";
import { photoSelector } from "../features/photo/PhotoSlice";

interface LoadingMessage {
  message: string;
}

const Loading: React.FC<LoadingMessage> = ({ message }) => {
  const { errors } = useSelector(photoSelector);
  return (
    <div className="min-h-screen flex m-auto justify-center items-center bg-gray-100">
      <div className="flex flex-col justify-center">
        <img
          src={logo}
          alt="nasa logo"
          style={{ height: "300px", width: "350px" }}
        />
        <div className="font-bold text-center text-xl my-4 text-blue-700">
          {errors ? <h1 className="text-red-600"> {errors}</h1> : message}
        </div>
      </div>
    </div>
  );
};

export default Loading;
