import { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Update this to your server URL when deployed

const Canvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.6;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    setContext(ctx);

    // Listen for drawing events
    socket.on("drawing", ({ prevX, prevY, x, y, color, brushSize }) => {
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = color;

      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    // Listen for clear canvas events
    socket.on("clearCanvas", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Listen for color change events
    socket.on("changeColor", ({ color }) => {
      ctx.strokeStyle = color;
    });
  }, []);

  const startDrawing = (e) => {
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    context.lineTo(x, y);
    context.stroke();

    // Emit drawing or eraser data to the server
    socket.emit("drawing", {
      prevX: e.nativeEvent.offsetX,
      prevY: e.nativeEvent.offsetY,
      x,
      y,
      color: isEraser ? "#FFFFFF" : context.strokeStyle, // White for eraser
      brushSize: context.lineWidth,
    });
  };

  const stopDrawing = () => {
    context.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Notify all clients
    socket.emit("clearCanvas");
  };

  const changeBrushSize = (e) => {
    context.lineWidth = e.target.value;
  };

  const changeColor = (e) => {
    const newColor = e.target.value;
    context.strokeStyle = newColor;

    // Notify other clients
    socket.emit("changeColor", { color: newColor });
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
  
    if (isEraser) {
      // Revert to the previously selected brush color when disabling eraser
      context.strokeStyle = document.querySelector('input[type="color"]').value;
    } else {
      // Set to canvas background color when enabling eraser
      context.strokeStyle = "#FFFFFF";
    }
  };
  

  return (
    <div className="flex flex-col items-center border-4 border-red-500">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border border-gray-400 bg-white"
      />
      <div className="flex gap-4 mt-4">
        {/* Clear canvas */}
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Clear Canvas
        </button>

        {/* Eraser toggle */}
        <button
          onClick={toggleEraser}
          className={`px-4 py-2 ${
            isEraser ? "bg-red-500" : "bg-gray-500"
          } text-white rounded hover:bg-red-600`}
        >
          {isEraser ? "Disable Eraser" : "Enable Eraser"}
        </button>
      </div>

      {/* Brush size */}
      <div className="mt-4">
        <label className="block text-gray-700 mb-2">Brush Size</label>
        <input
          type="range"
          min="1"
          max="10"
          defaultValue="2"
          onChange={changeBrushSize}
          className="w-full"
        />
      </div>

      {/* Brush color */}
      <div className="mt-4">
        <label className="block text-gray-700 mb-2">Brush Color</label>
        <input
          type="color"
          onChange={changeColor}
          className="w-10 h-10 cursor-pointer"
          disabled={isEraser} // Disable color picker while eraser is active
        />
      </div>
    </div>
  );
};

export default Canvas;
