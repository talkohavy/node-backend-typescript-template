/**
 * Takes a string like "<Booger" and checks to see
 * if we can find a matching "</Booger" later in the
 * content.
 * @param {RegExpMatchArray} match
 * @param {{after:number}} param1
 */
const hasClosingTag = (match, { after }) => {
  const tag = `</${match[0].slice(1)}`;
  const pos = match.input.indexOf(tag, after);
  return pos !== -1;
};

export { hasClosingTag };
