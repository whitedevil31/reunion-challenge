const mongodb = require("mongodb");
let client;
async function connectDB() {
  let dbUri = "";
  dbUri =
    process.env.NODE_ENV == "test" ? process.env.TEST_DB : process.env.PROD_DB;

  if (process.env.NODE_ENV == "dockerStart") {
    dbUri = "mongodb://mongo/reunion";
  }

  client = await mongodb.MongoClient.connect(dbUri || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = process.env.NODE_ENV == "test" ? "TEST" : "PROD";
  console.log(`Hooray! 🎉🎉 Connected to ${db} Database.`);
  return client;
}
async function getClient() {
  if (!client) {
    await connectDB();
  }
  return client;
}

module.exports = getClient;
