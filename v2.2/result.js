/* =====================================================
   FOOTBALL PLAYER ANALYZER
   RESULT ENGINE
   VERSION 2.2
   ===================================================== */


const savedData =
    localStorage.getItem(
        "footballAnalyzerData"
    );


/* =========================
   NO DATA
   ========================= */

if (!savedData) {

    window.location.href =
        "analysis.html";

}


/* =========================
   DATA
   ========================= */

const data =
    JSON.parse(savedData);


const attributes =
    data.attributes;


const attributeNames = [

    "Speed",
    "Stamina",
    "Strength",
    "Ball Control",
    "Passing",
    "Dribbling",
    "Shooting",
    "Finishing",
    "Defending",
    "Vision",
    "Decision Making",
    "Movement"

];


/* =========================
   BASIC INFO
   ========================= */

document.getElementById(
    "resultName"
).textContent =
    data.playerName;


document.getElementById(
    "resultInfo"
).textContent =
    `${data.height} CM / ${data.foot} FOOT`;


document.getElementById(
    "mainPosition"
).textContent =
    data.mainPosition;


document.getElementById(
    "mainRole"
).textContent =
    data.role;


/* =========================
   ATTRIBUTE CARDS
   ========================= */

const attributeContainer =
    document.getElementById(
        "attributeResults"
    );


attributeContainer.innerHTML = "";


attributes.forEach(
    (value, index) => {

        const card =
            document.createElement("div");

        card.className =
            "attribute-card";


        card.innerHTML = `

            <span>
                ${attributeNames[index]}
            </span>

            <strong>
                ${value}/5
            </strong>

        `;


        attributeContainer.appendChild(card);

    }
);


/* =========================
   RADAR CHART
   ========================= */

const radarCanvas =
    document.getElementById(
        "radarChart"
    );


new Chart(
    radarCanvas,
    {

        type: "radar",

        data: {

            labels: attributeNames,

            datasets: [

                {

                    label: data.playerName,

                    data: attributes,

                    backgroundColor:
                        "rgba(183,255,74,0.08)",

                    borderColor:
                        "#b7ff4a",

                    borderWidth: 2,

                    pointBackgroundColor:
                        "#b7ff4a",

                    pointBorderColor:
                        "#050607",

                    pointRadius: 4

                }

            ]

        },


        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: false
                }

            },


            scales: {

                r: {

                    min: 0,

                    max: 5,

                    ticks: {

                        stepSize: 1,

                        color: "#555b62",

                        backdropColor:
                            "transparent",

                        font: {
                            size: 9
                        }

                    },


                    angleLines: {

                        color:
                            "rgba(255,255,255,0.08)"

                    },


                    grid: {

                        color:
                            "rgba(255,255,255,0.08)"

                    },


                    pointLabels: {

                        color: "#858b92",

                        font: {

                            family: "Inter",

                            size: 10

                        }

                    }

                }

            }

        }

    }
);


/* =========================
   POSITION FIT
   ========================= */

const positionContainer =
    document.getElementById(
        "positionResults"
    );


positionContainer.innerHTML = "";


const topScore =
    data.sortedPositions[0][1];


data.sortedPositions.forEach(
    (item, index) => {

        const position =
            item[0];

        const score =
            item[1];


        const percentage =
            Math.round(
                (score / topScore) * 100
            );


        const row =
            document.createElement("div");


        row.className =
            "position-row";


        row.innerHTML = `

            <div class="position-rank">
                ${String(index + 1).padStart(2, "0")}
            </div>

            <div>

                <div class="position-name">
                    ${position}
                </div>

                <div class="position-bar">
                    <span
                        style="width:${percentage}%"
                    ></span>
                </div>

            </div>

            <div class="position-score">
                ${score}
            </div>

        `;


        positionContainer.appendChild(row);

    }
);


/* =========================
   ROLE MODEL
   ========================= */

const roleContainer =
    document.getElementById(
        "roleModel"
    );


const similarAttributes =
    attributes
        .map(
            (value, index) => ({

                name:
                    attributeNames[index],

                difference:
                    Math.abs(
                        value -
                        getRoleProfile(
                            data.role
                        )[index]
                    )

            })
        )
        .sort(
            (a, b) =>
                a.difference -
                b.difference
        )
        .slice(0, 3);


const differentAttributes =
    attributes
        .map(
            (value, index) => ({

                name:
                    attributeNames[index],

                difference:
                    Math.abs(
                        value -
                        getRoleProfile(
                            data.role
                        )[index]
                    )

            })
        )
        .sort(
            (a, b) =>
                b.difference -
                a.difference
        )
        .slice(0, 3);


roleContainer.innerHTML = `

    <div class="role-main">

        <small>
            PRIMARY ROLE MODEL
        </small>

        <h3>
            ${data.role}
        </h3>

        <strong>
            ${data.roleModel}
        </strong>

    </div>


    <div class="role-card">

        <h4>
            STYLE SIMILARITY
        </h4>

        <p>
            Your current profile has a
            <span class="highlight">
                ${data.similarity}%
            </span>
            similarity with the selected
            role model profile.
        </p>

    </div>


    <div class="role-card">

        <h4>
            CLOSEST ATTRIBUTES
        </h4>

        <p>
            ${similarAttributes
                .map(
                    item =>
                        `<span class="highlight">
                            ${item.name}
                        </span>`
                )
                .join(" / ")
            }
        </p>

    </div>


    <div class="role-card">

        <h4>
            DEVELOPMENT GAP
        </h4>

        <p>
            ${differentAttributes
                .map(
                    item =>
                        `${item.name}`
                )
                .join(" / ")
            }
        </p>

    </div>


    <div class="role-card">

        <h4>
            ALTERNATIVE REFERENCES
        </h4>

        <p>
            ${data.alternatives.join(" / ")}
        </p>

    </div>

`;


/* =========================
   ROLE PROFILES
   ========================= */

function getRoleProfile(role) {

    const profiles = {

        "Kiper Modern":
            [4,4,4,5,5,2,2,2,4,5,5,3],

        "Bek Pembawa Bola":
            [4,4,5,4,5,2,3,3,5,5,5,4],

        "Bek Sayap Menyerang":
            [5,5,4,4,4,4,3,3,4,5,4,5],

        "Pengatur Permainan dari Belakang":
            [3,5,5,5,5,3,4,3,5,5,5,4],

        "Perebut Bola":
            [5,5,3,4,4,4,2,2,5,4,5,5],

        "Pengatur Permainan":
            [4,5,3,5,5,4,4,3,3,5,5,5],

        "Pencipta Peluang":
            [3,5,3,5,5,4,4,4,3,5,5,5],

        "Winger Penyerang":
            [5,5,3,5,5,5,5,5,2,5,5,5],

        "Penyerang Pencari Ruang":
            [5,5,5,4,3,3,5,5,3,5,5,5]

    };


    return profiles[role];

}


/* =========================
   TOP STRENGTHS
   ========================= */

const strengthContainer =
    document.getElementById(
        "strengthResults"
    );


const strengths =
    attributes
        .map(
            (value, index) => ({

                name:
                    attributeNames[index],

                value

            })
        )
        .sort(
            (a, b) =>
                b.value -
                a.value
        )
        .slice(0, 5);


strengthContainer.innerHTML = "";


strengths.forEach(
    (item, index) => {

        const card =
            document.createElement("div");


        card.className =
            "strength-card";


        card.innerHTML = `

            <span>
                ${String(index + 1).padStart(2, "0")}
            </span>

            <h3>
                ${item.name}
            </h3>

            <strong>
                ${item.value}/5
            </strong>

        `;


        strengthContainer.appendChild(card);

    }
);


/* =========================
   DEVELOPMENT
   ========================= */

const suggestionContainer =
    document.getElementById(
        "suggestionResults"
    );


const weakest =
    attributes
        .map(
            (value, index) => ({

                name:
                    attributeNames[index],

                value

            })
        )
        .sort(
            (a, b) =>
                a.value -
                b.value
        )
        .slice(0, 3);


suggestionContainer.innerHTML = "";


weakest.forEach(
    (item, index) => {

        let message;


        if (item.value <= 2) {

            message =
                `This area currently needs more attention. Developing ${item.name.toLowerCase()} could strengthen your overall profile.`;

        }

        else if (item.value === 3) {

            message =
                `This is a developing area. Improving ${item.name.toLowerCase()} could make your performances more consistent.`;

        }

        else {

            message =
                `${item.name} is already part of your stronger profile. Continue developing it while maintaining balance with other attributes.`;

        }


        const card =
            document.createElement("div");


        card.className =
            "development-card";


        card.innerHTML = `

            <span>
                DEVELOPMENT AREA ${String(index + 1).padStart(2, "0")}
            </span>

            <h3>
                ${item.name}
            </h3>

            <p>
                ${message}
            </p>

        `;


        suggestionContainer.appendChild(card);

    }
);