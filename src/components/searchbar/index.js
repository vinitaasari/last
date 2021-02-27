import React from "react";
import { Divider, InputAdornment, Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import CallMadeIcon from "@material-ui/icons/CallMade";

const useStyles = makeStyles((theme) => ({
  notchedOutline: {
    borderColor: `#D9DFE5 !important`,
  },
  icon: {
    color: "#C3C3C3",
  },
  optionsContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-start",
    // paddingBottom: theme.spacing(0.5),
    // borderBottom: "1px solid #E7E8EA",
  },
  title: {
    color: "#393A45",
    fontSize: "16px",
    fontWeight: 600,
  },
  subTitle: {
    color: "#393A45",
    fontSize: "14px",
    fontWeight: 400,
  },
  arrowIcon: {
    marginLeft: "auto",
    color: "#2C516C",
  },
}));

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function Asynchronous() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const response = await fetch(
        "https://country.register.gov.uk/records.json?page-size=5000"
      );
      await sleep(1e3); // For demo purposes.
      const countries = await response.json();

      if (active) {
        setOptions(Object.keys(countries).map((key) => countries[key].item[0]));
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      renderOption={(option, { selected }) => (
        <div className={classes.optionsContainer}>
          <div>
            <Typography classes={{ root: classes.title }}>Design</Typography>
            <Typography classes={{ root: classes.subTitle }}>
              In Category
            </Typography>
          </div>
          <CallMadeIcon
            fontSize="small"
            classes={{ root: classes.arrowIcon }}
          />
        </div>
      )}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          margin="dense"
          variant="outlined"
          fullWidth
          placeholder="Select course, categories"
          style={{ backgroundColor: "#FAFCFD" }}
          InputProps={{
            ...params.InputProps,
            classes: { notchedOutline: classes.notchedOutline },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" className={classes.icon} />
              </InputAdornment>
            ),
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
