'use client';

import { createContext, useCallback, useContext, useEffect, useState } from "react";


type ShadexContextValue = {
  mousePosition: { x: number; y: number };
};

const ShadexContext = createContext<ShadexContextValue | null>(null);

export const useShadex = () => {
  const ctx = useContext(ShadexContext);
  return ctx;
};

export const ShadexProvider = ({ children }: { children: React.ReactNode }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () =>{
      document.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <ShadexContext.Provider value={{ mousePosition}}>
      {children}
    </ShadexContext.Provider>
  );
};
