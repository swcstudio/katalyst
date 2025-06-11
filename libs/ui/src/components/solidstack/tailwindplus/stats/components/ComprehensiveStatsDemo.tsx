import {
  type Component,
  For,
  type JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
} from 'solid-js';
import { css } from '../../../../../styled-system/css';
import type { StatItem, TimelineStatItem } from '../state/useStatsSection';
import { StatisticsSection } from './StatisticsSection';
import { StatsSimple } from './StatsSimple';
import { StatsTimeline } from './StatsTimeline';
import { StatsWithHeader } from './StatsWithHeader';

export interface ComprehensiveStatsDemoProps {
  className?: string;
  style?: JSX.CSSProperties;
}

export const ComprehensiveStatsDemo: Component<ComprehensiveStatsDemoProps> = (props) => {
  const merged = mergeProps({}, props);

  // Demo 1: Simple Light Theme Stats
  const simpleStatsLight: StatItem[] = [
    {
      id: '1',
      name: 'Transactions every 24 hours',
      value: '44 million',
    },
    {
      id: '2',
      name: 'Assets under holding',
      value: '$119 trillion',
    },
    {
      id: '3',
      name: 'New users annually',
      value: '46,000',
    },
  ];

  // Demo 2: Simple Dark Theme Stats
  const simpleStatsDark: StatItem[] = [
    {
      id: '1',
      name: 'Transactions every 24 hours',
      value: '44 million',
    },
    {
      id: '2',
      name: 'Assets under holding',
      value: '$119 trillion',
    },
    {
      id: '3',
      name: 'New users annually',
      value: '46,000',
    },
  ];

  // Demo 3: Cards Layout with Header (Light)
  const cardsStatsLight: StatItem[] = [
    {
      id: '1',
      name: 'Creators on the platform',
      value: 8000,
      suffix: '+',
      startValue: 0,
      category: 'users',
    },
    {
      id: '2',
      name: 'Flat platform fee',
      value: 3,
      suffix: '%',
      startValue: 0,
      category: 'pricing',
    },
    {
      id: '3',
      name: 'Uptime guarantee',
      value: 99.9,
      suffix: '%',
      decimalPlaces: 1,
      startValue: 0,
      category: 'performance',
    },
    {
      id: '4',
      name: 'Paid out to creators',
      value: 70,
      prefix: '$',
      suffix: 'M',
      startValue: 0,
      category: 'financial',
    },
  ];

  // Demo 4: Cards Layout with Header (Dark)
  const cardsStatsDark: StatItem[] = [
    {
      id: '1',
      name: 'Creators on the platform',
      value: 8000,
      suffix: '+',
      startValue: 0,
      category: 'users',
    },
    {
      id: '2',
      name: 'Flat platform fee',
      value: 3,
      suffix: '%',
      startValue: 0,
      category: 'pricing',
    },
    {
      id: '3',
      name: 'Uptime guarantee',
      value: 99.9,
      suffix: '%',
      decimalPlaces: 1,
      startValue: 0,
      category: 'performance',
    },
    {
      id: '4',
      name: 'Paid out to creators',
      value: 70,
      prefix: '$',
      suffix: 'M',
      startValue: 0,
      category: 'financial',
    },
  ];

  // Demo 5: Background Hero with Gradient
  const backgroundHeroStats: StatItem[] = [
    {
      id: '1',
      name: 'Creators on the platform',
      value: 8000,
      suffix: '+',
      startValue: 0,
      category: 'users',
    },
    {
      id: '2',
      name: 'Flat platform fee',
      value: 3,
      suffix: '%',
      startValue: 0,
      category: 'pricing',
    },
    {
      id: '3',
      name: 'Uptime guarantee',
      value: 99.9,
      suffix: '%',
      decimalPlaces: 1,
      startValue: 0,
      category: 'performance',
    },
    {
      id: '4',
      name: 'Paid out to creators',
      value: 70,
      prefix: '$',
      suffix: 'M',
      startValue: 0,
      category: 'financial',
    },
  ];

  // Demo 6: Split Layout with Image
  const splitLayoutStats: StatItem[] = [
    {
      id: '1',
      name: 'Creators on the platform',
      value: 8000,
      suffix: '+',
      startValue: 0,
      category: 'users',
    },
    {
      id: '2',
      name: 'Flat platform fee',
      value: 3,
      suffix: '%',
      startValue: 0,
      category: 'pricing',
    },
    {
      id: '3',
      name: 'Uptime guarantee',
      value: 99.9,
      suffix: '%',
      decimalPlaces: 1,
      startValue: 0,
      category: 'performance',
    },
    {
      id: '4',
      name: 'Paid out to creators',
      value: 70,
      prefix: '$',
      suffix: 'M',
      startValue: 0,
      category: 'financial',
    },
  ];

  // Demo 7: Timeline Layout
  const timelineStats: TimelineStatItem[] = [
    {
      id: '1',
      milestone: 'Founded company',
      description:
        'Nihil aut nam. Dignissimos a pariatur et quos omnis. Aspernatur asperiores et dolorem dolorem optio voluptate repudiandae.',
      date: 'Aug 2021',
      dateTime: '2021-08',
      value: 1,
      category: 'milestone',
    },
    {
      id: '2',
      milestone: 'Secured $65m in funding',
      description:
        'Provident quia ut esse. Vero vel eos repudiandae aspernatur. Cumque minima impedit sapiente a architecto nihil.',
      date: 'Dec 2021',
      dateTime: '2021-12',
      value: 65,
      prefix: '$',
      suffix: 'm',
      startValue: 0,
      category: 'funding',
    },
    {
      id: '3',
      milestone: 'Released beta',
      description:
        'Sunt perspiciatis incidunt. Non necessitatibus aliquid. Consequatur ut officiis earum eum quia facilis. Hic deleniti dolorem quia et.',
      date: 'Feb 2022',
      dateTime: '2022-02',
      value: 1000,
      suffix: ' users',
      startValue: 0,
      category: 'product',
    },
    {
      id: '4',
      milestone: 'Global launch of product',
      description:
        'Ut ipsa sint distinctio quod itaque nam qui. Possimus aut unde id architecto voluptatem hic aut pariatur velit.',
      date: 'Dec 2022',
      dateTime: '2022-12',
      value: 1000000,
      suffix: ' users',
      startValue: 0,
      category: 'growth',
    },
  ];

  // Demo 8: Mixed Layout Stats
  const mixedLayoutStats: StatItem[] = [
    {
      id: '1',
      name: 'Users on the platform',
      value: 250000,
      suffix: 'k',
      startValue: 0,
      description: 'Vel labore deleniti veniam consequuntur sunt nobis.',
      category: 'growth',
    },
    {
      id: '2',
      name: 'Total revenue generated',
      value: 8.9,
      prefix: '$',
      suffix: ' billion',
      decimalPlaces: 1,
      startValue: 0,
      description: "We're proud that our customers have made over $8 billion in total revenue.",
      category: 'financial',
    },
    {
      id: '3',
      name: 'Transactions this year',
      value: 401093,
      startValue: 0,
      description:
        'Eu duis porta aliquam ornare. Elementum eget magna egestas. Eu duis porta aliquam ornare.',
      category: 'volume',
    },
  ];

  // Demo 9: Company Info Stats (Dark Theme)
  const companyInfoStats: StatItem[] = [
    {
      id: '1',
      name: 'Founded',
      value: '2021',
      category: 'info',
    },
    {
      id: '2',
      name: 'Employees',
      value: 37,
      startValue: 0,
      category: 'team',
    },
    {
      id: '3',
      name: 'Countries',
      value: 12,
      startValue: 0,
      category: 'global',
    },
    {
      id: '4',
      name: 'Raised',
      value: 25,
      prefix: '$',
      suffix: 'M',
      startValue: 0,
      category: 'funding',
    },
  ];

  // Demo 10: Mission Stats (Light Theme)
  const missionStats: StatItem[] = [
    {
      id: '1',
      name: 'Transactions every 24 hours',
      value: 44000000,
      suffix: ' million',
      startValue: 0,
      category: 'performance',
    },
    {
      id: '2',
      name: 'Assets under holding',
      value: 119,
      prefix: '$',
      suffix: ' trillion',
      startValue: 0,
      category: 'financial',
    },
    {
      id: '3',
      name: 'New users annually',
      value: 46000,
      suffix: ',000',
      startValue: 0,
      category: 'growth',
    },
  ];

  // Demo 11: Centered Card Stats
  const centeredStats: StatItem[] = [
    {
      id: '1',
      name: 'Pepperoni',
      value: '100%',
    },
    {
      id: '2',
      name: 'Delivery',
      value: '24/7',
    },
    {
      id: '3',
      name: 'Calories',
      value: '100k',
    },
  ];

  // Demo 12: Dark Centered Stats
  const darkCenteredStats: StatItem[] = [
    {
      id: '1',
      name: 'Pepperoni',
      value: '100%',
    },
    {
      id: '2',
      name: 'Delivery',
      value: '24/7',
    },
    {
      id: '3',
      name: 'Calories',
      value: '100k+',
    },
  ];

  // Demo 13: Hero with Image Stats
  const heroImageStats: StatItem[] = [
    {
      id: '1',
      name: 'Delivery',
      value: '24/7',
    },
    {
      id: '2',
      name: 'Pepperoni',
      value: '99.9%',
    },
    {
      id: '3',
      name: 'Calories',
      value: '100k+',
    },
  ];

  // Demo 14: Complex Background Stats
  const complexBackgroundStats: StatItem[] = [
    {
      id: '1',
      name: 'Companies',
      value: 8000,
      suffix: 'K+',
      startValue: 0,
      description: 'use laoreet amet lacus nibh integer quis.',
      category: 'business',
    },
    {
      id: '2',
      name: 'Countries around the globe',
      value: 25000,
      suffix: 'K+',
      startValue: 0,
      description: 'lacus nibh integer quis.',
      category: 'global',
    },
    {
      id: '3',
      name: 'Customer satisfaction',
      value: 98,
      suffix: '%',
      startValue: 0,
      description: 'laoreet amet lacus nibh integer quis.',
      category: 'satisfaction',
    },
    {
      id: '4',
      name: 'Issues resolved',
      value: 12000000,
      suffix: 'M+',
      startValue: 0,
      description: 'lacus nibh integer quis.',
      category: 'support',
    },
  ];

  return (
    <div class={css({ minH: 'screen' })} style={merged.style}>
      {/* Header */}
      <div
        class={css({
          bg: 'gray.900',
          py: '16',
          textAlign: 'center',
        })}
      >
        <h1
          class={css({
            fontSize: '4xl',
            fontWeight: 'bold',
            color: 'white',
            mb: '4',
          })}
        >
          Comprehensive Statistics Components
        </h1>
        <p
          class={css({
            fontSize: 'xl',
            color: 'gray.300',
            maxW: '3xl',
            mx: 'auto',
          })}
        >
          State-of-the-art statistics components with native animation augmentations from Aceternity
          UI & Magic UI, built with SolidJS, Zag.js state machines, and PandaCSS.
        </p>
      </div>

      {/* Demo 1: Simple Light Theme */}
      <StatsSimple
        stats={simpleStatsLight}
        theme="light"
        variant="basic"
        animated={true}
        countersEnabled={false}
      />

      {/* Demo 2: Simple Dark Theme */}
      <StatsSimple
        stats={simpleStatsDark}
        theme="dark"
        variant="basic"
        animated={true}
        countersEnabled={false}
      />

      {/* Demo 3: Cards Layout Light */}
      <StatsWithHeader
        badge="Our track record"
        title="Trusted by creators worldwide"
        subtitle="Lorem ipsum dolor sit amet consect adipisicing possimus."
        stats={cardsStatsLight}
        theme="light"
        variant="cards"
        animated={true}
        countersEnabled={true}
      />

      {/* Demo 4: Cards Layout Dark */}
      <StatsWithHeader
        badge="Our track record"
        title="Trusted by creators worldwide"
        subtitle="Lorem ipsum dolor sit amet consect adipisicing possimus."
        stats={cardsStatsDark}
        theme="dark"
        variant="cards"
        animated={true}
        countersEnabled={true}
      />

      {/* Demo 5: Background Hero with Gradient */}
      <StatsWithHeader
        badge="Our track record"
        title="Trusted by thousands of creators worldwide"
        subtitle="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis."
        stats={backgroundHeroStats}
        theme="dark"
        variant="background"
        animated={true}
        countersEnabled={true}
        backgroundPattern="gradient"
        backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2850&q=80&blend=111827&blend-mode=multiply&sat=-100&exp=15"
      />

      {/* Demo 6: Split Layout */}
      <StatsWithHeader
        badge="Our track record"
        title="Trusted by thousands of creators worldwide"
        subtitle="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione."
        stats={splitLayoutStats}
        theme="light"
        variant="split"
        animated={true}
        countersEnabled={true}
      />

      {/* Demo 7: Timeline Horizontal */}
      <StatsTimeline
        title="Company Timeline"
        subtitle="Key milestones and achievements in our journey"
        stats={timelineStats}
        theme="light"
        variant="horizontal"
        animated={true}
        countersEnabled={true}
        showConnectors={true}
      />

      {/* Demo 8: Mixed Layout */}
      <StatisticsSection
        title="We approach work as a place to make the world better"
        subtitle="Diam nunc lacus lacus aliquam turpis enim. Eget hac velit est euismod lacus. Est non placerat nam arcu. Cras purus nibh cursus sit eu in id. Integer vel nibh."
        stats={mixedLayoutStats}
        theme="light"
        variant="mixed"
        animated={true}
        countersEnabled={true}
      />

      {/* Demo 9: Company Info Dark */}
      <StatsWithHeader
        badge="Deploy faster"
        title="A better workflow"
        subtitle="Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet vitae sed turpis id."
        description="Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis odio id et. Id blandit molestie auctor fermentum dignissim. Lacus diam tincidunt ac cursus in vel. Mauris varius vulputate et ultrices hac adipiscing egestas. Iaculis convallis ac tempor et ut. Ac lorem vel integer orci."
        stats={companyInfoStats}
        theme="dark"
        variant="background"
        animated={true}
        countersEnabled={true}
        backgroundPattern="beams"
      />

      {/* Demo 10: Mission Stats */}
      <StatisticsSection
        title="Our mission"
        subtitle="Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At arcu, sit dui mi, nibh dui, diam eget aliquam. Quisque id at vitae feugiat egestas ac."
        stats={missionStats}
        theme="light"
        variant="split"
        layout="list"
        animated={true}
        countersEnabled={true}
      />

      {/* Demo 11: Centered Light Card */}
      <StatisticsSection
        badge="Statistics"
        title="Trusted by developers from over 80 planets"
        subtitle="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus repellat laudantium."
        stats={centeredStats}
        theme="light"
        variant="centered"
        animated={true}
        countersEnabled={false}
        backgroundPattern="dots"
      />

      {/* Demo 12: Centered Dark */}
      <StatisticsSection
        badge="Statistics"
        title="Trusted by developers from over 80 planets"
        subtitle="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus repellat laudantium."
        stats={darkCenteredStats}
        theme="dark"
        variant="centered"
        animated={true}
        countersEnabled={false}
        backgroundPattern="gradient"
      />

      {/* Demo 13: Hero with Image */}
      <StatsWithHeader
        badge="Support"
        title="Deliver what your customers want every time"
        subtitle="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolore nihil ea rerum ipsa. Nostrum consectetur sequi culpa doloribus omnis, molestiae esse placeat."
        stats={heroImageStats}
        theme="light"
        variant="split"
        animated={true}
        countersEnabled={false}
      />

      {/* Demo 14: Complex Background with Metrics */}
      <StatsWithHeader
        badge="Valuable Metrics"
        title="Get actionable data that will help grow your business"
        subtitle="Rhoncus sagittis risus arcu erat lectus bibendum. Ut in adipiscing quis in viverra tristique sem. Ornare feugiat viverra eleifend fusce orci in quis amet."
        stats={complexBackgroundStats}
        theme="dark"
        variant="background"
        animated={true}
        countersEnabled={true}
        backgroundPattern="gradient"
        backgroundImage="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2830&q=80&sat=-100"
      />

      {/* Footer */}
      <div
        class={css({
          bg: 'gray.50',
          py: '16',
          textAlign: 'center',
        })}
      >
        <h2
          class={css({
            fontSize: '2xl',
            fontWeight: 'bold',
            color: 'gray.900',
            mb: '4',
          })}
        >
          SolidStack-UI Statistics Components
        </h2>
        <p
          class={css({
            fontSize: 'lg',
            color: 'gray.600',
            maxW: '2xl',
            mx: 'auto',
            mb: '8',
          })}
        >
          Beautifully animated, state-of-the-art statistics components with native augmentations
          from Aceternity UI and Magic UI, powered by Zag.js state machines.
        </p>
        <div
          class={css({
            display: 'flex',
            justifyContent: 'center',
            gap: '4',
            flexWrap: 'wrap',
          })}
        >
          <span
            class={css({
              bg: 'indigo.100',
              color: 'indigo.800',
              px: '3',
              py: '1',
              rounded: 'full',
              fontSize: 'sm',
              fontWeight: 'medium',
            })}
          >
            SolidJS
          </span>
          <span
            class={css({
              bg: 'purple.100',
              color: 'purple.800',
              px: '3',
              py: '1',
              rounded: 'full',
              fontSize: 'sm',
              fontWeight: 'medium',
            })}
          >
            Zag.js
          </span>
          <span
            class={css({
              bg: 'blue.100',
              color: 'blue.800',
              px: '3',
              py: '1',
              rounded: 'full',
              fontSize: 'sm',
              fontWeight: 'medium',
            })}
          >
            PandaCSS
          </span>
          <span
            class={css({
              bg: 'green.100',
              color: 'green.800',
              px: '3',
              py: '1',
              rounded: 'full',
              fontSize: 'sm',
              fontWeight: 'medium',
            })}
          >
            Aceternity UI
          </span>
          <span
            class={css({
              bg: 'pink.100',
              color: 'pink.800',
              px: '3',
              py: '1',
              rounded: 'full',
              fontSize: 'sm',
              fontWeight: 'medium',
            })}
          >
            Magic UI
          </span>
        </div>
      </div>
    </div>
  );
};

export type { ComprehensiveStatsDemoProps };
