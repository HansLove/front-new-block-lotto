import './dice.css';

import { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function Dice({ dice, speed = '1s', isAnimating }: any) {
  const [diceFace, setdiceFace] = useState('transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg)');

  useEffect(() => {
    if (dice != 0) {
      setdiceFace(
        dice == 1
          ? `rotateX(0deg) rotateY(0deg) rotateZ(0deg)`
          : dice == 2
            ? `rotateY(-90deg)`
            : dice == 3
              ? `rotateY(-90deg) rotateZ(90deg)`
              : dice == 4
                ? `rotateX(90deg)`
                : dice == 5
                  ? `rotateY(-270deg) rotateX(90deg);`
                  : dice == 6
                    ? `rotateY(-180deg) rotateZ(90deg);`
                    : 'translateZ(-100px)'
      );
    }
  }, [dice]);

  // animation:roll ${dice!=0?speed:"3s"} linear infinite alternate;
  const Div = styled.div`
    & .cube{
      transformStyle: preserve-3d;
      animation:roll ${isAnimating ? speed : '3s'} linear infinite alternate;

      @keyframes roll {
        from, to {
            /* transform:${diceFace}; */
            transform:transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
        }
        16% {
            transform: rotateY(-90deg);
        }
        33% {
            transform: rotateY(-90deg) rotateZ(90deg);
        }
        50% {
            transform: rotateY(-180deg) rotateZ(90deg);
        }
        66% {
            transform: rotateY(-270deg) rotateX(90deg);
        }
        83% {
            transform: rotateX(90deg);
        }
}
  `;

  const Div2 = styled.div`
    & .cube{
      transformStyle: preserve-3d;
      transform: ${diceFace}
  `;

  return (
    <div className="m-auto mt-14 block w-fit">
      {dice === 0 ? (
        <Div className="scene" id="scene">
          <input type="checkbox" id="andicator" />

          <div className="cube">
            <div className="cube__face cube__face--front">
              <i></i>
            </div>
            <div className="cube__face cube__face--back">
              <i></i>
              <i></i>
            </div>
            <div className="cube__face cube__face--right">
              <i></i> <i></i> <i></i> <i></i> <i></i>
            </div>
            <div className="cube__face cube__face--left">
              <i></i> <i></i> <i></i> <i></i> <i></i> <i></i>
            </div>
            <div className="cube__face cube__face--top">
              <i></i> <i></i> <i></i>
            </div>
            <div className="cube__face cube__face--bottom">
              <i></i> <i></i> <i></i> <i></i>
            </div>
          </div>
        </Div>
      ) : (
        <Div2 className="scene" id="scene">
          <input type="checkbox" id="andicator" />

          <div className="cube">
            <div className="cube__face cube__face--front">
              <i></i>
            </div>
            <div className="cube__face cube__face--back">
              <i></i>
              <i></i>
            </div>
            <div className="cube__face cube__face--right">
              <i></i> <i></i> <i></i> <i></i> <i></i>
            </div>
            <div className="cube__face cube__face--left">
              <i></i> <i></i> <i></i> <i></i> <i></i> <i></i>
            </div>
            <div className="cube__face cube__face--top">
              <i></i> <i></i> <i></i>
            </div>
            <div className="cube__face cube__face--bottom">
              <i></i> <i></i> <i></i> <i></i>
            </div>
          </div>
        </Div2>
      )}
    </div>
  );
}
