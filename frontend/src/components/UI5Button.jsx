import React, { useEffect, useRef } from 'react';
import '@ui5/webcomponents/dist/Button.js';

/**
 * Wrapper pour ui5-button qui gère correctement les propriétés
 */
const UI5Button = ({
  disabled = false,
  design = 'Default',
  onClick = () => {},
  style = {},
  children
}) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (button) {
      button.disabled = disabled;
      button.design = design;
    }
  }, [disabled, design]);

  useEffect(() => {
    const button = buttonRef.current;
    if (button) {
      const handleClick = (e) => {
        onClick(e);
      };
      button.addEventListener('click', handleClick);
      return () => button.removeEventListener('click', handleClick);
    }
  }, [onClick]);

  return <ui5-button ref={buttonRef} style={style}>{children}</ui5-button>;
};

export default UI5Button;
