// Визначаю маркер, який буде вставлений перед початком секректного файлу
const marker = Buffer.from("---FILE_START---");

function hide(coverData, secretData) {
  console.log("Розмір вхідного:", Buffer.byteLength(coverData), "bytes");
  console.log("Розмір секретного:", Buffer.byteLength(secretData), "bytes");

  const newImageData = Buffer.concat([coverData, marker, secretData]);

  console.log(
    "Розмір скомбінованого:",
    Buffer.byteLength(newImageData),
    "bytes"
  );
  return newImageData;
}

function extract(combinedData) {
  const markerIndex = combinedData.indexOf(marker);

  // Якщо маркер не знайдений, виводимо помилку
  if (markerIndex === -1) {
    console.error("Маркер не знайдено, файл не може бути витягнутий.");
  }

  return combinedData.slice(markerIndex + marker.length);
}

module.exports = {
  hide,
  extract,
};
