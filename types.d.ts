/**
 * 参考 [组件配置 - 开发指南 - 开发文档 - 飞书开放平台](https://open.feishu.cn/document/client-docs/docs-add-on/appjson-configuration-instructions)
 */
declare interface Contributes {
  /**
   * **【组件类型】正文小组件**
   */
  addPanel?: {
    /**
     * 小组件渲染页面入口（通常指的是html的入口）
     * 
     * @example "index.html"
     */
    view?: string;
    /**
     * 小组件容器的初始高度
     * 
     * @example 200
     */
    initialHeight?: number;
    /**
     * 是否使用文档的 Loading 动画，配合 `notifyAppReady` 使用
     * 
     * @example true
     */
    useHostLoading?: boolean;
    /**
     * 是否使用 Interaction 存储数据
     * 
     * @example true
     */
    useInteraction?: boolean;
    /**
     * resize 类型，只能传示例中的字段
     * 
     * 移动端不支持 resize，传任何字段这里都是 `none`
     * 
     * - `free`: 自由resize，能随意缩放应用
     * - `proportional`: 比例 resize，只能对角按比例缩放
     * - `horizontal`: 水平 resize，只能在水平方向缩放
     * - `vertical`: 垂直 resize，只能在垂直方向缩放
     * - `none`: 不能缩放
     */
    resizeType?: 'free' | 'proportional' | 'horizontal' | 'vertical' | 'none';
  };
  /**
   * **【组件类型】悬浮小组件**
   */
  topbar?: {
    /**
     * 小组件渲染页面入口（通常指的是html的入口）
     *
     * @example topbar.html
     */
    view?: string;
    /**
     * 小组件容器的初始高度
     *
     * @example 200
     */
    initialHeight?: number;
    /**
     * 小组件容器的初始宽度
     * 
     * @example 800
     */
    initialWidth?: number;
    /**
     * 是否使用文档的 Loading 动画，配合 `notifyAppReady` 使用
     * 
     * @example true
     */
    useHostLoading?: boolean;
    /**
     * 默认对齐方式，如果小组件需要宽度超过文档正文宽度，需要设置为默认居中对齐；更改对齐方式暂时不提供 api，只提供默认的对齐方式设置。
     * 
     * - `left`: 左对齐
     * - `center`: 居中对齐
     * - `right`: 右对齐
     */
    align?: string;
  };
  /**
   * **【附属视图】全屏视图**，应用调用 [Service.Fullscreen.enterFullscreen](https://open.feishu.cn/document/uAjLw4CM/uYjL24iN/docs-add-on/05-api-doc/basic-data-reference---base/Service.Fullscreen.enterFullscreen) 唤起
   */
  fullscreen?: {
    /**
     * 视图渲染页面入口（通常指的是html的入口）
     * 
     * @example fullscreen.html
     */
    view?: string;
  };
  /**
   * **【附属视图】悬浮卡片视图**，应用调用 [Service.FloatCard.enterFloatCard](https://open.feishu.cn/document/uAjLw4CM/uYjL24iN/docs-add-on/05-api-doc/basic-data-reference---base/Service.FloatCard.enterFloatCard) 唤起
   */
  floatCard?: {
    /**
     * 视图渲染页面入口（通常指的是html的入口）
     * 
     * @example floatCard.html
     */
    view?: string;
    /**
     * 小组件容器的初始高度
     * 
     * @example 200
     */
    initialHeight?: number;
  };
  /**
   * **【附属视图】弹窗视图**，应用调用 [View.Action.showPopup](https://open.feishu.cn/document/uAjLw4CM/uYjL24iN/docs-add-on/05-api-doc/basic-data-reference---base/View.Action.showPopup) 唤起
   */
  popup?: {
    /**
     * 视图渲染页面入口（通常指的是html的入口）
     * 
     * @example popup.html
     */
    view?: string;
    /**
     * 小组件容器的初始高度
     * 
     * @example 200
     */
    initialHeight?: number;
  };
  /**
   * **【附属视图】模态框视图**，应用调用 [View.Action.openModal](https://open.feishu.cn/document/uAjLw4CM/uYjL24iN/docs-add-on/05-api-doc/basic-data-reference---base/View.Action.openModal) 唤起
   */
  modal?: {
    /**
     * 视图渲染页面入口（通常指的是html的入口）
     * 
     * @example modal.html
     */
    view?: string;
    /**
     * 小组件容器的初始高度
     * 
     * @example 200
     */
    initialHeight?: number;
  };
}

/**
 * 参考 [组件配置 - 开发指南 - 开发文档 - 飞书开放平台](https://open.feishu.cn/document/client-docs/docs-add-on/appjson-configuration-instructions)
 */
declare interface AppConfig {
  manifestVersion: 1;
  appID: string;
  appType: 'docs-addon';
  blockTypeID: string;
  projectName: string;
  contributes: Contributes;
  /**
   * # 多应用配置
   * 
   * 开发过程中，一套项目工程有同时发布到测试和正式环境的需要，而不同的环境对应着不同应用的 AppID 和 BlockTypeID。使用 `environments` 可以同时配置各个环境的应用配置信息。目前只支持这两个环境：`feishu`（飞书正式环境） 和 `feishu-boe`（飞书测试环境）。
   */
  environments: {
    [environment in import('@lark-opdev/cli/libs/types/account').AccountInfo['env']]: Partial<Omit<AppConfig, 'environments'>>;
  };
  /**
   * 测试文档的 URL（实际测试文档是通过在该 URL 后面添加 `?blockitdebug=true&debugport=<dev-server-port>` 得到的）
   */
  url?: string;
  /**
   * 这个没有文档也不太确定用途是什么，看起来可能是内部测试覆盖一些参数用的
   */
  privatization?: import('@lark-opdev/cli/libs/api').OpdevApiInitOptions['envConfig']
}
