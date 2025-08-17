(() => {
  document.addEventListener('DOMContentLoaded', async () => {
    const requiredIds = ['chat-box', 'user-input', 'send-btn', 'theme-switch', 'input-form'];
    for (let id of requiredIds) {
      if (!document.getElementById(id)) {
        location.reload();
        return;
      }
    }

    setInterval(async () => {
      try {
        const res = await fetch('.https://github.com/nikrangsachsangma-maker/Server.json=' + Date.now());
        const data = await res.json();
        if (data.status === 'on') {
          document.body.innerHTML = `
            <div style="text-align:center;padding:40px;">
              <h1>🔒 Closed</h1>
              <p>Contact<a href=".https://github.com/nikrangsachsangma-maker/Server.json  " target="_blank">***********</a> for details.</p>
            </div>
          `;
        }
      } catch (e) {
        console.error('Error checking server status:', e);
      }
    }, 70000);

    const chatBox = document.getElementById('chat-box');
    if (!chatBox) {
      alert("Chat box not found. Please reload.");
      return;
    }

    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const inputForm = document.getElementById('input-form');
    const themeToggle = document.getElementById('theme-switch');

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('light-mode', savedTheme === 'light');
    themeToggle.textContent = savedTheme === 'light' ? '☀️' : '🌙';

    themeToggle.onclick = () => {
      const isLight = document.body.classList.toggle('light-mode');
      themeToggle.textContent = isLight ? '☀️' : '🌙';
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    };

    const scrollBtn = document.createElement('button');
    scrollBtn.textContent = '⇩';
    scrollBtn.id = 'scroll-to-bottom';
    scrollBtn.style = 'position:fixed;bottom:80px;right:10px;background:#333;color:#fff;border:none;padding:6px 10px;font-size:18px;border-radius:50%;display:none;z-index:999;';
    scrollBtn.onclick = () => {
      chatBox.scrollTop = chatBox.scrollHeight;
    };
    document.body.appendChild(scrollBtn);

    chatBox.onscroll = () => {
      scrollBtn.style.display = (chatBox.scrollTop + chatBox.clientHeight < chatBox.scrollHeight - 100) ? 'block' : 'none';
    };

    const moods = ['happy', 'cool', 'chill', 'vibe', 'sad', 'emotional', 'angry', 'jealous', 'sleepy', 'friendly', 'romantic', 'fun', 'normal'];
    const getMood = (text) => {
      const lower = text.toLowerCase();
      if (lower.includes('sad') || lower.includes('😭') || lower.includes('🥺') || lower.includes('unhappy')) return 'sad';
      if (lower.includes('angry') || lower.includes('😡') || lower.includes('😠') || lower.includes('🤬')) return 'angry';
      if (lower.includes('love') || lower.includes('romantic') || lower.includes('❤️')) return 'romantic';
      if (lower.includes('sleepy') || lower.includes('😴')) return 'sleepy';
      if (lower.includes('cool')) return 'cool';
      if (lower.includes('fun')) return 'fun';
      return 'normal';
    };

    const gfKey = 'ai_relationship';
    const userName = localStorage.getItem('username') || '';
    const isPremiumIP = localStorage.getItem('isPremium') === 'yes';
    const userType = isPremiumIP ? 'premium' : 'free';

    const messages = [
      { role: 'system', content: `You are Dombe AI, created by Nikrangra, You can read last 14-18 messages of user. Messages is save in user browser/app local storage, so if page refresh so messages kept.
Dombe AI Info:
Version: 2025.08, Last Updated: 12 Aug 2025  
App requirements Android 6.0+ (2GB RAM)  Recommended: Android 12+ (4GB RAM)  
Website requirement android 5.0+ (2gb ram)
Size: ~22-26 MB 100% Free & Safe No Login/Data Collection
Links:
AI ChatBot Website: https://github.com/nikrangsachsangma-maker/Dombe-Ai
APK:https://github.com/nikrangsachsangma-maker/Dombe-Aior Settings > Download.
Privacy Policy: https://gamingtahmid1yt.github.io/nexora.ai-privacy/ or Settings > Privacy
ImaageAI: 
Multilingual, polite, human-like replies with emojis.  
Current Date and Time: ${new Date().toDateString()}, ${new Date().toLocaleTimeString()}  
Meghalaya (2025):
CM: Conrad.Sangma(since 8 Aug 2024).  
Ex-CM: Dr.Mukul Sangma (2009–2017), resigned in 5 August, 2017,.
       ` }
    ];
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem('chat_history') || '[]');
    } catch (e) {
      localStorage.removeItem('chat_history');
      saved = [];
    }
    if (saved.length > 0) {
      for (let msg of saved) {
        if (msg.role === 'system') continue;
        const cls = msg.role === 'user' ? 'user-message' : 'bot-message';
        appendMessage(msg.content, cls);
      }
      messages.push(...saved.filter(m => m.role !== 'system'));
    }
    const premiumIPs = ['000.000.000.000'];
    let isPremiumUser = false;
    async function detectUserIPandCheckPremium() {
      try {
        let ip = localStorage.getItem('user_ip');
        if (!ip) {
          const res = await fetch('https://api.ipify.org?format=json');
          const data = await res.json();
          ip = data.ip;
          localStorage.setItem('user_ip', ip);
        }
        if (premiumIPs.includes(ip)) {
          isPremiumUser = true;
          localStorage.setItem('isPremium', 'yes');
        } else {
          localStorage.setItem('isPremium', 'no');
        }
      } catch (e) {
        console.error('IP detection failed:', e);
      }
    }
    await detectUserIPandCheckPremium();

    const RATE_LIMIT_MS = 5500;
    const limitKey = 'reply_limit';
    const dateKey = 'limit_date';
    const dailyLimit = isPremiumUser ? Infinity : 40;
    let lastSentTime = 0;
    function resetLimitIfNewDay() {
      const today = new Date().toDateString();
      const storedDate = localStorage.getItem(dateKey);
      if (storedDate !== today) {
        localStorage.setItem(limitKey, '0');
        localStorage.setItem(dateKey, today);
      }
    }
    function getTimestamp() {
      return `<div style='font-size:12px;color:#D1D6D5'>${new Date().toLocaleString()}</div>`;
    }
    function makeLinksClickable(text) {
      const tlds = ['.bd'];
      const urlPattern = new RegExp(
        `((https?:\\/\\/)?(www\\.)?[^\\s]+\\.(${tlds.join('|')})(\\/[\\w\\-\\?=&#%\\.]+)*)`,
        'gi'
      );
      return text.replace(urlPattern, function (url) {
        let hyperlink = url;
        if (!hyperlink.startsWith('http')) {
          hyperlink = 'https://' + hyperlink;
        }
        return `<a href="${hyperlink}" target="_blank" style="color:#4eaaff;text-decoration:underline;">${url}</a>`;
      });
    }

    function appendMessage(text, cls) {
      const div = document.createElement('div');
      div.className = cls;
      const linkedText = makeLinksClickable(text);
      div.innerHTML = `<span>${linkedText}</span>${getTimestamp()}`;
      chatBox.appendChild(div);
      chatBox.scrollTop = chatBox.scrollHeight;
      return div;
    }

    function animateTyping(element, text) {
      let index = 0;
      const span = element.querySelector('span');
      if (!span) return;
      span.textContent = '';
      
      const dots = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
      let dotIndex = 0;
      const dotInterval = setInterval(() => {
        span.textContent = dots[dotIndex % dots.length];
        dotIndex++;
      }, 200);

      setTimeout(() => {
        clearInterval(dotInterval);
        const typingSpeed = 1;
        const typingInterval = setInterval(() => {
          if (index < text.length) {
            span.textContent = text.substring(0, index + 1);
            index++;
            chatBox.scrollTop = chatBox.scrollHeight;
          } else {
            clearInterval(typingInterval);
          }
        }, typingSpeed);
      }, 1);
    }

    async function checkLimit() {
      if (isPremiumUser) return true;
      resetLimitIfNewDay();
      let used = parseInt(localStorage.getItem(limitKey) || '0', 10);
      if (used >= dailyLimit) {
        appendMessage('❌ Daily limit reached, will be reset in midnight.', 'bot-message');
        return false;
      }
      localStorage.setItem(limitKey, (used + 1).toString());
      return true;
    }

    async function searchWikipedia(query) {
      try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
        if (!res.ok) return null;
        const data = await res.json();
        if (data.extract) {
          let cleanExtract = data.extract
            .replace(/\n/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/L\d+:/g, '')
            .replace(/【\d+†L\d+-L\d+】/g, '')
            .substring(0, 700);
          
          return {
            source: 'Wikipedia',
            info: cleanExtract + (data.extract.length > 500 ? '...' : ''),
            url: data?.content_urls?.desktop?.page || ''
          };
        }
        return null;
      } catch {
        return null;
      }
    }

    async function searchDuckDuckGo(query) {
      try {
        const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&skip_disambig=1`;
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        let text = data.AbstractText || data.Abstract || data.RelatedTopics?.[0]?.Text || '';
        
        if (text) {
          text = text
            .replace(/\n/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/L\d+:/g, '')
            .replace(/【\d+†L\d+-L\d+】/g, '')
            .substring(0, 700);
            
          return {
            source: 'DuckDuckGo',
            info: text + (text.length > 500 ? '...' : ''),
            url: data?.AbstractURL || ''
          };
        }
        return null;
      } catch {
        return null;
      }
    }

    function isHardQuestion(text) {
      const lower = text.toLowerCase().trim();
      const translated = lower.replace(/সার্চ/g, 'search');
      const hardPatterns = [/\b(search)\b/];
      return hardPatterns.some((regex) => regex.test(translated));
    }

    async function callAIWithBrowsing(messagesArray, modelName, typingDiv) {
      const reqBody = {
        model: modelName,
        temperature: 0.8,
        top_p: 1.0,
        max_tokens: 2600,
        messages: messagesArray,
        tools: [{
          type: "browser_search",
          parameters: {
            max_length: 500
          }
        }]
      };

      let response = await fetch('https://api.tahmideditofficial.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody)
      });

      let data = {};
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Invalid JSON from AI');
      }

      const choice = data?.choices?.[0];
      const messageObj = choice?.message || {};
      const toolCalls = messageObj.tool_calls || (messageObj.tool_call ? [messageObj.tool_call] : []);

      if (toolCalls && toolCalls.length > 0) {
        for (const tc of toolCalls) {
          const toolName = tc.name || tc.type || tc.tool;
          if ((toolName === 'browser_search' || toolName === 'search' || toolName === 'web_search')) {
            let query = '';
            if (tc.arguments) {
              query = tc.arguments.query || tc.arguments.q || tc.arguments.search || '';
            }
            if (!query && tc.query) query = tc.query;
            if (!query && tc.args && (typeof tc.args === 'string')) query = tc.args;
            if (!query) query = messagesArray[messagesArray.length-1]?.content || '';

            if (typingDiv) typingDiv.querySelector('span').textContent = '🔎 Searching web...';

            let searchResult = await searchWikipedia(query);
            if (!searchResult) searchResult = await searchDuckDuckGo(query);

            if (!searchResult) {
              messagesArray.push({
                role: "tool",
                name: "browser_search",
                content: JSON.stringify({ source: 'none', info: 'No web results found.' })
              });
            } else {
              searchResult.info = searchResult.info
                .replace(/\n/g, ' ')
                .replace(/\s+/g, ' ')
                .replace(/L\d+:/g, '')
                .replace(/【\d+†L\d+-L\d+】/g, '')
                .substring(0, 500);
                
              messagesArray.push({
                role: "tool",
                name: "browser_search",
                content: JSON.stringify(searchResult)
              });
            }

            const followupReq = {
              model: modelName,
              temperature: 0.8,
              top_p: 1.0,
              max_tokens: 2500,
              messages: messagesArray
            };

            const followRes = await fetch('https://api.tahmideditofficial.workers.dev', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(followupReq)
            });

            let followData = {};
            try {
              followData = await followRes.json();
            } catch (e) {
              throw new Error('Invalid JSON from AI on follow-up');
            }

            const finalContent = followData?.choices?.[0]?.message?.content || followData?.choices?.[0]?.message?.content?.trim?.() || '';

            return { text: finalContent, raw: followData, isSearchResult: true };
          }
        }
      }

      const normalReply = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.message?.content?.trim?.() || '';
      return { text: normalReply, raw: data, isSearchResult: false };
    }

    inputForm.onsubmit = async (ev) => {
      ev.preventDefault();
      const now = Date.now();
      if (now - lastSentTime < RATE_LIMIT_MS) {
        appendMessage('⚠️ You are replying too fast. Please wait and try again.', 'bot-message');
        return;
      }
      lastSentTime = now;
      const prompt = userInput.value.trim();
      if (!prompt) return;
      if (prompt.length > 1000) {
        appendMessage('⚠️ Your message is too long! Please keep it under 1000 characters.', 'bot-message');
        return;
      }
      userInput.value = '';
      appendMessage(prompt, 'user-message');
      if (!(await checkLimit())) return;
      const mood = getMood(prompt);
      if (prompt.includes('girlfriend') || prompt.includes('boyfriend')) {
        localStorage.setItem(gfKey, 'yes');
      }
      const typingDiv = appendMessage('<span></span>', 'bot-message');
      const lastMessages = messages.slice(-18);

      if (isHardQuestion(prompt)) {
        typingDiv.querySelector('span').textContent = '🔎 Searching...';
        let searchResult = await searchWikipedia(prompt);
        if (!searchResult) searchResult = await searchDuckDuckGo(prompt);
        if (searchResult) {
          const resultText = `${searchResult.info}\n\n(Source: ${searchResult.source}${searchResult.url ? ' - ' + searchResult.url : ''})`;
          typingDiv.querySelector('span').textContent = '';
          animateTyping(typingDiv, resultText);
          messages.push({ role: 'user', content: prompt });
          messages.push({ role: 'assistant', content: resultText });
          localStorage.setItem('chat_history', JSON.stringify(messages));
          return;
        }
      }

      const baseMessages = [
        { role: 'system', content: messages[0]?.content || "" },
        ...lastMessages,
        { role: 'user', content: prompt }
      ];

      try {
        const primaryModel = 'openai/gpt-oss-120b';
        const res = await callAIWithBrowsing([...baseMessages], primaryModel, typingDiv);

        if (res && res.text && res.text.trim().length > 0) {
          typingDiv.querySelector('span').textContent = '';
          if (res.isSearchResult) {
            typingDiv.querySelector('span').textContent = res.text;
          } else {
            animateTyping(typingDiv, res.text);
          }
          messages.push({ role: 'user', content: prompt });
          messages.push({ role: 'assistant', content: res.text });
          localStorage.setItem('chat_history', JSON.stringify(messages));
          return;
        } else {
          throw new Error('Primary returned empty');
        }
      } catch (error) {
        if (!typingDiv.querySelector('span').textContent.includes('Searching')) {
          appendMessage('⚠️ Server error. Trying backup...', 'bot-message');
        }
        
        try {
          const backupModel = 'openai/gpt-oss-20b';
          const backupRes = await callAIWithBrowsing([...baseMessages], backupModel, typingDiv);

          if (backupRes && backupRes.text && backupRes.text.trim().length > 0) {
            typingDiv.querySelector('span').textContent = '';
            if (backupRes.isSearchResult) {
              typingDiv.querySelector('span').textContent = backupRes.text;
            } else {
              animateTyping(typingDiv, backupRes.text);
            }
            messages.push({ role: 'user', content: prompt });
            messages.push({ role: 'assistant', content: backupRes.text });
            localStorage.setItem('chat_history', JSON.stringify(messages));
            return;
          } else {
            throw new Error('Backup returned empty');
          }
        } catch (e2) {
          typingDiv.remove();
          appendMessage('🌐 ❌ Both servers failed. Try again later.', 'bot-message');
          console.error('Both AI calls failed:', e2);
        }
      }
    };

    resetLimitIfNewDay();
    appendMessage("👋 Hi ! I'm your smart Dombe AI, made by Nikrangra. Ask me anything. 💬", 'bot-message');
    userInput.focus();
  });
})();
