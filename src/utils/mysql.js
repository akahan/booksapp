const mysql = require("mysql2/promise");
import config from "../../config";

export default () => mysql.createPool(config.mysql);
