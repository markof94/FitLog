export default function (app) {
  app.get('/test', async (req, res) => {
    res.status(200).json({
      success: true,
    });
  });
}
