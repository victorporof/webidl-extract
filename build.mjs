import fs from "fs";

const src = fs.readFileSync("./spec/uievents/index.bs", "utf-8");
const expanded = src.replace(/<pre class="include">\s*path: (.+?)\s*<\/pre>/g, (_, p1) =>
  fs.readFileSync(`./spec/uievents/${p1}`, "utf-8")
);

console.log(expanded);
