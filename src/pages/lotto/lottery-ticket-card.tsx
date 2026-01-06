"use client"

interface LotteryTicketCardProps {
  lottoType: string;
  amount: number;
  date: string;
  price: number;
  selected?: boolean;
  onClick?: () => void;
}

export function LotteryTicketCard({ lottoType, price, amount, date, selected, onClick }: LotteryTicketCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border-0 bg-gradient-to-br from-[#2a2a4a] to-[#1a1a2a] p-6 shadow-xl cursor-pointer duration-150 hover:scale-105 ${
        selected ? "ring-2 ring-amber-500 scale-105" : ""
      }`}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdi0ySDEweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-20"></div>
      <div className="relative space-y-4">
        <div className="flex items-center justify-center gap-1">
          <span className="text-sm font-medium text-gray-400"> {lottoType} ticket type</span>
        </div>
        <div className="text-center uppercase text-2xl font-bold text-purple-500">
        <p className="text-white text-xs font-light">I want to buy a</p>
           {lottoType} ticket
         <p className="text-white text-xs font-light">Ticket Price: {price} BTC</p>
        </div>
       
        <div className="text-center text-3xl font-bold text-amber-500">
        <div className="mt-3 text-base text-gray-200 uppercase">lottery prize</div>
          {amount}
          <span className="ml-1 text-lg">{" BTC"}</span>
        </div>
        <div className="text-center text-sm font-medium text-gray-400">LOTTO DATE: {date}</div>
      </div>
    </div>
  );
}
