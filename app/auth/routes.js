const router = require('express').Router();
const authController = require('./controller');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//defaulnya username tapi diubah  // ini manggil localStrategy
passport.use(new LocalStrategy({ usernameField: 'email' }, authController.localStrategy));
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.me);
router.post('/change-password/:id', authController.update);

module.exports = router;