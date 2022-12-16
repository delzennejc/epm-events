import { useState } from "react";

const Collapsible = ({ children }: any) => {
    const [open, setOPen] = useState(false);
    const toggle = () => {
      setOPen(!open);
    };
    return (
      <div className={`${open ? '' : 'h-7'} relative overflow-hidden cursor-pointer`} onClick={toggle}>
        <span className="absolute ml-24 mt-0.5 font-bold text-title-orange">{open ? 'Fermer' : 'Voir'} inscrits</span>
        {children}
      </div>
    );
  };
  
export default Collapsible