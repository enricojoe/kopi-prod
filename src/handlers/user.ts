import prisma from "../db";
import { hashPassword, comparePassword, createJWT } from "../modules/auth";
import { uploadImage } from "../config";

// Untuk membuat akun
// Request: (note: req.body berarti dari form)
// - Username : req.body.username
// - Password : req.body.password
// - namaLengkap : req.body.nama_lengkap
// - jenisAkun : req.body.jenis_akun
// Response:
// - Token JWT
export const createNewUser = async (req, res, next) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: await hashPassword(req.body.password, 1),
        namaLengkap: req.body.nama_lengkap,
        noIndukKoperasi: req.body.no_induk_koperasi,
        jenisAkun: req.body.jenis_akun,
      },
    });

    const keranjang = await prisma.keranjang.create({
      data: {
        userId: user.id,
      },
    });

    const token = createJWT(user);
    res.json({ token });
  } catch (e) {
    next(e);
  }
};

// Untuk masuk
// Request:
// - Username : req.body.username
// - Password : req.body.password
// Response:
// - Token JWT
// - Data user
export const signIn = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });

    const isValid = await comparePassword(req.body.password, user.password);
    if (!isValid) {
      res.status(401);
      res.json({ message: "Password Salah" });
      return;
    }

    const token = createJWT(user);
    res.json({ token, user });
  } catch (e) {
    next(e);
  }
};

// Dapetin profil pengguna
// Request:
// - Username : req.user.id
// Response:
// - Data user + Alamat
export const profile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        alamat: true,
      },
    });

    res.json({ data: user });
  } catch (e) {
    next(e);
  }
};

// Update profile pengguna
// Request:
// - id : req.user.id
// - namaLengkap : req.body.nama_lengkap
// - noIndukKoperasi : req.body.no_induk_koperasi
// Response:
// - Data user yang sudah diupdate
export const updateProfile = async (req, res, next) => {

  try {
  	if (req.body.gambar != "undefined") {

  		const image = await uploadImage(req.body.gambar, "user")
  		const updateUser = await prisma.user.update({
  			where: {
  				id: req.user.id
  			},
  			data: {
  				namaLengkap: req.body.nama_lengkap,
  				noIndukKoperasi: req.body.no_induk_koperasi,
  				gambar: image
  			}
  		})
  		res.json({ data: updateUser })
  	} else {
  		const updateUser = await prisma.user.update({
  			where: {
  				id: req.user.id
  			},
  			data: {
  				namaLengkap: req.body.nama_lengkap,
  				noIndukKoperasi: req.body.no_induk_koperasi
  			}
  		})
  		res.json({ data: updateUser })
  	}
  } catch (e) {
  	next(e)
  }
};

// Tambah (jika belum ada), update (jika sudah ada) data alamat
// Request:
// - provinsi: req.body.provinsi
// - kabupaten: req.body.kabupaten
// - kecamatan: req.body.kecamatan
// - kodePos: req.body.kode_post
// - detailAlamat: req.body.detail_alamat
// - latitude: req.body.latitude
// - longitude: req.body.longitude
// Response:
// - Data user dengan alamat yang sudah dibuat/update
export const updateAlamat = async (req, res, next) => {
  try {
    const createAlamat = await prisma.alamat.upsert({
      where: {
        userId: req.user.id,
      },
      create: {
        provinsi: req.body.provinsi,
        kabupaten: req.body.kabupaten,
        kecamatan: req.body.kecamatan,
        kodePos: req.body.kode_post,
        detailAlamat: req.body.detail_alamat,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        userId: req.user.id,
      },
      update: {
        provinsi: req.body.provinsi,
        kabupaten: req.body.kabupaten,
        kecamatan: req.body.kecamatan,
        kodePos: req.body.kode_post,
        detailAlamat: req.body.detail_alamat,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      },
    });
    res.json({ data: createAlamat });
  } catch (e) {
    next(e);
  }
};
