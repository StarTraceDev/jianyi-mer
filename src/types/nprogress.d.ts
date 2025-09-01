/*
 * @Description: nprogress 类型
 * @Author: StarTraceDev
 * @Date: 2025-09-01 14:25:40
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-09-01 14:25:46
 */
declare module 'nprogress' {
  interface NProgressOptions {
    minimum?: number;
    template?: string;
    easing?: string;
    speed?: number;
    trickle?: boolean;
    trickleSpeed?: number;
    showSpinner?: boolean;
    parent?: string;
  }

  interface NProgress {
    configure(options: NProgressOptions): NProgress;
    set(number: number): NProgress;
    inc(amount?: number): NProgress;
    done(force?: boolean): NProgress;
    start(): NProgress;
    remove(): void;
    status: number | null;
    version: string;
    settings: NProgressOptions;
    isStarted(): boolean;
  }

  const nprogress: NProgress;
  export = nprogress;
}
