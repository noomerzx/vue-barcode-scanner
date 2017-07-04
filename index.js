const VueBarcodeScanner = {
  install (Vue, options) {
    /* global Audio */
    // default plugin setting
    let attributes = {
      previouseCode: '',
      barcode: '',
      setting: {
        sound: false,
        soundSrc: '',
        scannerSensitivity: 100
      },
      callback: null,
      hasListener: false,
      pressedTime: []
    }

    // initial plugin setting
    if (options) {
      attributes.setting.sound = options.sound || attributes.setting.sound
      attributes.setting.soundSrc = options.soundSrc || attributes.setting.soundSrc
      attributes.setting.scannerSensitivity = options.sensitivity || attributes.setting.scannerSensitivity
    }

    Vue.prototype.$barcodeScanner = {}

    Vue.prototype.$barcodeScanner.init = (callback) => {
      // add listenter for scanner
      // use keypress to separate lower/upper case character from scanner
      addListener('keypress')
      // use keydown only to detect Tab event (Tab cannot be detected using keypress)
      addListener('keydown')
      attributes.callback = callback
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

    function onInputScanned (event) {
      // ignore other keydown event that is not a TAB, so there are no duplicate keys
      if (event.type === 'keydown' && event.keyCode != 9 ) {
        return
      }

      if (checkInputElapsedTime(Date.now())) {
        if ((event.keyCode === 13 || event.keyCode === 9) && attributes.barcode !== '') {
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
          // prevent TAB navigation for scanner
          if (event.keyCode === 9) {
            event.preventDefault()
          }
        } else {
          // scan and validate each charactor
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
