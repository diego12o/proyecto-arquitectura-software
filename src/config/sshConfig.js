require("dotenv").config();

const sshConfig = {
  host: "200.14.84.16",
  port: 8080,
  username: process.env.UDP_USERNAME,
  password: process.env.UDP_PASSWORD,
};

const targetHost = "localhost";
const targetPort = 5000;

module.exports = {
  sshConfig,
  targetHost,
  targetPort,
};
