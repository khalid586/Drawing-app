import React from "react";
import Canvas from "./Components/Canvas";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 font-custom">
      <header className="text-red-500 text-2xl font-bold p-4">Real time Drawing App</header>
      <Canvas></Canvas>
    </div>
  );
};

export default App;
