import { hrefsExtractor, sentenceToSnakeCase, snakeCaseToSentence } from '../utils';

describe('find hrefs in a string', () => {
  const hrefsString = "sample string <a href='href1'>link1</a> string <a href='href2'>link2</a>"
  it('returns all the hrefs in a string', () => {
    expect(hrefsExtractor(hrefsString)[0]).toBe('href1')
    expect(hrefsExtractor(hrefsString)[1]).toBe('href2')
  })
})

describe('sentenceToSnakeCase', () => {
  it('convertes text to snake_case', () => {
    const text = "This Should Be Converted To Snake Case";
    expect(sentenceToSnakeCase(text)).toEqual('this_should_be_converted_to_snake_case');
  });
  it('convertes snake_case to normal title cased text', () => {
    const snakeText = "this_should_be_converted_to_snake_case";
    expect(snakeCaseToSentence(snakeText)).toEqual('This Should Be Converted To Snake Case');
    expect(snakeCaseToSentence(null)).toBeNull();
  });
});
