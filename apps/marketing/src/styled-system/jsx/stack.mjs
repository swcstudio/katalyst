import { splitProps, mergeProps } from 'solid-js'
import { createComponent } from 'solid-js/web'
import { styled } from './factory.mjs';
import { getStackStyle } from '../patterns/stack.mjs';

export function Stack(props) {
  const [patternProps, restProps] = splitProps(props, ["align", "justify", "direction", "gap"]);
const styleProps = getStackStyle(patternProps)
return createComponent(styled.div, mergeProps(styleProps, restProps))
}