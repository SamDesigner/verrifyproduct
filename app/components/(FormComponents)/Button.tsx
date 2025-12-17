import React from "react";
interface ButtonProps {
  text: string;
  type?: string;
}
const Button = ({ text, type }: ButtonProps) => {
  return (
    <>
      {type === "outline" ? (
        <button className="glass-glow-btn-outline  text-white rounded-md py-2 mt-2">
          {text}
        </button>
      ) : (
        <button className="glass-glow-btn  text-white rounded-md py-2 mt-2">
          {text}
        </button>
      )}
    </>
  );
};

export default Button;
