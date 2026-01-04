"use client";
interface ButtonProps {
  text: string;
  type?: string;
  disabled?: boolean;
  onClick?: () => void;
}
const Button = ({ text, type, disabled, onClick }: ButtonProps) => {
  return (
    <>
      {type === "outline" ? (
        <button
          onClick={onClick}
          className="glass-glow-btn-outline  text-white rounded-md px-5! py-2 mt-2"
        >
          {text}
        </button>
      ) : type === "bordered" ? (
        <button
          onClick={onClick}
          disabled={disabled}
          className="border border-gray-300 w-full  text-gray-300 rounded-xl py-2 px-5! mt-2 cursor-pointer"
        >
          {text}
        </button>
      ) : (
        <button
          onClick={onClick}
          disabled={disabled}
          className="glass-glow-btn  text-white rounded-md py-2 px-5! mt-2"
        >
          {text}
        </button>
      )}
    </>
  );
};

export default Button;
