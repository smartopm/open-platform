import React from 'react';
import { ListItem, Typography, IconButton, ListItemText, Badge } from '@mui/material';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { grey } from '@mui/material/colors';
import ForumIcon from '@mui/icons-material/Forum';
import CommentCard from '../../../Tasks/Components/CommentCard';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';
import DateContainer from '../../../../components/DateContainer';
import { secureFileDownload } from '../../../../utils/helpers';

export default function FormItem({
  formUser,
  handleShowComments,
  currentFormUserId,
  userId,
  formData,
  t,
}) {
  const history = useHistory();
  const currentForm = currentFormUserId === formUser.id;
  const hasComments = currentForm && formData.data && Boolean(formData.data?.formComments?.length);
  const hasNoComments = currentForm && !formData.loading && !hasComments;
  const commentsData = formData.data?.formComments;

  function downloadFile(commentId, fileId) {
    const currentComment = commentsData?.find(com => com.id === commentId);
    const clickedDoc = currentComment?.taggedAttachments.find(doc => doc.id === fileId);
    secureFileDownload(clickedDoc.url);
  }

  return (
    <>
      <ListItem
        key={formUser.id}
        data-testid="form_user_item"
        style={{ cursor: 'pointer' }}
        onClick={() =>
          history.push(`/user_form/${userId}/${formUser.id}?formId=${formUser.form.id}`)
        }
      >
        <ListItemText
          primary={(
            <>
              <Typography variant="h6" color="textSecondary" data-testid="disc_title">
                {formUser.form.name}
              </Typography>
              <IconButton
                onClick={event => handleShowComments(event, formUser.id)}
                style={{ float: 'right', marginTop: -40 }}
                data-testid="show_comments"
                edge="end"
                aria-label="delete"
                size="large"
              >
                <Badge
                  badgeContent={formUser.commentsCount}
                  color="secondary"
                  data-testid="comments_badge"
                >
                  <ForumIcon
                    color={formUser.commentsCount ? 'primary' : ''}
                    style={{ color: !formUser.commentsCount && grey[300] }}
                    data-testid="comments_icon"
                  />
                </Badge>
              </IconButton>
            </>
          )}
          secondary={(
            <>
              <Typography
                component="span"
                variant="body2"
                color="textPrimary"
                data-testid="submitted_at"
              >
                {`${t('task:processes.submitted')}: `}
                <DateContainer date={formUser.createdAt} />
              </Typography>
            </>
          )}
        />
      </ListItem>
      {currentForm && formData.loading && <Spinner />}
      {hasComments ? (
        <CommentCard
          comments={commentsData}
          refetch={formData.refetch}
          taggedDocOnClick={downloadFile}
        />
      ) : (
        hasNoComments && (
          <CenteredContent>{t('task:task.no_comments_on_this_form')}</CenteredContent>
        )
      )}
      <br />
    </>
  );
}

FormItem.defaultProps = {
  currentFormUserId: null,
  formComments: [],
};
FormItem.propTypes = {
  formUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    createdAt: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]).isRequired,
    commentsCount: PropTypes.number.isRequired,
    form: PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
  handleShowComments: PropTypes.func.isRequired,
  currentFormUserId: PropTypes.string,
  userId: PropTypes.string.isRequired,
  formComments: PropTypes.arrayOf(PropTypes.object),
  t: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  formData: PropTypes.object.isRequired,
};
