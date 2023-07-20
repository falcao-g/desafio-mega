function getPlayerInventory(req, res) {
  try {
    res.send({ message: 'Getting player inventory' });
  } catch (err) {
    console.error('Error while seeing player inventory', err.message);
  }
}

function getItemDetails(req, res) {
  try {
    res.send({ message: 'Getting item details' });
  } catch (err) {
    console.error('Error while seeing player inventory', err.message);
  }
}

function sellItem(req, res) {
  try {
    res.send({ message: 'Selling the item' });
  } catch (err) {
    console.error('Error while selling the item', err.message);
  }
}

module.exports = {
  getPlayerInventory,
  getItemDetails,
  sellItem,
};
