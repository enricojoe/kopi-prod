import prisma from "../db"
import pos from "../modules/pos"

export const getPosFee = async (req, res, next) => {
	try {
		const detail_barang = {
			kode_pos_pengirim: req.body.kode_pos_pengirim,
			kode_pos_penerima: req.body.kode_pos_penerima,
			berat: req.body.berat,
			panjang: req.body.panjang,
			lebar: req.body.lebar,
			tinggi: req.body.tinggi,
			diameter: req.body.diameter,
			harga: req.body.harga
		}
		const fee = await pos.getFee(detail_barang)
		res.status(200).json({ data: fee.rs_fee.r_fee })
	} catch (e) {
		next(e)
	}
}

export const addPostingDoc = async (req, res) => {
	const penerima = await prisma.user.findUnique({
		where: {
			id: req.user.id
		},
		select: {
			namaLengkap: true,
			noTelpon: true,
			alamat: true
		}
	})
	const alamat_penerima = {
		addresstype: "receiverlocation",
		customertype: 1,
		name: penerima.namaLengkap,
		phone: penerima.noTelpon,
		email: "",
		address: penerima.alamat.detailAlamat,
		subdistrict: penerima.alamat.kecamatan,
		city: penerima.alamat.kabupaten,
		province: penerima.alamat.provinsi,
		zipcode: penerima.alamat.kodePos,
		country: "Indonesia",
		geolang: "",
		geolat: "",
		description: ""
	}
	const order_id = req.order.id
	const order_toko = req.order.orderToko

	order_toko.forEach(async toko => {
		var alamat_pengirim = {
			addresstype: "senderlocation",
			customertype: 1,
			name: toko.toko.namaLengkap,
			phone: toko.toko.noTelpon,
			email: "",
			address: toko.toko.alamat.detailAlamat,
			subdistrict: toko.toko.alamat.kecamatan,
			city: toko.toko.alamat.kabupaten,
			province: toko.toko.alamat.provinsi,
			zipcode: toko.toko.alamat.kodePos,
			country: "Indonesia",
			geolang: "",
			geolat: "",
			description: ""
		}
		var detail_item = {
			itemtypeid: 1,
			productid: toko.id,
			valuegoods: toko.subTotal,
			weight: 1200,
			length: 0,
			width: 0,
			height: 0,
			codvalue: 0,
			pin: 0,
			itemdesc: `Barang dari toko ${toko.toko.namaLengkap}`
		}

		var detail_pembayaran = [
		    {
		      name: "fee",
		      value: 70000
		    },
		    {
		      name: "insurance",
		      value: 700
		    }
		]
		var pajak = [
		    {
		      name: "fee",
		      value: 700
		    },
		    {
		      name: "insurance",
		      value: 700
		    }
		]
		var layanan = [
			{
		      name: "genreceipt",
		      value: 1
		    },
		    {
		      name: "printreceipt",
		      value: 1
		    },
		    {
		      name: "pickup",
		      value: 0
		    },
		    {
		      name: "delivery",
		      value: 0
		    },
		    {
		      name: "packing",
		      value: 1
		    }
		]
		var order_toko_id = order_id + toko.id
		console.log(order_toko_id)
		var result = await pos.addPostingDoc({order_toko_id,
											alamat_pengirim, 
											alamat_penerima, 
											detail_item,
											detail_pembayaran,
											pajak,
											layanan})
		console.log(result)
	})
	return
}