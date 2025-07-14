import { UserRepo } from "../repos/userRepo.js";
import { user } from "../models/user.js";

export class UserService {
    userRepo:UserRepo = new UserRepo();
    createUser(user:user):boolean{
        if(user.name === "" || user.email === "" || user.password === ""){  
            return false;
        }
        this.userRepo.setUserName(user.name);
        this.userRepo.setUserEmail(user.email);
        this.userRepo.setUserPassword(user.password);
        return true;
    }
    authenticateUser(user:user): boolean {
        const userTemp: user ={
            name: this.userRepo.getUserName() || "",
            email: this.userRepo.getUserEmail() || "",
            password: this.userRepo.getUserPassword() || ""
        }
        if(userTemp.email === user.email && userTemp.password === user.password){
            return true;
        }
        return false;
    }
    isCreated(): boolean {
        return this.userRepo.getUserName() !== null && this.userRepo.getUserEmail() !== null && this.userRepo.getUserPassword() !== null;
    }
}