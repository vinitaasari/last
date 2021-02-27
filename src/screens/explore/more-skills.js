import React, { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  skillChipsContainer: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  activeChipOutlined: {
    backgroundColor: "#E2EAFA",
    border: "1px solid #05589C",
  },
  activeChipLabel: {
    color: "#05589C",
  },
  submitBtn: {
    boxShadow: "none",
  },
  clearBtn: {
    color: "#3f3f3f",
    textTransform: "none",
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    top: theme.spacing(1),
    left: theme.spacing(1),
    color: "#3f3f3f",
  },
  title: {
    textAlign: "center",
    color: "#3f3f3f",
    fontSize: "20px",
    fontWeight: 600,
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6" className={classes.title}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

export default function MoreSkills(props) {
  const classes = useStyles();
  const { skills, selectedSkill, handleChipClick, skillsNotShownCount } = props;
  const [open, setOpen] = useState(false);
  const [chosenSkill, setChosenSkill] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
    setChosenSkill(selectedSkill);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const clearSkillFilter = () => {
    setChosenSkill(null);
    handleChipClick(null);
    handleClose();
  };

  const applySkillFilter = () => {
    handleChipClick(chosenSkill);
    handleClose();
  };

  return (
    <div>
      <Chip
        label={`+${skillsNotShownCount} Skills`}
        clickable
        variant="outlined"
        onClick={handleClickOpen}
      />
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="sm"
        fullWidth
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          More Skills
        </DialogTitle>
        <DialogContent>
          <Box mt={2} className={classes.skillChipsContainer}>
            {skills.map((skill) => {
              return (
                <Chip
                  key={skill.id}
                  label={skill.name}
                  clickable
                  variant="outlined"
                  onClick={() => setChosenSkill(skill.id)}
                  classes={{
                    outlined:
                      skill.id === chosenSkill
                        ? classes.activeChipOutlined
                        : undefined,
                    label:
                      skill.id === chosenSkill
                        ? classes.activeChipLabel
                        : undefined,
                  }}
                />
              );
            })}
          </Box>

          <Box
            mt={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Button
              onClick={clearSkillFilter}
              className={classes.clearBtn}
              color="primary"
            >
              Clear
            </Button>
            <Button
              onClick={applySkillFilter}
              color="secondary"
              variant="contained"
              className={classes.submitBtn}
            >
              Apply
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
