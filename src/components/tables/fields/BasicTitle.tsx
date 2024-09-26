import React from 'react'

export const BasicTitle = ({title}: {title: string}) => {
  return (
    <div className="select-none border-l border-gray-200 p-2 font-medium">
      {title}
    </div>
  );
}
