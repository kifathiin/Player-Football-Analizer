/* =====================================================
   FOOTBALL PLAYER ANALYZER
   ANALYSIS ENGINE
   VERSION 2.2
   ===================================================== */


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


const roleModels = {

    "Kiper Modern": {

        main: "Ederson",

        alternatives: [
            "Alisson",
            "Manuel Neuer"
        ],

        profile: [
            4,4,4,5,5,2,2,2,4,5,5,3
        ]

    },


    "Bek Pembawa Bola": {

        main: "Virgil van Dijk",

        alternatives: [
            "Ruben Dias",
            "William Saliba"
        ],

        profile: [
            4,4,5,4,5,2,3,3,5,5,5,4
        ]

    },


    "Bek Sayap Menyerang": {

        main: "Achraf Hakimi",

        alternatives: [
            "Trent Alexander-Arnold",
            "Theo Hernandez"
        ],

        profile: [
            5,5,4,4,4,4,3,3,4,5,4,5
        ]

    },


    "Pengatur Permainan dari Belakang": {

        main: "Rodri",

        alternatives: [
            "Joshua Kimmich",
            "Jorginho"
        ],

        profile: [
            3,5,5,5,5,3,4,3,5,5,5,4
        ]

    },


    "Perebut Bola": {

        main: "N'Golo Kante",

        alternatives: [
            "Casemiro",
            "Claude Makelele"
        ],

        profile: [
            5,5,3,4,4,4,2,2,5,4,5,5
        ]

    },


    "Pengatur Permainan": {

        main: "Luka Modric",

        alternatives: [
            "Toni Kroos",
            "Bernardo Silva"
        ],

        profile: [
            4,5,3,5,5,4,4,3,3,5,5,5
        ]

    },


    "Pencipta Peluang": {

        main: "Martin Ødegaard",

        alternatives: [
            "Kevin De Bruyne",
            "Bruno Fernandes"
        ],

        profile: [
            3,5,3,5,5,4,4,4,3,5,5,5
        ]

    },


    "Winger Penyerang": {

        main: "Mohamed Salah",

        alternatives: [
            "Bukayo Saka",
            "Son Heung-min"
        ],

        profile: [
            5,5,3,5,5,5,5,5,2,5,5,5
        ]

    },


    "Penyerang Pencari Ruang": {

        main: "Erling Haaland",

        alternatives: [
            "Kylian Mbappé",
            "Robert Lewandowski"
        ],

        profile: [
            5,5,5,4,3,3,5,5,3,5,5,5
        ]

    }

};


/* =========================
   GET PLAYER DATA
   ========================= */

function getPlayerAttributes() {

    return attributeIds.map(id => {

        return Number(
            document.getElementById(id).value
        );

    });

}


/* =========================
   POSITION SCORE
   ========================= */

function calculatePositionScores(
    attributes,
    height
) {

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

    ] = attributes;


    return {

        "Kiper":
            control +
            passing +
            decision +
            vision +
            defending,


        "Bek Tengah":
            strength * 2 +
            defending * 3 +
            decision * 2 +
            vision +
            control +
            (height >= 180 ? 3 : 0),


        "Bek Sayap":
            speed * 2 +
            stamina * 2 +
            defending * 2 +
            passing +
            dribbling +
            movement * 2,


        "Gelandang Bertahan":
            defending * 2 +
            passing * 2 +
            vision * 2 +
            decision * 2 +
            stamina +
            control,


        "Gelandang Tengah":
            passing * 2 +
            vision * 2 +
            decision * 2 +
            control * 2 +
            stamina +
            movement,


        "Gelandang Serang":
            vision * 2 +
            decision * 2 +
            dribbling * 2 +
            shooting +
            finishing +
            control * 2 +
            movement * 2,


        "Winger":
            speed * 2 +
            dribbling * 3 +
            shooting +
            finishing +
            passing +
            movement * 2 +
            stamina,


        "Striker":
            finishing * 3 +
            shooting * 2 +
            movement * 2 +
            strength +
            speed +
            decision +
            control

    };

}


/* =========================
   STYLE BONUS
   ========================= */

function applyStyleBonuses(
    scores,
    attackHabit,
    defendingHabit,
    style
) {

    const result = {
        ...scores
    };


    if (attackHabit === "passing") {

        result["Gelandang Tengah"] += 4;
        result["Gelandang Bertahan"] += 3;

    }


    if (attackHabit === "carry") {

        result["Gelandang Tengah"] += 3;
        result["Gelandang Serang"] += 3;

    }


    if (attackHabit === "findSpace") {

        result["Gelandang Serang"] += 4;
        result["Gelandang Tengah"] += 3;

    }


    if (attackHabit === "dribble") {

        result["Winger"] += 5;
        result["Gelandang Serang"] += 3;

    }


    if (attackHabit === "shoot") {

        result["Striker"] += 5;
        result["Gelandang Serang"] += 3;

    }


    if (defendingHabit === "press") {

        result["Winger"] += 2;
        result["Bek Sayap"] += 2;
        result["Gelandang Bertahan"] += 2;

    }


    if (defendingHabit === "return") {

        result["Bek Tengah"] += 3;
        result["Bek Sayap"] += 3;

    }


    if (defendingHabit === "passingLane") {

        result["Gelandang Bertahan"] += 4;
        result["Bek Tengah"] += 3;

    }


    if (defendingHabit === "ballCarrier") {

        result["Bek Sayap"] += 3;
        result["Bek Tengah"] += 2;

    }


    if (style === "control") {

        result["Gelandang Tengah"] += 5;
        result["Gelandang Serang"] += 3;

    }


    if (style === "defense") {

        result["Gelandang Bertahan"] += 5;
        result["Bek Tengah"] += 3;

    }


    if (style === "build") {

        result["Bek Sayap"] += 3;
        result["Gelandang Tengah"] += 4;

    }


    if (style === "wing") {

        result["Winger"] += 5;
        result["Bek Sayap"] += 3;

    }


    if (style === "box") {

        result["Striker"] += 4;
        result["Gelandang Serang"] += 4;

    }


    if (style === "last") {

        result["Bek Tengah"] += 5;
        result["Kiper"] += 2;

    }


    return result;

}


/* =========================
   ROLE MAPPING
   ========================= */

function getRoleModel(
    position,
    attributes
) {

    const passing = attributes[4];

    const vision = attributes[9];


    const mapping = {

        "Kiper":
            "Kiper Modern",


        "Bek Tengah":
            "Bek Pembawa Bola",


        "Bek Sayap":
            "Bek Sayap Menyerang",


        "Gelandang Tengah":
            "Pengatur Permainan",


        "Gelandang Serang":
            "Pencipta Peluang",


        "Winger":
            "Winger Penyerang",


        "Striker":
            "Penyerang Pencari Ruang"

    };


    if (position === "Gelandang Bertahan") {

        if (
            passing >= 4 &&
            vision >= 4
        ) {

            return "Pengatur Permainan dari Belakang";

        }

        return "Perebut Bola";

    }


    return mapping[position];

}


/* =========================
   SIMILARITY
   ========================= */

function calculateSimilarity(
    player,
    model
) {

    let difference = 0;


    for (
        let i = 0;
        i < player.length;
        i++
    ) {

        difference += Math.abs(
            player[i] - model[i]
        );

    }


    const maxDifference =
        player.length * 4;


    return Math.round(
        (
            1 -
            difference / maxDifference
        ) * 100
    );

}


/* =========================
   ANALYZE
   ========================= */

document
    .getElementById("analysisForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const playerName =
            document
                .getElementById("playerName")
                .value
                .trim();


        const height =
            Number(
                document
                    .getElementById("height")
                    .value
            );


        const foot =
            document
                .getElementById("foot")
                .value;


        const attributes =
            getPlayerAttributes();


        const attackHabit =
            document
                .getElementById("attackHabit")
                .value;


        const defendingHabit =
            document
                .getElementById("defendingHabit")
                .value;


        const style =
            document
                .getElementById("style")
                .value;


        let positionScores =
            calculatePositionScores(
                attributes,
                height
            );


        positionScores =
            applyStyleBonuses(
                positionScores,
                attackHabit,
                defendingHabit,
                style
            );


        const sortedPositions =
            Object.entries(positionScores)
                .sort(
                    (a, b) => b[1] - a[1]
                );


        const mainPosition =
            sortedPositions[0][0];


        const role =
            getRoleModel(
                mainPosition,
                attributes
            );


        const model =
            roleModels[role];


        const similarity =
            calculateSimilarity(
                attributes,
                model.profile
            );


        const playerData = {

            playerName,

            height,

            foot,

            attributes,

            attackHabit,

            defendingHabit,

            style,

            positionScores,

            sortedPositions,

            mainPosition,

            role,

            roleModel: model.main,

            alternatives: model.alternatives,

            similarity

        };


        localStorage.setItem(
            "footballAnalyzerData",
            JSON.stringify(playerData)
        );


        window.location.href =
            "result.html";

    });


/* =========================
   RANGE OUTPUTS
   ========================= */

attributeIds.forEach(id => {

    const input =
        document.getElementById(id);

    const output =
        document.getElementById(
            `${id}Value`
        );


    input.addEventListener(
        "input",
        () => {

            output.textContent =
                input.value;

        }
    );

});