"use client";
import { useState } from "react";
import { ModalMyOwn } from "./modalmyown";
import "./styles.css";

interface LotteryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MyOwnLotto({ isOpen, onClose }: LotteryModalProps) {
  const [showUrl, setShowUrl] = useState(false); // Estado para mostrar/ocultar el div

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowUrl(true); // Al hacer submit, mostramos el div con el URL
  };

  return (
    <>
      <ModalMyOwn isOpen={isOpen} onClose={onClose}>
        <div className="wrapperlotto">
          <form className="formlotto" onSubmit={handleSubmit}>
            <span className="title">Create Lotto</span>

            <div className="input-container">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white" // Asegura que el icono sea blanco por defecto
              >
                <defs>
                  <linearGradient
                    id="gradient-stroke"
                    x1="0"
                    y1="0"
                    x2="24"
                    y2="24"
                  >
                    <stop offset="0%" stopColor="white" />
                    <stop offset="100%" stopColor="white" />
                  </linearGradient>
                </defs>
                <g stroke="url(#gradient-stroke)" fill="none" strokeWidth="1.5">
                  <path d="M4 6H20M4 12H20M4 18H14" />
                </g>
              </svg>
              <input
                className="input"
                type="text"
                placeholder="Lotto Name"
                required
              />
            </div>

            <div className="input-container">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white" // Icono en blanco por defecto
              >
                <defs>
                  <linearGradient
                    id="gradient-stroke"
                    x1="0"
                    y1="0"
                    x2="24"
                    y2="24"
                  >
                    <stop offset="0%" stopColor="white" />
                    <stop offset="100%" stopColor="white" />
                  </linearGradient>
                </defs>
                <g stroke="url(#gradient-stroke)" fill="none" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="17" rx="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                </g>
              </svg>
              <input
                className="input"
                type="date"
                placeholder="Lotto Date"
                min={new Date().toISOString().split("T")[0]} // evita fechas pasadas
              />
            </div>

            <div className="input-container">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white" // Icono en blanco por defecto
              >
                <defs>
                  <linearGradient
                    id="gradient-stroke"
                    x1="0"
                    y1="0"
                    x2="24"
                    y2="24"
                  >
                    <stop offset="0%" stopColor="white" />
                    <stop offset="100%" stopColor="white" />
                  </linearGradient>
                </defs>
                <g stroke="url(#gradient-stroke)" fill="none" strokeWidth="1.5">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 9.5V14.5" />
                  <path d="M10.5 10.5C11 10 13 10 13.5 10.5C14 11 13.5 12 12 12.5C10.5 13 10 14 11 14.5C12 15 13.5 14.5 14 14" />
                </g>
              </svg>
              <input
                className="input"
                type="number"
                placeholder="Ticket Price (USD)"
                min="0"
                step="0.01"
              />
            </div>

            {showUrl && (
              <div id="lottourl">
                <div className="flex shadow-sm ">
                  <input
                    value="http://cqg/lotto/00021678"
                    className="py-1 indent-2 bg-slate-900 rounded-s-lg w-full focus:outline-none focus:border-amber-500"
                    name="text"
                    type="text"
                  />
                  <button className="py-1 rounded-e-lg text-white bg-amber-300 flex justify-center items-center w-10 h-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="pointer-events-none"
                    >
                      <rect width="24" height="24"></rect>
                      <rect
                        x="4"
                        y="8"
                        width="12"
                        height="12"
                        rx="1"
                        stroke="#000000"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></rect>
                      <path
                        d="M8 6V5C8 4.44772 8.44772 4 9 4H19C19.5523 4 20 4.44772 20 5V15C20 15.5523 19.5523 16 19 16H18"
                        stroke="#000000"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-dasharray="2 2"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div className="login-button">
              <input className="input" type="submit" value="Create My Lotto" />
            </div>

            <div className="texture"></div>
          </form>
        </div>
      </ModalMyOwn>
    </>
  );
}
