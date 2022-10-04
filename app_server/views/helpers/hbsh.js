var hbs = require('hbs');
const moment = require("moment");

//svuda gde hocu da prikaze cenu, da mi doda dolar ispred
hbs.registerHelper('valuta', (namig) => {
     return "$" + namig;
});


hbs.registerHelper('dateFormat', function (date, options) {
    const formatToUse = (arguments[1] && arguments[1].hash && arguments[1].hash.format) || "DD/MM/YYYY"
    return moment(date).format(formatToUse);
});