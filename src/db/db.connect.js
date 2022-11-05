const mongodb = require("mongodb")
let client
async function connectDB(){
    client = await mongodb.MongoClient.connect(process.env.MONGO_URI || "", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Hooray! 🎉🎉 Connected to Database.");
    return client;
}
async function getClient(){
    if (!client) {
        await connectDB();
    }
    return client;
}


module.exports=getClient