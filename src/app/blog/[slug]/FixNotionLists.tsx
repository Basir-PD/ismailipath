"use client";

import { useEffect } from "react";

export default function FixNotionLists() {
  useEffect(() => {
    function fixLists() {
      // Get all list items
      const bulletedItems = document.querySelectorAll("li.bulleted_list_item");
      const numberedItems = document.querySelectorAll("li.numbered_list_item");

      // Group bulleted items into proper lists
      let currentBulletedList: HTMLUListElement | null = null;

      bulletedItems.forEach((item) => {
        if (!currentBulletedList) {
          currentBulletedList = document.createElement("ul");
          currentBulletedList.className = "notion-list list-disc pl-5 my-2";
          item.parentNode?.insertBefore(currentBulletedList, item);
        }

        currentBulletedList.appendChild(item);

        // If the next sibling is not a bulleted item, reset the current list
        if (!item.nextElementSibling || !item.nextElementSibling.classList.contains("bulleted_list_item")) {
          currentBulletedList = null;
        }
      });

      // Group numbered items into proper lists
      let currentNumberedList: HTMLOListElement | null = null;

      numberedItems.forEach((item) => {
        if (!currentNumberedList) {
          currentNumberedList = document.createElement("ol");
          currentNumberedList.className = "notion-list list-decimal pl-5 my-2";
          item.parentNode?.insertBefore(currentNumberedList, item);
        }

        currentNumberedList.appendChild(item);

        // If the next sibling is not a numbered item, reset the current list
        if (!item.nextElementSibling || !item.nextElementSibling.classList.contains("numbered_list_item")) {
          currentNumberedList = null;
        }
      });
    }

    // Fix lists after a short delay to ensure content is rendered
    setTimeout(fixLists, 100);
  }, []);

  return null;
}
