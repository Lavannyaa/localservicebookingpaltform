import React from 'react';

export const Select = ({
  label,
  options = [],
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  helperText,
  id,
  name,
  style = {},
  className = '',
  ...props
}) => {
  const selectId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`form-group ${className}`.trim()} style={style}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          <span>{label}</span>
          {required && <span className="required">*</span>}
        </label>
      )}

      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`form-select ${error ? 'error' : ''}`.trim()}
        {...props}
      >
        {options.map((opt, i) => (
          <option key={i} value={typeof opt === 'object' ? opt.value : opt}>
            {typeof opt === 'object' ? opt.label : opt}
          </option>
        ))}
      </select>

      {error && <span className="form-error">{error}</span>}
      {helperText && !error && <span className="form-helper">{helperText}</span>}
    </div>
  );
};

export default Select;
