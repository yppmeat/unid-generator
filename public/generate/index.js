function generate() {
  const count = document.querySelector('#generate-count').value;
  const output = document.querySelector('#id-generate-output');
  const idStack = [];
  for(let i = 0; i < count; i++) {
    idStack.push(UNID.generateID());
  }
  
  output.value = idStack.join('\n');
}

function decode() {
  const input = document.querySelector('#id-decode-input').value.split('\n');
  const output = document.querySelector('#id-decode-output');
  
  const decodeStack = [];
  for(let i = 0; i < input.length; i++) {
    const decoded = UNID.decodeID(input[i]);
    if(decoded) {
      decodeStack.push(`time: ${convertDate(new Date(decoded.timestamp))}, index: ${decoded.index}`);
    } else {
      decodeStack.push('');
    }
  }
  
  output.value = decodeStack.join('\n');
}

function convertDate(date) {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1, 2);
  const day = pad(date.getDate(), 2);
  const hours = pad(date.getHours(), 2);
  const minutes = pad(date.getMinutes(), 2);
  const seconds = pad(date.getSeconds(), 2);
  const milliseconds = pad(date.getMilliseconds(), 3);
  
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  
  function pad(s, n) {
    return ('' + s).padStart(n, '0');
  }
}