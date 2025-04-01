export function attachHttpRoutes(app) {
  app.get('**', (req, res, next) => {
    try {
      const data = { ok: false, message: 'reached the ** route' };
      return res.status(404).json(data);
    } catch (error) {
      next(error);
    }
  });
}
