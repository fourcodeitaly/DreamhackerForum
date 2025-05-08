const isAWS = process.env.USE_AWS;

const localConfig = {
  host: process.env.LOCAL_POSTGRES_HOST,
  port: process.env.LOCAL_POSTGRES_PORT || 5432,
  database: process.env.LOCAL_POSTGRES_DB,
  user: process.env.LOCAL_POSTGRES_USER,
  password: process.env.LOCAL_POSTGRES_PASSWORD,
};

const awsConfig = {
  host: process.env.AWS_POSTGRES_HOST,
  port: process.env.AWS_POSTGRES_PORT || 5432,
  database: process.env.AWS_POSTGRES_DB,
  user: process.env.AWS_POSTGRES_USER,
  password: process.env.AWS_POSTGRES_PASSWORD,
};

export const config = localConfig;
