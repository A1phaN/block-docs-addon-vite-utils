import fs from 'fs';
import { cyan } from 'colorette';
import open from 'open';
import path from 'path';
import * as qs from 'query-string';
import opapi from './opapi';
import { setDefaultOpenUrl, getConfigFiles, createBaseFromTemplate } from './utils';
import type { PluginOption } from 'vite';

export const BASE_PATH = '/block';
const PLUGIN_NAME = 'docverse-debug-url';

export interface DocVerseVitePluginOptions {
  open?: boolean;
  url?: string;
}

export function docVerseVitePlugin(options: DocVerseVitePluginOptions = {}): PluginOption {
  let _open = typeof options.open !== 'undefined' ? Boolean(options.open) : true;
  let url = options.url;
  let isInit = false;
  let port = 8080;

  return {
    name: PLUGIN_NAME,
    async configureServer(server) {
      port = server.config.server.port ?? 8080;
      if (process.env.NODE_ENV === 'development') {
        const { projectInfo, blockInfo, docsaddon: { url: u }, privatization } = await getConfigFiles();
        if (!isInit) {
          isInit = true;
          url = u != null ? u : '';
          if (!url) {
            if (privatization) {
              console.error(
                'Create docsaddon failure. Please set url of docsaddon to "url" property in app.json'
              );
              process.exit(1);
            }
            try {
              const newBaseUrl = await createBaseFromTemplate('云文档小应用测试页面');
              url = newBaseUrl;
              console.info(
                `Create docsaddon successfully. The url ${newBaseUrl} will be written to app.json`
              );
              setDefaultOpenUrl(newBaseUrl);
            } catch (e) {
              console.error(
                'Create docsaddon failure. Please set url of docsaddon to "url" property in app.json'
              );
              process.exit(1);
            }
          }
        }
        const logger = server.config.logger;
        const url2 = qs.stringifyUrl({
          url: url!,
          query: {
            blockitdebug: true,
            debugport: port,
          },
        });
        logger.info(`URL: ${cyan(url2)}`);
        _open && open(url2);

        // from @lark-opdev/block-docs-addon-webpack-utils/src/libs/dev_middleware.js
        // enable `docsAddonDevMiddleware` by default
        const config = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'app.json'), { encoding: 'utf-8' })) as AppConfig;
        const api = await opapi.init(config?.privatization ? { envConfig: config.privatization } : undefined);
        const middleware = await api.dev.getBlockitDevMiddleware({
          projectConfig: projectInfo,
          blockConfigMap: {
            [blockInfo.blockTypeID]: blockInfo,
          },
          devServerHost: `http://localhost:${port}`,
          basePath: '/block'
        });
        console.log({
          projectConfig: projectInfo,
          blockConfigMap: {
            [blockInfo.blockTypeID]: blockInfo,
          },
          devServerHost: `http://localhost:${port}`,
          basePath: '/block'
        });
        server.middlewares.use((req, res, next) => {
          res.setHeader('Access-Control-Allow-Origin', new URL(url!).origin);
          res.setHeader('Access-Control-Allow-Methods', '*');
          res.setHeader('Access-Control-Allow-Headers', 'x-request-id');
          res.setHeader('Access-Control-Allow-Credentials', 'true');
          console.log(req.url)
          if (req.url?.startsWith(BASE_PATH)) return next();
          middleware(
            { url: req.url! },
            {
              send: (content: any) => {
                if (!content) {
                  return next();
                }
                res.end(Buffer.from(JSON.stringify(content)))
              }
            },
            next,
          );
        });
      }
    },
    async generateBundle() {
      if (process.env.NODE_ENV === 'production') {
        const { projectInfo, blockInfo } = await getConfigFiles();
        this.emitFile({
          type: 'asset',
          fileName: 'project.config.json',
          source: JSON.stringify(projectInfo),
        });
        this.emitFile({
          type: 'asset',
          fileName: 'index.json',
          source: JSON.stringify(blockInfo),
        });
      }
    },
  }
}
