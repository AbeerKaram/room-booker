const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const { patchProfile, getUserWithPassword } = require('../database/queries');
const profileScema = require('./validation/profileSchema');

module.exports = (req, res, next) => {
  const { userID } = req.user;
  const { name, oldPassword = '', password } = req.body;

  profileScema
    .validateAsync({ name, password }, { abortEarly: false })
    .catch((error) => {
      throw Boom.badRequest(error);
    })
    .then(() => getUserWithPassword(userID))
    .then((users) => {
      if (users.rows.length === 0) {
        throw Boom.notFound('user does not exists');
      }
      return users.rows[0].password;
    })
    .then((hashed) => bcrypt.compare(oldPassword, hashed))
    .then((match) => {
      if (!match) {
        throw Boom.badRequest('old password is wrong');
      }
    })
    .then(() => bcrypt.hash(password, 10))
    .then((hash) => patchProfile(userID, name, hash))
    .then((results) => res.send(results.rows.length !== 0))
    .catch(next);
};
