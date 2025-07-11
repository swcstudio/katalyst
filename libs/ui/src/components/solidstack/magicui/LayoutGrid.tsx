import { css, cx } from '@sse/ui/styled-system/css';
import { animate } from 'motion';
import { type Component, createSignal, For, type JSX, onCleanup, onMount } from 'solid-js';

export interface CardData {
  id: number;
  content: JSX.Element;
  className: string;
  thumbnail: string;
}

export interface LayoutGridProps {
  cards: CardData[];
  className?: string;
}

export const LayoutGridDemo: Component = () => {
  return (
    <div class={css({ height: '100vh', paddingY: '80px', width: '100%' })}>
      <LayoutGrid cards={cards} />
    </div>
  );
};

export const LayoutGrid: Component<LayoutGridProps> = (props) => {
  const [selected, setSelected] = createSignal<CardData | null>(null);
  const [lastSelected, setLastSelected] = createSignal<CardData | null>(null);

  const handleClick = (card: CardData) => {
    setLastSelected(selected());
    setSelected(card);
  };

  const handleOutsideClick = () => {
    setSelected(null);
    setLastSelected(null);
  };

  onMount(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleOutsideClick();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    onCleanup(() => {
      document.removeEventListener('keydown', handleKeyDown);
    });
  });

  return (
    <div
      class={css({
        width: '100%',
        height: '100%',
        padding: '40px',
        maxWidth: '1400px',
        marginX: 'auto',
        position: 'relative',
      })}
    >
      <div
        class={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gridTemplateRows: 'repeat(1, 1fr)',
          gap: '16px',
          height: '100%',
          width: '100%',
          md: { gridTemplateColumns: 'repeat(3, 1fr)' },
          lg: { gap: '24px' },
        })}
      >
        <For each={props.cards}>
          {(card) => (
            <div class={cx(card.className)}>
              <div
                class={css({
                  position: 'relative',
                  overflow: 'hidden',
                  height: '100%',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.6s ease',
                  _hover: {
                    transform: 'scale(1.05)',
                  },
                })}
                onClick={() => handleClick(card)}
              >
                <ImageComponent card={card} />
                <div
                  class={css({
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 100%)',
                    display: 'flex',
                    alignItems: 'end',
                    padding: '24px',
                  })}
                >
                  <div class={css({ color: 'white', zIndex: 10 })}>{card.content}</div>
                </div>
              </div>
            </div>
          )}
        </For>
      </div>

      {selected() && (
        <div
          class={css({
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          })}
          onClick={handleOutsideClick}
        >
          <div
            class={css({
              width: '100%',
              maxWidth: '800px',
              height: '80%',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
            })}
            onClick={(e) => e.stopPropagation()}
          >
            <ImageComponent card={selected()!} />
            <div
              class={css({
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 100%)',
                display: 'flex',
                alignItems: 'end',
                padding: '40px',
              })}
            >
              <div class={css({ color: 'white', fontSize: 'xl' })}>{selected()!.content}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ImageComponent: Component<{ card: CardData }> = (props) => {
  return (
    <img
      src={props.card.thumbnail}
      alt="thumbnail"
      class={css({
        objectFit: 'cover',
        objectPosition: 'center',
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      })}
    />
  );
};

const SkeletonOne: Component = () => {
  return (
    <div>
      <p
        class={css({
          fontWeight: 'bold',
          fontSize: 'xl',
          color: 'white',
          md: { fontSize: '4xl' },
        })}
      >
        House in the woods
      </p>
      <p class={css({ fontWeight: 'normal', fontSize: 'base', color: 'white' })} />
      <p
        class={css({
          fontWeight: 'normal',
          fontSize: 'base',
          marginY: '16px',
          maxWidth: '512px',
          color: 'neutral.200',
        })}
      >
        A serene and tranquil retreat, this house in the woods offers a peaceful escape from the
        hustle and bustle of city life.
      </p>
    </div>
  );
};

const SkeletonTwo: Component = () => {
  return (
    <div>
      <p
        class={css({
          fontWeight: 'bold',
          fontSize: 'xl',
          color: 'white',
          md: { fontSize: '4xl' },
        })}
      >
        House above the clouds
      </p>
      <p class={css({ fontWeight: 'normal', fontSize: 'base', color: 'white' })} />
      <p
        class={css({
          fontWeight: 'normal',
          fontSize: 'base',
          marginY: '16px',
          maxWidth: '512px',
          color: 'neutral.200',
        })}
      >
        Perched high above the world, this house offers breathtaking views and a unique living
        experience. It's a place where the sky meets home, and tranquility is a way of life.
      </p>
    </div>
  );
};

const SkeletonThree: Component = () => {
  return (
    <div>
      <p
        class={css({
          fontWeight: 'bold',
          fontSize: 'xl',
          color: 'white',
          md: { fontSize: '4xl' },
        })}
      >
        Greens all over
      </p>
      <p class={css({ fontWeight: 'normal', fontSize: 'base', color: 'white' })} />
      <p
        class={css({
          fontWeight: 'normal',
          fontSize: 'base',
          marginY: '16px',
          maxWidth: '512px',
          color: 'neutral.200',
        })}
      >
        A house surrounded by greenery and nature's beauty. It's the perfect place to relax, unwind,
        and enjoy life.
      </p>
    </div>
  );
};

const SkeletonFour: Component = () => {
  return (
    <div>
      <p
        class={css({
          fontWeight: 'bold',
          fontSize: 'xl',
          color: 'white',
          md: { fontSize: '4xl' },
        })}
      >
        Rivers are serene
      </p>
      <p class={css({ fontWeight: 'normal', fontSize: 'base', color: 'white' })} />
      <p
        class={css({
          fontWeight: 'normal',
          fontSize: 'base',
          marginY: '16px',
          maxWidth: '512px',
          color: 'neutral.200',
        })}
      >
        A house by the river is a place of peace and tranquility. It's the perfect place to relax,
        unwind, and enjoy life.
      </p>
    </div>
  );
};

const cards: CardData[] = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: 'md:col-span-2',
    thumbnail:
      'https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: 'col-span-1',
    thumbnail:
      'https://images.unsplash.com/photo-1464457312035-3d7d0e0c058e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: 'col-span-1',
    thumbnail:
      'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: 'md:col-span-2',
    thumbnail:
      'https://images.unsplash.com/photo-1475070929565-c985b496cb9f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

export default LayoutGridDemo;
