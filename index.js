const VueBarcodeScanner = {
  install (Vue, options) {
    /* global Audio */
    // default plugin setting
    let attributes = {
      barcode: '',
      setting: {
        sound: false,
        soundSrc: ''
      },
      callback: null,
      hasListener: false
    }

    // initial plugin setting
    if (options) {
      attributes.setting.sound = options.sound
      attributes.setting.soundSrc = options.soundSrc
    }

    Vue.prototype.$barcodeScanner = {}

    Vue.prototype.$barcodeScanner.init = (callback) => {
      // add listenter for scanner
      addListener('keydown')
      attributes.callback = callback
    }

    Vue.prototype.$barcodeScanner.destroy = () => {
      // remove listener
      removeListener('keydown')
    }

    Vue.prototype.$barcodeScanner.hasListener = () => {
      return attributes.hasListener
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
      if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        // if input text not on focus scanner will not allow to scan
        event.preventDefault()
      } else if (event.keyCode === 13 && attributes.barcode !== '') {
        // scanner is done and trigger "Enter" then clear barcode and play the sound if it's set as true
        attributes.callback(attributes.barcode)
        attributes.barcode = ''
        if (attributes.setting.sound) {
          triggerSound()
        }
      } else {
        // scan and validate each charactor
        attributes.barcode += validateInput(event.keyCode)
      }
    }

    // validate each input for special charactor
    function validateInput (input) {
      let inputChar = ''
      switch (input) {
        case 189: inputChar = '-'; break
        default: inputChar = String.fromCharCode(input); break
      }
      return inputChar
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
