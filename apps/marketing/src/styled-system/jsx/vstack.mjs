import { splitProps, mergeProps } from 'solid-js'
import { createComponent } from 'solid-js/web'
import { styled } from './factory.mjs';
import { getVstackStyle } from '../patterns/vstack.mjs';

export function VStack(props) {
  const [patternProps, restProps] = splitProps(props, ["justify", "gap"]);
const styleProps = getVstackStyle(patternProps)
return createComponent(styled.div, mergeProps(styleProps, restProps))
}