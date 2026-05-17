
import React from 'react';

/**
 * Section wrapper component with consistent spacing
 * @param {string} title - Section title
 * @param {React.ReactNode} children - Section content
 * @param {string} className - Additional CSS classes
 */
const Section = ({ title, children, className = "" }) => {
  return (
    <section className={`section ${className}`}>
      {title && <h2 className="section-title">{title}</h2>}
      <div className="section-content">
        {children}
      </div>
    </section>
  );
};

export default Section;
