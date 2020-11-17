import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles({
  root: {
    width: "32%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px",
    margin: "0 5px",
    border: "1px solid #E3E3E3",
    borderRadius: "5px",
  },
  menuButton: {
    float: 'right'
  },
  avatar: {
    height: "70px",
    width: "70px",
    textAlign: "center",
    backgroundColor: "#F0FFFC",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
  },
  content: {
    fontSize: 14,
    textAlign: "center",
  },
  status: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 13,
  },
  datetime: {
    marginTop: 12,
    textAlign: "center",
  }
});

export default function ActionCard({actionFlow}) {
  const classes = useStyles();
  const date = new Date(actionFlow.createdAt);
  // const open = Boolean(anchorEl)
  // const [anchorEl, setAnchorEl] = useState(null)

  function isActive() { return actionFlow.active }

  // function handleClose(event) {
  //   event.stopPropagation()
  //   setAnchorEl(null)
  // }

  // function handleOpenMenu(event) {
  //   setAnchorEl(event.currentTarget)
  // }

  return (
    <Card className={classes.root} variant="outlined">
      {/* <ActionCardMenu
        data={{ actionFlow }}
        open={open}
        anchorEl={anchorEl}
        handleClose={handleClose}
      />
      <IconButton
        className={classes.menuButton}
        onClick={handleOpenMenu}
        dataid={actionFlow.id}
      >
        <MoreHorizIcon />
      </IconButton> */}
      <Avatar className={classes.avatar} alt="Action Flow Logo" src="/images/flow_icon.svg" />
      <CardContent>
        <Typography className={classes.title} variant="h6" component="h2" style={{ minHeight: "50px", marginBottom: "8px" }}>
          {actionFlow.title}
        </Typography>
        <Typography className={classes.content} gutterBottom>
          {`Event Type: ${actionFlow.eventType}`}
        </Typography>
        <Typography className={classes.content}>
          {actionFlow.description}
        </Typography>
        <Typography className={classes.datetime} variant="body2" component="p">
          {`${date.getDate()} ${date.toDateString().substr(4, 3)} ${date.getFullYear()}`}
        </Typography>
        <Typography className={classes.status} style={{ color: isActive ? '#66A59A' : '#ADADAD' }}>
          {actionFlow.active ? 'Active' : 'Inactive'}
        </Typography>
      </CardContent>
    </Card>
  );
}

ActionCard.propTypes = {
  actionFlow: PropTypes.shape({
    eventType: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
}
