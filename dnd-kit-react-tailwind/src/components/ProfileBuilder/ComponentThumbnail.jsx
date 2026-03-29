import React, { useRef, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

export default function ComponentThumbnail({ component: Component, scale = 0.3 }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (contentRef.current) {
        setHeight(contentRef.current.offsetHeight * scale);
    }
  }, [scale, Component]);

  return (
    <div
      className="relative w-full overflow-hidden bg-white rounded-lg shadow-sm border border-gray-200 pointer-events-none select-none transition-all duration-200"
      style={{ height: height ? `${height}px` : 'auto' }}
    >
      <div
        ref={contentRef}
        style={{
            width: '800px', // Simulate desktop canvas width
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
        }}
      >
        <div className="p-4">
             <Component />
        </div>
      </div>

      {/* Overlay to prevent interactions inside the thumbnail */}
      <div className="absolute inset-0 bg-transparent z-10" />
    </div>
  );
}

ComponentThumbnail.propTypes = {
  component: PropTypes.elementType.isRequired,
  scale: PropTypes.number,
};
