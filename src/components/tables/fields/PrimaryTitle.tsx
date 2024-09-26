import React from "react";

export const PrimaryTitle = ({ title }: { title: string }) => {
  return (
    <div className="select-none p-2 font-medium">
      {title}
    </div>
  );
};
