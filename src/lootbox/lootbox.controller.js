function listLootboxes(req, res) {
  try {
    res.send({ message: 'Listing lootboxes in the shop' });
  } catch (err) {
    console.error('Error while listing lootboxes', err.message);
  }
}

function buyLootboxes(req, res) {
  try {
    res.send({ message: 'Buying lootboxes' });
  } catch (err) {
    console.error('Error while buying lootboxes', err.message);
  }
}

module.exports = {
  listLootboxes,
  buyLootboxes,
};
