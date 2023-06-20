/**
 * LOGEST function.
 * https://www.statisticshowto.com/probability-and-statistics/regression-analysis/find-a-linear-regression-equation
 * http://www.exceluser.com/formulas/how-to-calculate-both-types-of-compound-growth-rates.html
 * https://www.excelfunctions.net/excel-logest-function.html
 * @param data 
 */
export default function logest(ys: number[]): number {
  // y = bx
  let sumX, sumY, sumXY, sumX2;
  sumX = sumY = sumXY = sumX2 = 0

  for (const [i, y] of ys.entries()) {
    const x = i+1
    const logY = Math.log(y)

    sumX += i + 1
    sumY += logY
    sumX2 += x * x
    sumXY += logY * x
  }

  // https://www.statisticshowto.com/probability-and-statistics/regression-analysis/find-a-linear-regression-equation/ 
  const slope = ((ys.length*sumXY)-(sumX*sumY))/((ys.length*sumX2) - (sumX*sumX))

  return Math.exp(slope);
}