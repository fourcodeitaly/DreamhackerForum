const isAWS = process.env.USE_AWS;

const localConfig = {
  host: process.env.LOCAL_POSTGRES_HOST,
  port: process.env.LOCAL_POSTGRES_PORT || 5432,
  database: process.env.LOCAL_POSTGRES_DB,
  user: process.env.LOCAL_POSTGRES_USER,
  password: process.env.LOCAL_POSTGRES_PASSWORD,
  isAWS: false,
  ssl: process.env.SSL,
  groqApiKey: process.env.GROQ_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
};

const awsConfig = {
  host: process.env.AWS_POSTGRES_HOST,
  port: process.env.AWS_POSTGRES_PORT || 5432,
  database: process.env.AWS_POSTGRES_DB,
  user: process.env.AWS_POSTGRES_USER,
  password: process.env.AWS_POSTGRES_PASSWORD,
  ssl: process.env.SSL,
  isAWS: true,
  groqApiKey: process.env.GROQ_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
};

export const config = isAWS === "true" ? awsConfig : localConfig;
