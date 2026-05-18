const bcrypt = require("bcryptjs");

const password = "Lorcana2025!";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function (err, hash) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(hash);
});
