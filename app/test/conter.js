"use client"

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  const incremento = 5;

  function calcoloIncremento(){
    let newCount = count + incremento
    setCount(newCount);  // ← Basta questo!
  }
  
  return (
    <div className="border border-foreground/20 rounded-lg p-6 space-y-4">
      <p className="text-2xl font-light text-foreground">
        Contatore: <span className="font-bold">{count}</span>
      </p>
      <button 
        onClick={calcoloIncremento}  // ← Puoi togliere () =>
        className="px-6 py-2 bg-foreground text-background rounded-lg hover:opacity-80 transition"
      >
        Incrementa
      </button>
    </div>
  )
}