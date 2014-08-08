var dashes = require('..');


var rows = [
    {
        a: 'asd\ndsa\ntest',
        b: 'asd\nzxc',
        collection: 7
    },
    {
        a:          7,
        collection: 6457
    }
];

var table = dashes(rows, [], {
    headers: false
});

console.log(table);

/*
    Expected output:
    ------ ----- ----------
    asd    asd         7,00
    dsa    zxc             
    test                   

      7,00         6 457,00
    -----------------------
 */