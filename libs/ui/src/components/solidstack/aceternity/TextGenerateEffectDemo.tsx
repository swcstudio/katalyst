import { Component } from 'solid-js';
import { css } from '@sse/ui/styled-system/css';
import { TextGenerateEffect } from './core/TextGenerateEffect';
import { ScrollReveal, Motion } from './core/motion';

const words = `Oxygen gets you high. In a catastrophic emergency, we're taking giant, panicked breaths. Suddenly you become euphoric, docile. You accept your fate. It's all right here. Emergency water landing, six hundred miles an hour. Blank faces, calm as Hindu cows`;

export const TextGenerateEffectDemo: Component = () => {
  return (
    <ScrollReveal variant="fadeInUp" duration={0.6}>
      <div class={css({
        padding: '8',
        maxWidth: '4xl',
        marginX: 'auto',
      })}>
        <Motion variant="fadeIn" delay={0.2} duration={0.8}>
          <TextGenerateEffect 
            words={words}
            duration={2}
            mode="words"
            staggerDelay={0.08}
          />
        </Motion>
      </div>
    </ScrollReveal>
  );
};

export const TextGenerateEffectDemoWithOptions: Component = () => {
  return (
    <ScrollReveal variant="fadeInUp" duration={0.6}>
      <div class={css({
        padding: '8',
        maxWidth: '4xl',
        marginX: 'auto',
      })}>
        <Motion variant="fadeIn" delay={0.3} duration={0.8}>
          <TextGenerateEffect 
            words={words}
            duration={1.5} 
            filter={false}
            mode="characters"
            staggerDelay={0.02}
          />
        </Motion>
      </div>
    </ScrollReveal>
  );
};

export default TextGenerateEffectDemo;