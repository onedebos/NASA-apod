import React from "react";
import { useSelector } from "react-redux";
import { photoSelector } from "../features/photo/PhotoSlice";
import Photo from "./Photo";
import Footer from "../components/Footer";
import AllFavorites from "../container/AllFavorites";
import { BrowserRouter, Route, Switch } from "react-router-dom";

const App: React.FC = () => {
  const { loading } = useSelector(photoSelector);
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Photo} />
        <Route path="/favorites" exact component={AllFavorites} />
      </Switch>

      {loading ? null : <Footer />}
    </BrowserRouter>
  );
};

export default App;
