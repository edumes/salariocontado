"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedDigitsProps {
  value: string;
  className?: string;
  duration?: number;
}

export function AnimatedDigits({ value, className, duration = 0.3 }: AnimatedDigitsProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [previousValue, setPreviousValue] = useState(value);
  const [changedIndices, setChangedIndices] = useState<number[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Function to check if a character is a digit
  const isDigit = (char: string) => /[0-9]/.test(char);

  useEffect(() => {
    if (value !== previousValue) {
      // Find which digits have changed
      const newChangedIndices: number[] = [];
      const maxLength = Math.max(value.length, previousValue.length);
      
      for (let i = 0; i < maxLength; i++) {
        const currentChar = value[i] || '';
        const previousChar = previousValue[i] || '';
        
        // Only animate digits, not symbols or spaces
        if (isDigit(currentChar) && isDigit(previousChar) && currentChar !== previousChar) {
          newChangedIndices.push(i);
        }
      }

      setChangedIndices(newChangedIndices);
      setPreviousValue(value);
      setDisplayValue(value);

      // Clear changed indices after animation
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setChangedIndices([]);
      }, duration * 1000);
    }
  }, [value, previousValue, duration]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Update display value when value changes
  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <span className={cn("inline-block", className)}>
      {displayValue.split('').map((char, index) => (
        <span key={`${char}-${index}-${changedIndices.includes(index)}`} className="inline-block">
          <AnimatePresence mode="wait">
            <motion.span
              key={`${char}-${index}-${changedIndices.includes(index)}`}
              initial={changedIndices.includes(index) ? { 
                opacity: 0, 
                y: -20,
                scale: 1.2,
                color: "#10b981" // emerald-500
              } : { opacity: 1, y: 0, scale: 1, color: "inherit" }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                color: "inherit"
              }}
              exit={changedIndices.includes(index) ? { 
                opacity: 0, 
                y: 20,
                scale: 0.8
              } : { opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: duration,
                ease: "easeOut"
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}
