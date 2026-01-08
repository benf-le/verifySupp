import { useEffect } from "react";
import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";

import { CHATWOOT_URL, CHATWOOT_WEBSITE_TOKEN } from "../constant/appInfo.ts";

declare global {
    interface Window {
        chatwootSDK: any;
    }
}

const ChatwootWidget = () => {
    const [cookies] = useCookies(['AuthToken']);
    const authToken = cookies.AuthToken;

    useEffect(() => {
        // Tạo thẻ script
        const script = document.createElement("script");
        script.src = `${CHATWOOT_URL}/packs/js/sdk.js`;
        script.async = true;

        // Khi script load xong, chạy SDK
        script.onload = () => {
            if (window.chatwootSDK) {
                // Khởi tạo Chatwoot
                window.chatwootSDK.run({
                    websiteToken: CHATWOOT_WEBSITE_TOKEN,
                    baseUrl: CHATWOOT_URL,
                });

                // Nếu user đã đăng nhập, set user info vào Chatwoot
                if (authToken) {
                    try {
                        const decoded: any = jwt_decode(authToken);
                        const userId = decoded.sub || decoded.id || decoded.userId;
                        const userEmail = decoded.email || '';
                        const userName = decoded.firstName 
                            ? `${decoded.firstName} ${decoded.lastName || ''}`.trim()
                            : decoded.email || 'User';

                        if (userId) {
                            window.chatwootSDK.setUser(userId, {
                                email: userEmail,
                                name: userName,
                                identifier_hash: userId, // Dùng để query database
                            });
                        }
                    } catch (error) {
                        console.error('Error setting Chatwoot user:', error);
                    }
                }
            }
        };

        // Thêm script vào DOM
        document.body.appendChild(script);

        // Cleanup khi component unmount
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [authToken]); // Re-run khi authToken thay đổi

    // Cập nhật user info khi authToken thay đổi (login/logout)
    useEffect(() => {
        if (window.chatwootSDK && authToken) {
            try {
                const decoded: any = jwt_decode(authToken);
                const userId = decoded.sub || decoded.id || decoded.userId;
                const userEmail = decoded.email || '';
                const userName = decoded.firstName 
                    ? `${decoded.firstName} ${decoded.lastName || ''}`.trim()
                    : decoded.email || 'User';

                if (userId) {
                    window.chatwootSDK.setUser(userId, {
                        email: userEmail,
                        name: userName,
                        identifier_hash: userId,
                    });
                }
            } catch (error) {
                console.error('Error updating Chatwoot user:', error);
            }
        } else if (window.chatwootSDK && !authToken) {
            // Logout - reset user
            window.chatwootSDK.reset();
        }
    }, [authToken]);

    return null; // Không render gì cả
};

export default ChatwootWidget;