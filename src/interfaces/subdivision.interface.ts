import {IUser} from "./user.interface";

export interface ISubdivision {
    id: string
    subdivision_name: string
    createdAt: string
    collaborators: IUser
}