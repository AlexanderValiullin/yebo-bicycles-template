// Возвращаем отступы в пикселах
export function calcOffsetInPx(offset, height) {
  if (typeof offset === 'string') {
    let re = /^(?:\s+)?(-?\d*\.?\d*)(px|%)(?:\s+)?$/;
    let found = offset.match(re);
    if (found === null ||
        typeof found[1] === 'undefined' ||
        typeof found[2] === 'undefined')
      return 0;

    let val = parseFloat(found[1]);
    if (!isFinite(val))
      return 0;
    else if (found[2] === 'px' && parseInt(val, 10) === val)
      return val;
    else if (found[2] === '%' && val >= 0 && typeof height !== 'undefined')
      return Math.round(height * val * 0.01);
    else
      return 0;
  }
  else if (typeof offset === 'number') {
    if (parseInt(offset, 10) !== offset)
      return 0;
    else
      return offset;
  }
  else
    return 0;
}

// Возвращаем продолжительность анимации в миллисекундах
export function calcDurationInMs(duration) {
  if (typeof duration === 'string') {
    let re = /^(?:\s+)?(\d*\.?\d*)(m?s)(?:\s+)?$/;
    let found = duration.match(re);
    if (found === null ||
        typeof found[1] === 'undefined' ||
        typeof found[2] === 'undefined')
      return 0;

    let val = parseFloat(found[1]);
    if (!isFinite(val))
      return 0;
    else if (found[2] === 'ms' && parseInt(val, 10) === val)
      return val;
    else if (found[2] === 's')
      return val * 1000;
    else
      return 0;
  }
  else if (typeof duration === 'number')
    if (parseInt(duration, 10) !== duration)
      return 0;
    else
      return duration;
  else
    return 0;
}
