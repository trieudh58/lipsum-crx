(function () {
  const lipsum = require('lorem-ipsum')

  const outputEl = document.getElementById('output-content')
  const generateBtn = document.getElementById('btn-generate')
  const copyBtn = document.getElementById('btn-copy')
  const labelCopied = document.getElementById('label-copied')

  let currentTimeout = undefined

  copyBtn.addEventListener('click', function () {
    outputEl.select()
    document.execCommand('Copy')
    labelCopied.classList.remove('hide')
    if (currentTimeout) {
      clearTimeout(currentTimeout)
    }
    currentTimeout = setTimeout(function () {
      labelCopied.classList.add('hide')
    }, 2000)
  })

  generateBtn.addEventListener('click', function () {
    const countEl = document.getElementById('count')
    const unitEl = document.getElementById('unit')

    const count = +countEl.value
    const unit = unitEl.options[unitEl.selectedIndex].value

    outputEl.textContent = lipsum({
      count: count,
      units: unit,
      format: 'plain',
      sentenceLowerBound: 5,
      sentenceUpperBound: 20,
      paragraphLowerBound: 2,
      paragraphUpperBound: 7,
    })
  })

  // Initialize
  generateBtn.click()
})()
