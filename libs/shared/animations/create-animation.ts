import { animeWrapper } from './anime-wrapper.ts';
import type { AnimationConfig } from './types.ts';

export function createAnimation() {
  return {
    animate: (targets: string | Element | Element[] | NodeList, config: AnimationConfig) => {
      return animeWrapper.create({
        ...config,
        targets,
      });
    },
  };
}
