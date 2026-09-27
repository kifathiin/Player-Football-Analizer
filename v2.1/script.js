/* ==========================================
   FOOTBALL PLAYER ANALYZER
   VERSION 2.1
   ========================================== */


/* ==========================================
   ATTRIBUTE SYSTEM
   ========================================== */

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


let radarChart = null;


/* ==========================================
   ROLE MODELS
   ========================================== */

const roleModels = {

    "Kiper Modern": {
        name: "Ederson",
        alternatives: [
            "Alisson",
            "Manuel Neuer"
        ],
        profile: [4,4,4,5,5,2,2,2,4,5,5,3]
    },

    "Bek Pembawa Bola": {
        name: "Virgil van Dijk",
        alternatives: [
            "Ruben Dias",
            "William Saliba"
        ],
        profile: [4,4,5,4,5,2,3,3,5,5,5,4]
    },

    "Bek Sayap Menyerang": {
        name: "Achraf Hakimi",
        alternatives: [
            "Trent Alexander-Arnold",
            "Theo Hernandez"
        ],
        profile: [5,5,4,4,4,4,3,3,4,5,4,5]
    },

    "Pengatur Permainan dari Belakang": {
        name: "Rodri",
        alternatives: [
            "Joshua Kimmich",
            "Jorginho"
        ],
        profile: [3,5,5,5,5,3,4,3,5,5,5,4]
    },

    "Perebut Bola": {
        name: "N'Golo Kante",
        alternatives: [
            "Casemiro",
            "Claude Makelele"
        ],
        profile: [5,5,3,4,4,4,2,2,5,4,5,5]
    },

    "Pengatur Permainan": {
        name: "Luka Modric",
        alternatives: [
            "Toni Kroos",
            "Bernardo Silva"
        ],
        profile: [4,5,3,5,5,4,4,3,3,5,5,5]
    },

    "Pencipta Peluang": {
        name: "Martin Ødegaard",
        alternatives: [
            "Kevin De Bruyne",
            "Bruno Fernandes"
        ],
        profile: [3,5,3,5,5,4,4,4,3,5,5,5]
    },

    "Winger Penyerang": {
        name: "Mohamed Salah",
        alternatives: [
            "Bukayo Saka",
            "Son Heung-min"
        ],
        profile: [5,5,3,5,5,5,5,5,2,5,5,5]
    },

    "Penyerang Pencari Ruang": {
        name: "Erling Haaland",
        alternatives: [
            "Kylian Mbappé",
            "Robert Lewandowski"
        ],
        profile: [5,5,5,4,3,3,5,5,3,5,5,5]
    }

};


/* ==========================================
   POSITION SCORING
   ========================================== */

function calculatePositions(a, height) {

    const scores = {

        "Kiper":
            a[3] +
            a[4] +
            a[10] +
            a[9] +
            a[8],

        "Bek Tengah":
            a[2] * 2 +
            a[8] * 3 +
            a[10] * 2 +
            a[9] +
            a[3] +
            (height >= 180 ? 3 : 0),

        "Bek Sayap":
            a[0] * 2 +
            a[1] * 2 +
            a[8] * 2 +
            a[4] +
            a[5] +
            a[11] * 2,

        "Gelandang Bertahan":
            a[8] * 2 +
            a[4] * 2 +
            a[9] * 2 +
            a[10] * 2 +
            a[1] +
            a[3],

        "Gelandang Tengah":
            a[4] * 2 +
            a[9] * 2 +
            a[10] * 2 +
            a[3] * 2 +
            a[1] +
            a[11],

        "Gelandang Serang":
            a[9] * 2 +
            a[10] * 2 +
            a[5] * 2 +
            a[6] +
            a[7] +
            a[3] * 2 +
            a[11] * 2,

        "Winger":
            a[0] * 2 +
            a[5] * 3 +
            a[6] +
            a[7] +
            a[4] +
            a[11] * 2 +
            a[1],

        "Striker":
            a[7] * 3 +
            a[6] * 2 +
            a[11] * 2 +
            a[2] +
            a[0] +
            a[10] +
            a[3]

    };

    return scores;
}


/* ==========================================
   STYLE BONUSES
   ========================================== */

function applyStyleBonuses(scores, attack, defense, style) {

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


/* ==========================================
   ROLE MAPPING
   ========================================== */

function getRole(position, attributes) {

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
            attributes[4] >= 4 &&
            attributes[9] >= 4
        ) {

            return "Pengatur Permainan dari Belakang";

        }

        return "Perebut Bola";
    }


    return roles[position] || "Pengatur Permainan";
}


/* ==========================================
   SIMILARITY
   ========================================== */

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


/* ==========================================
   ATTRIBUTE SIMILARITY
   ========================================== */

function findSimilarities(player, model) {

    return player
        .map((value, index) => ({
            name: attributes[index],
            difference: Math.abs(value - model[index])
        }))
        .sort((a, b) =>
            a.difference - b.difference
        )
        .slice(0, 3);
}


function findDifferences(player, model) {

    return player
        .map((value, index) => ({
            name: attributes[index],
            difference: Math.abs(value - model[index])
        }))
        .sort((a, b) =>
            b.difference - a.difference
        )
        .slice(0, 3);
}


/* ==========================================
   FOOTBALL IDENTITY
   ========================================== */

function getIdentity(position, style, attack) {

    const identityMap = {

        "Kiper": {
            role: "MODERN GOALKEEPER",
            description:
                "Kamu cenderung memengaruhi permainan dari lini terakhir melalui distribusi bola, kontrol dan pengambilan keputusan.",
            tags: [
                "DISTRIBUTOR",
                "LAST LINE",
                "BUILD-UP"
            ]
        },

        "Bek Tengah": {
            role: "DEFENSIVE ORGANIZER",
            description:
                "Profilmu menunjukkan kecenderungan membaca situasi, menjaga struktur dan mengamankan area pertahanan.",
            tags: [
                "DEFENSIVE",
                "POSITIONAL",
                "ORGANIZER"
            ]
        },

        "Bek Sayap": {
            role: "TWO-WAY FULLBACK",
            description:
                "Kamu memiliki kecenderungan membantu kedua fase permainan, dari progresi bola hingga transisi bertahan.",
            tags: [
                "OVERLAP",
                "TRANSITION",
                "WIDTH"
            ]
        },

        "Gelandang Bertahan": {
            role: "MIDFIELD ANCHOR",
            description:
                "Kamu cenderung menjaga keseimbangan tim melalui positioning, duel dan distribusi dari area tengah.",
            tags: [
                "BALANCE",
                "SCREEN",
                "RECOVERY"
            ]
        },

        "Gelandang Tengah": {
            role: "GAME CONTROLLER",
            description:
                "Profilmu menunjukkan kecenderungan mengontrol tempo melalui passing, ruang dan keputusan di lini tengah.",
            tags: [
                "CONTROL",
                "PASSING",
                "TEMPO"
            ]
        },

        "Gelandang Serang": {
            role: "CHANCE CREATOR",
            description:
                "Kamu cenderung mencari ruang untuk menciptakan peluang melalui vision, passing dan keputusan progresif.",
            tags: [
                "CREATIVE",
                "VISION",
                "CREATION"
            ]
        },

        "Winger": {
            role: "ATTACKING WINGER",
            description:
                "Profilmu cenderung mengandalkan progresi dari area lebar, dribbling dan ancaman langsung ke pertahanan lawan.",
            tags: [
                "DIRECT",
                "DRIBBLE",
                "WIDTH"
            ]
        },

        "Striker": {
            role: "SPACE HUNTER",
            description:
                "Kamu cenderung mencari ruang berbahaya dan mengubah pergerakan menjadi peluang mencetak gol.",
            tags: [
                "MOVEMENT",
                "FINISHING",
                "THREAT"
            ]
        }

    };


    let result = identityMap[position];


    if (!result) {

        result = {
            role: "VERSATILE PLAYER",
            description:
                "Profilmu memiliki beberapa karakter permainan yang saling melengkapi.",
            tags: [
                "VERSATILE",
                "ADAPTIVE",
                "BALANCED"
            ]
        };

    }


    return result;
}


/* ==========================================
   ANALYZE PLAYER
   ========================================== */

function analyzePlayer() {

    const name =
        document.getElementById("playerName").value.trim()
        || "PLAYER";


    const height =
        Number(
            document.getElementById("height").value
        ) || 170;


    const foot =
        document.getElementById("foot").value;


    const playerAttributes =
        attributeIds.map(id => {

            const value =
                Number(
                    document.getElementById(id).value
                );

            return Math.min(
                Math.max(value || 1, 1),
                5
            );

        });


    const attack =
        document.getElementById("attackHabit").value;


    const defense =
        document.getElementById("defendingHabit").value;


    const style =
        document.getElementById("style").value;


    let positionScores =
        calculatePositions(
            playerAttributes,
            height
        );


    positionScores =
        applyStyleBonuses(
            positionScores,
            attack,
            defense,
            style
        );


    const sortedPositions =
        Object.entries(positionScores)
            .sort((a, b) => b[1] - a[1]);


    const mainPosition =
        sortedPositions[0][0];


    const role =
        getRole(
            mainPosition,
            playerAttributes
        );


    const identity =
        getIdentity(
            mainPosition,
            style,
            attack
        );


    /* SHOW RESULT */

    const result =
        document.getElementById("result");


    result.style.display = "block";


    document.getElementById("resultName")
        .textContent = name.toUpperCase();


    document.getElementById("resultInfo")
        .textContent =
        `${height} CM / ${foot.toUpperCase()} FOOT`;


    document.getElementById("mainPosition")
        .textContent =
        mainPosition.toUpperCase();


    document.getElementById("mainRole")
        .textContent =
        role.toUpperCase();


    /* IDENTITY */

    document.getElementById("identityRole")
        .textContent =
        identity.role;


    document.getElementById("identityDescription")
        .textContent =
        identity.description;


    const tagContainer =
        document.getElementById("identityTags");


    tagContainer.innerHTML = "";


    identity.tags.forEach(tag => {

        const tagElement =
            document.createElement("div");

        tagElement.className =
            "identity-tag";

        tagElement.textContent =
            tag;

        tagContainer.appendChild(
            tagElement
        );

    });


    /* RENDER */

    renderRadar(playerAttributes);

    renderAttributes(playerAttributes);

    renderPositions(sortedPositions);

    renderRoleModel(
        role,
        playerAttributes
    );

    renderStrengths(playerAttributes);

    renderSuggestions(playerAttributes);


    /* SCROLL */

    setTimeout(() => {

        result.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);


    /* REVEAL */

    setTimeout(() => {

        activateReveal();

    }, 150);
}


/* ==========================================
   RADAR
   ========================================== */

function renderRadar(data) {

    const canvas =
        document.getElementById("radarChart");


    if (radarChart) {

        radarChart.destroy();

    }


    radarChart =
        new Chart(
            canvas,
            {

                type: "radar",

                data: {

                    labels: [
                        "Speed",
                        "Stamina",
                        "Strength",
                        "Control",
                        "Passing",
                        "Dribbling",
                        "Shooting",
                        "Finishing",
                        "Defending",
                        "Vision",
                        "Decision",
                        "Movement"
                    ],

                    datasets: [

                        {
                            data: data,

                            backgroundColor:
                                "rgba(184,255,106,0.08)",

                            borderColor:
                                "#b8ff6a",

                            borderWidth: 2,

                            pointBackgroundColor:
                                "#b8ff6a",

                            pointBorderColor:
                                "#b8ff6a",

                            pointRadius: 3
                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    scales: {

                        r: {

                            min: 0,

                            max: 5,

                            ticks: {
                                display: false,

                                stepSize: 1
                            },

                            grid: {
                                color:
                                    "rgba(255,255,255,0.08)"
                            },

                            angleLines: {
                                color:
                                    "rgba(255,255,255,0.08)"
                            },

                            pointLabels: {

                                color: "#858b95",

                                font: {
                                    size: 9,
                                    family: "Inter"
                                }
                            }

                        }

                    },

                    plugins: {

                        legend: {
                            display: false
                        }

                    }

                }

            }
        );
}


/* ==========================================
   ATTRIBUTE RESULTS
   ========================================== */

function renderAttributes(data) {

    const container =
        document.getElementById(
            "attributeResults"
        );


    container.innerHTML = "";


    data.forEach((value, index) => {

        const item =
            document.createElement("div");

        item.className =
            "attribute-result";


        item.innerHTML = `

            <div class="attribute-result-top">

                <span class="attribute-result-name">
                    ${attributes[index].toUpperCase()}
                </span>

                <span class="attribute-score">
                    ${value.toFixed(1)}
                </span>

            </div>

            <div class="attribute-bar">

                <div
                    class="attribute-bar-fill"
                    data-width="${value * 20}%">
                </div>

            </div>

        `;


        container.appendChild(item);

    });


    setTimeout(() => {

        container
            .querySelectorAll(
                ".attribute-bar-fill"
            )
            .forEach(bar => {

                bar.style.width =
                    bar.dataset.width;

            });

    }, 100);
}


/* ==========================================
   POSITION RESULTS
   ========================================== */

function renderPositions(positions) {

    const container =
        document.getElementById(
            "positionResults"
        );


    container.innerHTML = "";


    const topPositions =
        positions.slice(0, 5);


    const maxScore =
        topPositions[0][1];


    topPositions.forEach(
        ([position, score], index) => {

            const item =
                document.createElement("div");

            item.className =
                "position-item";


            const normalized =
                Math.round(
                    (score / maxScore) * 100
                );


            item.innerHTML = `

                <div class="position-rank">
                    ${String(index + 1).padStart(2, "0")}
                </div>

                <div>

                    <div class="position-name">
                        ${position.toUpperCase()}
                    </div>

                    <div class="position-bar">

                        <div
                            class="position-fill"
                            data-width="${normalized}%">
                        </div>

                    </div>

                </div>

                <div class="position-score">
                    ${score}
                </div>

            `;


            container.appendChild(item);

        }
    );


    setTimeout(() => {

        container
            .querySelectorAll(
                ".position-fill"
            )
            .forEach(bar => {

                bar.style.width =
                    bar.dataset.width;

            });

    }, 100);
}


/* ==========================================
   ROLE MODEL
   ========================================== */

function renderRoleModel(role, player) {

    const container =
        document.getElementById(
            "roleModel"
        );


    const model =
        roleModels[role];


    if (!model) {

        container.innerHTML = `
            <div class="role-main">
                <span class="role-label">
                    ROLE MODEL
                </span>

                <h3>
                    NO MODEL
                </h3>

                <div class="similarity">
                    <strong>--</strong>
                </div>
            </div>
        `;

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

        <div class="role-main">

            <span class="role-label">
                ROLE MODEL
            </span>

            <h3>
                ${model.name}
            </h3>

            <div class="similarity">

                <strong>
                    ${similarity}%
                </strong>

                <span>
                    PROFILE SIMILARITY
                </span>

            </div>

        </div>


        <div class="role-details">

            <div class="role-detail-title">
                CLOSEST ATTRIBUTES
            </div>

            <ul class="similarity-list">

                ${similarities.map(item => `
                    <li>
                        ${item.name}
                    </li>
                `).join("")}

            </ul>


            <div class="role-detail-title">
                BIGGEST DIFFERENCES
            </div>

            <ul class="difference-list">

                ${differences.map(item => `
                    <li>
                        ${item.name}
                    </li>
                `).join("")}

            </ul>


            <div class="role-alternatives">

                Other profiles:
                ${model.alternatives.join(" / ")}

            </div>

        </div>

    `;
}


/* ==========================================
   STRENGTHS
   ========================================== */

function renderStrengths(data) {

    const container =
        document.getElementById(
            "strengthResults"
        );


    container.innerHTML = "";


    const sorted =
        data
            .map((value, index) => ({
                name: attributes[index],
                value
            }))
            .sort((a, b) =>
                b.value - a.value
            )
            .slice(0, 5);


    sorted.forEach((item, index) => {

        const card =
            document.createElement("div");

        card.className =
            "strength-card";


        card.innerHTML = `

            <div class="strength-rank">
                ${String(index + 1).padStart(2, "0")}
            </div>

            <div>

                <div class="strength-name">
                    ${item.name.toUpperCase()}
                </div>

                <div class="strength-value">
                    ${item.value.toFixed(1)}
                </div>

            </div>

        `;


        container.appendChild(card);

    });
}


/* ==========================================
   DEVELOPMENT
   ========================================== */

function renderSuggestions(data) {

    const container =
        document.getElementById(
            "suggestionResults"
        );


    container.innerHTML = "";


    const weakest =
        data
            .map((value, index) => ({
                name: attributes[index],
                value
            }))
            .sort((a, b) =>
                a.value - b.value
            )
            .slice(0, 3);


    weakest.forEach((item, index) => {

        let message;


        if (item.value <= 2) {

            message =
                `Tingkatkan ${item.name.toLowerCase()} karena area ini masih perlu diperkuat melalui latihan yang konsisten.`;

        }

        else if (item.value === 3) {

            message =
                `Kembangkan ${item.name.toLowerCase()} agar kemampuanmu menjadi lebih konsisten dalam pertandingan.`;

        }

        else {

            message =
                `${item.name} sudah menjadi area yang cukup kuat. Fokuskan latihan pada penerapan kemampuan ini dalam situasi pertandingan.`;

        }


        const card =
            document.createElement("div");

        card.className =
            "development-card";


        card.innerHTML = `

            <span>
                ${String(index + 1).padStart(2, "0")}
            </span>

            <h3>
                ${item.name.toUpperCase()}
            </h3>

            <p>
                ${message}
            </p>

        `;


        container.appendChild(card);

    });
}


/* ==========================================
   SCROLL TO ANALYZER
   ========================================== */

function scrollToAnalyzer() {

    document
        .getElementById("analyzer")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* ==========================================
   REVEAL ANIMATION
   ========================================== */

function activateReveal() {

    const elements =
        document.querySelectorAll(
            ".reveal"
        );


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target
                            .classList
                            .add("visible");

                    }

                });

            },

            {
                threshold: 0.12
            }

        );


    elements.forEach(element => {

        observer.observe(element);

    });
}


/* ==========================================
   INITIALIZE
   ========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        activateReveal();

    }
);