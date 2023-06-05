import midtransClient from "midtrans-client"

export default new midtransClient.Snap({
    isProduction : process.env.MIDTRANS_IS_PRODUCTION,
    serverKey : process.env.MIDTRANS_SERVER_KEY,
    clientKey : process.env.MIDTRANS_CLIENT_KEY
});