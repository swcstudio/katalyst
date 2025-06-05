import { Component, JSX, mergeProps, createSignal, onMount, onCleanup, createEffect, For, Show, createMemo } from 'solid-js';
import { css } from '../../../../../styled-system/css';
import { TestimonialSection } from './TestimonialSection';
import { TestimonialSimple } from './TestimonialSimple';
import { TestimonialHero } from './TestimonialHero';
import { Testimonial } from '../state/useTestimonialSection';

export interface ComprehensiveTestimonialDemoProps {
  className?: string;
  style?: JSX.CSSProperties;
}

export const ComprehensiveTestimonialDemo: Component<ComprehensiveTestimonialDemoProps> = (props) => {
  const merged = mergeProps({}, props);

  // Demo 1: Simple Centered with Radial Background
  const simpleCenteredTestimonial: Testimonial = {
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

  // Demo 2: Grid Layout Testimonial
  const gridTestimonial: Testimonial = {
    id: '2',
    body: 'Commodo amet fugiat excepteur sunt qui ea elit cupidatat ullamco consectetur ipsum elit consequat. Elit sunt proident ea nulla ad nulla dolore ad pariatur tempor non. Sint veniam minim et ea.',
    author: {
      name: 'Judith Black',
      title: 'CEO',
      company: 'Workcation',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=576&h=576&q=80',
    },
    category: 'design'
  };

  // Demo 3: Split Hero Layout
  const splitHeroTestimonial: Testimonial = {
    id: '3',
    body: 'Gravida quam mi erat tortor neque molestie. Auctor aliquet at porttitor a enim nunc suscipit tincidunt nunc. Et non lorem tortor posuere. Nunc eu scelerisque interdum eget tellus non nibh scelerisque bibendum.',
    author: {
      name: 'Judith Black',
      title: 'CEO',
      company: 'Workcation',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=576&h=576&q=80',
      logoUrl: 'https://tailwindcss.com/plus-assets/img/logos/workcation-logo-white.svg'
    },
    category: 'enterprise'
  };

  // Demo 4: Overlay with Background Image
  const overlayTestimonial: Testimonial = {
    id: '4',
    body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis.',
    author: {
      name: 'Judith Black',
      title: 'CEO',
      company: 'Workcation',
      logoUrl: 'https://tailwindcss.com/plus-assets/img/logos/workcation-logo-white.svg'
    },
    category: 'enterprise'
  };

  // Demo 5: Split Side-by-Side Testimonials
  const sideBySideTestimonials: Testimonial[] = [
    {
      id: '1',
      body: 'Amet amet eget scelerisque tellus sit neque faucibus non eleifend. Integer eu praesent at a. Ornare arcu gravida natoque erat et cursus tortor consequat at. Vulputate gravida sociis enim nullam ultricies habitant malesuada lorem ac. Tincidunt urna dui pellentesque sagittis.',
      author: {
        name: 'Judith Black',
        title: 'CEO',
        company: 'Tuple',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        logoUrl: 'https://tailwindcss.com/plus-assets/img/logos/tuple-logo-gray-900.svg'
      },
      category: 'enterprise'
    },
    {
      id: '2',
      body: 'Excepteur veniam labore ullamco eiusmod. Pariatur consequat proident duis dolore nulla veniam reprehenderit nisi officia voluptate incididunt exercitation exercitation elit. Nostrud veniam sint dolor nisi ullamco.',
      author: {
        name: 'Joseph Rodriguez',
        title: 'CEO',
        company: 'Reform',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        logoUrl: 'https://tailwindcss.com/plus-assets/img/logos/reform-logo-gray-900.svg'
      },
      category: 'enterprise'
    }
  ];

  // Demo 6: Dark Side-by-Side
  const darkSideBySideTestimonials: Testimonial[] = [
    {
      id: '1',
      body: 'Amet amet eget scelerisque tellus sit neque faucibus non eleifend. Integer eu praesent at a. Ornare arcu gravida natoque erat et cursus tortor consequat at. Vulputate gravida sociis enim nullam ultricies habitant malesuada lorem ac. Tincidunt urna dui pellentesque sagittis.',
      author: {
        name: 'Judith Black',
        title: 'CEO',
        company: 'Tuple',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        logoUrl: 'https://tailwindcss.com/plus-assets/img/logos/tuple-logo-white.svg'
      },
      category: 'enterprise'
    },
    {
      id: '2',
      body: 'Excepteur veniam labore ullamco eiusmod. Pariatur consequat proident duis dolore nulla veniam reprehenderit nisi officia voluptate incididunt exercitation exercitation elit. Nostrud veniam sint dolor nisi ullamco.',
      author: {
        name: 'Joseph Rodriguez',
        title: 'CEO',
        company: 'Reform',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        logoUrl: 'https://tailwindcss.com/plus-assets/img/logos/reform-logo-white.svg'
      },
      category: 'enterprise'
    }
  ];

  // Demo 7: Star Rating Simple
  const starRatingTestimonial: Testimonial = {
    id: '7',
    body: 'Qui dolor enim consectetur do et non ex amet culpa sint in ea non dolore. Enim minim magna anim id minim eu cillum sunt dolore aliquip. Amet elit laborum culpa irure incididunt adipisicing culpa amet officia exercitation. Eu non aute velit id velit Lorem elit anim pariatur.',
    author: {
      name: 'Judith Black',
      title: 'CEO',
      company: 'Workcation',
      imageUrl: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80'
    },
    rating: 5,
    category: 'enterprise'
  };

  // Demo 8: Featured with Grid
  const featuredTestimonial: Testimonial = {
    id: 'featured',
    body: 'Integer id nunc sit semper purus. Bibendum at lacus ut arcu blandit montes vitae auctor libero. Hac condimentum dignissim nibh vulputate ut nunc. Amet nibh orci mi venenatis blandit vel et proin. Non hendrerit in vel ac diam.',
    author: {
      name: 'Brenna Goyette',
      handle: 'brennagoyette',
      imageUrl: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80',
      logoUrl: 'https://tailwindcss.com/plus-assets/img/logos/savvycal-logo-gray-900.svg',
    },
    featured: true,
    category: 'saas'
  };

  const gridTestimonials: Testimonial[] = [
    featuredTestimonial,
    {
      id: '1',
      body: 'Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.',
      author: {
        name: 'Leslie Alexander',
        handle: 'lesliealexander',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      category: 'startup'
    },
    {
      id: '2',
      body: 'Aut reprehenderit voluptatem eum asperiores beatae id. Iure molestiae ipsam ut officia rem nulla blanditiis.',
      author: {
        name: 'Lindsay Walton',
        handle: 'lindsaywalton',
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      category: 'enterprise'
    },
    {
      id: '3',
      body: 'Voluptas quos itaque ipsam in voluptatem est. Iste eos blanditiis repudiandae. Earum deserunt enim molestiae ipsum perferendis recusandae saepe corrupti.',
      author: {
        name: 'Tom Cook',
        handle: 'tomcook',
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      category: 'agency'
    },
    {
      id: '4',
      body: 'Molestias ea earum quos nostrum doloremque sed. Quaerat quasi aut velit incidunt excepturi rerum voluptatem minus harum.',
      author: {
        name: 'Leonard Krasner',
        handle: 'leonardkrasner',
        imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      category: 'startup'
    }
  ];

  // Demo 9: Masonry Layout
  const masonryTestimonials: Testimonial[] = [
    {
      id: '1',
      body: 'Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.',
      author: {
        name: 'Leslie Alexander',
        handle: 'lesliealexander',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      category: 'startup'
    },
    {
      id: '2',
      body: 'Aut reprehenderit voluptatem eum asperiores beatae id. Iure molestiae ipsam ut officia rem nulla blanditiis. This is a longer testimonial to show the masonry layout working properly with different content lengths.',
      author: {
        name: 'Lindsay Walton',
        handle: 'lindsaywalton',
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      category: 'enterprise'
    },
    {
      id: '3',
      body: 'Short and sweet testimonial.',
      author: {
        name: 'Tom Cook',
        handle: 'tomcook',
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      category: 'agency'
    }
  ];

  // Demo 10: Branded Section
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

  return (
    <div class={css({ minH: 'screen' })} style={merged.style}>
      {/* Header */}
      <div class={css({
        bg: 'gray.900',
        py: '16',
        textAlign: 'center'
      })}>
        <h1 class={css({
          fontSize: '4xl',
          fontWeight: 'bold',
          color: 'white',
          mb: '4'
        })}>
          Comprehensive Testimonial Components
        </h1>
        <p class={css({
          fontSize: 'xl',
          color: 'gray.300',
          maxW: '3xl',
          mx: 'auto'
        })}>
          State-of-the-art testimonial components with native animation augmentations from Aceternity UI & Magic UI, 
          built with SolidJS, Zag.js state machines, and PandaCSS.
        </p>
      </div>

      {/* Demo 1: Simple Centered with Radial Background */}
      <TestimonialSimple
        testimonial={simpleCenteredTestimonial}
        theme="light"
        variant="centered"
        animated={true}
        showRating={true}
        showLogo={true}
        backgroundPattern="radial"
      />

      {/* Demo 2: Grid Layout with Quote SVG */}
      <TestimonialSection
        testimonials={[gridTestimonial]}
        theme="light"
        variant="grid"
        animated={true}
        showRatings={false}
        backgroundPattern="gradient"
      />

      {/* Demo 3: Split Hero Layout */}
      <TestimonialHero
        testimonial={splitHeroTestimonial}
        theme="dark"
        variant="split"
        animated={true}
        showLogo={true}
        heroImage="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80"
      />

      {/* Demo 4: Overlay with Background Image */}
      <TestimonialHero
        testimonial={overlayTestimonial}
        theme="dark"
        variant="overlay"
        animated={true}
        showLogo={true}
        backgroundImage="https://images.unsplash.com/photo-1601381718415-a05fb0a261f3?ixid=MXwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8ODl8fHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1216&q=80"
        overlayOpacity={0.9}
      />

      {/* Demo 5: Side-by-Side Light */}
      <TestimonialSection
        testimonials={sideBySideTestimonials}
        theme="light"
        variant="split"
        layout="split"
        animated={true}
        showRatings={false}
      />

      {/* Demo 6: Side-by-Side Dark */}
      <TestimonialSection
        testimonials={darkSideBySideTestimonials}
        theme="dark"
        variant="split"
        layout="split"
        animated={true}
        showRatings={false}
      />

      {/* Demo 7: Star Rating Simple */}
      <TestimonialSimple
        testimonial={starRatingTestimonial}
        theme="light"
        variant="centered"
        animated={true}
        showRating={true}
        showLogo={false}
        backgroundPattern="dots"
      />

      {/* Demo 8: Featured with Grid */}
      <TestimonialSection
        badge="Testimonials"
        title="We have worked with thousands of amazing people"
        subtitle="See what our customers have to say about their experience"
        testimonials={gridTestimonials}
        theme="light"
        variant="featured"
        animated={true}
        showRatings={false}
        backgroundPattern="gradient"
      />

      {/* Demo 9: Masonry Layout */}
      <TestimonialSection
        badge="Customer Reviews"
        title="We have worked with thousands of amazing people"
        subtitle="Experience the difference with our platform"
        testimonials={masonryTestimonials}
        theme="light"
        variant="masonry"
        layout="masonry"
        animated={true}
        showRatings={false}
        backgroundPattern="dots"
      />

      {/* Demo 10: Branded Section Dark */}
      <TestimonialSection
        testimonials={brandedTestimonials}
        theme="dark"
        variant="branded"
        animated={true}
        showRatings={false}
        backgroundPattern="beams"
      />

      {/* Footer */}
      <div class={css({
        bg: 'gray.50',
        py: '16',
        textAlign: 'center'
      })}>
        <h2 class={css({
          fontSize: '2xl',
          fontWeight: 'bold',
          color: 'gray.900',
          mb: '4'
        })}>
          SolidStack-UI Testimonial Components
        </h2>
        <p class={css({
          fontSize: 'lg',
          color: 'gray.600',
          maxW: '2xl',
          mx: 'auto',
          mb: '8'
        })}>
          Beautifully animated, state-of-the-art testimonial components with native augmentations 
          from Aceternity UI and Magic UI, powered by Zag.js state machines.
        </p>
        <div class={css({
          display: 'flex',
          justifyContent: 'center',
          gap: '4',
          flexWrap: 'wrap'
        })}>
          <span class={css({
            bg: 'indigo.100',
            color: 'indigo.800',
            px: '3',
            py: '1',
            rounded: 'full',
            fontSize: 'sm',
            fontWeight: 'medium'
          })}>
            SolidJS
          </span>
          <span class={css({
            bg: 'purple.100',
            color: 'purple.800',
            px: '3',
            py: '1',
            rounded: 'full',
            fontSize: 'sm',
            fontWeight: 'medium'
          })}>
            Zag.js
          </span>
          <span class={css({
            bg: 'blue.100',
            color: 'blue.800',
            px: '3',
            py: '1',
            rounded: 'full',
            fontSize: 'sm',
            fontWeight: 'medium'
          })}>
            PandaCSS
          </span>
          <span class={css({
            bg: 'green.100',
            color: 'green.800',
            px: '3',
            py: '1',
            rounded: 'full',
            fontSize: 'sm',
            fontWeight: 'medium'
          })}>
            Aceternity UI
          </span>
          <span class={css({
            bg: 'pink.100',
            color: 'pink.800',
            px: '3',
            py: '1',
            rounded: 'full',
            fontSize: 'sm',
            fontWeight: 'medium'
          })}>
            Magic UI
          </span>
        </div>
      </div>
    </div>
  );
};

export type { ComprehensiveTestimonialDemoProps };