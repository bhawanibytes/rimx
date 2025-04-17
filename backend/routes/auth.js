import { Router } from 'express'
const authRouter = Router();
import { login, signup } from '../controllers/authController.js'

authRouter.get("/health", (req, res) => {
  res.send("Health of authRouter is fine");
});

authRouter.post("/signup", signup)
authRouter.post("/login", login)

export {
  authRouter
}
export default authRouter;