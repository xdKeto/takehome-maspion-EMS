class ErrorHandler extends Error {
  constructor(message, statusCode = 500, errors = undefined) {
    super(message)

    this.name = "ErrorHandler"
    this.statusCode = statusCode
    this.errors = errors
  }
}

const errorHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON body"
    })
  }

  const statusCode = err.statusCode ?? 500

  if (statusCode >= 500) {
    console.error(err)
  }

  const response = {
    success: false,
    message: statusCode >= 500 ? "Internal server error" : err.message
  }

  if (err.errors) {
    response.errors = err.errors
  }

  res.status(statusCode).json(response)
}


const notFoundHandler = (req, res, next) => {
  next(new AppError("Route not found", 404))
}

export { ErrorHandler, errorHandler, notFoundHandler }
