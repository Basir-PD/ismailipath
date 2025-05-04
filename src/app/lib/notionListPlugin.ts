// Create a plugin that follows the format expected by NotionRenderer
export default function listFixPlugin() {
  return {
    // Extensions array is required by NotionRenderer interface
    extensions: [
      // This function will post-process the HTML to fix list rendering
      (html: string) => {
        // Fix for bulleted lists - wrap consecutive li elements in ul tags
        let fixedHtml = html.replace(/<li class="bulleted_list_item">(.*?)<\/li>/g, '<ul class="list-disc pl-5 my-2"><li>$1</li></ul>');

        // Remove nested ul tags that might be created
        fixedHtml = fixedHtml.replace(/<ul class="list-disc pl-5 my-2"><\/ul>/g, "");

        // Fix for numbered lists - wrap consecutive li elements in ol tags
        fixedHtml = fixedHtml.replace(/<li class="numbered_list_item">(.*?)<\/li>/g, '<ol class="list-decimal pl-5 my-2"><li>$1</li></ol>');

        // Remove nested ol tags that might be created
        fixedHtml = fixedHtml.replace(/<ol class="list-decimal pl-5 my-2"><\/ol>/g, "");

        // Combine adjacent ul and ol elements to create proper lists
        fixedHtml = fixedHtml.replace(/<\/ul>\s*<ul class="list-disc pl-5 my-2">/g, "");
        fixedHtml = fixedHtml.replace(/<\/ol>\s*<ol class="list-decimal pl-5 my-2">/g, "");

        return fixedHtml;
      },
    ],
    // Empty renderers array is required by NotionRenderer interface
    renderers: [],
  };
}
