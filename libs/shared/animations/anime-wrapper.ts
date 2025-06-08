import anime, { type AnimeParams, type AnimeInstance } from 'animejs';
import type { AnimationConfig, AnimationPreset } from './types.ts';

export class AnimeWrapper {
  private static instance: AnimeWrapper;
  private animations: Map<string, AnimeInstance> = new Map();

  static getInstance(): AnimeWrapper {
    if (!AnimeWrapper.instance) {
      AnimeWrapper.instance = new AnimeWrapper();
    }
    return AnimeWrapper.instance;
  }

  create(config: AnimationConfig): AnimeInstance {
    return anime(config as AnimeParams);
  }

  createNamed(name: string, config: AnimationConfig): AnimeInstance {
    const animation = this.create(config);
    this.animations.set(name, animation);
    return animation;
  }

  get(name: string): AnimeInstance | undefined {
    return this.animations.get(name);
  }

  remove(name: string): boolean {
    return this.animations.delete(name);
  }

  timeline(config?: Omit<AnimeParams, 'targets'>): anime.AnimeTimelineInstance {
    return anime.timeline(config);
  }

  static presets: AnimationPreset[] = [
    {
      name: 'fadeIn',
      config: {
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutQuad',
      },
      description: 'Smooth fade in animation',
    },
    {
      name: 'slideInUp',
      config: {
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutCubic',
      },
      description: 'Slide in from bottom with fade',
    },
    {
      name: 'scaleIn',
      config: {
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutBack',
      },
      description: 'Scale in with bounce effect',
    },
    {
      name: 'bounceIn',
      config: {
        scale: [0, 1],
        duration: 1000,
        easing: 'easeOutElastic(1, .8)',
      },
      description: 'Elastic bounce in animation',
    },
  ];

  getPreset(name: string): AnimationPreset | undefined {
    return AnimeWrapper.presets.find((preset) => preset.name === name);
  }

  applyPreset(
    name: string,
    targets: string | Element | Element[] | NodeList
  ): AnimeInstance | null {
    const preset = this.getPreset(name);
    if (!preset) return null;

    return this.create({
      ...preset.config,
      targets,
    });
  }
}

export const animeWrapper = AnimeWrapper.getInstance();
