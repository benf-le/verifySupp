import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        domains: [
            'cdn.nhathuoclongchau.com.vn',
            'cms-prod.s3-sgn09.fptcloud.com',
        ],
    },

};

export default nextConfig;
