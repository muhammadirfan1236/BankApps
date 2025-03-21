// eslint-disable-next-line import/no-extraneous-dependencies
const socketIO = require("socket.io");
const { api } = require("../config/messages");
const { depositService } = require("../services");
const {
  User,
  Personal,
  Institution,
  PaymentMethodType,
  Dealer,
  PaymentMethod,
} = require("../models");
const { personalType } = require("../config/user");

const socketConnection = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "*",
    },
    addTrailingSlash: false,
  });
  io.on("connection", async (socket) => {
    console.log("A client connected:", socket.id);

    // create deposit
    socket.on("new-deposit", async (data) => {
      try {
        let deposit = await depositService.addDeposit(data);
        if (!deposit) {
          return socket.emit("deposit-error", {
            message: api.internalServerError,
          });
        }
        const personalPromise = Personal.findOne({ _id: data?.senderId });
        const paymentMethodPromise = PaymentMethod.findOne({
          _id: data?.paymentMethodId,
        });
        const paymentMethodTypePromise = PaymentMethodType.findOne({
          _id: data?.typeId,
        });
        const dealerPromise = Dealer.findOne({ _id: data?.recieverId });

        const [personal, paymentMethodType, dealer, paymentMethod] =
          await Promise.all([
            personalPromise,
            paymentMethodTypePromise,
            dealerPromise,
            paymentMethodPromise,
          ]);

        let institution = null;
        if (personal?.personalHolderId) {
          institution = await Institution.findOne({
            _id: personal.personalHolderId,
          });
        }

        deposit = {
          ...deposit._doc,
          personal: personal || null,
          institution: institution || null,
          paymentMethod: paymentMethod || null,
          paymentMethodType: paymentMethodType || null,
          dealer: dealer || null,
        };
        // Emit success to the client who initiated the event
        socket.emit("deposit-success", deposit);

        // const allDeposits = await depositService.getAllDeposits({});
        /// sending deposits to concerned persons
        // io.to(deposit?.recieverId).emit("allDeposits", allDeposits);
        io.sockets.emit("newDeposit", deposit); // Receiver
        // io.to("672e05607f762523835d1f01").emit("newDeposit", deposit); // Sender
        // io.to(senderUser?.id).emit("newDeposit", deposit); // Logged-in user
        // io.to(senderUser?._id.toString()).emit("newDeposit", deposit);
      } catch (error) {
        socket.emit("deposit-error", { message: error.message });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A client disconnected:", socket.id);
    });
  });
  return io;
};

module.exports = {
  socketConnection,
};
