import formatCellData from "../utils";


describe('Utils Component', () => {
  it('should format the cell data', () => {
      const translate = jest.fn(() => 'Attachment')
    const data = [
        {
          createdAt: new Date("2021-07-19T10:33:58+02:00"),
          id: "abaea7ab-de4b-4d5e-9187-e465016a666a",
          value: "XJ is my name",
          fieldType: "text"
        },
        {
          createdAt: new Date("2021-07-19T10:33:58+02:00"),
          id: "abaea7ab-de4b-4d5e-9187-e465016a666a",
          value: "XJ is my other name",
          fieldType: "file_upload"
        }
      ]
    expect(formatCellData(data[0], translate)).toBe('XJ is my name')
    expect(formatCellData(data[1], translate)).toBe('Attachment')
  });
});
