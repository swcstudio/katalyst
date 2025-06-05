import { Component, JSX, mergeProps, createSignal, onMount, onCleanup, createEffect, For, Show, createMemo } from 'solid-js';
import { css } from '../../../../../styled-system/css';
import { TestimonialSection } from './TestimonialSection';
import { TestimonialSimple, TestimonialSimpleDemo, TestimonialSimpleGradientDemo } from './TestimonialSimple';
import { TestimonialHero, TestimonialHeroDemo, TestimonialHeroOverlayDemo } from './TestimonialHero';
import { Testimonial } from '../state/useTestimonialSection';

export interface TestimonialShowcaseProps {
  className?: string;
  style?: JSX.CSSProperties;
}

export const TestimonialShowcase: Component<TestimonialShowcaseProps> = (props) => {
  const merged = mergeProps({}, props);
  const [activeDemo, setActiveDemo] = createSignal('simple-centered');
  const [isAnimated, setIsAnimated] = createSignal(true);
  const [showRatings, setShowRatings] = createSignal(true);
  const [currentTheme, setCurrentTheme] = createSignal<'light' | 'dark'>('light');

  // Demo data sets
  const singleTestimonial: Testimonial = {
    id: '1',
    body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis.',
    author: {
      name: 'Judith Black',
      title: 'CEO',
      company: 'Workcation',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      logoUrl: 'https://tailwindcss.com/plus-assets/img/logos/workcation-logo-indigo-600.svg'
    },
    rating: 5,
    category: 'enterprise'
  };

  const gridTestimonials: Testimonial[] = [
    {
      id: '1',
      body: 'Integer id nunc sit semper purus. Bibendum at lacus ut arcu blandit montes vitae auctor libero. Hac condimentum dignissim nibh vulputate ut nunc.',
      author: {
        name: 'Brenna Goyette',
        handle: 'brennagoyette',
        imageUrl: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80',
        logoUrl: 'https://tailwindcss.com/plus-assets/img/logos/savvycal-logo-gray-900.svg',
      },
      rating: 5,
      featured: true,
      category: 'saas'
    },
    {
      id: '2',
      body: 'Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.',
      author: {
        name: 'Leslie Alexander',
        handle: 'lesliealexander',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      rating: 5,
      category: 'startup'
    },
    {
      id: '3',
      body: 'Aut reprehenderit voluptatem eum asperiores beatae id. Iure molestiae ipsam ut officia rem nulla blanditiis.',
      author: {
        name: 'Lindsay Walton',
        handle: 'lindsaywalton',
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      rating: 4,
      category: 'enterprise'
    },
    {
      id: '4',
      body: 'Voluptas quos itaque ipsam in voluptatem est. Iste eos blanditiis repudiandae. Earum deserunt enim molestiae ipsum perferendis.',
      author: {
        name: 'Tom Cook',
        handle: 'tomcook',
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      rating: 5,
      category: 'agency'
    },
    {
      id: '5',
      body: 'Molestias ea earum quos nostrum doloremque sed. Quaerat quasi aut velit incidunt excepturi rerum voluptatem minus harum.',
      author: {
        name: 'Leonard Krasner',
        handle: 'leonardkrasner',
        imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      rating: 4,
      category: 'startup'
    }
  ];

  const splitTestimonials: Testimonial[] = [
    {
      id: '1',
      body: 'Amet amet eget scelerisque tellus sit neque faucibus non eleifend. Integer eu praesent at a. Ornare arcu gravida natoque erat et cursus tortor consequat at.',
      author: {
        name: 'Judith Black',
        title: 'CEO',
        company: 'Tuple',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      category: 'enterprise'
    },
    {
      id: '2',
      body: 'Excepteur veniam labore ullamco eiusmod. Pariatur consequat proident duis dolore nulla veniam reprehenderit nisi officia voluptate incididunt.',
      author: {
        name: 'Joseph Rodriguez',
        title: 'CEO',
        company: 'Reform',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      category: 'enterprise'
    }
  ];

  const brandedTestimonials: Testimonial[] = [
    {
      id: '1',
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis.',
      author: {
        name: 'Judith Black',
        title: 'CEO',
        company: 'Tuple',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        logoUrl: 'https://tailwindcss.com/plus-assets/img/logos/tuple-logo-indigo-300.svg'
      },
      category: 'enterprise'
    },
    {
      id: '2',
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis. Nemo expedita voluptas culpa sapiente alias molestiae.',
      author: {
        name: 'Joseph Rodriguez',
        title: 'CEO',
        company: 'Workcation',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        logoUrl: 'https://tailwindcss.com/plus-assets/img/logos/workcation-logo-indigo-300.svg'
      },
      category: 'enterprise'
    }
  ];

  const demoOptions = [
    { id: 'simple-centered', label: 'Simple Centered', component: 'simple' },
    { id: 'simple-gradient', label: 'Simple with Gradient', component: 'simple' },
    { id: 'hero-split', label: 'Hero Split Layout', component: 'hero' },
    { id: 'hero-overlay', label: 'Hero with Overlay', component: 'hero' },
    { id: 'grid-featured', label: 'Grid with Featured', component: 'grid' },
    { id: 'grid-masonry', label: 'Masonry Layout', component: 'grid' },
    { id: 'split-testimonials', label: 'Split Testimonials', component: 'split' },
    { id: 'branded-section', label: 'Branded Section', component: 'branded' },
    { id: 'carousel-auto', label: 'Carousel Autoplay', component: 'carousel' },
    { id: 'minimal-rating', label: 'Minimal with Rating', component: 'minimal' }
  ];

  const renderDemo = () => {
    const demo = activeDemo();
    
    switch (demo) {
      case 'simple-centered':
        return (
          <TestimonialSimple
            testimonial={singleTestimonial}
            theme={currentTheme()}
            variant="centered"
            animated={isAnimated()}
            showRating={showRatings()}
            showLogo={true}
            backgroundPattern="radial"
          />
        );

      case 'simple-gradient':
        return (
          <TestimonialSimple
            testimonial={{
              ...singleTestimonial,
              body: 'Qui dolor enim consectetur do et non ex amet culpa sint in ea non dolore. Enim minim magna anim id minim eu cillum sunt dolore aliquip. Amet elit laborum culpa irure incididunt adipisicing culpa amet officia exercitation.'
            }}
            theme={currentTheme()}
            variant="gradient"
            animated={isAnimated()}
            showRating={showRatings()}
            showLogo={false}
            backgroundPattern="none"
          />
        );

      case 'hero-split':
        return (
          <TestimonialHero
            testimonial={{
              ...singleTestimonial,
              body: 'Gravida quam mi erat tortor neque molestie. Auctor aliquet at porttitor a enim nunc suscipit tincidunt nunc. Et non lorem tortor posuere. Nunc eu scelerisque interdum eget tellus non nibh scelerisque bibendum.'
            }}
            theme="dark"
            variant="split"
            animated={isAnimated()}
            showLogo={true}
            heroImage="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80"
          />
        );

      case 'hero-overlay':
        return (
          <TestimonialHero
            testimonial={singleTestimonial}
            theme="dark"
            variant="overlay"
            animated={isAnimated()}
            showLogo={true}
            backgroundImage="https://images.unsplash.com/photo-1601381718415-a05fb0a261f3?ixid=MXwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8ODl8fHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1216&q=80"
            overlayOpacity={0.9}
          />
        );

      case 'grid-featured':
        return (
          <TestimonialSection
            badge="Testimonials"
            title="We have worked with thousands of amazing people"
            subtitle="Hear what our customers have to say about their experience"
            testimonials={gridTestimonials}
            theme={currentTheme()}
            variant="featured"
            animated={isAnimated()}
            showRatings={showRatings()}
            backgroundPattern="gradient"
          />
        );

      case 'grid-masonry':
        return (
          <TestimonialSection
            badge="Customer Reviews"
            title="Loved by teams worldwide"
            subtitle="See why thousands of companies trust our platform"
            testimonials={gridTestimonials}
            theme={currentTheme()}
            variant="masonry"
            layout="masonry"
            animated={isAnimated()}
            showRatings={showRatings()}
            backgroundPattern="dots"
          />
        );

      case 'split-testimonials':
        return (
          <TestimonialSection
            testimonials={splitTestimonials}
            theme={currentTheme()}
            variant="split"
            layout="split"
            animated={isAnimated()}
            showRatings={false}
          />
        );

      case 'branded-section':
        return (
          <TestimonialSection
            testimonials={brandedTestimonials}
            theme="dark"
            variant="branded"
            animated={isAnimated()}
            showRatings={false}
            backgroundPattern="beams"
          />
        );

      case 'carousel-auto':
        return (
          <TestimonialSection
            badge="Success Stories"
            title="What our customers are saying"
            subtitle="Join thousands of satisfied customers"
            testimonials={gridTestimonials}
            theme={currentTheme()}
            variant="carousel"
            layout="carousel"
            animated={isAnimated()}
            showRatings={showRatings()}
            autoplay={true}
            backgroundPattern="gradient"
          />
        );

      case 'minimal-rating':
        return (
          <TestimonialSimple
            testimonial={{
              ...singleTestimonial,
              body: 'Qui dolor enim consectetur do et non ex amet culpa sint in ea non dolore. Enim minim magna anim id minim eu cillum sunt dolore aliquip.'
            }}
            theme={currentTheme()}
            variant="minimal"
            animated={isAnimated()}
            showRating={showRatings()}
            showLogo={false}
            backgroundPattern="dots"
          />
        );

      default:
        return (
          <TestimonialSimple
            testimonial={singleTestimonial}
            theme={currentTheme()}
            variant="centered"
            animated={isAnimated()}
            showRating={showRatings()}
          />
        );
    }
  };

  return (
    <div class={css({ minH: 'screen' })} style={merged.style}>
      {/* Controls */}
      <div class={css({
        position: 'sticky',
        top: '0',
        bg: 'white',
        borderBottom: '1px solid',
        borderColor: 'gray.200',
        px: '6',
        py: '4',
        zIndex: '10'
      })}>
        <div class={css({
          mx: 'auto',
          maxW: '7xl',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '4'
        })}>
          <h1 class={css({
            fontSize: 'xl',
            fontWeight: 'bold',
            color: 'gray.900'
          })}>
            Testimonial Components Showcase
          </h1>
          
          <div class={css({
            display: 'flex',
            alignItems: 'center',
            gap: '4',
            flex: '1',
            flexWrap: 'wrap'
          })}>
            <select
              value={activeDemo()}
              onChange={(e) => setActiveDemo(e.target.value)}
              class={css({
                rounded: 'md',
                border: '1px solid',
                borderColor: 'gray.300',
                px: '3',
                py: '2',
                fontSize: 'sm'
              })}
            >
              <For each={demoOptions}>
                {(option) => (
                  <option value={option.id}>{option.label}</option>
                )}
              </For>
            </select>

            <select
              value={currentTheme()}
              onChange={(e) => setCurrentTheme(e.target.value as 'light' | 'dark')}
              class={css({
                rounded: 'md',
                border: '1px solid',
                borderColor: 'gray.300',
                px: '3',
                py: '2',
                fontSize: 'sm'
              })}
            >
              <option value="light">Light Theme</option>
              <option value="dark">Dark Theme</option>
            </select>

            <label class={css({
              display: 'flex',
              alignItems: 'center',
              gap: '2',
              fontSize: 'sm'
            })}>
              <input
                type="checkbox"
                checked={isAnimated()}
                onChange={(e) => setIsAnimated(e.target.checked)}
                class={css({
                  rounded: 'sm'
                })}
              />
              Animations
            </label>

            <label class={css({
              display: 'flex',
              alignItems: 'center',
              gap: '2',
              fontSize: 'sm'
            })}>
              <input
                type="checkbox"
                checked={showRatings()}
                onChange={(e) => setShowRatings(e.target.checked)}
                class={css({
                  rounded: 'sm'
                })}
              />
              Show Ratings
            </label>

            <button
              onClick={() => window.location.reload()}
              class={css({
                bg: 'indigo.600',
                color: 'white',
                px: '3',
                py: '2',
                rounded: 'md',
                fontSize: 'sm',
                _hover: { bg: 'indigo.700' }
              })}
            >
              Reset Animations
            </button>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div class={css({ minH: 'screen' })}>
        {renderDemo()}
      </div>

      {/* Info Panel */}
      <div class={css({
        bg: 'gray.50',
        py: '12',
        px: '6'
      })}>
        <div class={css({
          mx: 'auto',
          maxW: '7xl'
        })}>
          <h2 class={css({
            fontSize: '2xl',
            fontWeight: 'bold',
            color: 'gray.900',
            mb: '6'
          })}>
            Testimonial Components Features
          </h2>
          
          <div class={css({
            display: 'grid',
            gap: '6',
            gridTemplateColumns: '1',
            lg: { gridTemplateColumns: '3' }
          })}>
            <div>
              <h3 class={css({
                fontSize: 'lg',
                fontWeight: 'semibold',
                color: 'gray.900',
                mb: '2'
              })}>
                Animation Augmentations
              </h3>
              <ul class={css({
                fontSize: 'sm',
                color: 'gray.600',
                space: 'y-1'
              })}>
                <li>• TextAnimate for smooth quote reveals</li>
                <li>• BlurFade for progressive element reveals</li>
                <li>• BorderBeam for interactive card highlights</li>
                <li>• BackgroundBeams for dynamic backgrounds</li>
                <li>• Star rating animations with stagger</li>
              </ul>
            </div>

            <div>
              <h3 class={css({
                fontSize: 'lg',
                fontWeight: 'semibold',
                color: 'gray.900',
                mb: '2'
              })}>
                Layout Variants
              </h3>
              <ul class={css({
                fontSize: 'sm',
                color: 'gray.600',
                space: 'y-1'
              })}>
                <li>• Simple centered layouts</li>
                <li>• Hero split and overlay designs</li>
                <li>• Grid and masonry presentations</li>
                <li>• Carousel with autoplay</li>
                <li>• Branded company sections</li>
              </ul>
            </div>

            <div>
              <h3 class={css({
                fontSize: 'lg',
                fontWeight: 'semibold',
                color: 'gray.900',
                mb: '2'
              })}>
                State Management
              </h3>
              <ul class={css({
                fontSize: 'sm',
                color: 'gray.600',
                space: 'y-1'
              })}>
                <li>• Zag.js state machines</li>
                <li>• Intersection observer triggers</li>
                <li>• Hover and selection states</li>
                <li>• Theme switching support</li>
                <li>• Carousel navigation controls</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export type { TestimonialShowcaseProps };