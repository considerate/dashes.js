var dashes = require('..');

var headers = [
    {key: 'a', title: 'Description'},
    'Info',
    {key: 'test', title: 'Testing'}
];

var rows = [
    [
        'asd\ndsa\ntest',
        'asd\nzxc',
        'Hejsan'
    ],
    [
        7,
        'test',
        'Hello'
    ],
    {
        a: 'Hej',
        test: 'testing'
    }
];

var table = dashes(rows, headers);

console.log(table);

/*
    Expected output:
    ------------------------------
    Description   Info   Testing  
    ------------- ------ ---------
    asd           asd    Hejsan   
    dsa           zxc   
    test         

             7,00 test   Hello    

    Hej                  testing  
    ------------------------------
 */