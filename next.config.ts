import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  logging:{
    browserToTerminal: true,
  },
  experimental: {
    agentFeedback: true,
    instantInsights: {
      validationLevel: "manual-warning",//거의 모든 라우트가 로그인 세션을 읽는 구조라면 합리적인 선택
    },
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
