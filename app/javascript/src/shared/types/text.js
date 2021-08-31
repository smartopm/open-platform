/* eslint-disable import/prefer-default-export */
import { number, string, oneOfType, object, node } from 'prop-types';

export const textProps = {
  content: oneOfType([string, number, node]),
  otherProps: object
};
