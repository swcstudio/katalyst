import type { AnimeInstance } from 'animejs';
import { createSignal, onCleanup, onMount } from 'solid-js';
import { animeWrapper } from './anime-wrapper';
import type { AnimationConfig, SolidAnimationHook } from './types';

export function useAnimation(
  targetRef: () => Element | undefined,
  config: AnimationConfig
): SolidAnimationHook {
  const [instance, setInstance] = createSignal<AnimeInstance | null>(null);

  onMount(() => {
    const target = targetRef();
    if (target) {
      const animation = animeWrapper.create({
        ...config,
        targets: target,
        autoplay: false,
      });
      setInstance(animation);
    }
  });

  onCleanup(() => {
    const anim = instance();
    if (anim) {
      anim.pause();
    }
  });

  return {
    play: () => instance()?.play(),
    pause: () => instance()?.pause(),
    restart: () => instance()?.restart(),
    reverse: () => instance()?.reverse(),
    seek: (time: number) => instance()?.seek(time),
    get instance() {
      return instance();
    },
  };
}

export function usePresetAnimation(
  targetRef: () => Element | undefined,
  presetName: string
): SolidAnimationHook {
  const preset = animeWrapper.getPreset(presetName);
  if (!preset) {
    throw new Error(`Animation preset "${presetName}" not found`);
  }

  return useAnimation(targetRef, preset.config);
}

export function useTimeline() {
  const [timeline, setTimeline] = createSignal<anime.AnimeTimelineInstance | null>(null);

  onMount(() => {
    const tl = animeWrapper.timeline({ autoplay: false });
    setTimeline(tl);
  });

  return {
    get timeline() {
      return timeline();
    },
    add: (config: AnimationConfig) => {
      const tl = timeline();
      if (tl) {
        tl.add(config);
      }
      return tl;
    },
    play: () => timeline()?.play(),
    pause: () => timeline()?.pause(),
    restart: () => timeline()?.restart(),
    reverse: () => timeline()?.reverse(),
  };
}
