import React from 'react';

interface FeatureData {
  title: string;
  description: string;
  icon: string;
}

interface SolidFeatureGridProps {
  features: FeatureData[];
}

const FeatureCard = ({ title, description, icon }: FeatureData) => {
  const cardStyle = {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'box-shadow 0.3s ease',
    cursor: 'pointer'
  };

  const iconStyle = {
    fontSize: '2.25rem',
    marginBottom: '1rem'
  };

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.75rem'
  };

  const descriptionStyle = {
    color: '#6b7280',
    lineHeight: '1.625'
  };

  return (
    <div 
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div style={iconStyle}>{icon}</div>
      <h4 style={titleStyle}>{title}</h4>
      <p style={descriptionStyle}>{description}</p>
    </div>
  );
};

export const SolidFeatureGrid = ({ features }: SolidFeatureGridProps) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  };

  return (
    <div style={gridStyle}>
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
};
