import { createClient } from 'redis'
var client;

(async () => {
  client = createClient();

  client
  .on("error", (error) => console.error(`Error : ${error}`))
  .on("ready", () => console.log("Redis connected"));

  await client.connect();
})();

export default {
  getCached: async (req, res, next) => {
    const redis_key = req.originalUrl
    const result = await client.get(redis_key);
	if (result == null) {
		next()
	} else {
		res.status(200).json({
			data: JSON.parse(result)
		})
	}
  },
  caching: async (key, data) => {
    client.set(key, JSON.stringify(data))
  },
  delCache: (key) => {
    client.del(key)
  },
  setExpire: (key, time=60*15) => {
    client.expire(key, time)
  }
}