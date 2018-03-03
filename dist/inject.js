(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};

},{}],2:[function(require,module,exports){
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

},{"lorem-ipsum":4,"uuid":5}],3:[function(require,module,exports){
var dictionary = {
  words: [
    'ad',
    'adipisicing',
    'aliqua',
    'aliquip',
    'amet',
    'anim',
    'aute',
    'cillum',
    'commodo',
    'consectetur',
    'consequat',
    'culpa',
    'cupidatat',
    'deserunt',
    'do',
    'dolor',
    'dolore',
    'duis',
    'ea',
    'eiusmod',
    'elit',
    'enim',
    'esse',
    'est',
    'et',
    'eu',
    'ex',
    'excepteur',
    'exercitation',
    'fugiat',
    'id',
    'in',
    'incididunt',
    'ipsum',
    'irure',
    'labore',
    'laboris',
    'laborum',
    'Lorem',
    'magna',
    'minim',
    'mollit',
    'nisi',
    'non',
    'nostrud',
    'nulla',
    'occaecat',
    'officia',
    'pariatur',
    'proident',
    'qui',
    'quis',
    'reprehenderit',
    'sint',
    'sit',
    'sunt',
    'tempor',
    'ullamco',
    'ut',
    'velit',
    'veniam',
    'voluptate'  
  ]
};

module.exports = dictionary;
},{}],4:[function(require,module,exports){
var generator = function() {
  var options = (arguments.length) ? arguments[0] : {}
    , count = options.count || 1
    , units = options.units || 'sentences'
    , sentenceLowerBound = options.sentenceLowerBound || 5
    , sentenceUpperBound = options.sentenceUpperBound || 15
    , paragraphLowerBound = options.paragraphLowerBound || 3
    , paragraphUpperBound = options.paragraphUpperBound || 7
    , format = options.format || 'plain'
    , words = options.words || require('./dictionary').words
    , random = options.random || Math.random
    , suffix = options.suffix;

  if (!suffix) {
    var isNode = typeof module !== 'undefined' && module.exports;
    var isReactNative = typeof product !== 'undefined' && product.navigator === 'ReactNative';

    if (!isReactNative && isNode) {
      suffix = require('os').EOL;
    } else {
      suffix = '\n';
    }
  }

  units = simplePluralize(units.toLowerCase());

  var randomInteger = function(min, max) {
    return Math.floor(random() * (max - min + 1) + min);
  };

  var randomWord = function(words) {
    return words[randomInteger(0, words.length - 1)];
  };

  var randomSentence = function(words, lowerBound, upperBound) {
    var sentence = ''
      , bounds = {min: 0, max: randomInteger(lowerBound, upperBound)};

    while (bounds.min < bounds.max) {
      sentence = sentence + ' ' + randomWord(words);
      bounds.min = bounds.min + 1;
    }

    if (sentence.length) {
      sentence = sentence.slice(1);
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
    }

    return sentence;
  };

  var randomParagraph = function(words, lowerBound, upperBound, sentenceLowerBound, sentenceUpperBound) {
    var paragraph = ''
      , bounds = {min: 0, max: randomInteger(lowerBound, upperBound)};

    while (bounds.min < bounds.max) {
      paragraph = paragraph + '. ' + randomSentence(words, sentenceLowerBound, sentenceUpperBound);
      bounds.min = bounds.min + 1;
    }

    if (paragraph.length) {
      paragraph = paragraph.slice(2);
      paragraph = paragraph + '.';
    }

    return paragraph;
  }

  var iter = 0
    , bounds = {min: 0, max: count}
    , string = ''
    , prefix = ''
    , openingTag
    , closingTag;

  if (format == 'html') {
    openingTag = '<p>';
    closingTag = '</p>';
  }

  while (bounds.min < bounds.max) {
    switch (units.toLowerCase()) {
      case 'words':
        string = string + ' ' + randomWord(words);
        break;
      case 'sentences':
        string = string + '. ' + randomSentence(words, sentenceLowerBound, sentenceUpperBound);
        break;
      case 'paragraphs':
        var nextString = randomParagraph(words, paragraphLowerBound, paragraphUpperBound, sentenceLowerBound, sentenceUpperBound);

        if (format == 'html') {
          nextString = openingTag + nextString + closingTag;
          if (bounds.min < bounds.max - 1) {
            nextString = nextString + suffix; // Each paragraph on a new line
          }
        } else if (bounds.min < bounds.max - 1) {
          nextString = nextString + suffix + suffix; // Double-up the EOL character to make distinct paragraphs, like carriage return
        }

        string = string + nextString;

        break;
    }

    bounds.min = bounds.min + 1;
  }

  if (string.length) {
    var pos = 0;

    if (string.indexOf('. ') == 0) {
      pos = 2;
    } else if (string.indexOf('.') == 0 || string.indexOf(' ') == 0) {
      pos = 1;
    }

    string = string.slice(pos);

    if (units == 'sentences') {
      string = string + '.';
    }
  }

  return string;
};

function simplePluralize(string) {
  if (string.indexOf('s', string.length - 1) === -1) {
    return string + 's';
  }
  return string;
}

module.exports = generator;

},{"./dictionary":3,"os":1}],5:[function(require,module,exports){
var v1 = require('./v1');
var v4 = require('./v4');

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;

},{"./v1":8,"./v4":9}],6:[function(require,module,exports){
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;

},{}],7:[function(require,module,exports){
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && msCrypto.getRandomValues.bind(msCrypto));
if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

},{}],8:[function(require,module,exports){
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;
var _clockseq;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    var seedBytes = rng();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;

},{"./lib/bytesToUuid":6,"./lib/rng":7}],9:[function(require,module,exports){
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;

},{"./lib/bytesToUuid":6,"./lib/rng":7}]},{},[2]);
