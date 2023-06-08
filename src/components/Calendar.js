import React, { Component } from "react";
import { Box, SwipeableDrawer } from "@mui/material";
import {
  DayPilotCalendar,
  DayPilotNavigator,
} from "@daypilot/daypilot-lite-react";
import dayjs from "dayjs";

import EventForm from "./EventForm";
import DeleteDialog from "./DeleteDialog";

import EventApis from "../api/EventApis";

const styles = {
  contentCenter: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.calendarRef = React.createRef();
    this.datePickerRef = React.createRef();

    this.state = {
      startDate: new Date(),
      columns: [],
      events: [],
      actionType: "Create",
      formOpen: false,
      popupOpen: false,
      deleteEventId: null,
      formValues: {
        event_name: "",
        start_time: "",
        end_time: "",
        description: "",
        person_name: "",
        resource: "",
      },
    };
  }

  componentDidMount() {
    this.datePicker.select(this.state.startDate);
    this._loadColumnData();
    this._loadCalendarData(this.state.startDate);
  }

  get calendar() {
    return this.calendarRef.current.control;
  }

  get datePicker() {
    return this.datePickerRef.current.control;
  }

  _loadColumnData = async () => {
    let columnData = await EventApis.getRooms();

    this._stateUpdate({
      columns: columnData,
    });
  };

  _loadCalendarData = async (calendarDate) => {
    let formatedDate = dayjs(calendarDate).format("DD/MM/YYYY");
    let eventData = await EventApis.getEvents(formatedDate);

    this._stateUpdate({
      events: eventData,
      formOpen: false,
      popupOpen: false,
      deleteEventId: null,
    });
  };

  _updateCalendarData = (eventData) => {
    let eventList = [];

    if (this.state.actionType === "Create") {
      eventList = this.state.events;
      eventList.push({
        id: eventData.id,
        event_name: eventData.event_name,
        start: eventData.start_time,
        end: eventData.end_time,
        description: eventData.description,
        resource: eventData.resource,
        person_name: eventData.person_name,
        text: eventData.text,
        barColor: "#75dd02",
        backColor: "#f5f5f5",
      });
    }

    if (this.state.actionType === "Edit") {
      eventList = this.state.events.map((event) => {
        if (event.id === eventData.id) {
          return {
            ...event,
            event_name: eventData.event_name,
            start: eventData.start_time,
            end: eventData.end_time,
            description: eventData.description,
            person_name: eventData.person_name,
            resource: eventData.resource,
            text: eventData.text,
          };
        }

        return event;
      });
    }

    if (this.state.actionType === "Delete") {
      eventList = this.state.events.filter(
        (event) => event.id !== this.state.deleteEventId
      );
    }

    this._stateUpdate({
      actionType: "",
      events: eventList,
      formOpen: false,
      popupOpen: false,
      deleteEventId: null,
    });
  };

  _stateUpdate = (object) => {
    this.setState(object);
  };

  _onTimeRangeSelect = (args) => {
    this._stateUpdate({ startDate: args.day });
    this._loadCalendarData(args.day);
  };

  _onTimeRangeSelected = (args) => {
    this._stateUpdate({
      actionType: "Create",
      startDate: args.start,
      formOpen: true,
      formValues: {
        event_name: "",
        start_time: args.start.value,
        end_time: args.end.value,
        description: "",
        person_name: "",
        resource: args.resource,
      },
    });
  };

  _onEventClick = (args) => {
    this._stateUpdate({
      actionType: "Edit",
      startDate: args.e.data.start,
      formOpen: true,
      formValues: {
        id: args.e.data.id,
        event_name: args.e.data.event_name,
        start_time: args.e.data.start.value,
        end_time: args.e.data.end.value,
        description: args.e.data.description,
        person_name: args.e.data.person_name,
        resource: args.e.data.resource,
      },
    });
  };

  _onEventMoved = (args) => {
    this._onEventClick(args);
  };

  _onEventDelete = (args) => {
    args.preventDefault();

    this._stateUpdate({
      actionType: "Delete",
      startDate: args.e.data.start,
      popupOpen: true,
      deleteEventId: args.e.data.id,
    });
  };

  _toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    this._stateUpdate({ formOpen: open });
  };

  _closeDrawer = () => this._stateUpdate({ formOpen: false });

  _closeDialog = () => this._stateUpdate({ popupOpen: false });

  render() {
    return (
      <>
        <Box sx={{ width: "100vw", display: { xs: "block", md: "flex" } }}>
          <Box sx={{ width: { xs: "100vw", md: "20vw" }, padding: "1rem" }}>
            <Box style={styles.contentCenter}>
              <DayPilotNavigator
                selectMode={"Day"}
                showMonths={1}
                skipMonths={1}
                onTimeRangeSelect={(args) => this._onTimeRangeSelect(args)}
                ref={this.datePickerRef}
              />
            </Box>
          </Box>
          <Box sx={{ width: { xs: "100vw", md: "80vw" }, padding: "1rem" }}>
            <Box style={styles.contentCenter}>
              <DayPilotCalendar
                viewType={"Resources"}
                timeRangeSelectedHandling={"Enabled"}
                eventDeleteHandling={"Update"}
                allowEventOverlap={false}
                startDate={this.state.startDate}
                columns={this.state.columns}
                events={this.state.events}
                onTimeRangeSelected={(args) => this._onTimeRangeSelected(args)}
                onEventClick={(args) => this._onEventClick(args)}
                onEventMove={(args) => args.preventDefault()}
                onEventMoved={(args) => this._onEventMoved(args)}
                onEventDelete={(args) => this._onEventDelete(args)}
                ref={this.calendarRef}
              />
              {this.state.popupOpen && (
                <DeleteDialog
                  dialogOpen={this.state.popupOpen}
                  message={"Are you sure you want to delete this event?"}
                  event_id={this.state.deleteEventId}
                  handleConfirm={() => this._updateCalendarData({})}
                  handleClose={this._closeDialog}
                />
              )}
              <SwipeableDrawer
                anchor={"right"}
                open={this.state.formOpen}
                onOpen={() => this._toggleDrawer(true)}
                onClose={() => this._toggleDrawer(false)}
                sx={{ width: { xs: "100vw", md: "40vw" } }}
              >
                {this.state.formOpen && (
                  <EventForm
                    type={this.state.actionType}
                    resources={this.state.columns}
                    defaultFormValues={this.state.formValues}
                    refetchEvents={(event) => this._updateCalendarData(event)}
                    closeDrawer={this._closeDrawer}
                  />
                )}
              </SwipeableDrawer>
            </Box>
          </Box>
        </Box>
      </>
    );
  }
}

export default Calendar;
