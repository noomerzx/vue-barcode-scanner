const VueBarcodeScanner = {
  install (Vue, options) {
    /* global Audio */
    // default plugin setting
    let attributes = {
      previousCode: '',
      barcode: '',
      setting: {
        sound: false,
        soundSrc: '',
        scannerSensitivity: 100,
        requiredAttr: false,
        // `controlSequenceKeys` should be an array of Strings ([String])
        // that will be joined in a regex string for identifying
        // control sequences
        //
        // they will be replaced in the return string by tags
        // example:
        //   NumLock, 0, 0, 1, 3, NumLock
        //   is replaced with
        //   <VControlSequence>0013</VControlSequence>
        //
        // this allows easy string replacement
        controlSequenceKeys: null,
        // Some scanners do not end their sequence with the ENTER key.
        // This option allows "finishing" the sequence without an ENTER key
        // after the number of ms defined in `setting.scannerSensitivity`
        // elapses after the last character in the sequence.
        // Example:
        // (without timeout, sequence ends with ENTER):
        //   1. Scan barcode
        //   2. Scanner sends sequence of characters to device, ending with ENTER (13) key
        //   3. `callback` passed in `init()` is called
        // (without timeout, sequence ends without ENTER):
        //   1. Scan barcode
        //   2. Scanner sends sequence of characters to device. Final character is not ENTER
        //   3. `callback` is not called until the ENTER key is pressed
        // (with timeout, sequence ends without ENTER):
        //   1. Scan barcode
        //   2. Scanner sends sequence of characters to device. Final character is not ENTER
        //   3. After `setting.scannerSensitivity` ms elapses, `callback` is called
        callbackAfterTimeout: false
      },
      callback: null,
      hasListener: false,
      pressedTime: [],
      // This is used for scanners which do not send
      // ENTER (13) as the final key code
      // in a barcode sequence.
      timeout: null,
      // Used to handle control sequences
      isInControlSequence: false,
      // Used to emit messages
      eventBus: null,
      // Used for determing whether or not to emit a `start` event
      isProcessing: false,
    }

    // initial plugin setting
    if (options) {
      attributes.setting.requiredAttr = options.requiredAttr || false
      attributes.setting.sound = options.sound || attributes.setting.sound
      attributes.setting.soundSrc = options.soundSrc || attributes.setting.soundSrc
      attributes.setting.scannerSensitivity = options.sensitivity || attributes.setting.scannerSensitivity
      attributes.setting.controlSequenceKeys = options.controlSequenceKeys || null
      attributes.setting.callbackAfterTimeout = options.callbackAfterTimeout || false
    }

    Vue.prototype.$barcodeScanner = {}

    Vue.prototype.$barcodeScanner.init = (callback, options = {}) => {
      // add listenter for scanner
      // use keypress to separate lower/upper case character from scanner
      addListener('keypress')
      // use keydown only to detect Tab event (Tab cannot be detected using keypress)
      addListener('keydown')
      attributes.callback = callback

      // allow an event bus to be passed back to the caller
      //
      // this is an `init` option because whomever is implementing
      // this plugin may not want to create additional Vue instances
      // on every component, but would like to have access to a bus
      // under some circumstances
      //
      // the importance of this is greater when scanning 2D
      // barcodes, which take significantly longer (>=4 seconds)
      // than 1D barcodes and some kind of indication of
      // what the library is doing is useful
      if (options.eventBus) {
        attributes.eventBus = new Vue()
        return attributes.eventBus
      }
    }

    Vue.prototype.$barcodeScanner.destroy = () => {
      // remove listener
      removeListener('keypress')
      removeListener('keydown')
    }

    Vue.prototype.$barcodeScanner.hasListener = () => {
      return attributes.hasListener
    }

    Vue.prototype.$barcodeScanner.getPreviousCode = () => {
      return attributes.previousCode
    }

    Vue.prototype.$barcodeScanner.setSensitivity = (sensitivity) => {
      attributes.setting.scannerSensitivity = sensitivity
    }

    function addListener (type) {
      if (attributes.hasListener) {
        removeListener(type)
      }
      window.addEventListener(type, onInputScanned)
      attributes.hasListener = true
    }

    function removeListener (type) {
      if (attributes.hasListener) {
        window.removeEventListener(type, onInputScanned)
        attributes.hasListener = false
      }
    }

    // this is called when either an ENTER key (13) is received
    // or when the `attributes.timeout` fires, following
    // a scan sequence
    function finishScanSequence () {
      // clear and null the timeout
      if (attributes.timeout) {
        clearTimeout(attributes.timeout)
      }
      attributes.timeout = null

      // scanner is done and trigger Enter/Tab then clear barcode and play the sound if it's set as true
      attributes.callback(attributes.barcode)
      // backup the barcode
      attributes.previousCode = attributes.barcode
      // clear textbox
      attributes.barcode = ''
      // clear pressedTime
      attributes.pressedTime = []
      // trigger sound
      if (attributes.setting.sound) {
        triggerSound()
      }
      emitEvent("finish")
      attributes.isProcessing = false
    }

    // if entering a control sequence, add `<VControlSequence>` to the buffer
    // if exiting a control sequence, add `</VControlSequence>` to the buffer
    // toggle control sequence flag
    function handleControlBoundaryKeydown () {
      attributes.barcode += attributes.isInControlSequence
        ? "</VControlSequence>"
        : "<VControlSequence>"

      attributes.isInControlSequence = !attributes.isInControlSequence
    }

    // Returns a regex or null
    function controlSequenceRegex () {
      if (attributes.setting.controlSequenceKeys) {
        return new RegExp(attributes.setting.controlSequenceKeys.join("|"))
      }
      return null
    }

    function emitEvent (type, payload) {
      if (attributes.eventBus) {
        attributes.eventBus.$emit(type, payload)
      }
    }

    function onInputScanned (event) {
      const controlRegex = controlSequenceRegex()

      // ignore other keydown event that is not a TAB, so there are no duplicate keys
      if (event.type === 'keydown' && event.keyCode !== 9) {
        // Return early if this is not a control key that should be observed
        if (controlRegex && !controlRegex.test(event.key)) return
        // Return early if no control keys should be observed
        if (!controlRegex) return
      }

      // handle control boundary keydown
      if (event.type === 'keydown' && controlRegex && controlRegex.test(event.key)) {
        return handleControlBoundaryKeydown()
      }

      if (checkInputElapsedTime(Date.now())) {
        if (!attributes.isProcessing) {
          emitEvent("start", event)
          attributes.isProcessing = true
        }
        // check if field has 'data-barcode' attribute
        let barcodeIdentifier = false
        if (attributes.setting.requiredAttr) {
          barcodeIdentifier = event.target.attributes.getNamedItem('data-barcode');
        } else {
          barcodeIdentifier = true
        }
        if (barcodeIdentifier && (event.keyCode === 13 || event.keyCode === 9) && attributes.barcode !== '') {
          finishScanSequence()

          // prevent TAB navigation for scanner
          if (event.keyCode === 9 || event.keyCode === 13) {
            event.preventDefault()
          }
        } else {
          // reset the finish sequence timer and add the key to the buffer
          if (attributes.timeout) {
            clearTimeout(attributes.timeout)
          }
          attributes.timeout =
            attributes.setting.callbackAfterTimeout &&
            // ensure there are characters in the buffer
            // otherwise, the callback will always fire
            attributes.barcode.length > 0 &&
            setTimeout(finishScanSequence, attributes.setting.scannerSensitivity)

          // scan and validate each character
          attributes.barcode += event.key
        }
      }
    }

    // check whether the keystrokes are considered as scanner or human
    function checkInputElapsedTime (timestamp) {
      // push current timestamp to the register
      attributes.pressedTime.push(timestamp)
      // when register is full (ready to compare)
      if (attributes.pressedTime.length === 2) {
        // compute elapsed time between 2 keystrokes
        let timeElapsed = attributes.pressedTime[1] - attributes.pressedTime[0];
        // too slow (assume as human)
        if (timeElapsed >= attributes.setting.scannerSensitivity) {
          // put latest key char into barcode
          attributes.barcode = event.key
          // remove(shift) first timestamp in register
          attributes.pressedTime.shift()
          // not fast enough
          return false
        }
        // fast enough (assume as scanner)
        else {
          // reset the register
          attributes.pressedTime = []
        }
      }
      // not able to check (register is empty before pushing) or assumed as scanner
      return true
    }

    // init audio and play
    function triggerSound () {
      let audio = new Audio(attributes.setting.soundSrc)
      audio.play()
    }
  }
}

// // Automatic installation if Vue has been added to the global scope.
// if (typeof window !== 'undefined' && window.Vue) {
//   window.Vue.use(MyPlugin)
// }

module.exports = VueBarcodeScanner
