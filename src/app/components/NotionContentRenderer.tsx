"use client";

import { useEffect } from "react";

export default function NotionContentRenderer() {
  useEffect(() => {
    function enhanceNotionContent() {
      // Find section headers (which may have different class patterns in Notion exports)
      const sectionHeaders = document.querySelectorAll(
        '.notion-content div[class*="header"], .notion-content div[class*="heading"], .notion-content div[class*="title"], .notion-content div[class*="subhead"], .notion-content p[class*="header"], .notion-content p[class*="heading"], .notion-content p[class*="title"], .notion-content p[class*="subhead"]'
      );

      sectionHeaders.forEach((header) => {
        // Determine heading level
        const className = header.className.toLowerCase();
        let level = 2; // Default to h2

        if (className.includes("h1") || className.includes("title") || className.includes("heading-1")) {
          level = 1;
        } else if (className.includes("h2") || className.includes("subhead") || className.includes("heading-2")) {
          level = 2;
        } else if (className.includes("h3") || className.includes("heading-3")) {
          level = 3;
        } else if (className.includes("h4") || className.includes("heading-4")) {
          level = 4;
        } else if (className.includes("h5") || className.includes("heading-5")) {
          level = 5;
        } else if (className.includes("h6") || className.includes("heading-6")) {
          level = 6;
        }

        // Skip if already processed or is actual heading element
        if (header.nodeName.toLowerCase() === `h${level}`) return;

        // Create the heading element and replace
        const newHeading = document.createElement(`h${level}`);
        newHeading.innerHTML = header.innerHTML;
        newHeading.className = `${header.className} notion-heading-${level}`;
        header.parentNode?.replaceChild(newHeading, header);
      });

      // Fix standard headers - expanded selector to catch more header patterns
      const headingSelectors = ["h1", "h2", "h3", "h4", "h5", "h6"];

      headingSelectors.forEach((selector, index) => {
        // Expanded selector to catch more header patterns
        const headings = document.querySelectorAll(`
          .notion-content div[class*="notion-${selector}"], 
          .notion-content div[class*="${selector}"],
          .notion-content p[class*="notion-${selector}"], 
          .notion-content p[class*="${selector}"]
        `);

        // Process potential headers that don't have proper classes
        document.querySelectorAll(".notion-content div, .notion-content p").forEach((el) => {
          // Skip elements that are already headings or inside headings
          if (el.closest("h1, h2, h3, h4, h5, h6")) return;

          // Check if this element has heading-like styling
          const computedStyle = window.getComputedStyle(el);
          const fontSize = parseFloat(computedStyle.fontSize);
          const fontWeight = computedStyle.fontWeight;

          // If element has larger font or bold weight, it might be a heading
          if ((fontSize > 16 || parseInt(fontWeight) >= 600) && el.textContent && el.textContent.trim().length > 0 && el.textContent.trim().length < 100) {
            // Reasonable heading length

            // Determine heading level based on font size
            let headingLevel = 2;
            if (fontSize >= 24) headingLevel = 1;
            else if (fontSize >= 20) headingLevel = 2;
            else if (fontSize >= 18) headingLevel = 3;
            else if (fontSize >= 16) headingLevel = 4;

            // Create new heading element
            const newHeading = document.createElement(`h${headingLevel}`);
            newHeading.innerHTML = el.innerHTML;
            newHeading.className = `${el.className} notion-heading-${headingLevel}`;
            el.parentNode?.replaceChild(newHeading, el);
          }
        });

        headings.forEach((heading) => {
          // Skip if already processed
          if (heading.nodeName.toLowerCase() === selector) return;

          // Ensure the heading has the proper class
          heading.classList.add(`notion-heading-${index + 1}`);

          // Set the actual heading tag
          const newHeading = document.createElement(selector);
          newHeading.innerHTML = heading.innerHTML;
          newHeading.className = heading.className;

          heading.parentNode?.replaceChild(newHeading, heading);
        });
      });

      // Fix callouts - using multiple selectors to catch all possible callout patterns
      const calloutSelectors = [
        '.notion-content div[data-block-id][class*="callout"]',
        '.notion-content div[class*="callout"]',
        '.notion-content div[class*="notice"]',
        '.notion-content div[class*="alert"]',
        '.notion-content div[class*="info"]',
        '.notion-content div[class*="warning"]',
        '.notion-content div[class*="note"]',
      ];

      const callouts = document.querySelectorAll(calloutSelectors.join(", "));

      callouts.forEach((callout) => {
        // Skip if already processed
        if (callout.classList.contains("notion-callout")) return;

        callout.classList.add("notion-callout");

        // Extract background color class and map it
        const bgColorClass = Array.from(callout.classList).find(
          (cls) =>
            cls.includes("bg-") ||
            cls.includes("background-") ||
            cls.includes("blue") ||
            cls.includes("yellow") ||
            cls.includes("green") ||
            cls.includes("red") ||
            cls.includes("purple") ||
            cls.includes("pink") ||
            cls.includes("gray") ||
            cls.includes("orange") ||
            cls.includes("brown")
        );

        if (bgColorClass) {
          // Map Notion color to our custom color classes
          const colorMap: Record<string, string> = {
            gray: "bg-gray-bg",
            blue: "bg-blue-bg",
            yellow: "bg-yellow-bg",
            green: "bg-green-bg",
            red: "bg-red-bg",
            purple: "bg-purple-bg",
            pink: "bg-pink-bg",
            brown: "bg-brown-bg",
            orange: "bg-orange-bg",
          };

          // Find matching color and apply appropriate class
          for (const [key, value] of Object.entries(colorMap)) {
            if (bgColorClass.includes(key)) {
              callout.classList.add(value);
              break;
            }
          }
        } else {
          // Default to gray if no color is specified
          callout.classList.add("bg-gray-bg");
        }

        // Structure callout with icon and content
        const calloutContent = callout.innerHTML;
        const icon = callout.querySelector(".notion-emoji");

        // Fix for the "null" issue - only add icon HTML if icon exists
        let iconHTML = "";
        if (icon) {
          iconHTML = `<div class="notion-callout-icon">${icon.outerHTML}</div>`;
          // Remove the icon from the content to avoid duplication
          callout.innerHTML = `
            ${iconHTML}
            <div class="notion-callout-content">${calloutContent.replace(icon.outerHTML, "")}</div>
          `;
        } else {
          callout.innerHTML = `<div class="notion-callout-content">${calloutContent}</div>`;
        }
      });

      // Fix quotes
      const quotes = document.querySelectorAll('.notion-content div[data-block-id][class*="quote"], .notion-content div[class*="quote"], .notion-content div[class*="blockquote"]');
      quotes.forEach((quote) => {
        // Skip if already processed
        if (quote.classList.contains("notion-quote")) return;

        // Convert to proper blockquote element
        const blockquote = document.createElement("blockquote");
        blockquote.className = "notion-quote";
        blockquote.innerHTML = quote.innerHTML;

        quote.parentNode?.replaceChild(blockquote, quote);
      });

      // Fix code blocks
      const codeBlocks = document.querySelectorAll('.notion-content div[data-block-id][class*="code"], .notion-content pre:not(.notion-code)');
      codeBlocks.forEach((codeBlock) => {
        // Skip if already processed
        if (codeBlock.classList.contains("notion-code")) return;

        codeBlock.classList.add("notion-code");
      });

      // Fix tables
      const tables = document.querySelectorAll(".notion-content table:not(.notion-table)");
      tables.forEach((table) => {
        table.classList.add("notion-table");
      });

      // Fix images
      const images = document.querySelectorAll(".notion-content img:not(.notion-image)");
      images.forEach((image) => {
        image.classList.add("notion-image");
      });

      // Fix lists
      const fixLists = () => {
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
      };

      // Run list fix
      fixLists();
    }

    // Run initially after a short delay
    setTimeout(enhanceNotionContent, 300);

    // Run again after a longer delay to catch any dynamically loaded content
    setTimeout(enhanceNotionContent, 1000);

    // Add a third run with even longer delay to ensure all content is processed
    setTimeout(enhanceNotionContent, 2500);

    // Add MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver(() => {
      enhanceNotionContent();
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });

    // Clean up observer on component unmount
    return () => observer.disconnect();
  }, []);

  return null;
}
