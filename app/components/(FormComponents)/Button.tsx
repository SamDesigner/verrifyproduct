import React from "react";
interface ButtonProps {
  text: string;
  type?: string;
  disabled?:boolean;
  onClick?:() => void
}
const Button = ({ text, type, disabled, onClick }: ButtonProps) => {
  return (
    <>
      {type === "outline" ? (
        <button onClick={onClick} className="glass-glow-btn-outline  text-white rounded-md py-2 mt-2">
          {text}
        </button>
      ) : (
        <button onClick={onClick} disabled={disabled} className="glass-glow-btn  text-white rounded-md py-2 mt-2">
          {text}
        </button>
      )}
    </>
  );
};

export default Button;
