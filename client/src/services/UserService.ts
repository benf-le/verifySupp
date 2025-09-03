import axios from "axios";
import {BASE_URL} from "../constant/appInfo.ts";

export const axiosJWT = axios.create()

export const loginUser = async (data:any) => {
    const res = await axios.post(BASE_URL+`/login`, data)
    return res.data
}

export const getDetailsUser = async (id:any, access_token:any) => {
    const res = await axiosJWT.get(BASE_URL+`/user/me/${id}`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    return res.data;
}
