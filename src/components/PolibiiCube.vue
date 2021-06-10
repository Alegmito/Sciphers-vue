<template>
  <div>
    <h2>Кодирование</h2>

    <md-field id="codecomb">
          <label>текст для шифрования</label>
          <md-textarea v-model="toEncrypt" md-aurogrow></md-textarea>
    </md-field>

    <md-button class="md-raised md-primary" @click="encrypt">Закодировать</md-button>

    <md-field id="codecomb">
        <label>зашифрованный текст</label>
        <md-textarea v-model="encryptedText" md-aurogrow readonly></md-textarea>
    </md-field>
    
    <h2>Декодирование</h2>

    <md-field id="codecomb">
          <label>зашифрованный текст</label>
          <md-textarea v-model="toDecrypt" md-aurogrow></md-textarea>
    </md-field>

    <md-button class="md-raised md-primary" @click="decrypt">Декодировать</md-button>

    <md-field id="codecomb">
        <label>расшифрованный текст</label>
        <md-textarea v-model="decryptedText" md-aurogrow readonly></md-textarea>
    </md-field> 
  </div>
</template>

<script>

function findIndex(symbol, matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if(symbol === matrix[i][j])  {
                return{i:''+i, j: ''+j}
            }          
        }
    }
}

function encryptText(str, matrix){
    let result = ''
    str.forEach(symbol => {
        const index = findIndex(symbol, matrix)
        result += index.i + index.j
    })

    return result
}

function decryptText(str, matrix) {
    let result = ''

    for (let pos = 0; pos < str.length; pos += 2) {
        const symbolPos = {i: parseInt(str[pos]), j: parseInt(str[pos+1])}
        console.log(symbolPos)
        result += matrix[symbolPos.i][symbolPos.j]
    }

    return result
}

export default {
    name: 'Polibii',
    data() {
        return {
            toEncrypt:'документ',
            encryptedText:'',
            toDecrypt:'',
            decryptedText:'',
            matrix:[
                ['А','Б','В','Г','Д','Е','Ж','З'],
                ['И','Й','К','Л','М','Н','О','П'],
                ['Р','С','Т','У','Ф','Х','Ц','Ч'],
                ['Ш','Щ','Ъ','Ы','Ь','Э','Ю','Я']
                ]
        }
    },
    methods: {
        encrypt(){
            let str = [...this.toEncrypt.toUpperCase()]
            str = str.filter(symbol => symbol != symbol.toLowerCase())

             if (str.length === 0) {
                this.encryptedText = 'строка пустая'
                return
            }
            
            this.encryptedText=encryptText(str, this.matrix)

        },
        decrypt(){
            let str = this.toDecrypt
            if (str.length === 0) {
                this.encryptedText = 'строка пустая'
                return
            }

            this.decryptedText=decryptText(str, this.matrix)
        }
    },

}
</script>

<style>
#codecomb {
  max-width: 1000px;
  margin:auto;
  
}
</style>