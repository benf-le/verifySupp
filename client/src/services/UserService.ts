import axios from "axios";
import {BASE_URL} from "../constant/appInfo.ts";

export const axiosJWT = axios.create()

export const loginUser = async (data) => {
    const res = await axios.post(BASE_URL+`/login`, data)
    return res.data
}

export const getDetailsUser = async (id, access_token) => {
    const res = await axiosJWT.get(BASE_URL+`/user/me/${id}`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    return res.data;
}
