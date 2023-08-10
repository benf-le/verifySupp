import axiosClient from "./axiosClient";
import {BASE_URL} from "../constant/appInfo";


class HandleProducts {
    static getProducts = async (url:string)=>{
        return axiosClient.get(BASE_URL +url)
    }


}


export default HandleProducts