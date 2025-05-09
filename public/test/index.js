function log(data) {
  const output = document.getElementById('output');
  const span = document.createElement('span');
  span.innerText = data;
  output.append(span, document.createElement('br'));
}

try {
  const repeat = 250_000;

  log('----- 動作確認 -----');
  const id = UNID.generateID();
  log(`id: ${id}`);
  const data = UNID.decodeID(id);
  log(`timestamp: ${data.timestamp} (${new Date(data.timestamp).toString()})`);

  log('----- generateID -----');
  const start1 = performance.now();
  for(let i = 0; i < repeat; i++) {
    UNID.generateID();
  }
  const end1 = performance.now();
  log(`${(end1 - start1).toFixed(3)}ms/${repeat}回`);
  log(`${(repeat / (end1 - start1)).toFixed(3)}回/ms`);

  log('----- decodeID -----');
  const start2 = performance.now();
  for(let i = 0; i < repeat; i++) {
    UNID.decodeID(id);
  }
  const end2 = performance.now();
  log(`${(end2 - start2).toFixed(3)}ms/${repeat}回`);
  log(`${(repeat / (end2 - start2)).toFixed(3)}回/ms`);
} catch(e) {
  log('----- エラー -----');
  log(e);
}
