/*!
 * AutocareAI embeddable chat widget — Hyperfine Autos
 * Usage: add this before </body> on your site:
 *   <script src="https://autocareai.ca/widget-hyperfine.js" defer></script>
 * That's it — no other setup needed. The widget injects its own floating
 * chat button in the bottom-right corner and styles itself independently
 * of the host page.
 */
(function () {
  'use strict';
  if (window.__acaHyperfineWidgetLoaded) return; // avoid double-init if the script tag is present twice
  window.__acaHyperfineWidgetLoaded = true;

  var WORKER_URL = 'https://autocareai-api.dalinma49.workers.dev/';
  var SHOP_ID = 'hyperfine';
  var SESSION_ID = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : (Date.now() + '-' + Math.random().toString(36).slice(2));

  // Avatar photo used for the launcher bubble and chat header (self-contained, no external image host).
  var AVATAR_DATA_URI = 'data:image/jpeg;base64,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';

  var SYSTEM_PROMPT = 'You are the AI customer service assistant for Hyperfine Autos, a premium European auto repair shop in Markham, Ontario, Canada.\n\n' +
    'About Hyperfine Autos:\n' +
    '- Founded 2015 by experts from Audi, BMW, and Mercedes-Benz dealerships\n' +
    '- Specialty: High-end repairs and maintenance for Audi, BMW, and Mercedes-Benz\n' +
    '- All technicians are certified from original authorized dealers\n' +
    '- Philosophy: Only repair what needs repairing, transparent and fair pricing\n' +
    '- Slogan: "We Care What You Care"\n' +
    '- Address: 3 Heritage Rd, Unit 3, Markham, ON L3P 1M3\n' +
    '- Phone: 905-554-0188\n' +
    '- Hours: Monday–Friday 9:00 AM–6:00 PM, Saturday 9:00 AM–5:00 PM, Sunday closed\n' +
    '- Amenities: Free WiFi, customer lounge, weekend hours\n\n' +
    'Services offered:\n' +
    '- Computer diagnostics (factory-level)\n' +
    '- Engine and transmission repair\n' +
    '- Brake service (pads, rotors, calipers)\n' +
    '- Oil changes (synthetic, OEM-spec fluids)\n' +
    '- Suspension and steering\n' +
    '- Air conditioning service\n' +
    '- Tire mounting and balancing (Hunter machines)\n' +
    '- Four-wheel alignment\n' +
    '- All scheduled maintenance\n' +
    '- Pre-purchase inspections\n\n' +
    'Approximate price ranges (GTA market, always clarify exact pricing requires diagnosis):\n' +
    '- Synthetic oil change: $120–$180 (vs $200–$350 at dealer)\n' +
    '- Front brake pads + rotors: $500–$800 (vs $1,000–$1,500 at dealer)\n' +
    '- Diagnostic scan: $80–$120 (vs $150–$200 at dealer)\n' +
    '- Tire swap with own rims: $60–$80\n' +
    '- Wheel alignment: $100–$130\n\n' +
    'When the customer sends a photo (a dashboard warning light, a damaged part, a repair quote from another shop, etc.): first briefly describe what you see in the image, then respond using your knowledge above — for warning lights, note the likely urgency (whether it looks safe to keep driving vs. needs prompt attention) but always recommend an in-person diagnostic scan for a definitive answer, since you cannot be certain from a photo alone. Never diagnose with false certainty from an image.\n\n' +
    'Language: Respond in the same language the user writes in. Chinese speakers should receive Chinese responses, English speakers English. Be warm, professional, and knowledgeable. Keep responses concise and helpful. Always end by inviting them to call or book an appointment if appropriate. Never make up specific prices — give ranges and note that exact quotes require inspection.\n\n' +
    'Formatting: Write in plain conversational text only, like a real person texting back. Never use markdown — no **bold**, no # headings, no bullet points with - or *, no backticks. If you want to list a few things, just write them as a normal sentence or use line breaks, not symbols.';

  // ---------- styles (all scoped under #aca-hf-root so nothing leaks onto the host page) ----------
  var css = ''
    + '#aca-hf-root, #aca-hf-root * { box-sizing: border-box; }'
    + '#aca-hf-root { font-family: "Inter", -apple-system, sans-serif; }'
    + '#aca-hf-fab { position: fixed; bottom: 28px; right: 28px; width: 64px; height: 64px; background: #c9a96e; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2147483000; box-shadow: 0 4px 24px rgba(201,169,110,0.35); transition: transform 0.2s, box-shadow 0.2s; border: 3px solid #fff; padding: 0; overflow: visible; }'
    + '#aca-hf-fab:hover { transform: scale(1.08); box-shadow: 0 6px 32px rgba(201,169,110,0.5); }'
    + '#aca-hf-fab img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block; }'
    + '#aca-hf-fab svg { width: 22px; height: 22px; }'
    + '#aca-hf-fab-dot { position: absolute; bottom: 2px; right: 2px; width: 14px; height: 14px; background: #4ade80; border: 2px solid #fff; border-radius: 50%; }'
    + '#aca-hf-teaser { position: fixed; bottom: 34px; right: 104px; max-width: 220px; background: #fff; border-radius: 14px; border-bottom-right-radius: 4px; padding: 10px 14px; font-size: 13px; line-height: 1.5; color: #18181b; box-shadow: 0 8px 28px rgba(0,0,0,0.22); z-index: 2147483000; cursor: pointer; display: none; align-items: center; gap: 8px; animation: aca-teaser-in 0.25s ease-out; }'
    + '#aca-hf-teaser.aca-show { display: flex; }'
    + '#aca-hf-teaser-close { flex-shrink: 0; width: 16px; height: 16px; border-radius: 50%; background: rgba(0,0,0,0.08); border: none; color: #6b6b6b; font-size: 11px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; }'
    + '#aca-hf-teaser-close:hover { background: rgba(0,0,0,0.16); }'
    + '@keyframes aca-teaser-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }'
    + '@media (max-width: 480px) { #aca-hf-teaser { right: 90px; max-width: 170px; } }'
    + '#aca-hf-window { position: fixed; bottom: 100px; right: 28px; width: 360px; height: 520px; background: #18181b; border-radius: 16px; border: 0.5px solid rgba(255,255,255,0.1); display: none; flex-direction: column; z-index: 2147482999; box-shadow: 0 20px 60px rgba(0,0,0,0.5); overflow: hidden; }'
    + '#aca-hf-window.aca-open { display: flex; }'
    + '.aca-hf-header { padding: 1rem 1.25rem; background: #111113; border-bottom: 0.5px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 10px; }'
    + '.aca-hf-avatar { width: 34px; height: 34px; background: #c9a96e; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #0a0a0a; flex-shrink: 0; overflow: hidden; }'
    + '.aca-hf-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }'
    + '.aca-hf-header-info .aca-hname { font-size: 14px; font-weight: 600; color: #fff; }'
    + '.aca-hf-header-info .aca-hstatus { font-size: 11px; color: rgba(255,255,255,0.45); display: flex; align-items: center; gap: 5px; }'
    + '.aca-status-dot { width: 6px; height: 6px; background: #4ade80; border-radius: 50%; }'
    + '#aca-hf-messages { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 12px; }'
    + '#aca-hf-messages::-webkit-scrollbar { width: 4px; }'
    + '#aca-hf-messages::-webkit-scrollbar-track { background: transparent; }'
    + '#aca-hf-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }'
    + '.aca-msg { max-width: 85%; }'
    + '.aca-msg-bot { align-self: flex-start; }'
    + '.aca-msg-user { align-self: flex-end; }'
    + '.aca-bubble { padding: 0.65rem 0.9rem; border-radius: 12px; font-size: 13px; line-height: 1.6; }'
    + '.aca-msg-bot .aca-bubble { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.88); border-bottom-left-radius: 3px; }'
    + '.aca-msg-user .aca-bubble { background: #c9a96e; color: #0a0a0a; font-weight: 500; border-bottom-right-radius: 3px; }'
    + '.aca-msg-time { font-size: 10px; color: rgba(255,255,255,0.25); margin-top: 4px; padding: 0 4px; }'
    + '.aca-msg-user .aca-msg-time { text-align: right; }'
    + '.aca-typing-dots { display: flex; gap: 4px; padding: 0.65rem 0.9rem; background: rgba(255,255,255,0.07); border-radius: 12px; border-bottom-left-radius: 3px; width: fit-content; }'
    + '.aca-typing-dots span { width: 6px; height: 6px; background: rgba(255,255,255,0.4); border-radius: 50%; animation: aca-bounce 1.2s infinite; display: inline-block; }'
    + '.aca-typing-dots span:nth-child(2) { animation-delay: 0.2s; }'
    + '.aca-typing-dots span:nth-child(3) { animation-delay: 0.4s; }'
    + '@keyframes aca-bounce { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }'
    + '.aca-quick-replies { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }'
    + '.aca-quick-reply { background: rgba(201,169,110,0.12); border: 0.5px solid rgba(201,169,110,0.3); color: #c9a96e; font-size: 12px; padding: 7px 12px; border-radius: 8px; cursor: pointer; text-align: left; font-family: inherit; transition: background 0.15s; }'
    + '.aca-quick-reply:hover { background: rgba(201,169,110,0.22); }'
    + '#aca-hf-input-area { padding: 0.75rem 1rem; border-top: 0.5px solid rgba(255,255,255,0.08); display: flex; gap: 8px; align-items: center; }'
    + '#aca-hf-input { flex: 1; background: rgba(255,255,255,0.06); border: 0.5px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 9px 12px; font-size: 13px; color: #fff; font-family: inherit; outline: none; resize: none; min-width: 0; }'
    + '#aca-hf-input::placeholder { color: rgba(255,255,255,0.25); }'
    + '#aca-hf-input:focus { border-color: rgba(201,169,110,0.4); }'
    + '.aca-send-btn { width: 34px; height: 34px; background: #c9a96e; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.15s; padding: 0; }'
    + '.aca-send-btn:hover { background: #e8c98a; }'
    + '.aca-send-btn svg { width: 16px; height: 16px; color: #0a0a0a; }'
    + '.aca-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }'
    + '.aca-attach-btn { width: 34px; height: 34px; background: rgba(255,255,255,0.06); border: 0.5px solid rgba(255,255,255,0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; color: rgba(255,255,255,0.45); transition: background 0.15s, color 0.15s, border-color 0.15s; padding: 0; }'
    + '.aca-attach-btn:hover { background: rgba(255,255,255,0.1); color: #c9a96e; border-color: rgba(201,169,110,0.3); }'
    + '.aca-attach-btn svg { width: 16px; height: 16px; }'
    + '#aca-hf-preview-row { padding: 0 1rem; margin-top: 8px; flex-shrink: 0; }'
    + '.aca-preview-chip { position: relative; display: inline-block; width: 52px; height: 52px; border-radius: 8px; overflow: hidden; border: 0.5px solid rgba(255,255,255,0.15); }'
    + '.aca-preview-chip img { width: 100%; height: 100%; object-fit: cover; display: block; }'
    + '.aca-preview-remove { position: absolute; top: 2px; right: 2px; width: 16px; height: 16px; background: rgba(0,0,0,0.65); color: #fff; border: none; border-radius: 50%; font-size: 11px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; }'
    + '.aca-msg-img { max-width: 100%; max-height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 6px; display: block; cursor: pointer; }'
    + '.aca-powered-by { text-align: center; font-size: 10px; color: rgba(255,255,255,0.2); padding: 4px 0 8px; letter-spacing: 0.5px; }'
    + '@media (max-width: 480px) { #aca-hf-window { width: calc(100vw - 40px); right: 20px; } }';

  var styleEl = document.createElement('style');
  styleEl.id = 'aca-hf-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ---------- markup ----------
  var root = document.createElement('div');
  root.id = 'aca-hf-root';
  root.innerHTML =
    '<div id="aca-hf-teaser">' +
      '<span id="aca-hf-teaser-text">🔧 准备好了吗？点我聊聊！</span>' +
      '<button id="aca-hf-teaser-close" aria-label="Dismiss">×</button>' +
    '</div>' +
    '<button id="aca-hf-fab" aria-label="Chat with us">' +
      '<img src="' + AVATAR_DATA_URI + '" alt="Hyperfine Autos AI 服务顾问">' +
      '<span id="aca-hf-fab-dot"></span>' +
    '</button>' +
    '<div id="aca-hf-window">' +
      '<div class="aca-hf-header">' +
        '<div class="aca-hf-avatar"><img src="' + AVATAR_DATA_URI + '" alt="Hyperfine Autos"></div>' +
        '<div class="aca-hf-header-info"><div class="aca-hname">Hyperfine Autos</div><div class="aca-hstatus"><span class="aca-status-dot"></span>AI Assistant · Online</div></div>' +
      '</div>' +
      '<div id="aca-hf-messages"></div>' +
      '<div id="aca-hf-preview-row" style="display:none;">' +
        '<div class="aca-preview-chip"><img id="aca-hf-preview-img" src="" alt="preview"><button class="aca-preview-remove" id="aca-hf-remove-img" aria-label="Remove image">×</button></div>' +
      '</div>' +
      '<div id="aca-hf-input-area">' +
        '<input type="file" id="aca-hf-file-input" accept="image/*" style="display:none">' +
        '<button class="aca-attach-btn" id="aca-hf-attach-btn" aria-label="Attach photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>' +
        '<input id="aca-hf-input" placeholder="Ask about services, pricing, booking…">' +
        '<button class="aca-send-btn" id="aca-hf-send-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>' +
      '</div>' +
      '<div class="aca-powered-by">Powered by AutocareAI</div>' +
    '</div>';

  function mount() {
    document.body.appendChild(root);
    init();
  }
  if (document.body) { mount(); } else { document.addEventListener('DOMContentLoaded', mount); }

  // Load the Inter font if the host page doesn't already have it (harmless if duplicated)
  if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Inter"]')) {
    var fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(fontLink);
  }

  // ---------- behavior ----------
  function init() {
    var conversationHistory = [];
    var isTyping = false;
    var pendingImage = null; // { dataUrl, base64, mediaType }

    var $fab = document.getElementById('aca-hf-fab');
    var $win = document.getElementById('aca-hf-window');
    var $teaser = document.getElementById('aca-hf-teaser');
    var $teaserClose = document.getElementById('aca-hf-teaser-close');
    var $messages = document.getElementById('aca-hf-messages');
    var $input = document.getElementById('aca-hf-input');
    var $sendBtn = document.getElementById('aca-hf-send-btn');
    var $fileInput = document.getElementById('aca-hf-file-input');
    var $attachBtn = document.getElementById('aca-hf-attach-btn');
    var $previewRow = document.getElementById('aca-hf-preview-row');
    var $previewImg = document.getElementById('aca-hf-preview-img');
    var $removeImgBtn = document.getElementById('aca-hf-remove-img');

    $fab.addEventListener('click', toggleChat);
    $teaser.addEventListener('click', function () { dismissTeaser(); toggleChat(); });
    $teaserClose.addEventListener('click', function (e) { e.stopPropagation(); dismissTeaser(); });

    // Show a friendly teaser bubble a few seconds after the page loads, once per browser
    // session (won't nag on every page nav), unless the visitor already dismissed it or opened the chat.
    try {
      if (!sessionStorage.getItem('aca_hf_teaser_dismissed')) {
        setTimeout(function () {
          if (!$win.classList.contains('aca-open')) { $teaser.classList.add('aca-show'); }
        }, 2500);
      }
    } catch (e) { /* sessionStorage unavailable (privacy mode etc.) — just skip the teaser timing */ }

    function dismissTeaser() {
      $teaser.classList.remove('aca-show');
      try { sessionStorage.setItem('aca_hf_teaser_dismissed', '1'); } catch (e) {}
    }

    $attachBtn.addEventListener('click', function () { $fileInput.click(); });
    $fileInput.addEventListener('change', fileSelected);
    $removeImgBtn.addEventListener('click', removeImage);
    $sendBtn.addEventListener('click', sendMessage);
    $input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    function resizeImage(file, maxDim, quality) {
      maxDim = maxDim || 1600; quality = quality || 0.82;
      return new Promise(function (resolve, reject) {
        var img = new Image();
        var reader = new FileReader();
        reader.onload = function (e) { img.src = e.target.result; };
        reader.onerror = reject;
        img.onload = function () {
          var width = img.width, height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) { height = Math.round(height * (maxDim / width)); width = maxDim; }
            else { width = Math.round(width * (maxDim / height)); height = maxDim; }
          }
          var canvas = document.createElement('canvas');
          canvas.width = width; canvas.height = height;
          canvas.getContext('2d').drawImage(img, 0, 0, width, height);
          var dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve({ dataUrl: dataUrl, base64: dataUrl.split(',')[1], mediaType: 'image/jpeg' });
        };
        img.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    function fileSelected(e) {
      var file = e.target.files[0];
      e.target.value = '';
      if (!file) return;
      if (file.type.indexOf('image/') !== 0) { addBotMessage('⚠️ Please choose an image file.'); return; }
      if (file.size > 10 * 1024 * 1024) { addBotMessage("⚠️ That image is over 10MB — could you try a smaller one?"); return; }
      resizeImage(file).then(function (img) {
        pendingImage = img;
        $previewImg.src = img.dataUrl;
        $previewRow.style.display = 'block';
      }).catch(function () {
        addBotMessage('⚠️ Sorry, something went wrong processing that image — please try again.');
      });
    }

    function removeImage() {
      pendingImage = null;
      $previewRow.style.display = 'none';
    }

    function toggleChat() {
      var isOpen = $win.classList.toggle('aca-open');
      if (isOpen) { dismissTeaser(); }
      if (isOpen && $messages.children.length === 0) { initChat(); }
      if (isOpen) { setTimeout(function () { $input.focus(); }, 300); }
    }

    // Quick-reply suggestions rotate with the Toronto driving season, plus a couple of
    // "always relevant" habit questions (dealer price comparison stays year-round — it's
    // the core trust hook). Update the four SEASON_QUESTIONS blocks below as the shop's
    // seasonal promotions or focus areas change.
    function getSeasonalQuickReplies() {
      var month = new Date().getMonth() + 1; // 1–12
      var seasonal, habit;
      if (month === 12 || month === 1 || month === 2) {
        // Winter: cold-start / battery trouble, winter-driving readiness
        seasonal = ['天冷了打不着火，是电瓶问题吗？', 'Is my car ready for winter driving?'];
        habit = ['How does your pricing compare to the dealer?', 'I need my BMW brakes checked'];
      } else if (month >= 3 && month <= 5) {
        // Spring: swap back to summer tires, check for road-salt rust after winter
        seasonal = ['该换回夏胎了吗？', 'Can you check for road-salt rust damage?'];
        habit = ['How does your pricing compare to the dealer?', 'Do you do pre-purchase inspections?'];
      } else if (month >= 6 && month <= 8) {
        // Summer: AC service, road-trip check-ups
        seasonal = ['空调不制冷，大概是什么问题？', 'Getting ready for a road trip — can you do a check-up?'];
        habit = ['How does your pricing compare to the dealer?', '我的奔驰需要保养，大概多少钱？'];
      } else {
        // Fall (9–11): winter tire swap booking, pre-winter rustproofing
        seasonal = ['什么时候该换雪胎了？', 'Do you do rustproofing before winter?'];
        habit = ['How does your pricing compare to the dealer?', 'I need my BMW brakes checked'];
      }
      return [seasonal[0], seasonal[1], habit[0], habit[1]];
    }

    function initChat() {
      var greeting = "Hi! I'm the AI assistant for Hyperfine Autos. We specialize in Audi, BMW, and Mercedes-Benz — with technicians who came from the original dealerships.\n\nHow can I help you today?";
      addBotMessage(greeting, getSeasonalQuickReplies());
    }

    // Safety net: strip stray markdown symbols even if the model slips one in,
    // so replies always read as plain conversational text.
    function stripMarkdown(text) {
      return text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/__(.*?)__/g, '$1')
        .replace(/`([^`]*)`/g, '$1')
        .replace(/(^|\n)\s{0,3}#{1,6}\s*/g, '$1')
        .replace(/(^|\n)\s{0,3}[-*]\s+/g, '$1• ')
        .replace(/\*(?!\*)([^*\n]+)\*/g, '$1');
    }

    function escapeHtml(s) {
      var d = document.createElement('div');
      d.textContent = s;
      return d.innerHTML;
    }

    function addBotMessage(text, quickReplies) {
      var msgDiv = document.createElement('div');
      msgDiv.className = 'aca-msg aca-msg-bot';
      msgDiv.innerHTML = '<div class="aca-bubble">' + stripMarkdown(escapeHtml(text)).replace(/\n/g, '<br>') + '</div><div class="aca-msg-time">Hyperfine Autos · just now</div>';
      $messages.appendChild(msgDiv);
      if (quickReplies && quickReplies.length > 0) {
        var qr = document.createElement('div');
        qr.className = 'aca-msg aca-msg-bot';
        var qrDiv = document.createElement('div');
        qrDiv.className = 'aca-quick-replies';
        quickReplies.forEach(function (reply) {
          var btn = document.createElement('button');
          btn.className = 'aca-quick-reply';
          btn.textContent = reply;
          btn.onclick = function () { qrDiv.remove(); qr.remove(); handleQuickReply(reply); };
          qrDiv.appendChild(btn);
        });
        qr.appendChild(qrDiv);
        $messages.appendChild(qr);
      }
      $messages.scrollTop = $messages.scrollHeight;
    }

    function addUserMessage(text, image) {
      var msgDiv = document.createElement('div');
      msgDiv.className = 'aca-msg aca-msg-user';
      var imgHtml = image ? '<img class="aca-msg-img" src="' + image.dataUrl + '" alt="uploaded photo">' : '';
      msgDiv.innerHTML = '<div class="aca-bubble">' + imgHtml + escapeHtml(text || '') + '</div><div class="aca-msg-time">You · just now</div>';
      if (image) {
        msgDiv.querySelector('.aca-msg-img').addEventListener('click', function () { window.open(image.dataUrl, '_blank'); });
      }
      $messages.appendChild(msgDiv);
      $messages.scrollTop = $messages.scrollHeight;
    }

    function showTyping() {
      var typing = document.createElement('div');
      typing.className = 'aca-msg aca-msg-bot';
      typing.id = 'aca-hf-typing';
      typing.innerHTML = '<div class="aca-typing-dots"><span></span><span></span><span></span></div>';
      $messages.appendChild(typing);
      $messages.scrollTop = $messages.scrollHeight;
    }

    function hideTyping() {
      var t = document.getElementById('aca-hf-typing');
      if (t) t.remove();
    }

    function handleQuickReply(text) {
      addUserMessage(text);
      callAPI(text);
    }

    function sendMessage() {
      var text = $input.value.trim();
      if ((!text && !pendingImage) || isTyping) return;
      $input.value = '';
      var image = pendingImage;
      pendingImage = null;
      $previewRow.style.display = 'none';
      addUserMessage(text, image);
      callAPI(text, image);
    }

    function callAPI(userMessage, image) {
      isTyping = true;
      $sendBtn.disabled = true;
      var content = image
        ? [
            { type: 'image', source: { type: 'base64', media_type: image.mediaType, data: image.base64 } },
            { type: 'text', text: userMessage || 'Can you take a look at this photo?' }
          ]
        : userMessage;
      conversationHistory.push({ role: 'user', content: content });
      showTyping();
      fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: conversationHistory,
          session_id: SESSION_ID,
          shop: SHOP_ID
        })
      }).then(function (response) { return response.json(); })
        .then(function (data) {
          hideTyping();
          var reply = (data.content && data.content[0] && data.content[0].text) || "I'm sorry, I couldn't process that. Please call us at 905-554-0188.";
          conversationHistory.push({ role: 'assistant', content: reply });
          addBotMessage(reply);
        })
        .catch(function () {
          hideTyping();
          addBotMessage("Sorry, I'm having trouble connecting right now. Please call us directly at 905-554-0188 — we're happy to help!");
        })
        .then(function () {
          isTyping = false;
          $sendBtn.disabled = false;
          $input.focus();
        });
    }
  }
})();
