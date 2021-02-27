exports.getDate = () => {
  const today = new Date();

  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  return today.toLocaleDateString(undefined, options);
  // expected output: Thursday, February 20, 2021 (varies according to default locale)
};
exports.getWeekDay = () => {
    const today = new Date();

    const options = {
      weekday: "long",
    };
    return today.toLocaleDateString(undefined, options);
};
exports.getDay = () => {
    const today = new Date();

    const options = {
      day: "numeric",
    };
    return today.toLocaleDateString(undefined, options);
};
exports.getYear = () => {
    const today = new Date();

    const options = {
      year: "numeric",
    };
    return today.toLocaleDateString(undefined, options);
};