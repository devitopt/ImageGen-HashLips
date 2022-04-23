"use strict";

const path = require("path");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const { NETWORK } = require(path.join(basePath, "constants/network.js"));
const fs = require("fs");
var JSONStream = require("JSONStream");

console.log(path.join(basePath, "/src/config.js"));
const {
  baseUri,
  description,
  namePrefix,
  network,
  solanaMetadata,
} = require(path.join(basePath, "/src/config.js"));

// read json data
// let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
// var data = JSON.parse(rawdata);

var stream = fs.createReadStream(`${basePath}/build/json/_metadata.json`, {
  encodig: "utf8",
});
var parser = JSONStream.parse("*");
var array = [];

stream.pipe(parser);
parser.on("data", function (item) {
  item.description = description;
  item.image = `${baseUri}/${item.name}`;
  fs.writeFileSync(
    `${basePath}/build/json/${item.edition}.json`,
    JSON.stringify(item, null, 2)
  );
  array.push(JSON.stringify(item, null, 2));
});

const createMetaData = async () => {
  fs.writeFileSync(`${basePath}/build/json/_metadata.json`, "[");
};

const appendMetaData = async (str, index) => {
  if (index) str = str + ",\n";
  fs.appendFileSync(`${basePath}/build/json/_metadata.json`, str);
};

const endMetaData = async () => {
  fs.appendFileSync(`${basePath}/build/json/_metadata.json`, "]");
};

parser.on("end", function (event) {
  createMetaData();
  array.forEach((item, index) => {
    appendMetaData(item, index < array.length - 1);
  });
  endMetaData();
});

// data.forEach((item) => {
//   if (network == NETWORK.sol) {
//     item.name = `${namePrefix} #${item.edition}`;
//     item.description = description;
//     item.creators = solanaMetadata.creators;
//   } else {
//     // item.name = `${namePrefix} #${item.edition}`;
//     item.description = description;
//     item.image = `${baseUri}/${item.name}`;
//   }
//   fs.writeFileSync(
//     `${basePath}/build/json/${item.edition}.json`,
//     JSON.stringify(item, null, 2)
//   );
// });

// fs.writeFileSync(
//   `${basePath}/build/json/_metadata.json`,
//   JSON.stringify(data, null, 2)
// );

if (network == NETWORK.sol) {
  console.log(`Updated description for images to ===> ${description}`);
  console.log(`Updated name prefix for images to ===> ${namePrefix}`);
  console.log(
    `Updated creators for images to ===> ${JSON.stringify(
      solanaMetadata.creators
    )}`
  );
} else {
  console.log(`Updated baseUri for images to ===> ${baseUri}`);
  console.log(`Updated description for images to ===> ${description}`);
  console.log(`Updated name prefix for images to ===> ${namePrefix}`);
}
