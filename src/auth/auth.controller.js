function register(req, res) {
  try {
    res.send({ message: 'Registering the player' });
  } catch (err) {
    console.error('Error while registering the player', err.message);
  }
}

function login(req, res) {
  try {
    res.send({ message: 'Logging the player' });
  } catch (err) {
    console.error('Error while logging the player', err.message);
  }
}

module.exports = {
  register,
  login,
};
