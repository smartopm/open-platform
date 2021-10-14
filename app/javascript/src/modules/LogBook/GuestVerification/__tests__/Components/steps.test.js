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
    const guestSteps = steps(handleNextMock, communityMock.user.community.name);
    expect(guestSteps).toHaveLength(1);
  });
  it('should only return all the steps for other communities', () => {
    const communityMock = {
      user: {
        community: {
          name: 'CM'
        }
      }
    };
    const handleNextMock = jest.fn();
    const guestSteps = steps(handleNextMock, communityMock.user.community.name);
    expect(guestSteps).toHaveLength(3);
  });
});
