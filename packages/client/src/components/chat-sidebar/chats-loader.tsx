const ChatsLoader = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center px-4 py-3 space-x-4 w-full animate-pulse"
        >
          <div className="h-10 w-10 bg-background rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-background rounded w-1/3" />
            <div className="h-3 bg-background rounded w-1/2" />
          </div>
        </div>
      ))}
    </>
  );
};
export default ChatsLoader;
