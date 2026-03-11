import { JwtPayload } from "jwt-decode";

export interface AppJwtPayload extends JwtPayload{
  sub: string;
}
