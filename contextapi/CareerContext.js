"use client"
import React, { createContext, useState, useContext } from 'react';

const CareerContext = createContext();

export const useCareerContext = () => useContext(CareerContext);

export const CareerProvider = ({ children }) => {
  const [careerGoal, setCareerGoal] = useState('');

  const updateCareerGoal = (newGoal) => {
    setCareerGoal(newGoal);
  };

  return (
    <CareerContext.Provider value={{ careerGoal, updateCareerGoal }}>
      {children}
    </CareerContext.Provider>
  );
};