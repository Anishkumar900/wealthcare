import React, {useState } from 'react'
import AddMoneyForm from './AddMoneyForm';

export default function AddMoney(props) {
    const [email,setEmail]=useState(null);
    const [showForm,setShowForm]=useState(false);
    const [decibleButton,setDecibleButton] = useState(false)


  return (
    <div>
        <button className={` bg-[var(--legacy-interactive-color)] text-white rounded-lg px-4 py-2 m-4 transition ${decibleButton
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[var(--legacy-interactive-color-hover)]"
              }`}>Add Money</button>
        <AddMoneyForm email={email?.email}/>
    </div>
  )
}
