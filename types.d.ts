declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    SUPABASE_URL: string
    SUPABASE_KEY: string
    INSTAGRAM_ACCESS_TOKEN?: string
    INSTAGRAM_APP_ID?: string
    INSTAGRAM_APP_SECRET?: string
  }
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
