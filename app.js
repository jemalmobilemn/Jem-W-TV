// ቻናሎች በራስ-ሰር 2000+ ማመንጨት
while (tvChannels.length < 2050) {
  const country = countriesList[Math.floor(Math.random() * countriesList.length)];
  const category = categoriesList[Math.floor(Math.random() * categoriesList.length)];
  const base = baseStreams[Math.floor(Math.random() * baseStreams.length)];
  
  tvChannels.push({
    id: idCounter,
    code: `CH${idCounter}`,
    name: `${country} ${category} ${idCounter}`,
    country: country,
    category: category,
    streamUrl: base.streamUrl // ከመሠረት ቻናል የተወሰደ
  });
  idCounter++;
}
