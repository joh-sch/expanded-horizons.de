"use strict";

const toWords = (str) =>
  str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .trim()
    .toLowerCase()
    .split(/\s+/);

function toCamelCase(str) {
  const words = toWords(str);
  return (
    words[0] +
    words
      .slice(1)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("")
  );
}

function toPascalCase(str) {
  return toWords(str)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function toKebabCase(str) {
  return toWords(str).join("-");
}

function toSnakeCase(str) {
  return toWords(str).join("_");
}

function toTitleCase(str) {
  return toWords(str)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

module.exports = { toCamelCase, toPascalCase, toKebabCase, toSnakeCase, toTitleCase };
