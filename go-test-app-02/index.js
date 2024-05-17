document.addEventListener("DOMContentLoaded", main);

function main () {
  document.querySelectorAll('style').forEach((el) => el.remove());
  document.body.style.setProperty("display", "block");

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
