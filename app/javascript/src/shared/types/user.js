import { string, shape } from 'prop-types';

const userProps = shape({
  id: string,
  name: string,
  userType: string,
  state: string
}).isRequired;

export default userProps;
