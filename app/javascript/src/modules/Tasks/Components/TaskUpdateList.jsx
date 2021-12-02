/* eslint-disable complexity */
/* eslint-disable no-use-before-define */
import React from 'react'
import { Typography, Grid} from '@material-ui/core';
import EventNoteOutlinedIcon from '@material-ui/icons/EventNoteOutlined';
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import { makeStyles } from '@material-ui/core/styles';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import ClassOutlinedIcon from '@material-ui/icons/ClassOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import TaskUpdateItem from './TaskUpdateItem'
import { dateToString, dateFormatter } from "../../../components/DateContainer"

export default function TaskUpdateList({ data }) {
  const classes = useStyles();
  const { t } = useTranslation('task')

  return (
    <>
      <Grid container className={classes.header}>
        <Grid item md={11} xs={11}>
          <Typography variant="h6" data-testid="history_title">
            {t('history.updates')}
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item md={11} xs={11}>
          {data?.length ? (
            <>
              {data.map(history => (
                <div key={history.id}>
                  {history.action === 'create' && history.noteEntityType === 'Comments::NoteComment' && (
                    <TaskUpdateItem
                      user={history.user.name}
                      icon={<AddBoxOutlinedIcon className={classes.icon} />}
                      content={t('task.history_create_new_note_comment')}
                      date={dateFormatter(history.createdAt)}
                    />
                  )}
                  {history.action === 'update' && history.attrChanged === 'description' && (
                    <TaskUpdateItem
                      user={history.user.name}
                      icon={<DescriptionOutlinedIcon className={classes.icon} />}
                      content={t('task.history_update_attribute', {
                        attribute: 'description',
                        initialValue: history.initialValue || 'empty value',
                        updatedValue: history.updatedValue || 'empty value'
                      })}
                      date={dateFormatter(history.createdAt)}
                    />
                  )}
                  {history.action === 'update' && history.attrChanged === 'due_date' && (
                    <TaskUpdateItem
                      user={history.user.name}
                      icon={<EventNoteOutlinedIcon className={classes.icon} />}
                      content={t('task.history_update_attribute', {
                        attribute: 'due date',
                        initialValue: history.initialValue  !== null ? dateToString(history.initialValue) : 'empty value',
                        updatedValue: history.updatedValue || 'empty value'
                      })}
                      date={dateFormatter(history.createdAt)}
                    />
                  )}
                  {history.action === 'update' && history.attrChanged === 'completed' && (
                    <TaskUpdateItem
                      user={history.user.name}
                      icon={<AssignmentTurnedInOutlinedIcon className={classes.icon} />}
                      content={t('task.history_update_attribute', {
                        attribute: 'complete status',
                        initialValue: history.initialValue === 't' ? 'true' : 'false' || 'empty value',
                        updatedValue: history.updatedValue === 't' ? 'true' : 'false' || 'empty value'
                      })}
                      date={dateFormatter(history.createdAt)}
                    />
                  )}
                  {history.action === 'update' && history.attrChanged === 'body' && (
                    <TaskUpdateItem
                      user={history.user.name}
                      icon={<CreateOutlinedIcon className={classes.icon} />}
                      content={t('task.history_update_body')}
                      date={dateFormatter(history.createdAt)}
                    />
                  )}
                  {history.action === 'update' && history.attrChanged === 'category' && (
                    <TaskUpdateItem
                      user={history.user.name}
                      icon={<ClassOutlinedIcon className={classes.icon} />}
                      content={t('task.history_update_attribute', {
                        attribute: 'category',
                        initialValue: history.initialValue || 'empty value',
                        updatedValue: history.updatedValue || 'empty value'
                      })}
                      date={dateFormatter(history.createdAt)}
                    />
                  )}
                  {history.action === 'update' && history.attrChanged === 'flagged' && (
                    <TaskUpdateItem
                      user={history.user.name}
                      icon={<FlagOutlinedIcon className={classes.icon} />}
                      content={t('task.history_update_attribute', {
                        attribute: 'flagged status',
                        initialValue: history.initialValue === 't' ? 'true' : 'false' || 'empty value',
                        updatedValue: history.updatedValue === 't' ? 'true' : 'false' || 'empty value'
                      })}
                      date={dateFormatter(history.createdAt)}
                    />
                  )}
                  {history.action === 'update' && history.attrChanged === 'user_id' && (
                    <TaskUpdateItem
                      user={history.user.name}
                      icon={<PersonOutlinedIcon className={classes.icon} />}
                      content={t('task.history_update_attribute', {
                        attribute: 'the author',
                        initialValue: history.initialValue || 'empty value',
                        updatedValue: history.updatedValue || 'empty value'
                      })}
                      date={dateFormatter(history.createdAt)}
                    />
                  )}
                  {history.action === 'update' && history.attrChanged === 'assign' && (
                    <TaskUpdateItem
                      user={history.user.name}
                      icon={<PeopleAltOutlinedIcon className={classes.icon} />}
                      content={t('task.history_update_attribute', {
                        attribute: 'assignees',
                        initialValue: history.initialValue || 'empty value',
                        updatedValue: history.updatedValue || 'empty value'
                      })}
                      date={dateFormatter(history.createdAt)}
                    />
                  )}
                </div>
              ))}
            </>
          ) : (
            <Typography data-testid="no_updates">{t('task.history_update_no_data')}</Typography>
          )}
        </Grid>
      </Grid>
    </>
  )
}

const useStyles = makeStyles({
  header: {
    alignItems: 'center',
    marginBottom: '8px'
  },
  icon: {
    padding: '4px',
    marginBottom: '10px',
    fontSize: '32px',
    border: '2px solid #dad9d9',
    color: '#dad9d9',
    borderRadius: '50%'
  }
});

TaskUpdateList.defaultProps = {
  data: []
 }
 TaskUpdateList.propTypes = {
   // eslint-disable-next-line react/forbid-prop-types
   data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string
  }))
 }
