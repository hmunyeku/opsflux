import React, { useEffect, useRef } from 'react';
import '@ui5/webcomponents/dist/Input.js';

/**
 * Wrapper pour ui5-input qui gère correctement les propriétés
 * React ne synchronise pas les propriétés des web components, seulement les attributs
 */
const UI5Input = ({
  value = '',
  disabled = false,
  type = 'Text',
  name = '',
  placeholder = '',
  required = false,
  onInput = () => {},
  style = {}
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      // Définir les propriétés directement sur l'élément DOM
      input.value = value;
      input.disabled = disabled;
      input.type = type;
      input.name = name;
      input.placeholder = placeholder;
      input.required = required;
    }
  }, [value, disabled, type, name, placeholder, required]);

  // Gérer l'événement input
  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      const handleInput = (e) => {
        onInput(e);
      };
      input.addEventListener('input', handleInput);
      return () => input.removeEventListener('input', handleInput);
    }
  }, [onInput]);

  return <ui5-input ref={inputRef} style={style}></ui5-input>;
};

export default UI5Input;
