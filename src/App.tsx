import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { setLoading, usersSelector } from "./features/user/UsersSlice";
import AnotherComponent from "./AnotherComponent";

//can use React.SFC if component is stateless
const App: React.FC<AppProps> = ({ message }) => {
  const [name, setName] = useState<string>("");
  const { loading } = useSelector(usersSelector);
  const dispatch = useDispatch();

  // async function to use in useEffect
  const fireSetName = async (anyName: string) => {
    setName(anyName);
  };

  // set Loading to false in redux store
  const setLoadingToTrue = () => {
    dispatch(setLoading(true));
  };

  // useEffect with TS + async fns
  useEffect(() => {
    fireSetName("Adebola's name from useState.");
  }, []);

  return (
    <div className="flex justify-center items-center m-auto bg-red-300 min-h-screen">
      <div>
        <header className="font-medium text-2xl">{message}</header>
        <p>{name}</p>
        <div>
          <p className="font-bold">{loading.toString()}</p>
        </div>
        <button onClick={setLoadingToTrue} className="bg-white rounded-sm p-3">
          Change value in redux store
        </button>
      </div>
      <BrowserRouter>
        <Switch>
          <Route path="/next" component={AnotherComponent} />
        </Switch>
      </BrowserRouter>
      ;
    </div>
  );
};

export default App;

// defining prop types for components
export interface AppProps {
  message: string;
}

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
