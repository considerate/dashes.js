var headers = {
    a: 'hej',
    b: 'test'
};

var rows = [
    {
        a: 'asd\ndsa',
        b: 'asd\nzxc',
        collection: 7
    },
    {
        a:          7,
        collection: 6457
    }
];

function max(a, b) {
    return a > b ? a : b;
}

var columnLengths = {};
rows.forEach(function (row) {
    Object.keys(row).forEach(function (key) {
        var str = row[key].toString();

        var length = str.split('\n').map(function (part) {
            return part.length;
        }).reduce(max, 0);

        if (!columnLengths[key] || length >= columnLengths[key]) {
            columnLengths[key] = length;
        }
        if (headers[key] === undefined) {
            headers[key] = key;
        }
    });
});

Object.keys(headers).forEach(function (key) {
    var str = headers[key].toString();
    var length = str.length;
    if (!columnLengths[key] || length >= columnLengths[key]) {
        columnLengths[key] = length;
    }
});

function sum(a, b) {
    return a + b;
}

function repeat(str, count) {
    return new Array(count + 1).join(str);
}

var keys = Object.keys(columnLengths);

var totalLength = keys.map(function (key) {
    return columnLengths[key];
}).reduce(sum, 0);

function leftPad(text, length) {
    var str = text || '';
    if (typeof str !== 'string') {
        str = str.toString();
    }
    var l = length - str.length;
    if (l > 0) {
        return str + repeat(' ', l);
    }
    return str;
}

var headerKeys = Object.keys(headers);

var topLine = repeat('-', totalLength + keys.length - 1);
var tableHeader = headerKeys.map(function (key) {
    return leftPad(headers[key], columnLengths[key]);
}).join(' ');

var tableHeaderLine = headerKeys.map(function (key) {
    return repeat('-', columnLengths[key]);
}).join(' ');

var lines = rows.map(function (row) {
    var next = row;
    var current;
    var lines = [];
    while (next) {
        current = next;
        next = null;

        var line = headerKeys.map(function (key) {
            var str = current[key] || '';
            if (typeof str !== 'string') {
                str = str.toString();
            }
            var ind = str.indexOf('\n');
            if (ind !== -1) {
                if (!next) {
                    next = {};
                }
                next[key] = str.substring(ind + 1);
                return leftPad(str.substring(0, ind), columnLengths[key]);
            } else {
                return leftPad(str, columnLengths[key]);
            }
        }).join(' ');

        lines.push(line);
    }
    return lines.join('\n');
}).join('\n\n');

var table = [topLine, tableHeader, tableHeaderLine, lines, topLine].join('\n');
console.log(table);