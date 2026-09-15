document.addEventListener("DOMContentLoaded", () => {
    const btnMulai = document.getElementById("btnMulai");
    const btnStop = document.getElementById("btnStop");
    const btnDownloadZip = document.getElementById("btnDownloadZip");
    const statusDiv = document.getElementById("status");

    if (!btnMulai || !btnStop) {
        console.error("Elemen tombol tidak ditemukan di HTML!");
        return;
    }

    // Cek status saat popup dibuka
    chrome.storage.local.get(["isAktif"], (result) => {
        if (result.isAktif) {
            statusDiv.textContent = "Status: AKTIF (Berjalan)";
            statusDiv.style.color = "green";
        } else {
            statusDiv.textContent = "Status: NONAKTIF";
            statusDiv.style.color = "red";
        }
    });

    // Tombol START diklik
    btnMulai.addEventListener("click", () => {
        chrome.storage.local.set({ isAktif: true }, () => {
            statusDiv.textContent = "Status: AKTIF (Berjalan)";
            statusDiv.style.color = "green";
            alert("Auto-Reject berhasil DIHIDUPKAN!");
        });
    });

    // Tombol STOP diklik
    btnStop.addEventListener("click", () => {
        chrome.storage.local.set({ isAktif: false }, () => {
            statusDiv.textContent = "Status: NONAKTIF";
            statusDiv.style.color = "red";
            alert("Auto-Reject berhasil DIMATIKAN!");
        });
    });

    // Tombol Download ZIP
    if (btnDownloadZip) {
        btnDownloadZip.addEventListener("click", () => {
            alert("Pastikan semua file ekstensi sudah berada di dalam satu folder yang sama.");
        });
    }
});
