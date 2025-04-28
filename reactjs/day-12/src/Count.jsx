import { useState } from "react";

export function Counter() {

  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 mb-5 pb-4">
      <h1 className="text-3xl font-bold mb-6">Counter App</h1>
      
     
      <button
        onClick={toggleVisibility}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        {isVisible ? "Hide Counter" : "Show Counter"}
      </button>

      
      {isVisible ? (
        <div className="flex items-center space-x-4 bg-white p-6 rounded-lg shadow-md">
          <button
            onClick={decrement}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            -
          </button>
          <span className="text-2xl font-semibold">{count}</span>
          <button
            onClick={increment}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            +
          </button>
        </div>
      ) : ''}
    </div>
  );
}