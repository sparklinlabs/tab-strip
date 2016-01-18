/// <reference path="../typings/tsd.d.ts" />

import { EventEmitter } from "events";

class TabStrip extends EventEmitter {
  tabsRoot: HTMLOListElement;

  constructor(container: HTMLElement) {
    super();

    this.tabsRoot = document.createElement("ol");
    this.tabsRoot.classList.add("tab-strip");
    container.appendChild(this.tabsRoot);

    this.tabsRoot.addEventListener("mousedown", this._onTabMouseDown);
    this.tabsRoot.addEventListener("mouseup", this._onTabMouseUp);
  }

  _onTabMouseUp = (event: MouseEvent) => {
    let tabElement = event.target as HTMLLIElement;

    // Only handle middle-click and ignore clicks outside any tab
    if (event.button !== 1 || tabElement.parentElement !== this.tabsRoot) return;

    this.emit("closeTab", tabElement);
  };

  _onTabMouseDown = (event: MouseEvent) => {
    let tabElement = event.target as HTMLLIElement;

    // Only handle left-click
    if (event.button !== 0 || tabElement.parentElement !== this.tabsRoot) return;

    this.emit("activateTab", tabElement);

    // Tab reordering
    let tabRect = tabElement.getBoundingClientRect();
    let leftOffsetFromMouse = tabRect.left - event.clientX;
    let hasDragged = false;

    tabElement.classList.add("dragged");

    // FIXME: Hard-coded border?
    tabElement.style.width = `${tabRect.width + 1}px`;

    // NOTE: set/releaseCapture aren"t supported in Chrome yet
    // hence the conditional call
    if ((tabElement as any).setCapture != null) (tabElement as any).setCapture();

    let tabPlaceholderElement = document.createElement("li") as HTMLLIElement;
    tabPlaceholderElement.style.width = `${tabRect.width}px`;
    tabPlaceholderElement.className = "drop-placeholder";
    tabElement.parentElement.insertBefore(tabPlaceholderElement, tabElement.nextSibling);

    let updateDraggedTab = (clientX: number) => {
      let tabsRootRect = this.tabsRoot.getBoundingClientRect();

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

          let otherTabCenter = otherTabElement.getBoundingClientRect().left + otherTabElement.getBoundingClientRect().width / 2;
          if (otherTabCenter < tabLeft) break;

          otherTabElement.parentElement.insertBefore(tabPlaceholderElement, otherTabElement);
        }
      } else {
        let otherTabElement = tabPlaceholderElement;
        while (true) {
          otherTabElement = tabPlaceholderElement.nextSibling as HTMLLIElement;
          if (otherTabElement === tabElement) otherTabElement = otherTabElement.nextSibling as HTMLLIElement;
          if (otherTabElement == null) break;

          let otherTabCenter = otherTabElement.getBoundingClientRect().left + otherTabElement.getBoundingClientRect().width / 2;
          if (tabLeft + tabRect.width < otherTabCenter) break;

          otherTabElement.parentElement.insertBefore(tabPlaceholderElement, otherTabElement.nextSibling);
        }
      }

      if (tabPlaceholderElement.nextSibling === tabElement) {
        tabElement.parentElement.insertBefore(tabPlaceholderElement, tabElement.nextSibling);
      }
    };

    let onDragTab = (event: MouseEvent) => { updateDraggedTab(event.clientX); };

    let onDropTab = (event: MouseEvent) => {
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

      document.removeEventListener("mousemove", onDragTab);
      document.removeEventListener("mouseup", onDropTab);
    };

    updateDraggedTab(event.clientX);
    document.addEventListener("mousemove", onDragTab);
    document.addEventListener("mouseup", onDropTab);
  };
}

export = TabStrip;
