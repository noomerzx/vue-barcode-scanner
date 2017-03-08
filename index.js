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
      callback: null
    }

    // initial plugin setting
    if (options) {
      attributes.setting.sound = options.sound
      attributes.setting.soundSrc = options.soundSrc
    }

    Vue.prototype.$barcodeScanner = {}

    Vue.prototype.$barcodeScanner.init = (callback) => {
      // add listenter for scanner
      console.log('Vue barcode scanner is ready !!')
      attributes.callback = callback
      window.addEventListener('keydown', onInputScanned)
    }

    Vue.prototype.$barcodeScanner.destroy = () => {
      // remove listener
      window.removeEventListener('keydown', onInputScanned)
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

export default VueBarcodeScanner
