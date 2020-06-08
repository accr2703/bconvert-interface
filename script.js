function convert(e, usarTabela = false) {
  e.preventDefault();
  var number = Number(document.getElementById('numero').value);
  var initial = Number(document.getElementById('initial').value);
  var base = Number(document.getElementById('base').value);

  var isValid = (!!number && !!initial && !!base);
  if( !isValid ) {
    alert('Formulário inválido! Valide se os campos estão preenchidos e se são números');
    return
  }

  base_convert(number, initial, base, usarTabela);
}

function clear(e, usarTabela = false) {
  e.preventDefault();
  document.getElementById('numero').value = '';
  document.getElementById('initial').value = 'Base';
  document.getElementById('base').value = 'Base';
}

function positional (number, base) {
  const splitedNumber = `${number}`.split('').map(char => parseInt(char, base));

  const startLine = `NOTACAO POSICIONAL\n\n${number} na base ${base}\n\n`;

  const firstLine = splitedNumber.map(
    (char, index) => `${char}*${base}^${splitedNumber.length - 1 - index}`
  ).join(' + ') + ' =\n\n';

  const secondLine = splitedNumber.map(
    (char, index) => {
      const resultToPower = Math.pow(base, splitedNumber.length - 1 - index);
      return `${char}*${resultToPower}}`
    }
  ).join(' + ') + ' =\n\n';

  const third = splitedNumber.map(
    (char, index) => {
      const resultToPower = Math.pow(base, splitedNumber.length - 1 - index);
      const resultProduct = Number(char) * resultToPower;
      return resultProduct
    }
  );
  const result = third.reduce((acc, current) => acc + current)
  const thirdLine = third.join(' + ') + ' =\n\n';

  const endLine = `${result} na base 10\n`;

  return { 
    text: startLine + firstLine + secondLine + thirdLine + endLine,
    result
  }
}

function successive (number, base) {
  let fullText = `DIVISÃO SUCESSIVA\n\n${number} na base 10\n\n`;
  const result = [];
  
  let currentResult = number;

  while( currentResult >= 1 ) {
    const resultDivision = Math.floor(currentResult / base);
    const resultModule = (currentResult % base).toString(16).toUpperCase();
    fullText = fullText + `${currentResult} = ${base}*${resultDivision} + ${resultModule}\n\n`
    result.unshift(resultModule);
    currentResult = resultDivision;
  }
  fullText = fullText + `${result.join('')} na base ${base}\n`;

  return { 
    text: fullText,
    result: result.join('')
  }
}

function table(number, initial_base, change_base) {
  const numberOnBase10 = parseInt(number, initial_base);
  let fullText = `TABELA DE CONVERSÃO\n\n${number} na base ${initial_base}\n\n`;
  const result = [];
  
  let currentResult = numberOnBase10;

  while( currentResult >= 1 ) {
    const resultDivision = Math.floor(currentResult / change_base);
    const resultModule = currentResult % change_base;
    const resultModuleToBase = (currentResult % change_base).toString(change_base).toUpperCase();
    fullText = fullText + `${resultModule.toString(initial_base)} -> ${resultModuleToBase}\n\n`
    result.unshift(resultModule);
    currentResult = resultDivision;
  }
  fullText = fullText + `${result.join('')} na base ${change_base}\n`;

  return { 
    text: fullText,
    result: result.join('')
  }
}

function base_convert (number, initial_base, change_base, showTable) {
  const allowedBases = [2, 8, 10, 16];
  if (!allowedBases.includes(initial_base) || !allowedBases.includes(change_base)) {
    alert('Bases permitidas: ' + allowedBases.join(', '))
    return
  }
  const numberOnBase10 = parseInt(number, initial_base);
  if(`${number}`.toUpperCase() !== numberOnBase10.toString(initial_base).toUpperCase()) {
    alert('O NUMERO PASSADO NAO CORRESPONDE A BASE');
    return
  }

  if(!showTable) {
    const resultPositional = positional(number, initial_base);
    const resultSuccessive = successive(resultPositional.result, change_base);
    alert(resultPositional.text + '\n' + resultSuccessive.text);

    return;
  }

  const resultTable = table(number, initial_base, change_base);
  alert(resultTable.text);
}
