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
            toggle: () => void;
        };
    }
}

const ChatwootWidget = () => {
    const [cookies] = useCookies(['AuthToken']);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = `${CHATWOOT_URL}/packs/js/sdk.js`;
        script.async = true;

        const setChatwootUser = () => {
            try {
                const authToken = cookies.AuthToken;
                if (authToken && window.$chatwoot) {
                    const decoded = jwt_decode(authToken) as any;
                    const appUserId = decoded.sub || decoded.id;
                    const appUserEmail = decoded.email;
                    const userName = decoded.firstName || decoded.name;

                    if (appUserId) {
                        console.log('Setting Chatwoot user:', appUserId);
                        window.$chatwoot.setUser(appUserId, {
                            identifier: appUserId,
                            email: appUserEmail,
                            name: userName,
                            custom_attributes: {
                                app_user_id: appUserId,
                            },
                        });
                        return true;
                    }
                }
            } catch (error) {
                console.error('Error setting Chatwoot user:', error);
            }
            return false;
        };

        script.onload = () => {
            if (window.chatwootSDK) {
                window.chatwootSDK.run({
                    websiteToken: CHATWOOT_WEBSITE_TOKEN,
                    baseUrl: CHATWOOT_URL,
                    callbacks: {
                        onLoad: () => {
                            // Thử set user ngay
                            setTimeout(setChatwootUser, 1000);
                        },
                        onOpen: () => {
                            // Set lại user khi widget mở
                            setChatwootUser();
                        },
                    },
                });
            }
        };

        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [cookies.AuthToken]);

    return null;
};

export default ChatwootWidget;