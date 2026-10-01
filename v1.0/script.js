// ==========================================
// FOOTBALL PLAYER ANALYZER v1.0
// ==========================================


// ==========================================
// DATA ATRIBUT
// ==========================================

const attributes = [
    "Kecepatan",
    "Stamina",
    "Kekuatan",
    "Kontrol Bola",
    "Umpan",
    "Dribbling",
    "Tembakan",
    "Penyelesaian Peluang",
    "Kemampuan Bertahan",
    "Melihat Ruang",
    "Pengambilan Keputusan",
    "Gerakan Tanpa Bola"
];


const attributeIds = [
    "speed",
    "stamina",
    "strength",
    "ballControl",
    "passing",
    "dribbling",
    "shooting",
    "finishing",
    "defending",
    "vision",
    "decision",
    "movement"
];


// ==========================================
// ROLE MODEL
// ==========================================

const roleModels = {

    "Kiper Modern": {
        main: "Ederson",
        alternatives: [
            "Alisson",
            "Manuel Neuer"
        ],
        profile: [4,4,4,5,5,2,2,2,4,5,5,3]
    },


    "Bek Pembawa Bola": {
        main: "Virgil van Dijk",
        alternatives: [
            "Ruben Dias",
            "William Saliba"
        ],
        profile: [4,4,5,4,5,2,3,3,5,5,5,4]
    },


    "Bek Sayap Menyerang": {
        main: "Achraf Hakimi",
        alternatives: [
            "Trent Alexander-Arnold",
            "Theo Hernandez"
        ],
        profile: [5,5,4,4,4,4,3,3,4,5,4,5]
    },


    "Pengatur Permainan dari Belakang": {
        main: "Rodri",
        alternatives: [
            "Joshua Kimmich",
            "Jorginho"
        ],
        profile: [3,5,5,5,5,3,4,3,5,5,5,4]
    },


    "Perebut Bola": {
        main: "N'Golo Kante",
        alternatives: [
            "Casemiro",
            "Claude Makelele"
        ],
        profile: [5,5,3,4,4,4,2,2,5,4,5,5]
    },


    "Pengatur Permainan": {
        main: "Luka Modric",
        alternatives: [
            "Toni Kroos",
            "Bernardo Silva"
        ],
        profile: [4,5,3,5,5,4,4,3,3,5,5,5]
    },


    "Pencipta Peluang": {
        main: "Martin Ødegaard",
        alternatives: [
            "Kevin De Bruyne",
            "Bruno Fernandes"
        ],
        profile: [3,5,3,5,5,4,4,4,3,5,5,5]
    },


    "Winger Penyerang": {
        main: "Mohamed Salah",
        alternatives: [
            "Bukayo Saka",
            "Son Heung-min"
        ],
        profile: [5,5,3,5,5,5,5,5,2,5,5,5]
    },


    "Penyerang Pencari Ruang": {
        main: "Erling Haaland",
        alternatives: [
            "Kylian Mbappé",
            "Robert Lewandowski"
        ],
        profile: [5,5,5,4,3,3,5,5,3,5,5,5]
    }

};


// ==========================================
// MENGAMBIL NILAI PEMAIN
// ==========================================

function getPlayerRatings() {

    return attributeIds.map(id => {

        let value = Number(
            document.getElementById(id).value
        );

        // Memastikan nilai tetap 1-5

        if (value < 1) value = 1;
        if (value > 5) value = 5;

        return value;

    });

}


// ==========================================
// MENGHITUNG KEMIRIPAN
// ==========================================

function calculateSimilarity(player, model) {

    let totalDifference = 0;

    for (let i = 0; i < player.length; i++) {

        totalDifference += Math.abs(
            player[i] - model[i]
        );

    }


    const maximumDifference =
        player.length * 4;


    return Math.round(
        (1 - totalDifference / maximumDifference) * 100
    );

}


// ==========================================
// MENCARI ATRIBUT PALING MIRIP
// ==========================================

function findSimilarities(player, model) {

    const differences = attributes.map(
        (name, index) => ({
            name: name,
            difference: Math.abs(
                player[index] - model[index]
            )
        })
    );


    differences.sort(
        (a, b) => a.difference - b.difference
    );


    return differences.slice(0, 3);

}


// ==========================================
// MENCARI PERBEDAAN TERBESAR
// ==========================================

function findDifferences(player, model) {

    const differences = attributes.map(
        (name, index) => ({
            name: name,
            difference: Math.abs(
                player[index] - model[index]
            )
        })
    );


    differences.sort(
        (a, b) => b.difference - a.difference
    );


    return differences.slice(0, 3);

}


// ==========================================
// ANALISIS POSISI
// ==========================================

function calculatePositions(player, height) {

    const [
        speed,
        stamina,
        strength,
        control,
        passing,
        dribbling,
        shooting,
        finishing,
        defending,
        vision,
        decision,
        movement
    ] = player;


    const scores = {};


    // KIPER

    scores["Kiper"] =
        control +
        passing +
        decision +
        vision +
        defending;


    // BEK TENGAH

    scores["Bek Tengah"] =
        strength * 2 +
        defending * 3 +
        decision * 2 +
        vision +
        control;


    if (height >= 180) {
        scores["Bek Tengah"] += 3;
    }


    // BEK SAYAP

    scores["Bek Sayap"] =
        speed * 2 +
        stamina * 2 +
        defending * 2 +
        passing +
        dribbling +
        movement * 2;


    // GELANDANG BERTAHAN

    scores["Gelandang Bertahan"] =
        defending * 2 +
        passing * 2 +
        vision * 2 +
        decision * 2 +
        stamina +
        control;


    // GELANDANG TENGAH

    scores["Gelandang Tengah"] =
        passing * 2 +
        vision * 2 +
        decision * 2 +
        control * 2 +
        stamina +
        movement;


    // GELANDANG SERANG

    scores["Gelandang Serang"] =
        vision * 2 +
        decision * 2 +
        dribbling * 2 +
        shooting +
        finishing +
        control * 2 +
        movement * 2;


    // WINGER

    scores["Winger"] =
        speed * 2 +
        dribbling * 3 +
        shooting +
        finishing +
        passing +
        movement * 2 +
        stamina;


    // STRIKER

    scores["Striker"] =
        finishing * 3 +
        shooting * 2 +
        movement * 2 +
        strength +
        speed +
        decision +
        control;


    return scores;

}


// ==========================================
// BONUS BERDASARKAN KEBIASAAN
// ==========================================

function applyStyleBonus(scores) {

    const attack =
        document.getElementById("attackHabit").value;


    const defense =
        document.getElementById("defendingHabit").value;


    const style =
        document.getElementById("style").value;


    // ATTACKING HABIT

    if (attack === "passing") {
        scores["Gelandang Tengah"] += 4;
        scores["Gelandang Bertahan"] += 3;
    }


    if (attack === "carry") {
        scores["Gelandang Tengah"] += 3;
        scores["Gelandang Serang"] += 3;
    }


    if (attack === "findSpace") {
        scores["Gelandang Serang"] += 4;
        scores["Gelandang Tengah"] += 3;
    }


    if (attack === "dribble") {
        scores["Winger"] += 5;
        scores["Gelandang Serang"] += 3;
    }


    if (attack === "shoot") {
        scores["Striker"] += 5;
        scores["Gelandang Serang"] += 3;
    }


    // DEFENDING HABIT

    if (defense === "press") {
        scores["Winger"] += 2;
        scores["Bek Sayap"] += 2;
        scores["Gelandang Bertahan"] += 2;
    }


    if (defense === "return") {
        scores["Bek Tengah"] += 3;
        scores["Bek Sayap"] += 3;
    }


    if (defense === "passingLane") {
        scores["Gelandang Bertahan"] += 4;
        scores["Bek Tengah"] += 3;
    }


    if (defense === "ballCarrier") {
        scores["Bek Sayap"] += 3;
        scores["Bek Tengah"] += 2;
    }


    // PREFERRED STYLE

    if (style === "control") {
        scores["Gelandang Tengah"] += 5;
        scores["Gelandang Serang"] += 3;
    }


    if (style === "defense") {
        scores["Gelandang Bertahan"] += 5;
        scores["Bek Tengah"] += 3;
    }


    if (style === "build") {
        scores["Bek Sayap"] += 3;
        scores["Gelandang Tengah"] += 4;
    }


    if (style === "wing") {
        scores["Winger"] += 5;
        scores["Bek Sayap"] += 3;
    }


    if (style === "box") {
        scores["Striker"] += 4;
        scores["Gelandang Serang"] += 4;
    }


    if (style === "last") {
        scores["Bek Tengah"] += 5;
        scores["Kiper"] += 2;
    }


    return scores;

}


// ==========================================
// MENENTUKAN ROLE
// ==========================================

function determineRole(position, player) {

    const passing = player[4];
    const vision = player[9];


    const roles = {

        "Kiper": "Kiper Modern",

        "Bek Tengah": "Bek Pembawa Bola",

        "Bek Sayap": "Bek Sayap Menyerang",

        "Gelandang Tengah": "Pengatur Permainan",

        "Gelandang Serang": "Pencipta Peluang",

        "Winger": "Winger Penyerang",

        "Striker": "Penyerang Pencari Ruang"

    };


    if (position === "Gelandang Bertahan") {

        if (
            passing >= 4 &&
            vision >= 4
        ) {

            return "Pengatur Permainan dari Belakang";

        } else {

            return "Perebut Bola";

        }

    }


    return roles[position];

}


// ==========================================
// ANALISIS UTAMA
// ==========================================

function analyzePlayer() {

    const name =
        document.getElementById("playerName").value
        || "Unnamed Player";


    const height =
        Number(
            document.getElementById("height").value
        )
        || 170;


    const foot =
        document.getElementById("foot").value;


    const player =
        getPlayerRatings();


    // HITUNG POSISI

    let positionScores =
        calculatePositions(
            player,
            height
        );


    // TAMBAHKAN BONUS

    positionScores =
        applyStyleBonus(
            positionScores
        );


    // URUTKAN POSISI

    const ranking =
        Object.entries(positionScores)
        .sort(
            (a, b) => b[1] - a[1]
        );


    const mainPosition =
        ranking[0][0];


    const mainRole =
        determineRole(
            mainPosition,
            player
        );


    // TAMPILKAN HASIL

    document.getElementById("result")
        .classList.remove("hidden");


    document.getElementById("resultName")
        .textContent = name;


    document.getElementById("resultInfo")
        .textContent =
        `${height} cm • Kaki dominan ${foot}`;


    document.getElementById("mainPosition")
        .textContent = mainPosition;


    document.getElementById("mainRole")
        .textContent = mainRole;


    renderAttributes(player);

    renderPositions(ranking);

    renderRoleModel(
        mainRole,
        player
    );

    renderStrengths(player);

    renderSuggestions(player);


    // Scroll ke hasil

    document.getElementById("result")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ==========================================
// RENDER ATRIBUT
// ==========================================

function renderAttributes(player) {

    const container =
        document.getElementById(
            "attributeResults"
        );


    container.innerHTML = "";


    player.forEach((value, index) => {

        const percentage =
            (value / 5) * 100;


        container.innerHTML += `

            <div class="attribute-result">

                <div class="attribute-header">

                    <span>
                        ${attributes[index]}
                    </span>

                    <strong>
                        ${value}/5
                    </strong>

                </div>

                <div class="bar-background">

                    <div
                        class="bar-fill"
                        style="width: ${percentage}%"
                    ></div>

                </div>

            </div>

        `;

    });

}


// ==========================================
// RENDER POSISI
// ==========================================

function renderPositions(ranking) {

    const container =
        document.getElementById(
            "positionResults"
        );


    container.innerHTML = "";


    ranking.forEach(
        ([position, score], index) => {

            container.innerHTML += `

                <div class="position-item">

                    <div class="position-name">

                        <span>
                            #${index + 1}
                            ${position}
                        </span>

                        <span class="position-score">
                            ${score} poin
                        </span>

                    </div>

                </div>

            `;

        }
    );

}


// ==========================================
// RENDER ROLE MODEL
// ==========================================

function renderRoleModel(role, player) {

    const container =
        document.getElementById(
            "roleModel"
        );


    const model =
        roleModels[role];


    if (!model) {

        container.innerHTML =
            "<p>Role model belum tersedia.</p>";

        return;

    }


    const similarity =
        calculateSimilarity(
            player,
            model.profile
        );


    const similarities =
        findSimilarities(
            player,
            model.profile
        );


    const differences =
        findDifferences(
            player,
            model.profile
        );


    container.innerHTML = `

        <div class="model-box">

            <div class="model-avatar">
                ⚽
            </div>

            <div class="model-info">

                <h3>
                    ${model.main}
                </h3>

                <p class="similarity">
                    Kemiripan gaya:
                    <strong>
                        ${similarity}%
                    </strong>
                </p>

            </div>

        </div>


        <br>


        <h3>Kesamaan utama</h3>

        <p>
            ${similarities
                .map(item => item.name)
                .join(", ")}
        </p>


        <br>


        <h3>Perbedaan utama</h3>

        <p>
            ${differences
                .map(item => item.name)
                .join(", ")}
        </p>


        <br>


        <h3>Alternatif role model</h3>

        <p>
            ${model.alternatives.join(", ")}
        </p>

    `;

}


// ==========================================
// RENDER KEKUATAN
// ==========================================

function renderStrengths(player) {

    const container =
        document.getElementById(
            "strengthResults"
        );


    const strengths =
        attributes.map(
            (name, index) => ({
                name: name,
                value: player[index]
            })
        )
        .sort(
            (a, b) => b.value - a.value
        )
        .slice(0, 5);


    container.innerHTML =
        `<div class="strength-list">

            ${
                strengths.map(
                    item => `

                    <div class="strength-item">

                        <strong>
                            ${item.name}
                        </strong>

                        <span>
                            ${item.value}/5
                        </span>

                    </div>

                    `
                ).join("")
            }

        </div>`;

}


// ==========================================
// RENDER SARAN
// ==========================================

function renderSuggestions(player) {

    const container =
        document.getElementById(
            "suggestionResults"
        );


    const suggestions = [];


    player.forEach(
        (value, index) => {

            if (value <= 2) {

                suggestions.push(
                    `Tingkatkan ${attributes[index]} karena masih menjadi kelemahan.`
                );

            } else if (value === 3) {

                suggestions.push(
                    `Kembangkan ${attributes[index]} agar permainan lebih konsisten.`
                );

            }

        }
    );


    if (suggestions.length === 0) {

        suggestions.push(
            "Kemampuanmu cukup merata. Fokus pada satu atau dua kelebihan utama."
        );

    }


    container.innerHTML =
        `<div class="suggestion-list">

            ${
                suggestions.map(
                    suggestion => `

                    <div class="suggestion-item">
                        ${suggestion}
                    </div>

                    `
                ).join("")
            }

        </div>`;

}