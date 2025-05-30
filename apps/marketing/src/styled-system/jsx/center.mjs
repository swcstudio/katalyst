import { splitProps, mergeProps } from 'solid-js'
import { createComponent } from 'solid-js/web'
import { styled } from './factory.mjs';
import { getCenterStyle } from '../patterns/center.mjs';

export function Center(props) {
  const [patternProps, restProps] = splitProps(props, ["inline"]);
const styleProps = getCenterStyle(patternProps)
return createComponent(styled.div, mergeProps(styleProps, restProps))
}