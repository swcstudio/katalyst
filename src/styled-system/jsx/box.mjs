import { splitProps, mergeProps } from 'solid-js'
import { createComponent } from 'solid-js/web'
import { styled } from './factory.mjs';
import { getBoxStyle } from '../patterns/box.mjs';

export function Box(props) {
  const styleProps = getBoxStyle()
return createComponent(styled.div, mergeProps(styleProps, props))
}