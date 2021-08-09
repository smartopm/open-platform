import formatCellData from '../utils';

// add other utils tests
describe('Utils Component', () => {
  it('should format the cell data', () => {
    const translate = jest.fn(() => 'Attachment');
    const data = [
      {
        createdAt: new Date('2021-07-19T10:33:58+02:00'),
        id: 'abaea7ab-de4b-4d5e-9187-e465016a666a',
        value: 'XJ is my name',
        fieldType: 'text'
      },
      {
        createdAt: new Date('2021-07-19T10:33:58+02:00'),
        id: '4d5e-9187-e465016a666a',
        value: null,
        fieldType: 'date'
      },
      {
        createdAt: new Date('2021-07-19T10:33:58+02:00'),
        id: 'abaea7ab-de4b-4d5e-9187-e465016a666a',
        value: 'XJ is my other name',
        fieldType: 'file_upload'
      },
      {
        createdAt: new Date('2021-07-19T10:33:58+02:00'),
        id: 'abaea7ab-de4b-4d5e-9187-e465016a666a',
        value: '{"checked"=>"Keating Constructions", "label"=>"Name of Company"}',
        fieldType: 'radio'
      }
    ];
    expect(formatCellData(data[0], translate)).toBe('XJ is my name');
    expect(formatCellData(data[2], translate)).toBe('Attachment');
    expect(formatCellData(data[1], translate)).toBe('-');
    expect(formatCellData(data[3], translate)).toBe('Keating Constructions');
  });
});
