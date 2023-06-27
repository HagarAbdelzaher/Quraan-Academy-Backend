/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
const express = require('express');
const axios = require('axios');
const { asycnWrapper } = require('../libs');

const router = express.Router();
const userID = process.env.ZOOM_USER_ID;
const accountID = process.env.ZOOM_ACCOUNT_ID;
const clientId = process.env.ZOOM_CLIENT_ID;
const clientSecret = process.env.ZOOM_CLIENT_SECRET;

const createMeeting = async (accessToken) => {
  // Set up the necessary information for the meeting
  const currentTime = new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' });
  const start_time = new Date(currentTime).toISOString();

  const meetingData = {
    topic: 'Example Meeting',
    type: 1, // 1 for instant meeting, 2 for scheduled meeting
    start_time,
    duration: 60, // Duration in minutes
    timezone: 'Africa/Cairo',
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: false,
      mute_upon_entry: false,
      approval_type: 0, // 0 for automatic approval, 1 for manual approval
      registrants_email_notification: true,
    },
  };

  let data = {};
  try {
    // Make an API request to create the meeting
    data = await axios.post(`https://api.zoom.us/v2/users/${userID}/meetings`, meetingData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    return error;
  }

  return data;
};

router.get(
  '/',
  async (req, res, next) => {
    try {
      const credentials = `${clientId}:${clientSecret}`;
      const encodedCredentials = Buffer.from(credentials).toString('base64');

      const headers = {
        Host: 'zoom.us',
        Authorization: `Basic ${encodedCredentials}`,
      };

      const response = await axios.post(
        `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountID}`,
        null,
        { headers },
      );
      const accessToken = response.data.access_token;
      console.log(accessToken);
      const data = await createMeeting(accessToken);
      res.status(200).json(data.data);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
