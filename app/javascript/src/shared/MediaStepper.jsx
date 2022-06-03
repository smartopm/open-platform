import React from "react";
import PropTypes from "prop-types";
import { Box, IconButton } from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { makeStyles } from '@mui/styles';

export default function CustomMediaStepper({
  activeStep,
  maxSteps,
  handleNext,
  handlePrevious,
  handleStepChange
}) {
  const classes = useStyles();

  return (
    <>
      <Box className={classes.root} data-testid="media-stepper-container">
        <IconButton
          className={classes.iconButton}
          size="small"
          onClick={handlePrevious}
          disabled={activeStep === 0}
          data-testid="previous-btn"
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          className={classes.iconButton}
          size="small"
          onClick={handleNext}
          disabled={activeStep === maxSteps - 1}
          data-testid="next-btn"
        >
          <KeyboardArrowRight />
        </IconButton>
      </Box>
      <Pagination
        dots={maxSteps}
        index={activeStep}
        onChangeIndex={handleStepChange}
      />
    </>
  );
}

export function Pagination({ dots, index, onChangeIndex }) {
  const classes = useStyles();

  function handleClick(step) {
    onChangeIndex(step);
  }

  const children = [];

  for (let i = 0; i < dots; i += 1) {
    children.push(
      <PaginationDot
        key={i}
        activeIndex={i}
        active={i === index}
        onClick={handleClick}
      />
    );
  }

  return <div data-testid="pagination-dot-container" className={classes.paginationContainer}>{children}</div>;
}

export function PaginationDot({ active, activeIndex, onClick }) {
  const classes = useStyles();

  return (
    <button
      type="button"
      className={classes.paginationButton}
      onClick={() => onClick(activeIndex)}
      data-testid="pagination_dot_btn"
    >
      <div className={active ? classes.activeDot : classes.dot} />
    </button>
  );
}

const useStyles = makeStyles(() => ({
  root: {
    position: "absolute",
    width: "100%", // "77% mob: 95%",
    top: "12%", // desktop "40% mob: 24%",
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: "4px",
    paddingRight: "4px"
  },
  iconButton: {
    backgroundColor: "#FFFFFF",
    opacity: 0.5
  },
  paginationContainer: {
    position: "absolute",
    left: "30%",
    display: "flex",
    flexDirection: "row"
  },
  paginationButton: {
    height: 18,
    width: 18,
    cursor: "pointer",
    border: 0,
    background: "none",
    padding: 0
  },
  dot: {
    backgroundColor: "#e4e6e7",
    height: 6,
    width: 6,
    borderRadius: 6,
    margin: 3
  },
  activeDot: {
    backgroundColor: "#319fd6",
    height: 6,
    width: 6,
    borderRadius: 6,
    margin: 3
  }
}));


CustomMediaStepper.propTypes = {
  maxSteps: PropTypes.number.isRequired,
  activeStep: PropTypes.number.isRequired,
  handleNext: PropTypes.func.isRequired,
  handlePrevious: PropTypes.func.isRequired,
  handleStepChange: PropTypes.func.isRequired
};

PaginationDot.propTypes = {
  active: PropTypes.bool.isRequired,
  activeIndex: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
};

Pagination.propTypes = {
  dots: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  onChangeIndex: PropTypes.func.isRequired
};
