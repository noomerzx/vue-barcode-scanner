# Vue Barcode Scanner
============
Barcode Scanner Plugin for Vue.js
## Requirement
* vue
----------------------------------------
## Initiate
Inject plugin to your vue instance by ```Vue.use``` then initial it in your component that need to use barcode scanner


Default Injection
```javascript
import Vue from 'vue'
import VueBarcodeScanner from 'vue-barcode-scanncer'

...

// inject vue barcode scanner
Vue.use(VueBarcodeScanner)

```

Inject with option
```javascript
// inject barcode scanner with option (add sound effect)
// sound will trigger when it's already scanned
let options = {
  sound: true, // default is false
  soundSrc : '/static/sound.wav' // default is blank
}

Vue.use(VueBarcodeScanner, options)

```
----------------------------------------
## Methods
### init
Init method use for add event listener (keydown) for the scanner

```javascript
this.$barcodeScanner.init(callbackFunction)
```

### destroy
Destroy method is for remove the listener when it's unnessessary

```javascript
this.$barcodeScanner.destroy()
```
----------------------------------------
## Usage
In your component file (.vue) just for the component you need to listener for barcode

```javascript
  export default {
    created () {
      // Add barcode scan listener and pass the callback function
      this.$barcodeScanner.init(this.onBarcodeScanned)
    },
    destroyed () {
      // Remove listener when component is destroyed
      this.$barcodeScanner.destroy()
    },
    methods: {
      // Create callback function to received barcode when the scanner is already done
      onBarcodeScanned (barcode) {
        console.log(barcode)
        // do something...
      }
    }
  }
```