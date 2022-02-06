// env.js

const isServer = typeof window === 'undefined';
let env = {
  branchName: process.env.BRANCH_NAME || 'local',
  shortSha: process.env.SHORT_SHA || 'null',
  tagName: process.env.TAG_NAME || 'null',
};

if (!isServer) {
  env = { ...env, ...window.__SSR_ENVIRONMENT__ };
}

export default env;
