import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { photoSelector } from "./features/photo/PhotoSlice";
import Photo from "./Photo";
import Footer from "./Footer";

const App: React.FC = () => {
  const { loading } = useSelector(photoSelector);
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Photo} />
      </Switch>
      {loading ? null : <Footer />}
    </BrowserRouter>
  );
};

export default App;
