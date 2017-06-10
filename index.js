const VueBarcodeScanner = {
  install (Vue, options) {
    /* global Audio */
    // default plugin setting
    let attributes = {
      previouseCode: '',
      barcode: '',
      setting: {
        sound: false,
        soundSrc: ''
      },
      callback: null,
      hasListener: false,
      pressedTime: []
    }

    // initial plugin setting
    if (options) {
      attributes.setting.sound = options.sound
      attributes.setting.soundSrc = options.soundSrc
    }

    Vue.prototype.$barcodeScanner = {}

    Vue.prototype.$barcodeScanner.init = (callback) => {
      // add listenter for scanner
      // use keypress to separate lower/upper case character from scanner
      addListener('keypress')
      // use keyup only to detect Tab event (Tab cannot be detected using keypress)
      addListener('keyup')
      attributes.callback = callback
    }

    Vue.prototype.$barcodeScanner.destroy = () => {
      // remove listener
      removeListener('keypress')
      removeListener('keyup')
    }

    Vue.prototype.$barcodeScanner.hasListener = () => {
      return attributes.hasListener
    }

    Vue.prototype.$barcodeScanner.getPreviousCode = () => {
       return attributes.previousCode
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
      // if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      //   // if input text not on focus scanner will not allow to scan
      //   event.preventDefault()
      // } else

      console.log(event);
      // ignore other keyup event that is not a TAB
      if (event.type === 'keyup' && event.keyCode != 9) {
        return
      }

      if (checkInputElapsedTime(Date.now())) {
        if ((event.keyCode === 13 || checkTab(event)) && attributes.barcode !== '') {
          // scanner is done and trigger "Enter" then clear barcode and play the sound if it's set as true
          attributes.callback(attributes.barcode)
          // backup the barcode
          attributes.previousCode = attributes.barcode
          // clear textbox
          attributes.barcode = ''
          // document.activeElement.value = ''
          if (attributes.setting.sound) {
            triggerSound()
          }
        } else {
          // scan and validate each charactor
          attributes.barcode += validateInput(event.keyCode)
        }
      }
    }

    function checkTab(event) {
      let isTab = event.type == 'keyup' && event.keyCode === 9
      if (isTab) {
        event.preventDefault()
        event.stopPropagation()
      }
      return isTab
    }

    function checkInputElapsedTime (timestamp) {
      attributes.pressedTime.push(timestamp)
      if (attributes.pressedTime.length === 2) {
        let timeElapsed = attributes.pressedTime[1] - attributes.pressedTime[0];
        attributes.pressedTime = []
        if (timeElapsed >= 100) {
          attributes.barcode = ''
          return false
        }
      }
      // not able to check (has < 2 timestamp in register)
      return true
    }

    // validate each input for special charactor
    function validateInput (input) {
      let inputChar = ''
      if (input === 45) {
        inputChar = '-'
      } else if ((input >= 48 && input <=57) || (input >= 65 && input <= 90) || (input >= 97 && input <= 122)) {
        inputChar = String.fromCharCode(input)
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
