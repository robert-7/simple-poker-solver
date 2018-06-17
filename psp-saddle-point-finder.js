function findSaddlePoints(var_ante, var_bet, var_cardRange) {
    ante = parseInt(var_ante);
    bet = parseInt(var_bet);
    cardRange = parseInt(var_cardRange);

    vMatrix = valueMatrix();

    var matrixStr = matrixToString(vMatrix);
    console.log(matrixStr);

    pure1 = newStrat();

    // these arrays will hold the solutions we'd like to return
    var saddlePoints = new Array();
    var saddlePoint;

    for (x = 0; x < Math.pow(2, cardRange); x++) {

        pure2 = newStrat();

        for (y = 0; y < Math.pow(2, cardRange); y++) {

            if (SaddlePoint(pure1, pure2)) {
                saddlePoint = {
                    "%PURE1%": pure1.toString(),
                    "%PURE2%": pure2.toString(),
                    "%VALUE%": value(pure1, pure2).toString()
                };
                saddlePoints.push(saddlePoint);
                console.log("(" + "(" + pure1 + ")" + "," + "(" + pure2 + ")" + ")" + " value = " + value(pure1, pure2));

            }
            nextstrat(pure2);
        }
        nextstrat(pure1);
    }
    console.log("done");
    return saddlePoints;
}

function matrixToString(valueMatrix) {
    var matrixStr = "";
    var tempStr = ""
    for (var i in vMatrix) {
        for (var j in vMatrix[i]) {
            tempStr += vMatrix[i][j].toString();
            if (tempStr === "0") {
                tempStr += ".00";
            } else if (tempStr.length < 4) {
                tempStr += "0";
            } else {
                tempStr = tempStr.substring(0, 4);
            }
            matrixStr += tempStr;
            matrixStr += ", "
			tempStr = "";
        }
        matrixStr += "\n "
    }
    return matrixStr;
}

function SaddlePoint(s1, s2) {
    sad1 = false;
    sad2 = false;

    st = [s1, s2];
    sum = 9999999;
    temp = 0;

    stratP1 = newStrat();
    stratP2 = newStrat();

    str = [stratP1, stratP2];

    for (s = 0; s < Math.pow(2, cardRange); s++) {

        temp = vMatrix[toDec(st[0])][toDec(str[1])];

        if (sum > temp || ((sum >= temp) && equal(str[1], st[1]))) {
            sum = temp;
            sad2 = false;
            if (equal(str[1], st[1])) {
                sad2 = true;
            }

        }
        temp = 0;
        nextstrat(str[1]);
    }

    sum = 0;
    temp = 0;

    for (s = 0; s < Math.pow(2, cardRange); s++) {
        temp = vMatrix[toDec(str[0])][toDec(st[1])];

        if (sum < temp || ((sum <= temp) && equal(str[0], st[0]))) {
            sum = temp;
            sad1 = false;
            if (equal(str[0], st[0])) {
                sad1 = true;
            }

        }
        temp = 0;
        nextstrat(str[0]);
    }

    return (sad1 && sad2);

}

function nextstrat(strat) {
    strat[0]++;
    fix(strat);
}

function fix(strat) {
    for (i = 0; i < cardRange; i++) {
        if (strat[i] == 2) {
            strat[i] = 0;
            if (i != cardRange - 1) {
                strat[i + 1]++;
            }
            fix(strat);
            i = cardRange;
        }
    }
}

function equal(strat1, strat2) {
    bool = true;
    for (i = 0; i < cardRange; i++) {
        bool = bool && (strat1[i] == strat2[i]);
    }
    return (bool);
}

function value(strat1, strat2) {
    temp = 0;
    for (i = 0; i < cardRange; i++) {
        for (j = 0; j < cardRange; j++) {
            if (i != j) {

                if (strat1[i] == 0) {
                    if (i > j) {

                        temp = temp + ante;
                    } else {

                        temp = temp - ante;
                    }
                }


                if (strat1[i] == 1) {

                    if (strat2[j] == 0) {

                        temp = temp + ante;
                    }
                    if (strat2[j] == 1) {
                        if (i > j) {
                            temp = temp + ante + bet;
                        } else {
                            temp = temp - ante - bet;
                        }
                    }

                }
            }
        }
    }
    return temp / (Math.pow(cardRange, 2) - cardRange);
}

function newStrat() {
    var strat = [];

    for (i = 0; i < cardRange; i++) {
        strat[i] = 0;
    }

    return strat;
}

function valueMatrix() {
    var valMat = new Array(cardRange);

    strati = newStrat();
    stratj = newStrat();

    for (var i = 0; i < Math.pow(2, cardRange); i++) {
        valMat[i] = new Array(cardRange);
        for (var j = 0; j < Math.pow(2, cardRange); j++) {
            valMat[i][j] = value(strati, stratj);
            nextstrat(stratj);
        }
        nextstrat(strati);
    }
    return valMat;
}

function toDec(strat) {
    dec = 0;

    for (i = 0; i < strat.length; i++) {
        dec = dec + Math.pow(2, i) * strat[i];
    }

    return dec;
}