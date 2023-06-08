import { useEffect, useState } from "react";
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-hot-toast";

import EventApis from "../api/EventApis";

const DeleteDialog = ({
  dialogOpen,
  message,
  event_id,
  handleConfirm,
  handleClose,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setOpen(dialogOpen);
  }, [dialogOpen]);

  const handleDelete = () => {
    setOpen(false);
    EventApis.deleteEvent(event_id)
      .then((response) => {
        setLoading(false);
        toast.success(response.data?.message);
        handleConfirm();
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response.data.error);
      });
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            color="primary"
            variant="outlined"
            size="medium"
            sx={{ mx: "0.5rem" }}
            onClick={handleClose}
          >
            No
          </Button>
          <Button
            type="button"
            color="primary"
            variant="contained"
            size="medium"
            sx={{ mx: "0.5rem" }}
            onClick={handleDelete}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteDialog;
