"use strict";
/* Data: atribut, pertanyaan, tips latihan, dan daftar peran */

const ATT = [
  ["speed","Kecepatan","Fisik","Lari cepat saat mengejar bola atau masuk ke ruang."],
  ["stamina","Stamina","Fisik","Menjaga intensitas sampai menit terakhir."],
  ["strength","Kekuatan","Fisik","Bertahan dari benturan dan menahan lawan."],
  ["control","Kontrol bola","Teknik","Menjinakkan bola dengan baik saat ditekan."],
  ["pass","Umpan","Teknik","Ketepatan umpan pendek maupun panjang."],
  ["drib","Dribbling","Teknik","Melewati lawan dengan bola di kaki."],
  ["shoot","Tembakan","Teknik","Tenaga dan arah tembakan dari luar kotak."],
  ["finish","Penyelesaian akhir","Teknik","Tenang saat berhadapan dengan gawang."],
  ["aerial","Duel udara","Teknik","Memenangi sundulan dan bola atas."],
  ["tackle","Tekel dan duel","Bertahan","Merebut bola dari lawan secara bersih."],
  ["read","Membaca permainan","Bertahan","Menebak arah umpan dan memutus serangan."],
  ["vision","Melihat ruang","Mental","Sadar posisi rekan dan ruang kosong sebelum menerima bola."],
  ["decide","Keputusan","Mental","Memilih opsi yang tepat dalam waktu singkat."],
  ["offball","Gerakan tanpa bola","Mental","Mencari posisi yang memudahkan rekan memberi bola."],
  ["calm","Ketenangan","Mental","Tetap tenang saat ditekan atau di depan gawang."]
];

const TR = {build:"Membangun serangan",direct:"Progresi langsung",create:"Menciptakan peluang",finish:"Mengejar gol",press:"Menekan lawan",protect:"Menjaga struktur",wide:"Bermain lebar"};

const Q = [
  {q:"Kamu menerima bola di tengah lapangan dan lawan mulai mendekat. Apa yang paling sering kamu lakukan?",o:[
    ["Langsung mengoper satu atau dua sentuhan, lalu mencari ruang baru",{build:2}],
    ["Menahan bola dan memutar badan untuk membuka arah umpan",{create:2,build:1}],
    ["Membawa bola maju sendiri melewati lawan",{direct:2,create:1}],
    ["Mengirim bola jauh ke sisi lapangan",{wide:2,direct:1}]]},
  {q:"Timmu baru kehilangan bola. Apa reaksi pertamamu?",o:[
    ["Menekan pemain yang membawa bola secepat mungkin",{press:2}],
    ["Mundur ke posisi dan menjaga jarak dengan rekan",{protect:2}],
    ["Menutup jalur umpan ke pemain yang berbahaya",{protect:1,press:1}],
    ["Berlari kembali ke area sendiri untuk membantu bertahan",{protect:2,wide:1}]]},
  {q:"Saat timmu menyerang, di mana kamu paling sering berada?",o:[
    ["Di dalam atau di tepi kotak penalti",{finish:2}],
    ["Di sisi lapangan, dekat garis",{wide:2}],
    ["Di antara lini tengah dan lini serang",{create:2}],
    ["Di belakang bola, siap menutup serangan balik",{protect:2,build:1}]]},
  {q:"Kamu punya peluang menembak dari luar kotak, sementara rekan terbuka di dekat gawang.",o:[
    ["Menembak sendiri",{finish:2}],
    ["Mengoper ke rekan yang terbuka",{create:2}],
    ["Menggeser bola dulu untuk mencari posisi lebih baik",{build:1,create:1}]]},
  {q:"Bagian pertandingan mana yang paling kamu nikmati?",o:[
    ["Tekel bersih atau memutus umpan lawan",{protect:2,press:1}],
    ["Mengirim umpan yang membelah pertahanan",{create:2,direct:1}],
    ["Mencetak gol",{finish:2}],
    ["Mengatur tempo sampai tim terasa tenang",{build:2}],
    ["Melewati lawan satu lawan satu",{direct:1,wide:1,create:1}]]},
  {q:"Ke mana kamu bergerak saat tidak memegang bola dan tim sedang menyerang?",o:[
    ["Berlari ke ruang di belakang bek lawan",{direct:2,finish:1}],
    ["Turun menjemput bola ke kaki",{build:2}],
    ["Melebar untuk memberi ruang bagi rekan",{wide:2}],
    ["Tetap di posisi untuk menjaga keseimbangan tim",{protect:2}]]},
  {q:"Timmu merebut bola saat tertinggal satu gol. Apa yang kamu lakukan?",o:[
    ["Segera mencari umpan vertikal ke depan",{direct:2}],
    ["Mengamankan bola lebih dulu, lalu membangun serangan",{build:2}],
    ["Berlari maju menawarkan diri sebagai target",{finish:1,wide:1,direct:1}]]},
  {q:"Dari 10 peluang, berapa kali kamu memilih menembak sendiri?",s:1,t:{finish:2}},
  {q:"Dari 10 serangan timmu, berapa kali kamu ikut maju melewati garis bola?",s:1,t:{direct:1,create:1}},
  {q:"Dari 10 bola lepas, berapa kali kamu ikut menekan atau mengejarnya?",s:1,t:{press:2}}
];

const TIPS = {
  speed:"Sprint 20 sampai 30 meter sebanyak 6 kali, dua kali seminggu, dengan istirahat penuh antar ulangan.",
  stamina:"Lari interval 4 menit cepat dan 3 menit pelan sebanyak 4 set, dua kali seminggu.",
  strength:"Latihan squat, lunge, dan plank tiga kali seminggu, ditambah latihan berebut bola bahu ke bahu.",
  control:"Terima bola dari tembok dengan satu sentuhan, lalu arahkan ke kaki lain. Lakukan 10 menit setiap latihan.",
  pass:"Umpan pendek ke dua sasaran bergantian, lalu tambah jarak sampai 30 meter. Catat berapa yang tepat sasaran.",
  drib:"Susun lima kun dengan jarak dekat dan giring dengan kedua kaki, lalu tambahkan lawan pasif.",
  shoot:"Tembakan dari tepi kotak dengan bola bergulir, 20 kali per sesi, bidik dua sudut gawang.",
  finish:"Latihan satu lawan satu dengan kiper. Tunda sepersekian detik, lihat posisi kiper, lalu selesaikan.",
  aerial:"Latihan lompatan dengan tolakan satu kaki dan sundulan dari umpan silang, 15 ulangan.",
  tackle:"Latihan satu lawan satu bertahan. Jaga jarak, arahkan lawan ke sisi lemahnya, tekel hanya saat bola menjauh dari kaki.",
  read:"Tonton satu pertandingan dengan fokus pada satu pemain bertahan, lalu catat kapan ia memutus umpan dan mengapa.",
  vision:"Sebelum menerima bola, tengok bahu dua kali dan sebutkan posisi rekan dalam hati. Biasakan di setiap latihan.",
  decide:"Rondo empat lawan dua dengan batas dua sentuhan, supaya keputusan harus cepat.",
  offball:"Latihan gerakan lari palsu lalu berpindah ke ruang kosong. Minta rekan memberi umpan tepat saat kamu bergerak.",
  calm:"Latihan menerima bola dengan tekanan pasif lalu aktif. Tarik napas dan turunkan tempo saat panik."
};

const ROLES = [
  {n:"Kiper Pembangun Serangan",pos:"Kiper",w:{control:2,pass:3,calm:3,vision:2,decide:2},t:{build:2,protect:1},m:["Ederson","Manuel Neuer","Alisson Becker","Marc-Andre ter Stegen","Mike Maignan","Andre Onana"],d:"Kamu melihat kiper sebagai pemain pertama dalam membangun serangan, bukan hanya penjaga gawang."},
  {n:"Bek Penjaga Area",pos:"Bek Tengah",tall:1,w:{tackle:3,aerial:3,strength:3,read:2,calm:1},t:{protect:3},m:["Virgil van Dijk","Kalidou Koulibaly","Antonio Rudiger","Gabriel Magalhaes","Ruben Dias"],d:"Kamu menang lewat duel, sundulan, dan posisi. Fokusmu menjaga kotak penalti tetap aman."},
  {n:"Bek Pembawa Bola",pos:"Bek Tengah",w:{pass:3,control:2,calm:3,vision:2,read:2},t:{build:2,protect:1},m:["John Stones","Alessandro Bastoni","Aymeric Laporte","Josko Gvardiol","William Saliba","Pau Cubarsi"],d:"Kamu nyaman memulai serangan dari belakang dan berani membawa atau mengumpan bola melewati garis lawan."},
  {n:"Bek Sayap Menyerang",pos:"Bek Sayap",w:{speed:3,stamina:3,drib:2,pass:2,offball:1},t:{wide:3,direct:1},m:["Achraf Hakimi","Trent Alexander-Arnold","Alphonso Davies","Theo Hernandez","Andrew Robertson"],d:"Kamu naik jauh di sisi lapangan dan menjadi sumber lebar bagi timmu."},
  {n:"Bek Sayap Bertahan",pos:"Bek Sayap",w:{tackle:3,read:3,stamina:2,speed:2,strength:1},t:{protect:2,press:1,wide:1},m:["Kyle Walker","Dani Carvajal","Kieran Trippier","Ben White","Reece James"],d:"Kamu menjaga sisi lapangan dengan disiplin dan cepat pulih setelah timmu kehilangan bola."},
  {n:"Perebut Bola",pos:"Gelandang Bertahan",w:{tackle:3,read:3,stamina:2,strength:2,speed:1},t:{press:3,protect:1},m:["N'Golo Kante","Casemiro","Declan Rice","Sandro Tonali","Wilfred Ndidi","Fabinho"],d:"Kamu memutus serangan lawan lewat tekanan, duel, dan energi tanpa henti di lini tengah."},
  {n:"Pengatur Tempo",pos:"Gelandang Bertahan",w:{pass:3,vision:3,calm:3,decide:2,control:2},t:{build:3,protect:1},m:["Rodri","Sergio Busquets","Joshua Kimmich","Marco Verratti","Andrea Pirlo"],d:"Kamu mengatur ritme dari kedalaman, menjaga bola tetap mengalir, dan menutup ruang di depan bek."},
  {n:"Gelandang Pekerja Dua Arah",pos:"Gelandang Tengah",w:{stamina:3,tackle:2,offball:2,pass:2,strength:2},t:{press:2,direct:1,build:1},m:["Federico Valverde","Nicolo Barella","Alexis Mac Allister","Bruno Guimaraes","Jude Bellingham"],d:"Kamu hadir di dua kotak penalti. Energimu menghubungkan bertahan dan menyerang."},
  {n:"Pengatur Permainan",pos:"Gelandang Tengah",w:{pass:3,vision:3,decide:2,control:3,calm:2},t:{build:2,create:2},m:["Luka Modric","Toni Kroos","Xavi Hernandez","Andres Iniesta","Frenkie de Jong","Pedri"],d:"Kamu adalah pusat kendali tim. Sentuhanmu menentukan ke mana bola bergerak berikutnya."},
  {n:"Pencipta Peluang",pos:"Gelandang Serang",w:{vision:3,pass:3,decide:2,control:2,drib:2},t:{create:3,build:1},m:["Martin Odegaard","Kevin De Bruyne","Bruno Fernandes","Jamal Musiala","Florian Wirtz"],d:"Kamu bermain di ruang antar lini dan mengubah bola biasa menjadi peluang berbahaya."},
  {n:"Winger Penggiring",pos:"Winger",w:{speed:3,drib:3,control:2,offball:2,shoot:1},t:{wide:2,direct:2},m:["Vinicius Junior","Bukayo Saka","Lamine Yamal","Rafael Leao","Jeremy Doku","Mohamed Salah"],d:"Kamu mengandalkan kecepatan dan dribbling untuk membuat lawan panik satu lawan satu."},
  {n:"Penyerang Target",pos:"Penyerang",tall:1,w:{aerial:3,strength:3,finish:3,calm:2,control:1},t:{finish:3},m:["Olivier Giroud","Romelu Lukaku","Dusan Vlahovic","Ivan Toney","Alexander Sorloth"],d:"Kamu menjadi titik tumpu serangan. Bola atas, tahanan badan, dan penyelesaian di kotak penalti adalah senjatamu."},
  {n:"Penyerang Pencari Ruang",pos:"Penyerang",w:{offball:3,speed:3,finish:3,shoot:2,decide:2},t:{finish:2,direct:2},m:["Erling Haaland","Kylian Mbappe","Victor Osimhen","Jamie Vardy","Alexander Isak"],d:"Kamu hidup dari pergerakan. Kamu membaca celah di belakang bek dan tiba tepat waktu."},
  {n:"Penyerang Turun Menjemput Bola",pos:"Penyerang",w:{control:3,pass:3,vision:3,decide:2,finish:2},t:{create:2,build:1,finish:1},m:["Harry Kane","Karim Benzema","Robert Lewandowski","Roberto Firmino","Lionel Messi"],d:"Kamu turun ke tengah untuk terlibat dalam permainan, lalu membuka ruang bagi rekan yang menyerang di belakang bek."}
];

