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
                if (!authToken) {
                    console.log('No auth token found');
                    return false;
                }

                if (!window.$chatwoot) {
                    console.log('Chatwoot widget not ready yet');
                    return false;
                }

                // Decode token
                let decoded: any;
                try {
                    decoded = jwt_decode(authToken);
                    console.log('Decoded token:', decoded);
                } catch (decodeError) {
                    console.error('Error decoding token:', decodeError);
                    return false;
                }

                // Backend tạo token với field 'id' (không phải 'sub')
                const appUserId = decoded.id;
                
                // Validate user ID
                if (!appUserId) {
                    console.error('No user ID found in token. Decoded token:', decoded);
                    return false;
                }

                // Convert sang string
                const userIdString = String(appUserId).trim();
                if (!userIdString) {
                    console.error('Invalid user ID format:', appUserId);
                    return false;
                }

                // Backend token có: firstName, email, id, userType
                const appUserEmail = decoded.email || '';
                const userName = decoded.firstName || '';

                console.log('Setting Chatwoot user:', {
                    identifier: userIdString,
                    email: appUserEmail,
                    name: userName
                });

                // Set user với identifier là string hợp lệ
                window.$chatwoot.setUser(userIdString, {
                    identifier: userIdString,
                    email: appUserEmail,
                    name: userName,
                    custom_attributes: {
                        app_user_id: userIdString,
                    },
                });
                
                return true;
            } catch (error) {
                console.error('Error setting Chatwoot user:', error);
                return false;
            }
        };

        script.onload = () => {
            if (window.chatwootSDK) {
                window.chatwootSDK.run({
                    websiteToken: CHATWOOT_WEBSITE_TOKEN,
                    baseUrl: CHATWOOT_URL,
                    callbacks: {
                        onLoad: () => {
                            // Đợi widget sẵn sàng
                            setTimeout(() => {
                                setChatwootUser();
                            }, 1500);
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