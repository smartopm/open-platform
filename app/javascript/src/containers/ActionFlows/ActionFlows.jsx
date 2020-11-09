/* eslint-disable no-use-before-define */
import React, { useState } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { useQuery } from 'react-apollo'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem
} from '@material-ui/core'
import Nav from '../../components/Nav'
import { Events } from '../../graphql/queries'
import colors from '../../themes/nkwashi/colors'

const { primary, dew } = colors
export default function ActionFlows() {
  const [open, setModalOpen] = useState(false)
  const eventData = useQuery(Events)
  // const _actionData = useQuery(Actions)

  function openModal() {
    setModalOpen(!open)
  }

  return (
    <>
      <Nav navName="Workflow" menuButton="back" backTo="/" />
      <Dialog
        open={open}
        onClose={() => {}}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle
          id="workflow-dialog-title"
          style={{
            borderBottom: `1px solid ${primary}`,
            background: dew,
            color: primary
          }}
        >
          New Workflow
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            // value={shortDesc}
            onChange={() => {}}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            // value={description}
            onChange={() => {}}
          />
          {eventData.data && (
            <Select
              labelId="select-event"
              id="select-event"
              value=""
              fullWidth
              onChange={() => {}}
            >
              {eventData.data.events.map((event, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <MenuItem key={index} value={event}>
                  {event}
                </MenuItem>
              ))}
            </Select>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {}} color="secondary" variant="outlined">
            CANCEL
          </Button>
          <Button onClick={() => {}} color="primary" variant="contained">
            SAVE
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="contained"
        onClick={openModal}
        color="primary"
        className={`btn ${css(styles.addFlow)} `}
      >
        New Workflow
      </Button>
    </>
  )
}

const styles = StyleSheet.create({
  addFlow: {
    boxShadow: 'none',
    margin: 5,
    float: 'right',
    color: '#FFFFFF'
  }
})
