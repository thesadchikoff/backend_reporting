import {ISubdivision} from "./subdivision.interface";

export interface IUser {
    id: string
    first_name: string
    second_name: string
    subdivision: ISubdivision
}