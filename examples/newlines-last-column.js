var dashes = require('..');

var headers = [
    {title: 'Description'},
    {title: 'Info', align: 'right'}
];

var rows = [
    [
        'Text',
        'Text',
    ],
    [
        7,
        'info\nHello there\nHi',
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