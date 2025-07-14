export class UserRepo {
    getUserEmail() : string | null{
        return localStorage.getItem("Email");
    }
    getUserPassword(): string | null{
        return localStorage.getItem("Password");
    }
    getUserName(): string | null {
        return localStorage.getItem("Name");
    }
    setUserEmail(email: string) {
        localStorage.setItem("Email", email);
    }
    setUserName(name: string) {
        localStorage.setItem("Name", name)
    }
    setUserPassword(password:string){
        localStorage.setItem("Password", password);
    }
}