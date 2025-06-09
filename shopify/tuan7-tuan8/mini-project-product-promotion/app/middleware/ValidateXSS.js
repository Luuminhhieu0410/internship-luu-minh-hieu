
import xss from 'xss';
export default function sanitizeInput(input) {
  return xss(input);
}
