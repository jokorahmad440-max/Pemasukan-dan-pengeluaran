// Waktu batas diubah menjadi 9 menit dalam milidetik (9 * 60 * 1000)
const BATAS_WAKTU_MS = 9 * 60 * 1000; 
const WAKTU_REFRESH_MS = 30 * 1000;    // Auto refresh halaman setiap 30 detik

function jalankanOtomasi() {
    // Cek apakah fitur sedang diaktifkan oleh pengguna melalui tombol
    chrome.storage.local.get(["isAktif"], (result) => {
        if (result.isAktif) {
            console.log("Auto-Reject & Refresh berjalan (Batas 9 Menit)...");
            
            let adaAksi = false;
            const barisData = document.querySelectorAll("table tbody tr");

            barisData.forEach((baris) => {
                const teksWaktu = baris.innerText.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);

                if (teksWaktu && teksWaktu.length > 0) {
                    const waktuMasuk = new Date(teksWaktu[0]).getTime();
                    const waktuSekarang = new Date().getTime();
                    const selisihMenit = waktuSekarang - waktuMasuk;

                    // Jika durasi melewati 9 menit
                    if (selisihMenit > BATAS_WAKTU_MS) {
                        adaAksi = true;
                        const tombolAction = baris.querySelector("button.btn, .dropdown-toggle, [id*='Action']");
                        if (tombolAction) {
                            tombolAction.click();
                            setTimeout(() => {
                                const pilihanReject = Array.from(document.querySelectorAll("a, button, div"))
                                    .find(el => el.textContent.trim() === "Reject");
                                if (pilihanReject) {
                                    pilihanReject.click();
                                    console.log("Antrean lebih dari 9 menit berhasil di-reject otomatis.");
                                }
                            }, 500);
                        }
                    }
                }
            });

            // Jika tidak ada antrean yang di-reject, lakukan auto-refresh halaman
            setTimeout(() => {
                window.location.reload();
            }, WAKTU_REFRESH_MS);
        } else {
            console.log("Auto-Reject di-pause / dimatikan manual.");
        }
    });
}

// Jalankan pengecekan 3 detik setelah halaman terbuka
setTimeout(jalankanOtomasi, 3000);
