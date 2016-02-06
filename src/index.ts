/// <reference path="../typings/tsd.d.ts" />

import { EventEmitter } from "events";

class TabStrip extends EventEmitter {
  tabsRoot: HTMLOListElement;

  constructor(container: HTMLElement) {
    super();

    this.tabsRoot = container.querySelector(":scope > ol.tab-strip") as HTMLOListElement;
    if (this.tabsRoot == null) {
      this.tabsRoot = document.createElement("ol");
      this.tabsRoot.classList.add("tab-strip");
      container.appendChild(this.tabsRoot);
    }

    this.tabsRoot.addEventListener("mousedown", this.onTabMouseDown);
    this.tabsRoot.addEventListener("mouseup", this.onTabMouseUp);
  }

  private onTabMouseUp = (event: MouseEvent) => {
    const tabElement = event.target as HTMLLIElement;

    // Only handle middle-click and ignore clicks outside any tab
    if (event.button !== 1 || tabElement.parentElement !== this.tabsRoot) return;

    this.emit("closeTab", tabElement);
  }

  private onTabMouseDown = (event: MouseEvent) => {
    const tabElement = event.target as HTMLLIElement;

    // Only handle left-click
    if (event.button !== 0 || tabElement.parentElement !== this.tabsRoot) return;

    this.emit("activateTab", tabElement);

    // Tab reordering
    const tabRect = tabElement.getBoundingClientRect();
    const leftOffsetFromMouse = tabRect.left - event.clientX;
    let hasDragged = false;

    tabElement.classList.add("dragged");
    tabElement.style.width = `${tabRect.width}px`;
    tabElement.style.flexBasis = `${tabRect.width}px`;

    // NOTE: set/releaseCapture aren't supported in Chrome yet
    // hence the conditional call
    if ((tabElement as any).setCapture != null) (tabElement as any).setCapture();

    const tabPlaceholderElement = document.createElement("li") as HTMLLIElement;
    tabPlaceholderElement.style.width = `${tabRect.width}px`;
    tabPlaceholderElement.style.flexBasis = `${tabRect.width}px`;
    tabPlaceholderElement.className = "drop-placeholder";
    tabElement.parentElement.insertBefore(tabPlaceholderElement, tabElement.nextSibling);

    const updateDraggedTab = (clientX: number) => {
      const tabsRootRect = this.tabsRoot.getBoundingClientRect();

      let tabLeft = Math.max(Math.min(clientX + leftOffsetFromMouse, tabsRootRect.right - tabRect.width), tabsRootRect.left);
      if (hasDragged || Math.abs(tabLeft - tabRect.left) >= 10) {
        hasDragged = true;
      } else {
        tabLeft = tabRect.left;
      }

      tabElement.style.left = `${tabLeft}px`;

      if (tabLeft < tabPlaceholderElement.getBoundingClientRect().left) {
        let otherTabElement = tabPlaceholderElement;
        while (true) {
          otherTabElement = tabPlaceholderElement.previousSibling as HTMLLIElement;
          if (otherTabElement === tabElement) otherTabElement = otherTabElement.previousSibling as HTMLLIElement;
          if (otherTabElement == null) break;

          const otherTabCenter = otherTabElement.getBoundingClientRect().left + otherTabElement.getBoundingClientRect().width / 2;
          if (otherTabCenter < tabLeft) break;

          otherTabElement.parentElement.insertBefore(tabPlaceholderElement, otherTabElement);
        }
      } else {
        let otherTabElement = tabPlaceholderElement;
        while (true) {
          otherTabElement = tabPlaceholderElement.nextSibling as HTMLLIElement;
          if (otherTabElement === tabElement) otherTabElement = otherTabElement.nextSibling as HTMLLIElement;
          if (otherTabElement == null) break;

          const otherTabCenter = otherTabElement.getBoundingClientRect().left + otherTabElement.getBoundingClientRect().width / 2;
          if (tabLeft + tabRect.width <= otherTabCenter) break;

          otherTabElement.parentElement.insertBefore(tabPlaceholderElement, otherTabElement.nextSibling);
        }
      }

      if (tabPlaceholderElement.nextSibling === tabElement) {
        tabElement.parentElement.insertBefore(tabPlaceholderElement, tabElement.nextSibling);
      }
    }

    const onDragTab = (event: MouseEvent) => { updateDraggedTab(event.clientX); };

    const onDropTab = (event: MouseEvent) => {
      // NOTE: set/releaseCapture aren't supported in Chrome yet
      // hence the conditional call
      if ((tabElement as any).releaseCapture != null) (tabElement as any).releaseCapture();

      if (tabPlaceholderElement.parentElement != null) {
        this.tabsRoot.replaceChild(tabElement, tabPlaceholderElement);
      } else {
        this.tabsRoot.appendChild(tabElement);
      }

      tabElement.classList.remove("dragged");
      tabElement.style.left = "";
      tabElement.style.width = "";
      tabElement.style.flexBasis = "";

      document.removeEventListener("mousemove", onDragTab);
      document.removeEventListener("mouseup", onDropTab);
    };

    updateDraggedTab(event.clientX);
    document.addEventListener("mousemove", onDragTab);
    document.addEventListener("mouseup", onDropTab);
  };
}

export = TabStrip;
