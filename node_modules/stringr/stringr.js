module.exports = function Stringr(s) {
  for (var i = 1; i < arguments.length; i++) {
    s = s.replace("%s", arguments[i]);
  }
  return s;
};