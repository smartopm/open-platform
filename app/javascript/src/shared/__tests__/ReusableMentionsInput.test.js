import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ReusableMentionsInput from "../ReusableMentionsInput";

describe('ReusableMentionsInput component', () => {
  it('should properly render', () => {
    const wrapper = render(
      <ReusableMentionsInput
        commentValue=""
        setCommentValue={() => {}}
        data={[{ id: '345678', display: 'doc-1' }]}
        setMentions={() => {}}
      />
    );
    expect(wrapper.queryByTestId('body_input')).toBeInTheDocument();
  });
});
