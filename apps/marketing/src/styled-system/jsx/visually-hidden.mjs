import { splitProps, mergeProps } from 'solid-js'
import { createComponent } from 'solid-js/web'
import { styled } from './factory.mjs';
import { getVisuallyHiddenStyle } from '../patterns/visually-hidden.mjs';

export function VisuallyHidden(props) {
  const styleProps = getVisuallyHiddenStyle()
return createComponent(styled.div, mergeProps(styleProps, props))
}