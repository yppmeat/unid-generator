class UNID {
  #timestamp = 0;
  #counter = 0;
  static #ASCII_SET = '3y|DWs^oH2%I\'k"qUmY6Q9.(rNLJ,j0`]P$5?CzM*><=@Kn~&a;OwEf)[xhZBpSGlg}-b/cX:{#AvR7Tu+ei4d_!1F\\8tV';
  static #cachedAsciiIndexMap = new Map(UNID.#ASCII_SET.split('').map((char, index) => [char, index]));
  static #isCryptoSupported = location.protocol === 'https:' && 'getRandomValues' in crypto;
  static #sp = [
    '267548103',
    '423108567',
    '046238157',
    '762518043',
    '107568324',
    '246538107',
    '154378062',
    '051478632',
    '103248657',
    '071348625'
  ];
  static #sortPatterns = UNID.#sp.map(num => num.split('').map(v => +v));
  static #op = [
    'jzG[T}S',
    'XJvrYAZ',
    'y^0[z9+',
    '|)BJ?Z%',
    'Ov|UZbW',
    'E}evqX:',
    '"ulKWD}',
    'P(}/2bZ',
    'i.w~lY%',
    'q[$+Y@3',
    'c$^zP6)',
    'BE"-|,>',
    '],6s-aD',
    '[0dY3aH',
    'gpYw4x~',
    'w}R}zOa',
    'vCK2T&[',
    '`e|qe?%',
    'BYr0[=y',
    ':f"?~X?',
    'L]xC@^3',
    ',)E["}#',
    '5OX|BA~',
    'Yk2CbvU',
    'ZH6e(Wx',
    'Y{3nA7P',
    './YHm,`',
    '3"2gzNB',
    'uO*Dep~',
    '}jp+Pl,'
  ];
  static #offsetPatterns = UNID.#op.map(v => v.split('').map(t => UNID.#cachedAsciiIndexMap.get(t)));
  
  static #convertIntToBase(result, number, base, length) {
    for (let i = length - 1; i >= 0; i--) {
      result[i] = number % base;
      number = Math.floor(number / base);
    }
  }
  
  static #convertBaseToInt(array, base) {
    let result = 0;
    for(let i = 0; i < array.length; i++) {
      result += array[i] * Math.pow(base, array.length - 1 - i);
    }
    return result;
  }
  
  static #rotateArrayInPlace(array, shift) {
    shift = ((shift % 8) + 8) % 8;
    if(shift === 0) return;
    
    const temp = array.slice(-shift);
    array.copyWithin(shift, 0,  8 - shift);
    array.set(temp, 0);
  }
  
  generateID() {
    const currentTime = Date.now();
    if(this.#timestamp !== currentTime) {
      this.#timestamp = currentTime;
      this.#counter = 0;
    } else {
      this.#counter++;
    }

    const result = new Uint8Array(9);
    UNID.#convertIntToBase(result, currentTime, 94, 7);
    UNID.#convertIntToBase(result.subarray(7), this.#counter, 90, 2);
    
    const counterMod10 = this.#counter % 10;
    // httpからライブラリを呼び出すとcrypto.getRandomValuesの実行速度が3倍遅くなる
    const randomValue = ((UNID.#isCryptoSupported ? crypto.getRandomValues(new Uint8Array(1))[0] / 256 : Math.random()) * 29 | 0) + 1;
    result[0] = (result[0] - 1) * 30 + randomValue;
    
    const offsetPattern = UNID.#offsetPatterns[randomValue - 1];
    for(let i = 0; i < 7; i++) {
      result[i + 1] = ((result[i + 1] + offsetPattern[i] + counterMod10) % 94 + 94) % 94;
    }
    
    UNID.#rotateArrayInPlace(result.subarray(0,  8), counterMod10);
    
    const sortPattern = UNID.#sortPatterns[counterMod10];
    let asciiResult = '';
    for(let i = 0; i < 9; i++) {
      asciiResult += UNID.#ASCII_SET[result[sortPattern[i]] % 94];
    }
    
    return asciiResult;
  }
  
  decodeID(id) {
    const counterMod10 = UNID.#cachedAsciiIndexMap.get(id[5]) % 10;
    const sortPattern = UNID.#sortPatterns[counterMod10];
    const unscrambledArray = new Uint8Array(9);
    for(let i = 0; i < 9; i++) {
      unscrambledArray[sortPattern[i]] = UNID.#cachedAsciiIndexMap.get(id[i]);
    };
    
    UNID.#rotateArrayInPlace(unscrambledArray.subarray(0,  8), -counterMod10);
    
    const randomValue = unscrambledArray[0] % 30;
    unscrambledArray[0] = Math.ceil(unscrambledArray[0] / 30);
    
    const scaledOffset = UNID.#offsetPatterns[randomValue - 1];
    for(let i = 0; i < 7; i++) {
      unscrambledArray[i + 1] = ((unscrambledArray[i + 1] - scaledOffset[i] - counterMod10) % 94 + 94) % 94;
    }
    
    const decodedTime = UNID.#convertBaseToInt(unscrambledArray.subarray(0,  7), 94);
    const decodedCounter = UNID.#convertBaseToInt(unscrambledArray.subarray(7,  9), 90);
    return { timestamp: decodedTime, index: decodedCounter };
  }
}
