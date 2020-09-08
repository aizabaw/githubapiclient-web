import React from "react";

const Input = ({ name, type = "text", label, onChange, errors, helpText }) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        className="form-control"
        id={name}
        name={name}
        onChange={onChange}
      />
      {helpText && <small className="form-text text-muted">{helpText}</small>}
      {errors && <div className="alert alert-danger">{errors}</div>}
    </div>
  );
};

export default Input;
