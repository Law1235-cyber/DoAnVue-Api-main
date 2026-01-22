// components/ProfileBuilder/Avatar.jsx
import React from 'react';

const Avatar = ({ isSelected }) => {
  return (
    <div className={`p-4 ${isSelected ? 'border-2 border-blue-500' : ''}`}>
      <div className="flex items-center justify-center">
        <img
          src="https://via.placeholder.com/150"
          alt="Avatar"
          className="w-24 h-24 rounded-full"
        />
      </div>
    </div>
  );
};

export default Avatar;
