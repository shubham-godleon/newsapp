const articles = [
  {
    title: "राजकीय प्राथमिक विद्यालय भंगेड़ी १ विवाद मामले में दिलचस्प खुलासा",
    category: "All",
    video:
      "https://drive.google.com/file/d/1Ed-QWh9mcDIMc-aGIoF_9_mE-xC_SM1z/preview",
    description:
      "रुड़की: राजकीय प्राथमिक विद्यालय भंगेड़ी १ में सहायक अध्यापक अमरीन नाज़ द्वारा खड़े किए गए विवाद के मामले में एक दिलचस्प खुलासा हुआ है । बंगेरी निवासियो का कहना है की प्रधानाध्यापक के १७ साल के कार्यकाल के दौरान विद्यालय पूर्ण रूप से सही स्तथि में चलता रहा है अतः सहायक अध्यापक अमरीन नाज़ के आने के बाद से ही विद्यालय का माहोल खराब हुआ है । प्रधानाध्यापक जयंती ठाकुर द्वारा ये भी बताया गया की उनको विद्यालय में सहायक अध्यापक अमरीन नाज़ के बुलाये गए लोगों द्वारा धमकी दी गई, वे भोजनमाता जो की एक वृद्ध महिला है उनसे बदतमीज़ी से पेश आती है और उनसे अपने निजी काम करवाती है । कक्षा के समय मोबाइल पर बात करती है अतः पढ़ने-पढ़ाने में कोई दिलचस्पी नहीं दिखाती, उनके पूर्व प्रधानाध्यापक भी उनके व्यवहार से परेशान थे ।",
  },
];

function renderNews(category = "all") {
  const container = document.getElementById("newsContent");
  container.innerHTML = "";
  articles
    .filter((a) => category === "all" || a.category === category)
    .forEach((a) => {
      container.innerHTML += `
        <div class="article">
          <h2>${a.title}</h2>
          <iframe src="${a.video}" width="70%" height="315" allow="autoplay; encrypted-media" 
                allowfullscreen></iframe>
          <p>${a.description}</p>
        </div>
      `;
    });

  container.innerHTML += `
    <h2>अन्य समाचार</h2>
    <div id="externalNews">Loading...</div>
  `;
  fetchNDTVNews();
}

// Fetch NDTV RSS feed using rss2json
function fetchNDTVNews() {
  // Hindi top stories RSS
  const rssUrl = "https://feeds.feedburner.com/ndtvkhabar-latest";
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
    rssUrl
  )}`;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      const externalContainer = document.getElementById("externalNews");
      externalContainer.innerHTML = "";
      data.items.slice(0, 6).forEach((news) => {
        let imgSrc = "";

        if (news.thumbnail) {
          imgSrc = news.thumbnail;
        } else if (news.enclosure && news.enclosure.link) {
          imgSrc = news.enclosure.link;
        } else {
          // extract first image from content if available
          const match = news.content.match(/<img[^>]+src="([^">]+)"/);
          if (match) imgSrc = match[1];
        }

        externalContainer.innerHTML += `
          <div class="external-article">
            <a href="${news.link}" target="_blank">
              <img src="${
                imgSrc || "placeholder.jpg"
              }" alt="News Image" class="external-thumb">
              <div class="external-text">
                <h3>${news.title}</h3>
                <p>${news.pubDate.split(" ")[0]}</p>
              </div>
            </a>
          </div>
        `;
      });
    })
    .catch((err) => {
      document.getElementById("externalNews").innerHTML =
        "NDTV हिंदी समाचार लोड नहीं हो पाया।";
      console.error(err);
    });
}

function filterNews(cat) {
  renderNews(cat);

  // On mobile, close sidebar when a category is clicked
  document.getElementById("sidebar").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

// Sidebar toggle
document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
});

// Close sidebar when overlay is clicked
document.getElementById("overlay").addEventListener("click", () => {
  document.getElementById("sidebar").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
});

document.addEventListener("DOMContentLoaded", () => {
  const whatsappBtn = document.getElementById("whatsappShare");
  if (whatsappBtn) {
    whatsappBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const pageUrl = encodeURIComponent(window.location.href);
      const message = encodeURIComponent(
        "*इस न्यूज़ को देखें: \n राजकीय प्राथमिक विद्यालय भंगेड़ी १ विवाद मामले में दिलचस्प खुलासा \n*"
      );
      const whatsappUrl = `https://wa.me/?text=${message}${pageUrl}`;
      window.open(whatsappUrl, "_blank");
    });
  }
});

// Initial load
renderNews();
