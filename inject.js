(function () {
  const uuid = require('uuid')
  const lipsum = require('lorem-ipsum')

  const COMMAND_PATTERN = /ls(w|s|p|W|S|P)[0-9]+/
  const VALID_UNITS = ['words', 'sentences', 'paragraphs']

  const trackedEls = new Map()

  document.addEventListener('focusin', function onFocusIn(event) {
    const target = event.target

    // The target must be tracked to prevent the case
    // 2 'focusin' events are added to the same element.
    target.id = target.id || uuid.v4()
    if (!trackedEls.has(target.id)) {
      trackedEls.set(target.id, target)
    } else {
      return
    }
    
    target.removeEventListener('keyup', onKeyUp, false)
    target.addEventListener('keyup', onKeyUp, false)

    function onKeyUp(event) {
      // If Control key is pressed
      if (event.keyCode === 17) {
        const input = target.value || target.textContent
        const matchingResult = COMMAND_PATTERN.exec(input)
        if (!matchingResult) {
          return
        }
        const { '0': command, index } = matchingResult

        const { count, units } = parseCommandParameters(command)
        if (isNaN(Number(count)) || count < 1 || VALID_UNITS.indexOf(units) === -1) {
          return
        }
        const output = lipsum({
          count: count,
          units: units,
          format: 'plain',
          sentenceLowerBound: 5,
          sentenceUpperBound: 20,
          paragraphLowerBound: 2,
          paragraphUpperBound: 7,
        })
        
        if (target.value) {
          target.value = input.replace(new RegExp(command, 'g'), output)
        }
        if (target.textContent) {
          target.textContent = input.replace(new RegExp(command, 'g'), output)
        }

        // Simulate 'input' event
        // so that backed framework of the site can detect the changed value
        const inputEvent = new Event('input', {
          bubbles: true,
          cancelable: true,
        })
        target.dispatchEvent(inputEvent)
      }
    }
  })

  function parseCommandParameters(command) {
    let units, count
    if (!command || command.length < 4) {
      return {}
    }
    
    const prefixRemoved = command.slice(2)
    const unitType = prefixRemoved[0]
    
    count = +prefixRemoved.slice(1)
    switch (unitType.toUpperCase()) {
      case 'W':
        units = 'words'
        break
      case 'S':
        units = 'sentences'
        break
      case 'P':
        units = 'paragraphs'
        break
    }

    return { count, units }
  }
})()
