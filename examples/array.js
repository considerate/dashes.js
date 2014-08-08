var dashes = require('..');

var headers = [
    {title: 'Description'},
    'Info'
];

var rows = [
    [
        'Writing some words here\nthat span\nmultiple lines',
        'asd\nzxc',
    ],
    [
        7,
        'info',
        'Hello'
    ]
];

var table = dashes(rows, headers);

console.log(table);

/*
    Expected output:
    ----------------------------------------
    Description               Info  
    ------------------------- ------ -------
    Writing some words here   asd   
    that span                 zxc   
    multiple lines           

                         7,00 info   Hello  
    ----------------------------------------
 */