import React from "react";

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
}) => (
  <div>
    <label
      htmlFor={id}
      className="block mb-2 text-sm font-medium text-gray-900"
    >
      {label}
    </label>
    <textarea
      id={id}
      name={name}
      rows={rows}
      placeholder={placeholder}
      className="resize-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-400 focus:border-blue-400"
    />
  </div>
);

export default TextAreaField;
