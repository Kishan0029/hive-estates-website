const fs = require("fs");
let data = fs.readFileSync("src/lib/data.ts", "utf8");
data = data.replace(/\\\`/g, "`").replace(/\\\$/g, "$");
fs.writeFileSync("src/lib/data.ts", data);
