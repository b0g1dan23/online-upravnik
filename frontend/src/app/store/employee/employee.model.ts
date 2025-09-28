import { User } from "../user/user.model";

export interface Employee extends User {
    position: string;
}