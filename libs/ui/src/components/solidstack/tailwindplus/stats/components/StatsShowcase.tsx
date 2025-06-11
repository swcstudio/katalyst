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
import { StatsSimple, StatsSimpleDarkDemo, StatsSimpleDemo } from './StatsSimple';
import { StatsTimeline, StatsTimelineDemo, StatsTimelineVerticalDemo } from './StatsTimeline';
import {
  StatsWithHeader,
  StatsWithHeaderBackgroundDemo,
  StatsWithHeaderDemo,
} from './StatsWithHeader';

export interface StatsShowcaseProps {
  className?: string;
  style?: JSX.CSSProperties;
}

export const StatsShowcase: Component<StatsShowcaseProps> = (props) => {
  const merged = mergeProps({}, props);
  const [activeDemo, setActiveDemo] = createSignal('simple-light');
  const [isAnimated, setIsAnimated] = createSignal(true);
  const [countersEnabled, setCountersEnabled] = createSignal(true);

  // Demo data sets
  const basicStats: StatItem[] = [
    {
      id: '1',
      name: 'Transactions every 24 hours',
      value: 44000000,
      suffix: 'M',
      startValue: 0,
      category: 'financial',
      priority: true,
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
      suffix: 'K',
      startValue: 0,
      category: 'growth',
    },
  ];

  const extendedStats: StatItem[] = [
    {
      id: '1',
      name: 'Creators on the platform',
      value: 8000,
      suffix: '+',
      startValue: 0,
      category: 'users',
      description: 'Active content creators',
    },
    {
      id: '2',
      name: 'Flat platform fee',
      value: 3,
      suffix: '%',
      startValue: 0,
      category: 'pricing',
      description: 'Simple, transparent pricing',
    },
    {
      id: '3',
      name: 'Uptime guarantee',
      value: 99.9,
      suffix: '%',
      decimalPlaces: 1,
      startValue: 0,
      category: 'performance',
      description: 'Reliable service guarantee',
    },
    {
      id: '4',
      name: 'Paid out to creators',
      value: 70,
      prefix: '$',
      suffix: 'M',
      startValue: 0,
      category: 'financial',
      description: 'Total creator earnings',
    },
  ];

  const timelineStats: TimelineStatItem[] = [
    {
      id: '1',
      milestone: 'Founded company',
      description:
        'Started with a vision to transform the industry through innovative solutions and cutting-edge technology.',
      date: 'Aug 2021',
      dateTime: '2021-08',
      value: 1,
      category: 'milestone',
    },
    {
      id: '2',
      milestone: 'Secured $65m in funding',
      description:
        'Major Series A funding round from leading venture capital firms to accelerate growth.',
      date: 'Dec 2021',
      dateTime: '2021-12',
      value: 65,
      prefix: '$',
      suffix: 'M',
      startValue: 0,
      category: 'funding',
    },
    {
      id: '3',
      milestone: 'Released beta',
      description:
        'Public beta launch with core features, gaining initial user feedback and market validation.',
      date: 'Feb 2022',
      dateTime: '2022-02',
      value: 1000,
      suffix: ' users',
      startValue: 0,
      category: 'product',
    },
    {
      id: '4',
      milestone: 'Global launch',
      description: 'Full product launch across multiple markets with comprehensive feature set.',
      date: 'Dec 2022',
      dateTime: '2022-12',
      value: 1000000,
      suffix: ' users',
      startValue: 0,
      category: 'growth',
    },
  ];

  const mixedLayoutStats: StatItem[] = [
    {
      id: '1',
      name: 'Users on the platform',
      value: 250000,
      suffix: 'K',
      startValue: 0,
      description: 'Active monthly users',
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
      description: 'Customer revenue milestone',
      category: 'financial',
    },
    {
      id: '3',
      name: 'Transactions this year',
      value: 401093,
      startValue: 0,
      description: 'Processing billions annually',
      category: 'volume',
    },
  ];

  const companyStats: StatItem[] = [
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

  const performanceStats: StatItem[] = [
    {
      id: '1',
      name: 'Transactions every 24 hours',
      value: 44000000,
      suffix: 'M',
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
      suffix: 'K',
      startValue: 0,
      category: 'growth',
    },
  ];

  const demoOptions = [
    { id: 'simple-light', label: 'Simple Light', component: 'simple' },
    { id: 'simple-dark', label: 'Simple Dark', component: 'simple' },
    { id: 'cards-light', label: 'Cards Layout', component: 'header' },
    { id: 'cards-dark', label: 'Cards Dark', component: 'header' },
    { id: 'background', label: 'Background Hero', component: 'header' },
    { id: 'split', label: 'Split Layout', component: 'header' },
    { id: 'timeline-horizontal', label: 'Timeline Horizontal', component: 'timeline' },
    { id: 'timeline-vertical', label: 'Timeline Vertical', component: 'timeline' },
    { id: 'timeline-grid', label: 'Timeline Grid', component: 'timeline' },
    { id: 'mixed-layout', label: 'Mixed Layout', component: 'mixed' },
    { id: 'centered', label: 'Centered Cards', component: 'centered' },
    { id: 'company-info', label: 'Company Info', component: 'company' },
  ];

  const renderDemo = () => {
    const demo = activeDemo();

    switch (demo) {
      case 'simple-light':
        return (
          <StatsSimple
            stats={basicStats}
            theme="light"
            variant="basic"
            animated={isAnimated()}
            countersEnabled={countersEnabled()}
          />
        );

      case 'simple-dark':
        return (
          <StatsSimple
            stats={basicStats}
            theme="dark"
            variant="basic"
            animated={isAnimated()}
            countersEnabled={countersEnabled()}
          />
        );

      case 'cards-light':
        return (
          <StatsWithHeader
            badge="Our track record"
            title="Trusted by creators worldwide"
            subtitle="Lorem ipsum dolor sit amet consect adipisicing possimus."
            stats={extendedStats}
            theme="light"
            variant="cards"
            animated={isAnimated()}
            countersEnabled={countersEnabled()}
          />
        );

      case 'cards-dark':
        return (
          <StatsWithHeader
            badge="Our track record"
            title="Trusted by creators worldwide"
            subtitle="Lorem ipsum dolor sit amet consect adipisicing possimus."
            stats={extendedStats}
            theme="dark"
            variant="cards"
            animated={isAnimated()}
            countersEnabled={countersEnabled()}
          />
        );

      case 'background':
        return (
          <StatsWithHeader
            badge="Our track record"
            title="Trusted by thousands of creators worldwide"
            subtitle="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis."
            stats={extendedStats}
            theme="dark"
            variant="background"
            animated={isAnimated()}
            countersEnabled={countersEnabled()}
            backgroundPattern="gradient"
            backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2850&q=80&blend=111827&blend-mode=multiply&sat=-100&exp=15"
          />
        );

      case 'split':
        return (
          <StatsWithHeader
            badge="Our track record"
            title="Trusted by thousands of creators worldwide"
            subtitle="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque."
            stats={extendedStats.slice(0, 3)}
            theme="light"
            variant="split"
            animated={isAnimated()}
            countersEnabled={countersEnabled()}
          />
        );

      case 'timeline-horizontal':
        return (
          <StatsTimeline
            title="Company Timeline"
            subtitle="Key milestones in our journey to success"
            stats={timelineStats}
            theme="light"
            variant="horizontal"
            animated={isAnimated()}
            countersEnabled={countersEnabled()}
            showConnectors={true}
          />
        );

      case 'timeline-vertical':
        return (
          <StatsTimeline
            badge="Our Journey"
            title="Milestones & Achievements"
            subtitle="Track our progress and key achievements over time"
            stats={timelineStats}
            theme="dark"
            variant="vertical"
            animated={isAnimated()}
            countersEnabled={countersEnabled()}
            showConnectors={true}
            backgroundPattern="gradient"
          />
        );

      case 'timeline-grid':
        return (
          <StatsTimeline
            badge="Growth Story"
            title="Key Milestones"
            subtitle="Our journey from startup to industry leader"
            stats={timelineStats}
            theme="light"
            variant="grid"
            animated={isAnimated()}
            countersEnabled={countersEnabled()}
            showConnectors={false}
          />
        );

      case 'mixed-layout':
        return (
          <StatisticsSection
            title="We approach work as a place to make the world better"
            subtitle="Diam nunc lacus lacus aliquam turpis enim. Eget hac velit est euismod lacus."
            stats={mixedLayoutStats}
            theme="light"
            variant="mixed"
            animated={isAnimated()}
            countersEnabled={countersEnabled()}
            backgroundPattern="none"
          />
        );

      case 'centered':
        return (
          <StatisticsSection
            badge="Statistics"
            title="Trusted by developers from over 80 planets"
            subtitle="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus repellat laudantium."
            stats={[
              { id: '1', name: 'Pepperoni', value: '100%' },
              { id: '2', name: 'Delivery', value: '24/7' },
              { id: '3', name: 'Calories', value: '100k' },
            ]}
            theme="light"
            variant="centered"
            animated={isAnimated()}
            countersEnabled={false}
            backgroundPattern="dots"
          />
        );

      case 'company-info':
        return (
          <StatsWithHeader
            badge="Deploy faster"
            title="A better workflow"
            subtitle="Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim."
            description="Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis odio id et. Id blandit molestie auctor fermentum dignissim."
            stats={companyStats}
            theme="dark"
            variant="background"
            animated={isAnimated()}
            countersEnabled={countersEnabled()}
            backgroundPattern="beams"
          />
        );

      default:
        return (
          <StatsSimple
            stats={basicStats}
            theme="light"
            variant="basic"
            animated={isAnimated()}
            countersEnabled={countersEnabled()}
          />
        );
    }
  };

  return (
    <div class={css({ minH: 'screen' })} style={merged.style}>
      {/* Controls */}
      <div
        class={css({
          position: 'sticky',
          top: '0',
          bg: 'white',
          borderBottom: '1px solid',
          borderColor: 'gray.200',
          px: '6',
          py: '4',
          zIndex: '10',
        })}
      >
        <div
          class={css({
            mx: 'auto',
            maxW: '7xl',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '4',
          })}
        >
          <h1
            class={css({
              fontSize: 'xl',
              fontWeight: 'bold',
              color: 'gray.900',
            })}
          >
            Statistics Components Showcase
          </h1>

          <div
            class={css({
              display: 'flex',
              alignItems: 'center',
              gap: '4',
              flex: '1',
              flexWrap: 'wrap',
            })}
          >
            <select
              value={activeDemo()}
              onChange={(e) => setActiveDemo(e.target.value)}
              class={css({
                rounded: 'md',
                border: '1px solid',
                borderColor: 'gray.300',
                px: '3',
                py: '2',
                fontSize: 'sm',
              })}
            >
              <For each={demoOptions}>
                {(option) => <option value={option.id}>{option.label}</option>}
              </For>
            </select>

            <label
              class={css({
                display: 'flex',
                alignItems: 'center',
                gap: '2',
                fontSize: 'sm',
              })}
            >
              <input
                type="checkbox"
                checked={isAnimated()}
                onChange={(e) => setIsAnimated(e.target.checked)}
                class={css({
                  rounded: 'sm',
                })}
              />
              Animations
            </label>

            <label
              class={css({
                display: 'flex',
                alignItems: 'center',
                gap: '2',
                fontSize: 'sm',
              })}
            >
              <input
                type="checkbox"
                checked={countersEnabled()}
                onChange={(e) => setCountersEnabled(e.target.checked)}
                class={css({
                  rounded: 'sm',
                })}
              />
              Number Counters
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
                _hover: { bg: 'indigo.700' },
              })}
            >
              Reset Animations
            </button>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div class={css({ minH: 'screen' })}>{renderDemo()}</div>

      {/* Info Panel */}
      <div
        class={css({
          bg: 'gray.50',
          py: '12',
          px: '6',
        })}
      >
        <div
          class={css({
            mx: 'auto',
            maxW: '7xl',
          })}
        >
          <h2
            class={css({
              fontSize: '2xl',
              fontWeight: 'bold',
              color: 'gray.900',
              mb: '6',
            })}
          >
            Statistics Components Features
          </h2>

          <div
            class={css({
              display: 'grid',
              gap: '6',
              gridTemplateColumns: '1',
              lg: { gridTemplateColumns: '3' },
            })}
          >
            <div>
              <h3
                class={css({
                  fontSize: 'lg',
                  fontWeight: 'semibold',
                  color: 'gray.900',
                  mb: '2',
                })}
              >
                Animation Augmentations
              </h3>
              <ul
                class={css({
                  fontSize: 'sm',
                  color: 'gray.600',
                  space: 'y-1',
                })}
              >
                <li>• NumberTicker for counting animations</li>
                <li>• BlurFade for progressive reveals</li>
                <li>• BorderBeam for interactive highlights</li>
                <li>• Background patterns and effects</li>
                <li>• Staggered entrance animations</li>
              </ul>
            </div>

            <div>
              <h3
                class={css({
                  fontSize: 'lg',
                  fontWeight: 'semibold',
                  color: 'gray.900',
                  mb: '2',
                })}
              >
                Layout Variants
              </h3>
              <ul
                class={css({
                  fontSize: 'sm',
                  color: 'gray.600',
                  space: 'y-1',
                })}
              >
                <li>• Simple grid layouts</li>
                <li>• Card-based presentations</li>
                <li>• Timeline visualizations</li>
                <li>• Split-screen designs</li>
                <li>• Background hero sections</li>
              </ul>
            </div>

            <div>
              <h3
                class={css({
                  fontSize: 'lg',
                  fontWeight: 'semibold',
                  color: 'gray.900',
                  mb: '2',
                })}
              >
                State Management
              </h3>
              <ul
                class={css({
                  fontSize: 'sm',
                  color: 'gray.600',
                  space: 'y-1',
                })}
              >
                <li>• Zag.js state machines</li>
                <li>• Intersection observer triggers</li>
                <li>• Hover and selection states</li>
                <li>• Animation phase tracking</li>
                <li>• Error handling and recovery</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export type { StatsShowcaseProps };
