<template>
  <div>
    <div id="pdf">
      Print this as a PDF file
    </div>
    <button @click="printPdf">Print</button>
  </div>
</template>

<script>
export default {
  mounted(){
    electronAPI.testPreloadOn((event, content) => {
      console.log(content)
    })
  },
  methods: {
    printPdf() {
      const order = 'From Print Component for Receipt'
      const kot1 = 'From Print Component for KOT 1'
      const kot2 = 'From Print Component for KOT 2'
      electronAPI.sendToMainReceipt(order)
      electronAPI.sendToMainKOT(kot1)
      setTimeout(() => {
        electronAPI.sendToMainKOT(kot2)
      }, 500)
      electronAPI.testPreloadSend("Sent data from component to main")
    }
  }
}
</script>