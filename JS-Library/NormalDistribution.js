/**
  * Creates a normal (Gaussian) distribution with a given mean and standard deviation.
  * If parameters are not specified, the default paramaters are
  * mean = 0 and standard deviation = 1 (the standard normal distribution).
  * @param `mean` the statistical average of all the data
  * @param `stdev` the variation in all the data
  */
function NormalDistribution(mean, stdev) {
  this.mean  = (typeof mean  === 'number') ? mean  : 0;
  this.stdev = (typeof stdev === 'number') ? stdev : 1;
}

/**
  * Returns the output of the probability density function of this distribution.
  * In a continuous distribution, this value is not statistically relevant.
  * @param `x` the input of the PDF to evaluate
  * @return    the y-value of the PDF evaluated at `x`
  */
NormalDistribution.prototype.evalPDF = function (x) {
  var t = (x - this.mean) / this.stdev;
  return (1 / (this.stdev * Math.sqrt(Util.TAU))) * Math.exp(-t*t / 2);
}

/**
  * Returns an *approximation* of the cumulative distribution function of this distribution.
  * The CDF is the integral of the PDF. It can be statistically interpreted as the probability
  * of obtaining a datum less than or equal to the input.
  * IMPORTANT: This function is an *approximation*. For large values of |x| (larger than ±10),
  * this function will return an incorrect value; thus specify the `accuracy` parameter.
  * The `accuracy` parameter is 100 by default. Specify a larger value for increased accuracy.
  * @param `x`        the input of the CDF to evaluate
  * @param `accuracy` the number of terms in the series in the calculation of this function
  * @return           the y-value of the PDF evaluated at `x`
  */
NormalDistribution.prototype.evalCDF = function (x, accuracy) {
  accuracy = (accuracy === undefined) ? 100 : accuracy;
  function series(y) {
    var sum = 0;
    for (var i = 0; i < accuracy; i++) {
      var a = 2*i+1;
      sum += Math.pow(y, a)/Util.doubleFactorial(a);
    }
    return sum;
  }
  return 0.5 + (this.evalPDF(x) * series(x));
}

/**
  * Returns the area under the PDF from `min` to `max`.
  * The area under the PDF can be interpreted as the probability of obtaining a datum
  * within the closed interval `[min, max]`.
  * The Empirical Rule states the following approximations (where m = mean and s = stdev):
  * - the probability of obtaining a value within [-1s + m, 1s + m] or [-1, 1]: about 68.27%
  * - the probability of obtaining a value within [-2s + m, 2s + m] or [-2, 2]: about 95.45%
  * - the probability of obtaining a value within [-3s + m, 3s + m] or [-3, 3]: about 99.73%
  * @param `min` the lower bound of the input; defaults to `-Infinity`
  * @param `max` the upper bound of the input; defaults to `Infinity`
  * @return this.evalCDF(max) - this.evalCDF(min)
  */
NormalDistribution.prototype.area = function (min, max) {
  min = (typeof min === 'number') ? min : -Infinity;
  max = (typeof max === 'number') ? max :  Infinity;
  return this.evalCDF(max) - this.evalCDF(min);
}

/** Returns the mean (statistical average) of this distribution. */
NormalDistribution.prototype.getMean = function () { return this.mean; }

/** Returns the standard deviation (statistical spread) of this distribution. */
NormalDistribution.prototype.getStdev = function () { return this.stdev; }
