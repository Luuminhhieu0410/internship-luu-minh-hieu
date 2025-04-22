const slugify = require('slugify');

function toSlug(input) {
  return slugify(input, {
    lower: true,
    locale: 'vi',
    remove: /[*+~.()'"!:@]/g
  });
}

module.exports = toSlug;
