import { splitProps, mergeProps } from 'solid-js'
import { createComponent } from 'solid-js/web'
import { styled } from './factory.mjs';
import { getFlexStyle } from '../patterns/flex.mjs';

export function Flex(props) {
  const [patternProps, restProps] = splitProps(props, ["align", "justify", "direction", "wrap", "basis", "grow", "shrink"]);
const styleProps = getFlexStyle(patternProps)
return createComponent(styled.div, mergeProps(styleProps, restProps))
}