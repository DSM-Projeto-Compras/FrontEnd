import React from "react";
import { useField } from "formik";

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
  type = "text",
  placeholder,
  isWide,
}) => {
  const [field, meta] = useField(name);

  return (
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
      <input
        {...field}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      />
      {meta.touched && meta.error ? (
        <div className="text-red-600 text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default TextFieldWrapper;
