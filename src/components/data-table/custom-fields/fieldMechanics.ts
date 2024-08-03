import React from "react";

interface FieldMechanicsProps {
  submitFunction: () => void;
  blurFunction: () => void;
  navigateUp: () => void;
  navigateDown: () => void;
  navigateLeft: () => void;
  navigateRight: () => void;
  e: React.KeyboardEvent<any>;
  ref: React.RefObject<any>;
}

export const keyPressed = ({
  submitFunction,
  blurFunction,
  navigateUp,
  navigateDown,
  navigateLeft,
  navigateRight,
  e,
}: FieldMechanicsProps) => {
  if (e.key === "Enter") {
    e.preventDefault();
    submitFunction();
  }
  if (e.key === "Escape") {
    e.preventDefault();
    blurFunction();
  }
  if (e.key === "Tab") {
    e.preventDefault();
    blurFunction();
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    navigateUp();
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    navigateDown();
  }
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    navigateLeft();
  }
  if (e.key === "ArrowRight") {
    e.preventDefault();
    navigateRight();
  } else {
  }
};
