const { sequelize } = require("../models");
const mongoose = require("mongoose");

const startServer = async (app, port) => {
  try {
    // Wait for PostgreSQL to be ready
    await sequelize.authenticate();
    console.log("PostgreSQL connection has been established successfully.");

    // Sync Sequelize models
    await sequelize.sync();
    console.log("PostgreSQL models synced successfully.");

    // Wait for MongoDB to be ready
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connection has been established successfully.");

    // Start the server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/graphql`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
  }
};

module.exports = startServer;
