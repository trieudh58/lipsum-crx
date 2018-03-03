(function () {
  const lipsum = require('lorem-ipsum')

  const outputEl = document.getElementById('output-content')
  const generateAndCopyBtn = document.getElementById('btn-generate-and-copy')
  const countInputBox = document.getElementById('count')
  const unitSelectBox = document.getElementById('unit')
  const labelCopied = document.getElementById('label-copied')
  const toggleInstructionsBtn = document.getElementById('btn-toggle-instructions')

  let currentTimeout
  let countChanged = false

  toggleInstructionsBtn.addEventListener('click', function () {
    const instructionsEl = document.getElementById('instructions')
    instructionsEl.classList.toggle('hidden')
  })

  countInputBox.addEventListener('input', function (event) {
    countChanged = true
  })

  unitSelectBox.addEventListener('change', function (event) {
    if (countChanged) {
      return
    }
    const units = event.target.value
    
    switch (units) {
      case 'words':
        countInputBox.value = 20
        break
      case 'sentences':
        countInputBox.value = 5
        break
      case 'paragraphs':
        countInputBox.value = 2
        break
    }
  })

  generateAndCopyBtn.addEventListener('click', function () {
    const countEl = document.getElementById('count')
    const unitEl = document.getElementById('unit')

    const count = +countEl.value
    const unit = unitEl.options[unitEl.selectedIndex].value

    // TODO: Validate input range/value

    outputEl.textContent = lipsum({
      count: count,
      units: unit,
      format: 'plain',
      sentenceLowerBound: 5,
      sentenceUpperBound: 20,
      paragraphLowerBound: 2,
      paragraphUpperBound: 7,
    })

    // Copy to clipboard
    outputEl.select()
    document.execCommand('Copy')

    outputEl.classList.add('blurred')
    labelCopied.classList.remove('hidden')

    if (currentTimeout) {
      clearTimeout(currentTimeout)
    }
    currentTimeout = setTimeout(function () {
      outputEl.classList.remove('blurred')
      labelCopied.classList.add('hidden')
    }, 3000)
  })

  // Initialize
  initialize()

  function initialize() {
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
  }
})()
