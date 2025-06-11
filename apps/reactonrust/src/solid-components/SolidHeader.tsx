import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';

interface SolidHeaderProps {
  title: string;
  subtitle?: string;
}

export const mountSolidHeader = (container: HTMLElement, props: SolidHeaderProps) => {
  const [title, setTitle] = createSignal(props.title);
  const [subtitle, setSubtitle] = createSignal(props.subtitle);

  const cleanup = render(() => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
        {title()}
      </h1>
      {subtitle() && (
        <span style={{ 
          color: 'rgba(255, 255, 255, 0.7)', 
          fontSize: '0.875rem' 
        }}>
          {subtitle()}
        </span>
      )}
    </div>
  ), container);

  return {
    cleanup,
    updateProps: (newProps: Partial<SolidHeaderProps>) => {
      if (newProps.title !== undefined) setTitle(newProps.title);
      if (newProps.subtitle !== undefined) setSubtitle(newProps.subtitle);
    }
  };
};
