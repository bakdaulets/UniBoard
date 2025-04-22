import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { DirectoryComponent } from "./directory/directory.component";

const routes : Routes = [
    
    { path: "", component: HomeComponent },
    { path: "Home", component: HomeComponent },
    { path: "Directory", component: DirectoryComponent}

];

export default routes;