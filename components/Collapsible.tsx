import { useState } from "react";

const Collapsible = ({ children }: any) => {
    const [open, setOPen] = useState(false);
    const toggle = () => {
      setOPen(!open);
    };
    return (
      <div className={`${open ? '' : 'h-7'} relative overflow-hidden`} >
        <span className="absolute ml-60 mt-0.5 font-bold text-title-orange cursor-pointer" onClick={toggle}>{open ? 'Fermer' : 'Voir'} inscrits</span>
        {children}
      </div>
    );
  };
  
export default Collapsible