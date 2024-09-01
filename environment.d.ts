declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MNEMONIC: string;
      JETTON_MASTER_ADDRESS: string;
      TON_CENTER_API_KEY: string,
      NODE_ENV: 'development' | 'production';
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
