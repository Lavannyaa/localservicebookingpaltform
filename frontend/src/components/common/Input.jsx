import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  suffixIcon: SuffixIcon,
  onSuffixClick,
  required = false,
  disabled = false,
  value,
  onChange,
  placeholder,
  type = 'text',
  id,
  name,
  style = {},
  className = '',
  ...props
}) => {
  const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`form-group ${className}`.trim()} style={style}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          <span>{label}</span>
          {required && <span className="required">*</span>}
        </label>
      )}

      <div className="input-wrapper">
        {Icon && (
          <span className="input-icon-prefix">
            <Icon size={18} />
          </span>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`form-input ${Icon ? 'has-prefix' : ''} ${SuffixIcon ? 'has-suffix' : ''} ${error ? 'error' : ''}`.trim()}
          {...props}
        />

        {SuffixIcon && (
          <span
            className="input-icon-suffix"
            onClick={onSuffixClick}
            style={{ cursor: onSuffixClick ? 'pointer' : 'default' }}
          >
            <SuffixIcon size={18} />
          </span>
        )}
      </div>

      {error && <span className="form-error">{error}</span>}
      {helperText && !error && <span className="form-helper">{helperText}</span>}
    </div>
  );
};

export default Input;
