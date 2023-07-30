const { api } = require('./api');

const port = process.env.PORT;

api.listen(port, () => {
  console.log(`API running on ${port}`);
});
