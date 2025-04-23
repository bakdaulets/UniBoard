import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { DirectoryComponent } from "./directory/directory.component";
import { LoginComponent } from "./auth/login/login.component";
import { RegisterComponent } from "./auth/register/register.component";
import { inject } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { map } from "rxjs/operators";

// Auth guard function
const authGuard = () => {
    const authService = inject(AuthService);
    return authService.isAuthenticated().pipe(
        map(isAuthenticated => isAuthenticated ? true : { path: '/login' })
    );
};

const routes : Routes = [
    { path: "", component: HomeComponent, canActivate: [authGuard] },
    { path: "Home", component: HomeComponent, canActivate: [authGuard] },
    { path: "Directory", component: DirectoryComponent, canActivate: [authGuard] },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    // Redirect all unknown routes to home
    { path: "**", redirectTo: "" }
];

export default routes;