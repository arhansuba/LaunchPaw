const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-10 h-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-10 h-10 rounded-full border-4 border-purple-400/20 border-t-purple-500 animate-spin"></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full rotate-45">
          <div className="w-10 h-10 rounded-full border-4 border-transparent border-t-purple-400/40 animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
