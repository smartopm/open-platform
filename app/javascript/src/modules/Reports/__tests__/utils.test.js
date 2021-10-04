import formatCellData, { countExtraHours, formatShifts, checkExtraShifts } from '../utils';

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
  it('should check for extra shifts', () => {
    const extras = [
      ['2021-08-09T07:50:00.000Z', '2021-08-09T09:00:25.573Z'],
      ['2021-08-09T08:55:00.000Z', '2021-08-09T09:30:25.573Z'],
      ['2021-08-09T09:50:00.000Z', '2021-08-09T10:50:25.573Z'],
      ['2021-08-09T10:48:00.000Z', '2021-08-09T11:50:18.573Z']
    ];
    const xtra = checkExtraShifts(extras)
    expect(xtra).toHaveLength(2)
    expect(xtra).toMatchObject(
      [
        [ '2021-08-09T07:50:00.000Z', '2021-08-09T09:30:25.573Z' ],
        [ '2021-08-09T09:50:00.000Z', '2021-08-09T11:50:18.573Z' ]
      ]
    )
  });
  it('count total numbers of extra hours', () => {
    // countExtraHours
    const otherHoras = [
      ['2021-08-09T07:50:00.000Z', '2021-08-09T09:00:25.573Z'],
      ['2021-08-09T08:55:00.000Z', '2021-08-09T09:30:25.573Z'],
      ['2021-08-09T09:50:00.000Z', '2021-08-09T10:50:25.573Z'],
      ['2021-08-09T10:48:00.000Z', '2021-08-09T11:50:18.573Z']
    ];
    const xtra = checkExtraShifts(otherHoras)
    expect(countExtraHours(xtra)).toBe(4)
  });
  it('should properly format start and exit shifts', () => {
    // formatShifts
    const start = [
      {id: "dae23e16-cd96-405d", value: "2021-08-09T07:50:00.000Z", order: "6", fieldName: "Hora Entrada*",},
      {id: "68c19dcd-4ea5-4a93-82de", value: "2021-08-09T08:55:00.000Z", order: "6", fieldName: "Hora Entrada*"},
      {id: "0fc1b4ce-0955-4ef1-b151", value: "2021-08-09T09:50:00.000Z", order: "6", fieldName: "Hora Entrada*"},
      {id: "0fc1b4ce-0955-4ef1-b4251", value: null, order: "6", fieldName: "Hora Entrada*"},
    ]

    const exit = [
      {id: "dae23e16-cd96-405d", value: "2021-08-09T09:00:25.573Z", order: "6", fieldName: "Hora Salida *",},
      {id: "68c19dcd-4ea5-4a93-82de", value: "2021-08-09T09:30:25.573Z", order: "6", fieldName: "Hora Salida *"},
      {id: "0fc1b4ce-0955-4ef1-51", value: "2021-08-09T10:50:25.573Z", order: "6", fieldName: "Hora Salida *"},
      {id: "0fc1b4ce-0955-4ef1-", value: null, order: "6", fieldName: "Hora Salida *"},
      {id: "0fc1b4ce-0955-4ef1-b151", value: null, order: "6", fieldName: "Hora Salida *"},
    ]
    const formattedShifts = formatShifts(start, exit)
    expect(formattedShifts).toHaveLength(3)
    expect(formattedShifts).toMatchObject([
      ['2021-08-09T07:50:00.000Z', '2021-08-09T09:00:25.573Z'],
      ['2021-08-09T08:55:00.000Z', '2021-08-09T09:30:25.573Z'],
      ['2021-08-09T09:50:00.000Z', '2021-08-09T10:50:25.573Z'],
    ])
  });
});
