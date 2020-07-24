import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { photoSelector, getPhoto } from "./features/photo/PhotoSlice";

interface PhotoProps {
  date?: string;
}

const Photo: React.FC<PhotoProps> = (date) => {
  const { photo } = useSelector(photoSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPhoto("2020-02-04"));
    return () => {};
  }, []);

  return (
    <div>
      <p>Just another component</p>
    </div>
  );
};

export default Photo;
