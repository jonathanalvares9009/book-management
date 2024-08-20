const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Author", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    biography: {
      type: DataTypes.TEXT,
    },
    born_date: {
      type: DataTypes.DATEONLY,
    },
  });
};
