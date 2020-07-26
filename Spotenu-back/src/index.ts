import { AddressInfo } from "net";
import dotenv from "dotenv";
import express from "express";
import { userRouter } from "./Router/UserRouter";
import { adminRouter } from "./Router/AdminRouter";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/user", userRouter);
app.use("/bandsignup", userRouter);
app.use("/allbands", adminRouter);
app.use("/approvebands", adminRouter);

const server = app.listen(3000, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Servidor rodando em http://localhost:${address.port}`);
  } else {
    console.error(`Falha ao rodar o servidor.`);
  }
});