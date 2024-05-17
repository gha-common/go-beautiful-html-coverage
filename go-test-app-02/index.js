load([
  ["https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css"],
  ["https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css", 'disabled'],
  ["https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"],
  ["https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/go.min.js"],
  ["../index.css"],
]);

document.addEventListener("DOMContentLoaded", main);
document.documentElement.style.setProperty("opacity", "0");


function main () {
  document.querySelectorAll('style').forEach((el) => el.remove());

  if (!window.hljs) {
    console.log("Waiting for highlight.js to load...");
    setTimeout(main, 100);
    return;
  }

  document.documentElement.style.setProperty("opacity", "1");
  document.body.style.setProperty("transition", "all 0.1s ease-in-out");
  document.body.style.setProperty("opacity", "1");

  document.querySelector("#legend").addEventListener("click", (event) => {
    let lightStyle = document.querySelector('link[href*="github.min.css"]');
    let darkStyle = document.querySelector('link[href*="github-dark.min.css"]');

    document.documentElement.classList.toggle("dark");

    if (document.documentElement.classList.contains("dark")) {
      lightStyle.setAttribute("disabled", "disabled");
      darkStyle.removeAttribute("disabled");
    } else {
      lightStyle.removeAttribute("disabled");
      darkStyle.setAttribute("disabled", "disabled");
    }
  });

  let pres = Array.from(document.querySelectorAll("#content pre"));
  let clones = [];

  pres.forEach((pre) => {
    let gutter = document.createElement("div");
    gutter.classList.add("gutter");

    let editor = document.createElement("div");
    editor.classList.add("editor");
    editor.innerHTML = pre.innerHTML;

    let code = document.createElement("div");
    code.classList.add("code");
    code.style.setProperty("top", "0");
    code.style.setProperty("left", "0");
    code.style.setProperty("position", "absolute");
    code.appendChild(gutter);
    code.appendChild(editor);

    let coverage = code.cloneNode(true);
    coverage.classList = "coverage";

    pre.innerHTML = "";
    pre.appendChild(coverage);
    pre.appendChild(code);
  });

  highlight();
  addLineNumbers();
}

function highlight() {
  hljs.configure({ cssSelector: ".code .editor" });
  hljs.highlightAll();
}

function addLineNumbers() {
  let containers = Array.from(document.querySelectorAll("#content pre > div"));

  containers.forEach((container) => {
    let gutter = container.querySelector(".gutter");
    let editor = container.querySelector(".editor");
    let code = editor.innerHTML.replaceAll("    ", "  ");
    let lines = code.split("\n");
    let linesCount = lines.length;
    let gutterHtml = "";

    editor.innerHTML = lines
      .map((line) => `<span class="line-start"></span>${line}`)
      .join("\n");

    let lineStarts = Array.from(editor.querySelectorAll(".line-start"));

    for (let i = 0; i < linesCount; i++) {
      let backgroundColor = window.getComputedStyle(
        lineStarts[i].parentElement,
      ).backgroundColor;
      let textColor = backgroundColor.replace(" / 0.1", " / 1");

      if (textColor === "rgba(0, 0, 0, 0)") {
        gutterHtml += `<div>${i + 1}</div>`;
      } else {
        gutterHtml += `<div style="background-color: ${backgroundColor}; color: ${textColor};">${i + 1}</div>`;
      }

    }

    gutter.innerHTML = gutterHtml;
  });
}

function loadScript(src) {
  let script = document.createElement("script");
  script.src = src;
  script.async = false;
  document.head.appendChild(script);
}

function loadStyle(src, disabled) {
  let style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = src;
  style.disabled = disabled === "disabled";
  document.head.appendChild(style);
}

function load(urls) {
  for (let [url, disabled] of urls) {
    if (url.endsWith(".js")) {
      loadScript(url);
    } else if (url.endsWith(".css")) {
      loadStyle(url, disabled);
    }
  }
}
