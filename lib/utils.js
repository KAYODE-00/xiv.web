export const cn = (...inputs) => {
  const classes = [];

  const pushClass = (input) => {
    if (!input) return;
    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
      return;
    }
    if (Array.isArray(input)) {
      input.forEach(pushClass);
      return;
    }
    if (typeof input === "object") {
      Object.entries(input).forEach(([key, value]) => {
        if (value) classes.push(key);
      });
    }
  };

  inputs.forEach(pushClass);
  return classes.join(" ");
};
