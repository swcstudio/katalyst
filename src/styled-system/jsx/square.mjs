import { splitProps, mergeProps } from 'solid-js'
import { createComponent } from 'solid-js/web'
import { styled } from './factory.mjs';
import { getSquareStyle } from '../patterns/square.mjs';

export function Square(props) {
  const [patternProps, restProps] = splitProps(props, ["size"]);
const styleProps = getSquareStyle(patternProps)
return createComponent(styled.div, mergeProps(styleProps, restProps))
}