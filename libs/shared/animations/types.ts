import type { AnimeParams, AnimeInstance } from 'animejs';

export interface AnimationConfig extends Omit<AnimeParams, 'targets'> {
  targets?: string | Element | Element[] | NodeList;
}

export interface SolidAnimationHook {
  play: () => void;
  pause: () => void;
  restart: () => void;
  reverse: () => void;
  seek: (time: number) => void;
  instance: AnimeInstance | null;
}

export interface AnimationPreset {
  name: string;
  config: AnimationConfig;
  description?: string;
}
