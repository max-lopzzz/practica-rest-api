export const home = (req, res) => {
  res.json({
    message: "Bienvenido a la REST-API",
    routes: ["/", "/marco", "/ping", "/users", "/login"],
  });
};

export const marco = (req, res) => {
  res.json({ message: "polo" });
};

export const ping = (req, res) => {
  res.json({ message: "pong", time: new Date().toISOString() });
};
