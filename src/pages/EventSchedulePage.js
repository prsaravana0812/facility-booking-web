import { Box } from "@mui/material";

import Calendar from "../components/Calendar";

const EventSchedulePage = () => {
  return (
    <>
      <Box>
        <Box component={"h2"} sx={{ padding: "0.5rem 1.5rem" }}>
          Schedule your event
        </Box>
        <Calendar />
      </Box>
    </>
  );
};

export default EventSchedulePage;
