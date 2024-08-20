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
      type: DataTypes.DATEONLY,
    },
  });
};
