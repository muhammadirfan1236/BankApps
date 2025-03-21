const express = require("express");
const validate = require("../../middlewares/validate");

const paymentController = require("../../controllers/api/payment.controller");
const auth = require("../../middlewares/auth");
const role = require("../../middlewares/role");

const router = express.Router();

router.post(
  "/type/add",
  auth(),
  role(["ADMIN", "DEALER"]),
  paymentController.addPaymentMethodType
);
router.get(
  "/type/:id",
  auth(),
  role(["ADMIN", "DEALER"]),
  paymentController.getAPaymentMethodType
);
router.get(
  "/type/all/get",
  // role(["ADMIN", "DEALER", "PERSONAL"]),
  paymentController.getAllPaymentMethodType
);

router.post(
  "/add",
  auth(),
  role(["ADMIN", "DEALER"]),
  paymentController.addPaymentMethod
);
router.get(
  "/:id",
  auth(),
  role(["ADMIN", "DEALER"]),
  paymentController.getAPaymentMethod
);
router.get(
  "/all/get",
  auth(),
  role(["ADMIN", "DEALER"]),
  paymentController.getAllPaymentMethods
);
router.patch(
  "/:id",
  auth(),
  role(["ADMIN", "DEALER"]),
  paymentController.updateAPaymentMethod
);
router.delete(
  "/:id",
  auth(),
  role(["ADMIN", "DEALER"]),
  paymentController.deleteAPaymentMethod
);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: PaymentMethods
 *   description: PaymentMethods Management
 */
/**
 * @swagger
 * /paymentMethods/type/add:
 *   post:
 *     summary: Add a payment method type
 *     tags: [PaymentMethods]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                  type: boolean
 *               isParent:
 *                  type: boolean
 *             example:
 *               name: Fsample method
 *               description: It is a goood method
 *               status: true
 *               isParent: false
 *     responses:
 *       "200":
 *         $ref: '#components/responses/UserRegistered'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */
/**
 * @swagger
 * /paymentMethods/type/{id}:
 *   get:
 *     summary: Get A paymentMethod type
 *     description: Get A paymentMethod type
 *     tags: [PaymentMethods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enter paymentMethod type id to get paymentMethod
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
 * /paymentMethods/type/all/get:
 *   get:
 *     summary: Get all paymentMethod types
 *     description: Get all paymentMethod types
 *     tags: [PaymentMethods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Seach by name , description etc etc
 *       - in: query
 *         name: isParent
 *         schema:
 *           type: number
 *         description: Seach by isParent
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
 * /paymentMethods/add:
 *   post:
 *     summary: Add a payment method
 *     tags: [PaymentMethods]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dealerId:
 *                 type: string
 *               typeId:
 *                 type: string
 *               name:
 *                  type: string
 *               detail:
 *                 type: string
 *               paymentMinLimit:
 *                 type: number
 *               paymentMaxLimit:
 *                  type: number
 *               totalLimit:
 *                 type: string
 *               currency:
 *                 type: string
 *               isFull:
 *                  type: boolean
 *               fastTransferStatus:
 *                  type: number
 *               bankAccountStatus:
 *                  type: number
 *             example:
 *               dealerId: 672e050e7f762523835d1eec
 *               typeId: 6735b1192772b4aad9f2449e
 *               name: sample name
 *               detail: sample detail
 *               paymentMinLimit: 0
 *               paymentMaxLimit: 1000
 *               totalLimit: 10000
 *               currency: USD
 *               isFull: false
 *               fastTransferStatus: 1
 *               bankAccountStatus: 1
 *     responses:
 *       "200":
 *         $ref: '#components/responses/UserRegistered'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */
/**
 * @swagger
 * /paymentMethods/{id}:
 *   get:
 *     summary: Get A paymentMethod
 *     description: Get A paymentMethod
 *     tags: [PaymentMethods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enter paymentMethods id to get paymentMethods
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
 * /paymentMethods/all/get:
 *   get:
 *     summary: Get all paymentMethods
 *     description: Get all paymentMethods
 *     tags: [PaymentMethods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Seach by name , detail , paymentMinLimit , currenct etc
 *       - in: query
 *         name: typeId
 *         schema:
 *           type: string
 *         description:  Enter type id to search by payment method
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description:  Enter userId to search by user
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
 * /paymentMethods/{id}:
 *   patch:
 *     summary: Update Payment Methods
 *     description: Logged in users can only update their own information. Only admins can update other users.
 *     tags: [PaymentMethods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enter payment method id to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               typeId:
 *                 type: string
 *               name:
 *                  type: string
 *               detail:
 *                 type: string
 *               paymentMinLimit:
 *                 type: number
 *               paymentMaxLimit:
 *                  type: number
 *               totalLimit:
 *                 type: string
 *               currency:
 *                 type: string
 *               isFull:
 *                  type: boolean
 *               fastTransferStatus:
 *                  type: number
 *               bankAccountStatus:
 *                  type: number
 *             example:
 *               typeId: 6735b1192772b4aad9f2449e
 *               name: sample name
 *               detail: sample detail
 *               paymentMinLimit: 0
 *               paymentMaxLimit: 1000
 *               totalLimit: 10000
 *               currency: USD
 *               isFull: false
 *               fastTransferStatus: 1
 *               bankAccountStatus: 1
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
 * /paymentMethods/{id}:
 *   delete:
 *     summary: Delete A payment method
 *     description: Delete A payment method or institution
 *     tags: [PaymentMethods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enter payment method id to delete payment method
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
