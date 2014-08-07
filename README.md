#dashes.js

Convert Javascript Objects to text tables for pandoc multiline tables.

##Usage

```javascript
var dashes = require('..');

var headers = {
    a: 'Description',
    b: 'Info'
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

var table = dashes(rows, headers);

console.log(table);

/*
	Expected output:
	---------------------------
	Description Info collection
	----------- ---- ----------
	asd         asd  7         
	dsa         zxc            
	test                       

	7                6457      
	---------------------------
 */
```