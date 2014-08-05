var dashes = require('..');

var headers = {
    a: 'hej',
    b: 'test'
};

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

var table = dashes(rows, headers, {
    minWidth: 10
});

console.log(table);