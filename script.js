const quizQuestions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Lisbon"],
    answer: "Paris"
  },
  {
    question: "What planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answer: "Mars"
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
    answer: "William Shakespeare"
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    answer: "Pacific"
  },
  {
    question: "Which gas do plants use for photosynthesis?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    answer: "Carbon Dioxide"
  }
];

function loadQuiz() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";
  quizQuestions.forEach((q, index) => {
    const block = document.createElement("div");
    block.className = "quiz-block";
    block.innerHTML = `<p><strong>${index + 1}. ${q.question}</strong></p>`;
    q.options.forEach(opt => {
      block.innerHTML += `
        <label>
          <input type="radio" name="q${index}" value="${opt}"/> ${opt}
        </label><br/>
      `;
    });
    container.appendChild(block);
  });
}

function submitQuiz() {
  let score = 0;
  quizQuestions.forEach((q, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    if (selected && selected.value === q.answer) {
      score++;
    }
  });
  const result = document.getElementById("quiz-result");
  result.textContent = `✅ You got ${score} out of ${quizQuestions.length} correct.`;
  result.style.color = score >= 3 ? "blue" : "red";
  result.classList.add("show");
}

window.onload = loadQuiz;

function getWeather() {
  const lat = 28.61, lon = 77.23;
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max,sunrise,sunset,uv_index_max&timezone=auto`)
    .then(res => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then(data => {
      const current = data.current_weather;
      const daily = data.daily;
      const weatherOutput = document.getElementById("weather-output");

      let forecast = daily.time.slice(0, 3).map((date, i) => {
        const sunrise = daily.sunrise[i].split("T")[1];
        const sunset = daily.sunset[i].split("T")[1];
        return (
          `📅 ${date}\n` +
          `🌡 Max: ${daily.temperature_2m_max[i]}°C | Min: ${daily.temperature_2m_min[i]}°C\n` +
          `💨 Wind: ${daily.windspeed_10m_max[i]} km/h | ☀️ Sunrise: ${sunrise} | 🌇 Sunset: ${sunset}\n` +
          `🔆 UV Index (max): ${daily.uv_index_max[i]}\n\n`
        );
      }).join("");

      weatherOutput.textContent = 
        `📍 Location: (${lat}, ${lon})\n` +
        `🌡 Temp: ${current.temperature}°C | 💨 Wind: ${current.windspeed} km/h\n\n` +
        `🔮 3-Day Forecast:\n${forecast}`;
    })
    .catch(err => {
      document.getElementById("weather-output").textContent = "⚠️ Error fetching weather data.";
      console.error("Weather API error:", err);
    });
}
