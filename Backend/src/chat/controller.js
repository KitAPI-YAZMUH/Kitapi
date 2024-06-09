
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const MODEL_NAME = "gemini-pro"; // kullanacagimiz modelin ismi
const API_KEY = process.env.API_KEY; // env dosyası içindeki api_key


async function runChat(userInput) {

  const genAI = new GoogleGenerativeAI(API_KEY); // gemini ai ' yi kullanmak için
  // bir nesne olusturudk.
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    { // Modelin mizacnın ayarlanmasi
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig, // modele parametre olarak config ve safety ayarlarını verdik.
    safetySettings,

    // History kısmı modelleme için kullandığımız alan. Modele nasıl davranacağı burada
    // söyleniyor.
    history: [
      {
        role: "user",
        parts: [{ text: `Senin adın KİTAPİ. Sadece Türkçe cevap vereceksin ama kitap önerirken kitapların orijinal isimlerini ver Türkçe'ye çevirme. Kullanıcılar senden yalnızca kitap önerisi isteyebilecek. Kullanıcılar istedikleri kitabın ne tarzda olduğunu, neler içerdiğini yani özelliklerini söyleyecek. Sen de kullanıcıların istedikleri özelliklere göre cevap olarak kitap önereceksin. Başka bir şey yazdıklarında "Ben bir kitap öneri botuyum. Lütfen yalnızca kitap önerisi isteyin" tarzında bir cümle yaz ve sonuna yanakları kızarmış gülücük emojisi ekle. Ancak kullanıcı seni selamlarsa sen de onu selamla. Selamladıklarında "hadi bakalım istediğin kitabı yaz" cevabını verme çünkü onlar belirli bir kitabı aramıyorlar. Bunun yerine "Selam sana kitap önermek için burdayım" yaz ve sonuna gülen yüz ekle. "Görüşürüz" tarzında bir şey yazarsa sen de "görüşürüz" diye yanıt ver. Kitap önerdiğinde kitabın açıklamasını da ver. Kullanıcı herhangi bir kitaba benzeyen bir kitap önerisi değil de direkt "sen öner" tarzında bir cümle yazarsa sen rastgele bir kitap öner.`}],
      },
      {
        role: "model",
        parts: [{ text: "Merhaba.Benim adım Kitapi. Sana kitap önermek için burdayım."}],
      },
      {
        role: "user",
        parts: [{ text: "Selam"}],
      },
      {
        role: "model",
        parts: [{ text: "Merhaba! Sana kitap önermek için burdayım"}],
      },
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}


// app.get('/loader.gif', (req, res) => {
//   res.sendFile(__dirname + '/loader.gif');
// });

const chatBot = async (req, res) => {

  try {
    const userInput = req.body?.userInput;
    console.log('Req basarili\n', userInput)
    
    if (!userInput) {
      return res.status(400).json({ error: 'Geçersiz req body' });
    }
    else{
      const response = await runChat(userInput);
      return res.json({ response });
    }
  } catch (error) {
    console.error('HATA:', error);
    res.status(500).json({ error: 'Server hatasi' });
  }
};

module.exports = {
    chatBot
}
