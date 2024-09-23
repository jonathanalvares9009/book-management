const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Book", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    published_date: {
      type: DataTypes.DATE,
    },
    author_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Authors",
        key: "id",
      },
      allowNull: true, // Adjust based on whether author_id is required
    },
  });
};
