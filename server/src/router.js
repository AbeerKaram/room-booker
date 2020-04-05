const router = require('express').Router();
const {
  clientError,
  serverError,
  signup,
  login,
  logout,
  getRBookingbyDate,
  addRoom,
  deleteUser,
  getUsers,
  deleteBooking,
  getProfile,
} = require('./controllers');
const { checkAdmin, verifyUser } = require('./controllers/middleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

// only logged in access under this:
router.use(verifyUser);
router.get('/profile', getProfile);
router.get('/rooms/:date', getRBookingbyDate); // rooms/2020-04-05

router.delete('/booking/:id', deleteBooking);

// logged in + admin only acess routes:
router.use(checkAdmin);

router.post('/rooms', addRoom);
router.delete('/users/:id', deleteUser);
router.get('/getUsers', getUsers);

router.use(clientError);
router.use(serverError);

module.exports = router;
