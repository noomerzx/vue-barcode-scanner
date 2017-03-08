# Vue Barcode Scanner
=====================
Barcode Scanner Plugin for Vue.js
## Requirement
* vue
----------------------------------------
## Initiate
Initiate plugin by ```Vue.use``` then initial the plugin in your component that need to use barcode scanner

```javascript
import Vue from 'vue'
import VueBarcodeScanner from 'vue-barcode-scanncer'

...

Vue.use(VueBarcodeScanner)
```
----------------------------------------
## Methods
### init
Init method use for add event listener (keydown) for the scanner

```javascript
this.$barcodeScanner.init(this.onBarcodeScanned)
```

### destroy
Destroy method is for remove the listent when it's unnessessary

```javascript
this.$barcodeScanner.destroy()
```
----------------------------------------
## Usage
In your component file (.vue)

```javascript
  export default {
    created () {
      // add barcode scan listener and pass the callback function
      this.$barcodeScanner.init(this.onBarcodeScanned)
    },
    destroyed () {
      // remove listener when component is destroyed
      this.$barcodeScanner.destroy()
    },
    methods: {
      // create callback function to received barcode when the scanner is already done
      onBarcodeScanned (barcode) {
        console.log(barcode)
        // do something...
      }
    }
  }
```