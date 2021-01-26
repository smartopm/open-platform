/* eslint-disable import/prefer-default-export */
import { number, string, oneOfType, object } from 'prop-types';

export const textProps = {
  content: oneOfType([string, number]).isRequired,
  otherProps: object
};
