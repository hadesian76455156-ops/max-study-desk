// ========== Max的学习打卡台 - 核心逻辑 ==========

// ===== 数据存储层 =====
const Storage = {
  KEY: 'max_study_desk_data',
  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : null;
    } catch(e) { console.error('加载数据失败', e); return null; }
  },
  save(data) {
    try { localStorage.setItem(this.KEY, JSON.stringify(data)); return true; }
    catch(e) { console.error('保存数据失败', e); return false; }
  }
};

// ===== 初始配置 =====
const LEVEL_SYSTEM = [
  { name: '武者', expPerStar: 100, icon: '🥋', charImg: '09_Q版可爱_头像.png' },
  { name: '武师', expPerStar: 200, icon: '⚔️', charImg: '01_经典修炼_Q版全身.png' },
  { name: '武灵', expPerStar: 350, icon: '✨', charImg: '11_漫画版_少年.png' },
  { name: '武王', expPerStar: 500, icon: '👑', charImg: '02_经典修炼_立绘.png' },
  { name: '武皇', expPerStar: 700, icon: '🏰', charImg: '03_古风汉服_红色披肩.png' },
  { name: '武宗', expPerStar: 1000, icon: '🗿', charImg: '04_古风汉服_半身.png' },
  { name: '武尊', expPerStar: 1400, icon: '🌟', charImg: '10_中秋主题_月亮.png' },
  { name: '武圣', expPerStar: 2000, icon: '🔥', charImg: '07_现代潮流_夹克.png' },
  { name: '虚帝', expPerStar: 2800, icon: '🌌', charImg: '06_铠甲战士_华丽.png' },
  { name: '武帝', expPerStar: 4000, icon: '⚡', charImg: '05_铠甲战士_封面.png' },
  { name: '神帝', expPerStar: 6000, icon: '🐉', charImg: '12_守护校园_铠甲.png' }
];

// ===== 角色形象配置 =====
const CHARACTER_IMAGES = [
  // 猫小九形态（12个）
  { id:'mj01', name:'经典修炼·Q版', file:'01_经典修炼_Q版全身.png', category:'猫小九', cost:50 },
  { id:'mj02', name:'经典修炼·立绘', file:'02_经典修炼_立绘.png', category:'猫小九', cost:50 },
  { id:'mj03', name:'古风汉服·披肩', file:'03_古风汉服_红色披肩.png', category:'猫小九', cost:50 },
  { id:'mj04', name:'古风汉服·半身', file:'04_古风汉服_半身.png', category:'猫小九', cost:50 },
  { id:'mj05', name:'铠甲战士·封面', file:'05_铠甲战士_封面.png', category:'猫小九', cost:50 },
  { id:'mj06', name:'铠甲战士·华丽', file:'06_铠甲战士_华丽.png', category:'猫小九', cost:50 },
  { id:'mj07', name:'现代潮流·夹克', file:'07_现代潮流_夹克.png', category:'猫小九', cost:50 },
  { id:'mj08', name:'现代潮流·半身', file:'08_现代潮流_半身.png', category:'猫小九', cost:50 },
  { id:'mj09', name:'Q版可爱·头像', file:'09_Q版可爱_头像.png', category:'猫小九', cost:50 },
  { id:'mj10', name:'中秋主题·月亮', file:'10_中秋主题_月亮.png', category:'猫小九', cost:50 },
  { id:'mj11', name:'漫画版·少年', file:'11_漫画版_少年.png', category:'猫小九', cost:50 },
  { id:'mj12', name:'守护校园·铠甲', file:'12_守护校园_铠甲.png', category:'猫小九', cost:50 },
  // 友方角色（9个）
  { id:'ally01', name:'猫白灵', file:'猫白灵.png', category:'友方', cost:50 },
  { id:'ally02', name:'猫小天', file:'猫小天.png', category:'友方', cost:50 },
  { id:'ally03', name:'猫黑云', file:'猫黑云.png', category:'友方', cost:50 },
  { id:'ally04', name:'猫白白', file:'猫白白.png', category:'友方', cost:50 },
  { id:'ally05', name:'青仙儿', file:'青仙儿.png', category:'友方', cost:50 },
  { id:'ally06', name:'狐小丽', file:'狐小丽.png', category:'友方', cost:50 },
  { id:'ally07', name:'龙傲天', file:'龙傲天.png', category:'友方', cost:50 },
  { id:'ally08', name:'剑子墨', file:'剑子墨.png', category:'友方', cost:50 },
  { id:'ally09', name:'鹿灵雁', file:'鹿灵雁.png', category:'友方', cost:50 },
  // 反派角色（8个）
  { id:'vil01', name:'猫元', file:'猫元.png', category:'反派', cost:50 },
  { id:'vil02', name:'猫里然', file:'猫里然.png', category:'反派', cost:50 },
  { id:'vil03', name:'猫尘封', file:'猫尘封.png', category:'反派', cost:50 },
  { id:'vil04', name:'鹏飞宇', file:'鹏飞宇.png', category:'反派', cost:50 },
  { id:'vil05', name:'鹏天武', file:'鹏天武.png', category:'反派', cost:50 },
  { id:'vil06', name:'狐言', file:'狐言.png', category:'反派', cost:50 },
  { id:'vil07', name:'龙小筹', file:'龙小筹.png', category:'反派', cost:50 },
  { id:'vil08', name:'白狼族战士', file:'白狼族战士.png', category:'反派', cost:50 }
];

// ===== 背景配置 =====
const BACKGROUND_IMAGES = [
  { id:'bg01', name:'修炼山谷', file:'01_修炼山谷.jpg', cost:150 },
  { id:'bg02', name:'宗门大殿', file:'02_宗门大殿.jpg', cost:150 },
  { id:'bg03', name:'星空夜景', file:'03_星空夜景.jpg', cost:150 },
  { id:'bg04', name:'云海仙境', file:'04_云海仙境.jpg', cost:150 }
];

// ===== 默认图标分配 =====
const DEFAULT_ICONS = {
  kanban: { overdue: '猫黑云.png', today: '猫白灵.png', pending: '龙傲天.png', upcoming: '剑子墨.png' },
  subject: { chinese: '青仙儿.png', english: '狐小丽.png', math: '猫小天.png', sport: '鹿灵雁.png', habit: '猫白白.png' }
};

const DEFAULT_TASKS = {
  1: [ // 周一
    { id:'t1_1', name:'语文作业', type:'chinese', category:'study', cultivation:10, required:true },
    { id:'t1_2', name:'数学作业', type:'math', category:'study', cultivation:10, required:true },
    { id:'t1_3', name:'英语听读', type:'english', category:'study', cultivation:10, required:true },
    { id:'t1_4', name:'管乐队训练', type:'other', category:'activity', cultivation:0, required:false, marker:true },
    { id:'t1_5', name:'洗漱', type:'habit', category:'habit', cultivation:5, required:true },
    { id:'t1_6', name:'自己穿衣', type:'habit', category:'habit', cultivation:5, required:true },
    { id:'t1_7', name:'整理学习物品', type:'habit', category:'habit', cultivation:5, required:true }
  ],
  2: [ // 周二
    { id:'t2_1', name:'语文作业', type:'chinese', category:'study', cultivation:10, required:true },
    { id:'t2_2', name:'数学作业', type:'math', category:'study', cultivation:10, required:true },
    { id:'t2_3', name:'英语听读', type:'english', category:'study', cultivation:10, required:true },
    { id:'t2_4', name:'跳绳3组×1分钟', type:'sport', category:'sport', cultivation:8, required:true, isJumpRope:true },
    { id:'t2_5', name:'洗漱', type:'habit', category:'habit', cultivation:5, required:true },
    { id:'t2_6', name:'自己穿衣', type:'habit', category:'habit', cultivation:5, required:true },
    { id:'t2_7', name:'整理学习物品', type:'habit', category:'habit', cultivation:5, required:true }
  ],
  3: [ // 周三
    { id:'t3_1', name:'语文作业', type:'chinese', category:'study', cultivation:10, required:true },
    { id:'t3_2', name:'数学作业', type:'math', category:'study', cultivation:10, required:true },
    { id:'t3_3', name:'英语听读', type:'english', category:'study', cultivation:10, required:true },
    { id:'t3_4', name:'美博英语作业', type:'english', category:'keyStudy', cultivation:15, required:true },
    { id:'t3_5', name:'洗漱', type:'habit', category:'habit', cultivation:5, required:true },
    { id:'t3_6', name:'自己穿衣', type:'habit', category:'habit', cultivation:5, required:true },
    { id:'t3_7', name:'整理学习物品', type:'habit', category:'habit', cultivation:5, required:true }
  ],
  4: [ // 周四
    { id:'t4_1', name:'语文作业', type:'chinese', category:'study', cultivation:10, required:true },
    { id:'t4_2', name:'数学作业', type:'math', category:'study', cultivation:10, required:true },
    { id:'t4_3', name:'英语听读', type:'english', category:'study', cultivation:10, required:true },
    { id:'t4_4', name:'跳绳3组×1分钟', type:'sport', category:'sport', cultivation:8, required:true, isJumpRope:true },
    { id:'t4_5', name:'洗漱', type:'habit', category:'habit', cultivation:5, required:true },
    { id:'t4_6', name:'自己穿衣', type:'habit', category:'habit', cultivation:5, required:true },
    { id:'t4_7', name:'整理学习物品', type:'habit', category:'habit', cultivation:5, required:true }
  ],
  5: [ // 周五
    { id:'t5_1', name:'语文作业', type:'chinese', category:'study', cultivation:10, required:true },
    { id:'t5_2', name:'数学作业', type:'math', category:'study', cultivation:10, required:true },
    { id:'t5_3', name:'英语听读', type:'english', category:'study', cultivation:10, required:true },
    { id:'t5_4', name:'足球队训练', type:'sport', category:'activity', cultivation:0, required:false, marker:true },
    { id:'t5_5', name:'洗漱', type:'habit', category:'habit', cultivation:5, required:true },
    { id:'t5_6', name:'自己穿衣', type:'habit', category:'habit', cultivation:5, required:true },
    { id:'t5_7', name:'整理学习物品', type:'habit', category:'habit', cultivation:5, required:true }
  ],
  6: [ // 周六
    { id:'t6_1', name:'新东方英语作业', type:'english', category:'keyStudy', cultivation:15, required:true },
    { id:'t6_2', name:'学而思数学作业', type:'math', category:'keyStudy', cultivation:15, required:true },
    { id:'t6_3', name:'语文作业', type:'chinese', category:'study', cultivation:10, required:true },
    { id:'t6_4', name:'数学作业', type:'math', category:'study', cultivation:10, required:true },
    { id:'t6_5', name:'英语作业', type:'english', category:'study', cultivation:10, required:true },
    { id:'t6_6', name:'跳绳3组×1分钟', type:'sport', category:'sport', cultivation:8, required:false, isJumpRope:true },
    { id:'t6_7', name:'洗漱', type:'habit', category:'habit', cultivation:5, required:true },
    { id:'t6_8', name:'自己穿衣', type:'habit', category:'habit', cultivation:5, required:true },
    { id:'t6_9', name:'整理学习物品', type:'habit', category:'habit', cultivation:5, required:true }
  ],
  0: [ // 周日
    { id:'t0_1', name:'课外阅读', type:'chinese', category:'study', cultivation:10, required:false },
    { id:'t0_2', name:'英语绘本/听读', type:'english', category:'study', cultivation:10, required:false },
    { id:'t0_3', name:'户外运动/跳绳', type:'sport', category:'sport', cultivation:8, required:false },
    { id:'t0_4', name:'洗漱', type:'habit', category:'habit', cultivation:5, required:true },
    { id:'t0_5', name:'自己穿衣', type:'habit', category:'habit', cultivation:5, required:true },
    { id:'t0_6', name:'整理学习物品', type:'habit', category:'habit', cultivation:5, required:true }
  ]
};

const DEFAULT_SPECIAL_TASKS = [
  { id:'sp1', name:'课外绘本', subject:'chinese', type:'progress', weeklyTarget:2, current:0, unit:'本', icon:'📖' },
  { id:'sp2', name:'学而思语文', subject:'chinese', type:'chapters', weeklyTarget:3, chapters:Array.from({length:24},(_,i)=>({id:'c'+i,name:'第'+(i+1)+'篇',done:false})), icon:'📝' },
  { id:'sp3', name:'学而思数学', subject:'math', type:'chapters', semesterTarget:15, chapters:Array.from({length:15},(_,i)=>({id:'m'+i,name:'第'+(i+1)+'讲',done:false})), icon:'🔢' },
  { id:'sp4', name:'新东方绘本', subject:'english', type:'progress', weeklyTarget:5, current:0, unit:'本', icon:'📚' }
];

const DEFAULT_REWARDS = [
  { id:'r1', name:'购买1款零食', cost:10, icon:'🍿', limitPeriod:'week', limitCount:2 },
  { id:'r2', name:'决定点1次外卖', cost:30, icon:'🍔', limitPeriod:'week', limitCount:1 },
  { id:'r3', name:'决定1次家庭电影/动画片', cost:40, icon:'🎬', limitPeriod:'week', limitCount:1 },
  { id:'r4', name:'决定1次周末亲子活动', cost:60, icon:'🎡', limitPeriod:'month', limitCount:2 },
  { id:'r5', name:'决定外出就餐的餐厅', cost:80, icon:'🍽️', limitPeriod:'month', limitCount:3 },
  { id:'r6', name:'购买1件兴趣装备', cost:100, icon:'🎯', limitPeriod:'month', limitCount:1 },
  { id:'r7', name:'骑马1次', cost:120, icon:'🐴', limitPeriod:'month', limitCount:2 },
  { id:'r8', name:'购买1个玩具', cost:150, icon:'🧸', limitPeriod:'year', limitCount:1 }
];

const DEFAULT_BADGES = [
  { id:'b1', name:'初出茅庐', desc:'连续3天圆满', icon:'🌱', condition:{type:'streak',value:3}, earned:false },
  { id:'b2', name:'小有所成', desc:'连续7天圆满', icon:'⭐', condition:{type:'streak',value:7}, earned:false },
  { id:'b3', name:'坚持不懈', desc:'连续14天圆满', icon:'💪', condition:{type:'streak',value:14}, earned:false },
  { id:'b4', name:'月度宗师', desc:'连续30天圆满', icon:'👑', condition:{type:'streak',value:30}, earned:false },
  { id:'b5', name:'绘本小博士', desc:'累计读完20本绘本', icon:'📖', condition:{type:'special',id:'sp1',value:20}, earned:false },
  { id:'b6', name:'英语达人', desc:'新东方绘本累计50本', icon:'🔤', condition:{type:'special',id:'sp4',value:50}, earned:false },
  { id:'b7', name:'数学思维王', desc:'学而思数学完成15讲', icon:'🔢', condition:{type:'special',id:'sp3',value:15}, earned:false },
  { id:'b8', name:'跳绳新手', desc:'首次完成3组跳绳且每组≥110个', icon:'🏃', condition:{type:'jumpRope',value:1}, earned:false },
  { id:'b9', name:'跳绳达人', desc:'单组最佳达到150个', icon:'⚡', condition:{type:'jumpBest',value:150}, earned:false },
  { id:'b10', name:'足球小将', desc:'足球队出勤10次', icon:'⚽', condition:{type:'football',value:10}, earned:false },
  { id:'b11', name:'今日圆满', desc:'首次当天全部完成', icon:'✅', condition:{type:'allComplete',value:1}, earned:false },
  { id:'b12', name:'修为突破', desc:'首次升级境界', icon:'🎉', condition:{type:'levelUp',value:1}, earned:false },
  { id:'b13', name:'首次兑换', desc:'首次在奖励中心兑换商品', icon:'🎁', condition:{type:'redeem',value:1}, earned:false },
  { id:'b14', name:'满月纪念', desc:'使用打卡台满30天', icon:'📅', condition:{type:'daysUsed',value:30}, earned:false },
  { id:'b15', name:'语文之星', desc:'学而思语文累计30篇', icon:'📝', condition:{type:'special',id:'sp2',value:30}, earned:false }
];

const OPTIONAL_LABORS = ['洗袜子','倒垃圾','盛饭','收拾碗筷','洗抹布','擦桌子','洗水果'];

const DEFAULT_REMINDERS = [
  { id:'rm1', time:'07:00', title:'起床啦', desc:'新的一天开始，看看今天的任务吧！', enabled:true },
  { id:'rm2', time:'16:30', title:'准备放学', desc:'今天还有任务等着你完成哦！', enabled:true },
  { id:'rm3', time:'19:30', title:'写作业时间', desc:'猫小九在等你一起修炼！', enabled:true },
  { id:'rm4', time:'21:00', title:'作业快完成了', desc:'记得跳绳（如需要），准备睡觉啦！', enabled:true },
  { id:'rm5', time:'21:20', title:'检查今日任务', desc:'看看今天的任务都完成了吗？', enabled:true },
  { id:'rm6', time:'21:30', title:'睡觉时间到', desc:'晚安，明天继续加油！', enabled:true }
];

// ===== 全局状态 =====
let AppData = null;
let currentPage = 'home';
let parentAuthed = false;
let currentHomeView = 'kanban';
let characterImages = {};

// ===== 工具函数 =====
function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function dateStr(d) {
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function getDayOfWeek() { return new Date().getDay(); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).substr(2,5); }

function showToast(msg, type='success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  const icons = { success:'✅', error:'❌', warning:'⚠️', info:'ℹ️' };
  toast.innerHTML = '<span>' + (icons[type]||'') + '</span><span>' + msg + '</span>';
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity='0'; toast.style.transform='translateX(30px)'; setTimeout(()=>toast.remove(), 300); }, 3000);
}

function showModal(title, body, onConfirm) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = body;
  document.getElementById('modalOverlay').classList.add('active');
  const btn = document.getElementById('modalConfirmBtn');
  btn.onclick = () => { closeModal(); if(onConfirm) onConfirm(); };
}
function closeModal() { document.getElementById('modalOverlay').classList.remove('active'); }

// ===== 数据初始化 =====
function initData() {
  let data = Storage.load();
  if (!data) {
    data = {
      config: {
        parentPassword: '1234',
        weeklyTasks: JSON.parse(JSON.stringify(DEFAULT_TASKS)),
        specialTasks: JSON.parse(JSON.stringify(DEFAULT_SPECIAL_TASKS)),
        rewards: JSON.parse(JSON.stringify(DEFAULT_REWARDS)),
        badges: JSON.parse(JSON.stringify(DEFAULT_BADGES)),
        reminders: JSON.parse(JSON.stringify(DEFAULT_REMINDERS)),
        optionalLabors: [...OPTIONAL_LABORS]
      },
      status: {
        totalCultivation: 0,
        levelIndex: 0,
        starIndex: 0,
        stars: 0,
        entertainmentMinutes: 0,
        continuousDays: 0,
        lastCompleteDate: null,
        firstUseDate: todayStr(),
        allCompleteCount: 0,
        levelUpCount: 0,
        redeemCount: 0,
        jumpRopePassCount: 0,
        jumpBest: 0,
        footballCount: 0,
        specialTotal: { sp1:0, sp2:0, sp3:0, sp4:0 }
      },
      dailyRecords: {},
      pendingReview: [],
      overdueTasks: [],
      redemptionRecords: [],
      levelUpRecords: [],
      jumpRopeRecords: [],
      habitRecords: {},
      unlockedCharacters: ['mj09'], // 默认解锁Q版可爱头像
      unlockedBackgrounds: [],
      personalization: {
        heroAvatar: null, // null=跟随境界
        homeBackground: null, // null=默认
        kanbanIcons: JSON.parse(JSON.stringify(DEFAULT_ICONS.kanban)),
        subjectIcons: JSON.parse(JSON.stringify(DEFAULT_ICONS.subject))
      }
    };
    Storage.save(data);
  }
  AppData = data;
  // 确保新字段存在
  if (!AppData.status.specialTotal) AppData.status.specialTotal = { sp1:0, sp2:0, sp3:0, sp4:0 };
  if (!AppData.status.firstUseDate) AppData.status.firstUseDate = todayStr();
  if (!AppData.overdueTasks) AppData.overdueTasks = [];
  if (!AppData.config.optionalLabors) AppData.config.optionalLabors = [...OPTIONAL_LABORS];
  if (!AppData.unlockedCharacters) AppData.unlockedCharacters = ['mj09'];
  if (!AppData.unlockedBackgrounds) AppData.unlockedBackgrounds = [];
  if (!AppData.personalization) {
    AppData.personalization = {
      heroAvatar: null,
      homeBackground: null,
      kanbanIcons: JSON.parse(JSON.stringify(DEFAULT_ICONS.kanban)),
      subjectIcons: JSON.parse(JSON.stringify(DEFAULT_ICONS.subject))
    };
  }
  if (!AppData.personalization.kanbanIcons) AppData.personalization.kanbanIcons = JSON.parse(JSON.stringify(DEFAULT_ICONS.kanban));
  if (!AppData.personalization.subjectIcons) AppData.personalization.subjectIcons = JSON.parse(JSON.stringify(DEFAULT_ICONS.subject));
}

function saveData() { Storage.save(AppData); }

// ===== 修为体系 =====
function getLevelInfo() {
  const s = AppData.status;
  const level = LEVEL_SYSTEM[s.levelIndex] || LEVEL_SYSTEM[0];
  const expForCurrentStar = level.expPerStar;
  const expInCurrentStar = s.totalCultivation - getExpBeforeLevel(s.levelIndex, s.starIndex);
  return {
    levelName: level.name,
    levelIcon: level.icon,
    star: s.starIndex + 1,
    expCurrent: Math.max(0, expInCurrentStar),
    expNeeded: expForCurrentStar,
    progress: Math.min(100, (expInCurrentStar / expForCurrentStar) * 100),
    isMax: s.levelIndex >= LEVEL_SYSTEM.length - 1 && s.starIndex >= 8
  };
}

function getExpBeforeLevel(levelIdx, starIdx) {
  let total = 0;
  for (let i = 0; i < levelIdx; i++) total += LEVEL_SYSTEM[i].expPerStar * 9;
  total += LEVEL_SYSTEM[levelIdx].expPerStar * starIdx;
  return total;
}

function addCultivation(amount, reason) {
  const s = AppData.status;
  const beforeLevel = s.levelIndex, beforeStar = s.starIndex;
  s.totalCultivation += amount;
  
  // 检查升级
  let leveledUp = false;
  while (true) {
    const info = getLevelInfo();
    if (info.isMax) break;
    if (info.expCurrent >= info.expNeeded) {
      s.totalCultivation = getExpBeforeLevel(s.levelIndex, s.starIndex) + info.expNeeded;
      if (s.starIndex < 8) {
        s.starIndex++;
      } else {
        s.starIndex = 0;
        s.levelIndex++;
      }
      s.totalCultivation = getExpBeforeLevel(s.levelIndex, s.starIndex);
      leveledUp = true;
      s.levelUpCount++;
      const newInfo = getLevelInfo();
      AppData.levelUpRecords.unshift({
        date: todayStr(),
        time: new Date().toLocaleTimeString(),
        from: LEVEL_SYSTEM[beforeLevel].name + '⭐' + (beforeStar+1),
        to: newInfo.levelName + '⭐' + newInfo.star,
        reason: reason
      });
      checkBadges();
    } else break;
  }
  
  if (leveledUp) {
    const info = getLevelInfo();
    showLevelUp(info);
  }
  saveData();
  return leveledUp;
}

function showLevelUp(info) {
  document.getElementById('levelUpChar').textContent = info.levelIcon;
  document.getElementById('levelUpLevel').textContent = '恭喜突破！现在是 ' + info.levelName + ' ⭐' + info.star;
  document.getElementById('levelUpOverlay').classList.add('active');
}
function closeLevelUp() { document.getElementById('levelUpOverlay').classList.remove('active'); renderAll(); }

// ===== 星星与娱乐时间 =====
function addStars(amount, reason) {
  AppData.status.stars += amount;
  if (AppData.status.stars < 0) AppData.status.stars = 0;
  saveData();
}

function addEntertainment(minutes) {
  AppData.status.entertainmentMinutes += minutes;
  if (AppData.status.entertainmentMinutes > 60) AppData.status.entertainmentMinutes = 60;
  saveData();
}

// ===== 每日任务管理 =====
function getTodayTasks() {
  const day = getDayOfWeek();
  return AppData.config.weeklyTasks[day] || [];
}

function getTodayRecord() {
  const today = todayStr();
  if (!AppData.dailyRecords[today]) {
    AppData.dailyRecords[today] = {
      date: today,
      tasks: {},
      allComplete: false,
      cultivationEarned: 0,
      starsEarned: 0,
      entertainmentEarned: 0,
      jumpRope: null,
      optionalLabors: []
    };
    saveData();
  }
  return AppData.dailyRecords[today];
}

function getTaskStatus(taskId) {
  const record = getTodayRecord();
  return record.tasks[taskId] || 'pending'; // pending / pendingReview / done
}

function setTaskStatus(taskId, status) {
  const record = getTodayRecord();
  record.tasks[taskId] = status;
  saveData();
}

function checkTask(taskId) {
  const task = getTodayTasks().find(t => t.id === taskId);
  if (!task) return;
  const status = getTaskStatus(taskId);
  if (status === 'pending') {
    setTaskStatus(taskId, 'pendingReview');
    AppData.pendingReview.push({
      id: uid(),
      taskId: taskId,
      taskName: task.name,
      taskType: task.type,
      cultivation: task.cultivation,
      date: todayStr(),
      time: new Date().toLocaleTimeString()
    });
    saveData();
    showToast('已提交，等待家长确认', 'info');
    renderAll();
  } else if (status === 'pendingReview') {
    showToast('该任务正在等待家长确认', 'warning');
  }
}

function confirmTask(reviewId) {
  const idx = AppData.pendingReview.findIndex(r => r.id === reviewId);
  if (idx === -1) return;
  const review = AppData.pendingReview[idx];
  setTaskStatus(review.taskId, 'done');
  
  // 结算修为
  if (review.cultivation > 0) {
    addCultivation(review.cultivation, '完成任务：' + review.taskName);
    getTodayRecord().cultivationEarned += review.cultivation;
  }
  
  AppData.pendingReview.splice(idx, 1);
  saveData();
  
  // 检查是否全部完成
  checkAllComplete();
  checkBadges();
  showToast('已确认：' + review.taskName, 'success');
  renderAll();
}

function rejectTask(reviewId) {
  const idx = AppData.pendingReview.findIndex(r => r.id === reviewId);
  if (idx === -1) return;
  const review = AppData.pendingReview[idx];
  setTaskStatus(review.taskId, 'pending');
  AppData.pendingReview.splice(idx, 1);
  saveData();
  showToast('已驳回：' + review.taskName, 'warning');
  renderAll();
}

function checkAllComplete() {
  const tasks = getTodayTasks().filter(t => t.required && !t.marker);
  const record = getTodayRecord();
  const allDone = tasks.every(t => getTaskStatus(t.id) === 'done');
  if (allDone && !record.allComplete) {
    record.allComplete = true;
    // 奖励：20修为 + 2星 + 15分钟娱乐
    addCultivation(20, '今日全部完成');
    addStars(2, '今日全部完成');
    addEntertainment(15);
    record.starsEarned += 2;
    record.entertainmentEarned += 15;
    record.cultivationEarned += 20;
    AppData.status.allCompleteCount++;
    
    // 连续打卡
    const yesterday = dateStr(new Date(Date.now() - 86400000));
    if (AppData.dailyRecords[yesterday] && AppData.dailyRecords[yesterday].allComplete) {
      AppData.status.continuousDays++;
    } else {
      AppData.status.continuousDays = 1;
    }
    AppData.status.lastCompleteDate = todayStr();
    
    // 连续里程碑奖励
    const streak = AppData.status.continuousDays;
    const streakRewards = { 3:50, 7:150, 14:300, 30:800 };
    const starRewards = { 3:3, 7:8, 14:15, 30:30 };
    if (streakRewards[streak]) {
      addCultivation(streakRewards[streak], '连续' + streak + '天圆满');
      addStars(starRewards[streak], '连续' + streak + '天圆满');
      showToast('🎉 连续' + streak + '天圆满！额外奖励' + streakRewards[streak] + '修为+' + starRewards[streak] + '星', 'success');
    }
    
    saveData();
    showToast('🎉 今日全部完成！获得20修为+2星+15分钟娱乐时间', 'success');
  }
}

// ===== 徽章系统 =====
function checkBadges() {
  const s = AppData.status;
  AppData.config.badges.forEach(badge => {
    if (badge.earned) return;
    let earned = false;
    const c = badge.condition;
    if (c.type === 'streak' && s.continuousDays >= c.value) earned = true;
    if (c.type === 'allComplete' && s.allCompleteCount >= c.value) earned = true;
    if (c.type === 'levelUp' && s.levelUpCount >= c.value) earned = true;
    if (c.type === 'redeem' && s.redeemCount >= c.value) earned = true;
    if (c.type === 'jumpRope' && s.jumpRopePassCount >= c.value) earned = true;
    if (c.type === 'jumpBest' && s.jumpBest >= c.value) earned = true;
    if (c.type === 'football' && s.footballCount >= c.value) earned = true;
    if (c.type === 'daysUsed') {
      const first = new Date(s.firstUseDate);
      const today = new Date();
      const days = Math.floor((today - first) / 86400000) + 1;
      if (days >= c.value) earned = true;
    }
    if (c.type === 'special' && s.specialTotal[c.id] >= c.value) earned = true;
    
    if (earned) {
      badge.earned = true;
      badge.earnedDate = todayStr();
      showToast('🏆 获得徽章：' + badge.name, 'success');
    }
  });
  saveData();
}

// ===== 页面路由 =====
function switchPage(page) {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.add('active');
  if (['chinese','english','math','sport','habit'].includes(page)) {
    updateSubjectIcons();
  }
  renderPage(page);
}

function switchHomeView(view) {
  currentHomeView = view;
  document.querySelectorAll('.view-switch button').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  document.getElementById('homeViewKanban').style.display = view === 'kanban' ? 'block' : 'none';
  document.getElementById('homeViewWeek').style.display = view === 'week' ? 'block' : 'none';
  document.getElementById('homeViewMonth').style.display = view === 'month' ? 'block' : 'none';
  if (view === 'week') renderWeekView();
  if (view === 'month') renderMonthView();
}

// ===== 渲染入口 =====
function renderAll() {
  try { updateTopbar(); } catch(e) { console.error('updateTopbar错误', e); }
  try { updateNavBadges(); } catch(e) { console.error('updateNavBadges错误', e); }
  try { renderPage(currentPage); } catch(e) { console.error('renderPage错误', e); }
}

function updateTopbar() {
  const d = new Date();
  const weekdays = ['周日','周一','周二','周三','周四','周五','周六'];
  document.getElementById('topbarDate').textContent = 
    d.getFullYear() + '年' + (d.getMonth()+1) + '月' + d.getDate() + '日 ' + weekdays[d.getDay()];
  document.getElementById('topbarStars').textContent = AppData.status.stars;
  document.getElementById('topbarCultivation').textContent = AppData.status.totalCultivation;
  document.getElementById('topbarStreak').textContent = AppData.status.continuousDays;
  
  const pendingCount = AppData.pendingReview.length;
  const alertEl = document.getElementById('pendingAlert');
  if (pendingCount > 0) {
    alertEl.style.display = 'flex';
    document.getElementById('pendingAlertCount').textContent = pendingCount;
  } else {
    alertEl.style.display = 'none';
  }
}

function updateNavBadges() {
  const tasks = getTodayTasks();
  const counts = { chinese:0, english:0, math:0, sport:0, habit:0 };
  tasks.forEach(t => {
    if (counts[t.type] !== undefined && getTaskStatus(t.id) === 'pending') counts[t.type]++;
  });
  Object.keys(counts).forEach(type => {
    const badge = document.getElementById('badge' + type.charAt(0).toUpperCase() + type.slice(1));
    if (badge) {
      if (counts[type] > 0) { badge.style.display = 'inline-block'; badge.textContent = counts[type]; }
      else badge.style.display = 'none';
    }
  });
}

function renderPage(page) {
  switch(page) {
    case 'home': renderHome(); break;
    case 'chinese': renderSubject('chinese'); break;
    case 'english': renderSubject('english'); break;
    case 'math': renderSubject('math'); break;
    case 'sport': renderSport(); break;
    case 'habit': renderHabit(); break;
    case 'adventure': renderAdventure(); break;
    case 'reward': renderReward(); break;
    case 'parent': renderParent(); break;
  }
}

// ===== 首页渲染 =====
function renderHome() {
  renderHeroPanel();
  renderKanban();
}

function renderHeroPanel() {
  const info = getLevelInfo();
  document.getElementById('heroLevel').innerHTML = info.levelName + ' <span class="level-star">⭐' + info.star + '</span>';
  document.getElementById('heroExpText').textContent = info.expCurrent + ' / ' + info.expNeeded;
  document.getElementById('heroExpBar').style.width = info.progress + '%';
  
  const tasks = getTodayTasks().filter(t => t.required && !t.marker);
  const doneCount = tasks.filter(t => getTaskStatus(t.id) === 'done').length;
  document.getElementById('heroTodayDone').textContent = doneCount + '/' + tasks.length;
  document.getElementById('heroPending').textContent = AppData.pendingReview.length;
  document.getElementById('heroStars').textContent = AppData.status.stars;
  
  // 角色图片：优先自定义头像，否则跟随境界
  try {
    const charImg = document.getElementById('heroCharImg');
    let avatarFile = null;
    try {
      if (AppData && AppData.personalization && AppData.personalization.heroAvatar) {
        const customChar = CHARACTER_IMAGES.find(c => c.id === AppData.personalization.heroAvatar);
        if (customChar) avatarFile = customChar.file;
      }
    } catch(e) { avatarFile = null; }
    if (!avatarFile) {
      try {
        const level = LEVEL_SYSTEM[AppData.status.levelIndex] || LEVEL_SYSTEM[0];
        avatarFile = level.charImg || '09_Q版可爱_头像.png';
      } catch(e) { avatarFile = '09_Q版可爱_头像.png'; }
    }
    const imgPath = 'assets/characters/variants/' + avatarFile;
    if (charImg) {
      charImg.innerHTML = '<img src="' + imgPath + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.style.display=\'none\';this.parentNode.innerHTML=\'🐱\'">';
    }
  } catch(e) {
    console.error('角色图片渲染错误', e);
  }
}

function renderKanban() {
  try {
  const board = document.getElementById('kanbanBoard');
  const filter = document.getElementById('kanbanFilter').value;
  const today = todayStr();
  
  // 今日任务
  let todayTasks = getTodayTasks().filter(t => !t.marker);
  if (filter !== 'all') todayTasks = todayTasks.filter(t => t.type === filter);
  
  const pendingTasks = todayTasks.filter(t => getTaskStatus(t.id) === 'pending');
  const reviewTasks = AppData.pendingReview.filter(r => r.date === today);
  const doneTasks = todayTasks.filter(t => getTaskStatus(t.id) === 'done');
  
  // 已过期任务（生活习惯和运动不计入已过期，因为无法后续弥补）
  let overdue = AppData.overdueTasks.filter(t => !t.resolved && t.type !== 'habit' && t.type !== 'sport');
  if (filter !== 'all') overdue = overdue.filter(t => t.type === filter);
  
  // 近7天任务
  const upcoming = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date(Date.now() + i * 86400000);
    const day = d.getDay();
    // 近七天待办：只显示非每日固定任务（运动、专项任务），不显示日常语数英和生活习惯
    let dayTasks = (AppData.config.weeklyTasks[day] || []).filter(t => !t.marker && t.required && (t.type === 'sport' || t.category === 'keyStudy' || t.isSpecial));
    if (filter !== 'all') dayTasks = dayTasks.filter(t => t.type === filter);
    if (dayTasks.length > 0) {
      upcoming.push({
        date: dateStr(d),
        label: i === 1 ? '明天' : (i === 2 ? '后天' : (d.getMonth()+1) + '月' + d.getDate() + '日'),
        weekday: ['周日','周一','周二','周三','周四','周五','周六'][day],
        tasks: dayTasks,
        hasFootball: day === 5,
        hasBand: day === 1,
        hasEnglish: day === 3
      });
    }
  }
  
  if (board) {
    board.innerHTML = 
      renderKanbanColumn('overdue', '已过期', '🔴', overdue, renderOverdueCard) +
      renderKanbanColumn('today', '今日待办', '🟠', pendingTasks, renderTaskCard) +
      renderKanbanColumn('pending', '待确认', '🟡', reviewTasks, renderReviewCard) +
      renderKanbanColumn('upcoming', '近七天待办', '🔵', upcoming, renderUpcomingGroup);
  }
  } catch(e) {
    console.error('renderKanban错误', e);
    const board = document.getElementById('kanbanBoard');
    if (board) board.innerHTML = '<div style="padding:20px;color:#999;text-align:center;">看板加载失败，请刷新页面</div>';
  }
}

function renderKanbanColumn(cls, title, icon, items, renderFn) {
  try {
    // 看板列背景：使用角色形象半透明背景
    let colStyle = '';
    let bgIconFile = null;
    try {
      if (AppData && AppData.personalization && AppData.personalization.kanbanIcons) {
        bgIconFile = AppData.personalization.kanbanIcons[cls];
      }
    } catch(e) { bgIconFile = null; }
    
    if (bgIconFile) {
      const bgPath = 'assets/other_characters/' + bgIconFile;
      colStyle = ' style="background-image:url(\'' + bgPath + '\');background-size:cover;background-position:center center;background-repeat:no-repeat;position:relative;"';
    }
    let html = '<div class="kanban-column ' + cls + '"' + colStyle + '>';
    // 半透明遮罩层，确保文字清晰（不拦截点击）
    if (bgIconFile) {
      html += '<div style="position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,0.88);border-radius:16px;pointer-events:none;z-index:0;"></div>';
    }
    html += '<div style="position:relative;z-index:1;">';
    // 看板列图标：优先使用角色形象
    let colIconHtml = icon;
    let iconFile = null;
    try {
      if (AppData && AppData.personalization && AppData.personalization.kanbanIcons) {
        iconFile = AppData.personalization.kanbanIcons[cls];
      }
    } catch(e) { iconFile = null; }
    
    if (iconFile) {
      const iconPath = 'assets/other_characters/' + iconFile;
      colIconHtml = '<img src="' + iconPath + '" style="width:28px;height:28px;border-radius:50%;object-fit:cover;vertical-align:middle;" onerror="this.outerHTML=\'' + icon + '\'">';
    }
    html += '<div class="col-header"><div class="col-title">' + colIconHtml + ' ' + title + '</div><div class="col-count">' + items.length + '</div></div>';
    html += '<div class="kanban-cards">';
    if (items.length === 0) {
      html += '<div style="text-align:center;color:#ccc;padding:30px 0;font-size:14px;">暂无任务</div>';
    } else {
      items.forEach(item => { 
        try { html += renderFn(item); } catch(e) { console.error('渲染卡片失败', e); }
      });
    }
    html += '</div>';
    html += '</div></div>';
    return html;
  } catch(e) {
    console.error('renderKanbanColumn错误', e);
    // 降级：返回最简单的列结构
    return '<div class="kanban-column ' + cls + '"><div class="col-header"><div class="col-title">' + icon + ' ' + title + '</div><div class="col-count">' + items.length + '</div></div><div class="kanban-cards"><div style="text-align:center;color:#ccc;padding:30px 0;">加载中...</div></div></div>';
  }
}

function renderTaskCard(task) {
  const tagClass = 'tag-' + (task.type || 'study');
  const typeLabels = { chinese:'语文', english:'英语', math:'数学', sport:'运动', habit:'生活习惯', study:'学习' };
  let html = '<div class="kanban-card" style="border-left-color:var(--primary);" onclick="checkTask(\'' + task.id + '\')">';
  html += '<div class="card-top"><div class="checkbox"></div><div class="card-content">';
  html += '<div class="card-name">' + task.name + '</div>';
  html += '<div class="card-meta">';
  html += '<span class="tag ' + tagClass + '">' + (typeLabels[task.type]||'') + '</span>';
  if (task.cultivation > 0) html += '<span class="card-cultivation">+' + task.cultivation + '✨</span>';
  if (task.isJumpRope) html += '<span style="font-size:11px;color:var(--text-lighter);">每组≥110个</span>';
  html += '</div></div></div></div>';
  return html;
}

function renderReviewCard(review) {
  const typeLabels = { chinese:'语文', english:'英语', math:'数学', sport:'运动', habit:'生活习惯', study:'学习' };
  let html = '<div class="kanban-card" style="border-left-color:var(--gold);">';
  html += '<div class="card-top"><div class="checkbox pending">⏳</div><div class="card-content">';
  html += '<div class="card-name">' + review.taskName + '</div>';
  html += '<div class="card-meta">';
  html += '<span class="tag tag-study">' + (typeLabels[review.taskType]||'') + '</span>';
  if (review.cultivation > 0) html += '<span class="card-cultivation">+' + review.cultivation + '✨</span>';
  html += '<span class="card-due">' + review.time + '</span>';
  html += '</div></div></div>';
  html += '<div class="card-actions">';
  html += '<button class="btn btn-success btn-sm" onclick="confirmTask(\'' + review.id + '\')">✓ 确认</button>';
  html += '<button class="btn btn-danger btn-sm" onclick="rejectTask(\'' + review.id + '\')">✗ 驳回</button>';
  html += '</div></div>';
  return html;
}

function renderOverdueCard(task) {
  // 计算过期天数
  const overdueDays = task.overdueDays || 0;
  const originalDate = task.originalDate || '';
  let html = '<div class="kanban-card" style="border-left-color:var(--red);" onclick="checkTask(\'' + task.id + '\')">';
  html += '<div class="card-top"><div class="checkbox"></div><div class="card-content">';
  html += '<div class="card-name">' + task.name + (originalDate ? ' <span style="font-size:12px;color:var(--text-lighter);font-weight:normal;">' + originalDate + '</span>' : '') + '</div>';
  html += '<div class="card-meta">';
  if (overdueDays > 0) html += '<span style="font-size:11px;color:var(--red);font-weight:bold;background:#FFF1F0;padding:2px 6px;border-radius:6px;">已过期' + overdueDays + '天</span>';
  html += '<span class="card-due">原计划：' + task.origDate + '</span>';
  if (task.cultivation > 0) html += '<span class="card-cultivation">+' + task.cultivation + '✨</span>';
  html += '</div></div></div>';
  html += '<div class="card-actions">';
  html += '<button class="btn btn-success btn-sm" onclick="completeOverdue(\'' + task.id + '\')">✓ 完成并提交确认</button>';
  html += '</div></div>';
  return html;
}

function renderUpcomingGroup(group) {
  let html = '<div class="date-group">';
  let specialIcons = '';
  if (group.hasFootball) specialIcons += ' ⚽';
  if (group.hasBand) specialIcons += ' 🎺';
  if (group.hasEnglish) specialIcons += ' 📖';
  html += '<div class="date-group-title">📅 ' + group.label + '（' + group.weekday + '）' + specialIcons + '</div>';
  group.tasks.forEach(t => {
    html += '<div class="kanban-card" style="border-left-color:var(--blue);opacity:0.8;">';
    html += '<div class="card-top"><div class="checkbox" style="border-style:dashed;"></div><div class="card-content">';
    html += '<div class="card-name" style="font-size:13px;">' + t.name + '</div>';
    html += '<div class="card-meta">';
    if (t.cultivation > 0) html += '<span class="card-cultivation">+' + t.cultivation + '✨</span>';
    html += '</div></div></div></div>';
  });
  html += '</div>';
  return html;
}

// 已过期任务操作
function postponeOverdue(id) {
  showToast('顺延功能已禁用，请直接完成并提交确认', 'info');
}

function postponeAllOverdue() {
  showToast('顺延功能已禁用，请逐个完成并提交确认', 'info');
}

function completeOverdue(id) {
  const idx = AppData.overdueTasks.findIndex(t => t.id === id);
  if (idx === -1) return;
  const task = AppData.overdueTasks[idx];
  // 进入待确认状态，家长确认后完成
  const reviewItem = {
    id: 'rv_' + Date.now(),
    taskId: task.id,
    taskName: task.name,
    taskType: task.type,
    cultivation: task.cultivation || 0,
    date: todayStr(),
    time: new Date().toTimeString().slice(0,5),
    fromOverdue: true,
    overdueOriginalDate: task.origDate || task.originalDate || ''
  };
  AppData.pendingReview.push(reviewItem);
  task.resolved = true;
  task.pendingConfirm = true;
  saveData();
  renderKanban();
  renderHeroPanel();
  showToast('已提交家长确认', 'success');
  renderAll();
}

// 每日结算（将未完成任务移入已过期）
function dailySettlement() {
  const yesterday = dateStr(new Date(Date.now() - 86400000));
  const record = AppData.dailyRecords[yesterday];
  if (!record || record.settled) return;
  
  const day = new Date(Date.now() - 86400000).getDay();
  const tasks = AppData.config.weeklyTasks[day] || [];
  tasks.forEach(t => {
    if (t.required && !t.marker && record.tasks[t.id] !== 'done') {
      AppData.overdueTasks.push({
        id: uid(),
        name: t.name,
        type: t.type,
        cultivation: t.cultivation,
        origDate: yesterday,
        resolved: false
      });
    }
  });
  record.settled = true;
  saveData();
}

// ===== 周视图 =====
function renderWeekView() {
  const container = document.getElementById('weekViewContent');
  let html = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:10px;">';
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + i);
    const day = d.getDay();
    const tasks = (AppData.config.weeklyTasks[day] || []).filter(t => !t.marker);
    const dateKey = dateStr(d);
    const record = AppData.dailyRecords[dateKey];
    const isToday = dateKey === todayStr();
    
    html += '<div style="background:' + (isToday ? '#FFF3E8' : '#FAFAFA') + ';border-radius:12px;padding:12px;border:2px solid ' + (isToday ? 'var(--primary)' : 'transparent') + ';">';
    html += '<div style="font-weight:bold;margin-bottom:8px;font-size:14px;">' + ['周日','周一','周二','周三','周四','周五','周六'][day] + '<br><span style="font-size:12px;color:var(--text-light);">' + (d.getMonth()+1) + '/' + d.getDate() + '</span></div>';
    tasks.forEach(t => {
      let status = 'pending';
      if (record && record.tasks[t.id]) status = record.tasks[t.id];
      const icon = status === 'done' ? '✅' : (status === 'pendingReview' ? '⏳' : '⬜');
      html += '<div style="font-size:12px;padding:4px 0;color:' + (status === 'done' ? '#999' : '#333') + ';">' + icon + ' ' + t.name + '</div>';
    });
    if (record && record.allComplete) html += '<div style="margin-top:8px;font-size:11px;color:var(--green);font-weight:bold;">🎉 今日圆满</div>';
    html += '</div>';
  }
  html += '</div>';
  container.innerHTML = html;
}

// ===== 月视图 =====
function renderMonthView() {
  const container = document.getElementById('monthViewContent');
  const d = new Date();
  const year = d.getFullYear(), month = d.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  let html = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;text-align:center;">';
  ['日','一','二','三','四','五','六'].forEach(w => {
    html += '<div style="font-weight:bold;padding:8px;color:var(--primary);">' + w + '</div>';
  });
  for (let i = 0; i < firstDay; i++) html += '<div></div>';
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = year + '-' + String(month+1).padStart(2,'0') + '-' + String(day).padStart(2,'0');
    const record = AppData.dailyRecords[dateKey];
    const isToday = dateKey === todayStr();
    let bg = '#FAFAFA', color = '#333';
    if (record && record.allComplete) { bg = '#F6FFED'; color = '#52C41A'; }
    else if (record) { bg = '#FFF2E8'; color = '#FA8C16'; }
    if (isToday) { bg = 'var(--primary)'; color = '#fff'; }
    html += '<div style="padding:12px 8px;border-radius:8px;background:' + bg + ';color:' + color + ';font-weight:bold;cursor:pointer;" onclick="showDayDetail(\'' + dateKey + '\')">' + day + '</div>';
  }
  html += '</div>';
  html += '<div style="margin-top:16px;display:flex;gap:16px;font-size:13px;color:var(--text-light);">';
  html += '<span><span style="display:inline-block;width:14px;height:14px;background:#F6FFED;border-radius:3px;vertical-align:middle;"></span> 全部完成</span>';
  html += '<span><span style="display:inline-block;width:14px;height:14px;background:#FFF2E8;border-radius:3px;vertical-align:middle;"></span> 部分完成</span>';
  html += '<span><span style="display:inline-block;width:14px;height:14px;background:var(--primary);border-radius:3px;vertical-align:middle;"></span> 今天</span>';
  html += '</div>';
  container.innerHTML = html;
}

function showDayDetail(dateKey) {
  const record = AppData.dailyRecords[dateKey];
  let body = '<p><strong>日期：</strong>' + dateKey + '</p>';
  if (record) {
    body += '<p><strong>状态：</strong>' + (record.allComplete ? '🎉 全部完成' : '部分完成/未完成') + '</p>';
    body += '<p><strong>获得修为：</strong>' + (record.cultivationEarned||0) + '点</p>';
    body += '<p><strong>获得星星：</strong>' + (record.starsEarned||0) + '颗</p>';
    if (record.jumpRope) body += '<p><strong>跳绳：</strong>' + record.jumpRope.set1 + '/' + record.jumpRope.set2 + '/' + record.jumpRope.set3 + '个（' + (record.jumpRope.passed ? '达标✅' : '未达标❌') + '）</p>';
  } else {
    body += '<p>该日暂无记录</p>';
  }
  showModal('当日详情', body);
}

// ===== 学科页面渲染 =====
function renderSubject(subject) {
  const subjectNames = { chinese:'语文', english:'英语', math:'数学' };
  const tasks = getTodayTasks().filter(t => t.type === subject);
  
  // 今日任务
  let todayHtml = '';
  if (tasks.length === 0) {
    todayHtml = '<div style="text-align:center;color:#ccc;padding:30px 0;">今天没有' + subjectNames[subject] + '任务</div>';
  } else {
    tasks.forEach(t => {
      const status = getTaskStatus(t.id);
      const checkClass = status === 'done' ? 'checked' : (status === 'pendingReview' ? 'pending' : '');
      const checkIcon = status === 'done' ? '✓' : (status === 'pendingReview' ? '⏳' : '');
      const disabled = status !== 'pending' ? 'style="opacity:0.6;pointer-events:none;"' : '';
      todayHtml += '<div class="task-item" ' + disabled + '>';
      todayHtml += '<div class="task-check ' + checkClass + '" onclick="checkTask(\'' + t.id + '\')">' + checkIcon + '</div>';
      todayHtml += '<div class="task-info"><div class="task-name">' + t.name + '</div>';
      if (t.isJumpRope) todayHtml += '<div class="task-desc">每组≥110个，完成后到运动模块记录成绩</div>';
      todayHtml += '</div>';
      todayHtml += '<div class="task-cultivation">+' + t.cultivation + '✨</div>';
      todayHtml += '</div>';
    });
  }
  document.getElementById(subject + 'TodayTasks').innerHTML = todayHtml;
  
  // 专项任务
  const specialTasks = AppData.config.specialTasks.filter(t => t.subject === subject);
  let specialHtml = '';
  specialTasks.forEach(t => {
    specialHtml += '<div class="special-item">';
    specialHtml += '<div class="special-header"><div class="special-name">' + t.icon + ' ' + t.name + '</div>';
    if (t.type === 'progress') {
      specialHtml += '<div class="special-target">本周 ' + t.current + '/' + t.weeklyTarget + ' ' + t.unit + '（累计' + (AppData.status.specialTotal[t.id]||0) + '）</div>';
    } else if (t.type === 'chapters') {
      const done = t.chapters.filter(c => c.done).length;
      const target = t.semesterTarget || t.chapters.length;
      specialHtml += '<div class="special-target">已完成 ' + done + '/' + target + ' 讲/篇</div>';
    }
    specialHtml += '</div>';
    
    if (t.type === 'progress') {
      const pct = Math.min(100, (t.current / t.weeklyTarget) * 100);
      specialHtml += '<div class="special-progress"><div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>';
      specialHtml += '<div class="progress-text">进度 ' + pct.toFixed(0) + '%</div></div>';
      specialHtml += '<div class="special-actions">';
      specialHtml += '<button class="btn btn-primary btn-sm" onclick="incrementSpecial(\'' + t.id + '\')">+ 完成1' + t.unit + '</button>';
      specialHtml += '<button class="btn btn-secondary btn-sm" onclick="decrementSpecial(\'' + t.id + '\')">- 撤销</button>';
      specialHtml += '</div>';
    } else if (t.type === 'chapters') {
      specialHtml += '<div class="chapter-list">';
      t.chapters.forEach((c, idx) => {
        specialHtml += '<div class="chapter-item ' + (c.done ? 'done' : '') + '">';
        specialHtml += '<div class="chapter-check ' + (c.done ? 'checked' : '') + '" onclick="toggleChapter(\'' + t.id + '\',' + idx + ')">' + (c.done ? '✓' : '') + '</div>';
        specialHtml += '<div class="chapter-name">' + c.name + '</div>';
        specialHtml += '</div>';
      });
      specialHtml += '</div>';
    }
    specialHtml += '</div>';
  });
  document.getElementById(subject + 'SpecialTasks').innerHTML = specialHtml;
}

function incrementSpecial(id) {
  const t = AppData.config.specialTasks.find(x => x.id === id);
  if (!t) return;
  t.current++;
  AppData.status.specialTotal[id] = (AppData.status.specialTotal[id] || 0) + 1;
  // 每周目标完成时奖励
  if (t.current === t.weeklyTarget) {
    addCultivation(15, '专项任务完成：' + t.name);
    addStars(2, '专项任务完成：' + t.name);
    showToast('🎉 ' + t.name + '本周目标完成！获得15修为+2星', 'success');
  }
  checkBadges();
  saveData();
  renderAll();
}

function decrementSpecial(id) {
  const t = AppData.config.specialTasks.find(x => x.id === id);
  if (!t || t.current <= 0) return;
  t.current--;
  AppData.status.specialTotal[id] = Math.max(0, (AppData.status.specialTotal[id] || 0) - 1);
  saveData();
  renderAll();
}

function toggleChapter(specialId, chapterIdx) {
  const t = AppData.config.specialTasks.find(x => x.id === specialId);
  if (!t || !t.chapters[chapterIdx]) return;
  t.chapters[chapterIdx].done = !t.chapters[chapterIdx].done;
  if (t.chapters[chapterIdx].done) {
    AppData.status.specialTotal[specialId] = (AppData.status.specialTotal[specialId] || 0) + 1;
    addCultivation(10, '完成章节：' + t.chapters[chapterIdx].name);
    // 全部完成奖励
    if (t.chapters.every(c => c.done)) {
      addCultivation(30, '专项全部完成：' + t.name);
      addStars(5, '专项全部完成：' + t.name);
      showToast('🎉 ' + t.name + '全部完成！获得30修为+5星', 'success');
    }
  } else {
    AppData.status.specialTotal[specialId] = Math.max(0, (AppData.status.specialTotal[specialId] || 0) - 1);
  }
  checkBadges();
  saveData();
  renderAll();
}

// ===== 运动模块 =====
function renderSport() {
  const today = getDayOfWeek();
  const hasFootball = today === 5;
  const jumpTask = getTodayTasks().find(t => t.isJumpRope);
  const record = getTodayRecord();
  
  // 跳绳卡片
  const jumpCard = document.getElementById('jumpRopeCard');
  if (hasFootball) {
    jumpCard.style.display = 'none';
  } else {
    jumpCard.style.display = 'block';
    if (record.jumpRope) {
      document.getElementById('jumpSet1').value = record.jumpRope.set1;
      document.getElementById('jumpSet2').value = record.jumpRope.set2;
      document.getElementById('jumpSet3').value = record.jumpRope.set3;
      showJumpResult(record.jumpRope);
    } else {
      document.getElementById('jumpSet1').value = '';
      document.getElementById('jumpSet2').value = '';
      document.getElementById('jumpSet3').value = '';
      document.getElementById('jumpResult').innerHTML = '';
    }
  }
  
  // 足球队记录
  let footballHtml = '';
  if (hasFootball) {
    footballHtml += '<div style="background:#FFF3E8;padding:16px;border-radius:12px;margin-bottom:16px;text-align:center;">';
    footballHtml += '<div style="font-size:32px;margin-bottom:8px;">⚽</div>';
    footballHtml += '<div style="font-weight:bold;margin-bottom:8px;">今天有足球队训练！</div>';
    if (!record.footballMarked) {
      footballHtml += '<button class="btn btn-primary btn-sm" onclick="markFootball()">标记已参加训练</button>';
    } else {
      footballHtml += '<div style="color:var(--green);font-weight:bold;">✅ 已参加训练</div>';
    }
    footballHtml += '</div>';
  }
  footballHtml += '<div style="font-size:14px;color:var(--text-light);">累计参加足球队训练：' + AppData.status.footballCount + '次</div>';
  document.getElementById('footballRecords').innerHTML = footballHtml;
  
  // 跳绳趋势图
  drawJumpChart();
}

function submitJumpRope() {
  const s1 = parseInt(document.getElementById('jumpSet1').value) || 0;
  const s2 = parseInt(document.getElementById('jumpSet2').value) || 0;
  const s3 = parseInt(document.getElementById('jumpSet3').value) || 0;
  
  if (s1 <= 0 || s2 <= 0 || s3 <= 0) {
    showToast('请输入三组跳绳成绩', 'warning');
    return;
  }
  
  const passed = s1 >= 110 && s2 >= 110 && s3 >= 110;
  const best = Math.max(s1, s2, s3);
  const record = getTodayRecord();
  record.jumpRope = { set1:s1, set2:s2, set3:s3, passed:passed, best:best };
  
  // 更新最佳成绩
  if (best > AppData.status.jumpBest) AppData.status.jumpBest = best;
  
  // 记录历史
  AppData.jumpRopeRecords.unshift({
    date: todayStr(),
    set1: s1, set2: s2, set3: s3,
    best: best, passed: passed
  });
  
  if (passed) {
    AppData.status.jumpRopePassCount++;
    // 找到跳绳任务并标记
    const jumpTask = getTodayTasks().find(t => t.isJumpRope);
    if (jumpTask && getTaskStatus(jumpTask.id) === 'pending') {
      checkTask(jumpTask.id);
    }
    showToast('跳绳达标！每组都≥110个，太棒了！', 'success');
  } else {
    showToast('跳绳未达标，继续加油！（需要每组≥110个）', 'warning');
  }
  
  checkBadges();
  saveData();
  renderAll();
}

function showJumpResult(data) {
  const resultEl = document.getElementById('jumpResult');
  const passed = data.passed;
  resultEl.innerHTML = '<div class="jump-result ' + (passed ? 'pass' : 'fail') + '">' + 
    (passed ? '✅ 达标！三组成绩：' + data.set1 + '/' + data.set2 + '/' + data.set3 + '，最佳' + data.best + '个' :
     '❌ 未达标，三组成绩：' + data.set1 + '/' + data.set2 + '/' + data.set3 + '，需要每组≥110个') + '</div>';
  
  // 标记输入框颜色
  ['jumpSet1','jumpSet2','jumpSet3'].forEach((id, idx) => {
    const val = [data.set1, data.set2, data.set3][idx];
    document.getElementById(id).className = val >= 110 ? 'pass' : 'fail';
  });
}

function markFootball() {
  const record = getTodayRecord();
  record.footballMarked = true;
  AppData.status.footballCount++;
  checkBadges();
  saveData();
  showToast('已标记参加足球队训练', 'success');
  renderAll();
}

function drawJumpChart() {
  const canvas = document.getElementById('jumpChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const records = AppData.jumpRopeRecords.slice(0, 14).reverse();
  
  const W = canvas.parentElement.clientWidth;
  const H = 250;
  canvas.width = W; canvas.height = H;
  ctx.clearRect(0, 0, W, H);
  
  if (records.length === 0) {
    ctx.fillStyle = '#ccc';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('暂无跳绳记录', W/2, H/2);
    return;
  }
  
  const padding = { top: 30, right: 20, bottom: 40, left: 50 };
  const chartW = W - padding.left - padding.right;
  const chartH = H - padding.top - padding.bottom;
  
  const maxVal = Math.max(150, ...records.map(r => r.best));
  const minVal = 0;
  
  // 网格线
  ctx.strokeStyle = '#f0f0f0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (chartH / 5) * i;
    ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(W - padding.right, y); ctx.stroke();
    ctx.fillStyle = '#999'; ctx.font = '11px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxVal - (maxVal / 5) * i), padding.left - 8, y + 4);
  }
  
  // 数据线
  const stepX = records.length > 1 ? chartW / (records.length - 1) : 0;
  ctx.strokeStyle = '#FF8C42';
  ctx.lineWidth = 3;
  ctx.beginPath();
  records.forEach((r, i) => {
    const x = padding.left + stepX * i;
    const y = padding.top + chartH - ((r.best - minVal) / (maxVal - minVal)) * chartH;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  
  // 数据点
  records.forEach((r, i) => {
    const x = padding.left + stepX * i;
    const y = padding.top + chartH - ((r.best - minVal) / (maxVal - minVal)) * chartH;
    ctx.fillStyle = r.passed ? '#52C41A' : '#FF4D4F';
    ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
    
    // X轴标签
    if (records.length <= 10 || i % 2 === 0) {
      ctx.fillStyle = '#999'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(r.date.slice(5), x, H - padding.bottom + 16);
    }
  });
  
  // 标题
  ctx.fillStyle = '#333'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('最佳成绩趋势（个/分钟）', padding.left, 18);
  
  // 图例
  ctx.fillStyle = '#52C41A'; ctx.fillRect(W - 120, 8, 10, 10);
  ctx.fillStyle = '#666'; ctx.font = '11px sans-serif'; ctx.fillText('达标', W - 105, 17);
  ctx.fillStyle = '#FF4D4F'; ctx.fillRect(W - 70, 8, 10, 10);
  ctx.fillStyle = '#666'; ctx.fillText('未达标', W - 55, 17);
}

// ===== 生活习惯模块 =====
function renderHabit() {
  const tasks = getTodayTasks().filter(t => t.type === 'habit');
  let html = '';
  tasks.forEach(t => {
    const status = getTaskStatus(t.id);
    const checkClass = status === 'done' ? 'checked' : (status === 'pendingReview' ? 'pending' : '');
    const checkIcon = status === 'done' ? '✓' : (status === 'pendingReview' ? '⏳' : '');
    html += '<div class="task-item" onclick="checkTask(\'' + t.id + '\')">';
    html += '<div class="task-check ' + checkClass + '">' + checkIcon + '</div>';
    html += '<div class="task-info"><div class="task-name">' + t.name + '</div></div>';
    html += '<div class="task-cultivation">+' + t.cultivation + '✨</div>';
    html += '</div>';
  });
  document.getElementById('habitTodayTasks').innerHTML = html;
  
  // 选做劳动
  const record = getTodayRecord();
  const doneLabors = record.optionalLabors || [];
  let laborHtml = '<div style="display:flex;flex-wrap:wrap;gap:10px;">';
  AppData.config.optionalLabors.forEach(labor => {
    const done = doneLabors.includes(labor);
    laborHtml += '<button class="btn ' + (done ? 'btn-success' : 'btn-secondary') + ' btn-sm" onclick="toggleLabor(\'' + labor + '\')">' + (done ? '✓ ' : '') + labor + '</button>';
  });
  laborHtml += '</div>';
  if (doneLabors.length > 0) {
    laborHtml += '<div style="margin-top:12px;font-size:13px;color:var(--green);">已完成 ' + doneLabors.length + ' 项选做劳动，太棒了！</div>';
  }
  document.getElementById('optionalLabors').innerHTML = laborHtml;
  
  // 习惯日历
  renderHabitCalendar();
}

function toggleLabor(labor) {
  const record = getTodayRecord();
  if (!record.optionalLabors) record.optionalLabors = [];
  const idx = record.optionalLabors.indexOf(labor);
  if (idx === -1) {
    record.optionalLabors.push(labor);
    addCultivation(3, '完成选做劳动：' + labor);
    showToast('完成：' + labor + '，获得3修为', 'success');
  } else {
    record.optionalLabors.splice(idx, 1);
  }
  saveData();
  renderAll();
}

function renderHabitCalendar() {
  const container = document.getElementById('habitCalendar');
  const d = new Date();
  const year = d.getFullYear(), month = d.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  let html = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center;">';
  ['日','一','二','三','四','五','六'].forEach(w => {
    html += '<div style="font-weight:bold;padding:6px;color:var(--primary);font-size:12px;">' + w + '</div>';
  });
  for (let i = 0; i < firstDay; i++) html += '<div></div>';
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = year + '-' + String(month+1).padStart(2,'0') + '-' + String(day).padStart(2,'0');
    const record = AppData.dailyRecords[dateKey];
    const habitTasks = (AppData.config.weeklyTasks[new Date(dateKey).getDay()] || []).filter(t => t.type === 'habit');
    const doneCount = habitTasks.filter(t => record && record.tasks[t.id] === 'done').length;
    const total = habitTasks.length;
    const isToday = dateKey === todayStr();
    let bg = '#FAFAFA';
    if (total > 0 && doneCount === total) bg = '#F6FFED';
    else if (doneCount > 0) bg = '#FFF2E8';
    if (isToday) bg = 'var(--primary)';
    html += '<div style="padding:10px 4px;border-radius:6px;background:' + bg + ';color:' + (isToday ? '#fff' : '#333') + ';font-size:12px;font-weight:bold;">' + day + '<br><span style="font-size:10px;font-weight:normal;">' + doneCount + '/' + total + '</span></div>';
  }
  html += '</div>';
  container.innerHTML = html;
}

// ===== 猫小九历险记模块 =====
function renderAdventure() {
  const info = getLevelInfo();
  document.getElementById('advCharImg').textContent = info.levelIcon;
  document.getElementById('advLevel').textContent = info.levelName + ' ⭐' + info.star;
  document.getElementById('advExpText').textContent = info.expCurrent + ' / ' + info.expNeeded;
  document.getElementById('advExpBar').style.width = info.progress + '%';
  document.getElementById('advTotalExp').textContent = AppData.status.totalCultivation;
  document.getElementById('advStreak').textContent = AppData.status.continuousDays;
  document.getElementById('advBadges').textContent = AppData.config.badges.filter(b => b.earned).length;
  
  // 境界体系
  let levelHtml = '';
  LEVEL_SYSTEM.forEach((level, idx) => {
    const isCurrent = idx === AppData.status.levelIndex;
    const isLocked = idx > AppData.status.levelIndex;
    const stars = isCurrent ? AppData.status.starIndex : (isLocked ? 0 : 9);
    let starHtml = '';
    for (let i = 0; i < 9; i++) {
      starHtml += '<span class="star ' + (i < stars ? 'filled' : '') + '">⭐</span>';
    }
    const expBefore = getExpBeforeLevel(idx, 0);
    const expTotal = level.expPerStar * 9;
    // 境界图标：使用猫小九形象
    const levelImgPath = 'assets/characters/variants/' + (level.charImg || '09_Q版可爱_头像.png');
    const levelIconHtml = '<img src="' + levelImgPath + '" style="width:32px;height:32px;border-radius:50%;object-fit:cover;vertical-align:middle;margin-right:6px;" onerror="this.outerHTML=\'' + level.icon + '\'">';
    levelHtml += '<div class="level-item ' + (isCurrent ? 'current' : '') + (isLocked ? ' locked' : '') + '">';
    levelHtml += '<div class="level-name">' + levelIconHtml + ' ' + level.name + (isCurrent ? ' <span style="color:var(--gold);font-size:12px;">（当前）</span>' : '') + (isLocked ? ' 🔒' : '') + '</div>';
    levelHtml += '<div class="level-stars">' + starHtml + '</div>';
    levelHtml += '<div class="level-exp">每星需' + level.expPerStar + '修为 · 本阶共' + expTotal + '修为</div>';
    levelHtml += '</div>';
  });
  document.getElementById('levelSystem').innerHTML = levelHtml;
  
  // 徽章
  let badgeHtml = '';
  AppData.config.badges.forEach(badge => {
    badgeHtml += '<div class="badge-item ' + (badge.earned ? 'earned' : 'locked') + '" title="' + badge.desc + '">';
    badgeHtml += '<div class="badge-icon">' + badge.icon + '</div>';
    badgeHtml += '<div class="badge-name">' + badge.name + '</div>';
    badgeHtml += '<div class="badge-desc">' + badge.desc + '</div>';
    if (badge.earned) badgeHtml += '<div style="font-size:10px;color:var(--gold-dark);margin-top:4px;">' + badge.earnedDate + '</div>';
    badgeHtml += '</div>';
  });
  document.getElementById('badgeGrid').innerHTML = badgeHtml;
  
  // 升级记录
  let recordHtml = '';
  if (AppData.levelUpRecords.length === 0) {
    recordHtml = '<div style="text-align:center;color:#ccc;padding:20px;">还没有升级记录，继续加油！</div>';
  } else {
    AppData.levelUpRecords.slice(0, 20).forEach(r => {
      recordHtml += '<div style="padding:10px;border-bottom:1px solid #f5f5f5;display:flex;justify-content:space-between;align-items:center;">';
      recordHtml += '<div><strong>' + r.from + ' → ' + r.to + '</strong><br><span style="font-size:12px;color:#999;">' + r.reason + '</span></div>';
      recordHtml += '<span style="font-size:12px;color:#999;">' + r.date + ' ' + r.time + '</span>';
      recordHtml += '</div>';
    });
  }
  document.getElementById('levelUpRecords').innerHTML = recordHtml;
  
  // 角色图鉴（只显示已解锁的）
  renderCharacterGallery();
}

// 角色图鉴渲染
function renderCharacterGallery() {
  const gallery = document.getElementById('characterGallery');
  if (!gallery) return;
  
  const unlocked = AppData.unlockedCharacters || [];
  const unlockedChars = CHARACTER_IMAGES.filter(c => unlocked.includes(c.id));
  
  if (unlockedChars.length === 0) {
    gallery.innerHTML = '<div style="text-align:center;color:#ccc;padding:30px;">还没有解锁任何角色形象，去奖励中心兑换吧！</div>';
    return;
  }
  
  // 按分类分组
  const categories = {};
  unlockedChars.forEach(c => {
    if (!categories[c.category]) categories[c.category] = [];
    categories[c.category].push(c);
  });
  
  let html = '';
  const catOrder = ['猫小九', '友方', '反派'];
  catOrder.forEach(cat => {
    if (!categories[cat]) return;
    html += '<div style="margin-bottom:20px;">';
    html += '<div style="font-size:15px;font-weight:bold;color:var(--primary);margin-bottom:10px;">' + cat + '（' + categories[cat].length + '个）</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:12px;">';
    categories[cat].forEach(c => {
      const imgPath = c.category === '猫小九' ? 'assets/characters/variants/' + c.file : 'assets/other_characters/' + c.file;
      html += '<div style="text-align:center;cursor:pointer;" onclick="setHeroAvatar(\'' + c.id + '\')" title="点击设为首页头像">';
      html += '<div style="width:80px;height:80px;border-radius:50%;overflow:hidden;margin:0 auto 6px;border:3px solid var(--gold);box-shadow:0 2px 8px rgba(0,0,0,0.1);">';
      html += '<img src="' + imgPath + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentNode.innerHTML=\'🐱\'">';
      html += '</div>';
      html += '<div style="font-size:12px;color:var(--text-light);">' + c.name + '</div>';
      html += '</div>';
    });
    html += '</div></div>';
  });
  
  gallery.innerHTML = html;
}

// 设置首页头像
function setHeroAvatar(charId) {
  if (!AppData.unlockedCharacters.includes(charId)) {
    showToast('该形象尚未解锁', 'error');
    return;
  }
  AppData.personalization.heroAvatar = charId;
  saveData();
  renderHeroPanel();
  showToast('头像已更换为' + (CHARACTER_IMAGES.find(c => c.id === charId)?.name || ''), 'success');
}

// ===== 奖励中心 =====
function renderReward() {
  document.getElementById('rewardStars').textContent = AppData.status.stars;
  document.getElementById('rewardEnt').textContent = AppData.status.entertainmentMinutes;
  
  let html = '';
  AppData.config.rewards.forEach(reward => {
    const used = getRewardUsedCount(reward);
    const limitReached = used >= reward.limitCount;
    const canAfford = AppData.status.stars >= reward.cost;
    html += '<div class="reward-item ' + (limitReached ? 'limit-reached' : '') + '">';
    html += '<div class="reward-icon">' + reward.icon + '</div>';
    html += '<div class="reward-name">' + reward.name + '</div>';
    html += '<div class="reward-cost">⭐ ' + reward.cost + '</div>';
    const periodLabels = { week:'每周', month:'每月', year:'每年' };
    html += '<div class="reward-limit">' + periodLabels[reward.limitPeriod] + '限' + reward.limitCount + '次（已用' + used + '次）</div>';
    if (limitReached) {
      html += '<button class="btn reward-btn" disabled>已达上限</button>';
    } else if (!canAfford) {
      html += '<button class="btn reward-btn" disabled>星星不足</button>';
    } else {
      html += '<button class="btn btn-warning reward-btn" onclick="redeemReward(\'' + reward.id + '\')">立即兑换</button>';
    }
    html += '</div>';
  });
  document.getElementById('rewardGrid').innerHTML = html;
  
  // 形象兑换
  renderCharacterShop();
  
  // 背景兑换
  renderBackgroundShop();
  
  // 兑换记录
  let recordHtml = '';
  if (AppData.redemptionRecords.length === 0) {
    recordHtml = '<div style="text-align:center;color:#ccc;padding:20px;">还没有兑换记录</div>';
  } else {
    AppData.redemptionRecords.slice(0, 20).forEach(r => {
      recordHtml += '<div style="padding:10px;border-bottom:1px solid #f5f5f5;display:flex;justify-content:space-between;align-items:center;">';
      recordHtml += '<div>' + r.icon + ' <strong>' + r.name + '</strong>（-' + r.cost + '⭐）</div>';
      recordHtml += '<div style="text-align:right;"><span style="font-size:12px;color:' + (r.status === 'confirmed' ? 'var(--green)' : 'var(--gold-dark)') + ';">' + (r.status === 'confirmed' ? '已确认' : '待确认') + '</span><br><span style="font-size:11px;color:#999;">' + r.date + '</span></div>';
      recordHtml += '</div>';
    });
  }
  document.getElementById('rewardRecords').innerHTML = recordHtml;
}

// 形象兑换商店
function renderCharacterShop() {
  const container = document.getElementById('characterShop');
  if (!container) return;
  
  const unlocked = AppData.unlockedCharacters || [];
  let html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;">';
  
  CHARACTER_IMAGES.forEach(c => {
    const isUnlocked = unlocked.includes(c.id);
    const canAfford = AppData.status.stars >= c.cost;
    const imgPath = c.category === '猫小九' ? 'assets/characters/variants/' + c.file : 'assets/other_characters/' + c.file;
    
    html += '<div class="reward-item" style="padding:12px;text-align:center;">';
    html += '<div style="width:70px;height:70px;border-radius:50%;overflow:hidden;margin:0 auto 8px;border:2px solid ' + (isUnlocked ? 'var(--green)' : 'var(--border)') + ';">';
    html += '<img src="' + imgPath + '" style="width:100%;height:100%;object-fit:cover;' + (isUnlocked ? '' : 'filter:grayscale(80%);opacity:0.6;') + '" onerror="this.parentNode.innerHTML=\'🐱\'">';
    html += '</div>';
    html += '<div style="font-size:13px;font-weight:bold;margin-bottom:4px;">' + c.name + '</div>';
    html += '<div style="font-size:11px;color:var(--text-lighter);margin-bottom:6px;">' + c.category + '</div>';
    if (isUnlocked) {
      html += '<button class="btn btn-success btn-sm" style="width:100%;" disabled>✓ 已解锁</button>';
    } else if (!canAfford) {
      html += '<button class="btn btn-sm" style="width:100%;background:#f5f5f5;color:#999;" disabled>⭐ ' + c.cost + '（不足）</button>';
    } else {
      html += '<button class="btn btn-warning btn-sm" style="width:100%;" onclick="redeemCharacter(\'' + c.id + '\')">⭐ ' + c.cost + ' 兑换</button>';
    }
    html += '</div>';
  });
  
  html += '</div>';
  container.innerHTML = html;
}

// 兑换角色形象
function redeemCharacter(charId) {
  const char = CHARACTER_IMAGES.find(c => c.id === charId);
  if (!char) return;
  if (AppData.unlockedCharacters.includes(charId)) {
    showToast('该形象已解锁', 'info');
    return;
  }
  if (AppData.status.stars < char.cost) {
    showToast('星星不足', 'error');
    return;
  }
  
  showModal('确认兑换', '确定花费 ' + char.cost + ' ⭐ 兑换【' + char.name + '】形象吗？兑换后永久解锁，可在角色图鉴中设为头像。', () => {
    AppData.status.stars -= char.cost;
    if (!AppData.unlockedCharacters) AppData.unlockedCharacters = [];
    AppData.unlockedCharacters.push(charId);
    AppData.redemptionRecords.unshift({
      id: 'rc_' + Date.now(),
      rewardId: charId,
      name: char.name,
      icon: '🎨',
      cost: char.cost,
      date: todayStr() + ' ' + new Date().toTimeString().slice(0,5),
      status: 'confirmed',
      type: 'character'
    });
    saveData();
    renderReward();
    showToast('成功解锁【' + char.name + '】！', 'success');
  });
}

// 背景兑换商店
function renderBackgroundShop() {
  const container = document.getElementById('backgroundShop');
  if (!container) return;
  
  const unlocked = AppData.unlockedBackgrounds || [];
  let html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">';
  
  BACKGROUND_IMAGES.forEach(bg => {
    const isUnlocked = unlocked.includes(bg.id);
    const canAfford = AppData.status.stars >= bg.cost;
    const isCurrent = AppData.personalization.homeBackground === bg.id;
    const imgPath = 'assets/backgrounds/' + bg.file;
    
    html += '<div class="reward-item" style="padding:12px;">';
    html += '<div style="width:100%;height:100px;border-radius:8px;overflow:hidden;margin-bottom:8px;border:2px solid ' + (isCurrent ? 'var(--gold)' : isUnlocked ? 'var(--green)' : 'var(--border)') + ';">';
    html += '<img src="' + imgPath + '" style="width:100%;height:100%;object-fit:cover;' + (isUnlocked ? '' : 'filter:grayscale(80%);opacity:0.6;') + '" onerror="this.parentNode.style.background=\'#f5f5f5\'">';
    html += '</div>';
    html += '<div style="font-size:14px;font-weight:bold;margin-bottom:4px;">' + bg.name + '</div>';
    if (isCurrent) {
      html += '<button class="btn btn-success btn-sm" style="width:100%;" disabled>✓ 使用中</button>';
    } else if (isUnlocked) {
      html += '<button class="btn btn-primary btn-sm" style="width:100%;" onclick="setHomeBackground(\'' + bg.id + '\')">设为背景</button>';
    } else if (!canAfford) {
      html += '<button class="btn btn-sm" style="width:100%;background:#f5f5f5;color:#999;" disabled>⭐ ' + bg.cost + '（不足）</button>';
    } else {
      html += '<button class="btn btn-warning btn-sm" style="width:100%;" onclick="redeemBackground(\'' + bg.id + '\')">⭐ ' + bg.cost + ' 兑换</button>';
    }
    html += '</div>';
  });
  
  // 默认背景选项
  html += '<div class="reward-item" style="padding:12px;">';
  html += '<div style="width:100%;height:100px;border-radius:8px;overflow:hidden;margin-bottom:8px;border:2px solid ' + (AppData.personalization.homeBackground === null ? 'var(--gold)' : 'var(--border)') + ';background:linear-gradient(135deg,#FFF3E8,#FFE8CC);display:flex;align-items:center;justify-content:center;font-size:32px;">🏠</div>';
  html += '<div style="font-size:14px;font-weight:bold;margin-bottom:4px;">默认背景</div>';
  if (AppData.personalization.homeBackground === null) {
    html += '<button class="btn btn-success btn-sm" style="width:100%;" disabled>✓ 使用中</button>';
  } else {
    html += '<button class="btn btn-secondary btn-sm" style="width:100%;" onclick="setHomeBackground(null)">恢复默认</button>';
  }
  html += '</div>';
  
  html += '</div>';
  container.innerHTML = html;
}

// 兑换背景
function redeemBackground(bgId) {
  const bg = BACKGROUND_IMAGES.find(b => b.id === bgId);
  if (!bg) return;
  if (AppData.unlockedBackgrounds.includes(bgId)) {
    showToast('该背景已解锁', 'info');
    return;
  }
  if (AppData.status.stars < bg.cost) {
    showToast('星星不足', 'error');
    return;
  }
  
  showModal('确认兑换', '确定花费 ' + bg.cost + ' ⭐ 兑换【' + bg.name + '】背景吗？兑换后永久解锁，可在个性化设置中使用。', () => {
    AppData.status.stars -= bg.cost;
    if (!AppData.unlockedBackgrounds) AppData.unlockedBackgrounds = [];
    AppData.unlockedBackgrounds.push(bgId);
    AppData.redemptionRecords.unshift({
      id: 'rb_' + Date.now(),
      rewardId: bgId,
      name: bg.name,
      icon: '🖼️',
      cost: bg.cost,
      date: todayStr() + ' ' + new Date().toTimeString().slice(0,5),
      status: 'confirmed',
      type: 'background'
    });
    saveData();
    renderReward();
    showToast('成功解锁【' + bg.name + '】背景！', 'success');
  });
}

// 设置首页背景
function setHomeBackground(bgId) {
  AppData.personalization.homeBackground = bgId;
  saveData();
  applyHomeBackground();
  renderReward();
  showToast('首页背景已更换', 'success');
}

// 应用首页背景
function applyHomeBackground() {
  const bgId = AppData.personalization.homeBackground;
  const contentEl = document.querySelector('.content');
  if (!contentEl) return;
  
  if (bgId) {
    const bg = BACKGROUND_IMAGES.find(b => b.id === bgId);
    if (bg) {
      contentEl.style.backgroundImage = 'url(assets/backgrounds/' + bg.file + ')';
      contentEl.style.backgroundSize = 'cover';
      contentEl.style.backgroundPosition = 'center';
      contentEl.style.backgroundAttachment = 'fixed';
      return;
    }
  }
  // 默认背景
  contentEl.style.backgroundImage = '';
  contentEl.style.background = '';
}

// 更新学科页面图标和背景
function updateSubjectIcons() {
  try {
  const iconMap = {
    chinese: 'subjectIconChinese',
    english: 'subjectIconEnglish',
    math: 'subjectIconMath',
    sport: 'subjectIconSport',
    habit: 'subjectIconHabit'
  };
  
  const pageMap = {
    chinese: 'page-chinese',
    english: 'page-english',
    math: 'page-math',
    sport: 'page-sport',
    habit: 'page-habit'
  };
  
  const defaultIcons = { chinese: '📚', english: '🔤', math: '🔢', sport: '⚽', habit: '🛏️' };
  
  Object.keys(iconMap).forEach(subject => {
    const el = document.getElementById(iconMap[subject]);
    const pageEl = document.getElementById(pageMap[subject]);
    
    const iconFile = AppData.personalization.subjectIcons[subject];
    if (iconFile) {
      const imgPath = 'assets/other_characters/' + iconFile;
      // 更新图标
      if (el) {
        el.innerHTML = '<img src="' + imgPath + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.parentNode.innerHTML=\'' + defaultIcons[subject] + '\'">';
        el.style.background = 'transparent';
      }
      // 更新页面背景（15%透明度，cover覆盖整个页面）
      if (pageEl) {
        pageEl.style.backgroundImage = 'url(' + imgPath + ')';
        pageEl.style.backgroundSize = 'cover';
        pageEl.style.backgroundPosition = 'center center';
        pageEl.style.backgroundRepeat = 'no-repeat';
        pageEl.style.position = 'relative';
        // 添加半透明遮罩确保文字清晰（较淡，让背景透出来）
        if (!pageEl.querySelector('.subject-bg-overlay')) {
          const overlay = document.createElement('div');
          overlay.className = 'subject-bg-overlay';
          overlay.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(255,248,240,0.75);pointer-events:none;z-index:0;';
          pageEl.insertBefore(overlay, pageEl.firstChild);
        }
        // 确保内容在遮罩之上
        pageEl.querySelectorAll(':scope > *:not(.subject-bg-overlay)').forEach(child => {
          child.style.position = 'relative';
          child.style.zIndex = '1';
        });
      }
    } else {
      // 恢复默认
      if (el) el.innerHTML = defaultIcons[subject];
      if (pageEl) {
        pageEl.style.backgroundImage = '';
        const overlay = pageEl.querySelector('.subject-bg-overlay');
        if (overlay) overlay.remove();
      }
    }
  });
  } catch(e) {
    console.error('updateSubjectIcons错误', e);
  }
}

// 设置学科图标
function setSubjectIcon(subject, charId) {
  if (!AppData.unlockedCharacters.includes(charId)) {
    showToast('该形象尚未解锁', 'error');
    return;
  }
  const char = CHARACTER_IMAGES.find(c => c.id === charId);
  if (!char) return;
  
  AppData.personalization.subjectIcons[subject] = char.file;
  saveData();
  updateSubjectIcons();
  showToast('图标已更换', 'success');
}

// 重置学科图标
function resetSubjectIcon(subject) {
  AppData.personalization.subjectIcons[subject] = DEFAULT_ICONS.subject[subject];
  saveData();
  updateSubjectIcons();
  showToast('已恢复默认图标', 'success');
}

function getRewardUsedCount(reward) {
  const now = new Date();
  return AppData.redemptionRecords.filter(r => {
    if (r.rewardId !== reward.id || r.status !== 'confirmed') return false;
    const d = new Date(r.date);
    if (reward.limitPeriod === 'week') {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      return d >= weekStart;
    }
    if (reward.limitPeriod === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (reward.limitPeriod === 'year') return d.getFullYear() === now.getFullYear();
    return false;
  }).length;
}

function redeemReward(rewardId) {
  const reward = AppData.config.rewards.find(r => r.id === rewardId);
  if (!reward) return;
  if (AppData.status.stars < reward.cost) { showToast('星星不足', 'error'); return; }
  
  showModal('确认兑换', 
    '<p>确定要兑换 <strong>' + reward.icon + ' ' + reward.name + '</strong> 吗？</p>' +
    '<p>将消耗 <strong style="color:var(--gold-dark);">⭐ ' + reward.cost + '</strong> 颗星星</p>' +
    '<p style="font-size:13px;color:var(--text-light);">兑换后需家长确认生效</p>',
    () => {
      AppData.status.stars -= reward.cost;
      AppData.redemptionRecords.unshift({
        id: uid(),
        rewardId: reward.id,
        name: reward.name,
        icon: reward.icon,
        cost: reward.cost,
        date: todayStr(),
        time: new Date().toLocaleTimeString(),
        status: 'pending'
      });
      AppData.status.redeemCount++;
      checkBadges();
      saveData();
      showToast('兑换申请已提交，等待家长确认', 'info');
      renderAll();
    }
  );
}

// ===== 家长模式 =====
function openParentLock() {
  switchPage('parent');
  if (parentAuthed) {
    document.getElementById('parentLock').style.display = 'none';
    document.getElementById('parentContent').style.display = 'block';
  } else {
    document.getElementById('parentLock').style.display = 'block';
    document.getElementById('parentContent').style.display = 'none';
    document.getElementById('parentPasswordInput').value = '';
    document.getElementById('parentPasswordInput').focus();
  }
}

function verifyParentPassword() {
  const input = document.getElementById('parentPasswordInput').value;
  if (input === AppData.config.parentPassword) {
    parentAuthed = true;
    document.getElementById('parentLock').style.display = 'none';
    document.getElementById('parentContent').style.display = 'block';
    showToast('家长模式已解锁', 'success');
    renderParent();
  } else {
    document.getElementById('parentLockError').textContent = '密码错误，请重试';
    document.getElementById('parentPasswordInput').value = '';
    setTimeout(() => { document.getElementById('parentLockError').textContent = ''; }, 3000);
  }
}

function showParentTab(tab) {
  document.querySelectorAll('.parent-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.parent-tab-content').forEach(c => c.style.display = 'none');
  const el = document.getElementById('parentTab' + tab.charAt(0).toUpperCase() + tab.slice(1));
  if (el) el.style.display = 'block';
  if (tab === 'review') renderPendingReview();
  if (tab === 'tasks') renderTaskConfig();
  if (tab === 'rewards') renderRewardConfig();
  if (tab === 'stats') renderParentStats();
  if (tab === 'badges') renderBadgeConfig();
  if (tab === 'settings') renderSettings();
}

function renderParent() {
  if (!parentAuthed) return;
  showParentTab('review');
}

// 待审核
function renderPendingReview() {
  const container = document.getElementById('pendingReviewList');
  // 任务审核
  let html = '<h3 style="margin-bottom:12px;font-size:16px;">📝 待确认任务（' + AppData.pendingReview.length + '）</h3>';
  if (AppData.pendingReview.length === 0) {
    html += '<div style="text-align:center;color:#ccc;padding:20px;">暂无待确认任务</div>';
  } else {
    AppData.pendingReview.forEach(r => {
      html += '<div class="pending-review-item">';
      html += '<div class="review-info"><div class="review-name">' + r.taskName + '</div>';
      html += '<div class="review-meta">' + r.date + ' ' + r.time + ' · +' + r.cultivation + '修为</div></div>';
      html += '<div class="review-actions">';
      html += '<button class="btn btn-success btn-sm" onclick="confirmTask(\'' + r.id + '\')">✓ 确认</button>';
      html += '<button class="btn btn-danger btn-sm" onclick="rejectTask(\'' + r.id + '\')">✗ 驳回</button>';
      html += '</div></div>';
    });
    html += '<div style="margin-top:16px;"><button class="btn btn-primary" onclick="confirmAllPending()">✓ 全部确认</button></div>';
  }
  
  // 兑换审核
  const pendingRedeem = AppData.redemptionRecords.filter(r => r.status === 'pending');
  html += '<h3 style="margin:24px 0 12px;font-size:16px;">🎁 待确认兑换（' + pendingRedeem.length + '）</h3>';
  if (pendingRedeem.length === 0) {
    html += '<div style="text-align:center;color:#ccc;padding:20px;">暂无待确认兑换</div>';
  } else {
    pendingRedeem.forEach(r => {
      html += '<div class="pending-review-item">';
      html += '<div class="review-info"><div class="review-name">' + r.icon + ' ' + r.name + '</div>';
      html += '<div class="review-meta">' + r.date + ' ' + r.time + ' · -' + r.cost + '⭐</div></div>';
      html += '<div class="review-actions">';
      html += '<button class="btn btn-success btn-sm" onclick="confirmRedeem(\'' + r.id + '\')">✓ 确认</button>';
      html += '<button class="btn btn-danger btn-sm" onclick="rejectRedeem(\'' + r.id + '\')">✗ 驳回（退星）</button>';
      html += '</div></div>';
    });
  }
  container.innerHTML = html;
}

function confirmAllPending() {
  const count = AppData.pendingReview.length;
  AppData.pendingReview.forEach(r => {
    setTaskStatus(r.taskId, 'done');
    if (r.cultivation > 0) {
      addCultivation(r.cultivation, '完成任务：' + r.taskName);
      getTodayRecord().cultivationEarned += r.cultivation;
    }
  });
  AppData.pendingReview = [];
  checkAllComplete();
  checkBadges();
  saveData();
  showToast('已全部确认 ' + count + ' 项任务', 'success');
  renderAll();
}

function confirmRedeem(id) {
  const r = AppData.redemptionRecords.find(x => x.id === id);
  if (!r) return;
  r.status = 'confirmed';
  saveData();
  showToast('已确认兑换：' + r.name, 'success');
  renderAll();
}

function rejectRedeem(id) {
  const idx = AppData.redemptionRecords.findIndex(x => x.id === id);
  if (idx === -1) return;
  const r = AppData.redemptionRecords[idx];
  AppData.status.stars += r.cost;
  AppData.redemptionRecords.splice(idx, 1);
  saveData();
  showToast('已驳回，退还' + r.cost + '颗星', 'warning');
  renderAll();
}

// 任务配置
function renderTaskConfig() {
  const day = document.getElementById('taskConfigDay').value;
  const tasks = AppData.config.weeklyTasks[day] || [];
  let html = '';
  tasks.forEach((t, idx) => {
    html += '<div class="task-config-item">';
    html += '<input type="text" value="' + t.name + '" onchange="updateTaskConfig(' + day + ',' + idx + ',\'name\',this.value)">';
    html += '<select onchange="updateTaskConfig(' + day + ',' + idx + ',\'type\',this.value)">';
    ['chinese','english','math','sport','habit','study','other'].forEach(type => {
      html += '<option value="' + type + '" ' + (t.type === type ? 'selected' : '') + '>' + ({chinese:'语文',english:'英语',math:'数学',sport:'运动',habit:'生活习惯',study:'学习',other:'其他'})[type] + '</option>';
    });
    html += '</select>';
    html += '<input type="number" value="' + t.cultivation + '" min="0" onchange="updateTaskConfig(' + day + ',' + idx + ',\'cultivation\',parseInt(this.value)||0)">';
    html += '<label style="font-size:13px;display:flex;align-items:center;gap:4px;"><input type="checkbox" ' + (t.required ? 'checked' : '') + ' onchange="updateTaskConfig(' + day + ',' + idx + ',\'required\',this.checked)">必做</label>';
    html += '<label style="font-size:13px;display:flex;align-items:center;gap:4px;"><input type="checkbox" ' + (t.marker ? 'checked' : '') + ' onchange="updateTaskConfig(' + day + ',' + idx + ',\'marker\',this.checked)">标记</label>';
    html += '<button class="delete-btn" onclick="deleteTaskConfig(' + day + ',' + idx + ')">🗑️</button>';
    html += '</div>';
  });
  document.getElementById('taskConfigList').innerHTML = html;
  
  // 专项任务配置
  let specialHtml = '';
  AppData.config.specialTasks.forEach((t, idx) => {
    specialHtml += '<div class="task-config-item">';
    specialHtml += '<span style="font-size:20px;">' + t.icon + '</span>';
    specialHtml += '<input type="text" value="' + t.name + '" style="flex:1;" onchange="updateSpecialConfig(' + idx + ',\'name\',this.value)">';
    if (t.type === 'progress') {
      specialHtml += '<span style="font-size:13px;color:#666;">每周目标</span>';
      specialHtml += '<input type="number" value="' + t.weeklyTarget + '" min="1" style="width:60px;" onchange="updateSpecialConfig(' + idx + ',\'weeklyTarget\',parseInt(this.value)||1)">';
    }
    specialHtml += '</div>';
  });
  document.getElementById('specialConfigList').innerHTML = specialHtml;
}

function updateTaskConfig(day, idx, field, value) {
  if (!AppData.config.weeklyTasks[day] || !AppData.config.weeklyTasks[day][idx]) return;
  AppData.config.weeklyTasks[day][idx][field] = value;
  saveData();
}

function addTaskConfigItem() {
  const day = document.getElementById('taskConfigDay').value;
  if (!AppData.config.weeklyTasks[day]) AppData.config.weeklyTasks[day] = [];
  AppData.config.weeklyTasks[day].push({
    id: uid(), name: '新任务', type: 'study', category: 'study', cultivation: 10, required: true
  });
  saveData();
  renderTaskConfig();
  showToast('已添加新任务', 'success');
}

function deleteTaskConfig(day, idx) {
  if (!AppData.config.weeklyTasks[day] || !AppData.config.weeklyTasks[day][idx]) return;
  const task = AppData.config.weeklyTasks[day][idx];
  showModal('确认删除', '<p>确定要删除任务「' + task.name + '」吗？</p>', () => {
    AppData.config.weeklyTasks[day].splice(idx, 1);
    saveData();
    renderTaskConfig();
    showToast('已删除', 'success');
  });
}

function updateSpecialConfig(idx, field, value) {
  if (!AppData.config.specialTasks[idx]) return;
  AppData.config.specialTasks[idx][field] = value;
  saveData();
}

// 奖励配置
function renderRewardConfig() {
  let html = '';
  AppData.config.rewards.forEach((r, idx) => {
    html += '<div class="task-config-item">';
    html += '<input type="text" value="' + r.icon + '" style="width:50px;text-align:center;font-size:20px;" onchange="updateRewardConfig(' + idx + ',\'icon\',this.value)">';
    html += '<input type="text" value="' + r.name + '" style="flex:1;" onchange="updateRewardConfig(' + idx + ',\'name\',this.value)">';
    html += '<span style="font-size:13px;">⭐</span>';
    html += '<input type="number" value="' + r.cost + '" min="1" style="width:70px;" onchange="updateRewardConfig(' + idx + ',\'cost\',parseInt(this.value)||1)">';
    html += '<select onchange="updateRewardConfig(' + idx + ',\'limitPeriod\',this.value)">';
    ['week','month','year'].forEach(p => {
      html += '<option value="' + p + '" ' + (r.limitPeriod === p ? 'selected' : '') + '>' + ({week:'每周',month:'每月',year:'每年'})[p] + '</option>';
    });
    html += '</select>';
    html += '<input type="number" value="' + r.limitCount + '" min="1" style="width:60px;" onchange="updateRewardConfig(' + idx + ',\'limitCount\',parseInt(this.value)||1)">';
    html += '<button class="delete-btn" onclick="deleteRewardConfig(' + idx + ')">🗑️</button>';
    html += '</div>';
  });
  document.getElementById('rewardConfigList').innerHTML = html;
}

function updateRewardConfig(idx, field, value) {
  if (!AppData.config.rewards[idx]) return;
  AppData.config.rewards[idx][field] = value;
  saveData();
}

function addRewardItem() {
  AppData.config.rewards.push({ id: uid(), name: '新奖励', cost: 20, icon: '🎁', limitPeriod: 'week', limitCount: 1 });
  saveData();
  renderRewardConfig();
}

function deleteRewardConfig(idx) {
  AppData.config.rewards.splice(idx, 1);
  saveData();
  renderRewardConfig();
}

function manualAdjust() {
  const stars = parseInt(document.getElementById('adjustStars').value) || 0;
  const cultivation = parseInt(document.getElementById('adjustCultivation').value) || 0;
  const reason = document.getElementById('adjustReason').value || '手动调整';
  if (stars === 0 && cultivation === 0) { showToast('请输入调整数值', 'warning'); return; }
  if (stars !== 0) {
    AppData.status.stars = Math.max(0, AppData.status.stars + stars);
  }
  if (cultivation !== 0) {
    addCultivation(cultivation, reason);
  }
  document.getElementById('adjustStars').value = '';
  document.getElementById('adjustCultivation').value = '';
  document.getElementById('adjustReason').value = '';
  saveData();
  showToast('调整完成：星星' + (stars>=0?'+':'') + stars + '，修为' + (cultivation>=0?'+':'') + cultivation, 'success');
  renderAll();
}

// 数据统计
function renderParentStats() {
  // 统计卡片
  const last30Days = [];
  let completeDays = 0, totalCultivation = 0, totalStars = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(Date.now() - i * 86400000);
    const key = dateStr(d);
    const record = AppData.dailyRecords[key];
    if (record) {
      last30Days.push({ date: key, cultivation: record.cultivationEarned || 0, complete: record.allComplete });
      if (record.allComplete) completeDays++;
      totalCultivation += record.cultivationEarned || 0;
      totalStars += record.starsEarned || 0;
    } else {
      last30Days.push({ date: key, cultivation: 0, complete: false });
    }
  }
  
  const statsHtml = 
    '<div class="stat-card"><div class="stat-icon">📅</div><div class="stat-value">' + completeDays + '/30</div><div class="stat-label">近30天圆满天数</div></div>' +
    '<div class="stat-card"><div class="stat-icon">⚡</div><div class="stat-value">' + totalCultivation + '</div><div class="stat-label">近30天获得修为</div></div>' +
    '<div class="stat-card"><div class="stat-icon">⭐</div><div class="stat-value">' + totalStars + '</div><div class="stat-label">近30天获得星星</div></div>' +
    '<div class="stat-card"><div class="stat-icon">🔥</div><div class="stat-value">' + AppData.status.continuousDays + '</div><div class="stat-label">当前连续打卡</div></div>' +
    '<div class="stat-card"><div class="stat-icon">✅</div><div class="stat-value">' + AppData.status.allCompleteCount + '</div><div class="stat-label">累计圆满天数</div></div>' +
    '<div class="stat-card"><div class="stat-icon">🏆</div><div class="stat-value">' + AppData.config.badges.filter(b=>b.earned).length + '/' + AppData.config.badges.length + '</div><div class="stat-label">获得徽章</div></div>';
  document.getElementById('parentStatsGrid').innerHTML = statsHtml;
  
  // 趋势图
  drawStatsChart(last30Days);
  
  // 各学科完成率
  drawSubjectStats();
}

function drawStatsChart(data) {
  const canvas = document.getElementById('statsChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.parentElement.clientWidth;
  const H = 250;
  canvas.width = W; canvas.height = H;
  ctx.clearRect(0, 0, W, H);
  
  const padding = { top: 30, right: 20, bottom: 40, left: 50 };
  const chartW = W - padding.left - padding.right;
  const chartH = H - padding.top - padding.bottom;
  const reversed = data.slice().reverse();
  const maxVal = Math.max(100, ...reversed.map(d => d.cultivation));
  
  // 网格
  ctx.strokeStyle = '#f0f0f0'; ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (chartH / 5) * i;
    ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(W - padding.right, y); ctx.stroke();
    ctx.fillStyle = '#999'; ctx.font = '11px sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxVal - (maxVal / 5) * i), padding.left - 8, y + 4);
  }
  
  // 柱状图
  const barW = chartW / reversed.length * 0.7;
  const gap = chartW / reversed.length * 0.3;
  reversed.forEach((d, i) => {
    const x = padding.left + (chartW / reversed.length) * i + gap / 2;
    const h = (d.cultivation / maxVal) * chartH;
    const y = padding.top + chartH - h;
    ctx.fillStyle = d.complete ? '#52C41A' : '#FF8C42';
    ctx.fillRect(x, y, barW, h);
    
    if (i % 5 === 0) {
      ctx.fillStyle = '#999'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(d.date.slice(5), x + barW / 2, H - padding.bottom + 16);
    }
  });
  
  ctx.fillStyle = '#333'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('近30天每日修为获得', padding.left, 18);
  ctx.fillStyle = '#52C41A'; ctx.fillRect(W - 120, 8, 10, 10);
  ctx.fillStyle = '#666'; ctx.font = '11px sans-serif'; ctx.fillText('圆满', W - 105, 17);
  ctx.fillStyle = '#FF8C42'; ctx.fillRect(W - 70, 8, 10, 10);
  ctx.fillStyle = '#666'; ctx.fillText('未圆满', W - 55, 17);
}

function drawSubjectStats() {
  const subjects = [
    { key: 'chinese', name: '语文', icon: '📚', color: '#1890FF' },
    { key: 'english', name: '英语', icon: '🔤', color: '#52C41A' },
    { key: 'math', name: '数学', icon: '🔢', color: '#FA8C16' },
    { key: 'sport', name: '运动', icon: '⚽', color: '#722ED1' },
    { key: 'habit', name: '生活习惯', icon: '🛏️', color: '#EB2F96' }
  ];
  
  let html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;">';
  subjects.forEach(s => {
    let total = 0, done = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(Date.now() - i * 86400000);
      const day = d.getDay();
      const tasks = (AppData.config.weeklyTasks[day] || []).filter(t => t.type === s.key && t.required);
      const record = AppData.dailyRecords[dateStr(d)];
      tasks.forEach(t => {
        total++;
        if (record && record.tasks[t.id] === 'done') done++;
      });
    }
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    html += '<div style="background:#FAFAFA;border-radius:12px;padding:16px;">';
    html += '<div style="font-weight:bold;margin-bottom:8px;">' + s.icon + ' ' + s.name + '</div>';
    html += '<div class="progress-bar" style="margin-bottom:6px;"><div class="progress-fill" style="width:' + pct + '%;background:' + s.color + ';"></div></div>';
    html += '<div style="font-size:13px;color:#666;">完成率 ' + pct + '%（' + done + '/' + total + '）</div>';
    html += '</div>';
  });
  html += '</div>';
  document.getElementById('subjectStats').innerHTML = html;
}

// 徽章配置
function renderBadgeConfig() {
  let html = '';
  AppData.config.badges.forEach((b, idx) => {
    html += '<div class="task-config-item">';
    html += '<input type="text" value="' + b.icon + '" style="width:50px;text-align:center;font-size:20px;" onchange="updateBadgeConfig(' + idx + ',\'icon\',this.value)">';
    html += '<input type="text" value="' + b.name + '" style="flex:1;" onchange="updateBadgeConfig(' + idx + ',\'name\',this.value)">';
    html += '<input type="text" value="' + b.desc + '" style="flex:1;" onchange="updateBadgeConfig(' + idx + ',\'desc\',this.value)">';
    html += '<span style="font-size:13px;color:' + (b.earned ? 'var(--green)' : '#999') + ';">' + (b.earned ? '已获得' : '未获得') + '</span>';
    html += '</div>';
  });
  document.getElementById('badgeConfigList').innerHTML = html;
}

function updateBadgeConfig(idx, field, value) {
  if (!AppData.config.badges[idx]) return;
  AppData.config.badges[idx][field] = value;
  saveData();
}

// 系统设置
function renderSettings() {
  // 提醒设置
  let html = '';
  AppData.config.reminders.forEach((r, idx) => {
    html += '<div class="task-config-item">';
    html += '<label style="display:flex;align-items:center;gap:6px;font-size:14px;"><input type="checkbox" ' + (r.enabled ? 'checked' : '') + ' onchange="updateReminder(' + idx + ',\'enabled\',this.checked)">' + r.title + '</label>';
    html += '<input type="time" value="' + r.time + '" onchange="updateReminder(' + idx + ',\'time\',this.value)">';
    html += '<input type="text" value="' + r.desc + '" style="flex:1;" onchange="updateReminder(' + idx + ',\'desc\',this.value)">';
    html += '</div>';
  });
  document.getElementById('reminderSettings').innerHTML = html;
}

function updateReminder(idx, field, value) {
  if (!AppData.config.reminders[idx]) return;
  AppData.config.reminders[idx][field] = value;
  saveData();
}

function changePassword() {
  const p1 = document.getElementById('newPassword1').value;
  const p2 = document.getElementById('newPassword2').value;
  if (!p1 || p1.length < 4) { showToast('密码至少4位', 'warning'); return; }
  if (p1 !== p2) { showToast('两次密码不一致', 'error'); return; }
  AppData.config.parentPassword = p1;
  saveData();
  document.getElementById('newPassword1').value = '';
  document.getElementById('newPassword2').value = '';
  showToast('密码修改成功', 'success');
}

function refreshCharacterImages() {
  showToast('已刷新角色图片缓存', 'info');
  renderAll();
}

// 数据导出
function exportJSON() {
  const dataStr = JSON.stringify(AppData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Max学习打卡台_备份_' + todayStr() + '.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('备份文件已下载', 'success');
}

function exportExcel() {
  let csv = '\uFEFF日期,任务名称,类型,状态,修为获得,星星获得,是否圆满\n';
  Object.keys(AppData.dailyRecords).sort().reverse().slice(0, 90).forEach(date => {
    const record = AppData.dailyRecords[date];
    const day = new Date(date).getDay();
    const tasks = AppData.config.weeklyTasks[day] || [];
    tasks.forEach(t => {
      const status = record.tasks[t.id] || 'pending';
      const statusText = { pending: '未完成', pendingReview: '待确认', done: '已完成' }[status] || status;
      csv += date + ',' + t.name + ',' + t.type + ',' + statusText + ',' + (status === 'done' ? t.cultivation : 0) + ',' + (record.allComplete ? 2 : 0) + ',' + (record.allComplete ? '是' : '否') + '\n';
    });
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Max打卡记录_' + todayStr() + '.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('打卡记录已导出', 'success');
}

function importJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data && data.config && data.status) {
        showModal('确认导入', '<p>确定要导入备份数据吗？当前所有数据将被覆盖！</p><p style="color:var(--red);">此操作不可撤销</p>', () => {
          AppData = data;
          Storage.save(data);
          saveData();
          showToast('数据导入成功', 'success');
          renderAll();
        });
      } else {
        showToast('文件格式不正确', 'error');
      }
    } catch(err) {
      showToast('文件解析失败：' + err.message, 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function resetAllData() {
  showModal('⚠️ 危险操作', '<p style="color:var(--red);font-weight:bold;">确定要清空所有数据吗？</p><p>这将删除所有打卡记录、修为、星星、配置等，且不可恢复！</p><p>建议先导出备份。</p>', () => {
    localStorage.removeItem(Storage.KEY);
    initData();
    parentAuthed = false;
    showToast('数据已清空，已恢复初始状态', 'success');
    renderAll();
  });
}

// ===== 定时提醒 =====
let reminderTimer = null;
function startReminderCheck() {
  if (reminderTimer) clearInterval(reminderTimer);
  reminderTimer = setInterval(checkReminders, 30000);
  checkReminders();
}

function checkReminders() {
  const now = new Date();
  const currentTime = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  const today = todayStr();
  if (!AppData._reminderShown) AppData._reminderShown = {};
  if (AppData._reminderShown._date !== today) {
    AppData._reminderShown = { _date: today };
  }
  
  AppData.config.reminders.forEach(r => {
    if (!r.enabled) return;
    if (r.time === currentTime && !AppData._reminderShown[r.id]) {
      AppData._reminderShown[r.id] = true;
      showToast(r.title + '：' + r.desc, 'info');
      // 尝试浏览器通知
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(r.title, { body: r.desc, icon: '🐱' });
      }
    }
  });
}

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

// ===== 初始化 =====
function init() {
  console.log('开始初始化...');
  
  // 数据初始化（必须先执行，后续函数依赖AppData）
  try { initData(); console.log('✓ initData完成'); } catch(e) { console.error('✗ initData错误', e); }
  
  // 个性化设置（出错不影响核心功能）
  try { applyHomeBackground(); console.log('✓ applyHomeBackground完成'); } catch(e) { console.error('✗ applyHomeBackground错误', e); }
  try { updateSubjectIcons(); console.log('✓ updateSubjectIcons完成'); } catch(e) { console.error('✗ updateSubjectIcons错误', e); }
  
  // 每日结算（出错不影响核心功能）
  try { dailySettlement(); console.log('✓ dailySettlement完成'); } catch(e) { console.error('✗ dailySettlement错误', e); }
  
  // 导航绑定（关键功能，必须执行）
  try {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', function() { switchPage(item.dataset.page); });
    });
    console.log('✓ 导航绑定完成');
  } catch(e) { console.error('✗ 导航绑定错误', e); }
  
  // 密码输入回车（元素可能不存在，需要检查）
  try {
    const pwdInput = document.getElementById('parentPasswordInput');
    if (pwdInput) {
      pwdInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') verifyParentPassword();
      });
      console.log('✓ 密码输入绑定完成');
    } else {
      console.warn('⚠ parentPasswordInput元素不存在，跳过密码绑定');
    }
  } catch(e) { console.error('✗ 密码输入绑定错误', e); }
  
  // 请求通知权限（出错不影响核心功能）
  try { requestNotificationPermission(); console.log('✓ 通知权限请求完成'); } catch(e) { console.error('✗ 通知权限错误', e); }
  
  // 启动提醒（出错不影响核心功能）
  try { startReminderCheck(); console.log('✓ 提醒检查启动完成'); } catch(e) { console.error('✗ 提醒检查错误', e); }
  
  // 每周重置专项任务进度（出错不影响核心功能）
  try { checkWeeklyReset(); console.log('✓ 每周重置检查完成'); } catch(e) { console.error('✗ 每周重置错误', e); }
  
  // 渲染所有页面（最关键，必须执行）
  try {
    renderAll();
    console.log('✓ renderAll完成');
  } catch(e) {
    console.error('✗ renderAll错误', e);
    // 降级：至少渲染首页看板
    try { renderKanban(); renderHeroPanel(); } catch(e2) { console.error('✗ 降级渲染也失败', e2); }
  }
  
  console.log('=== Max的学习打卡台已启动 ===');
}

function checkWeeklyReset() {
  const lastReset = AppData._lastWeeklyReset;
  const now = new Date();
  const dayOfWeek = now.getDay();
  // 周一重置
  if (dayOfWeek === 1 && lastReset !== todayStr()) {
    AppData.config.specialTasks.forEach(t => {
      if (t.type === 'progress') t.current = 0;
    });
    AppData._lastWeeklyReset = todayStr();
    saveData();
    console.log('每周专项任务已重置');
  }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
