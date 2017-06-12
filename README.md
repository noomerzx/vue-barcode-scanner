# Vue Barcode Scanner
============
> Barcode Scanner Plugin for Vue.js

## Features
Usually in the market have a lot of barcode scanner. So we need to handle a lot of things to make this input right as it was for all scanner.

### What's the problem
* The listener will alway trigger for each character input, So we need to put it together and check when it's finished and ready to use.
* Need to handle some special characters for some scanner, Because it's not the same for all scanner.

### What this plugin do for you
* Handle the listener for you and return the ready barcode to your callback just once when scanning is finished.
* Handle special characters and return the complete barcode to you.

### Update
* Tab suffix barcode scanner compatibility
* Listener for keypress instead of keydown (0.2)
* New method to get previous barcode (0.2)
* Listen to for all keypress not only textbox or textarea like previous version (0.3)
* Check the input is come from barcode scanner by check elapsed time less than 500ms (0.3)

----------------------------------------
## Dependencies
* vue

----------------------------------------
## Installation
Install via npm

```javascript
npm install vue-barcode-scanner
```

----------------------------------------
## Initiate
Inject plugin to your vue instance by ```Vue.use``` then initial it in your component that need to use barcode scanner


Default Injection
```javascript
import Vue from 'vue'
import VueBarcodeScanner from 'vue-barcode-scanner'

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
Init method use for add event listener (keypress) for the scanner.

```javascript
this.$barcodeScanner.init(callbackFunction)
```

### destroy
Destroy method is for remove the listener when it's unnecessary.

```javascript
this.$barcodeScanner.destroy()
```

### hasListener
Return the value that currently has a listener or not.

```javascript
this.$barcodeScanner.hasListener() // return Boolean
```

### getPreviousCode
Return last barcode scanned whatever your input is (In textbox currently).
The last barcode will be replace when hit enter key.

```javascript
this.$barcodeScanner.getPreviousCode() // return String
```
----------------------------------------
## Usage
In your component file (.vue) just for the component you need to listener for barcode.

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
      // Create callback function to receive barcode when the scanner is already done
      onBarcodeScanned (barcode) {
        console.log(barcode)
        // do something...
      },
      // Reset to the last barcode before hitting enter (whatever anything in the input box)
      resetBarcode () {
        let barcode = this.$barcodeScanner.getPreviousCode()
        // do something...
      }
    }
  }
```
