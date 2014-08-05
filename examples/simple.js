var headers = {
    a: 'hej',
    b: 'test'
};

var rows = [
    {
        a: 'asd\ndsa',
        b: 'asd\nzxc\nhahah',
        collection: 7
    },
    {
        a:          7,
        collection: 6457
    }
];


var dashes = require('..');

var table = dashes(rows, headers);

console.log(table);