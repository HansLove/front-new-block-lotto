import 'react-toastify/dist/ReactToastify.css';

import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import RequestEnergy from '@/utils/RequestEnergy';
import { SeparadorDecimal } from '@/utils/SeparadorDecimal';
import { GAMES_ID } from '@/utils/Utils';
// import { FaCopy } from "react-icons/fa";
// import {CopyToClipboard} from 'react-copy-to-clipboard';

export default function Squares({ socket }: any) {
  const [minNumber] = useState('1');
  const [maxNumber] = useState('10');
  const [nonce, setNonce] = useState('0');
  const [proof, setProof] = useState('');
  const [starCount, setStarCount] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [row, setRow] = useState([]);
  const [column, setColumn] = useState([]);

  const onClick = async () => {
    if (generating) return;

    setGenerating(true);
    notify();

    await RequestEnergy(3, 'bc1...', parseInt(minNumber), parseInt(maxNumber), GAMES_ID.secuencer, socket.socket.id);

    // Respuesta del backend
    socket.socket.on('responseCaosEngine', (data: any) => {
      console.log('respuesta de caos engine: ', data);

      console.log('pase por aqui!');
      setRow(JSON.parse(data.result));
      // setRow(JSON.parse(data.cards));

      // setColumn(JSON.parse(data.result));

      const zeroCount = (data.data.match(/^0+/) || [])[0]?.length || 0;
      setStarCount(zeroCount);

      setProof(data.data);
      setNonce(data.nonce);

      setTimeout(() => {
        setGenerating(false);
      }, 5000);
    });
  };

  useEffect(() => {
    const shuffle = (array: any) => {
      let currentIndex = array.length,
        randomIndex;

      // While there remain elements to shuffle...
      while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }

      return array;
    };
    if (row.length > 0) {
      setColumn(shuffle([...row]));
    }
  }, [row]);

  const [copied, setcopied] = useState(false);

  useEffect(() => {
    if (copied)
      setTimeout(() => {
        setcopied(false);
      }, 1000);
  }, [copied]);

  useEffect(() => {
    return () => {
      setGenerating(false);
    };
  }, []);

  const areInputsValid = () => {
    const min = parseInt(minNumber);
    const max = parseInt(maxNumber);
    return !isNaN(min) && !isNaN(max) && min <= max;
  };

  const notify = () => {
    toast('Wait 5 seconds to ask again', {
      position: 'bottom-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: 'dark',
      progress: undefined,
    });
  };

  return (
    <section className="relative mb-40 w-full bg-cover bg-no-repeat">
      <div className="bg-color-red-400 flex h-full w-full flex-col items-center rounded-lg bg-opacity-55 pt-10">
        <div className="flex h-full w-1/2 flex-col items-center justify-center rounded-xl text-white">
          <h2 className="m-2 text-center text-4xl font-bold dark:text-slate-800">Football pool squares</h2>
          <button
            onClick={onClick}
            className="m-auto mb-10 mt-2 block rounded-full bg-red-800 p-2 px-8 font-bold text-white hover:bg-red-600"
            disabled={!areInputsValid() || generating}
          >
            Generate
          </button>
          <ToastContainer></ToastContainer>

          <div className="flex flex-col">
            {/* First row */}
            <div className="flex w-full overflow-auto whitespace-nowrap">
              <p className="text-color-black-500 mt-0 flex w-[10vh] items-center justify-center border-2 border-slate-900 bg-slate-800 p-2 text-xl font-bold dark:border-slate-300 dark:bg-slate-100 dark:text-slate-800"></p>
              {row.map((item, key) => (
                <p
                  key={key}
                  className="text-color-black-500 mt-0 flex w-[10vh] items-center justify-center border-2 border-slate-900 bg-slate-800 p-2 text-xl font-bold dark:border-slate-300 dark:bg-slate-100 dark:text-slate-800"
                >
                  {SeparadorDecimal(item - 1)}
                </p>
              ))}
            </div>

            {/* Rest of the rows */}
            {column.map((item, key) => (
              <div key={key} className="flex w-full overflow-auto whitespace-nowrap">
                <p className="text-color-black-500 mt-0 flex w-[10vh] items-center justify-center border-2 border-slate-900 bg-slate-800 p-2 text-xl font-bold dark:border-slate-300 dark:bg-slate-100 dark:text-slate-800">
                  {SeparadorDecimal(item - 1)}
                </p>
                {row.map((_, key) => (
                  <p
                    key={key}
                    className="text-color-black-500 mt-0 flex w-[10vh] items-center justify-center border-2 border-slate-900 bg-slate-800 p-2 text-xl font-bold dark:border-slate-300 dark:bg-slate-100 dark:text-slate-800"
                  ></p>
                ))}
              </div>
            ))}
          </div>

          {/* <CopyToClipboard
          text={result.toString()}
          onCopy={() => setcopied(true)}>
          <button 
          className='button_copy_json'>
          <FaCopy
          className="m-1 hover:text-sky-500 text-sky-400 cursor-pointer"
          /></button>
          </CopyToClipboard>

          {copied&&<a className=" text-sm block top-7 right-2">Copied</a>} */}
        </div>

        <div className="flex w-full items-center justify-center">
          <div className="my-2 flex flex-col items-center justify-center rounded-2xl px-2 text-center">
            <p className="block w-fit text-xl uppercase text-gray-500">Nonce: {SeparadorDecimal(nonce)}</p>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-evenly space-x-2">
                {[...Array(starCount)].map((_, index) => (
                  <p className="mt-3 flex w-fit text-2xl" key={index}>
                    ⭐
                  </p>
                ))}
              </div>
              <p className="text-xxs w-fit items-center pt-5 text-slate-400 dark:text-slate-800">{proof}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
