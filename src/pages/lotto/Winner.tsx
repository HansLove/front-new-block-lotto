"use client";

import confetti from "canvas-confetti";
import { useEffect } from "react";

interface WinnerProps {
    winnerName: string;
    prize?: string;
    ticket?: string;
    onContinue?: () => void;
}

export function Winner({ winnerName, prize, ticket, onContinue }: WinnerProps) {
    useEffect(() => {
        // Fire confetti when component mounts
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        };

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }

            const particleCount = 50;

            // Launch confetti from both sides
            confetti({
                particleCount,
                angle: randomInRange(55, 125),
                spread: randomInRange(50, 70),
                origin: { x: 0 },
                colors: ["#FFD700", "#FFA500", "#FF69B4", "#4169E1", "#32CD32"],
            });

            confetti({
                particleCount,
                angle: randomInRange(55, 125),
                spread: randomInRange(50, 70),
                origin: { x: 1 },
                colors: ["#FFD700", "#FFA500", "#FF69B4", "#4169E1", "#32CD32"],
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="results-summary-container">
                <div className="confetti">
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                    <div className="confetti-piece"></div>
                </div>
                <div className="results-summary-container__result">
                    <div className="font-bold text-xl">CONGRATULATIONS!!</div>
                    <div className="font-bold text-3xl">  {winnerName}</div>
                    <div className="result-box ">
                       <img src="/images/lotto/winner.png" className="scale-110"/>
                    </div>
                    <div className="">
                        {prize && (
                            <><p className="text-gray-50 mt-3">
                                You have won the accumulated lot of:
                            </p><p className="text-2xl font-bold mb-1">
                                    {prize}
                                </p></>
                        )}
                    </div>
                    <p> With your Ticket # {ticket}</p>
                    <div className="space-y-2 w-full">
                        <button
                            className="relative z-50 w-full hover:opacity-90 my-2 bg-amber-600 py-2 rounded-lg text-white"
                            onClick={onContinue}
                        >
                            Continue
                        </button>

                    </div>
                </div>
            </div>


        </div>
    );
}