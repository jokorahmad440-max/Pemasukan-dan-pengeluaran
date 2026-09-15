// Batas waktu 9 menit dalam milidetik (9 * 60 * 1000)
const BATAS_WAKTU_MS = 9 * 60 * 1000; 
// Waktu tunggu sebelum halaman me-refresh ulang jika belum ada aksi (20 detik)
const WAKTU_REFRESH_MS = 20 * 1000;    

function jalankanOtomasiAkurat() {
    // Cek apakah ekstensi sedang aktif (status ON dari popup)
    chrome.storage.local.get(["isAktif"], (result) => {
        if (!result.isAktif) {
            console.log("Auto-Reject sedang nonaktif.");
            return;
        }

        console.log("Memeriksa data antrean...");
        let aksiDijalankan = false;

        // Ambil semua baris data pada tabel utama
        const barisData = document.querySelectorAll("table tbody tr");

        barisData.forEach((baris) => {
            // Ambil teks datetime menggunakan pola regex standar tanggal & waktu (YYYY-MM-DD HH:MM:SS)
            const matchWaktu = baris.innerText.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);

            if (matchWaktu && matchWaktu.length > 0) {
                // Ubah spasi menjadi 'T' agar format standarnya kompatibel dibaca Date() di semua browser
                const formatIsoWaktu = matchWaktu[0].replace(" ", "T");
                const waktuMasuk = new Date(formatIsoWaktu).getTime();
                const waktuSekarang = new Date().getTime();
                const selisihWaktu = waktuSekarang - waktuMasuk;

                // Jika selisih waktu sudah melebihi 9 menit
                if (selisihWaktu > BATAS_WAKTU_MS) {
                    // Cari tombol "Action" pada baris tersebut
                    const tombolAction = baris.querySelector("button, .dropdown-toggle, [id*='Action'], a.btn");

                    if (tombolAction && !baris.dataset.sudahDiproses) {
                        baris.dataset.sudahDiproses = "true"; // Tandai agar tidak diklik berulang kali
                        aksiDijalankan = true;
                        console.log("Antrean > 9 menit ditemukan. Mengeklik tombol Action...");
                        
                        tombolAction.click();

                        // Beri jeda 600ms agar menu dropdown pilihan muncul sempurna di layar
                        setTimeout(() => {
                            // Cari elemen teks/tombol dengan tulisan "Reject"
                            const semuaElemen = document.querySelectorAll("a, button, div, span, li");
                            for (let el of semuaElemen) {
                                if (el.textContent.trim() === "Reject" && el.offsetParent !== null) {
                                    el.click();
                                    console.log("Berhasil mengeklik tombol Reject!");
                                    break;
                                }
                            }
                        }, 600);
                    }
                }
            }
        });

        // Jika tidak ada antrean yang perlu di-reject saat ini, lakukan auto-refresh agar data selalu update
        setTimeout(() => {
            // Cek sekali lagi pastikan masih aktif sebelum refresh
            chrome.storage.local.get(["isAktif"], (resCheck) => {
                if (resCheck.isAktif && !aksiDijalankan) {
                    console.log("Melakukan refresh halaman untuk memperbarui antrean...");
                    window.location.reload();
                }
            });
        }, WAKTU_REFRESH_MS);
    });
}

// Jalankan fungsi otomatisasi setelah halaman selesai dimuat sempurna (jeda 3 detik)
window.addEventListener("load", () => {
    setTimeout(jalankanOtomasiAkurat, 3000);
});
