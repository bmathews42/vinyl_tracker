const {
  pool,
  createUserTable,
  createVinylTable,
} = require("./methods");

async function seedDatabase() {
  try {
    await pool.getConnection();
  } catch (err) {
    console.error(
      "\x1b[1m\x1b[38;5;208m%s\x1b[0m", // This is just for colorizing the text in the console
      "!! You need to start your MySQL server first !!"
    );
  }

  await createUserTable();
  await createVinylTable();
}

module.exports = { seedDatabase };
