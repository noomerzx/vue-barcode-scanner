# Vue Barcode Scanner
=====================
Barcode Scanner Plugin for Vue.js
## Requirement
* vue

## Initiate

Initiate plugin by ```Vue.use``` then initial the plugin in your component that need to use barcode scanner

```javascript
import Vue from 'vue'
import VueBarcodeScanner from 'vue-barcode-scanncer'

...

Vue.use(VueBarcodeScanner)
```

## Usage


```javascript
  export default {
    data () {
      return {
        barcode: ''
      }
    },
    created () {
      // add barcode scann listener and pass the callback method
      this.$barcodeScanner.init(this.onBarcodeScanned)
    },
    destroyed () {
      // remove listener when component is destroyed
      this.$barcodeScanner.destroy()
    },
    methods: {
      // callback to received barcode when it's scanner is already done
      onBarcodeScanned (barcode) {
        console.log(barcode)
      }
    }
  }
```