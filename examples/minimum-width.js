var dashes = require('..');

var headers = [
    {key: 'a', title : 'hej'},
    {key: 'b', title: 'test'}
];

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