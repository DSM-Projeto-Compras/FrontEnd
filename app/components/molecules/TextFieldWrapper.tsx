import React from "react";
import TextField from "../atoms/TextField";

interface TextFieldWrapperProps {
  label: string;
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  isWide?: boolean;
}

const TextFieldWrapper: React.FC<TextFieldWrapperProps> = ({
  label,
  id,
  name,
  type,
  placeholder,
  isWide,
}) => (
  <div
    className={`w-full md:pr-3 lg:pr-3 mb-6 md:mb-0 ${
      isWide === true ? "md:w-3/5" : isWide === false ? "md:w-1/2" : ""
    }`}
  >
    <label
      htmlFor={id}
      className="block mb-2 text-sm font-medium text-gray-900 md:pr-3 lg:pr-3"
    >
      {label}
    </label>
    <TextField id={id} name={name} type={type} placeholder={placeholder} />
  </div>
);

export default TextFieldWrapper;
