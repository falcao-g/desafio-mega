const path = require('path');
const controller = require('./player.controller');
const { ValidationError } = require('../error/ValidationError');

const OK = 200;

async function getPlayerInfo(req, res) {
  try {
    const playerId = await controller.getPlayerId(req);
    const profile = await controller.getPlayerProfile(playerId);
    res.status(OK).send(profile);
  } catch (err) {
    res.status(err.httpStatus ?? 500).send({ message: err.message });
  }
}

async function editPlayerInfo(req, res) {
  try {
    if (!req.file) throw new ValidationError('Missing file or file is not an image');
    const { name, password } = req.query;
    const picturePath = path.relative(path.resolve(__dirname, '../..'), req.file.path);
    const player = await controller.getPlayerById(req.player.uuid);
    const message = await controller.editPlayer(player, name, password, picturePath);
    res.status(OK).send({ message });
  } catch (err) {
    res.status(err.httpStatus ?? 500).send({ message: err.message });
  }
}

async function depositFunds(req, res) {
  try {
    const player = await controller.getPlayerById(req.player.uuid);
    const depositQuantity = controller.getDepositQuantity(req);
    const message = await controller.addFundsTo(player, depositQuantity);
    res.status(OK).send({ message });
  } catch (err) {
    res.status(err.httpStatus ?? 500).send({ message: err.message });
  }
}

module.exports = {
  getPlayerInfo,
  editPlayerInfo,
  depositFunds,
};
