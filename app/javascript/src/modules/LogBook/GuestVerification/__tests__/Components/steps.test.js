import steps from '../../Components';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('steps should return according to the community', () => {
  it('should only return one step for Nkwashi community', () => {
    const communityMock = {
      user: {
        community: {
          name: 'Nkwashi'
        }
      }
    };
    const handleNextMock = jest.fn();
    const guestSteps = steps(handleNextMock, communityMock.user.community);
    expect(guestSteps).toHaveLength(1);
  });
});
