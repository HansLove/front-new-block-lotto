"use client"

import { useState } from "react"
import { LotteryTicketCard } from "./lottery-ticket-card"
import { Modal } from "./modal"

interface LotteryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LotteryModal({ isOpen, onClose }: LotteryModalProps) {
  const [selectedRound, setSelectedRound] = useState<string | null>(null) // Cambiar a string

  const rounds = [
    { lottoType: "Weekly", amount: 0.0035, date: "21/03/25", price: 0.0001 },
    { lottoType: "Monthly", amount: 0.0225, date: "28/03/25", price: 0.0003 },
  ]

  return (
    <>
   
    <Modal isOpen={isOpen} onClose={onClose} title="Choose your Ticket Type">
      <div className="mt-6 grid gap-6 sm:grid-cols-2 ">
        {rounds.map((round) => (
          <LotteryTicketCard
            key={round.lottoType}
            lottoType={round.lottoType}
            amount={round.amount}
            price={round.price}
            date={round.date}
            selected={selectedRound === round.lottoType} // Usar round.lottoType
            onClick={() => setSelectedRound(round.lottoType)} // Usar round.lottoType
          />
        ))}
      </div>
      <button
        className={`mt-6 w-full rounded-lg py-6 text-lg font-semibold text-white transition-colors ${selectedRound ? "bg-amber-600 hover:bg-amber-500" : "bg-amber-600/50 cursor-not-allowed"}`}
        disabled={!selectedRound}
      >
       BUY NOW!
      </button>
    </Modal></>
  )
}
