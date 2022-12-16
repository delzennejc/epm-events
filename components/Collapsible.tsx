import { useState } from "react";

const Collapsible = ({ children }: any) => {
    const [open, setOPen] = useState(false);
    const toggle = () => {
      setOPen(!open);
    };
    return (
      <div className={``} onClick={toggle}>
        {children}
      </div>
    );
  };
  
export default Collapsible