import React, { useEffect, useRef } from 'react';
import '@ui5/webcomponents/dist/CheckBox.js';

/**
 * Wrapper pour ui5-checkbox qui gère correctement les propriétés
 */
const UI5CheckBox = ({
  checked = false,
  text = '',
  onChange = () => {},
  style = {}
}) => {
  const checkboxRef = useRef(null);

  useEffect(() => {
    const checkbox = checkboxRef.current;
    if (checkbox) {
      checkbox.checked = checked;
      checkbox.text = text;
    }
  }, [checked, text]);

  useEffect(() => {
    const checkbox = checkboxRef.current;
    if (checkbox) {
      const handleChange = (e) => {
        onChange(e);
      };
      checkbox.addEventListener('change', handleChange);
      return () => checkbox.removeEventListener('change', handleChange);
    }
  }, [onChange]);

  return <ui5-checkbox ref={checkboxRef} style={style}></ui5-checkbox>;
};

export default UI5CheckBox;
