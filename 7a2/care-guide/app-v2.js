import {COUNTIES, DAILY, SUPPORT, IDENTITIES, SOURCES, VERIFIED, CAPS, PRICE_ROWS, emptyAnswers, route, estimate} from './data.mjs';
const root=document.getElementById('workspace'), labels=['關於家人','身分與健康','生活困難','希望的支持','照顧安排','評估進度'];
const storageKey='care-guide-v2';
let answers=emptyAnswers(),step=0,resultMode=false,editing=false,saved=false,checks={},editSnapshot=null,lastEstimate=null;
const newBudget=()=>({mode:'',level:'',identity:'',foreign:'',remote:'no',remaining:'',amounts:{},quote:'',quoteUnits:'1'});
let budget=newBudget();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>Number(n).toLocaleString('zh-TW',{maximumFractionDigits:0});
const link=(url,label,cls='')=>`<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label}<span class="sr-only">（另開分頁）</span> ↗</a>`;
const county=()=>COUNTIES.find(c=>c.name===answers.county);
function select(name,label,options,value,help=''){return `<div class="field"><label for="${name}">${label}</label><select id="${name}" name="${name}"><option value="">請選擇</option>${options.map(([v,t])=>`<option value="${esc(v)}" ${value===v?'selected':''}>${esc(t)}</option>`).join('')}</select>${help?`<p class="field-help">${help}</p>`:''}</div>`;}
function choices(name,options,value,multi=false,legend=''){const a=Array.isArray(value)?value:[value];return `<fieldset class="choices"><legend class="${legend?'':'sr-only'}">${legend||'請選擇答案'}</legend>${options.map(([v,t])=>`<label class="option ${a.includes(v)?'selected':''}"><input type="${multi?'checkbox':'radio'}" name="${name}" value="${v}" ${a.includes(v)?'checked':''}><span>${t}</span></label>`).join('')}</fieldset>`;}
function focusHeading(){root.querySelector('h2')?.focus();}
function announce(text){document.getElementById('status').textContent=text;}
function persist(){if(!saved)return;try{sessionStorage.setItem(storageKey,JSON.stringify({version:2,answers,step,resultMode,checks,budget}));}catch{saved=false;updateSaveButton();announce('分頁暫存不可用，仍可繼續填寫。');}}
function priorityField(){const selected=SUPPORT.filter(([id])=>answers.support.includes(id)&&!['unknown','none'].includes(id));return selected.length?select('priority','如果只能先處理一件事，你會選？',selected.concat([['unknown','請協助安排順序']]),answers.priority):'';}
function levelField(){return answers.assessment==='approved'?select('level','正式核定的長照需要等級',Object.keys(CAPS).map(v=>[v,`第 ${v} 級`]),answers.level,'請看核定通知；身心障礙程度和長照等級不同。'):'';}
function render(){
 document.body.classList.toggle('show-results',resultMode);
 if(resultMode){renderResult();return;}
 let content='';
 if(step===0)content=`<h2 tabindex="-1">先從家人的生活地點開始。</h2><p class="hint">以需要被照顧者回答，不需姓名或詳細地址。</p>${select('county','實際居住縣市',COUNTIES.map(c=>[c.name,c.name]).concat([['unknown','不確定／先不選']]),answers.county,'依實際居住地找窗口，戶籍不同時再向承辦確認。')}${choices('age',[['under55','未滿 55 歲'],['55','55–64 歲'],['65','65 歲以上'],['unknown','不確定']],answers.age,false,'年齡範圍')}`;
 if(step===1)content=`<h2 tabindex="-1">有以下身分或健康情況嗎？</h2><p class="hint">可複選。不清楚時直接選「不確定」。</p>${choices('identities',IDENTITIES,answers.identities,true)}<details class="help"><summary>什麼是 PAC？</summary><p>由醫療團隊判斷的「急性後期整合照護計畫」。若醫院沒有明確告知，不需自行判斷是否符合。</p></details>`;
 if(step===2)content=`<h2 tabindex="-1">哪些日常事情需要幫忙？</h2><p class="hint">可複選。依平常實際狀況回答，不需自己判斷失能等級。</p>${choices('daily',DAILY,answers.daily,true)}${select('duration','這些困難持續多久？',[['long','已達或預期持續六個月以上'],['short','暫時性／預期未滿六個月'],['unknown','不確定']],answers.duration,'短期困難也能先洽醫療團隊或 1966，不必自行排除。')}`;
 if(step===3)content=`<h2 tabindex="-1">你最希望生活多哪些支持？</h2><p class="hint">可複選，不知道服務名稱也沒關係。</p>${choices('support',SUPPORT,answers.support,true)}<div id="priority-field">${priorityField()}</div>`;
 if(step===4)content=`<h2 tabindex="-1">目前如何安排照顧？</h2><p class="hint">住院與聘僱看護可以同時存在，請分別回答。</p>${select('setting','目前居住／就醫安排',[['home','住在家中'],['hospital','住院中，準備返家'],['residential','全日住宿式機構或團體家屋'],['unknown','不確定']],answers.setting)}${select('foreign','目前有聘僱外籍家庭看護工嗎？',[['yes','有'],['no','沒有'],['unknown','不確定']],answers.foreign)}${select('caregiver','有家人或其他人協助日常照顧嗎？',[['yes','有'],['no','沒有／主要自行生活'],['unknown','不確定']],answers.caregiver)}`;
 if(step===5)content=`<h2 tabindex="-1">目前進行到哪一步？</h2><p class="hint">還沒評估也可以看建議；問答不會推算或核定等級。</p>${choices('assessment',[['new','還沒申請或還沒正式評估'],['waiting','已申請，正在等評估或核定'],['approved','已核定長照需要等級第 2–8 級'],['level1','正式評估為第 1 級'],['unknown','不確定目前的結果']],answers.assessment)}<div id="level-field">${levelField()}</div>`;
 root.innerHTML=`<div class="step"><span>${editing?'調整這一題':labels[step]}</span><span>第 ${step+1} / 6 步</span></div><div class="progress" role="progressbar" aria-label="問答進度" aria-valuemin="0" aria-valuemax="6" aria-valuenow="${step+1}"><i style="width:${(step+1)/6*100}%"></i></div><form id="question-form">${content}<p class="error" id="form-error" role="alert"></p><div class="actions">${step&&!editing?'<button type="button" class="secondary" id="back">上一步</button>':''}${editing?'<button type="button" class="secondary" id="cancel-edit">取消修改</button>':''}<button class="primary" type="submit">${editing?'更新我的建議':step===5?'查看照顧建議':'下一步'} →</button></div></form><p class="micro">需求探索與申請準備，不能取代正式評估。</p>`;
 root.querySelector('form').addEventListener('change',onChange);
 root.querySelector('form').addEventListener('submit',e=>{e.preventDefault();const error=validateStep();if(error){document.getElementById('form-error').textContent=error;return;}if(editing){editing=false;resultMode=true;lastEstimate=null;budget=newBudget();}else if(step===5)resultMode=true;else step++;persist();render();focusHeading();});
 document.getElementById('back')?.addEventListener('click',()=>{step--;persist();render();focusHeading();});
 document.getElementById('cancel-edit')?.addEventListener('click',()=>{answers=editSnapshot;editing=false;resultMode=true;persist();render();focusHeading();});
}
function onChange(e){const el=e.target,{name,value}=el;if(!Object.hasOwn(answers,name))return;if(el.type==='checkbox'){
 const exclusive=['none','unknown'],a=answers[name];answers[name]=exclusive.includes(value)?(el.checked?[value]:[]):el.checked?[...a.filter(v=>!exclusive.includes(v)),value]:a.filter(v=>v!==value);
 root.querySelectorAll(`input[name="${name}"]`).forEach(input=>{input.checked=answers[name].includes(input.value);input.closest('label').classList.toggle('selected',input.checked);});
 }else {answers[name]=value;root.querySelectorAll(`input[name="${name}"]`).forEach(input=>input.closest('label').classList.toggle('selected',input.checked));}
 if(name==='support'){if(!answers.support.includes(answers.priority))answers.priority='';document.getElementById('priority-field').innerHTML=priorityField();}
 if(name==='assessment'){if(value!=='approved')answers.level='';document.getElementById('level-field').innerHTML=levelField();}
 document.getElementById('form-error').textContent='';persist();
}
function validateStep(){if(step===0&&(!answers.county||!answers.age))return '請選擇縣市與年齡；不清楚可選不確定。';if(step===1&&!answers.identities.length)return '請選擇身分情況，或選不確定。';if(step===2&&!answers.daily.length)return '請選生活狀況，或選不確定。';if(step===3&&!answers.support.length)return '不知道服務也可以選「請依生活困難建議」。';if(step===4&&!answers.setting)return '請選目前居住／就醫安排。';if(step===5&&(!answers.assessment||(answers.assessment==='approved'&&!CAPS[answers.level])))return '請選評估進度；已核定者請填正式等級。';return '';}
const modeText={
 residential:['先從機構照顧與返家規劃談起。','目前不套用一般居家及社區給付。先由機構社工確認適用補助；有返家計畫時再討論長照銜接。'],
 community:['先找社區支持，照顧生活的自主。','目前未回報生活需協助，或已評為第 1 級。以下以社區及一般支持為主；狀況改變可提出評估或複評。'],
 approved:['把核定資源，安排到真正需要的地方。','你已填寫正式等級。以下是討論清單，實際服務與給付仍依核定照顧計畫，不會自動取得所有項目。'],
 assessment:['先安排評估，再一起規劃照顧。','你的回答包含可洽詢評估的身分與生活需求。是否符合給付及正式等級，由照管中心評估核定。'],
 clarify:['不確定也沒關係，先讓專員了解。','目前有不確定的資訊，先釐清生活需求與身分，不自行判定符合或不符合給付。'],
 consult:['先確認可用資源，再決定下一步。','目前尚無法確認一般長照給付路徑。下列為需求方向，可向 1966 詢問長照及其他適用資源。']
};
function answerSummary(){return [
 ['地點與年齡',`${answers.county}／${({under55:'未滿55歲','55':'55–64歲','65':'65歲以上',unknown:'年齡不確定'})[answers.age]||''}`],
 ['身分情況',IDENTITIES.filter(([v])=>answers.identities.includes(v)).map(([,t])=>t).join('、')],
 ['生活困難',DAILY.filter(([v])=>answers.daily.includes(v)).map(([,t])=>t).join('、')],
 ['希望支持',SUPPORT.filter(([v])=>answers.support.includes(v)).map(([,t])=>t).join('、')],
 ['照顧安排',`${({home:'住家',hospital:'住院待返家',residential:'全日住宿機構／團體家屋',unknown:'不確定'})[answers.setting]}；外籍看護：${({yes:'有',no:'無',unknown:'不確定'})[answers.foreign]}`],
 ['評估進度',({new:'尚未正式評估',waiting:'等候評估或核定',approved:`已核定第${answers.level}級`,level1:'正式第1級',unknown:'結果不確定'})[answers.assessment]]
 ];}
function stepsFor(r){if(r.mode==='residential')return ['聯絡機構社工，確認住宿式方案及所需文件。','如規劃返家，請機構與醫療團隊協助轉介照管中心。','依返家後狀況重新確認評估、照顧計畫與服務開始日期。'];if(r.mode==='community')return ['聯絡居住地照管中心，詢問社區活動與一般支持資源。','有記憶或健康困擾時，安排醫療評估。','生活功能變差或開始需要協助時，再申請評估／複評。'];if(r.assessed)return ['與原個案管理員確認現行照顧計畫及本月可用額度。','帶著需求清單討論服務項目、時間、部分負擔與單位。','照顧狀況改變時，申請調整計畫或複評。'];return [answers.setting==='hospital'?'先找醫院出院準備團隊，討論返家與長照轉介。':answers.assessment==='waiting'?'聯絡已受理的照管中心，確認進度與需補資料。':'撥打 1966、當地照管中心或使用官方線上入口提出需求。','由照管專員安排正式評估，確認資格、等級及給付。','與個案管理員討論計畫，核定後媒合單位與服務時間。'];}
function documentGroups(r){if(r.mode==='residential')return [['先找機構社工',['整理機構名稱、照顧需求及已申請補助，無需填入本工具。','詢問適用住宿式方案、申請期間與正式文件。']],['若準備返家',['與醫療團隊整理返家日期、就醫及用藥資料（已有者）。','向照管中心確認返家評估、申請表及授權文件。']],['方案確認後',['依社工及受理機關要求補件，不把通用清單當成正式送件清單。']]];
 return [['先諮詢就能準備',['被照顧者出生日期、實際居住地及聯絡方式；資料不齊也能先詢問。','主要聯絡人的電話、與被照顧者的關係。','記錄最困難的日常活動、需要幫忙的時段。']],
 [r.mode==='community'?'確認支持方案時':'正式申請／評估時確認',['身分證明、申請表及代理／同意文件：依地方受理方式確認。',...(answers.identities.includes('disability')?['身心障礙證明（已有者）。']:[]),...(answers.identities.includes('dementia')?['既有失智診斷或就醫資料；是否另附診斷證明由承辦確認。']:[]),...(answers.identities.includes('pac')||answers.setting==='hospital'?['出院摘要或醫療轉介資料（已有者），可請醫院協助。']:[]),'既有福利身分資料，由承辦確認長照第一／二／三類，不只靠「中低收入」字樣判定。']],
 ['服務或計畫核定後',r.mode==='community'?['依社區活動或一般支持方案確認報名、收費及所需文件。']:['確認核定計畫、服務時間、收費及契約內容。',...(r.items.some(i=>i.id==='aids')?['輔具／改善：先確認評估、核定與購置程序；收據、報告與核銷文件依個別項目確認。']:[]),'新增或重複補助，先告知承辦與個案管理員。']]];
}
function renderResult(){const r=route(answers),c=county(),groups=documentGroups(r);root.innerHTML=`
 <div class="result-header"><span class="badge">你的照顧路線 · ${VERIFIED}</span><h2 tabindex="-1">${modeText[r.mode][0]}</h2><p>${modeText[r.mode][1]}</p></div>
 <nav class="result-nav" aria-label="結果內容"><a href="#recommendations">服務建議</a><a href="#application">申請入口</a><a href="#documents">準備清單</a><a href="#calculator">費用試算</a></nav>
 ${answers.duration==='short'&&r.mode!=='residential'?'<p class="notice">你回報的是短期困難。先和醫療團隊確認恢復與照顧安排；本工具不以短期需求判定長照給付資格。</p>':''}
 ${r.assessed&&answers.daily.includes('none')?'<p class="notice">你填寫已有正式等級，但目前生活可自行完成。請確認評估是否仍有效，或與個案管理員討論狀況改變。</p>':''}
 <details class="answer-review"><summary>查看回答摘要／單題修改</summary>${answerSummary().map(([t,v],i)=>`<div class="review-row"><div><strong>${t}</strong><p>${esc(v)}</p></div><button type="button" class="text-button" data-edit="${i}">修改<span class="sr-only">${t}</span></button></div>`).join('')}</details>
 <section id="recommendations" class="result-section"><div class="section-title"><span>01</span><h3>先處理什麼，再討論什麼</h3></div><p class="hint">依你最想處理的需求與日常困難排序。這是討論順序，不是醫療急迫性分級。</p>${r.items.map(item=>`<article class="service"><span class="service-priority ${item.priority===1?'first':''}">${item.preferred?'你最想先處理':item.priority===1?'優先洽詢':'可搭配討論'}</span><h4>${item.title}</h4><p>${item.detail}</p><div class="reason">因為你提到：${item.reasons.map(esc).join('；')}</div></article>`).join('')}</section>
 <section id="application" class="result-section"><div class="section-title"><span>02</span><h3>${r.mode==='residential'?'機構與返家銜接':'你的申請下一步'}</h3></div><ol class="flow">${stepsFor(r).map(t=>`<li>${t}</li>`).join('')}</ol><div class="local-card"><h4>${c?`${c.name}照管窗口`:'全臺照管窗口'}</h4><p>${c?'依實際居住地找到受理入口；戶籍不同時先向承辦確認。':'尚未選定縣市，可先用官方目錄查詢。'}</p><div class="actions">${c?`<a class="primary" href="tel:${c.phone.replaceAll('-','')}">撥打 ${c.phone}</a>`:'<a class="primary" href="tel:1966">撥打 1966</a>'}${link(c?.url||SOURCES.contacts,r.mode==='residential'?'洽詢返家申請入口':'官方申請與說明','secondary')}</div>${c?.name==='連江縣'?'<p class="field-help">接通後分機 8830–8839。</p>':''}<p class="field-help">入口取自衛福部縣市目錄；若連線失敗，請改用電話或${link(SOURCES.contacts,'官方窗口目錄')}。正式文件及受理條件以地方入口公告為準。本工具不代送申請。</p>${r.mode==='residential'?link(SOURCES.residential,'住宿式服務補助官方說明'):link(SOURCES.map,'查詢附近服務與社區據點')}</div></section>
 <section id="documents" class="result-section"><div class="section-title"><span>03</span><h3>分階段準備，不必一次備齊</h3></div><p class="hint">這是準備清單，尚非各縣市正式送件清單。${c?link(c.url,`${c.name}正式文件與表單由此確認`):link(SOURCES.contacts,'先找到所在地官方入口')}。</p>${groups.map(([title,items],g)=>`<fieldset class="document-group"><legend>${title}</legend>${items.map((text,j)=>{const id=`${r.mode}-${g}-${j}-${text}`;return `<label class="check"><input type="checkbox" data-check="${esc(id)}" ${checks[id]?'checked':''}><span>${text}</span></label>`;}).join('')}</fieldset>`).join('')}</section>
 <section id="calculator" class="result-section"><div class="section-title"><span>04</span><h3>照顧及專業服務費用試算</h3></div><p class="hint">試算單一月份的 B／C 碼額度與自付概算。交通、喘息、輔具各有獨立額度，不能合併；本版不把它們混入此試算。</p><div id="budget-content">${budgetView(r)}</div></section>
 <section class="result-section export-section"><h3>把下一步帶走</h3><p>可列印或在列印視窗選「另存 PDF」，也可下載不含姓名的文字摘要。</p><div class="actions"><button class="secondary" id="print">列印／另存 PDF</button><button class="secondary" id="download">下載文字摘要</button><button class="text-button" id="restart">重新開始</button></div></section>
 <details class="sources"><summary>官方依據、計算範圍與查核日期</summary><p>人工查核 ${VERIFIED}。配對為本工具規則，非正式評估或診斷。地方入口可能更新，文件依受理機關確認。</p>${link(SOURCES.law,'申請、給付與外籍看護規定')}${link(SOURCES.amounts,'附表二：等級與額度')}${link(SOURCES.rates,'附表五：部分負擔比率')}${link(SOURCES.prices,'附表四：服務內容及支付價格')}${link(SOURCES.contacts,'全臺窗口與申請入口')}${link(SOURCES.apply,'衛福部：申請與服務說明')}</details>`;
 root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{editSnapshot=structuredClone(answers);step=Number(b.dataset.edit);editing=true;resultMode=false;render();focusHeading();});
 root.querySelectorAll('[data-check]').forEach(el=>el.onchange=()=>{checks[el.dataset.check]=el.checked;persist();});
 document.getElementById('print').onclick=()=>window.print();document.getElementById('download').onclick=download;document.getElementById('restart').onclick=reset;bindBudget(r);
}
function budgetView(r){
 if(r.mode==='residential')return '<p class="notice">目前為住宿式機構／團體家屋安排，不套用一般居家及社區月額度試算。請先和機構社工確認適用方案。</p>';
 if(!budget.mode)budget.mode=r.assessed?'official':'scenario';if(r.assessed&&!budget.level)budget.level=answers.level;if(!budget.foreign)budget.foreign=answers.foreign==='unknown'?'':answers.foreign;
 const official=budget.mode==='official';
 return `<form id="budget-form"><fieldset class="choices inline"><legend>以什麼資料試算？</legend>${[['official','已有正式核定等級'],['scenario','尚未核定，先看假設情境']].map(([v,t])=>`<label class="option"><input type="radio" name="mode" value="${v}" ${budget.mode===v?'checked':''}><span>${t}</span></label>`).join('')}</fieldset><p class="notice">${official?'依你輸入的正式資料估算，仍須對照個案計畫與服務報價；不是核定或帳單。':'假設情境：自行選一個等級比較費用，不代表本工具認定你有該等級或資格。'}</p><div class="two-col">${select('budget-level',official?'正式核定等級':'假設等級',Object.keys(CAPS).map(v=>[v,`第 ${v} 級`]),budget.level)}${select('budget-identity','長照身分別',[['1','第一類：額度內部分負擔 0%'],['2','第二類：額度內部分負擔 5%'],['3','第三類：額度內部分負擔 16%']],budget.identity)}</div><details class="help"><summary>還不知道長照身分別？</summary><p>以照管中心核定分類為準，不用一般「低收／中低收」名稱自行對照。未核定可選一類作假設比較，並切換為假設情境。</p></details>${select('budget-foreign','外籍家庭看護聘僱情況',[['no','未聘僱'],['yes','聘有外籍家庭看護工']],budget.foreign,'聘有外看：一般規則為照顧及專業月額度的 30%，且不含居家服務組合。例外、空窗與未滿月由承辦確認。')}
 <fieldset class="cost-builder"><legend>建立本月服務費用</legend><p class="hint">填「本月次數」，不是每週次數。此處協助加總預算，不代排可併用的照顧時段。</p>${budget.foreign==='no'?`${select('budget-remote','價格適用區域',[['no','一般地區'],['yes','原住民族地區或離島']],budget.remote,'依服務所在地適用範圍確認，與個人原住民身分不同。')}<div class="price-rows">${PRICE_ROWS.map(row=>`<label class="price-row" for="qty-${row.id}"><span><strong>${row.name}</strong><small>${row.id} · NT$${budget.remote==='yes'?row.remote:row.price}／${row.unit}</small></span><input id="qty-${row.id}" type="number" min="0" max="200" step="1" inputmode="numeric" data-qty="${row.id}" aria-label="${row.name}本月次數" value="${esc(budget.amounts[row.id]||0)}"><span>${row.unit}／月</span></label>`).join('')}</div>`:'<p class="notice">請確認聘僱情況。聘有外看時不列居家服務價格範例，改填可適用的非居家照顧／專業服務報價。</p>'}
 <div class="two-col"><div class="field"><label for="quote">${budget.foreign==='no'?'其他核定 B／C 碼服務單價':'非居家照顧／專業服務單價'}（元）</label><input id="quote" name="quote" type="number" min="0" max="1000000" step="1" inputmode="numeric" placeholder="依服務單位報價" value="${esc(budget.quote)}"></div><div class="field"><label for="quoteUnits">本月報價單位數</label><input id="quoteUnits" name="quoteUnits" type="number" min="0" max="200" step="1" inputmode="numeric" value="${esc(budget.quoteUnits)}"></div></div><p class="field-help">若已有整月照顧及專業服務總報價，可將單價填總額、單位數填 1，並把上方次數歸零。勿填交通、輔具或喘息費用。</p></fieldset>
 <details class="help"><summary>已有服務或未滿月？設定本月可用額度</summary><div class="field"><label for="remaining">本次試算可用額度（選填，元）</label><input id="remaining" name="remaining" type="number" min="0" step="1" inputmode="numeric" placeholder="留白採標準月額度" value="${esc(budget.remaining)}"><p class="field-help">依個管員提供的本月剩餘額度填寫；只支援不高於標準月額度。跨月保留、未滿月及其他限制請洽個管員，勿直接套用整月假設。</p></div></details><button class="primary" type="submit">計算本月概算 →</button><p class="error" id="budget-error" role="alert"></p></form><div id="budget-result" aria-live="polite"></div>`;
}
function bindBudget(r){const form=document.getElementById('budget-form');if(!form)return;
 form.addEventListener('input',e=>{captureBudget(e.target);document.getElementById('budget-result').innerHTML='';lastEstimate=null;persist();});
 form.addEventListener('change',e=>{captureBudget(e.target);if(['mode','budget-remote','budget-foreign'].includes(e.target.name)){document.getElementById('budget-content').innerHTML=budgetView(r);bindBudget(r);}persist();});
 form.addEventListener('submit',e=>{e.preventDefault();lastEstimate=null;try{
 let cost=Number(budget.quote||0)*Number(budget.quoteUnits);const rows=[];
 if(budget.foreign==='no')for(const row of PRICE_ROWS){const qty=Number(budget.amounts[row.id]||0);if(!Number.isInteger(qty)||qty<0||qty>200)throw new Error('本月次數請填 0–200 的整數。');const price=budget.remote==='yes'?row.remote:row.price;cost+=qty*price;if(qty)rows.push(`${row.name}：${price} × ${qty} = ${price*qty} 元`);}
 if(Number(budget.quote||0)<0||Number(budget.quoteUnits)<0)throw new Error('金額與單位數不可為負數。');if(!cost)throw new Error('請至少輸入一項服務次數或報價。');
 const out=estimate({level:budget.level,identity:budget.identity,foreign:budget.foreign,cost,remaining:budget.remaining===''?null:Number(budget.remaining)});
 lastEstimate={...out,cost,rows,mode:budget.mode,level:budget.level,identity:budget.identity};persist();document.getElementById('budget-error').textContent='';document.getElementById('budget-result').innerHTML=estimateHtml(lastEstimate);
 }catch(error){document.getElementById('budget-result').innerHTML='';document.getElementById('budget-error').textContent=error.message;}});
}
function captureBudget(el){if(el.dataset.qty){budget.amounts[el.dataset.qty]=el.value;return;}const name=el.name.replace('budget-','');if(Object.hasOwn(budget,name))budget[name]=el.value;}
function estimateHtml(o){return `<div class="estimate"><span class="badge">${o.mode==='official'?'依輸入核定資料概算':'假設情境，非資格認定'} · 第 ${o.level} 級</span><h4>本月自行負擔概算 <strong>NT$${money(o.self)}</strong></h4><dl><div><dt>服務費用合計</dt><dd>NT$${money(o.cost)}</dd></div><div><dt>本次可用給付額度</dt><dd>NT$${money(o.available)}</dd></div><div><dt>額度內部分負擔（${o.rate*100}%）</dt><dd>NT$${money(o.copay)}</dd></div><div><dt>超出額度自行負擔</dt><dd>NT$${money(o.excess)}</dd></div><div><dt>政府分擔概算</dt><dd>NT$${money(o.government)}</dd></div></dl><p class="field-help">計算：額度內費用 × 部分負擔比率（無條件捨去）＋超額部分。此處以月總額估算；實際逐筆計價、核定量、適用條件與自費價格可能造成差異。給付額度是可用服務額度，不是現金補助。</p>${o.rows.length?`<details><summary>檢視服務加總</summary><ul>${o.rows.map(t=>`<li>${t}</li>`).join('')}</ul></details>`:''}</div>`;}
function summaryText(){const r=route(answers),c=county();return `憶起照顧｜需求與申請摘要\n查核：${VERIFIED}\n本摘要非正式評估或核定。\n\n${answerSummary().map(([t,v])=>`${t}：${v}`).join('\n')}\n\n${modeText[r.mode][0]}\n${r.items.map(i=>`・${i.title}\n  ${i.detail}`).join('\n')}\n\n下一步\n${stepsFor(r).map((t,i)=>`${i+1}. ${t}`).join('\n')}\n\n${c?`${c.name}窗口：${c.phone}\n${c.url}`:SOURCES.contacts}\n\n準備清單（非正式送件清單）\n${documentGroups(r).map(([t,items],g)=>`${t}\n${items.map((v,j)=>`${checks[`${r.mode}-${g}-${j}-${v}`]?'☑':'☐'} ${v}`).join('\n')}`).join('\n\n')}${lastEstimate?`\n\n${lastEstimate.mode==='official'?'依輸入核定資料':'假設情境'}費用概算\n第${lastEstimate.level}級、長照第${lastEstimate.identity}類\n費用 ${lastEstimate.cost} 元；自行負擔概算 ${lastEstimate.self} 元\n以月總額估算，實際逐筆計價及核定條件可能不同。`:''}\n\n依據\n${SOURCES.law}\n${SOURCES.amounts}\n${SOURCES.rates}\n`;}
function download(){const blob=new Blob(['\uFEFF',summaryText()],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='憶起照顧-需求與申請摘要.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),500);announce('已產生文字摘要下載。');}
function reset(){answers=emptyAnswers();checks={};step=0;resultMode=false;editing=false;budget=newBudget();lastEstimate=null;try{sessionStorage.removeItem(storageKey);}catch{}saved=false;updateSaveButton();render();focusHeading();announce('回答與此分頁暫存已清除。');}
function updateSaveButton(){document.getElementById('save-session').textContent=saved?'停止暫存並清除':'在此分頁暫存進度';}
document.getElementById('save-session').onclick=()=>{saved=!saved;if(saved){persist();announce(saved?'已開啟此分頁暫存，可重新整理後繼續。':'暫存未開啟。');}else{try{sessionStorage.removeItem(storageKey);}catch{}announce('已清除此分頁暫存，目前回答仍保留在畫面。');}updateSaveButton();};
document.getElementById('font-size').onclick=()=>{const large=document.body.classList.toggle('large-type');document.getElementById('font-size').setAttribute('aria-pressed',String(large));};
try{const raw=JSON.parse(sessionStorage.getItem(storageKey)||'null');if(raw?.version===2&&raw.answers&&Array.isArray(raw.answers.daily)&&Array.isArray(raw.answers.support)&&Array.isArray(raw.answers.identities)){
 const clean=emptyAnswers();for(const key of Object.keys(clean)){const value=raw.answers[key];if(Array.isArray(clean[key])){const opts=key==='daily'?DAILY:key==='support'?SUPPORT:IDENTITIES;clean[key]=opts.filter(([id])=>value?.includes(id)).map(([id])=>id);}else if(typeof value==='string')clean[key]=value.slice(0,60);}
 if((COUNTIES.some(c=>c.name===clean.county)||clean.county==='unknown')&&['under55','55','65','unknown'].includes(clean.age)){
 answers=clean;step=Math.min(5,Math.max(0,Math.floor(Number(raw.step)||0)));resultMode=raw.resultMode===true;saved=true;checks=raw.checks&&typeof raw.checks==='object'?raw.checks:{};
 if(raw.budget&&typeof raw.budget==='object'){
 const b=raw.budget;for(const [key,allowed] of Object.entries({mode:['official','scenario'],level:Object.keys(CAPS),identity:['1','2','3'],foreign:['yes','no'],remote:['yes','no']}))if(allowed.includes(b[key]))budget[key]=b[key];
 for(const key of ['remaining','quote','quoteUnits'])if(typeof b[key]==='string'&&/^\d{0,7}$/.test(b[key]))budget[key]=b[key];
 for(const row of PRICE_ROWS){const v=b.amounts?.[row.id];if(/^\d{1,3}$/.test(String(v))&&Number(v)<=200)budget.amounts[row.id]=String(v);}
 }
 }
 }}catch{ /* Browser storage must not block the questionnaire. */ }
updateSaveButton();render();
