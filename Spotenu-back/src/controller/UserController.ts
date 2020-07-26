import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { IdGenerator } from "../service/IdGenerator";
import { HashManager } from "../service/HashManager";
import { Authenticator } from "../service/Authenticator";
import { UserDatabase } from "../data/UserDatabase";
import { BaseDatabase } from "../data/BaseDatabase";


const userBusiness: UserBusiness = new UserBusiness();
const userDb: UserDatabase = new UserDatabase();
const idGenerator = new IdGenerator();
const hashManager = new HashManager();
const auth = new Authenticator();

export class UserController {
  async signUp(req: Request, res: Response) {
    try {
      const userData = {
        name: req.body.name,
        email: req.body.email,
        nickname: req.body.nickname,
        password: req.body.password,
        role: req.body.role
      };

      if (!userData.name) {
        throw new Error("Invalid Name");
      }

      if (
        (!userData.email && userData.email.indexOf("@") === -1) ||
        userData.email.indexOf(".com") === -1
      ) {
        throw new Error("Invalid Email");
      }

      if (!userData.password || userData.password.length < 6) {
        throw new Error("Invalid Password");
      }

      if (userData.role === "admin" && (!userData.password || userData.password.length < 10)) {
        throw new Error("Invalid Password");
      }

      if (req.body.role === "admin") {
        const token = req.headers.authorization as string;
        const verifyToken = new Authenticator().getData(token);
        if (verifyToken.role !== req.body.role) {
          throw new Error("You're not allowed!")
        }
      }

      const id = idGenerator.generate();
      const password = await hashManager.hash(userData.password);
      const token = auth.generateToken({ id });

      await userBusiness.signUp(id, userData.name, userData.email, userData.nickname, password, userData.role);

      res.status(200).send({
        token,
      });
    } catch (err) {
      res.status(400).send({
        message: err.message,
      });
    }
    await BaseDatabase.destroyConnection();
  }




  async login(req: Request, res: Response) {
    try {
      const userData = {
        name: req.body.name,
        email: req.body.email,
        nickname: req.body.nickname,
        password: req.body.password,
        role: req.body.role
      };

      if (
        (!userData.email && userData.email.indexOf("@") === -1) ||
        userData.email.indexOf(".com") === -1
      ) {
        throw new Error("Invalid Input");
      }

      const user = await userDb.getUserByEmail(userData.email);
      const decryptedPassword = await hashManager.compare(
        userData.password,
        user.password
      );

      if (!decryptedPassword) {
        throw new Error("Invalid Input");
      }

      const accessToken = auth.generateToken({ id: user.id, role: user.role });

      res.status(200).send({
        accessToken,
      });
    } catch (err) {
      res.status(400).send({
        message: err.message,
      });
    }
    await BaseDatabase.destroyConnection();
  }




  async bandSignup(req: Request, res: Response) {
    try {
      const userData = {
        name: req.body.name,
        email: req.body.email,
        nickname: req.body.nickname,
        password: req.body.password,
        role: req.body.role,
        description: req.body.description
      };

      if (!userData.name) {
        throw new Error("Invalid Name");
      }

      if (
        (!userData.email && userData.email.indexOf("@") === -1) ||
        userData.email.indexOf(".com") === -1
      ) {
        throw new Error("Invalid Email");
      }

      if (!userData.password || userData.password.length < 6) {
        throw new Error("Invalid Password");
      }


      const id = idGenerator.generate();
      const password = await hashManager.hash(userData.password);
      const token = auth.generateToken({ id });

      await userBusiness.bandSignup(id, userData.name, userData.email, userData.nickname, password, userData.role, userData.description);

      res.status(200).send({
        message: "Great!",
      });
    } catch (err) {
      res.status(400).send({
        message: err.message,
      });
    }
    await BaseDatabase.destroyConnection();
  }


  async allBands(req: Request, res: Response) {
    try {
      const token = req.headers.authorization || req.headers.Authorization as string
      const verifyAdminToken = new Authenticator().getData(token);
      if (verifyAdminToken.role !== "admin") {
        throw new Error("You're not allowed!");

      }
      const bands = await userBusiness.allBands();
      res.status(200).send(
        bands
      );
    } catch (err) {
      res.status(400).send({
        message: err.message,
      });
    }
  }

  async approveBands(req: Request, res: Response) {
    try {
      const token = req.headers.authorization || req.headers.Authorization as string
      const verifyAdminToken = new Authenticator().getData(token);
      if (verifyAdminToken.role !== "admin") {
        throw new Error("You're not allowed!");

      }
      const bands = await userBusiness.approveBands(req.body.id);
      res.status(200).send(
        bands
      );
    } catch (err) {
      res.status(400).send({
        message: err.message,
      });
    }
  }

}









