import type { JwtPayload } from "jwt-decode";


export interface MyJwtPayload extends JwtPayload {
    sub: string;
    role: string;
    tiwtId: string | null;
    iat: number;
    exp: number;
    iss: string;
}