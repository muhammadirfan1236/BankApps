const express = require("express");
const validate = require("../../middlewares/validate");

const depositController = require("../../controllers/api/deposit.controller");
const auth = require("../../middlewares/auth");
const role = require("../../middlewares/role");

const router = express.Router();

router.post("/", auth(), role(["PERSONAL"]), depositController.storeDeposit);
router.get("/:id", auth(), depositController.getADeposit);
router.get("/all/get", auth(), depositController.getAllDeposit);
router.delete("/:id", auth(), depositController.deleteADeposit);
router.patch("/:id", auth(), depositController.updateADeposit);
router.get("/get/paymentAccount", depositController.getAPaymentAccount);
router.get(
  "/get/dealerAccount/withdrawal",
  depositController.getADealerWithdrawal
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Deposits
 *   description: Deposits Management
 */
/**
 * @swagger
 * /deposits:
 *   post:
 *     summary: Add a deposit
 *     tags: [Deposits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recieverId:
 *                 type: string
 *               senderId:
 *                 type: string
 *               typeId:
 *                 type: string
 *               name:
 *                  type: string
 *               iban:
 *                  type: string
 *               amount:
 *                  type: number
 *             example:
 *               recieverId: 674e1baea83f74879648eefd
 *               senderId: 674e1baea83f74879648eefd
 *               typeId: 67499e413a748fa341933d6a
 *               name: opsecXPersonal
 *               iban: BR12 0012 0012 0012 0012 0012 02
 *               amount: 10
 *     responses:
 *       "200":
 *         $ref: '#components/responses/UserRegistered'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */
/**
 * @swagger
 * /deposits/{id}:
 *   get:
 *     summary: Get A deposit
 *     description: Get A deposit
 *     tags: [Deposits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enter deposit id to get deposit
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
 * /deposits/all/get:
 *   get:
 *     summary: Get all deposits
 *     description: Get all deposits
 *     tags: [Deposits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Seach by name , iban , amount etc
 *       - in: query
 *         name: senderId
 *         schema:
 *           type: string
 *         description: Enter senderId to search by personals
 *       - in: query
 *         name: recieverId
 *         schema:
 *           type: string
 *         description: Enter recieverID to search by admin or dealers
 *       - in: query
 *         name: typeId
 *         schema:
 *           type: string
 *         description: Enter typeId to search by payment method
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Enter status to filter by status
 *       - in: query
 *         name: minDate
 *         schema:
 *           type: string
 *         description: Enter minDate to filter by minDate
 *       - in: query
 *         name: maxDate
 *         schema:
 *           type: string
 *         description: Enter maxDate to filter by maxDate
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
 * /deposits/{id}:
 *   patch:
 *     summary: Update deposit
 *     description: Logged in users can only update their own information. Only admins can update other users.
 *     tags: [Deposits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enter deposit id to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: number
 *             example:
 *               status: 1
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
 * /deposits/{id}:
 *   delete:
 *     summary: Delete A deposit
 *     description: Delete A deposit
 *     tags: [Deposits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enter deposit id to delete deposit
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
 * /deposits/get/paymentAccount:
 *   get:
 *     summary: Get all deposits
 *     description: Get all deposits
 *     tags: [Deposits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: amount
 *         schema:
 *           type: number
 *         description: Seach by closest amount to limit
 *       - in: query
 *         name: typeId
 *         schema:
 *           type: string
 *         description: Enter typeId to search by payment method
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
