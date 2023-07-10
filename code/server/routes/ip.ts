import { Router } from "express";
const ip = Router();

/*
From https://www.npmjs.com/package/express-rate-limit

"
If you are behind a proxy / load balancer usually the case with most hosting services,
the IP address of the request might be the IP of the load balancer / reverse proxy.

Making the rate limiter effectively a global one and blocking all requests once the limit is reached or undefined.
To solve this issue, add the following line to your code(right after you create the express application):

app.set('trust proxy', numberOfProxies)

Where numberOfProxies is the number of proxies between the user and the server.
To find the correct number, create a test endpoint that returns the client IP.

Go to /ip and see the IP address returned in the response.
If it matches your public IP address, then the number of proxies is correct and the rate limiter should now work correctly.
If not, then keep increasing the number until it does.
"
*/
// ip.get("/", function (req, res) {
//     res.json({ ip: req.ip });
// });

ip.get("/", function (req, res, next) {
    try {
        throw new Error("");
    } catch (err) {
        next(err);
    }
});

export default ip;