const Boom = require('@hapi/boom');
const nodemailer = require('nodemailer');
const ical = require('ical-generator');
const Moment = require('moment');
const moment = require('../utils/moment-range');
const { getBookingbydate } = require('../database/queries');
const bookingSchema = require('./validation/bookingSchema');
const {
  bookRoom,
  getBookingByRoomId,
  getUserById,
} = require('../database/queries');
require('env2')('./config.env');

const getRBookingbyDate = (req, res, next) => {
  getBookingbydate(req.params.date)
    .then(({ rows }) => {
      if (rows.length === 0) {
        res.json([]);
      } else {
        res.json(rows);
      }
    })
    .catch(next);
};

const checkOverlap = (arrOfIntervals, interval) =>
  arrOfIntervals.filter((existingInterval) =>
    existingInterval.overlaps(interval)
  );

const bookingRoom = (req, res, next) => {
  const { roomId, time, title, description, remindMe } = req.body;
  const { userID: userId } = req.user;
  let bookingData = [];
  bookingSchema
    .validateAsync(
      {
        roomId,
        time,
        title,
        description,
        remindMe,
      },
      { abortEarly: false }
    )
    .catch((err) => {
      throw Boom.badRequest(err.details.map((e) => e.message).join('\n'));
    })
    .then(() =>
      time.map(({ startTime: time1, endTime: time2 }) =>
        moment.range(time1, time2)
      )
    )
    .then((intervals) =>
      intervals
        .map((e) =>
          checkOverlap(
            intervals.filter((v) => v !== e),
            e
          )
        )
        .flat()
    )
    .then((overlaps) => {
      if (overlaps.length)
        throw Boom.badRequest('your bookings are overlaping', overlaps);
      return getBookingByRoomId(roomId);
    })
    .then(({ rows }) =>
      // transform all those existing bookings to moment-range intervals
      rows.map(({ start_time: existingStartTime, end_time: existingEndTime }) =>
        moment.range(existingStartTime, existingEndTime)
      )
    )
    .then((arrOfIntervals) =>
      // check all new bookings intervals if they overlap
      time
        .map(({ startTime, endTime }) =>
          checkOverlap(arrOfIntervals, moment.range(startTime, endTime))
        )
        .flat()
    )
    .then((overlapsArr) => {
      if (overlapsArr.length)
        throw Boom.badRequest(
          'Other bookings already exist in the requested interval',
          overlapsArr
        );
      return bookRoom(time, roomId, userId, title, description);
    })
    // eslint-disable-next-line consistent-return
    .then(({ rows }) => {
      bookingData = rows;
      return bookingData;
    })
    .then((result) => res.status(201).json({ newBookings: result }))
    .then(() => {
      if (remindMe) {
        return getUserById(userId);
      }
      return res.end();
    })
    .then(({ rows }) => ({ email: rows[0].email, name: rows[0].name }))
    // eslint-disable-next-line no-unused-vars
    .then(({ email }) => {
      const cal = ical({
        events: bookingData.map((row) => ({
          start: Moment(row.start_time),
          end: Moment(row.end_time),
          summary: row.title,
          description: row.description,
        })),
      }).toString();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
      const msg = {
        from: `"ROOM BOOKER - Gaza Sky Geeks" <${process.env.EMAIL}>`,
        to: 'linahjamal89@gmail.com',
        subject: 'Room booking',
        html: 'here is your room booking',
        icalEvent: {
          filename: 'bookingRoom.ics',
          method: 'request',
          content:
            'BEGIN:VCALENDAR\r\nPRODID:-//ACME/DesktopCalendar//EN\r\nMETHOD:REQUEST\r\nVERSION:2.0\r\n...',
        },
        // 'BEGIN:VCALENDAR\r\nPRODID:-//ACME/DesktopCalendar//EN\r\nMETHOD:REQUEST\r\n...';
        alternatives: [
          {
            contentType: 'text/calendar',
            content: Buffer.from(cal.toString()),
          },
        ],
      };

      transporter.sendMail(msg).catch(console.error);
    })
    .catch(next);
};
module.exports = { getRBookingbyDate, bookingRoom };
