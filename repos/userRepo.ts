export class UserRepo {
    getLoginStatus(): boolean {
        const status = localStorage.getItem("isLoggedIn");
        return status === "true";
    }
    getUserEmail() : string | null{
        return localStorage.getItem("Email");
    }
    getUserPassword(): string | null{
        return localStorage.getItem("Password");
    }
    getUserName(): string | null {
        return localStorage.getItem("Name");
    }
    setLoginStatus(isLoggedIn: boolean) {
        localStorage.setItem("isLoggedIn", isLoggedIn.toString());
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