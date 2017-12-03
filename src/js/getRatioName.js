const ratios = [[10, 16], [10, 15], [9, 16], [3, 4]].reduce(function(
  result,
  value
) {
  const values = [];

  values.push({
    width: value[0],
    height: value[1],
    ratio: value[0] / value[1],
    name: value[0] + ':' + value[1]
  });

  if (value[0] !== value[1]) {
    values.push({
      width: value[1],
      height: value[0],
      ratio: value[1] / value[0],
      name: value[1] + ':' + value[0]
    });
  }

  return result.concat(values);
},
[]);

/**
 *
 * @param   {number} width
 * @param   {number} height
 * @returns {string}
 */
function getRatioName(width, height) {
  const ratio = Number(width) / Number(height);
  const matches = ratios.filter(v => v.ratio === ratio);

  return matches.length ? matches[0].name : undefined;
}

export default getRatioName;
