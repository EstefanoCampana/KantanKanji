export default function PageLayout({ title, small, children }) {
  return (
    <div className="flex flex-col flex-1 bg-gray-300 p-2 min-h-0 overflow-y-hidden">
      <div className="flex flex-1 flex-col min-h-0">
        <p className="text-2xl font-black text-black text-center shrink-0">
          {title}
        </p>
        <div
          className={`${small ? "grid grid-cols-1" : "flex flex-row justify-evenly"} gap-2 flex-1 my-auto min-h-0`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
