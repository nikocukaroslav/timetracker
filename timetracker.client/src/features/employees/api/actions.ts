import {UserModel} from "../../../interfaces/domain.ts";
import {CREATE_USER, DELETE_USER, GET_USER, GET_USERS, UPDATE_USER} from "../../../constants.ts";

export const createUser = (newUser: UserModel) => ({type: CREATE_USER, payload: newUser})
export const getUsers = () => ({type: GET_USERS})
export const getUser = (userId: string) => ({type: GET_USER, payload: userId})
export const deleteUser = (userId: string) => ({type: DELETE_USER, payload: userId})
export const updateUser = (userToUpdate: UserModel) => ({
    type: UPDATE_USER,
    payload: userToUpdate
})
