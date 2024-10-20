class UNID {
  #timestamp = 0;
  #counter = 0;
  static #sortPatterns = [
    [2, 6, 7, 5, 4, 8, 1, 0, 3],
    [4, 2, 3, 1, 0, 8, 5, 6, 7],
    [0, 4, 6, 2, 3, 8, 1, 5, 7],
    [7, 6, 2, 5, 1, 8, 0, 4, 3],
    [1, 0, 7, 5, 6, 8, 3, 2, 4],
    [2, 4, 6, 5, 3, 8, 1, 0, 7],
    [1, 5, 4, 3, 7, 8, 0, 6, 2],
    [0, 5, 1, 4, 7, 8, 6, 3, 2],
    [1, 0, 3, 2, 4, 8, 6, 5, 7],
    [0, 7, 1, 3, 4, 8, 6, 2, 5]
  ];
  static #offsetPatterns = [
    [33, 43, 70, 62, 88, 73, 69],
    [79, 30, 85, 27, 20, 84, 66],
    [2,  7,  34, 62, 43, 24, 90],
    [3,  61, 67, 30, 40, 66, 12],
    [57, 85, 3,  18, 66, 76, 5],
    [59, 73, 91, 85, 17, 79, 80],
    [16, 89, 71, 50, 5,  4,  73],
    [37, 26, 74, 77, 11, 76, 66],
    [92, 25, 58, 52, 71, 20, 12],
    [17, 62, 38, 90, 20, 49, 0],
    [78, 38, 7,  43, 37, 22, 61],
    [67, 59, 16, 75, 3,  32, 46],
    [36, 31, 22, 6,  75, 55, 4],
    [63, 34, 94, 20, 1,  55, 9],
    [72, 68, 21, 58, 93, 64, 53],
    [58, 73, 86, 73, 43, 57, 55],
    [85, 41, 50, 10, 88, 54, 62],
    [35, 91, 3,  17, 91, 40, 12],
    [67, 20, 14, 34, 62, 48, 2],
    [80, 60, 16, 40, 52, 79, 40],
    [29, 36, 64, 42, 49, 7,  1],
    [31, 61, 59, 63, 16, 74, 82],
    [39, 57, 79, 3,  67, 84, 52],
    [21, 15, 11, 42, 76, 85, 18],
    [66, 9,  22, 91, 26, 5,  64],
    [20, 81, 0,  51, 83, 87, 37],
    [25, 77, 21, 9,  19, 32, 35],
    [1,  16, 11, 72, 43, 28, 67],
    [89, 57, 45, 4,  91, 68, 52],
    [73, 33, 68, 90, 37, 71, 32]
  ];
  static #ASCII_SET = '3y|DWs^oH2%I\'k"qUmY6Q9.(rNLJ,j0`]P$5?CzM*><=@Kn~&a;OwEf)[xhZBpSGlg}-b/cX:{#AvR7Tu+ei4d_!1F\\8tV';
  static #cachedAsciiIndexMap = new Map(UNID.#ASCII_SET.split('').map((char, index) => [char, index]));
  
  static #getRemainderInRange(number) {
    return (number % 94 + 94) % 94;
  }
  
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
    array.copyWithin(shift, 0, 8 - shift);
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
    const randomValue = Math.floor(Math.random() * (30 - 1)) + 1;
    result[0] = (result[0] - 1) * 30 + randomValue;
    
    const offsetPattern = UNID.#offsetPatterns[randomValue - 1];
    const maxValue = 94 - counterMod10;
    for(let i = 0; i < 7; i++) {
      result[i + 1] = UNID.#getRemainderInRange(result[i + 1] + ((offsetPattern[i] * maxValue / 94) | 0) + counterMod10);
    }
    
    UNID.#rotateArrayInPlace(result.subarray(0, 8), counterMod10);
    
    const sortPattern = UNID.#sortPatterns[counterMod10];
    let asciiResult = '';
    for(let i = 0; i < 9; i++) {
      asciiResult += UNID.#ASCII_SET[result[sortPattern[i]] % 94];
    }
    
    return asciiResult;
  }
  
  decodeID(id) {
    const decodedArray = new Uint8Array(9);
    for(let i = 0; i < 9; i++) {
      decodedArray[i] = UNID.#cachedAsciiIndexMap.get(id[i]);
    }

    const counterMod10 = decodedArray[5] % 10;
    const sortPattern = UNID.#sortPatterns[counterMod10];
    const unscrambledArray = new Uint8Array(9);
    for(let i = 0; i < 9; i++) {
      unscrambledArray[sortPattern[i]] = decodedArray[i];
    };
    
    UNID.#rotateArrayInPlace(unscrambledArray.subarray(0, 8), -counterMod10);
    
    const randomValue = unscrambledArray[0] % 30;
    unscrambledArray[0] = Math.ceil(unscrambledArray[0] / 30);
    
    const maxValue = 94 - counterMod10;
    const scaledOffset = UNID.#offsetPatterns[randomValue - 1];
    for(let i = 0; i < 7; i++) {
      unscrambledArray[i + 1] = UNID.#getRemainderInRange(unscrambledArray[i + 1] - ((scaledOffset[i] * maxValue / 94) | 0) - counterMod10);
    }
    
    const decodedTime = UNID.#convertBaseToInt(unscrambledArray.subarray(0, 7), 94);
    const decodedCounter = UNID.#convertBaseToInt(unscrambledArray.subarray(7, 9), 90);
    return { timestamp: decodedTime, index: decodedCounter };
  }
}
