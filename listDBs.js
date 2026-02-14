const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017"; // Mongo local

async function listDatabases() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const dbs = await client.db().admin().listDatabases();
    console.log("Bases locales :");
    dbs.databases.forEach(db => console.log(" - " + db.name));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

listDatabases();
