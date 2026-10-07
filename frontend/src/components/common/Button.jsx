import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  style = {},
  className = '',
  ...props
}) => {
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const fullWidthClass = fullWidth ? 'btn-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn ${variantClass} ${sizeClass} ${fullWidthClass} ${className}`.trim()}
      style={style}
      {...props}
    >
      {loading ? (
        <span
          style={{
            display: 'inline-block',
            width: size === 'sm' ? '14px' : '16px',
            height: size === 'sm' ? '14px' : '16px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: 'currentColor',
            borderRadius: '50%',
            animation: 'spin 0.75s linear infinite'
          }}
        />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
          )}
          {children && <span>{children}</span>}
          {Icon && iconPosition === 'right' && (
            <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
          )}
        </>
      )}
    </button>
  );
};

export default Button;
