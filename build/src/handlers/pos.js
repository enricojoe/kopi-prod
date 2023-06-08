import axios from 'axios';
const instance = axios.create({
    baseURL: process.env.POS_BASE,
});
const config = {
    headers: {
        'Authorization': "acf3e224-29c6-3afc-9790-f15288d5a829",
        'Content-Type': "application/x-www-form-urlencoded"
    }
};
const getToken = async () => {
    const data = {
        'grant_type': 'client_credentials'
    };
    const headers = {
        'Authorization': "Basic a1V1cHprbzFyVjNVNXZ1SVZIaXlzSUltWFdnYTpMbEZXcE9hREM2bGVpcHpuODR6RFNZOVN0aFlh",
        'Content-Type': "application/x-www-form-urlencoded"
    };
    const token = await instance
        .post("/token", data, { headers })
        .then(res => {
        console.log(res);
    })
        .catch(e => {
        console.log("hallo");
    });
    return token;
};
export const getPostalCode = async (req, res, next) => {
    res.json(getToken());
    // instance({
    // 	url: '/utilitas/1.0.1/getPostalCode',
    // 	config: {
    // 		method: 'post',
    // 		header: {
    // 			'Authorization': "acf3e224-29c6-3afc-9790-f15288d5a829",
    // 			'Content-Type': "application/x-www-form-urlencoded"
    // 		},
    // 		data: {
    // 			'grant_type': 'client_credentials'
    // 		}
    // 	}
    // })
    // .then((res) => {
    // 	console.log(res.data)
    // })
};
//# sourceMappingURL=pos.js.map