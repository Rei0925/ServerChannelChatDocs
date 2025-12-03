// ==== Minecraft Color Code Highlighter ====
// Reference: https://htmlcolorcodes.com/minecraft-color-codes/

// Minecraft color code map
const mcColors = {
  "0": "#000000", // Black
  "1": "#0000AA", // Dark Blue
  "2": "#00AA00", // Dark Green
  "3": "#00AAAA", // Dark Aqua
  "4": "#AA0000", // Dark Red
  "5": "#AA00AA", // Dark Purple
  "6": "#FFAA00", // Gold
  "7": "#AAAAAA", // Gray
  "8": "#555555", // Dark Gray
  "9": "#5555FF", // Blue
  "a": "#55FF55", // Green
  "b": "#55FFFF", // Aqua
  "c": "#FF5555", // Red
  "d": "#FF55FF", // Light Purple
  "e": "#FFFF55", // Yellow
  "f": "#FFFFFF", // White

  "k": null, // obfuscated → not supported in HTML
  "l": "bold",
  "m": "line-through",
  "n": "underline",
  "o": "italic",
  "r": "reset" // reset formatting
};

// Highlight function
function highlightMinecraftCodes(input) {
  let result = "";
  let currentColor = "#FFFFFF";
  let currentStyles = {};

  function applySpan(text) {
    let style = `color: ${currentColor};`;
    if (currentStyles.bold) style += "font-weight: bold;";
    if (currentStyles.underline) style += "text-decoration: underline;";
    if (currentStyles.strike) style += "text-decoration: line-through;";
    if (currentStyles.italic) style += "font-style: italic;";
    return `<span style="${style}">${text}</span>`;
  }

  for (let i = 0; i < input.length; i++) {
    if (input[i] === "§" && mcColors[input[i + 1]]) {
      const code = input[i + 1];
      i++;

      if (mcColors[code] === "reset") {
        currentColor = "#FFFFFF";
        currentStyles = {};
        continue;
      }

      if (mcColors[code] === "bold") {
        currentStyles.bold = true;
        continue;
      }
      if (mcColors[code] === "line-through") {
        currentStyles.strike = true;
        continue;
      }
      if (mcColors[code] === "underline") {
        currentStyles.underline = true;
        continue;
      }
      if (mcColors[code] === "italic") {
        currentStyles.italic = true;
        continue;
      }
      if (mcColors[code] === null) {
        continue;
      }

      currentColor = mcColors[code];
      continue;
    }

    result += applySpan(input[i]);
  }

  return result;
}

// Apply highlighting to all elements with class "mc-highlight"
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("code[data-mc-block]").forEach((el, index) => {
    if (!el.id) el.id = `mc-code-${index}`;

    // Wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "bg-gray-900 rounded-lg my-6";

    // Header
    const header = document.createElement("div");
    header.className = "flex items-center justify-between px-4 py-2 border-b border-gray-700";

    const title = document.createElement("span");
    title.className = "text-xs font-semibold text-gray-400";
    title.innerText = el.dataset.title || "MinecraftCommand";

    const copyBtn = document.createElement("button");
    copyBtn.className = "flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors copy-btn";
    copyBtn.setAttribute("data-target", el.id);
    copyBtn.innerHTML = `<span class="material-symbols-outlined text-sm">content_copy</span><span class="copy-label">Copy</span>`;

    header.appendChild(title);
    header.appendChild(copyBtn);

    // Content div
    const contentDiv = document.createElement("div");
    contentDiv.className = "p-4 text-sm text-white overflow-x-auto";

    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.className = "font-code";
    code.id = el.id;

    // Highlight Minecraft colors here
    code.innerHTML = highlightMinecraftCodes(el.innerText);

    pre.appendChild(code);
    contentDiv.appendChild(pre);

    wrapper.appendChild(header);
    wrapper.appendChild(contentDiv);

    // Replace original code element with wrapper
    el.parentNode.replaceChild(wrapper, el);
    });

  // Add copy to clipboard functionality
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const codeEl = document.getElementById(targetId);
      if (!codeEl) return;

      const textToCopy = codeEl.innerText; // copy plain text
      navigator.clipboard.writeText(textToCopy).then(() => {
        const label = btn.querySelector(".copy-label");
        const original = label.innerText;
        label.innerText = "Copied!";
        setTimeout(() => label.innerText = original, 1500);
      });
    });
  });
});