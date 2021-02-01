import { string, shape } from 'prop-types';
import userProps from './user';

const authStateProps = shape({
  user: userProps,
  token: string
}).isRequired;

export default authStateProps;
