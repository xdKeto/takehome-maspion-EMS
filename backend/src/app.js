import express from "express"

const app = express()

// middlewares disini, ratelimit
app.use(express.json())
// rate limit

// daftar routes
// app.use("/api/auth", authRoutes)
//

app.get("/health", (req, res) => {
  res.status(200).send({
    message: "ok, api running"
  })
})

// error handler, app.use(errorHandler)

export default app