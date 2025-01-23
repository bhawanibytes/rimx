const { Router } = require("express");
const authRouter = Router();

authRouter.get("/health", (req, res) => {
  res.send("Health of authRouter is fine");
});

authRouter.post("/signup", (req, res) => {
  res.send("Hello World from login");
});

module.exports = authRouter;