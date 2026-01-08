import { useEffect, useRef } from "react";
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
    const sdkInitialized = useRef(false);

    // Hàm set user vào Chatwoot
    const setChatwootUser = () => {
        if (!window.chatwootSDK || !authToken) {
            return;
        }

        try {
            const decoded: any = jwt_decode(authToken);
            console.log('Decoded token:', decoded); // Debug log
            
            // Thử các field có thể chứa userId
            const userId = decoded.sub || decoded.id || decoded.userId || decoded.user_id;
            
            if (!userId) {
                console.warn('User ID not found in token. Available fields:', Object.keys(decoded));
                return;
            }

            const userEmail = decoded.email || '';
            const userName = decoded.firstName 
                ? `${decoded.firstName} ${decoded.lastName || ''}`.trim()
                : decoded.email || 'User';

            console.log('Setting Chatwoot user:', { userId, userEmail, userName }); // Debug log

            // Chatwoot setUser format: setUser(identifier, attributes)
            window.chatwootSDK.setUser(userId.toString(), {
                email: userEmail,
                name: userName,
                identifier_hash: userId.toString(), // Dùng để query database
            });

            console.log('Chatwoot user set successfully'); // Debug log
        } catch (error) {
            console.error('Error setting Chatwoot user:', error);
        }
    };

    // Khởi tạo SDK
    useEffect(() => {
        if (sdkInitialized.current) return;

        // Tạo thẻ script
        const script = document.createElement("script");
        script.src = `${CHATWOOT_URL}/packs/js/sdk.js`;
        script.async = true;

        // Khi script load xong
        script.onload = () => {
            if (window.chatwootSDK) {
                // Khởi tạo Chatwoot
                window.chatwootSDK.run({
                    websiteToken: CHATWOOT_WEBSITE_TOKEN,
                    baseUrl: CHATWOOT_URL,
                });

                sdkInitialized.current = true;

                // Đợi SDK khởi tạo xong rồi mới set user (delay nhỏ)
                setTimeout(() => {
                    setChatwootUser();
                }, 1000); // Đợi 1 giây để SDK sẵn sàng
            }
        };

        // Thêm script vào DOM
        if (!document.querySelector(`script[src="${CHATWOOT_URL}/packs/js/sdk.js"]`)) {
            document.body.appendChild(script);
        }

        // Cleanup
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    // Cập nhật user khi authToken thay đổi
    useEffect(() => {
        if (sdkInitialized.current && window.chatwootSDK) {
            if (authToken) {
                // Đợi một chút để đảm bảo SDK sẵn sàng
                setTimeout(() => {
                    setChatwootUser();
                }, 500);
            } else {
                // Logout - reset user
                try {
                    window.chatwootSDK.reset();
                } catch (error) {
                    console.error('Error resetting Chatwoot:', error);
                }
            }
        }
    }, [authToken]);

    return null;
};

export default ChatwootWidget;  