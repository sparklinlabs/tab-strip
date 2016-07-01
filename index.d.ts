declare class TabStrip {
  tabsRoot: HTMLOListElement;

  constructor(container: HTMLElement);

  addListener(event: string, listener: Function): TabStrip;
  on(event: string, listener: Function): TabStrip;
  once(event: string, listener: Function): TabStrip;
  removeListener(event: string, listener: Function): TabStrip;
  removeAllListeners(event?: string): TabStrip;
  setMaxListeners(n: number): TabStrip;
  getMaxListeners(): number;
  listeners(event: string): Function[];
  emit(event: string, ...args: any[]): boolean;
  listenerCount(type: string): number;

  on(event: "activateTab", listener: (tab: HTMLLIElement) => any): TabStrip;
  on(event: "closeTab", listener: (tab: HTMLLIElement) => any): TabStrip;
}

declare namespace TabStrip {
}

export = TabStrip;
