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

function generateCell(data, columnWidths) {
    return function (key) {
        var str = data[key] || '';
        if (typeof str !== 'string') {
            str = str.toString();
        }
        var ind = str.indexOf('\n');
        if (ind !== -1) {
            //Before \n padded to column width
            var current = leftPad(str.substring(0, ind), columnWidths[key]);
            //Remaining text
            var next = str.substring(ind + 1);
            return {
                current: current,
                next: next
            };
        } else {
            return {
                current: leftPad(str, columnWidths[key])
            };
        }
    };
}

function generateRow(columnWidths) {
    return function(row) {
        /*jshint -W083 */
        var next = row;
        var current;
        var rowLines = [];
        while (next) {
            current = next;
            next = null;

            var cellGenerator = generateCell(current, columnWidths);
            var line = Object.keys(columnWidths)
            .map(function(key) {
                var result = cellGenerator(key);
                var thisRow = result.current;
                var nextRow = result.next;
                if (nextRow) {
                    next = next || {};
                    next[key] = nextRow;
                }
                return thisRow;
            })
            .join(' ');

            rowLines.push(line);
        }
        return rowLines.join('\n');
    };
}

function calculateColumnWidths(headers, data, options) {
    var minWidth = options.minWidth;
    var columnWidths = {};
    var hideHeaders = options.headers === false;
    data.forEach(function(row) {
        Object.keys(row).forEach(function(key) {
            var str = row[key].toString();

            var length = str.split('\n').map(function(part) {
                return part.length;
            }).reduce(max, 0);

            if (!columnWidths[key] || length >= columnWidths[key]) {
                columnWidths[key] = length;
            }
            if (headers[key] === undefined) {
                headers[key] = key;
            }
        });
    });
    if (!hideHeaders) {
        Object.keys(headers).forEach(function(key) {
            var str = headers[key].toString();
            var length = str.length;
            if (!columnWidths[key] || length >= columnWidths[key]) {
                columnWidths[key] = length;
            }
        });
    }

    Object.keys(columnWidths).forEach(function(key) {
        if (minWidth) {
            if (columnWidths[key] < minWidth) {
                columnWidths[key] = minWidth;
            }
        }
        columnWidths[key] += 2;
    });

    return columnWidths;
}

function generateTable(data, headers, options) {
    headers = headers || {};
    options = options || {};
    var hideHeaders = options.headers === false;
    if (hideHeaders) {
        headers = {};
    }
    var columnWidths = calculateColumnWidths(headers, data, options);
    var keys = Object.keys(columnWidths);

    var totalWidth = keys.map(function(key) {
        return columnWidths[key];
    }).reduce(sum, 0);

    var dashline = repeat('-', totalWidth + keys.length - 1);
    var tableHeader = keys.map(function(key) {
        return leftPad(headers[key], columnWidths[key]);
    }).join(' ');

    var headerBottomLine = keys.map(function(key) {
        return repeat('-', columnWidths[key]);
    }).join(' ');

    var header;
    if (hideHeaders) {
        header = [];
    } else {
        header = [dashline, tableHeader];
    }
    header.push(headerBottomLine);

    var lines = data.map(generateRow(columnWidths)).join('\n\n');
    var body = [lines];

    var footer = [dashline];

    var table = header.concat(body).concat(footer).join('\n');
    return table;
}


module.exports = function(data, headers, options) {
    return generateTable(data, headers, options);
};