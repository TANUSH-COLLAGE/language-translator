import React, { useState } from 'react';
import axios from 'axios';
import './index.css';
import backgroundImage from './assets/image.png';

const App = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLang, setFromLang] = useState('detect');
  const [toLang, setToLang] = useState('hi');

  const languages = {
    detect: '🌐 Detect',
    en: 'English',
    hi: 'Hindi',
    bn: 'Bengali',
    fr: 'French',
    es: 'Spanish',
    de: 'German',
    it: 'Italian',
    ru: 'Russian',
    'zh-CN': 'Chinese (Simplified)'
  };

  const handleTranslate = async () => {
    if (!text) {
      alert("Please enter some text to translate.");
      return;
    }

    let sourceLang = fromLang;

    if (fromLang === 'detect') {
      try {
        const detectOptions = {
          method: 'POST',
          url: 'https://google-translator9.p.rapidapi.com/v2/detect',
          headers: {
            'x-rapidapi-key': '53d178ceb2msh38f690d27a81287p155656jsnfb8528029b19',
            'x-rapidapi-host': 'google-translator9.p.rapidapi.com',
            'Content-Type': 'application/json'
          },
          data: { q: text }
        };

        const detectRes = await axios.request(detectOptions);
        const detectedLang = detectRes.data?.data?.detections?.[0]?.language;

        if (!detectedLang) {
          setTranslatedText("⚠ Language detection failed.");
          return;
        }

        sourceLang = detectedLang;
        console.log("🔍 Detected language:", detectedLang);
      } catch (err) {
        console.error("❌ Detection error:", err);
        setTranslatedText("⚠ Could not detect language.");
        return;
      }
    }

    // Translation using RapidAPI Google Translator
    try {
      const options = {
        method: 'POST',
        url: 'https://google-translator9.p.rapidapi.com/v2',
        headers: {
          'x-rapidapi-key': '53d178ceb2msh38f690d27a81287p155656jsnfb8528029b19',
          'x-rapidapi-host': 'google-translator9.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        data: {
          q: text,
          source: sourceLang,
          target: toLang,
          format: 'text'
        }
      };

      const response = await axios.request(options);
      const result = response.data?.data?.translations?.[0]?.translatedText;

      setTranslatedText(result || "❌ Translation failed.");
    } catch (error) {
      console.error("❌ Translation Error:", error);
      setTranslatedText("⚠ Translation failed.");
    }
  };

  const handleSwitch = () => {
    if (fromLang === 'detect') {
      alert("Can't switch when language is set to 'Detect'.");
      return;
    }
    const temp = fromLang;
    setFromLang(toLang);
    setToLang(temp);
    setTranslatedText('');
  };

  const handleClear = () => {
    setText('');
    setTranslatedText('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    alert("Text copied!");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>

      <div className="z-10 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 max-w-md w-full text-center">
        <h2 className="text-3xl font-extrabold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600">
          Language Translator
        </h2>

        <textarea
          rows="3"
          className="w-full border border-transparent focus:border-purple-500 focus:ring focus:ring-purple-200 p-3 rounded-lg mb-3 transition-all duration-200"
          placeholder="Hello Developer, how are you?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex items-center justify-between mb-3">
          <select
            value={fromLang}
            onChange={(e) => setFromLang(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-[45%] focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {Object.entries(languages).map(([code, label]) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>

          <button
            onClick={handleSwitch}
            className="text-2xl font-bold text-blue-600 hover:text-purple-600 transition duration-300"
          >
            ↔
          </button>

          <select
            value={toLang}
            onChange={(e) => setToLang(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-[45%] focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {Object.entries(languages)
              .filter(([code]) => code !== 'detect')
              .map(([code, label]) => (
                <option key={code} value={code}>{label}</option>
              ))}
          </select>
        </div>

        <h3 className="text-left font-medium text-gray-700 mb-1">Translation:</h3>
        <div className="bg-gradient-to-br from-gray-100 to-white border border-gray-300 p-3 rounded-lg min-h-[60px] text-left mb-3 shadow-inner">
          {translatedText || '...'}
        </div>

        <div className="flex justify-between gap-3 mb-3">
          <button
            onClick={handleCopy}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded font-semibold hover:from-green-400 hover:to-emerald-400 w-full transition-all duration-300"
          >
            ✅ Copy
          </button>
          <button
            onClick={handleClear}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded font-semibold hover:from-red-400 hover:to-pink-400 w-full transition-all duration-300"
          >
            🧹 Clear
          </button>
        </div>

        <button
          onClick={handleTranslate}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-2 rounded-lg font-semibold transition-all duration-300"
        >
          🔁 Translate
        </button>
      </div>
    </div>
  );
};

export default App;
