// Retrieve config from .env file
require('dotenv').config();

const {
  ZERMELO_SCHOOL,
  ZERMELO_USERNAME,
  ZERMELO_PASSWORD,
} = process.env;

if (!ZERMELO_SCHOOL) {
  throw new Error('ZERMELO_SCHOOL has not been set in your .env file');
}
if (!ZERMELO_USERNAME) {
  throw new Error('ZERMELO_USERNAME has not been set in your .env file');
}
if (!ZERMELO_PASSWORD) {
  throw new Error('ZERMELO_PASSWORD has not been set in your .env file');
}

const Promise = require('bluebird');
const Schedule = require('zermelo');
const Zermelo = new Schedule();
const Moment = require('moment');
const $ = require('jquery');
const Ractive = require('ractive');

const formatStamp = (stamp) =>
  Moment(stamp * 1000).format('HH:mm');

const DISPLAY_DATE = Moment();

var ractive = new Ractive({
  target: '#app',
  template: '#template',
  data: {
    sessions: null,
    formatStamp,
    getDisplayDate: () => {
      return DISPLAY_DATE.format('dddd, MMMM Do');
    },
  }
});

Zermelo.logOn({
  'school': ZERMELO_SCHOOL,
  'username': ZERMELO_USERNAME,
  'password': ZERMELO_PASSWORD,
}, (err) => {
  if (err) {
console.log(err);
    throw new Error(err);
  }

  const start = DISPLAY_DATE.startOf('day').unix();
  const end = DISPLAY_DATE.endOf('day').unix();

  Zermelo.getSchedule(start, end, (err, res) => {
    if (err) {
      throw new Error(err);
    }
    console.log(res);
    ractive.set('sessions', res.data);
  });
});
