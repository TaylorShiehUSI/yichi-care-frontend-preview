export const VERIFIED = '2026-11-13';
export const SOURCES = {
  law: 'https://law.moj.gov.tw/LawClass/LawAll.aspx?PCode=L0070059',
  amounts: 'https://law.moj.gov.tw/LawClass/LawGetFile.ashx?FileId=0000398330&lan=C',
  rates: 'https://law.moj.gov.tw/LawClass/LawGetFile.ashx?FileId=0000398333&lan=C',
  prices: 'https://law.moj.gov.tw/LawClass/LawGetFile.ashx?FileId=0000398331&lan=C',
  contacts: 'https://1966.gov.tw/LTC/cp-6443-69944-207.html',
  apply: 'https://1966.gov.tw/LTC/cp-6533-70777-207.html',
  residential: 'https://1966.gov.tw/LTC/cp-6457-69925-207.html',
  map: 'https://ltcpgis.mohw.gov.tw/'
};
// Official central directory, updated 2026-09-29. No personal information is sent with these links.
export const COUNTIES = [
 ['臺北市','02-2537-1099','https://ltc.health.gov.taipei/tplcPublic/front/onlineService'],
 ['新北市','02-2968-3331','https://service.ntpc.gov.tw/eservice/Ac124014.action'],
 ['桃園市','03-334-0935','https://ltc.tycg.gov.tw/tylcPublic/apply/index'],
 ['新竹市','03-535-5191','https://dgservice.hccg.gov.tw/serviceNotice.do?id=1193&rule=guest'],
 ['新竹縣','03-551-8101','https://eservices.hsinchu.gov.tw/People/Agree/81/202312012/A376440304?MyData=0'],
 ['苗栗縣','1966','https://longcare.miaoli.gov.tw/ApplyForm.aspx?n=2328&sms=11627'],
 ['臺中市','04-2515-2888','https://eservices.taichung.gov.tw/assortBusines/Agree/149/Application/140518/140032'],
 ['彰化縣','04-727-8503','https://edesk.chcg.gov.tw/eservice/apply_mode_directions2?itemId=116'],
 ['南投縣','049-222-2473','https://eservice.nantou.gov.tw/eservice/apply_mode_directions2?itemId=145'],
 ['雲林縣','05-535-2880','https://eservice.yunlin.gov.tw/ApplyCase/Agree/187/201907137/500249'],
 ['嘉義縣','05-362-5750','https://eservice.cyhg.gov.tw/eservice/apply_mode_directions2?itemId=62'],
 ['嘉義市','05-233-6889','https://ltc.cichb.gov.tw/General/Services/Apply/'],
 ['臺南市','06-293-1232','https://onestop.tainan.gov.tw/eservice/apply_mode_directions2?itemId=3074'],
 ['高雄市','07-713-1500','https://ltc.kchb.gov.tw/apply'],
 ['屏東縣','08-766-2900','https://onestop.pthg.gov.tw/eservice/apply_mode_directions2?itemId=761'],
 ['基隆市','02-2425-1527','https://www.klchb.klcg.gov.tw/tw/klcltcsmo/4722.html'],
 ['宜蘭縣','03-935-9990','https://ltc2.ilshb.gov.tw/'],
 ['花蓮縣','03-822-6889','https://docs.google.com/forms/d/e/1FAIpQLScPS2KXzrqVsvJp5YKGGCN-BgycW4YkoEcX5ZTZ2Qd6aCNtUA/viewform'],
 ['臺東縣','089-330-068','https://ttshbltc.ttshb.gov.tw/apply/online'],
 ['澎湖縣','06-926-7242','https://eservice.penghu.gov.tw/Service_Content.aspx?d=A0D457D337C0E5C3ADF955EA39A5AD9ED15A0DF4BF8C5127368B99BBDE61E5D92D26922E02E001FF&n=8C0F99E427E0C218&s=ED0B1DE2067E9B78'],
 ['金門縣','082-334-228','https://longtermcare.kinmen.gov.tw/apply.asp'],
 ['連江縣','0836-22095','https://www.matsuhb.gov.tw/Chhtml/careservice/2286?webaid=9']
].map(([name,phone,url])=>({name,phone,url}));
export const DAILY = [
 ['bath','洗澡或穿衣需要協助'],['toilet','如廁或更換尿片需要協助'],
 ['eat','吃飯需要協助'],['move','起身、移位或行走需要協助'],
 ['meal','備餐、採買或家務有困難'],['memory','記憶改變、情緒或外出安全困擾'],
 ['swallow','進食、吞嚥或營養問題，想找專業協助'],
 ['none','以上都能自行完成'],['unknown','不確定，希望有人協助了解']
];
export const SUPPORT = [
 ['home','有人到家中協助'],['day','白天照顧、活動與陪伴'],['transport','就醫、復健或透析接送'],
 ['aids','移動輔具或居家安全改善'],['respite','照顧者需要休息'],['rehab','復能與照顧技巧指導'],
 ['nutrition','營養或吞嚥專業指導'],['unknown','不知道有哪些服務，請依生活困難建議'],['none','暫時沒有特別想用的服務']
];
export const IDENTITIES = [['indigenous','具原住民身分'],['disability','持有身心障礙證明'],['dementia','已由醫師確診失智症'],['pac','醫療團隊已確認符合急性後期整合照護計畫（PAC）'],['none','以上皆無'],['unknown','不確定']];
export const CAPS = {2:10020,3:15460,4:18580,5:24100,6:28070,7:32090,8:36180};
export const PRICE_ROWS = [
 {id:'BA07',name:'協助沐浴及洗頭',price:325,remote:385,unit:'次'},
 {id:'BA05',name:'餐食照顧（案家備餐）',price:310,remote:370,unit:'次'},
 {id:'BA04',name:'協助進食或管灌餵食',price:130,remote:155,unit:'餐'}
];
export function emptyAnswers(){return {county:'',age:'',identities:[],daily:[],duration:'unknown',support:[],priority:'',setting:'',foreign:'unknown',caregiver:'unknown',assessment:'',level:''};}
export function route(a){
 const d=new Set(a.daily),s=new Set(a.support),i=new Set(a.identities);
 const candidate=a.age==='65'||(a.age==='55'&&i.has('indigenous'))||['disability','dementia','pac'].some(v=>i.has(v));
 const need=a.daily.some(v=>!['none','unknown'].includes(v));
 const residential=a.setting==='residential';
 const assessed=a.assessment==='approved'&&Object.hasOwn(CAPS,a.level);
 const prevention=a.assessment==='level1'||(!need&&d.has('none')&&!assessed);
 const uncertain=!assessed&&(d.has('unknown')||i.has('unknown')||a.age==='unknown'||a.assessment==='unknown');
 const mode=residential?'residential':prevention?'community':assessed?'approved':candidate&&need?'assessment':uncertain?'clarify':'consult';
 const items=[];
 function add(id,title,detail,reasons,priority=2){items.push({id,title,detail,reasons,priority});}
 if(residential){
   add('residential','先找機構社工確認適用方案','討論住宿照顧補助、現有服務與家庭支持；一般居家及社區給付不直接套用到目前的機構安排。',['目前住在全日住宿式機構或團體家屋'],1);
   if(s.has('home')||s.has('aids')||s.has('transport')||s.has('rehab'))add('discharge','如有返家計畫，另做返家評估','和機構、醫療團隊及照管中心討論返家日期、照顧人力、接送及輔具；返家資格與給付重新確認。',['你選了返家後可能需要的支持'],2);
   return {mode,candidate,need,assessed,items};
 }
 const reasons=DAILY.filter(([id])=>d.has(id)).map(([,label])=>label);
 if(mode==='community'){
   add('community','社區據點與預防支持','先詢問共餐、健康促進與預防延緩失能活動；社區活動與長照給付的申請條件不同。',['目前自行生活，或正式評估為第 1 級'],1);
   if(i.has('dementia')||d.has('memory'))add('dementia','失智共同照護與支持資源','已有診斷可洽失智共同照護中心；未確診的記憶改變先由醫療人員評估。',['記憶困擾或已確診失智症'],1);
   if(s.has('respite'))add('caregiver','照顧者支持與諮詢','洽詢照顧技巧、支持活動與替代照顧資源；喘息給付須另外確認條件。',['照顧者希望休息'],2);
   if(s.has('aids')||s.has('transport'))add('general','另詢一般接送與輔具資源','可向地方窗口詢問自費或其他福利方案，不先視為長照補助項目。',['你有接送或居家安全需求'],2);
   return {mode,candidate,need,assessed,items};
 }
 if(mode==='clarify'||mode==='consult')add('clarify','先協助確認需求與適用資源','帶著下方摘要洽詢 1966。尚未確認身分或生活困難時，不先判定無資格；也可詢問其他社會福利資源。',['目前資料不足以確認一般長照給付路徑'],1);
 const homeReasons=reasons.filter(t=>/洗澡|如廁|吃飯|起身|備餐/.test(t));
 if(homeReasons.length||s.has('home')){
   if(a.foreign==='yes')add('foreign','外籍看護家庭的服務安排','一般規則下，照顧及專業額度為原額度 30%，用於居家服務以外的照顧組合。先討論日照、專業服務等，例外與看護空窗由照管中心確認。',[...homeReasons,'目前聘有外籍家庭看護工'],1);
   else if(a.foreign==='unknown')add('home','居家照顧：先確認聘僱與服務條件','可討論身體照顧、餐食或生活協助；是否聘有外籍家庭看護工會影響適用規則。',homeReasons.length?homeReasons:['希望有人到家中協助'],1);
   else add('home','居家照顧：把日常困難交給專員討論','依實際困難討論沐浴、如廁、餐食或移位協助；服務細項與次數依照顧計畫核定。',homeReasons.length?homeReasons:['希望有人到家中協助'],1);
 }
 if(d.has('swallow')||s.has('nutrition'))add('nutrition','營養與吞嚥專業評估','向醫療團隊詢問營養或吞嚥評估，並討論長照專業指導能否銜接；本工具不診斷吞嚥問題。',[d.has('swallow')?'你提到進食、吞嚥或營養問題':'希望營養或吞嚥專業指導'],1);
 if(d.has('move')||s.has('aids'))add('aids','輔具與居家安全評估','討論移位、行走、浴廁與居家動線。先確認評估及核定，再購置或施工，避免無法申請給付。',[d.has('move')?'起身、移位或行走需要協助':'希望改善居家安全'],d.has('move')?1:2);
 if(d.has('memory')||i.has('dementia'))add('dementia','失智照護與生活安全支持','確診者可詢問失智共同照護中心與社區支持；尚未確診先安排醫療評估，不以本問答判斷失智症。',[i.has('dementia')?'已有失智症診斷':'有記憶或生活安全困擾'],1);
 if(s.has('respite'))add(a.caregiver==='no'?'caregiver':'respite',a.caregiver==='no'?'照顧人力與社會支持':'喘息服務與照顧者支持',a.caregiver==='no'?'無家庭照顧者時不先套用喘息給付，請照管中心協助規劃日常照顧與其他支持。':'討論短暫替代照顧及可用時段；聘外看者的喘息須確認看護休假等條件與其他補助是否重複。',['你表示照顧者需要休息'],1);
 if(s.has('day')||d.has('memory'))add('day','日間照顧／家庭托顧','可討論白天照顧、活動與生活支持，也要確認交通、接送時段及適應情形。',[s.has('day')?'希望白天有人陪伴':'可和專員討論白天安全與照顧安排'],2);
 if(s.has('transport'))add('transport','就醫交通接送','確認就醫、復健或透析路線與預約；地方支付價格與給付分區須依實際鄉鎮確認。',['需要醫療行程接送'],2);
 if(s.has('rehab')||d.has('move'))add('rehab','復能與照顧技巧指導','與團隊討論移位、行走等生活目標及家屬操作技巧，不自行指定療程。',[s.has('rehab')?'希望復能或照顧技巧指導':'移動困難可討論專業指導'],2);
 if(!items.length)add('clarify','先與照管中心討論生活需求','不知道服務名稱也可以提出申請或諮詢，由專員進一步了解。',['尚未選定具體服務'],1);
 const map={home:['home','foreign'],day:['day'],transport:['transport'],aids:['aids'],respite:['respite','caregiver'],rehab:['rehab'],nutrition:['nutrition']};
 items.forEach(item=>{if((map[a.priority]||[]).includes(item.id)){item.priority=1;item.preferred=true;item.reasons.push('這是你最想先處理的需求');}});
 items.sort((x,y)=>Number(Boolean(y.preferred))-Number(Boolean(x.preferred))||x.priority-y.priority);
 return {mode,candidate,need,assessed,items};
}
export function estimate({level,identity,foreign,cost,remaining}){
 if(!Object.hasOwn(CAPS,level)||!['1','2','3'].includes(identity)||!['yes','no'].includes(foreign)||!Number.isFinite(cost)||cost<0||cost>10000000)throw new Error('請確認等級、身分別、聘僱情況及非負金額。');
 const cap=CAPS[level]*(foreign==='yes'?.3:1);
 const available=remaining==null?cap:remaining;
 if(!Number.isFinite(available)||available<0||available>cap)throw new Error('本月可用額度須介於 0 與本月標準額度之間。');
 const rate={1:0,2:.05,3:.16}[identity],covered=Math.min(cost,available),copay=Math.floor((covered*Math.round(rate*100))/100),excess=Math.max(0,cost-available);
 return {cap,available,rate,covered,copay,excess,government:covered-copay,self:copay+excess};
}
