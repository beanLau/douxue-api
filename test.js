const jwt = require('jsonwebtoken')
let msg = jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoibGl1d2VpdGFvIiwicGFzc3dvcmQiOiJ3ZWl0YW85MDExMjcifSwiZXhwIjoxNTg0MDI2ODg0LCJpYXQiOjE1ODQwMjMyODR9.zGrfljvt5tbIDv6SkJQS6S2sMbgLVJjn1bINTO-mka0", 'douxue');
console.log(msg)