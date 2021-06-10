let alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя,()'
let matrix = [];
let matrixStr = '';
// задача 1. Шифр Плейфера
let codePreifer = document.getElementById('code')
let sourcePreifer = document.getElementById('source')
let encryptedPreifer = document.getElementById('encrypted')
let decryptedPreifer = document.getElementById('decrypted')
let codePhrasePreifer = codePreifer.value;
// задача 2. Шифр Полибия
let codePolibius = document.querySelector('.polibius-code')
let sourcePolibius = document.querySelector('.polibius-source')
let encryptedPolibius = document.querySelector('.polibius-encrypted')
let decryptedPolibius = document.querySelector('.polibius-decrypted')
let codePhrasePolibius = codePolibius.value;
// задача 3. Шифр RSA
const p = 3;
const q = 11;
const e = 7;
const d = 3;
const m1 = 9;
const m2 = 12;
const m3 = 23;
let sourceRsa = document.querySelector('.rsa-source')
let encryptedRsa = document.querySelector('.rsa-encrypted')
let decryptedRsa = document.querySelector('.rsa-decrypted')

function codeChanged(method) {
    switch (method) {
        case 'pleifer':
            codePhrasePreifer = uniqSym(codePreifer.value);
            return
        case 'polibius':
            codePhrasePolibius = uniqSym(codePolibius.value)
            return
        default:
            return
    }
}

function encryptTextPleifer() {
    fillMatrixes(codePhrasePreifer);

    let rows = 6;
    let columns = 6;

    let text = sourcePreifer.value.replace(/\s/g, '').toLowerCase();
    text = text.length % 2 == 1 ? text + '(': text;
    
    let bigrams = getBigrams(text)

    let newBigrams = [];
    for (let i = 0; i < bigrams.length; i++) {
        let iIndex = matrixStr.indexOf(bigrams[i][0]);
        let iRow = Math.floor(iIndex / rows);
        let iCol = iIndex % rows;
        let jIndex = matrixStr.indexOf(bigrams[i][1]);
        let jCol = jIndex % rows;
        let jRow = Math.floor(jIndex / rows);
        
        // на одной строке
        if (iRow == jRow) {
            iCol = iCol == columns - 1? 0: iCol + 1

            jCol = jCol == columns - 1? 0: jCol + 1
        }

        // в одном столбце
        if (iCol == jCol) {
            iRow = iRow == rows - 1? 0: iRow + 1
            jRow = jRow == rows - 1? 0: jRow + 1
        }

        // на разных строках и разных столбцах
        if (iRow != jRow && iCol != jCol) {
            let temp = iCol;
            iCol = jCol;
            jCol = temp;
        }

        let gram = [matrix[iRow][iCol], matrix[jRow][jCol]];
        if (gram[0] == gram[1]){
            gram[2] = gram [1];
            gram[1] = '(';
        }
        gram = gram.join('');
        newBigrams.push(gram);
    }

    let result = newBigrams.join('');
    encryptedPreifer.value=result;
}

function decryptTextPleifer() {
    fillMatrixes(codePhrasePreifer);

    let rows = 6;
    let columns = 6;

    let text = encryptedPreifer.value;
    for (let i = 1; i < text.length - 1; i++) {
        if (text[i] == '(' && text[i-1] == text[i+1]) {
            text = text.substr(0, i) + text.substr(i + 1)
        }
    }
    
    text = text.length % 2 == 1 ? text + '(': text;
    let bigrams = getBigrams(text)

    let newBigrams = [];
    for (let i = 0; i < bigrams.length; i++) {
        let iIndex = matrixStr.indexOf(bigrams[i][0]);
        let iRow = Math.floor(iIndex / rows);
        let iCol = iIndex % rows;
        let jIndex = matrixStr.indexOf(bigrams[i][1]);
        let jCol = jIndex % rows;
        let jRow = Math.floor(jIndex / rows);
        
        // на одной строке
        if (iRow == jRow) {
            iCol = iCol == 0? columns - 1: iCol - 1;
            jCol = jCol == 0? columns - 1: jCol - 1;
        }

        // в одном столбце
        if (iCol == jCol) {
            iRow = iRow == 0? rows - 1: iRow - 1;
            jRow = jRow == 0? rows - 1: jRow - 1;
        }

        // на разных строках и разных столбцах
        if (iRow != jRow && iCol != jCol) {
            let temp = iCol;
            iCol = jCol;
            jCol = temp;
        }

        let gram = [matrix[iRow][iCol],matrix[jRow][jCol]];
        gram = gram.join('');
        newBigrams.push(gram);
    }

    let result = newBigrams.join('');
    result = result.replace('(', '')
    decryptedPreifer.value=result;
}

function fillMatrixes(code) {
    matrixStr = alphabet.substr(0);
    for (let i = 0; i < code.length; i++) {
        let symbol = code[i];
        matrixStr = matrixStr.replace(symbol, '');
    }
    matrixStr = code + '' + matrixStr;

    matrix = []
    for (let i = 0; i < 6; i++) {
        let row = [];
        for (let j = 0; j < 6; j++) {
            let index = i * 6 + j;
            row.push(matrixStr[index]);
        }
        matrix.push(row);
    }
}

function getBigrams(text) {
    let bigrams = [];
    for (let i = 0; i < text.length; i+=2){
        bigrams.push(text.substr(i, 2));
    }
    return bigrams;
}

function uniqSym(s) {
    var c = {};
    var r = '';
  
    for (var i = 0; i < s.length; i++) {
      if (!c[s[i]]) {
        r = r + s[i];
        c[s[i]] = 1;
      }
    }
  
    return r;
}

function encryptTextPolibius() {
    fillMatrixes(codePhrasePolibius);

    let text = sourcePolibius.value.replace(/\s/g, '').toLowerCase()
    text = text.length % 2 == 1? text + ')': text;

    let codes = [];
    let columns = matrix.length
    for (let i = 0; i < text.length; i++) {
        let index = matrixStr.indexOf(text[i]);
        let y = Math.floor(index/columns)
        let x = index % columns;
        codes.push({
            row: y,
            col: x
        });
    }

    let horizontals = '';
    let verticals = '';
    for (let i = 0; i < codes.length; i++){
        verticals += codes[i].row
        horizontals += codes[i].col
    }
    let coords = getBigrams(horizontals + '' + verticals);

    let newText = '';
    for(let i = 0; i < coords.length; i++) {
        newText += matrix[coords[i][1]][coords[i][0]];
    }

    encryptedPolibius.value = newText;
}

function decryptTextPolibius() {
    fillMatrixes(codePhrasePolibius);

    let text = encryptedPolibius.value
    text = text.length % 2 == 1? text + ')': text;

    let codes = [];
    let columns = matrix.length
    for (let i = 0; i < text.length; i++) {
        let index = matrixStr.indexOf(text[i]);
        let y = Math.floor(index/columns)
        let x = index % columns;
        codes.push({
            row: y,
            col: x
        });
    }

    let horizontals = '';
    let verticals = '';
    for (let i = 0; i < codes.length; i++){
        verticals += codes[i].row
        horizontals += codes[i].col
    }
    let coords = zipStr(horizontals, verticals)
    let middle = coords.length / 2
    horizontals = coords.slice(0, middle)
    verticals = coords.slice(middle)

    coords = [];
    for(let i = 0; i < horizontals.length; i++) {
        coords.push(horizontals[i][0] + verticals[i][0])
        coords.push(horizontals[i][1] + verticals[i][1])
    }

    let newText = '';
    for(let i = 0; i < coords.length; i++) {
        newText += matrix[coords[i][1]][coords[i][0]];
    }

    decryptedPolibius.value = newText.replace(')','');
}

function zipStr(arr1, arr2) {
    if (arr1.length < arr2.length) {
        let temp = arr1;
        arr1 = arr2;
        arr2 = temp;
    }

    let result = [];
    for (let i=0; i<arr1.length;i++) {
        if (i >= arr2.length) {
            result.push(arr1[i]);
        }
        else {
            result.push(arr1[i] + arr2[i]);
        }
    }
    return result;
}