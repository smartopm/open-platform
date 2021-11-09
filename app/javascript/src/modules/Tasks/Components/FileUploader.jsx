import React, { useRef } from 'react';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function FileUploader({ handleFileInputChange }) {
  const { t } = useTranslation('common');
  const fileInputTag = useRef(null);

  const handleClick = () => {
    fileInputTag.current.click();
  };

  return (
    <>
      <span onClick={handleClick} onKeyPress={handleClick} role='menuitem' tabIndex='-1'>
        { t('menu.upload_document') }
      </span>
      <input
        hidden
        type="file"
        ref={fileInputTag}
        onChange={event => handleFileInputChange(event)}
      />
    </>
  );
};

FileUploader.propTypes = {
  handleFileInputChange: PropTypes.func.isRequired,
};
