import React from "react";
import Joi from "joi-browser";
import Input from "./input";

export const validateProperty = (name, value, schema) => {
  const obj = { [name]: value };
  const fieldSchema = { [name]: schema[name] };

  const result = Joi.validate(obj, fieldSchema);
  const { error } = result;

  return error ? error.details[0].message : null;
};

export const validate = (inputs, schema) => {
  const result = Joi.validate(inputs, schema, { abortEarly: false });
  const { error } = result;
  const errors = {};

  if (!error) return null;

  for (let item of error.details) {
    errors[item.path[0]] = item.message;
  }

  return errors;
};

export const renderInput = (name, label, type, value, onChange, errors) => {
  return (
    <Input
      name={name}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      error={errors[name]}
    />
  );
};