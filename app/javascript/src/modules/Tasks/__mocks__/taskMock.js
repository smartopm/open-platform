export default {
  body: 'Task example',
  id: '23',
  createdAt: new Date('2020-08-01'),
  dueDate:  new Date('2020-08-01').toString(),
  author: {
    name: 'Johnsc',
    id: '23453435',
    imageUrl: '',
    avatarUrl: ''
  },
  user: {
    name: 'somebody'
  },
  assignees: [
    {
      name: 'Tester',
      id: '93sd45435',
      imageUrl: '',
      avatarUrl: ''
    }
  ],
  assigneeNotes: [],
  completed: false,
  parentNote: null,
  subtasks: [
    {
      body: 'Task example',
      id: '23',
      createdAt: new Date('2020-08-01'),
      dueDate:  new Date('2020-08-01').toString(),
      author: {
        name: 'Johnsc',
        id: '23453435',
        imageUrl: '',
        avatarUrl: ''
      },
      user: {
        name: 'somebody'
      },
      assignees: [
        {
          name: 'Tester',
          id: '93sd45435',
          imageUrl: '',
          avatarUrl: ''
        }
      ],
      assigneeNotes: [],
      completed: false,
      parentNote: null,
      subTasks: [
        {
          body: 'Task example',
            id: '23',
            createdAt: new Date('2020-08-01'),
            dueDate:  new Date('2020-08-01').toString(),
            author: {
              name: 'Johnsc',
              id: '23453435',
              imageUrl: '',
              avatarUrl: ''
            },
            user: {
              name: 'somebody'
            },
            assignees: [
              {
                name: 'Tester',
                id: '93sd45435',
                imageUrl: '',
                avatarUrl: ''
              }
            ],
            assigneeNotes: [],
            completed: false,
            parentNote: null,
            subTasks: [],
        }
      ]
    }
  ]
};