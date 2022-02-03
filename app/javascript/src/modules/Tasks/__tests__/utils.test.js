import { taskTitleContent } from '../utils';

describe('taskTitleContent', () => {
  const formProperty = {
    formProperty: {
      fieldName: 'Project Developer',
      fieldType: 'text',
      fieldValue: null,
      id: '3145c47e-1279-47b0-9dac-dc4a7e30562e',
      groupingId: '3145c47e-1279-47b0-9dac',
      adminUse: false,
      order: '1'
    },
    value: 'Development Co.',
    imageUrl: 'https://image.com',
    fileType: null,
    fileName: 'img.jpg',
    createdAt: "2020-10-07T09:37:03Z",
    user: {
      name: 'John Doe'
    }
  }

  it('renders project name', () => {
    const renderedName = taskTitleContent('DRC Project Review Process', formProperty, undefined);
    expect(renderedName).toEqual('Development Co.');
  });

  it('defaults to task body', () => {
    const renderedName = taskTitleContent('Not DRC', formProperty, undefined);
    expect(renderedName).toEqual('Not DRC');
  })
});
