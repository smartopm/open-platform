import hrefsExtractor from '../util'

describe('find hrefs in a string', () => {
  const hrefsString = "sample string <a href='href1'>link1</a> string <a href='href2'>link2</a>" 
  it('returns all the hrefs in a string', () => {
    expect(hrefsExtractor(hrefsString)[0]).toBe('href1')
    expect(hrefsExtractor(hrefsString)[1]).toBe('href2')
  })
})