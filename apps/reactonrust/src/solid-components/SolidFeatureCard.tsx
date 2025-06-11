import { createRoot, createSignal } from 'solid-js';
import { render } from 'solid-js/web';

interface SolidFeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export const mountSolidFeatureCard = (container: HTMLElement, props: SolidFeatureCardProps) => {
  let dispose: (() => void) | undefined;

  createRoot((disposeFn) => {
    dispose = disposeFn;

    const [title, setTitle] = createSignal(props.title);
    const [description, setDescription] = createSignal(props.description);
    const [icon, setIcon] = createSignal(props.icon);

    render(
      () => (
        <div
          style={{
            'background-color': 'white',
            padding: '1.5rem',
            'border-radius': '0.5rem',
            'box-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'box-shadow 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e: any) => {
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e: any) => {
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }}
        >
          <div style={{ 'font-size': '2.25rem', 'margin-bottom': '1rem' }}>{icon()}</div>
          <h4
            style={{
              'font-size': '1.25rem',
              'font-weight': '600',
              color: '#1f2937',
              'margin-bottom': '0.75rem',
            }}
          >
            {title()}
          </h4>
          <p
            style={{
              color: '#6b7280',
              'line-height': '1.625',
            }}
          >
            {description()}
          </p>
        </div>
      ),
      container
    );

    return {
      updateProps: (newProps: Partial<SolidFeatureCardProps>) => {
        if (newProps.title !== undefined) setTitle(newProps.title);
        if (newProps.description !== undefined) setDescription(newProps.description);
        if (newProps.icon !== undefined) setIcon(newProps.icon);
      },
    };
  });

  return {
    cleanup: () => {
      if (dispose) dispose();
      container.innerHTML = '';
    },
    updateProps: (newProps: Partial<SolidFeatureCardProps>) => {},
  };
};
