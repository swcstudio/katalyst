export const flex = (styles: Record<string, any>) => {
  const classNames: string[] = [];
  
  for (const [property, value] of Object.entries(styles)) {
    if (typeof value === 'object' && value !== null) {
      continue;
    }
    if (typeof value === 'string' || typeof value === 'number') {
      const kebabProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      classNames.push(`${kebabProperty}_${value}`);
    }
  }
  
  return classNames.join(' ');
};

export const grid = (styles: Record<string, any>) => {
  const classNames: string[] = [];
  
  for (const [property, value] of Object.entries(styles)) {
    if (typeof value === 'object' && value !== null) {
      continue;
    }
    if (typeof value === 'string' || typeof value === 'number') {
      const kebabProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      classNames.push(`${kebabProperty}_${value}`);
    }
  }
  
  return classNames.join(' ');
};
