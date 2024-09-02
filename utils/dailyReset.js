const { Account } = require("../models");
const logger = require("./logger");

const resetAtMidnight = () => {
    resetAccount();

    // Set an interval to alert every 24 hours
    setInterval(() => {
        resetAccount();
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
}

const resetAccount = async () => {
    try {
        const accounts = await Account.findAll();
        for (const account of accounts) {
            if (account.breachedReason == "TotalDrawdown" || account.breachedReason == "TotalGoal") {
                await Account.update({ dayStartEquity: account.currentEquity }, { id: account.id });
            }
            else {
                await Account.update({ dayStartEquity: account.currentEquity, breached: false, breachedReason: "None" }, { id: account.id });
            }
        }
    } catch (error) {
        logger("error", "DailyReset", `Reset Account ${error.message}`);
    }

}

exports.dailyReset = () => {
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0); // Set to next midnight

    const timeUntilMidnight = nextMidnight - now;

    // Set a timeout to alert at the next midnight
    setTimeout(resetAtMidnight, timeUntilMidnight);
}

