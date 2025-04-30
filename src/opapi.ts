import opapi from '@lark-opdev/cli/libs/api';
// This is wired but @lark-opdev/cli/libs/api/index.d.ts gives different export from @lark-opdev/cli/libs/api/index.js
export default (opapi as any).default as typeof opapi;
