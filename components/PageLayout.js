export default function PageLayout({ title, gameState = null, children }) {
  return (
    <div className="flex flex-col flex-1 bg-gray-300 p-2">
      {gameState == null ? (
        <div className="flex flex-1 flex-col min-h-0">
          <p className="text-2xl font-black text-black text-center">{title}</p>
          <div className="flex flex-row flex-1 justify-evenly my-auto min-h-0">
            {children}
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
