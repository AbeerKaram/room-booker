/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../src/app');
const dbBuild = require('../src/database/config/build');
const connection = require('../src/database/config/connection.js');

beforeEach(() => dbBuild());

test('make new booking no overlapping', (done) => {
  request(app)
    .post('/api/v1/booking')
    .set({
      'Content-Type': 'application/json',
    })
    .set('Cookie', [
      'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjIsInJvbGUiOnRydWUsImlhdCI6MTU4NTgxNTc1MX0.SpdrsYcfCym_CIgCM4nocmHMULnF0yVx2DzkoMRFFqM',
    ])
    .send(
      JSON.stringify({
        roomId: 1,
        description: 'New Meeting',
        startTime: '2020-04-14 12:00:00',
        endTime: '2020-04-14 14:00:00',
      })
    )
    .expect(201)
    .end((err) => {
      if (err) return done(err);
      return done();
    });
});

test('make new booking no overlapping between 2020-04-14 14:30:00-2020-04-14 16:00:00 ', (done) => {
  request(app)
    .post('/api/v1/booking')
    .set({
      'Content-Type': 'application/json',
    })
    .set('Cookie', [
      'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjIsInJvbGUiOnRydWUsImlhdCI6MTU4NTgxNTc1MX0.SpdrsYcfCym_CIgCM4nocmHMULnF0yVx2DzkoMRFFqM',
    ])
    .send(
      JSON.stringify({
        roomId: 1,
        description: 'New Meeting',
        startTime: '2020-04-14 14:30:00',
        endTime: '2020-04-14 16:00:00',
      })
    )
    .expect(201)
    .end((err) => {
      if (err) return done(err);
      return done();
    });
});

test('make new booking no overlapping between 2020-04-13 14:30:00-2020-04-13 16:00:00 ', (done) => {
  request(app)
    .post('/api/v1/booking')
    .set({
      'Content-Type': 'application/json',
    })
    .set('Cookie', [
      'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjIsInJvbGUiOnRydWUsImlhdCI6MTU4NTgxNTc1MX0.SpdrsYcfCym_CIgCM4nocmHMULnF0yVx2DzkoMRFFqM',
    ])
    .send(
      JSON.stringify({
        roomId: 1,
        description: 'New Meeting',
        startTime: '2020-04-13 14:30:00',
        endTime: '2020-04-13 16:00:00',
      })
    )
    .expect(201)
    .end((err) => {
      if (err) return done(err);
      return done();
    });
});

test('make the same booking no overlapping repeated in five day  between 2020-04-19 14:30:00-2020-04-19 16:00:00 ', (done) => {
  request(app)
    .post('/api/v1/booking')
    .set({
      'Content-Type': 'application/json',
    })
    .set('Cookie', [
      'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjIsInJvbGUiOnRydWUsImlhdCI6MTU4NTgxNTc1MX0.SpdrsYcfCym_CIgCM4nocmHMULnF0yVx2DzkoMRFFqM',
    ])
    .send(
      JSON.stringify({
        roomId: 1,
        description: 'New Meeting',
        startTime: '2020-04-19 14:30:00',
        endTime: '2020-04-19 16:00:00',
      }),
      JSON.stringify({
        roomId: 1,
        description: 'New Meeting',
        startTime: '2020-04-20 14:30:00',
        endTime: '2020-04-20 16:00:00',
      }),
      JSON.stringify({
        roomId: 1,
        description: 'New Meeting',
        startTime: '2020-04-21 14:30:00',
        endTime: '2020-04-21 16:00:00',
      }),
      JSON.stringify({
        roomId: 1,
        description: 'New Meeting',
        startTime: '2020-04-22 14:30:00',
        endTime: '2020-04-22 16:00:00',
      }),
      JSON.stringify({
        roomId: 1,
        description: 'New Meeting',
        startTime: '2020-04-23 14:30:00',
        endTime: '2020-04-23 16:00:00',
      })
    )

    .expect(201)
    .end((err) => {
      if (err) return done(err);
      return done();
    });
});

test('make new booking with overlapping between 2020-04-14 16:00:00-2020-04-14 16:30:00  ', (done) => {
  request(app)
    .post('/api/v1/booking')
    .set({
      'Content-Type': 'application/json',
    })
    .set('Cookie', [
      'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjIsInJvbGUiOnRydWUsImlhdCI6MTU4NTgxNTc1MX0.SpdrsYcfCym_CIgCM4nocmHMULnF0yVx2DzkoMRFFqM',
    ])
    .send(
      JSON.stringify({
        roomId: 1,
        description: 'New Meeting',
        startTime: '2020-04-14 16:00:00',
        endTime: '2020-04-14 16:30:00',
      })
    )
    .expect(400)
    .end((err) => {
      if (err) return done(err);
      return done();
    });
});

test('make new booking with overlapping between 2020-04-14 14:00:00-2020-04-14 15:00:00 ', (done) => {
  request(app)
    .post('/api/v1/booking')
    .set({
      'Content-Type': 'application/json',
    })
    .set('Cookie', [
      'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjIsInJvbGUiOnRydWUsImlhdCI6MTU4NTgxNTc1MX0.SpdrsYcfCym_CIgCM4nocmHMULnF0yVx2DzkoMRFFqM',
    ])
    .send(
      JSON.stringify({
        roomId: 1,
        description: 'New Meeting',
        startTime: '2020-04-14 14:00:00',
        endTime: '2020-04-14 15:00:00',
      })
    )
    .expect(400)
    .end((err) => {
      if (err) return done(err);
      return done();
    });
});

test('make new booking with overlapping', (done) => {
  request(app)
    .post('/api/v1/booking')
    .set({
      'Content-Type': 'application/json',
    })
    .set('Cookie', [
      'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjIsInJvbGUiOnRydWUsImlhdCI6MTU4NTgxNTc1MX0.SpdrsYcfCym_CIgCM4nocmHMULnF0yVx2DzkoMRFFqM',
    ])
    .send(
      JSON.stringify({
        roomId: 1,
        description: 'New Meeting',
        startTime: '2020-04-14 14:00:00',
        endTime: '2020-04-14 16:00:00',
      })
    )
    .expect(400)
    .end((err) => {
      if (err) return done(err);
      return done();
    });
});

afterAll(() => connection.end());
