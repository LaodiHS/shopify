import React from 'react';

const R = ({ c, v }) => {
  const style = {
    backgroundColor: c || 'transparent',
    display: 'inline',
  };

  return <span style={style}>{v}</span>;
};

export  {R};
