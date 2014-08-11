var numeral = require('numeral');

(function () {
    var language = {
        delimiters: {
            thousands: ' ',
            decimal: ','
        },
        abbreviations: {
            thousand: 'k',
            million: 'M',
            billion: 'G',
            trillion: 'T'
        },
        ordinal: function (number) {
            if(number == 11) {
                return 'e';
            }
            var b = number % 10;
            if(b === 1 || b === 2) {
                return 'a';
            } else {
                return 'e';
            }
            return '.';
        },
        currency: {
            symbol: ' kr'
        }
    };
    numeral.language('sv-SE', language);
}());
numeral.language('sv-SE');


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

function rightPad(text, length) {
    var str = text || '';
    if (typeof str !== 'string') {
        str = str.toString();
    }
    var l = length - str.length;
    if (l > 0) {
        return repeat(' ', l) + str;
    }
    return str;
}

function pad(text, align, length) {
    var str;
    align = align || 'left';
    var padders = {
        'left': leftPad,
        'right': rightPad
    };

    if(typeof text === 'number') {
        str = numeral(text).format('0,0.00');
    } else if (typeof text !== 'string') {
        str = text.toString();
    } else {
        str = text;
    }
    return padders[align](str, length);
}

function generateCell (str, width, header) {

    var align = 'left';
    if(typeof str === 'number') {
        align = 'right';
    }

    if(header.align) {
        align = header.align;
    }

    if(typeof str === 'string') {
        var ind = str.indexOf('\n');
        if (ind !== -1) {
            //Before \n padded to column width
            
            var current = pad(str.substring(0, ind), align, width-1);
            current += '\\';
            //Remaining text
            var next = str.substring(ind + 1);
            return {
                current: current,
                next: next
            };
        } 
    }
    return {
        current: pad(str, align, width)
    };
}

function generateRow(headers, columnWidths) {
    return function(row) {
        var lines;
        if(Array.isArray(row)) {
            lines =  (function generateArrayRow(row) {
                var next = [];

                var line = headers.map(function (header, index) {
                    var text = row[index] || '';
                    var width = columnWidths[index];
                    var result = generateCell(text, width, header);
                    var remainder = result.next;
                    if(remainder) {
                        next[index] = remainder;
                    }
                    return result.current;
                }).join(' ');
                if(next.length) {
                    line += '\n';
                    line += generateArrayRow(next);
                }
                return line;
            })(row);
        } else {
            lines = (function generateObjectRow(obj) {
                var next = {};
                var hasNext = false;
                var line = headers.map(function(header, index) {
                    var key = header.key;
                    var text = obj[key] || '';
                    var width = columnWidths[index];
                    var result = generateCell(text, width, header);
                    var remainder = result.next;
                    if(remainder) {
                        hasNext = true;
                        next[key] = remainder;
                    }
                    return result.current;
                }).join(' ');
                if(hasNext) {
                    line += '\n';
                    line += generateObjectRow(next);
                }
                return line;
            })(row);
        }
        return lines;
    };
}

function calculateCellWidth(str, index, columnWidths) {
    if(typeof str === 'number') {
        str = numeral(str).format('0,0.00');
    }

    var length = str.split('\n').map(function(part) {
        return part.length;
    }).reduce(max, 0);

    if (!columnWidths[index] || length >= columnWidths[index]) {
        columnWidths[index] = length;
    }
}

function calculateColumnWidths(headers, data, options) {
    var minWidth = options.minWidth;
    var columnWidths = [];
    var hideHeaders = options.headers === false || headers.length === 0;
    data.forEach(function(row) {
        if(Array.isArray(row)) {
            row.forEach(function(title, index) {
                calculateCellWidth(title, index, columnWidths);
            });
        }
        else if(typeof row === 'object') {
            Object.keys(row).forEach(function(key) {
                var index = headers.map(function(header) {
                    return header.key;
                }).indexOf(key);
                if(index === -1) {
                    headers.push({
                        key: key,
                        title: key
                    });
                    index = headers.length-1;
                }
                var str = row[key];
                calculateCellWidth(str, index, columnWidths);
            });
        }
    });
    if(!hideHeaders) {
        headers.forEach(function(header, key) {
            var title = header;
            if(typeof header === 'object') {
                title = header.title;
            }
            calculateCellWidth(title, key, columnWidths);
        });
    }

    columnWidths.forEach(function(width, index) {
        var header = headers[index] || {};
        var minWidth = header.minWidth || options.minWidth;
        if (minWidth) {
            if (width < minWidth) {
                columnWidths[index] = minWidth;
            }
        }
        columnWidths[index] += 2;
    });

    return columnWidths;
}

function generateTable(data, headers, options) {
    headers = headers || [];
    options = options || {};

    headers = headers.map(function(header) {
        if(typeof header === 'string') {
            return {
                title: header
            };
        }
        return header;
    });

    var hideHeaders = options.headers === false;
    var columnWidths = calculateColumnWidths(headers, data, options);
    var totalWidth = columnWidths.reduce(sum, 0);

    var dashline = repeat('-', totalWidth + columnWidths.length - 1);
    var tableHeader = headers.map(function(header, key) {
        var width = columnWidths[key];
        var title = header.title || '';
        var align = header.align || 'left';
        console.log(header, key, width, title, align);
        return pad(title, align, width);
    }).join(' ');

    var headerBottomLine = columnWidths.map(function(width) {
        return repeat('-', width);
    }).join(' ');

    var header;
    if (headers.length === 0 || hideHeaders) {
        header = [];
    } else {
        header = [dashline, tableHeader];
    }
    header.push(headerBottomLine);

    var lines = data.map(generateRow(headers, columnWidths)).join('\n\n');
    var body = [lines];

    var footer = [dashline];

    var table = header.concat(body).concat(footer).join('\n');
    return table;
}


module.exports = function(data, headers, options) {
    return generateTable(data, headers, options);
};