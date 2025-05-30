import { splitProps, mergeProps } from 'solid-js'
import { createComponent } from 'solid-js/web'
import { styled } from './factory.mjs';
import { getDividerStyle } from '../patterns/divider.mjs';

export function Divider(props) {
  const [patternProps, restProps] = splitProps(props, ["orientation", "thickness", "color"]);
const styleProps = getDividerStyle(patternProps)
return createComponent(styled.div, mergeProps(styleProps, restProps))
}