const { getUserById } = require('../database/queries');

module.exports = (req, res) => {
  getUserById(req.user.userID).then((users) => {
    if (users.rowCount === 0) {
      res.status(404).json([]);
    } else res.json(users.rows[0]);
  });
};
