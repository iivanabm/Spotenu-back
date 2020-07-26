import express from "express"
import { UserController } from "../controller/UserController"

export const adminRouter = express.Router();

adminRouter.get("/allbands", new UserController().allBands);
adminRouter.post("/approvebands", new UserController().approveBands);