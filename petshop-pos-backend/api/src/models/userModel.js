import { DataTypes } from "sequelize";
import { sequelize } from "../services/db.js";

export const User = sequelize.define("User", {
  document: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "vendedor"),
    allowNull: false,
  },
});
