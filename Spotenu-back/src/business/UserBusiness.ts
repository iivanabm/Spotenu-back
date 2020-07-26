import { UserDatabase } from "../data/UserDatabase";

export class UserBusiness {
  private userDatabase = new UserDatabase();

  public async signUp(
    id: string,
    name: string,
    email: string,
    nickname: string,
    password: string,
    role: string
  ) {
    await this.userDatabase.signUp(id, name, email, nickname, password, role);
  }
  
  public async bandSignup(
    id: string,
    name: string,
    email: string,
    nickname: string,
    password: string,
    role: string,
    description: string
  ) {
    await this.userDatabase.bandSignup(id, name, email, nickname, password, role, description);
  }

  public async allBands() {
    return await this.userDatabase.allBands();
  }

  public async approveBands(id: string) {
    const band = await this.userDatabase.getUserById(id)
    if (!band) {
      throw new Error("Band not found");
    }
    await this.userDatabase.approveBands(id)
  } 

}
