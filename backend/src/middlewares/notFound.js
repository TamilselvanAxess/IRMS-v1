export default function notFound(req, res) {
    res.status(404).json({
      status: 'error',
      statusCode: 404,
      message: 'Resource not found'
    });
  }