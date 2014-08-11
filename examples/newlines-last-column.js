var dashes = require('..');

var headers = [
    {title: 'Description'},
    'Info'
];

var rows = [
    [
        'Text',
        'Text',
    ],
    [
        7,
        'info\nHello there\nHi\n',
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