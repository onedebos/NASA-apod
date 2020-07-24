import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Photo from "./Photo";
import Footer from "./Footer";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Photo} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
};

export default App;

// You can use type in place of interface
// type AppProps2 = {
//   message: string;
//   names: string[];
//   status: "waiting" | "success";
//   obj: object;
//   obj3: { id: number; title: string }[];
//   /** any function as long as you don't invoke it (not recommended) */
//   onSomething: Function;
//   /** function that doesn't take or return anything (VERY COMMON) */
//   onClick: () => void;
//   /** function with named prop (VERY COMMON) */
//   onChange: (id: number) => void;
// };
