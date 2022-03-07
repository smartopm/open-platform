import {
  hrefsExtractor,
  sentenceToSnakeCase,
  snakeCaseToSentence,
  calculateOpenProjectsByStage,
  groupComments,
  lastRepliedComment
} from '../utils';

describe('find hrefs in a string', () => {
  const hrefsString = "sample string <a href='href1'>link1</a> string <a href='href2'>link2</a>";
  it('returns all the hrefs in a string', () => {
    expect(hrefsExtractor(hrefsString)[0]).toBe('href1');
    expect(hrefsExtractor(hrefsString)[1]).toBe('href2');
  });
});

describe('sentenceToSnakeCase', () => {
  it('convertes text to snake_case', () => {
    const text = 'This Should Be Converted To Snake Case';
    expect(sentenceToSnakeCase(text)).toEqual('this_should_be_converted_to_snake_case');
  });

  it('returns null if no arg is passed', () => {
    expect(sentenceToSnakeCase()).toEqual(null);
  });

  it('convertes snake_case to normal title cased text', () => {
    const snakeText = 'this_should_be_converted_to_snake_case';
    expect(snakeCaseToSentence(snakeText)).toEqual('This Should Be Converted To Snake Case');
    expect(snakeCaseToSentence(null)).toBeNull();
  });
});

describe('calculateOpenProjectsByStage', () => {
  const project = [
    {
      subTasks: [{ id: '123', completed: false, body: 'scheme design review' }]
    }
  ];
  const stages = {
    concept_design_review: 0,
    scheme_design_review: 0
  };

  it('returns default stages if no project is available', () => {
    expect(calculateOpenProjectsByStage(null, stages).concept_design_review).toEqual(0);
  });

  it('returns calculated stages', () => {
    expect(calculateOpenProjectsByStage(project, stages).scheme_design_review).toEqual(1);
  });
});

describe('groupComments', () => {
  it('groups comments by grouping_id and no-group if ID is not available', () => {
    const comments = [
      { id: '123', body: 'Comment 1', groupingId: '234' },
      { id: '456', body: 'Comment 2', groupingId: '234' },
      { id: '789', body: 'Comment 2', groupingId: null }
    ];

    const groupedComments = groupComments(comments);
    expect(groupedComments['234']).toHaveLength(2);
    expect(groupedComments['234'][0].id).toEqual('123');
    expect(groupedComments['234'][1].id).toEqual('456');

    expect(groupedComments['no-group']).toHaveLength(1);
    expect(groupedComments['no-group'][0].id).toEqual('789');
  });
});

describe('lastRepliedComment', () => {
  it('returns the last comment for the grouping id', () => {
    const groupedComments = {
      234: [
        { id: '123', body: 'Comment 1', groupingId: '234' },
        { id: '456', body: 'Comment 2', groupingId: '234' }
      ],
      'no-group': [{ id: '789', body: 'Comment 2', groupingId: null }]
    };
    const lastComment = lastRepliedComment(groupedComments, '234');

    expect(lastComment.id).toEqual('456');
  });
});
