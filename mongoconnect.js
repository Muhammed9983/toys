const mongoose = require("mongoose");

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://localhost:3001/monkeys24");
  console.log("mongo connect monkeys24 a");
}
