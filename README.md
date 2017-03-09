# Vue Barcode Scanner
============
> Barcode Scanner Plugin for Vue.js

## Features
Usually in the market have a lot of barcode scanner. So we need to handle a lot of things to make this input right as it was for all scanner.

### What's the problem
* The listener will alway trigger for each charactor input, So we need to put it together and check when it's finished and ready to use.
* Need to handle some special charactors for some scanner, Because it's not the same for all scanner.

### What this plugin do for you
* Handle the listener for you and return the ready barcode to your callback just once when scanning is finished.
* Handle special charactors and return the complete barcode to you.

----------------------------------------
## Dependencies
* vue

----------------------------------------
# Installation
Install via npm

```javascript
npm install vue-barcode-scanner

...
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
Destroy method is for remove the listener when it's unnecessary

```javascript
this.$barcodeScanner.destroy()
```

### hasListener
Return the value that curently has a listener or not

```javascript
this.$barcodeScanner.hasListenr() // return Boolean
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