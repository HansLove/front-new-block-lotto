import { useState } from "react";

import LottoDash from "./lottodashboard";
import { Winner } from "./Winner";


function LottoGame() {
  const [showWinner, setShowWinner] = useState(false);
  
  return (
    <div>
    <LottoDash/>

    <div className="text-center absolute bottom-10 right-6 border rounded-lg p-2">
        <button onClick={() => setShowWinner(true)}>
          Show Winner Demo
        </button>
        
        {showWinner && (
          <Winner
            winnerName="Juan Pérez"
            prize="0.003 BTC"
            ticket="00390"
            onContinue={() => setShowWinner(false)}
          />
        )}
      </div>

    </div>
  )
}

export default LottoGame