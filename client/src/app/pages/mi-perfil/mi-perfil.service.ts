import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../auth/auth.service";

@Injectable({
    providedIn: 'root'
})
export class MiPerfilService {

    apiUrl = environment.apiUrl;

    constructor(authService: AuthService) {}

}