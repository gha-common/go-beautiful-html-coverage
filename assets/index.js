let pres = document.querySelectorAll('#content pre');

pres.forEach((pre) => {
  let lines = pre.innerHTML.split('\n');
  pre.style.setProperty('--ln-width', lines.length.toString().length);
  let linesWithNumbers = lines.map((l, i) => `<span class="ln">${i+1}</span>${l}`);
  pre.innerHTML = linesWithNumbers.join('\n');
});
