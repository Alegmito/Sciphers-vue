<template>
  <div class="polibian-schipher">
    <div id="encode">
      <h2>Кодирование</h2>
        <p>
        Введите текст, который нужно закодировать. Текст должен содержать русские буквы,
        все остальные символы будут удалены.
        </p>
        <md-field id="codecomb">
          <label>текст для шифрования</label>
          <md-textarea v-model="toEncript" md-aurogrow></md-textarea>
        </md-field>
    
      <md-button class="md-raised md-primary" @click="encript">Закодировать</md-button>
      <md-field id="codecomb">
        <label>зашифрованный текст</label>
        <md-textarea v-model="encriptedText" md-aurogrow readonly></md-textarea>
      </md-field>
      <md-field id="codecomb">
          <label>Матрица декодирования в виде строки</label>
          <md-input v-model="encriptionMatrix" maxlength="36" readonly></md-input>
        </md-field>
    </div>
    <div id="decode">
      <h2>Декодирование</h2>
        <md-field id="codecomb">
          <label>зашифрованный текст</label>
          <md-textarea v-model="toDecript" md-aurogrow></md-textarea>
        </md-field>

        <md-field id="codecomb">
          <label>Матрица декодирования в виде строки</label>
          <md-input v-model="decriptionMatrix" maxlength="36"></md-input>
        </md-field>
  
      <md-button class="md-raised md-primary" @click="decript">Декодировать</md-button>
        <md-field id="codecomb">
          <label>расшифрованный текст</label>
          <md-textarea v-model="decriptedText" md-aurogrow readonly></md-textarea>
        </md-field>  
    </div>  
  </div>  
   
</template>

<script>

  function mod(n, m) {
    return ((n % m) + m) % m;
  }
  function findIndecies(encodeMat, l1, l2) {
      let firstIndex = [-1, -1]
      let secondIndex = [-1, -1]

        encodeMat.forEach((matrixString, stringIndex) => {
          for (let rowIndex = 0; rowIndex < matrixString.length; rowIndex++) {
            if(matrixString[rowIndex] === l1){
              firstIndex = [stringIndex, rowIndex];
            }        
            if(matrixString[rowIndex] === l2){
              secondIndex = [stringIndex, rowIndex]
            }
          }
        })
      return {first:firstIndex, second:secondIndex}
    }

  function decriptBigram(matrix, indecies) {
    let bigram = ''

      if (indecies.first[0] === indecies.second[0]) {
          bigram += matrix[indecies.first[0]][ mod(indecies.first[1]-1,6)]
          bigram += matrix[indecies.second[0]][ mod(indecies.second[1]-1,6)]
        }
        else if (indecies.first[1] === indecies.second[1]) {
          bigram += matrix[mod(indecies.first[0]-1, 6)][ indecies.first[1]]
          bigram += matrix[mod(indecies.second[0]-1, 6)][ indecies.second[1]]
        }
        else {
          bigram += matrix[indecies.first[0]][ indecies.second[1]]
          bigram += matrix[indecies.second[0]][ indecies.first[1]]
        }

        if (bigram[1] === 'Ъ') {
          bigram = bigram[0] + bigram[0]
        }

        console.log(bigram)

        return bigram
  }

  function getDecriptMatrix(decriptMatrixStr) {
    let decriptMatrix = [['','','','','',''],
      ['','','','','',''],
      ['','','','','',''],
      ['','','','','',''],
      ['','','','','',''],
      ['','','','','','']]

    for (let i = 0; i < decriptMatrix.length; i++) {
      for (let j = 0; j < decriptMatrix[i].length; j++) {
        decriptMatrix[i][j] = decriptMatrixStr[i*6+j];       
      }
    }

    return decriptMatrix    
  }

  function decriptString(decriptionMatrix, str) {
    let resString = ''
    
    for (let pos = 0; pos < str.length; pos += 2) {
      const indecies = findIndecies(decriptionMatrix, str[pos], str[pos+1])    
      
      resString += decriptBigram(decriptionMatrix, indecies)
    }

    return resString
  }
  
  function getEncrMatrx(str){
      const alphabet=[...'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ123']
      let matrix = [['','','','','',''],
      ['','','','','',''],
      ['','','','','',''],
      ['','','','','',''],
      ['','','','','',''],
      ['','','','','','']]
      let resString = ''

      str.forEach(symbol => {
        if (symbol != symbol.toLowerCase() && resString.indexOf(symbol) == -1){
          resString += symbol;
        }
      })

      alphabet.forEach(symbol => {
        if (resString.indexOf(symbol) == -1){
          resString += symbol;
      }
    })
    
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        matrix[i][j] = resString[i*6+j]
      }
    }

    return {matrix, resString};
    }

    

    function encodeBigram(encodeMat, indecies) {
      let result = ''
      if (indecies.first[0] === indecies.second[0]) {
          result += encodeMat[indecies.first[0]][ (indecies.first[1]+1) % 6]
          result += encodeMat[indecies.second[0]][ (indecies.second[1]+1) % 6]
        }
        else if (indecies.first[1] === indecies.second[1]) {
          result += encodeMat[(indecies.first[0]+1) % 6][ indecies.first[1]]
          result += encodeMat[(indecies.second[0]+1) % 6][ indecies.second[1]]
        }
        else {
          result += encodeMat[indecies.first[0]][ indecies.second[1]]
          result += encodeMat[indecies.second[0]][ indecies.first[1]]
        }

        return result
    }

    function encodeString(encodeMat, str) {
      let resString = ''
      const strLen = str.length
      const upperBound = strLen - (strLen % 2)
      for (let i = 0; i < upperBound; i += 2) {
        if (str[i] === str[i+1]) {
          str[i+1] = 'Ъ'
        }

        const indecies = findIndecies(encodeMat, str[i], str[i+1])

        resString += encodeBigram(encodeMat, indecies)        
      }
      
      if (strLen % 2 !== 0){
        let last = 'Ъ'
        const indecies = findIndecies(encodeMat, str[strLen-1], last)
        resString += encodeBigram(encodeMat, indecies)
      }

      return resString
      
    }

    

export default {
  name: 'Playfair',
  data() {
    return {
      toEncript: '',
      encriptedText: '',
      encriptionMatrix: '',

      toDecript: 'БВГДЕАЖЗИЙКЁМНОПРЛТУФХЦСШЩЪЫЬЧЮЯ1Щ',
      decriptedText: '',
      decriptionMatrix: 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ123'
    }
  },
  props: {
    msg: String
  },
  methods:{
    encript(){
      let str = [...this.toEncript.toUpperCase()]
      str = str.filter(symbol => symbol != symbol.toLowerCase());
      if (str.length === 0) {
        this.encriptedText = 'строка пустая'
        return
      }

      const matricies = getEncrMatrx(str)
      this.encriptionMatrix = matricies.resString
      console.log(matricies.matrix)
      this.encriptedText = encodeString(matricies.matrix, str)
    },

    decript() {
      let str = [...this.toDecript.toUpperCase()]
      str = str
      if (str.length === 0 || this.decriptionMatrix.length < 36){
        this.decriptedText = 'пустая строка или неправильная матрица'
        return
      }

      console.log(mod(-1, 6))

      const decriptionMatrix = getDecriptMatrix(this.decriptionMatrix.toUpperCase())

      this.decriptedText=decriptString(decriptionMatrix, str)
    }
    
  },
  mounted() {
    console.log('1'==='1')
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

#codecomb {
  max-width: 1000px;
  margin:auto;
  
}


</style>
