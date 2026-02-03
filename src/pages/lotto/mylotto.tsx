"use client";
import "./styles.css";

import { ModalMyOwn } from "./modalmyown";

interface LotteryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MyLotto({ isOpen, onClose }: LotteryModalProps) {
  return (
    <>
      <ModalMyOwn isOpen={isOpen} onClose={onClose}>
        <div className="wrapperlotto">
          <form className="formlotto">
            <span className="title">My Own Lotto</span>
            <div className="md:flex  gap-8">
              <div className="flex ">
                {" "}
                <p>Lotto Date: </p>
                <p className="font-bold ml-3">21/06/2025</p>
              </div>
              <div className="flex">
                {" "}
                <p>Current Prize Pool: </p>
                <p className="font-bold ml-3">$525 USD</p>
              </div>
            </div>
            <div className="md:flex  gap-8">
              <div className="flex">
                {" "}
                <p>Tickets Sold: </p>
                <p className="font-bold ml-3">22</p>
              </div>
              <div className="flex">
                {" "}
                <p>Winner: </p>
                <p className="font-bold ml-3 text-slate-600">Waiting Date</p>
              </div>
            </div>
            <div className="h-52 w-full overflow-y-auto border border-gray-700 rounded-md">
              <table className="min-w-full divide-y divide-gray-700 text-white text-sm">
                <thead className="bg-gray-800 text-left sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 bg-gray-800">Ticket No.</th>
                    <th className="px-4 py-2 bg-gray-800">Name</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {[
                    "Ana Torres",
                    "Luis Méndez",
                    "Carmen López",
                    "John Rivera",
                    "Valeria Cruz",
                    "Mario Ríos",
                    "Lucía Ortega",
                    "Raúl García",
                    "Paty Romero",
                    "Tomás Aguilar",
                    "Jimena Soto",
                    "David Salas",
                    "Laura Estrada",
                    "Andrés Molina",
                    "Sara Vela",
                    "Enrique Silva",
                    "María León",
                    "Alan Pineda",
                    "Isabel Navarro",
                    "Jorge Peña",
                    "Tania Bravo",
                    "Oscar Duarte",
                  ].map((name, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2">
                        #{String(i).padStart(2, "0")}
                      </td>
                      <td className="px-4 py-2">{name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
<div className="flex gap-3">
            <div className="login-button">
              <input className="input" value="Buy a Ticket" />
            </div>

            <div className="login-button">
              <input className="input" type="submit" value="Close" />
            </div>
            </div>
            <div className="texture"></div>
          </form>
        </div>
      </ModalMyOwn>
    </>
  );
}
