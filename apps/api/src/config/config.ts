import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    openaiApiKey: string;
    replicateApiKey: string;
}

const config: Config = {
    port: Number(process.env.PORT) || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    replicateApiKey: process.env.REPLICATE_API_TOKEN || '',
};

export default config;