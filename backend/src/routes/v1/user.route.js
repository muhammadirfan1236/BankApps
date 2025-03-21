const express = require("express");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/api/user.controller");
const auth = require("../../middlewares/auth");
const role = require("../../middlewares/role");

const router = express.Router();

// DEALER CRUD AND MANAGEMENT
// router
//   .route("/dealer/add")
//   .post(auth(), role(["ADMIN"]), userController.addDealer);
router.patch("/:id", auth(), userController.updateUser);

router.post("/dealer/add", auth(), role(["ADMIN"]), userController.addDealer);

router.get(
  "/dealers/all",
  auth(),
  role(["ADMIN", "INSTITUTION", "PERSONAL"]),
  userController.getAllDealers
);

router.get("/dealer/:id", auth(), role(["ADMIN"]), userController.getADealer);

router.delete(
  "/dealer/:id",
  auth(),
  role(["ADMIN"]),
  userController.deleteADealer
);

router.patch(
  "/dealer/:id",
  auth(),
  role(["ADMIN"]),
  userController.updateADealer
);

// INSTITUTION AND PERSONAL CRUD AND MANAGEMENT
router.post("/account/add", auth(), userController.addAccount);
router.get("/accounts/all", auth(), userController.getAllAccounts);
router.get("/account/:id", auth(), userController.getAAccount);
router.delete("/account/:id", auth(), userController.deleteAAccount);
router.patch("/account/:id", auth(), userController.updateAAccount);

router.get("/personals/all", auth(), userController.getAllPersonal);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users Management
 */
/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update User
 *     description: Logged in users can only update their own information. Only admins can update other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enter dealer id to get dealer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               isSocketOn:
 *                 type: boolean
 *             example:
 *               firstName: update name
 *               isSocketOn: true
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/UserResponse'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /users/dealer/add:
 *   post:
 *     summary: Add a dealer
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *               paymentRangeMin:
 *                  type: integer
 *               paymentRangeMax:
 *                  type: integer
 *               paymentMethodType:
 *                  type: integer
 *               depositStatus:
 *                  type: integer
 *               withdrawalStatus:
 *                  type: integer
 *             example:
 *               firstName: Faizan Ibrahim
 *               email: fake@example.com
 *               password: Password1@
 *               paymentRangeMin: 0
 *               paymentRangeMax: 220
 *               paymentMethodType: 0
 *               depositStatus: 1
 *               withdrawalStatus: 1
 *
 *     responses:
 *       "200":
 *         $ref: '#components/responses/UserRegistered'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */
/**
 * @swagger
 * /users/dealers/all:
 *   get:
 *     summary: Get all dealers
 *     description: Get all dealers
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Seach by email , firstName , lastName etc
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of records
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/UserResponse'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /users/dealer/{id}:
 *   get:
 *     summary: Get A Dealer
 *     description: Get A Dealer
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enter dealer id to get dealer
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/UserResponse'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /users/dealer/{id}:
 *   delete:
 *     summary: Delete A Dealer
 *     description: Delete A Dealer
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enter dealer id to delete dealer
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/UserResponse'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /users/dealer/{id}:
 *   patch:
 *     summary: Update Dealers
 *     description: Logged in users can only update their own information. Only admins can update other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enter dealer id to get dealer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: email
 *               password:
 *                 type: string
 *               payment_range_min:
 *                 type: integer
 *               payment_range_max:
 *                 type: integer
 *             example:
 *               name: update name
 *               payment_range_min: 0
 *               payment_range_max: 200
 *               email: 'update1@gmail.com'
 *               password: 'Password1'
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/UserResponse'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /users/account/add:
 *   post:
 *     summary: Add a peronal or institution account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *               name:
 *                  type: string
 *               role:
 *                  type: integer
 *               model:
 *                  type: string
 *             example:
 *               email: fake@example.com
 *               password: Password1@
 *               name: Faizan institute
 *               role: 2
 *               model: Institution
 *
 *     responses:
 *       "200":
 *         $ref: '#components/responses/UserRegistered'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */
/**
 * @swagger
 * /users/accounts/all:
 *   get:
 *     summary: Get all institutions or personals
 *     description: Get all institutions or personals
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Seach by email , name etc
 *       - in: query
 *         name: model
 *         schema:
 *           type: integer
 *         description: Enter 1 for Institution , 2 for Personal , 3 for Institution user
 *       - in: query
 *         name: type
 *         schema:
 *           type: integer
 *         description: Enter Personal type to sort by different personals
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of records
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/UserResponse'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /users/personals/all:
 *   get:
 *     summary: Get all personals
 *     description: Get all personals
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Seach by email , name etc
 *       - in: query
 *         name: type
 *         schema:
 *           type: integer
 *         description: Enter Personal type to sort by different personals
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of records
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/UserResponse'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /users/account/{id}:
 *   get:
 *     summary: Get A personal or institution
 *     description: Get A personal or institution
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enter personal or institution id to get personal or institution
 *       - in: query
 *         name: model
 *         schema:
 *           type: integer
 *         description: Enter 1 for Institution , 2 for Personal , 3 for Institution user
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/UserResponse'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /users/account/{id}:
 *   delete:
 *     summary: Delete A personal or institution
 *     description: Delete A personal or institution
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enter personal or institution id to get personal or institution
 *       - in: query
 *         name: model
 *         schema:
 *           type: integer
 *         description: Enter 1 for Institution , 2 for Personal , 3 for Institution user
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/UserResponse'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /users/account/{id}:
 *   patch:
 *     summary: Update Accounts
 *     description: Logged in users can only update their own information. Only admins can update other users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enter personal or institution id to get personal or institution
 *       - in: query
 *         name: model
 *         schema:
 *           type: integer
 *         description: Enter 1 for Institution , 2 for Personal , 3 for Institution user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: email
 *               password:
 *                 type: string
 *             example:
 *               name: update name
 *               email: 'update1@gmail.com'
 *               password: 'Password1'
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/UserResponse'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
