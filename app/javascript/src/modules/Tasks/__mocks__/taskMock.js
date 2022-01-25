export default {
  body: "My parent assigned task",
  createdAt: "2022-01-05T09:48:58+02:00",
  id: "23",
  completed: false,
  category: "to_do",
  description: "My parent assigned task",
  dueDate: "2022-01-05T09:48:19+02:00",
  progress: {
      complete: 0,
      total: 0,
      progress_percentage: null
  },
  user: {
      id: "bdf23d62-071c-4fdf-8ee5-7add18236090",
      name: "John Doctor",
      imageUrl: "https://lh3.googleusercontent.com/a-/AOh14Gh40stJUGHRhbpdm5UmSRMSdebN5MqclpqDwB8j=s96-c"
  },
  author: {
      id: "bdf23d62-071c-4fdf-8ee5-7add18236090",
      name: "John Doctor",
      imageUrl: "https://lh3.googleusercontent.com/a-/AOh14Gh40stJUGHRhbpdm5UmSRMSdebN5MqclpqDwB8j=s96-c",
      avatarUrl: null
  },
  assignees: [
      {
          id: "bdf23d62-071c-4fdf-8ee5-7add18236090",
          name: "John Doctor",
          imageUrl: "https://lh3.googleusercontent.com/a-/AOh14Gh40stJUGHRhbpdm5UmSRMSdebN5MqclpqDwB8j=s96-c",
          avatarUrl: null
      }
  ],
  assigneeNotes: [
      {
          id: "0965dbcb-ad8d-4a13-9fb3-d8ef1eea1530",
          userId: "bdf23d62-071c-4fdf-8ee5-7add18236090",
          reminderTime: "2022-01-18T10:45:56+02:00"
      }
  ],
  parentNote: null,
  documents: [],
  subTasks: [
    {
      body: "Subtask assigned",
      createdAt: "2022-01-05T09:47:22+02:00",
      id: "1588b0f3-5978-47e4-834f-407db59b2e79",
      completed: true,
      category: "to_do",
      description: "Subtask assigned",
      dueDate: "2022-01-05T09:46:59+02:00",
      progress: {
          complete: 1,
          total: 0,
          progress_percentage: null
      },
      user: {
          id: "bdf23d62-071c-4fdf-8ee5-7add18236090",
          name: "John Doctor",
          imageUrl: "https://lh3.googleusercontent.com/a-/AOh14Gh40stJUGHRhbpdm5UmSRMSdebN5MqclpqDwB8j=s96-c"
      },
      author: {
          id: "bdf23d62-071c-4fdf-8ee5-7add18236090",
          name: "John Doctor",
          imageUrl: "https://lh3.googleusercontent.com/a-/AOh14Gh40stJUGHRhbpdm5UmSRMSdebN5MqclpqDwB8j=s96-c",
          avatarUrl: null
      },
      assignees: [
          {
              id: "bdf23d62-071c-4fdf-8ee5-7add18236090",
              name: "John Tester",
              imageUrl: "https://lh3.googleusercontent.com/a-/AOh14Gh40stJUGHRhbpdm5UmSRMSdebN5MqclpqDwB8j=s96-c",
              avatarUrl: null
          }
      ],
      assigneeNotes: [
          {
              id: "2415a3b9-5548-47ac-bff0-54ebd2605fe5",
              userId: "bdf23d62-071c-4fdf-8ee5-7add18236090",
              reminderTime: null
          }
      ],
      parentNote: {
          id: "23"
      },
      documents: []
    }
  ],
};
