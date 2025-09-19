import { useEffect } from "react";

import {CHATWOOT_URL} from "../constant/appInfo.ts";


declare global {
    interface Window {
        chatwootSDK: any; // Hoặc khai báo kiểu chuẩn nếu bạn biết
    }
}

const ChatwootWidget = () => {
    useEffect(() => {


        // Tạo thẻ script
        const script = document.createElement("script");
        script.src = `${CHATWOOT_URL}/packs/js/sdk.js`;
        script.async = true;

        // Khi script load xong, chạy SDK
        script.onload = () => {
            if (window.chatwootSDK) {
                window.chatwootSDK.run({
                    websiteToken: "MVogsmmGNT32xmAGdz5rTFaT",
                    baseUrl: CHATWOOT_URL,
                });
            }
        };

        // Thêm script vào DOM
        document.body.appendChild(script);

        // Cleanup khi component unmount
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return null; // Không render gì cả
};

export default ChatwootWidget;
