import React from "react";
import { useField } from "formik";

interface TextAreaFieldProps {
  label: string;
  id: string;
  name: string;
  rows?: number;
  placeholder?: string;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  id,
  name,
  rows = 8,
  placeholder,
}) => {
  const [field, meta] = useField(name);

  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        {label}
      </label>
      <textarea
        {...field}
        id={id}
        rows={rows}
        placeholder={placeholder}
        className="resize-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-400 focus:border-blue-400"
      />
      {meta.touched && meta.error ? (
        <div className="text-red-600 text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default TextAreaField;
