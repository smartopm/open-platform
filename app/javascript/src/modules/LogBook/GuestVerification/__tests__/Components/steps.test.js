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
    const handleGotoStep = jest.fn;
    const isGuest = true;
    const guestSteps = steps(
      handleNextMock,
      handleGotoStep,
      communityMock.user.community.name,
      isGuest
    );
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
    const handleGotoStep = jest.fn;
    const guestSteps = steps(
      handleNextMock,
      handleGotoStep,
      communityMock.user.community.name,
      true
    );
    expect(guestSteps).toHaveLength(4);
  });
});
