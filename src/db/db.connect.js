const mongodb = require("mongodb");
let client;
async function connectDB() {
  const uri =
    process.env.NODE_ENV == "test" ? process.env.TEST_DB : process.env.PROD_DB;
  console.log(process.env.NODE_ENV);
  console.log(process.env.PROD_DB);
  console.log(uri);
  client = await mongodb.MongoClient.connect(uri || "", {
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
