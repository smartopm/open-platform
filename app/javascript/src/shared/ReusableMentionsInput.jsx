import React from 'react';
import PropTypes from 'prop-types';
import { MentionsInput, Mention } from 'react-mentions';

export default function ReusableMentionsInput({
  commentValue,
  setCommentValue,
  data,
  setMentions
}) {
  const defaultStyle = {
    control: {
      backgroundColor: '#fff'
    },
    '&multiLine': {
      highlighter: {
        padding: 9,
        border: '1px solid transparent'
      },
      input: {
        padding: 9,
        border: '1px solid silver',
        borderRadius: '4px'
      }
    },

    '&singleLine': {
      display: 'inline-block',
      width: 180,
      highlighter: {
        padding: 1,
        border: '2px inset transparent'
      },
      input: {
        padding: 1,
        border: '2px inset'
      }
    },
    suggestions: {
      list: {
        backgroundColor: 'white',
        border: '1px solid rgba(0,0,0,0.15)',
        fontSize: 14
      },
      item: {
        padding: '5px 15px',
        borderBottom: '1px solid rgba(0,0,0,0.15)',
        '&focused': {
          backgroundColor: '#cee4e5'
        }
      }
    }
  };

  function handleOnChange(_, newValue, _newPlainTextValue, mentions) {
    setCommentValue(newValue);
    const dataMentioned = mentions.map(mention => mention.id);
    if (dataMentioned.length > 0) {
      setMentions(dataMentioned);
    }
  }

  return (
    <MentionsInput
      value={commentValue}
      onChange={handleOnChange}
      style={defaultStyle}
      className="mentions-input"
      data-testid="body_input"
      allowSpaceInQuery
    >
      <Mention
        trigger="#"
        data={data}
        markup="###____id______display____###"
        style={{
          backgroundColor: '#cee4e5'
        }}
      />
    </MentionsInput>
  );
}

ReusableMentionsInput.propTypes = {
  commentValue: PropTypes.string.isRequired,
  setCommentValue: PropTypes.func.isRequired,
  setMentions: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      display: PropTypes.string
    })
  ).isRequired
};
