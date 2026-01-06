// import React from 'react'
import { FaStar } from 'react-icons/fa';

const Card = (props:any) => {
  const { 
    // id,
    rank, suit,hide} = props;
  const suits = ['♥', '♦', '♠', '♣'];

  return (!hide?
    <div
    className={`poker_card`}>

      <p 
      className='rango_1'
      style={{color:'black'}}
      >
        {rank==='T'?'10':rank}
      </p>

      <p 
      className='rango_2'
      style={{color:'black'}}>
        {rank==='T'?'10':rank}
      </p>

      <h1
      style={{color:suit==='hearts'?'red':suit=='diamonds'?'red':'black'}}
      >
        <span>{suit==='clubs'?suits[3]:suit=='diamonds'?suits[1]:suit=='hearts'?suits[0]:suits[2]}</span>
      </h1>

      <div className='estrellas'>
        <FaStar color='goldenrod'/>
        <FaStar color='goldenrod'/>
        <FaStar color='goldenrod'/>
      </div>
    </div>
      :
      <img
      className="back"
      src="https://opengameart.org/sites/default/files/card%20back%20blue.png"
      alt="Hidden card"
    />
  );
}

const PokerCards = ({id,hide,rank,suit}:any) => {

  return (
      <Card id={id} rank={rank} suit={suit} hide={hide} />
  );
}

export default PokerCards;
