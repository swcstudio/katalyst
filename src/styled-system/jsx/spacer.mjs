import { splitProps, mergeProps } from 'solid-js'
import { createComponent } from 'solid-js/web'
import { styled } from './factory.mjs';
import { getSpacerStyle } from '../patterns/spacer.mjs';

export function Spacer(props) {
  const [patternProps, restProps] = splitProps(props, ["size"]);
const styleProps = getSpacerStyle(patternProps)
return createComponent(styled.div, mergeProps(styleProps, restProps))
}