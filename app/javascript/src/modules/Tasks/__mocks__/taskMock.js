
// This cleans up and avoids any jest warnings and errors
export default {
  body: 'Consultant sub-task',
  createdAt: '2022-01-06T11:22:28Z',
  id: '4f5bfb50-0fe1-455a-bff5-ca76b3f3eb2c',
  completed: false,
  category: 'to_do',
  description: 'Consultant sub-task',
  dueDate: '2022-01-22T21:00:00Z',
  subTasksCount: 4,
  taskCommentsCount: 4,
  progress: {
    complete: 0,
    total: 0,
    progress_percentage: null
  },
  __typename: 'Note',
  user: {
    id: 'cfc7e3d3-d875-4d50-a7a4-994df8ab7f42',
    name: 'Daniel Mutuba',
    imageUrl:
      'https://lh3.googleusercontent.com/a-/AOh14Ghj2JnWVlVC_cPrzJrAJ2YyV_UyVTXcEew8YKVp=s96-c',
    __typename: 'User'
  },
  documents: [],
  parentNote: {
    id: '90ba44ef-4306-416b-945f-1d2ea4eb4c50',
    __typename: 'Note'
  },
  author: {
    id: 'a7b3e608-5ca8-44da-b0f2-8f94239f5a1f',
    name: 'Daniel Mutuba',
    imageUrl:
      'https://lh3.googleusercontent.com/a-/AOh14Gjnom4vf1f-DPzmjQ4JyU0Jt88Bz0ShVC73LBDCqQ=s96-c',
    avatarUrl: null,
    __typename: 'User'
  },
  subTasks: [
    {
      body: 'Consultant sub-task',
      createdAt: '2022-01-06T11:22:28Z',
      id: '4f5bfb50-0fe1-455a-bff5-ca76b3f3eb2b',
      completed: false,
      category: 'to_do',
      description: 'Consultant sub-task',
      dueDate: '2022-01-22T21:00:00Z',
      subTasksCount: 4,
      progress: {
        complete: 1,
        total: 0,
        progress_percentage: null
      },
      __typename: 'Note',
      user: {
        id: 'cfc7e3d3-d875-4d50-a7a4-994df8ab7f42',
        name: 'Daniel Mutuba',
        imageUrl:
          'https://lh3.googleusercontent.com/a-/AOh14Ghj2JnWVlVC_cPrzJrAJ2YyV_UyVTXcEew8YKVp=s96-c',
        __typename: 'User'
      },
      author: {
        id: 'a7b3e608-5ca8-44da-b0f2-8f94239f5a1f',
        name: 'Daniel Mutuba',
        imageUrl:
          'https://lh3.googleusercontent.com/a-/AOh14Gjnom4vf1f-DPzmjQ4JyU0Jt88Bz0ShVC73LBDCqQ=s96-c',
        avatarUrl: null,
        __typename: 'User'
      },
      subTasks: [],

      assignees: [
        {
          id: 'cfc7e3d3-d875-4d50-a7a4-994df8ab7f42',
          name: 'Daniel Mutuba',
          imageUrl:
            'https://lh3.googleusercontent.com/a-/AOh14Ghj2JnWVlVC_cPrzJrAJ2YyV_UyVTXcEew8YKVp=s96-c',
          avatarUrl: null,
          __typename: 'User'
        }
      ],
      assigneeNotes: [
        {
          id: 'e78cadcb-3cfa-4277-be46-d734cbfad1d6',
          userId: 'cfc7e3d3-d875-4d50-a7a4-994df8ab7f42',
          reminderTime: null,
          __typename: 'AssigneeNote'
        }
      ],
      parentNote: {
        id: '90ba44ef-4306-416b-945f-1d2ea4eb4c46',
        __typename: 'Note'
      },
      documents: []
    }
  ],

  assignees: [
    {
      id: 'cfc7e3d3-d875-4d50-a7a4-994df8ab7f42',
      name: 'John Doctor',
      imageUrl:
        'https://lh3.googleusercontent.com/a-/AOh14Ghj2JnWVlVC_cPrzJrAJ2YyV_UyVTXcEew8YKVp=s96-c',
      avatarUrl: null,
      __typename: 'User'
    }
  ],
  assigneeNotes: [
    {
      id: 'e78cadcb-3cfa-4277-be46-d734cbfad1d6',
      userId: 'cfc7e3d3-d875-4d50-a7a4-994df8ab7f42',
      reminderTime: null,
      __typename: 'AssigneeNote'
    }
  ],
};
