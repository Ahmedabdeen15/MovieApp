import { user } from "../models/user.js";
import { UserService } from "../services/userService.js";

class UserLogin{
    userService:UserService;

    constructor(){
        this.userService = new UserService();
    }

    async login(email:string, password:string){
        const user : user = {
            name: "",
            email: email,
            password: password
        }
        return this.userService.authenticateUser(user);
    }
}
class UserRegister{
    userService:UserService;

    constructor(){
        this.userService = new UserService();
    }

    async register(name:string, email:string, password:string){
        const user : user = {
            name: name,
            email: email,
            password: password
        }
        return this.userService.createUser(user);
    }
}
function onLogin(){
    const form = document.getElementById("login-form") as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email") as string || "";
    const password = formData.get("password") as string || "";
    const login = new UserLogin();
    login.login(email, password).then((result) => {
        if(result){
            window.location.href = "/home.html"; 
        }else{
            alert("Invalid email or password");
        }
    });
}
function onRegister(){
    const form = document.getElementById("register-form") as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string || "";
    const email = formData.get("email") as string || "";
    const password = formData.get("password") as string || "";
    const register = new UserRegister();
    console.log("Registering user:", { name, email, password });
    register.register(name, email, password).then((result) => {
        if(result){
            window.location.href = "/login.html";
        }else{
            alert("Invalid email or password");
        }
    });
}

// Make functions available globally for HTML forms
declare global {
    interface Window {
        onLogin: (e: Event) => void;
        onRegister: (e: Event) => void;
    }
}

window.onLogin = onLogin;
window.onRegister = onRegister;