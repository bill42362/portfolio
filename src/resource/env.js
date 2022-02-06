// env.js

const isServer = typeof window === 'undefined';
let env = {
  branchName: process.env.BRANCH_NAME || 'local',
};

if (!isServer) {
  env = { ...env, ...window.__SSR_ENVIRONMENT__ };
}

export default env;
