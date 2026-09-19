import { rateLimit } from "express-rate-limit"

const limiter = (window, max) => {
  return rateLimit({
    windowMs: window * 60 * 1000,
    limit: max,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56
  })
}

export { limiter as rateLimiter }