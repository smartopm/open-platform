/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Button, TextField, Snackbar } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'
import { titleize } from '../../../utils/helpers';
import { Spinner } from '../../../shared/Loading'

export default function TitleDescriptionForm({ formTitle, formDescription, save, type, close, data, children }) {
  const [title, setTitle] = useState(formTitle);
  const [description, setDescription] = useState(formDescription);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(['common', 'form'])

  function handleSubmit(e) {
    e.preventDefault();
    save(title, description);
  }

  return (
    <div className="container">
      <Snackbar
        color="success"
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(!open)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message={t('misc.misc_successfully_created', { type: titleize(type)})}
      />
      <form onSubmit={handleSubmit} aria-label={`${type}-form`}>
        <TextField
          name={t('form_fields.title')}
          label={t('form_fields.misc_title', { type: titleize(type)})}
          style={{ width: '100%' }}
          className='form-title-txt-input'
          placeholder={t('form_placeholders.type_title')}
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          margin="normal"
          inputProps={{
            'aria-label': `${type}_title`,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
        <TextField
          name={t('form_fields.description')}
          label={t('form_fields.misc_description', { type: titleize(type)})}
          style={{ width: '100%' }}
          className='form-description-txt-input'
          placeholder={t('form_placeholders.type_description')}
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          multiline
          rows={3}
          margin="normal"
          inputProps={{
            'aria-label': `${type}_description`,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
        {children}
        <br />
        {data.loading ?  <Spinner /> : (
          <div className="d-flex row justify-content-center">
            <Button
              variant="contained"
              aria-label={`${type}_cancel`}
              color="secondary"
              onClick={close}
              className={`${css(discussStyles.cancelBtn)}`}
            >
              {t('form_actions.cancel')}
            </Button>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              disabled={data.loading}
              aria-label={`${type}_submit`}
              className={`${css(discussStyles.submitBtn)} submit-form-btn`}
            >
              {t('form_actions.submit')}
            </Button>
          </div>
        )}
        <br />
        <p className="text-center">{Boolean(data.msg.length) && data.msg}</p>
      </form>
    </div>
  );
}

TitleDescriptionForm.defaultProps = {
  children: <span />,
  formTitle: '',
  formDescription: ''
};

TitleDescriptionForm.propTypes = {
  formTitle: PropTypes.string,
  formDescription: PropTypes.string,
  close: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  children: PropTypes.node,
  type: PropTypes.string.isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool,
    msg: PropTypes.string,
  }).isRequired,
};

export const discussStyles = StyleSheet.create({
  submitBtn: {
    width: '30%',
    boxShadow: 'none',
    marginTop: 50,
    alignItems: 'center',
    ':hover': {
      color: '#FFFFFF',
    },
  },
  cancelBtn: {
    width: '30%',
    marginRight: '20vw',
    marginTop: 50,
    alignItems: 'center',
    ':hover': {
      color: '#FFFFFF',
    },
  },
});
