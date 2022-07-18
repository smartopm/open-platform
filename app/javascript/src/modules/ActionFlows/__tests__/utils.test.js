import getAssigneeIds from "../utils";

describe('Get Assignee IDs as a string', () => {

  const user = [
    {
      id: 'a54d6184-b10e-4865-bee7-7957701d423d',
      name: 'Another somebody',
    },
    {
      id: 'c90d6184-b10e-4865-bee7-7957701d410e',
      name: 'Registered User',
    }
  ];

  it('returns assignee IDs as a string separated by comma', () => {
    const response = getAssigneeIds(user);
    expect(response).toEqual(
      'a54d6184-b10e-4865-bee7-7957701d423d,c90d6184-b10e-4865-bee7-7957701d410e'
    );
    expect(typeof(response)).toBe('string');
    expect(response).toContain(',');
  })
});