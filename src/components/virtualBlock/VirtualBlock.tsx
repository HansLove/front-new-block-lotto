import './style.scss'

import { useState } from 'react';

export default function VirtualBlock() {
  const [visible,] = useState(true); // Supongamos que inicia visible

  const clickCubo = () => {
    console.log('Cubo clicked!');
    // Puedes agregar cualquier lógica adicional aquí
  };

  if (!visible) {
    return null; // No renderiza nada si no es visible
  }

  return (
    <div id='cube-container' onClick={clickCubo}>
      <div className="face top"></div>
      <div className="face right"></div>
      <div className="face bottom"></div>
      <div className="face left"></div>
      <div className="face back"></div>
      <div className="face front"></div>
    </div>
  );
}
