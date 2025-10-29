import React, { useState, useRef } from 'react';

interface InteractiveTextProps {
  children: string;
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const InteractiveText: React.FC<InteractiveTextProps> = ({ children }) => {
  const [text, setText] = useState(children);
  const intervalRef = useRef<number | null>(null);

  const scramble = () => {
    let iteration = 0;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      setText(prevText =>
        prevText
          .split("")
          .map((_letter, index) => {
            if (index < iteration) {
              return children[index];
            }
            // Use original letters for spaces
            if (children[index] === ' ') {
                return ' ';
            }
            return LETTERS[Math.floor(Math.random() * 26)];
          })
          .join("")
      );

      if (iteration >= children.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      
      iteration += 1 / 3;
    }, 30);
  };
  
  return (
    <span onMouseEnter={scramble} className="inline-block">
      {text}
    </span>
  );
};
