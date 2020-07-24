import React from "react";
import Photo from "./Photo";

const App: React.FC = () => {
  return (
    <div className="flex justify-center items-center m-auto bg-red-300 min-h-screen">
      <Photo />
    </div>
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
