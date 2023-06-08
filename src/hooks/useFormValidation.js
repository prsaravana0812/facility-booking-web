import { useState } from "react";
import dayjs from "dayjs";

const useFormValidation = (defaultFormValues) => {
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [isValidated, setValidated] = useState(false);

  const handleChange = (event) => {
    let currentTarget = event.currentTarget || event.target;
    let name = currentTarget.name;
    let value = currentTarget.value;

    setFormValues({ ...formValues, [name]: value });
    setFormErrors({ ...formErrors, [name]: handleErrorMessage(name, value) });
  };

  const handleTimeChange = (name, value) => {
    let timeString = dayjs(value).format("YYYY-MM-DDTHH:mm:ss");
    setFormValues({ ...formValues, [name]: timeString });
    setFormErrors({
      ...formErrors,
      [name]: handleErrorMessage(name, timeString),
    });
  };

  const handleErrorMessage = (name, value) => {
    let startTime, endTime;
    let errorMessage = "";

    switch (name) {
      case "event_name":
      case "description":
      case "person_name":
      case "resource":
        if (value?.trim() === "") {
          errorMessage = "Required field";
        }
        break;
      case "start_time":
        startTime = new Date(value).getTime();
        endTime = new Date(formValues.end_time).getTime();

        if (value?.trim() === "") {
          errorMessage = "Required field";
        } else if (startTime >= endTime) {
          errorMessage = "Start time should be less than end time";
        }
        break;
      case "end_time":
        startTime = new Date(formValues.start_time).getTime();
        endTime = new Date(value).getTime();

        if (value?.trim() === "") {
          errorMessage = "Required field";
        } else if (endTime <= startTime) {
          errorMessage = "End time should be greater than start time";
        }
        break;
      default:
        break;
    }

    return errorMessage;
  };

  const handleSubmitCheck = () => {
    let error = {};

    Object.keys(formValues).forEach((key) => {
      error[key] = handleErrorMessage(key, formValues[key]);
    });

    setFormErrors(error);
  };

  const handleValidation = () => {
    let emptyFields = Object.keys(formValues).filter((key) => {
      return formValues[key] === "";
    });
    let errors = Object.keys(formErrors).filter((key) => {
      return formErrors[key] !== "";
    });

    if (emptyFields.length === 0 && errors.length === 0) {
      setValidated(true);
    } else {
      setValidated(false);
    }
  };

  return {
    formValues,
    setFormValues,
    formErrors,
    setFormErrors,
    isValidated,
    setValidated,
    handleChange,
    handleTimeChange,
    handleValidation,
    handleSubmitCheck,
  };
};

export default useFormValidation;
