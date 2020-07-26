import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
  public async signUp(
    id: string,
    name: string,
    email: string,
    nickname: string,
    password: string,
    role: string
  ) {
    try {
      await this.getConnection()
        .insert({
          id,
          name,
          email,
          nickname,
          password,
          role
        })
        .into("USER_LISTENER");
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public async getUserByEmail(email: string): Promise<any> {
    const result = await this.getConnection()
      .select("*")
      .from("USER_LISTENER")
      .where({ email });

    return result[0];
  }

  public async bandSignup(
    id: string,
    name: string,
    email: string,
    nickname: string,
    password: string,
    role: string,
    description : string
  ) {
    try {
      await this.getConnection()
        .insert({
          id,
          name,
          email,
          nickname,
          password,
          role, 
          description
        })
        .into("BANDS");
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public async allBands(): Promise<any> {
    try{
    const result = await this.getConnection()
      .select("*")
      .from("BANDS");

    return result;
    }catch (err){
    console.log(err.message);
    }
  }

    public async approveBands(id: string): Promise<any>{
      try{
        const result = await this.getConnection().raw(`
          UPDATE BANDS
          SET isAproved = 1
          WHERE id = "${id}";
        `);
      }catch (err){
        throw new Error(err.message);
      }
    }

    public async getUserById(id: string): Promise<any> {
      const result = await this.getConnection()
        .select("*")
        .from("BANDS")
        .where({ id });
  
      return result[0];
    }
}



