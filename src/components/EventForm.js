import { useState, useEffect } from "react";
import {
  Backdrop,
  Button,
  Box,
  CircularProgress,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";

import CloseIcon from "@mui/icons-material/Cancel";

import useFormValidation from "../hooks/useFormValidation";

import EventApis from "../api/EventApis";

const styles = {
  pb: {
    paddingBottom: "2rem",
  },
  titleWrap: {
    display: "inline-block",
    position: "relative",
    paddingBottom: "2rem",
  },
  closeIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    cursor: "pointer",
  },
};

const profileKey = "google";

const EventForm = ({
  type,
  defaultFormValues,
  resources,
  refetchEvents,
  closeDrawer,
}) => {
  const {
    formValues,
    formErrors,
    isValidated,
    setFormValues,
    handleChange,
    handleTimeChange,
    handleValidation,
    handleSubmitCheck,
  } = useFormValidation(defaultFormValues);

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setFormValues({ person_name: getGoogleProfileName() });
  }, []);

  useEffect(() => {
    handleValidation();
  }, [formValues, formErrors]);

  const getGoogleProfileName = () => {
    let localStorageValue = localStorage.getItem(profileKey) || null;
    let googleProfile =
      localStorageValue !== null ? JSON.parse(localStorageValue) : {};

    return googleProfile?.name || "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    handleSubmitCheck();

    if (isValidated) {
      setLoading(true);
      let formData = updateFormData(formValues);

      if (type === "Create") {
        EventApis.createEvent(formData)
          .then((response) => {
            setLoading(false);
            toast.success(response.data?.message);
            refetchEvents(response.data?.data);
          })
          .catch((error) => {
            setLoading(false);
            toast.error(error.response.data.error);
          });
      } else if (type === "Edit") {
        EventApis.updateEvent(formValues.id, formData)
          .then((response) => {
            setLoading(false);
            toast.success(response.data?.message);
            refetchEvents(response.data?.data);
          })
          .catch((error) => {
            setLoading(false);
            toast.error(error.response.data.error);
          });
      }
    }
  };

  const updateFormData = (formValues) => {
    return {
      ...formValues,
      start_time: dayjs(formValues.start_time).format("YYYY-MM-DDTHH:mm:ss"),
      end_time: dayjs(formValues.end_time).format("YYYY-MM-DDTHH:mm:ss"),
    };
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box component="h2" style={styles.titleWrap}>
        {type} event
        <IconButton style={styles.closeIcon} onClick={closeDrawer}>
          <CloseIcon />
        </IconButton>
      </Box>
      <form onSubmit={handleSubmit} noValidate>
        <Box style={styles.pb}>
          <TextField
            label="Event Name"
            name="event_name"
            onChange={handleChange}
            value={formValues.event_name}
            error={formErrors.event_name ? true : false}
            helperText={formErrors.event_name ?? ""}
            InputProps={{ readOnly: isLoading }}
            fullWidth
            required
          />
        </Box>
        <Box style={styles.pb} className="stack-control">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Start Time"
              name="start_time"
              onChange={(newValue) => handleTimeChange("start_time", newValue)}
              value={dayjs(formValues.start_time)}
              slotProps={{
                textField: {
                  helperText: formErrors.start_time ?? "",
                  error: formErrors.start_time ? true : false,
                  required: true,
                  readOnly: isLoading,
                },
              }}
              fullWidth
            />
            <TimePicker
              label="End Time"
              name="end_time"
              onChange={(newValue) => handleTimeChange("end_time", newValue)}
              value={dayjs(formValues.end_time)}
              slotProps={{
                textField: {
                  helperText: formErrors.end_time ?? "",
                  error: formErrors.end_time ? true : false,
                  required: true,
                  readOnly: isLoading,
                },
              }}
              fullWidth
            />
          </LocalizationProvider>
        </Box>
        <Box style={styles.pb}>
          <TextField
            label="Description"
            name="description"
            onChange={handleChange}
            value={formValues.description}
            error={formErrors.description ? true : false}
            helperText={formErrors.description ?? ""}
            InputProps={{ readOnly: isLoading }}
            fullWidth
            multiline
            minRows={3}
            required
          />
        </Box>
        <Box style={styles.pb}>
          <TextField
            label="Person Name"
            name="person_name"
            onChange={handleChange}
            value={formValues.person_name}
            error={formErrors.person_name ? true : false}
            helperText={formErrors.person_name ?? ""}
            InputProps={{ readOnly: isLoading }}
            fullWidth
            required
          />
        </Box>
        <Box style={styles.pb}>
          <TextField
            label="Room"
            name="resource"
            onChange={handleChange}
            value={formValues.resource}
            error={formErrors.resource ? true : false}
            helperText={formErrors.resource ?? ""}
            InputProps={{ readOnly: isLoading }}
            fullWidth
            required
            select
          >
            <MenuItem value="">Select Room</MenuItem>
            {resources.map((resource, index) => (
              <MenuItem key={index} value={resource.id}>
                {resource.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box className="buttons" sx={{ width: { xs: "98vw", md: "36vw" } }}>
          <Button
            type="button"
            color="primary"
            variant="outlined"
            size="medium"
            sx={{ mx: "1rem" }}
            onClick={closeDrawer}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            size="medium"
            onClick={() => {}}
            disabled={isLoading}
          >
            {type === "Create" ? "Create" : "Update"}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default EventForm;
