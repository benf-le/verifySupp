"use client";

import { useEffect } from "react";
import Script from "next/script";

const BASE_URL = "http://34.55.138.114:3000";

export {};

declare global {
    interface Window {
        chatwootSDK?: {
            run: (config: { websiteToken: string; baseUrl: string }) => void;
            // Bạn có thể khai báo thêm các method khác nếu cần
        };
    }
}
export const ChatwootWidget = () => {
    // Khởi tạo khi script đã load xong
    const handleLoad = () => {
        if (window.chatwootSDK) {
            window.chatwootSDK.run({
                websiteToken: "Y6JyCoUjNzHBGsdurGqS8Rb4",
                baseUrl: BASE_URL,
            });
        }
    };

    return (
        <>
            {/* Script tải sdk chatwoot */}
            <Script
                src={`${BASE_URL}/packs/js/sdk.js`}
                strategy="lazyOnload" // hoặc "afterInteractive" tuỳ mục đích tải
                onLoad={handleLoad}
            />
        </>
    );
};

export default ChatwootWidget;
