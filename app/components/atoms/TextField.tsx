import React from "react";
import { useField } from "formik";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  id,
  name,
  type = "text",
  placeholder,
  ...props
}) => {
  const [field, meta] = useField(name);

  return (
    <div>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...field}
        {...props}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      />
      {meta.touched && meta.error ? (
        <div className="text-red-600 text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default TextField;
