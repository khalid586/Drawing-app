import { useRef, useState, useEffect } from "react";

const Canvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.6;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    setContext(ctx);
  }, []);

  const startDrawing = (e) => {
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    context.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const changeBrushSize = (e) => {
    context.lineWidth = e.target.value;
  };
  
  const changeColor = (e) => {
    context.strokeStyle = e.target.value;
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
      <button
        onClick={clearCanvas}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Clear Canvas
      </button>

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

{/* color input */}
      <div className="mt-4">
        <label className="block text-gray-700 mb-2">Brush Color</label>
        <input
          type="color"
          onChange={changeColor}
          className="w-10 h-10 cursor-pointer"
        />
      </div>


    </div>
  );
};

export default Canvas;
