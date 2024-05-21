import {API} from "../utils/config";
import axios from "axios";

const logoutUser = (body : object, token : string) => {
    return axios.post(`${API}logout`, body,{
        headers: {
            'Content-Type': 'application/json',
            "Authorization":`Bearer ${token}`
        }
    })
}

export default logoutUser