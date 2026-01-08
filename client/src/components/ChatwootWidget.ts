import { useEffect } from "react";
import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";

import {CHATWOOT_URL, CHATWOOT_WEBSITE_TOKEN} from "../constant/appInfo.ts";

declare global {
    interface Window {
        chatwootSDK: any;
        $chatwoot?: {
            setUser: (identifier: string, user: {
                identifier?: string;
                email?: string;
                name?: string;
                custom_attributes?: Record<string, any>;
            }) => void;
        };
    }
}

const ChatwootWidget = () => {
    const [cookies] = useCookies(['AuthToken']);

    useEffect(() => {
        // Tạo thẻ script
        const script = document.createElement("script");
        script.src = `${CHATWOOT_URL}/packs/js/sdk.js`;
        script.async = true;

        script.onload = () => {
            if (window.chatwootSDK) {
                window.chatwootSDK.run({
                    websiteToken: CHATWOOT_WEBSITE_TOKEN,
                    baseUrl: CHATWOOT_URL,
                    callbacks: {
                        onLoad: () => {
                            // Lấy user info từ JWT token nếu đã login
                            try {
                                const authToken = cookies.AuthToken;
                                if (authToken) {
                                    const decoded = jwt_decode(authToken) as any;
                                    const appUserId = decoded.sub || decoded.id;
                                    const appUserEmail = decoded.email;
                                    const userName = decoded.firstName || decoded.name;

                                    // Set user info vào Chatwoot
                                    if (window.$chatwoot && appUserId) {
                                        window.$chatwoot.setUser(appUserId, {
                                            identifier: appUserId,
                                            email: appUserEmail,
                                            name: userName,
                                            custom_attributes: {
                                                app_user_id: appUserId,
                                            },
                                        });
                                    }
                                }
                            } catch (error) {
                                console.error('Error setting Chatwoot user:', error);
                            }
                        },
                    },
                });
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
    }, [cookies.AuthToken]); // Re-run khi token thay đổi

    return null;
};

export default ChatwootWidget;