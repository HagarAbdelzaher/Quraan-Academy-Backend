/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const { BaseError, Requester } = require('../libs');

const accountID = process.env.ZOOM_ACCOUNT_ID;
const clientId = process.env.ZOOM_CLIENT_ID;
const clientSecret = process.env.ZOOM_CLIENT_SECRET;

const _accessToken = async () => {
  try {
    const credentials = `${clientId}:${clientSecret}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');

    const headers = {
      Host: 'zoom.us',
      Authorization: `Basic ${encodedCredentials}`,
    };
    const zoomRequest = new Requester('https://zoom.us');
    const response = await zoomRequest
      .on('oauth/token')
      .injectQueryParam('grant_type', 'account_credentials')
      .injectQueryParam('account_id', accountID)
      .post(null, headers);

    const token = response.data.access_token;
    return token;
  } catch (error) {
    throw new BaseError(error, 400);
  }
};

const createMeeting = async (userId, topic) => {
  try {
    const token = await _accessToken();
    // Set up the necessary information for the meeting
    const currentTime = new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' });
    const start_time = new Date(currentTime).toISOString();
    const meetingData = {
      topic,
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
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    // Make an API request to create the meeting
    const zoomRequest = new Requester('https://zoom.us');
    const data = await zoomRequest
      .on(`v2/users/${userId}/meetings`)
      .post(meetingData, headers);
    return data.data;
  } catch (error) {
    throw new BaseError(error, 400);
  }
};

const createUser = async (user) => {
  try {
    const token = await _accessToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const payload = {
      action: 'create',
      user_info: {
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        display_name: `${user.firstName} ${user.lastName}`,
        password: user.password,
        type: 1,
      },
    };
    const zoomRequest = new Requester('https://zoom.us');
    const data = await zoomRequest
      .on('v2/users/')
      .post(payload, headers);
    return data.data;
  } catch (error) {
    throw new BaseError(error, 400);
  }
};

const deleteUser = async (userId) => {
  try {
    const token = await _accessToken();
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const zoomRequest = new Requester('https://zoom.us');
    const data = await zoomRequest
      .on(`v2/users/${userId}`)
      .delete(null, headers);
    return data.data;
  } catch (error) {
    throw new BaseError(error, 400);
  }
};

module.exports = {
  _accessToken,
  createUser,
  deleteUser,
  createMeeting,
};
