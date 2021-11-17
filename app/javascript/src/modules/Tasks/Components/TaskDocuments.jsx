import React, { Fragment, useState } from 'react';
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { dateToString } from '../../../components/DateContainer';
import CenteredContent from '../../../shared/CenteredContent';

export default function TaskDocuments({ documents }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentDoc, setCurrentDoc] = useState('');
  const { t } = useTranslation('task');

  const menuOpen = Boolean(anchorEl);

  function handleOpenMenu(event, document) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setCurrentDoc(document);
  }

  // we close the menu after downloading the file
  function handleDownload() {
    setAnchorEl(null);
  }

  return (
    <>
      {documents?.length ? (
        <List>
          <Typography variant="h6" data-testid="documents_title">
            {t('document.documents')}
          </Typography>
          <br />
          <Divider variant="middle" data-testid="opening_divider" />
          {documents.map(doc => (
            <Fragment key={doc.id}>
              <ListItem>
                <ListItemText
                  disableTypography
                  primary={(
                    <Typography variant="body1" color="primary" style={{ fontWeight: 700 }} data-testid="filename">
                      {doc.filename}
                    </Typography>
                  )}
                  secondary={(
                    <Typography component="span" variant="body2" data-testid="uploaded_at">
                      {`${t('document.uploaded_at')}: ${dateToString(doc.created_at)}`}
                    </Typography>
                  )}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="more_details"
                    data-testid="more_details"
                    onClick={event => handleOpenMenu(event, doc)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>

              <Divider variant="middle" data-testid="closing_divider" />
            </Fragment>
          ))}
        </List>
      ) : (
        <CenteredContent>
          <Typography data-testid="no_documents">{t('document.no_documents')}</Typography>
        </CenteredContent>
      )}
      <Menu
        id={`long-menu-${currentDoc.id}`}
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => setAnchorEl(null)}
        keepMounted={false}
        data-testid="more_details_menu"
      >
        <MenuItem id="download_button" key="download" onClick={handleDownload}>
          <a
            href={currentDoc.url}
            download={currentDoc.filename}
            style={{ textDecoration: 'none', color: '#000000' }}
          >
            {t('document.download')}
          </a>
        </MenuItem>
      </Menu>
    </>
  );
}

TaskDocuments.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      filename: PropTypes.string
    })
  ).isRequired
};