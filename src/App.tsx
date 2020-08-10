import React from "react";
import { useSelector } from "react-redux";
import { photoSelector } from "./features/photo/PhotoSlice";
import Photo from "./container/Photo";
import Footer from "./components/Footer";

const App: React.FC = () => {
  const { loading } = useSelector(photoSelector);
  return (
    <div>
      <Photo />
      {loading ? null : <Footer />}
    </div>
  );
};

export default App;
