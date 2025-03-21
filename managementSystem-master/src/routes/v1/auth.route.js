const express = require("express");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");
const authController = require("../../controllers/api/auth.controller");

const router = express.Router();

// router.post(
//   "/register",
//   // validate(authValidation.register),
//   authController.register
// );

// router.post(
//   "/login/social",
//   validate(authValidation.loginSocial),
//   authController.loginSocial
// );

router.post("/login", validate(authValidation.login), authController.login);
router.post("/logout", validate(authValidation.logout), authController.logout);
router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);
router.post(
  "/reset-password/verify-otp",
  validate(authValidation.verifyResetPasswordOTP),
  authController.verifyResetPasswordOTP
);
router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  authController.resetPassword
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

// /**
//  * @swagger
//  * /auth/register:
//  *   post:
//  *     summary: Register as user
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - email
//  *               - password
//  *             properties:
//  *               firstName:
//  *                 type: string
//  *               lastName:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *                 format: email
//  *                 description: must be unique
//  *               password:
//  *                 type: string
//  *                 format: password
//  *                 minLength: 8
//  *                 description: At least one number and one letter
//  *               age:
//  *                  type: integer
//  *               height:
//  *                  type: float
//  *               weight:
//  *                  type: float
//  *               city:
//  *                  type: string
//  *               postalCode:
//  *                  type: string
//  *               gender:
//  *                  type: integer
//  *               religion:
//  *                  type: integer
//  *               relationshipIntention:
//  *                  type: integer
//  *             example:
//  *               firstName: fake
//  *               lastName: Name
//  *               email: fake@example.com
//  *               password: password1
//  *               age: 22
//  *               height: 24.5
//  *               weight: 54.6
//  *               city: Lahore
//  *               postalCode: 20456
//  *               gender: 0
//  *               religion: 2
//  *               relationshipIntention: 2
//  *
//  *
//  *     responses:
//  *       "200":
//  *         $ref: '#components/responses/UserRegistered'
//  *       "400":
//  *         $ref: '#/components/responses/DuplicateEmail'
//  */

// /**
//  * @swagger
//  * /auth/login/social:
//  *   post:
//  *     summary: Login/Register a user with Social Media
//  *     description: "Types facebook = 1, google = 2, apple = 3"
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - firstName
//  *               - lastName
//  *               - email
//  *               - type
//  *             properties:
//  *               firstName:
//  *                 type: string
//  *               lastName:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *                 format: email
//  *                 description: must be unique
//  *               type:
//  *                 type: number
//  *                 enum: [1, 2, 3]
//  *                 description: facebook= 1, google= 2, apple= 3
//  *               facebookId:
//  *                  type: string
//  *               googleId:
//  *                  type: string
//  *               appleId:
//  *                  type: string
//  *               phoneNumber:
//  *                  type: string
//  *               token:
//  *                  type: string
//  *               profileImage:
//  *                  type: string
//  *             example:
//  *               firstName: fake
//  *               lastName: Name
//  *               email: fake@example.com
//  *               type: 1
//  *               token: social auth token
//  *               facebookId: facebook Id
//  *               googleId: google Id
//  *               appleId: apple Id
//  *               phoneNumber: "1231234"
//  *               profileImage: Image URL
//  *     responses:
//  *       "200":
//  *         $ref: '#/components/responses/LoginSuccess'
//  *       "400":
//  *         $ref: '#/components/responses/BadRequest'
//  */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login User
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - type
 *               - facebookId
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: user@user.com
 *               password: user1234
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/LoginSuccess'
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid email or password
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/OK'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: An email will be sent to reset password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             example:
 *               email: fake@example.com
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/ForgotPassword'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /auth/reset-password/verify-otp:
 *   post:
 *     summary: Verify Reset password OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - otp
 *             properties:
 *               userId:
 *                 type: string
 *                 description: userId from forgot password response
 *               otp:
 *                 type: string
 *             example:
 *               userId: 'userId'
 *               otp: '000000'
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/OK'
 *       "400":
 *         description: Password reset failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: Password reset failed
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - userId
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *               userId:
 *                 type: string
 *                 description: userId from forgot password response
 *             example:
 *               password: password1
 *               userId: 'userId'
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/OK'
 *       "400":
 *         description: Password reset failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: Password reset failed
 */
