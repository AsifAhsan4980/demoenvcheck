import axios from "axios";
import { API } from '../utils/config';
const getAllProducts = (limit : number,nextToken : number) => {
    return axios.get(
        `${API}products/${limit}/${nextToken}`
    );
}

const createProduct = (body : object, token: string) => {
    return axios.post(
        `${API}products/create`, body, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization":`Bearer ${token}`
            }
        }
    );
}

const updateProduct = (id : any,body : object, token: string) => {
    return axios.put(
        `${API}products/single/${id}`, body, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization":`Bearer ${token}`
            }
        }
    );
}
const deleteProduct = (id : any, token: string) => {
    return axios.delete(
        `${API}products/single/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization":`Bearer ${token}`
            }
        }
    );
}

const batchDelete = (data : any, token: string) => {
    return axios.put(
        `${API}products/batchDelete`, data,{
            headers: {
                'Content-Type': 'application/json',
                "Authorization":`Bearer ${token}`
            }
        }
    );
}

const Products = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    batchDelete
}
export default Products