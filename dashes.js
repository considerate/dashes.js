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

function sum(a, b) {
    return a + b;
}

function repeat(str, count) {
    return new Array(count + 1).join(str);
}

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

function generateCell(rows, columnLengths) {
    return function (key) {
        var str = rows[0][key] || '';
        if (typeof str !== 'string') {
            str = str.toString();
        }
        var ind = str.indexOf('\n');
        if (ind !== -1) {
            if (!rows[1]) {
                rows[1] = {};
            }
            rows[1][key] = str.substring(ind + 1);
            return leftPad(str.substring(0, ind), columnLengths[key]);
        } else {
            return leftPad(str, columnLengths[key]);
        }
    }
}

function generateRow(columnLengths) {
    return function(row) {
        var next = row;
        var current;
        var rowLines = [];
        while (next) {
            current = next;
            next = null;

            var array = [current, next];

            var line = Object.keys(columnLengths)
            .map(generateCell(array, columnLengths))
            .join(' ');

            next = array[1];

            rowLines.push(line);
        }
        return rowLines.join('\n');
    }
}

function generateTable(headers, data) {
    var columnLengths = {};
    data.forEach(function (row) {
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

    var keys = Object.keys(columnLengths);

    var totalLength = keys.map(function (key) {
        return columnLengths[key];
    }).reduce(sum, 0);

    var topLine = repeat('-', totalLength + keys.length - 1);
    var tableHeader = keys.map(function (key) {
        return leftPad(headers[key], columnLengths[key]);
    }).join(' ');

    var tableHeaderLine = keys.map(function (key) {
        return repeat('-', columnLengths[key]);
    }).join(' ');

    var lines = data.map(generateRow(columnLengths)).join('\n\n');

    var table = [topLine, tableHeader, tableHeaderLine, lines, topLine].join('\n');
    return table;
}

console.log(generateTable(headers, rows));