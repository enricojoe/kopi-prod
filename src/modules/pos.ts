import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.POS_BASE,
});

const getToken = async () => {
		const data = {
			'grant_type': 'client_credentials'
		}
		const headers = {
			'Authorization': "Basic " + process.env.CREDENTIAL,
			'Content-Type': "application/x-www-form-urlencoded"
		}
		const token = await instance
												.post("/token", data, {headers})
												.then(res => {
													return res.data
												})
												.catch(e => {
													console.log("hallo")
												})
		return token
}

export default {
	getPostalCode: async () => {
		const token = await getToken()

		const data = {
				'grant_type': 'client_credentials'
		}
		const headers = {
			'Authorization': "Bearer " + token.access_token,
			'Content-Type': "application/x-www-form-urlencoded"
		}
		const postalCode = await instance
														.post("/utilitas/1.0.1/getPostalCode", data, {headers})
														.then(res => {
															return res.data
														})
														.catch(e => {
															console.log("=")
														})
		return postalCode
	},
	getFee: async ({
	 kode_pos_pengirim,
	 kode_pos_penerima, 
	 berat, 
	 panjang=0, 
	 lebar=0, 
	 tinggi=0,
	 diameter=0,
	 harga
	}) => {
		const token = await getToken()

		const data = {
				'customerid': 'DUMMY05400A',
				'desttypeid': '1',
				'itemtypeid': '1',
				'shipperzipcode': kode_pos_pengirim,
				'receiverzipcode': kode_pos_penerima,
				'weight': berat,
				'length': panjang,
				'width': lebar,
				'height': tinggi,
				'diameter': diameter,
				'valuegoods': harga
		}
		console.log(data)
		const headers = {
			'Authorization': "Bearer " + token.access_token,
			'Content-Type': "application/x-www-form-urlencoded"
		}
		const fee = await instance
														.post("/utilitas/1.0.1/getFee", data, {headers})
														.then(res => {
															return res.data
														})
														.catch(e => {
															console.log("=")
														})
		return fee
	},
	addPostingDoc: async ({
		order_toko_id,
		alamat_pengirim,
		alamat_penerima,
		detail_item,
		detail_pembayaran,
		pajak,
		layanan
	}) => {
		const token = await getToken()

		const data = {
				"userid": 1,
				"memberid": 'DUMMY05400A',
				"orderid": order_toko_id,
				"addresses": [alamat_pengirim, alamat_penerima],
				"itemproperties": detail_item,
				"paymentvalues": detail_pembayaran,
				"taxes": pajak,
				"services": layanan
		}
		console.log(data)
		const headers = {
			'Authorization': "Bearer " + token.access_token,
			'Content-Type': "application/json"
		}
		const fee = await instance
														.post("/webhookpos/1.0.1/AddPostingDoc", data, {headers})
														.then(res => {
															return res.data
														})
														.catch(error => {
															if (error.response) {
													      // The request was made and the server responded with a status code
													      // that falls out of the range of 2xx
													      console.log(error.response.data);
													      console.log(error.response.status);
													      console.log(error.response.headers);
													    } else if (error.request) {
													      // The request was made but no response was received
													      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
													      // http.ClientRequest in node.js
													      console.log(error.request);
													    } else {
													      // Something happened in setting up the request that triggered an Error
													      console.log('Error', error.message);
													    }
													    console.log(error.config);
														})
		return fee
	}
}
