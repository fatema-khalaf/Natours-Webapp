module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err)); // (err) => next(err) the same as (next)
  };
};
