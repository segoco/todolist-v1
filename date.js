/* eslint-disable quotes */
exports.getDate = () => {
  const today = new Date();
  return today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
};
exports.getDay = () => {
  const today = new Date();
  return today.toLocaleDateString("en-US", { weekday: "long" });
};
