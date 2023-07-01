declare const _default: {
    getPostalCode: () => Promise<any>;
    getFee: ({ kode_pos_pengirim, kode_pos_penerima, berat, panjang, lebar, tinggi, diameter, harga }: {
        kode_pos_pengirim: any;
        kode_pos_penerima: any;
        berat: any;
        panjang?: number;
        lebar?: number;
        tinggi?: number;
        diameter?: number;
        harga: any;
    }) => Promise<any>;
    addPostingDoc: ({ order_toko_id, alamat_pengirim, alamat_penerima, detail_item, detail_pembayaran, pajak, layanan }: {
        order_toko_id: any;
        alamat_pengirim: any;
        alamat_penerima: any;
        detail_item: any;
        detail_pembayaran: any;
        pajak: any;
        layanan: any;
    }) => Promise<any>;
};
export default _default;
