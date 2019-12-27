// Проверяем обладает ли устройство сенсорным экраном
export function isTouchDevice() {
  if ('ontouchstart' in window) {
    return true;
  }
  if ('maxTouchPoints' in navigator) {
    return navigator.maxTouchPoints > 0;
  }
  if ('msMaxTouchPoints' in navigator) {
    return navigator.msMaxTouchPoints > 0;
  }
  return false;
}
