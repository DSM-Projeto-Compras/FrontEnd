import React from "react";
import { useField } from "formik";

interface SelectWrapperProps {
  label: string;
  id: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  isWide?: boolean;
}

const SelectWrapper: React.FC<SelectWrapperProps> = ({
  label,
  id,
  name,
  options,
  isWide,
}) => {
  const [field, meta] = useField(name);

  return (
    <div
      className={`w-full md:pl-3 lg:pl-3 mb-6 md:mb-0 ${
        isWide === true ? "md:w-1/2" : isWide === false ? "md:w-2/5" : ""
      }`}
    >
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        {label}
      </label>
      <select
        id={id}
        {...field}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        <option value="" label="Selecione uma opção" />
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {meta.touched && meta.error ? (
        <div className="text-red-600 text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default SelectWrapper;
