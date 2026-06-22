  // ============================================== //
//          script-for-the-home-page.js - Animasi Futuristik        //
// ============================================== //

// Pastikan GSAP dan ScrollTrigger sudah dimuat di HTML sebelum script ini
gsap.registerPlugin(ScrollTrigger);
// Pastikan TextPlugin di-uncomment di sini HANYA jika Anda memuatnya di HTML.
// Jika tidak, biarkan dikomentari atau hapus jika Anda tidak menggunakan efek typing.
gsap.registerPlugin(TextPlugin);

const defaultEase = "power3.out";
const defaultDuration = 1.2;

// Fungsi helper untuk mendapatkan nilai delay dari kelas CSS (misal: element-delay-1 -> 0.2)
// Ini memungkinkan animasi GSAP menggunakan nilai delay yang didefinisikan dalam kelas HTML.
function getDelayValue(element) {
    let delayValue = 0;

    element.classList.forEach(className => {
        const match = className.match(/^element-delay-(\d+)(?:-(\d+))?$/);
        if (match) {
            const whole = parseInt(match[1], 10);
            const fraction = match[2] ? parseInt(match[2], 10) : 0;
            const value = fraction ? parseFloat(`${whole}.${fraction}`) : whole;
            delayValue = Math.max(delayValue, value * 0.2);
        }
    });

    return delayValue;
}

// --- Animasi Intro Otomatis (HANYA untuk elemen di scene-intro) ---
// Animasi ini akan dijalankan segera saat halaman dimuat, TIDAK tergantung scroll.
// Ini untuk H1, P, dan pop-up utama di scene-intro.
// Timeline memastikan animasi berjalan berurutan dengan delay tertentu.
gsap.timeline({ delay: 0.5 }) // Beri sedikit delay agar background blur sempat terlihat
    // Animasi judul (H1) di intro
    .from(".scene-intro h1.element-fade-in-up", { opacity: 0, y: 50, duration: defaultDuration, ease: defaultEase })
    // Animasi sub-judul (P) di intro, mulai sedikit setelah judul
    .from(".scene-intro p.element-delay-1.element-fade-in-up", { opacity: 0, y: 50, duration: defaultDuration, ease: defaultEase }, "<0.2")
    // Animasi pop-up utama di scene intro (scale dan fade in)
    .fromTo(".scene-intro .pop-up-card.element-scale-fade.element-delay-2",
        { opacity: 0, scale: 0.8 }, // State awal (sesuai CSS)
        {
            opacity: 1, // State akhir (terlihat)
            scale: 1, // State akhir (ukuran normal)
            duration: 1.5, // Durasi dramatis untuk pop-up utama
            ease: "back.out(1.7)",
            onComplete: () => {
                // Setelah pop-up muncul, hilangkan blur icon di dalamnya
                const icon = document.querySelector(".scene-intro .pop-up-card .pop-up-icon.element-blur-to-clear");
                if (icon) {
                    gsap.to(icon, { filter: "blur(0px)", duration: 0.8, ease: defaultEase });
                }
            }
        }, "<0.5") // Mulai 0.5 detik setelah animasi sebelumnya (sub-judul)
    // Animasi Typing Text untuk intro (jika ada)
    // Memastikan `TextPlugin` berfungsi jika diaktifkan.
    .from(".scene-intro .typing-text.element-delay-4", {
        textContent: "", // Mulai dari teks kosong
        duration: 2, // Sesuaikan durasi pengetikan
        ease: "none" // Efek pengetikan biasanya tanpa ease
    }, "<"); // Mulai bersamaan dengan pop-up atau sedikit setelahnya

// --- Animasi Background Blur di Awal (Dihilangkan saat Scroll di Scene Intro) ---
// Blur background akan menghilang secara mulus saat Anda mulai scroll di scene pertama.
gsap.to(".main-background", {
    filter: "blur(0px)", // Menghilangkan blur
    ease: "none", // Transisi linear dengan scroll
    scrollTrigger: {
        trigger: ".scene-intro", // Trigger adalah scene intro
        start: "top top", // Mulai saat top scene intro menyentuh top viewport
        end: "bottom top", // Berakhir saat bottom scene intro menyentuh top viewport
        scrub: true, // Terikat dengan scroll (animasi bergerak seiring scroll)
        // markers: true // Hapus komentar ini untuk melihat penanda ScrollTrigger (debugging)
    }
});


// --- Animasi Global untuk Elemen yang Dipicu Scroll (KECUALI elemen di intro yang sudah otomatis) ---
// Loop melalui setiap jenis animasi dan terapkan ScrollTrigger.

// Animasi Fade In Up
gsap.utils.toArray(".element-fade-in-up").forEach(element => {
    // Lewati elemen di scene intro yang sudah dianimasikan secara otomatis oleh timeline intro
    if (element.closest(".scene-intro") && (element.tagName === 'H1' || element.tagName === 'P' || element.classList.contains('pop-up-card'))) {
        return;
    }
    const delay = getDelayValue(element); // Dapatkan nilai delay dari kelas CSS

    gsap.from(element, {
        opacity: 0, // State awal (sesuai CSS)
        y: 50, // Transformasi awal (sesuai CSS)
        duration: defaultDuration,
        ease: defaultEase,
        delay: delay, // Terapkan delay di sini, sebelum animasi dimulai
        scrollTrigger: {
            trigger: element,
            start: "top 85%", // Animasi dimulai saat 85% bagian atas elemen terlihat
            toggleActions: "play none none reverse", // Mainkan saat masuk, kembali ke awal saat keluar ke atas
            // markers: true // Debugging
        }
    });
});

// Animasi Fade In biasa untuk elemen teks yang hanya memiliki class .element-fade-in
gsap.utils.toArray(".element-fade-in").forEach(element => {
    const delay = getDelayValue(element);

    gsap.from(element, {
        opacity: 0,
        duration: defaultDuration,
        ease: defaultEase,
        delay: delay,
        scrollTrigger: {
            trigger: element,
            start: "top 90%",
            toggleActions: "play none none reverse",
        }
    });
});

// Animasi Scale Fade (untuk info card, feature block, quote card, dll.)
gsap.utils.toArray(".element-scale-fade").forEach(element => {
    // Lewati .pop-up-card yang ada di scene-intro karena sudah dianimasikan otomatis
    if (element.classList.contains('pop-up-card') && element.closest('.scene-intro')) {
        return;
    }
    const delay = getDelayValue(element); // Dapatkan nilai delay

    gsap.fromTo(element,
        { opacity: 0, scale: 0.8 }, // State awal (sesuai CSS)
        {
            opacity: 1, // State akhir
            scale: 1, // State akhir
            duration: defaultDuration,
            ease: "back.out(1.7)",
            delay: delay, // Terapkan delay
            scrollTrigger: {
                trigger: element,
                start: "top 75%",
                toggleActions: "play none none reverse",
                onEnter: () => {
                    // Animasi blur-to-clear untuk ikon/gambar di dalamnya saat elemen masuk viewport
                    const icon = element.querySelector(".element-blur-to-clear");
                    if (icon) {
                        gsap.to(icon, { filter: "blur(0px)", duration: 0.8, ease: defaultEase });
                    }
                },
                onLeaveBack: () => {
                     // Mengembalikan blur saat elemen keluar viewport ke atas
                     const icon = element.querySelector(".element-blur-to-clear");
                     if (icon) {
                         gsap.to(icon, { filter: "blur(5px)", duration: 0.8, ease: defaultEase });
                     }
                }
            }
        }
    );
});

// Animasi Slide In Left
gsap.utils.toArray(".element-slide-in-left").forEach(element => {
    if (element.closest(".scene-intro")) return; // Kecualikan dari trigger scroll jika di intro
    const delay = getDelayValue(element);

    gsap.from(element, {
        opacity: 0,
        x: -100,
        duration: defaultDuration,
        ease: defaultEase,
        delay: delay,
        scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none reverse",
        }
    });
});

// Animasi Slide In Right
gsap.utils.toArray(".element-slide-in-right").forEach(element => {
    if (element.closest(".scene-intro")) return; // Kecualikan dari trigger scroll jika di intro
    const delay = getDelayValue(element);

    gsap.fromTo(element,
        { opacity: 0, x: 100 },
        {
            opacity: 1,
            x: 0,
             duration: defaultDuration,
            ease: defaultEase,
            delay: delay,
            scrollTrigger: {
                trigger: element,
                start: "top 80%",
                toggleActions: "play none none reverse",
                onEnter: () => {
                     // Animasi blur-to-clear untuk gambar fitur saat elemen masuk viewport
                     const img = element.querySelector(".feature-image.element-blur-to-clear");
                     if (img) {
                         gsap.to(img, { filter: "blur(0px)", duration: 0.8, ease: defaultEase });
                     }
                 },
                 onLeaveBack: () => {
                      // Mengembalikan blur saat elemen keluar viewport ke atas
                      const img = element.querySelector(".feature-image.element-blur-to-clear");
                      if (img) {
                          gsap.to(img, { filter: "blur(8px)", duration: 0.8, ease: defaultEase });
                      }
                 }
            }
        }
    );
});

// Animasi Pop Up (untuk logo, hotspot, dll)
gsap.utils.toArray(".element-pop-up").forEach(element => {
    if (element.closest(".scene-intro")) return; // Kecualikan dari trigger scroll jika di intro
    const delay = getDelayValue(element);

    gsap.from(element, {
        opacity: 0,
        scale: 0.7,
        duration: defaultDuration,
        ease: "back.out(1.7)",
        delay: delay,
        scrollTrigger: {
            trigger: element,
            start: "top 90%",
            toggleActions: "play none none reverse",
        }
    });
});

// Animasi Bounce In (untuk CTA button)
gsap.utils.toArray(".element-bounce-in").forEach(element => {
    if (element.closest(".scene-intro")) return; // Kecualikan dari trigger scroll jika di intro
    const delay = getDelayValue(element);

    gsap.from(element, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "bounce.out",
        delay: delay,
        scrollTrigger: {
            trigger: element,
            start: "top 90%",
            toggleActions: "play none none reverse",
        }
    });
});

// Animasi Glitch Text (sekarang fade in biasa tanpa efek glitch)
// Ambil semua .hiding-text, kecualikan yang ada di dalam .scene-intro
const hidingTexts = gsap.utils.toArray(".hiding-text")
  .filter(el => !el.closest(".scene-intro"));

hidingTexts.forEach(element => {
  const delay = getDelayValue(element);

  gsap.from(element, {
    opacity: 0,
    y: 50,
    duration: defaultDuration,
    ease: defaultEase,
    delay: delay,
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      toggleActions: "play none none reverse",
    }
  });
});



// --- Animasi Teks Mengetik (Typing Text) ---
gsap.utils.toArray(".typing-text").forEach(element => {
    // Kecualikan typing-text di intro jika sudah dianimasikan secara otomatis oleh timeline intro.
    if (element.closest(".scene-intro")) return;

    let originalText = element.textContent; // Simpan teks asli
    gsap.set(element, { textContent: "" }); // Set teks awal menjadi kosong (ini yang akan "diketik")
    const delay = getDelayValue(element);

    ScrollTrigger.create({
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none reverse",
        onEnter: () => {
            gsap.to(element, {
                duration: originalText.length * 0.05, // Durasi berdasarkan panjang teks
                text: originalText, // Properti `text` dari TextPlugin
                ease: "none",
                delay: delay
            });
        },
        onLeaveBack: () => {
            // Mengembalikan teks menjadi kosong saat keluar viewport ke atas
            gsap.set(element, { textContent: "" });
        }
    });
});

// Animasi Teks Mengetik Lambat (Typing Text Slow)
gsap.utils.toArray(".typing-text-slow").forEach(element => {
    if (element.closest(".scene-intro")) return; // Kecualikan jika di intro

    let originalText = element.textContent;
    gsap.set(element, { textContent: "" });
    const delay = getDelayValue(element);

    ScrollTrigger.create({
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none reverse",
        onEnter: () => {
            gsap.to(element, {
                duration: originalText.length * 0.1, // Durasi lebih lambat
                text: originalText,
                ease: "none",
                delay: delay
            });
        },
        onLeaveBack: () => {
            gsap.set(element, { textContent: "" });
        }
    });
});


// --- ANIMASI ANGKA (Animated Number) ---
gsap.utils.toArray(".animated-number").forEach(element => {
    if (element.closest(".scene-intro")) return; // Maybe di kecualikan jika di intro hehe
    const targetValue = parseInt(element.dataset.target); // ini nilai target dari data-target atribut
    let initialValue = 0; // awal nya mulai dari 0
    const delay = getDelayValue(element);

    ScrollTrigger.create({
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none reverse",
        onEnter: () => {
            gsap.to(element, {
                duration: 2,
                textContent: targetValue, // Animasikan content teks menjadi angka target
                roundProps: "textContent", // ini harusnya dipastikan teks adalah angka bulat seingat ku.
                ease: "power1.inOut",
                delay: delay
            });
        },
        onLeaveBack: () => {
            gsap.to(element, {
                duration: 0.2,
                textContent: initialValue, // Kembali ke 0 saat keluar viewport :>
                roundProps: "textContent",
                ease: "power1.inOut"
            });
        }
    });
});

// --- Animasi Background Bergulir Tunggal (Parallax Background) ---
// Membuat background utama bergerak berlawanan arah dengan scroll konten
// dan aku lupa bagian ini
gsap.to(".main-background", {
    backgroundPositionY: () => {
        const scrollHeight = document.querySelector("#smooth-content").scrollHeight;
        const viewportHeight = window.innerHeight;
        return `-${Math.max(0, scrollHeight - viewportHeight)}px`;
    },
    ease: "none", // Pastikan tidak ada ease agar sinkron dengan scroll
    scrollTrigger: {
        trigger: "#smooth-content",
        start: "top top",
        end: "bottom bottom",
        scrub: true, // Animasi terikat langsung dengan posisi scroll
        invalidateOnRefresh: true, // Hitung ulang pada refresh (penting untuk responsivitas)
        // markers: true // Debugging
    }
});


// --- PENGATURAN LAIN / GLOBAL ---
// Memastikan ScrollTrigger menghitung ulang posisi dan trigger setelah semua konten dimuat.
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});

// Anda mungkin memiliki elemen dengan kelas .element-delay-0-5.
// Ini tidak akan ditangani oleh getDelayValue() yang saat ini hanya iterasi integer.
// Jika Anda memang menggunakan .element-delay-0-5, Anda perlu menambahkannya secara manual
// ke properti delay pada elemen yang memilikinya, atau menyesuaikan fungsi getDelayValue
// untuk menangani nilai float.
// Untuk saat ini, saya hanya menambahkan catatan ini. Jika Anda menggunakannya dan itu tidak berfungsi,
// Anda perlu menambahkan logika untuk itu. Contoh:
/*
gsap.utils.toArray(".element-delay-0-5").forEach(element => {
    // Terapkan animasi spesifik untuk elemen ini atau setel delay secara manual 
    gsap.from(element, {
        opacity: 0,
        y: 20, // Contoh
        duration: 0.8,
        delay: 0.5, // Delay manual 0.5 detik
        scrollTrigger: {
            trigger: element,
            start: "top 90%",
            toggleActions: "play none none reverse",
        }
    });
});
*/
