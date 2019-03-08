# Vue Barcode Scanner
> Barcode Scanner Plugin for Vue.js

## Features
Usually in the market have a lot of barcode scanner. So we need to handle a lot of things to make this input right as it was for all scanner.

This plugin allows for better control of scanning inputs as speed of scanners lead to noisy and innacurate results. This plugin will allow you to use your **already** implemented barcode scanner in your project with better control and accuracy.

vue-barcode-scanner is a throttle for existing barcode scanners such as https://github.com/serratus/quaggaJS or https://github.com/hypery2k/cordova-barcodescanner-plugin/. vue-barcode-scanner is not a scanning tool on its own.

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
* Support scanner that use "TAB" instead of "Enter" in the last scanned charactor (adding keydown event) (0.4)
* Clear elapsed time when submit the barcode (0.4)
* Change by pass elapsed time from 500ms to 30ms and change the logic to make scanner detection better (0.4)
* Options to set scan sensitivity (it's elapsed time for each key scanned, default 100ms) (0.5)
* New method to set scan sensitivity manually (0.5)
* New option to require 'data-barcode' attribute for specific field input (0.6)

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
  soundSrc: '/static/sound.wav', // default is blank
  sensitivity: 300, // default is 100
  requiredAttr: true, // default is false
  controlSequenceKeys: ['NumLock', 'Clear'], // default is null
  callbackAfterTimeout: true // default is false
}

Vue.use(VueBarcodeScanner, options)

```

* Please note that if "requiredAttr" set to "true" you need to specific some input field with "data-barcode" and then only this input response to scanner
* `controlSequenceKeys`:  when a control key in this list is encountered in a scan sequence, it will be replaced with <VControlSequence> tags for easy string replacement
* `callbackAfterTimeout`: this will fire the callback defined in the component once `sensitivity` ms has elapsed, following the last character in the barcode sequence. This is useful for scanners that don't end their sequences with ENTER and is backwards compatible with scanners that do.
----------------------------------------
## Methods
### init
Init method use for add event listener (keypress) for the scanner.

```javascript
this.$barcodeScanner.init(callbackFunction, options)
```

`options` defaults to an empty object, `{}`, and can be safely ignored. See Advanced Usage for an example.

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

### setSensitivity
Set limit of the time elapsed between each key stroke to distinguish between human typing and barcode scanner.
Barcode scanner is determined by how fast between each key stoke.
Argument is number of milliseconds.

```javascript
this.$barcodeScanner.setSensitivity(200) // sets barcode scanner recognition sensitivity to 200 ms
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
### Advanced (using eventBus)
```javascript
  export default {
    data: () => ({
      loading: false
    }),
    created () {
      // Pass an options object with `eventBus: true` to receive an eventBus back
      // which emits `start` and `finish` events
      const eventBus = this.$barcodeScanner.init(this.onBarcodeScanned, { eventBus: true })
      if (eventBus) {
        eventBus.$on('start', () => { this.loading = true })
        eventBus.$on('finish', () => { this.loading = false })
      }
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

# Disclaimer

This is **NOT** a barcode scanner. This is a scanner throttle to reduce innacurate scanner inputs.
