// hide the page until fully setup
document.documentElement.style.setProperty('opacity', '0')

let loading = load([
  "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js",
  "../index.css?" + document.querySelector('script[src*="index.js"]').src.split('?').pop(),
]);

// remove all default inline styles
document.querySelectorAll('style').forEach((el) => el.remove())

// wait for the page to fully load
document.addEventListener('DOMContentLoaded', main)

function main() {
  // wait for highlight.js to load
  if (!window.hljs) {
    console.log('loading: waiting for highlight.js to load...')
    setTimeout(main, 100)
    return
  }

  // wait for all assets to load
  if (!loading.isDone()) {
    console.log('loading: waiting for assets to load...')
    setTimeout(main, 100)
    return
  }

  configureIncrementalButton()
  configureSelectFix()
  configureTheme()
  configureCodeBlocks()
  highlight('.code .editor')
  addLineNumbers()

  // setup complete, restore the page visibility
  document.documentElement.style.setProperty('opacity', '1')
}

function configureIncrementalButton() {
  let url = window.location.href
  let isInc = url.includes('-inc.html')

  let link = document.createElement('a')
  link.classList = 'incremental'
  link.classList.add('hljs-selector-id')

  if (isInc) {
    link.title = 'Toggle to absolute coverage'
    link.href = url.replace('-inc.html', '.html')
  } else {
    link.title = 'Toggle to incremental coverage'
    link.href = url.replace('.html', '-inc.html')
  }

  link.innerHTML = `
    <span style="color: var(--covered);">↑</span>
    <span style="color: var(--uncovered);">↓</span>
    <span style="margin-left: 2px;">${isInc ? 'inc' : 'abs'}</span>
  `

  document.querySelector('#topbar').appendChild(link)
}

function configureSelectFix() {
  document.getElementById('files').addEventListener('change', (e) => {
    document.querySelectorAll('.file').forEach((el) => el.style.display = 'none')
    window.scrollTo(0, 0)
    setTimeout(() => document.getElementById(e.target.value).style.display = 'block', 1)
  })
}

function configureTheme() {
  let isDark = localStorage.getItem('dark') === 'true'

  let switchInput = document.createElement('input')
  switchInput.type = 'checkbox'
  switchInput.id = 'switch'
  switchInput.checked = isDark

  let switchLabel = document.createElement('label')
  switchLabel.htmlFor = 'switch'

  document.querySelector('#topbar').appendChild(switchInput)
  document.querySelector('#topbar').appendChild(switchLabel)

  if (isDark) {
    toggleDarkMode()
  }

  document.querySelector('#switch').addEventListener('click', toggleDarkMode)
}

function toggleDarkMode() {
  let lightStyle = document.querySelector('link[href*="github.min.css"]')
  let darkStyle = document.querySelector('link[href*="github-dark.min.css"]')

  document.documentElement.classList.toggle('dark')

  if (document.documentElement.classList.contains('dark')) {
    localStorage.setItem('dark', 'true')
    lightStyle.setAttribute('disabled', 'disabled')
    darkStyle.removeAttribute('disabled')
  } else {
    localStorage.setItem('dark', 'false')
    lightStyle.removeAttribute('disabled')
    darkStyle.setAttribute('disabled', 'disabled')
  }
}

function configureCodeBlocks() {
  let pres = Array.from(document.querySelectorAll('#content pre'))

  pres.forEach((pre) => {
    let gutter = document.createElement('div')
    gutter.classList.add('gutter')

    let editor = document.createElement('div')
    editor.classList.add('editor')
    editor.innerHTML = pre.innerHTML

    let code = document.createElement('div')
    code.classList = 'code'
    code.appendChild(gutter)
    code.appendChild(editor)

    let coverage = code.cloneNode(true)
    coverage.classList = 'coverage'

    code.style.setProperty('position', 'absolute')
    code.style.setProperty('top', '0')
    code.style.setProperty('left', '0')

    pre.innerHTML = ''
    pre.appendChild(coverage)
    pre.appendChild(code)
  })
}

function highlight(cssSelector) {
  hljs.configure({ cssSelector, ignoreUnescapedHTML: true })
  hljs.highlightAll()
}

function addLineNumbers() {
  let containers = Array.from(document.querySelectorAll('#content pre > div'))

  containers.forEach((container) => {
    let gutter = container.querySelector('.gutter')
    let editor = container.querySelector('.editor')
    let code = editor.innerHTML.replaceAll('    ', '  ')
    let lines = code.split('\n')
    let linesCount = lines.length
    let gutterHtml = ''

    editor.innerHTML = lines
      .map((line) => `<span class="line-start"></span>${line}`)
      .join('\n')

    let lineStarts = Array.from(editor.querySelectorAll('.line-start'))

    for (let i = 0; i < linesCount; i++) {
      let backgroundColor = window.getComputedStyle(
        lineStarts[i].parentElement,
      ).backgroundColor
      let textColor = backgroundColor.replace(' / 0.1', ' / 1')

      if (textColor === 'rgba(0, 0, 0, 0)') {
        gutterHtml += `<div>${i + 1}</div>`
      } else {
        gutterHtml += `<div style="background-color: ${backgroundColor}; color: ${textColor};">${i + 1}</div>`
      }
    }

    gutter.innerHTML = gutterHtml
  })
}

function loadScript(src, state) {
  let script = document.createElement('script')
  script.src = src
  script.async = true
  script.onload = () => {
    console.info(`loaded: ${src}`)
    state.loaded++
  }
  document.head.appendChild(script)
}

function loadStyle(src, state) {
  let style = document.createElement('link')
  style.rel = 'stylesheet'
  style.href = src
  style.async = true
  style.onload = () => {
    console.info(`loaded: ${src}`)
    state.loaded++
  }
  document.head.appendChild(style)
}

function load(urls) {
  let state = {
    loaded: 0,
    isDone: () => state.loaded === urls.length
  }

  for (let url of urls) {
    if (url.endsWith('.js')) {
      loadScript(url, state)
    } else {
      loadStyle(url, state)
    }
  }

  return state
}
