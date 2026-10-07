import React from 'react';

export const Card = ({
  children,
  hoverable = false,
  padding = '22px',
  onClick,
  style = {},
  className = '',
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`card ${hoverable ? 'card-hover' : ''} ${className}`.trim()}
      style={{
        padding,
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
