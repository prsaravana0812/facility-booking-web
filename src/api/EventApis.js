import axios from "axios";
import _ from "lodash";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getRooms = async () => {
  const token = localStorage.getItem("token") || null;
  const headers = { headers: { Authorization: token } };
  let response = await axios.get(`${API_BASE_URL}/rooms`, headers);
  let apiResponse = response.data?.data;
  let resultResponse = [];

  if (_.isArray(apiResponse)) {
    resultResponse = apiResponse.map((room) => {
      return {
        id: room?.room_id || "",
        name: room?.name || "",
      };
    });
  }

  return resultResponse;
};

const getEvents = async (calendarDate) => {
  const token = localStorage.getItem("token") || null;
  const headers = { headers: { Authorization: token } };
  let response = await axios.get(
    `${API_BASE_URL}/events?calendar_date=${calendarDate}`,
    headers
  );
  let apiResponse = response.data?.data;
  let resultResponse = [];

  if (_.isArray(apiResponse)) {
    resultResponse = apiResponse.map((event) => {
      return formatEventData(event);
    });
  }

  return resultResponse;
};

const getEvent = async (event_id) => {
  const token = localStorage.getItem("token") || null;
  const headers = { headers: { Authorization: token } };
  let response = await axios.get(`${API_BASE_URL}/events/${event_id}`, headers);
  let apiResponse = response.data?.data;

  return formatEventData(apiResponse);
};

const createEvent = (event_data) => {
  const token = localStorage.getItem("token") || null;
  const headers = { headers: { Authorization: token } };
  return axios.post(`${API_BASE_URL}/events`, event_data, headers);
};

const updateEvent = (event_id, event_data) => {
  const token = localStorage.getItem("token") || null;
  const headers = { headers: { Authorization: token } };
  return axios.put(`${API_BASE_URL}/events/${event_id}`, event_data, headers);
};

const deleteEvent = (event_id) => {
  const token = localStorage.getItem("token") || null;
  const headers = { headers: { Authorization: token } };
  return axios.delete(`${API_BASE_URL}/events/${event_id}`, headers);
};

const formatEventData = (event) => {
  return {
    id: event?.id || null,
    event_name: event?.event_name || "",
    start: event?.start_time || "",
    end: event?.end_time || "",
    description: event?.description || "",
    resource: event?.resource || "",
    person_name: event?.person_name || "",
    text: event?.text || "",
    barColor: "#75dd02",
    backColor: "#f5f5f5",
  };
};

const EventApis = {
  getRooms,
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
};

export default EventApis;
