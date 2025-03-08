interface Config {
  BACKEND_PORT: string;
  JWT_SECRET: string;
  BCRYPT_COST: string;
  MONGO_URI: string;
}

/**
 * Helper function to retrieve and validate environment variables.
 * @param key - The name of the environment variable.
 * @returns The value of the environment variable.
 * @throws Error if the environment variable is not set.
 */
const getEnvVariable = (key: keyof Config): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set.`);
  }
  return value;
};

const config: Config = {
  BACKEND_PORT: getEnvVariable("BACKEND_PORT"),
  JWT_SECRET: getEnvVariable("JWT_SECRET"),
  BCRYPT_COST: getEnvVariable("BCRYPT_COST"),
  MONGO_URI: getEnvVariable("MONGO_URI"),
};

export default config;
