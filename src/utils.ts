import path from 'path';
import axios from 'axios';
import fs from 'fs';
import merge from 'lodash.merge';
import opapi from './opapi';
import type { BlockInfo, ProjectInfo } from '@lark-opdev/cli/libs/types/commonData';

async function getAccountInfo() {
  const config = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'app.json'), { encoding: 'utf-8' })) as AppConfig;
  let api: Awaited<ReturnType<typeof opapi.init>>;
  if (config && config.privatization) {
    api = await opapi.init({ envConfig: config.privatization });
  } else {
    api = await opapi.init();
  }

  const account = api.account.getAccountInfo();
  if (!account || !account.larkSession || !account.env) {
    throw new Error('get lark session failed. please run opdev login before developing');
  }
  return account;
}

export async function setDefaultOpenUrl(url: string) {
  const blockConfigPath = path.resolve(process.cwd(), 'app.json');
  const config = JSON.parse(fs.readFileSync(blockConfigPath, { encoding: 'utf-8' })) as AppConfig;
  config.url = url;
  fs.writeFileSync(blockConfigPath, JSON.stringify(config, null, 2), { encoding: 'utf-8' });
}

export async function getConfigFiles(): Promise<{
  projectInfo: ProjectInfo;
  blockInfo: BlockInfo;
  docsaddon: {
    url: string;
  };
  privatization: AppConfig['privatization'];
}> {
  const { env } = await getAccountInfo();
  const config = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'app.json'), { encoding: 'utf-8' })) as AppConfig;
  const newConfig = merge<AppConfig, Partial<AppConfig>>(config, (config.environments || {})[env] || {});
  return {
    projectInfo: {
      appid: newConfig.appID,
      projectname: newConfig.projectName,
      blocks: ['index'],
    },
    blockInfo: {
      blockTypeID: newConfig.blockTypeID,
      blockRenderType: 'offlineWeb',
      offlineWebConfig: {
        // @ts-expect-error 缺少文档，从代码中也无法推测这里的作用
        initialHeight: newConfig.initialHeight,
        contributes: newConfig.contributes,
      },
    },
    docsaddon: {
      url: newConfig.url!,
    },
    privatization: newConfig.privatization,
  };
}

export async function createBaseFromTemplate(name: string) {
  const { larkSession, env } = await getAccountInfo();
  const domain = `${env}.cn`;
  const instance = axios.create({
    baseURL: `https://internal-api-space.${domain}`,
    timeout: 5e3,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      cookie: `session=${larkSession}`,
      Referer: `https://${domain}`,
    },
  });
  const res = await instance.post('/space/api/explorer/v2/create/object/', {
    type: 22,
    name,
    source: 0
  });
  return (Object.values(res.data.data.entities.nodes)[0] as any).url;
}

export async function getAppCSPConfig() {
  const api = await opapi.init();
  // @ts-expect-error 官方版本确实缺少参数
  return api.dev.getAppCSPConfig();
}
