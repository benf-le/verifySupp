import {Authentication} from "../models/Authentication";
import axiosClient from "./axiosClient";
import {BASE_URL} from "../constant/appInfo";


class HandleAuthentication {
    static postLogin = async (url: string, data: Authentication[])=>{
        return axiosClient.post(BASE_URL +url,data)
    }


}


export default HandleAuthentication