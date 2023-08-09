const controller = require('./player.controller');

const OK = 200;
const IM_A_TEAPOT = 418;

async function getPlayerInfo(req, res) {
  try {
    const playerId = controller.getPlayerId(req);
    const profile = await controller.getPlayerProfile(playerId);
    res.status(OK).send(profile);
  } catch (err) {
    res.status(err.httpStatus).send({ message: err.message });
  }
}

async function editPlayerInfo(req, res) {
  try {
    res.status(IM_A_TEAPOT).send({ message: 'TODO' });
    // const player = controller.getPlayerById(req.body.payload?.playerId);
  } catch (err) {
    res.status(err.httpStatus).send({ message: err.message });
  }
}

async function depositFunds(req, res) {
  try {
    const player = controller.getPlayerById(req.body.payload?.playerId);
    const depositQuantity = controller.getDepositQuantity(req);
    await controller.addFundsTo(player, depositQuantity);
  } catch (err) {
    res.status(err.httpStatus).send({ message: err.message });
  }
}

module.exports = {
  getPlayerInfo,
  editPlayerInfo,
  depositFunds,
};
