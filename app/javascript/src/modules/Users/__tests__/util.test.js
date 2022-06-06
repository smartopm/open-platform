import { selectOptions } from '../utils';
import authState from '../../../__mocks__/authstate';

describe('Test the selectOptions for menus', () => {
  it('shoudl return the expected number of menu items', () => {
    const setSelectKey = 'Contacts';
    const checkModule = jest.fn();
    const checkCommunityFeatures = jest.fn();
    const history = { push: jest.fn() };
    const data = { user: { id: '293492382' } };
    const handleMenuItemClick = jest.fn();
    const handleMergeUserItemClick = jest.fn();
    const checkRole = jest.fn();
    const t = jest.fn();

    const options = selectOptions(
      setSelectKey,
      checkModule,
      checkCommunityFeatures,
      history,
      data,
      authState,
      handleMenuItemClick,
      handleMergeUserItemClick,
      checkRole,
      t
    );

    expect(options).toBeInstanceOf(Array);
    expect(options).toHaveLength(9);
    expect(options[0].key).toBe('user_settings');
    expect(options[0].subMenu).toBeInstanceOf(Array);
    expect(options[0].subMenu).toHaveLength(4);
    expect(options[1].key).toBe('communication');
    expect(options[0].subMenu).toHaveLength(4);
    expect(options[2].key).toBe('payments');
    expect(options[3].key).toBe('plots');
    expect(options[4].key).toBe('lead_management');
    expect(options[5].key).toBe('invitations');
    expect(options[6].key).toBe('notes');
    expect(options[7].key).toBe('forms');
    expect(options[8].key).toBe('customer_journey');
  });
});
