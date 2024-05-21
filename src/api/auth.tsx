import axios from "axios";
import {API} from "../utils/config";

const login = (body : object) => {
    return axios.post(`${API}auth/login`, body,{
        headers: {
            'Content-Type': 'application/json',
        }
    })
}
const signup = (body : object) => {
    return axios.post(`${API}auth/register`, body,{
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

const logout = () => {

}

const Auth = {login, signup, logout}

export default Auth