                let playerDisplaySettings = {};
let isTheaterGenerating = false; // 【【【新增这行代码】】】
let lastDailyPaperContent = '';
let lastDailyPaperDate = null;
let dailyPaperContextForNextMessage = '';
let npcDisplaySettings = {};
const THINKING_PRESETS_KEY = 'CULTIVATION_THINKING_PRESETS_V2';
const NPC_DISPLAY_SETTINGS_KEY = 'CULTIVATION_NPC_DISPLAY_SETTINGS_V1';
const PLAYER_DISPLAY_SETTINGS_KEY = 'CULTIVATION_PLAYER_DISPLAY_SETTINGS_V2';
const DEFAULT_DAILY_PAPER_PROMPT = `你现在是修仙界的一名资深主编，任务是根据提供的素材，排版并撰写一份精美的日报。

【当前时空信息】
- 当前地区（坐标之间相聚1:10km）：\${currentLocation}
- 当前日期：\${currentDate}

【历史参考】
- 上一份日报内容：\${previousDailyPaper}

【参考新闻】
- 本次重点参考内容：\${newsReference}

【剧情原文】
---
\${storyText}
---

【核心规则】
0. 新闻内容准则
- 隐私保护: 严禁将玩家的私密行动作为新闻内容，除非已被第三方公开或影响已达到众所周知的高度。
- 信息来源: 新闻来源限定为“天下皆知”的传闻、宗门或官方公开消息。
- 报道焦点: 报纸内容不围绕玩家，应报道当前地区重大事件、市场动态、各方势力消息等公共新闻。
- 数值真实性: 报道中涉及的所有具体数值（如数量、价格、人数等），必须严格来源于【剧情原文】或【参考新闻】。如果未提供相关数值，则不允许自行编撰或估算，应采用“一批”、“众多”、“些许”等模糊性描述替代。

1. 内容与布局指令
- 特大号外 (可选): 仅当参考新闻为足以震动世界的特大事件时创建。
- 头条头条 (必须): 创作一个头条版块，可来源于参考新闻或当前地区最重要新闻。
- 坐标专栏 (必须): 新闻事件发生在具体的地点，必须创建一个<p><strong>内容:</strong> [x,y]</p>坐标专栏。根据事件内容，从地图上估算一个大致的[x,y]坐标并输出。
- 快讯专栏 (必须): 创作 2-3 个专栏，标题与内容原创，如市场动态、宗门轶闻、奇珍异宝等。
- 八卦专栏 (必须): 创作轻松娱乐小道消息，如村落灵狐化人报恩、仙子传闻怀孕、情妇偷情等。避免泄露现实人物隐私及核心剧情机密。
- 投稿专栏 (必须): 模拟NPC投稿内容，可包含小黄文、宗门广告、重金求子、招聘双修道侣等创意内容。内容可自由发挥，但不涉及玩家隐私或核心剧情泄露。
- 图标: 每个版块标题前从以下列表选择最合适Emoji：🚨, 🍉, ✨, 📜, 💰, ⚔️, 🌿, 🐉, 🦊, 💌, 📝, 🗺️。

2. 日期与更新判断
- 若剧情时间进入新的一天，创作全新日报。
- 若剧情仍在同一天，但无新的新闻事件，直接输出上一份日报完整HTML。
- 若剧情仍在同一天，但出现新的参考新闻，根据新信息创作全新日报。
- 若剧情进入新的一天，但无参考新闻，自行创作符合凡人修仙传世界观的日报。

3. 输出格式与风格
- 参考以下美化代码进行输出，需要设计两个按钮（日报/悬赏榜），点击对应按钮可切换为对应的视图，需要根据情景更改美，每个事件都需要有坐标栏 <p><strong>内容:</strong> [x,y]</p> 在地图上显示内容：
\`\`\`html
<div class="daily-paper-container">
<div class="header">
<h1 class="title">[地区]日报</h1>
<p class="date">[日期]</p>
<div class="view-toggle">
<button class="toggle-btn active" data-view="daily-paper">日报</button>
<button class="toggle-btn" data-view="bounty-view">悬赏</button>
</div>
</div>
<div class="main-content">
<!-- 日报视图 -->
<div id="daily-paper-view" class="view-content">
<!-- 号外版块 (可选) -->
<div class="news-item news-extra">
<h2 class="section-title">🚨 号外！[号外标题]</h2>
<p><strong>号外内容:</strong></p>
</div>
<!-- 头条版块 (必须) -->
<div class="news-item news-headline">
<h2 class="section-title">✨ 头条：[头条标题]</h2>
<p><strong>头条内容:</strong></p>
</div>
<!-- 坐标专栏 (必选) -->
<div class="news-item news-coordinate">
<h2 class="section-title">🗺️ [事件标题]</h2>
<p><strong>事件内容:</strong> [x,y]</p>
</div>
<!-- 多栏专栏容器 (必须) -->
<div class="columns-container">
<!-- 专栏1 -->
<div class="news-column">
<h3 class="section-title">📜 [专栏标题1]</h3>
<div class="column-item">
<h4>[子标题1.1]</h4>
<p><strong>子内容1.1:</strong> [x,y]</p>
</div>
<div class="column-item">
<h4>[子标题1.2]</h4>
<p><strong>子内容1.2:</strong> [x,y]</p>
</div>
</div>
<!-- 专栏2 -->
<div class="news-column">
<h3 class="section-title">💰 [专栏标题2]</h3>
<div class="column-item">
<h4>[子标题2.1]</h4>
<p><strong>子内容2.1:</strong> [x,y]</p>
</div>
</div>
<!-- 八卦专栏 -->
<div class="news-column">
<h3 class="section-title">🦊 八卦传闻</h3>
<div class="column-item">
<h4>[八卦标题1]</h4>
<p><strong>八卦内容1:</strong> [x,y]</p>
</div>
<div class="column-item">
<h4>[八卦标题2]</h4>
<p><strong>八卦内容2:</strong> [x,y]</p>
</div>
</div>
<!-- 投稿专栏 -->
<div class="news-column">
<h3 class="section-title">📝 NPC投稿</h3>
<div class="column-item">
<h4>[投稿标题1]</h4>
<p><strong>投稿内容1:</strong> [x,y]</p>
</div>
<div class="column-item">
<h4>[投稿内容2]</h4>
<p><strong>投稿内容2:</strong> [x,y]</p>
</div>
</div>
</div>
</div>
<!-- ############ 悬赏总榜视图 ############ -->
<div id="bounty-view" class="view-content" style="display: none;">
<div class="bounty-wrapper">
<!-- 左栏：悬赏令 -->
<div class="bounty-column">
<h2 class="column-title">悬赏令</h2>
<div class="bounty-list">
<div class="bounty-item high-threat">
<h3>[姓名/称号] <span class="bounty-level">[境界]</span><span class="bounty-points">积分: [数值]</span></h3>
<p><strong>发布方:</strong> [宗门/势力]</p>
<p><strong>罪状:</strong> [详细描述罪行]</p>
<p><strong>悬赏:</strong> <span class="bounty-reward">[悬赏内容]</span></p>
<p><strong>在地图上显示的悬赏内容:</strong> [x,y]</p>
</div>
</div>
</div>
<!-- 右栏：赏金积分榜 -->
<div class="scoreboard-column">
<h2 class="column-title">赏金积分榜</h2>
<ol class="scoreboard-list">
<li><span class="rank-name">[代号1]</span><span class="rank-score">[总积分1]</span></li>
<li><span class="rank-name">[代号2]</span><span class="rank-score">[总积分2]</span></li>
</ol>
</div>
</div>
</div>
</div>
</div>
<style>
/* --- 全局与基础样式 --- */
.daily-paper-container {
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
line-height: 1.6;
background: #fdfcfa;
border: 1px solid #e0ddc6;
padding: 15px;
max-width: 1200px;
margin: 20px auto;
box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.header {
text-align: center;
border-bottom: 2px solid #c9c3a5;
padding-bottom: 10px;
margin-bottom: 20px;
position: relative; /* 用于定位切换按钮 */
}
.title { margin: 0; font-size: 2.5em; }
.date { margin: 0; font-size: 1em; color: #666; }
.section-title { border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 0; }
.news-item, .news-column {
background: #fff;
border: 1px solid #eee;
padding: 15px;
margin-bottom: 20px;
border-radius: 4px;
}
.column-item:not(:last-child) { border-bottom: 1px dashed #e0e0e0; margin-bottom: 10px; padding-bottom: 10px; }
h2.section-title, h3.section-title, h4 { font-weight: bold; }
p { margin: 0 0 10px 0; }
.news-extra h2.section-title { color: #d9534f; }
.news-headline h2.section-title { color: #337ab7; }
.news-coordinate .map-coords { font-style: italic; color: #888; font-size: 0.9em; }

/* 新增样式 */
.view-toggle {
position: absolute;
bottom: 10px;
left: 50%;
transform: translateX(-50%);
display: flex;
gap: 10px;
}
.toggle-btn {
padding: 5px 15px;
border: 1px solid #ccc;
background-color: #f0f0f0;
cursor: pointer;
border-radius: 4px;
font-size: 0.9em;
}
.toggle-btn.active {
background-color: #007bff;
color: white;
border-color: #007bff;
}

.bounty-wrapper {
display: flex;
flex-wrap: wrap; /* 允许换行 */
gap: 20px;
}
.bounty-column, .scoreboard-column {
flex: 1; /* 弹性布局 */
min-width: 300px; /* 最小宽度 */
background: #f8f8f8;
border: 1px solid #ddd;
padding: 15px;
border-radius: 8px;
}
.column-title {
text-align: center;
color: #333;
border-bottom: 1px solid #eee;
padding-bottom: 10px;
margin-bottom: 15px;
}
.bounty-list, .scoreboard-list {
list-style: none;
padding: 0;
margin: 0;
}
.bounty-item {
border: 1px solid #f0f0f0;
padding: 10px;
margin-bottom: 10px;
border-radius: 5px;
background-color: #fff;
}
.bounty-item h3 {
margin-top: 0;
margin-bottom: 5px;
color: #d9534f; /* 高威胁悬赏 */
display: flex;
justify-content: space-between;
align-items: center;
}
.bounty-level {
font-size: 0.8em;
background-color: #5bc0de;
color: white;
padding: 2px 8px;
border-radius: 3px;
}
.bounty-points {
font-size: 0.9em;
color: #5cb85c;
}
.bounty-reward {
font-weight: bold;
color: #f0ad4e;
}
.scoreboard-list li {
display: flex;
justify-content: space-between;
padding: 8px 0;
border-bottom: 1px dashed #eee;
}
.scoreboard-list li:last-child {
border-bottom: none;
}
.rank-name {
font-weight: bold;
}
.rank-score {
color: #007bff;
}

/* 桌面端视图：当屏幕宽度大于768px时，应用以下样式 */
@media (min-width: 768px) {
.columns-container {
flex-direction: row; /* 桌面端：水平排列 */
flex-wrap: wrap; /* 允许换行 */
align-items: flex-start; /* 栏目顶部对齐 */
}
.news-column {
flex: 1 1 280px; /* flex-grow, flex-shrink, flex-basis。允许伸缩，但基础宽度为280px */
margin-bottom: 0; /* 在flex行布局中，间距由gap控制，移除底部边距 */
}
}
</style>
\`\`\`
`;







    let lastAiStoryText = '';
	const CLOUD_STORAGE_CONFIG_KEY = 'CULTIVATION_CLOUD_STORAGE_CONFIG_V1';
let cloudStorageConfig = {
    enabled: false,
    apiUrl: ''
};
const THINKING_API_CONFIG_KEY = 'CULTIVATION_THINKING_API_CONFIG_V1'; // 新增
const DEFAULT_VARIABLE_THINKING_WORLDBOOK = {
    id: 'default-variable-thinking',
    name: '【内置】变量思考规则',
    triggerMode: 'blue',
    keywords: [],
    content: `
<变量思考>
[必须紧接正文后输出，输出顺序为1，严格遵循下面的格式。格式之间禁止生成无关内容和空行,严格按照指令的格式要求，而不是参考<stroe>中的格式]

<upstore>
变量操作
</upstore>

【至高规则 (MANDATORY RULES)】
1. 你的唯一任务是，且仅是，在 <upstore> 标签内部生成用于操作变量的指令。
2. 严厉禁止 (STRICTLY FORBIDDEN) 直接输出任何形式的原始变量状态，尤其是类似 "Inventory: [...]" 或 "Characters: [...]" 的JSON数组。你必须使用下面定义的指令系统来修改数据。
3. 只能使用 'set', 'add', 'de', 'addSmallSummary', 'addLargeSummary', 'addWorldEvent', 'updateAttribute', 'equipItem', 'unequipItem', 'createLocation', 'updateRegion', 'deleteLocation' 这几个指令，禁止创造新指令。

【玩家(B1)数据操作的铁律 (IRON LAW FOR PLAYER B1 DATA)】
1.  【严禁嵌套】：严厉禁止在 'add("B1", ...)' 指令的内部，以任何形式嵌套 'inventory' (物品清单), 'equipment' (装备), 或任何单独的物品/装备数据。这是一个绝对的禁令。
2.  【分离原则】：所有数据操作必须分离成独立的指令：
    *   人物属性 -> 必须使用 'add("B1", ...)' 或 'updateAttribute("B1", ...)'。
    *   玩家物品 -> 必须为每一个物品使用独立的 'set({"0": "I...", ...})' 指令来添加到物品表(表1)。
    *   玩家装备 -> 必须使用独立的 'equipItem("B1", ...)' 指令。
3.  【错误示例】(绝对禁止模仿)：'set("B1", {"9": {"inventory": [...], "equipment": [...]}})' 这是完全错误的，会导致数据丢失。

填写要求与指令：

1. 编辑指令块

<upstore> 编辑块:
此块包含所有具体的变量数据操作指令，多条指令用空格分隔。
addSmallSummary("小总结")，addLargeSummary("大总结") 这两个指令每次都要生成
 格式: [指令1] [指令2] ... 



2. 指令系统 

A. set({ ...data }) - 新增指令
 功能: 仅用于在相应的变量表中插入一个全新的实体（如一个全新的NPC、一件全新的物品、一个全新的任务）。注意：玩家 "B1" 已存在，不应使用 'set' 来更新，应使用 'add'。
 ID规则: 新增实体时，其0列的ID必须由你自行创建，ID只能为阿拉伯数字正整数，例如T1,P1，S1，前阿拉伯数字正整数，并保证在当前游戏中唯一。
 NPC: 以 C 开头，后跟数字 (例: "C3", "C4")
 物品: 以 I 开头，后跟数字 (例: "I5", "I6")
 任务: 以 T 开头，后跟数字 (例: "T2", "T3")
 灵兽: 以 P 开头，后跟数字 (例: "P1", "P2")
 技能: 以 S 开头，后跟数字 (例: "S1", "S2")



 createLocation - 创建新地点

功能: 在世界地图上创建一个新的地点，可以是主疆域、下辖区域或兴趣点。
格式: createLocation({"type": "地点类型", "data": 地点数据对象})
参数说明:
地点类型: 字符串，必须是以下之一："main_region", "sub_region", "poi" (兴趣点)。
地点数据对象: 包含新地点所有信息的JSON对象，结构必须符合WORLD_MAP_DATA中的定义。

示例:
// 创建一个新的兴趣点
createLocation({"type": "poi","data": {"name": "坠魔谷","x": 800,"y": 750,"main_region": "天南","sub_region": "元武国","description": "上古修士大战的遗迹，充满了空间裂缝和魔气。"}})

// 创建一个新的下辖区域
createLocation({"type": "sub_region","data": {"name": "溪国","main_region": "天南","points": [[750, 300], [850, 280], [880, 400], [780, 420]],"description": "天南七国之一，河流密布，水产丰富。"}})


B. add("ID", { ...data }) - 更新指令
 功能: 更新指定ID实体的属性。你只需提供需要变更的列和新数据。这是修改现有数据（包括玩家"B1"）的唯一正确方式。
 示例 (更新玩家状态和血量): add("B1", {"4": "身负轻伤", "9": {"hp": "85/100"}})
 示例 (更新NPC想法和好感度): add("C2", {"12": "他居然能打败那妖兽，看来不能小瞧。", "15": "5"})
 示例 (更新物品数量): add("I3", {"5": "2"})

 updateRegion - 更新疆域范围
功能: 修改一个已存在的主疆域或下辖区域的边界点，从而改变其形状和大小。
格式: updateRegion({"name": "疆域名", "points": [[x1, y1], [x2, y2], ...]})
参数说明:
疆域名: 要修改的疆域的准确名称（主疆域或下辖区域均可）。
points: 一个新的坐标点数组，用于定义疆域的新边界。
示例:
// 将"越国"的疆域范围进行修改
updateRegion({"name": "越国","points": [[870, 440], [1060, 420], [1090, 590], [890, 610]]})




C. de("ID") - 删除指令
 功能: 删除指定唯一ID的周围人物。当周围角色列表中的角色不在玩家视野时，必须使用此指令删除，禁止删除 isBonded 为true的人物。
当物品数量为0或物品丢失/失去时，删除对应物品
 示例 (删除NPC): de("C1")
 示例 (删除物品): de("I4")

  deleteLocation - 删除地点
 功能: 从地图上删除一个已存在的兴趣点。注意：此指令目前仅支持删除兴趣点，不能删除疆域。
 格式: deleteLocation("兴趣点名称")
参数说明:
兴趣点名称: 要删除的兴趣点的准确名称。
示例:
// 从地图上删除"魁星岛"
deleteLocation("魁星岛")

D.  addSmallSummary("小总结")，addLargeSummary("大总结") - 必须执行的指令  
功能：用于整理当前聊天内容，每次回复都必须带这两条指令。
小总结列填写要求：
用约50~100字概括本次内容作为清晰记忆，忠实记录NPC与{{user}}的言行举止，{{user}}经历的事件，并且需要记录重要NPC与{{user}}经历的事情，按照 NPC名字，与{{user}}经历的事件，NPC对{{user}}的态度转变，NPC与{{user}}的关系，重要NPC当前进行的事件，确保是精简过，不落下细节的，尾部输出时间，地点
大总结列填写要求：
请用一句话概述当前的内容作为模糊记忆，需要包含经历，其他NPC与{{user}}的交集，{{user}}经历的重要事件，重要NPC与{{user}}经历的事件，50字以内，保留时间地点


E. addWorldEvent("时间", "地点", "事件描述") - 特殊指令
 功能: 仅用于在世界大事记中添加一条新的记录。
记录下当前世界所发生的大事


3. 核心数据结构：变量变量定义
currentState 是一个包含多个变量的对象，每个变量以其索引为键。

 0 - 人物变量 ID前缀: B, C, G
 用途: 存储{{user}}和所有周围人物的信息，每次都要更新{{user}}的情况以及周围npc的所有信息

 【角色逻辑铁则：境界、年龄与灵根的关联性】
 1.  基础规则: 具备境界的修士（即境界非'凡人'），其灵根字段绝对禁止填写为'无灵根'。
 2.  关联逻辑: 角色的灵根品质应与其年龄和境界高度相关。
     *   高天赋表现: 低年龄 + 高境界 = 优等灵根。例如，一个仅有20岁但已达筑基期的修士，其灵根理应是天灵根或稀有的异灵根。
     *   平庸天赋表现: 高年龄 + 低境界 = 普通或较差灵根。例如，一个100岁的炼气期修士，其灵根可能是四灵根或五灵根。
 3.  特殊情况: 除非角色有明确的'逆天奇遇'、'特殊体质'或'强大背景'等设定，否则应遵循以上逻辑。

 列定义:
 0: ID (唯一标识) - 例: B1 (玩家), C1, C2... (NPC)
 1: 名称|性别 - 【绝对规则】性别部分必须填写为单一汉字“男”或“女”，严禁使用“男性”或“女性”。 示例: 玩家|男
 2: 境界|身份 - 例: 炼气期|散修 必须输出境界与身份，例如看不透境界等
 3: 性格 -只有NPC需要填写
 4: 当前状态 - 例: 一切正常, 身负轻伤
 5: 灵根 (仅NPC, 如 "天灵根 水", "无灵根")
 6: 特殊体质 (仅NPC, 大部分为 "无")
 7: NPC对玩家的称呼 (仅NPC)
 8: 性经验 (仅NPC, 【重要】必须根据角色性别使用不同格式。 女性格式: 部位:次数(描述), 分号分隔，必须包含口部,小穴,后庭,女女磨镜,人次。示例: 口部:10次(初窥门道); 小穴:20次(经验丰富); 后庭:1次(初尝禁果); 女女磨镜:0次(无); 人次:5人。 男性格式: 简单记录总次数。示例: 性交:15次)
 10: 背景/简介
         11: 详细属性（只有以下几个，禁止新增任何属性，物攻，物防，脚力，法攻，法防，法力，神识，物理穿透，法术穿透，气运，魅力）  - 这是代表着人物的详细属性，{{user}}与NPC的属性每次都必须更新，会随着境界提升而变化，只能使用以下指令单独更新属性：updateAttribute("<角色ID>", "<属性名>", {"current": <当前值>, "max": <上限值>})，例如玩家的神识上限提升100点，当前值也提升100点：updateAttribute("B1", "神识", {"current": 250, "max": 250})，npc的魅力：updateAttribute("C2", "魅力", {"current": 15, "max": 15})
 12: 内心想法/动机 - 每次互动后必须更新，只用于以反映NPC的心理变化，禁止输出B1/玩家的内心想法，并且需要删除B1/玩家的内心想法。
 13: 人际关系 - 分号分隔，例: B1:师徒;C2:仇人
 15: 好感度 - 每次最+-1点好感度，每次都需要根据角色对于{{user}}的实时好感度变化。
 16: 【格式铁则】此列必须严格由5个部分组成，并用'|'符号分隔。五个部分缺一不可，顺序为：1.动作 | 2.穿着 | 3.位置 | 4.身段 | 5.样貌。
    - 位置: 必须严格遵循“具体地点名称 X,Y”的格式，例如“房间 637,2596”，数字坐标绝对不能省略。
    - 身段: 【强制要求】必须进行详细描述，不可为空或省略。
    - 样貌: 【强制要求】必须进行详细描述，不可为空或省略。
    - 【完美示例】: "半躺在千年暖玉床榻上|仅着一件薄如蝉翼的粉色纱裙|青枫山洞府 500,500|身段玲珑有致，曲线毕露|俏脸绯红，美眸中水波流转"
    - 【错误示例】: "半躺在千年暖玉制成的床榻上...含情脉脉地望着你。|青枫山洞府 500,500"（错误原因：将动作、穿着、身段、样貌合并成了一段描述，没有用'|'分隔成5个独立部分。）
 17: 表性癖 (仅NPC, 如 "年下控", "可写未发现")-注意: 先用詞語總結性癖類型，例如（年下控/露體狂/姐控），再描述該性癖的內容，所有性癖要符合性格和人设，可以反差。所有人必须至少有一个表性癖，里性癖未知可写为待发现，性癖要符合NPC性格。
 18: 里性癖 (仅NPC, 如 "暴露狂", "可写待发现")-注意: 先用詞語總結性癖類型，例如（年下控/露體狂/姐控），再描述該性癖的內容，所有性癖要符合性格和人设，可以反差。所有人必须至少有一个表性癖，里性癖未知可写为待发现，性癖要符合NPC性格。
 19: AI生图提示词 (仅在新建角色时输出)
  - 用途：专门为AI绘画生成的一串英文、逗号分隔的关键词。
  - 格式：必须是英文关键词，用逗号分隔。内容应详细描述角色的性别、外貌、身段、穿着、发型、眼睛颜色等视觉特征。
  - 示例：'1girl, solo, long black hair, red eyes, beautiful detailed face, wearing a simple green robe, ancient chinese clothing, standing in a forest'
 20：敏感部位（仅NPC）指定NPC的特定敏感区域，并定义该区域对何种刺激（如触碰、轻抚、吮吸、冷热等）会产生何种生理反应（如战栗、泛红、肌肉收紧、分泌液体等）。
 21：性器状态（仅NPC）详细描写NPC的核心性感区域（如外阴、阴道、肛门、乳房等）在当前情境下的具体状态。描写可围绕形态颜色、湿润度、温度、动态（搏动/收缩）、紧致度等维度展开。
 22：情欲值（仅NPC）
用途：衡量NPC当前的性欲与渴望程度。此数值将直接影响NPC的行为倾向和内心想法。
数值范围：0-100 的整数。其上限固定为100。
1-10(平静期): NPC内心毫无波澜，对性相关话题不感兴趣，甚至可能表现出抗拒。
10-40(萌动期): 内心开始产生涟漪，受到挑逗会脸红心跳，可能会做出一些暗示性的小动作。
40-80(高涨期): 欲望强烈，主动索求，思考模式开始被情欲主导，可能会说出大胆的言语或做出直接的身体接触。
80-100(发情期): 被情欲完全支配，失去理智，会不顾一切地寻求交合。
更新逻辑：
增加：因甜言蜜语、身体接触（尤其是敏感部位）、看到色情画面、闻到特殊气味、浪漫或刺激的氛围等因素而增加。
减少：因互动中断、疼痛、厌恶感、剧情惊吓、高潮后等因素而减少。
输出格式：你只需要更新一个 0-100 的数值。
 23：快感值（仅NPC）记录NPC在亲密互动中所获得的生理愉悦积累。此数值是触发高潮的唯一标准。
用途：量化NPC的性快感程度，作为判断其是否达到高潮的依据。
数值范围：0-100 的整数。
0-30 (预热期): 身体开始有反应，出现轻微的战栗、体温上升等现象。
31-60 (兴奋期): 快感逐渐增强，呼吸急促，开始发出呻吟，身体有明显反应。
61-90 (临界期): 快感非常强烈，接近失控，身体不自觉地迎合，渴望更强的刺激。
91-99 (高潮前夕): 濒临顶点，神智模糊，身体反应达到极致。
100 (高潮): 触发高潮事件。
更新逻辑：
增加：只有在进行亲密互动时才会增加。对敏感部位(#20)的直接刺激会大幅增加快感值。增加幅度取决于刺激的类型、强度和持续时间。
减少：当刺激停止、情欲值(#22)大幅下降或受到惊吓时会缓慢减少。
高潮重置：当快感值达到100时，必须触发高潮事件（如身体剧烈痉挛、潮吹、意识空白等），并在高潮事件后将快感值重置为0，同时大幅降低情欲值(#22)。
输出格式：你只需要更新一个 0-100 的数值。
 24：性观念 (仅NPC, 描述角色对性爱的认知、看法和态度，接受怎样的性爱，而不是描述性饥渴的状态，会随着角色的经历而改变。格式: 1或2个总结性短语 (具体描述，以“认为性爱是”开头)进行组合，体现角色性观念的矛盾与复杂性。正确示例：①<span style="color:pink;">传统保守</span> (认为性爱是夫妻之间的义务，是传宗接代的方式)②<span style="color:pink;">情感依恋</span> (认为性爱是情感达到极致后自然而然发生的，只有在情感深厚时才会选择发生性关系)③<span style="color:pink;">隐秘放纵</span> (认为性爱应该是忠贞的，但是寂寞难耐身边人又不在时偶尔的放纵也情有可原))
 

9: 备注列 (重要) - 严格按照以下格式更新：add("角色ID", { "9": { "变量名": 新的值 } })，一个变量一个指令进行单独更新，禁止全部合在一起更新

 适用于玩家 (ID: "B1")

| 变量名 (键名) | 格式/说明 | 示例 |
| 年龄  | 整数。 | {"年龄": 21} | 更新玩家年龄：add("B1", {"9": {"年龄": "21"}})
| 寿元  | 整数。 | {"寿元": 149} | 更新玩家寿元：add("B1", {"9": {"寿元": "149"}})
| 善恶值  | 整数。表示玩家的善良/邪恶值，做邪恶的事情减少，做善良的事情增加 | {"善恶值": 1050} | 更新玩家善恶值：add("B1", {"9": {"善恶值": "1050"}})
| 修为进度  | 整数，0-100，不带百分号。 | {"修为进度": 75} | 更新玩家修为进度：add("B1", {"9": {"修为进度": "95"}})
| hp | 数值化表示玩家当前血量与健康状态，"当前值/最大值" 格式的字符串，只能使用此指令更新，禁止出现在属性中。 | {"hp": "95/120"} |更新玩家血量：add("B1", {"9": {"hp": "85/100"}})
| 灵根 | 完整的灵根描述字符串。 | {"灵根": "天灵根 火"} |
| traits | 为词条对象数组，其中rarity为词条的稀有度，必须是 平庸, 普通, 稀有, 史诗, 传说, 神迹, 负面状态 之一。 | {"traits": [{"name":"新特性","desc":"描述","rarity":"稀有"}]} | 【关键修正】更新词条：add("B1", {"9": {"traits": [{"name":"天命之子","desc":"你仿佛受到上天的眷顾，好运常伴汝身。","effects":"奇遇几率大幅提升","bonus":{"气运":10},"rarity":"传说"},{"name":"新获得的词条","desc":"描述...","effects":"效果...","bonus":{},"rarity":"稀有"}]}})
| avatar | "男", "女", 或 "auto"。 | {"avatar": "女"} |

适用于NPC (ID: "C..." 或 "G...")

| 变量名 (键名) | 格式/说明 | 示例 |

| 年龄  | 整数。随着时间推进年龄会增加 | {"年龄": 52} | 更新玩家年龄：add("C1", {"9": {"年龄": "52"}})
| 寿元  | 整数。随着时间推进寿元会减少，寿元为0会死亡 | {"寿元": 20} | 更新玩家寿元：add("C1", {"9": {"寿元": "20"}})
| isBonded| true 或 false，不是字符串。true表示为{{user}}的羁绊人物，不能删除 | {"isBonded": true} |
| deeds | 用分号 ; 分隔的事件记录。记录与{{user}}经历的事件 | {"deeds": "0030年:赠予丹药;0031年:共同探险"} |

 1 - 【玩家专属】物品变量表 (ID前缀: I)
【至关重要的规则】: 这是为玩家 'B1' 添加/修改/删除物品的 唯一 方式。绝对禁止 对玩家 'B1' 使用 'add("B1", {"9": {"inventory": [...]}})' 这种为NPC设计的指令。任何试图对玩家 'B1' 的 'inventory' 属性进行批量操作的行为都是 完全错误 且被严格禁止的。
操作：使用 'set({"0":"I...",...})' 新增物品, 'add("I...", ...)' 修改数量, 'de("I...")' 删除。
列定义: 0: ID, 1: 名称, 2: 类型, 3: 描述, 4: 效果, 5: 数量。 【强制要求】 创建物品时，这6个字段必须完整且不得省略。如果物品没有实际效果，效果列必须明确填写为'无'。
【完美示例】: 'set({"0":"I8","1":"五品筑基丹","2":"消耗品","3":"由五百年份的灵草炼制而成，丹身上有三道丹纹，品质上乘。","4":"提升筑基成功率20%","5":"1"})'

【NPC专属】物品、装备与技能与词条指令
  NPC综合数据操作 (add)
【红线规则】：这是唯一给NPC(C1, C2...)增加、修改或删除物品/技能/词条的方式。
功能: 通过修改NPC备注栏（列9）中的 'inventory'、'skills' 和 'traits' 字段，来管理其数据。
格式: 'add("NPC的ID", {"9": {"inventory": [ ... ], "skills": [ ... ], "traits": [ ... ] }})'

【技能对象说明】
技能对象是一个包含 "0" 到 "8" 所有字段的JSON对象，必须完整，不可省略：
- "0": 技能的唯一ID (以 'S' 开头，例如 "S101", "S102")
- "1": 技能名称 (例如 "大衍诀")
- "2": 技能等级 (例如 "第一层")
- "3": 技能属性 (例如 "神识功法")
- "4": 技能描述 (例如 "上古修士所创的强大神识功法，修炼至高深处可分化万千神念。")
- "5": 技能效果 (例如 "大幅提升神识强度和操控精细度。")
- "6": 技能来历 (例如 "从上古遗迹中获得")
- "7": 熟练度 (例如 "50/100")
- "8": 消耗 (例如 "每次施展消耗100法力")
- traits品质: NPC的词条品质通常为 普通, 平庸, 稀有。除非有特殊剧情，否则禁止为NPC赋予 史诗, 传说, 神迹 品质的词条。

【完美示例】 (给NPC C2一批物品，并教会她两个技能):
'add("C2", {"9": {"inventory": [{"0":"I201","1":"养魂木","2":"材料","3":"万年养魂木的一段分支。","4":"用于炼制安魂类丹药","5":"1"}], "skills": [{"0":"S101","1":"大衍诀","2":"第一层","3":"神识功法","4":"强大的神识功法。","5":"提升神识强度。","6":"上古遗迹","7":"50/100","8":"每次100法力"},{"0":"S102","1":"明清灵目","2":"入门","3":"辅助瞳术","4":"可以看破低阶幻术。","5":"看破幻术。","6":"家传","7":"10/100","8":"每次10法心力"}], "traits": [{"name":"丹道奇才","desc":"你对草木药理有天生的亲和力。","effects":"炼丹成功率提升5%","bonus":{"神识":5,"法力":2},"rarity":"稀有"}]}})'
【删除技能示例】 (让NPC C2忘记 "明清灵目" 技能):
'add("C2", {"9": {"skills": [{"0":"S101","1":"大衍诀","2":"第一层","3":"神识功法","4":"强大的神识功法。","5":"提升神识强度。","6":"上古遗迹","7":"50/100","8":"每次100法力"}]}})'
【错误对比】：如果想给C2朱颜果, 绝对不能使用 'set({"0":"I201",...})'，那会把物品加给玩家！

 角色装备指令集 (适用于玩家 "B1" 和所有NPC)
 equipItem - 为角色装备物品
功能: 将一件物品装备到指定角色的指定装备槽位。这是一条独立指令，不可嵌套。
格式: equipItem("角色ID", "装备槽类型", {"index": 槽位索引, "data": 物品对象})
参数说明:
角色ID: 目标角色的ID，可以是玩家("B1")或NPC("C2"等)。
装备槽类型: 字符串，必须是以下之一："weapon" (武器), "armor" (护甲), "technique" (功法), "treasure" (法宝)。
index: 数字，0 到 5，代表该类型下的6个具体槽位，只能填一个。
data (物品数据对象):
 这是核心的物品定义部分，它是一个包含 "0" 到 "5" 作为键的对象，每个键对应物品的一项属性。
"0": 物品的唯一ID。必须以大写字母 I 开头，后面跟上数字，例如 "I1", "I2"。这个ID在当前存档中不能与任何已有物品重复。
"1": 物品的名称。例如 "万法归藏"。
"2": 物品的类型。必须是以下之一："武器", "护甲", "功法", "法宝", "消耗品", "重要物品", "材料", "其他物品"。对于 equipItem 指令，这个值通常应与指令的第二个参数（装备槽类型）相匹配。
"3": 物品的描述。详细说明物品的外观、来历或背景故事。
"4": 物品的效果。描述物品的具体加成或功能。属性加成的格式为 品质: 属性名+数值，多个效果用逗号 , 分隔。例如 "神话: 神识+10000, 法力+200000"。
"5": 物品的数量。对于装备来说，这个值通常是 "1"。
示例 (为NPC装备):
// 为ID为"C2"的NPC，在第1个武器槽(索引为0)装备一把名为"青竹蜂云剑"的武器
equipItem("C2", "weapon", {"index": 0,"data": {"0": "I101","1": "青竹蜂云剑","2": "武器","3": "用墨绿竹子炼制而成的飞剑，锋利无比。","4": "史诗: 法攻 +30, 传说: 法术穿透 +15","5": "1"}})
示例 (为玩家装备):
// 当玩家获得 "玄色道袍" 时，为其在第1个护甲槽(索引为0)穿上
equipItem("B1", "armor", {"index": 0,"data": {"0": "I301","1": "玄色道袍","2": "护甲","3": "一件朴素的黑色道袍，防御力尚可。","4": "普通: 物防+5, 法防+5","5": "1"}})


unequipItem - 为角色卸下装备
功能: 将指定角色指定槽位的装备卸下（物品会消失，不会自动返回储物袋）。这是一条独立指令。
格式: unequipItem("角色ID", "装备槽类型", {"index": 槽位索引})
参数说明:
角色ID: 目标角色的ID，可以是玩家("B1")或NPC("C2"等)。
装备槽类型: 同上，"weapon", "armor", "technique", "treasure"。
槽位索引: 数字，0 到 5。
示例:
// 将ID为"C2"的NPC的第1个武器槽(索引为0)的装备卸下
unequipItem("C2", "weapon", {"index": 0})
// 将玩家的第2个法宝槽(索引为1)的装备卸下
unequipItem("B1", "treasure", {"index": 1})




 3 - 时间地点表，（严格按照以下格式填写）
 用途: 记录当前时间与地点，始终只有一行，每次都需要更新以推进时间。
 必须使用add指令，并以固定的ID TIME_LOCATION_ROW 为目标，来更新时间与地点信息。
 【强制格式】列定义: 0: 必须严格遵循 “时间/主疆域/下辖区域(兴趣点) X,Y” 的格式。其中，'X,Y' 是玩家的精确数字坐标，绝对不可省略。
 示例：add("TIME_LOCATION_ROW", {"0":"0001年 01月 01日 08:15/天南/越国（街道）980,520"})


4 - 世界大事表(每次发生了大事后以此记录)
用途：记录当前世界所发生的大事，每次都需要更新以推进事件
使用addWorldEvent("时间", "地点", "事件描述") 指令格式来添加事件


 玩家其他变量 (ID前缀: T, P, S）
 5: 任务栏 
每次都需要根据剧情推测玩家当前进行的事件，奖励与惩罚都是完成或失败可能导致的剧情走向或奖励
 6: 灵兽栏 
表示玩家所驯服的灵兽，当玩家有灵兽时，需要更新灵兽信息
 7: 技能栏 
表示玩家当前学会的技能，当技能有变化时，需要实时更新玩家的技能情况
 操作: 使用 set, add, de 指令，并为其创建唯一的ID（ID只能为阿拉伯数字正整数，例如T1,P1，前阿拉伯数字正整数）。
示例（新增任务）：set({"0":"T1","1":"清剿黑风狼","2":"城北的黑风森林近期有妖狼出没，已有多名采药人遇害。请前往剿灭狼王，取其妖丹为证。","3":"150块下品灵石，炼气期功法《锐金诀》一部","4":"无","5":"炼气"})

示例（新增灵兽）：set({"0": "P1","1": "寻宝鼠","2": "一阶下品","3": "通体金色毛发，仅有巴掌大小，一双黑豆般的小眼睛滴溜溜乱转，显得颇为机灵。","4": "天性胆小，但对各种天材地宝和灵气波动极为敏感。","5": "【寻宝】：可以感知到附近百米内未被发现的灵草或矿物。","6":"怕...但是...好香的味道！"})

示例（新增技能）：set({"0": "S1","1": "长春功","2": "第一层","3": "木属性功法","4": "修炼时缓慢恢复生命与法力。","5": "修炼时缓慢恢复生命与法力。","6": "门派统一传授","7":"0/100","8":"無"})

</变量思考>
`
};


let currentEditingContext = {
    type: null, 
    id: null
};

let thinkingApiConfig = {}; 
let thinkingApiController = null;
let achievementRewardDeltas = [];


const thinkingApiSettingsOverlay = document.getElementById('thinking-api-settings-overlay'); // 新增DOM引用
    document.addEventListener('DOMContentLoaded', () => {
const TABLE_DEFINITIONS = {
'0': { // 人物表
'0': 'ID', '1': '名称/性别', '2': '境界/身份', '3': '性格', '4': '当前状态',
'5': '灵根', '6': '特殊体质', '7': '对玩家的称呼', '8': '性经验', '9': '备注列',
'10': '背景/简介', '11': '详细属性', '12': '内心想法/动机', '13': '人际关系',
'15': '好感度', '16': '视觉细节(动作/穿着/位置/身段/样貌)', '17': '表性癖',
'18': '里性癖', '19': 'AI生图提示词', '20': '敏感部位', '21': '性器状态',
'22': '情欲值', '23': '快感值', '24': '性观念'
},
    '1': { // 玩家物品表
        '0': 'ID', '1': '名称', '2': '类型', '3': '描述', '4': '效果', '5': '数量'
    },
    '6': { // 任务栏
        '0': 'ID', '1': '标题', '2': '描述', '3': '奖励', '4': '惩罚', '5': '难度'
    },
    '7': { // 灵兽栏
        '0': 'ID', '1': '名称', '2': '等级', '3': '外貌', '4': '性格', '5': '技能', '6': '内心想法'
    },
    '8': { // 技能栏
        '0': 'ID', '1': '名称', '2': '等级', '3': '属性', '4': '描述', '5': '效果', 
        '6': '来历', '7': '熟练度', '8': '消耗'
    }
};
	
const AI_THEATER_FULL_DEFAULT_PROMPT = `你是一个富有想象力的剧本作家和前端开发者。你的任务是根据用户提供的故事原文和一句话想法，创作一个简短的、互动的、可视化的HTML小剧场。
【要求】
0.1. Layout & Style
- Responsive Core: Use responsive design. The UI must adapt seamlessly to mobile, tablet, and desktop screens.
    - Use @media queries, percentage widths, and a max-width (recommended: 800px) to achieve this. Avoid fixed pixel widths.
- Sizing: Use \`height: auto\` for all elements. Do not use \`vh\` units. Ensure \`<body>\` has \`overflow: auto\` for scrolling.
- Structure: The module must be a single, centered container.
- Styling:
    - Design must be creative, unique each time, and match the story's theme.
    - Use \`<p class="title-custom">\` for titles, not \`<h1>-<h3>\`.
    - Use readable, sans-serif fonts with clear \`color\` settings to ensure visibility.
    - Style all scrollbars for an immersive feel.
2. Dynamic Interactivity & Creative Design
- Rich Interactivity (Crucial): Each module must feature rich, dynamic JavaScript interactivity. The goal is a creative, engaging front-end experience, not a static page.
    - Functionality: Implement state changes, content switching, animations, and simulated input feedback.
    - Performance: Use lightweight animations to ensure stability on all devices.
    - Compatibility: Ensure scripts are compatible with SillyTavern and web environments (e.g., pop-ups display correctly). Logic should be clear and focused.
- Creative & Thematic Uniqueness:
    - No Repetition: NEVER repeat. Every output must be unique, creative, and random.
    - Thematic Design: The UI's colors, typography, and animations must match the story's atmosphere. Embody a "conversational UI".
    - Logical Consistency: The design must be logically consistent with the story's world (e.g., no modern social media UI in a fantasy setting).
3. Content & Assets
- Self-Contained: No external CSS, JS files, or APIs. All assets must be generated or declared as specified.
- Characters & Narrative:
    - Avatars: Represent character avatars with text or symbols (e.g., emojis) inside a circular frame.
    - Relevance: Content must be highly relevant to char and user.
    - NPC Cameos: Include cameo appearances from third-party NPCs (like <文中吐槽>) to enrich the scene.
- Language & Tone:
    - Primary Language: Use Simplified Chinese.
    - Usernames: For forum-style interactions, create witty, anonymous usernames, never revealing real character names.
- Assets:
     - Images:
        - Generate at least one relevant image per module using the format \`https://image.pollinations.ai/prompt/{keywords%20here}\`.
        - Use concise, space-separated keywords.      
        - CRITICAL RULE: The keywords used for image generation must adhere to the following strict limitations:
            - ZERO people or characters: Do not use any words that describe or imply humans, human-like figures, or characters (e.g., \`man\`, \`woman\`, \`boy\`, \`girl\`, \`soldier\`, \`king\`).
            - ZERO physical attributes: Do not use any words related to physical appearance or body parts (e.g., \`eyes\`, \`hair\`, \`face\`, \`smile\`, \`pretty\`, \`handsome\`).
            - FOCUS ONLY on scenes, objects, animals, styles, and abstract concepts (e.g., \`epic%20landscape\`, \`cyberpunk%20city\`, \`a%20lone%20wolf\`, \`watercolor%20style\`).
        - The final image must not contain any realistic human figures. Crop the bottom to hide watermarks if possible.
    - Audio: External audio is allowed ONLY from public domains (e.g., freesound.org). You must declare the full URL in the idea-comment. No Base64 audio.
4. Structure & Compatibility
- Strict HTML Format: The output must be a complete HTML document, ordered exactly as:

你每次会根据上下文或随机从下列内容库中选取一个内容进行生成，但不局限于此，你会尽可能地进行富有创意的设计，核心语言为简体中文：

1. 社交平台 / app模拟类（如果是手机页面，手机壳也要完整生成，可以设计成不同的颜色和装饰）
    - 中国场景：{{random::微信聊天界面::qq聊天界面::qq空间::微博动态页::小红书笔记::豆瓣帖子::知乎问答::B站弹幕播放器::网易云评论::淘宝商品页::抖音短视频播放器与直播页面::晋江论坛页面::天涯帖子页::a岛匿名论坛::微信朋友圈}}
    - 欧美场景：{{random::Twitter 帖子动态页::Facebook朋友圈::Instagram帖子与Story::Reddit帖子与评论串::Discord频道::YouTube播放器::Spotify音乐播放器与歌词::Tumblr博文::手机Telegram聊天界面::Google搜索结果页::iMessage聊天页面::Pornhub::OnlyFans}}
    - 日韩场景（日韩场景下可以共用欧美场景的内容）：{{random::LINE聊天记录::KakaoTalk动态页::TheQoo热帖::Pann留言墙::2channel匿名论坛}}
    - 情侣场景：{{random::情侣空间页面::一起听音乐界面::情侣秘密聊天室界面::情趣小玩具遥控界面::倒数日纪念日界面::想做的事情清单}}
2. 电子设备模拟类
   {{random::Apple Watch通知页::AirPods连接页面::旧式传呼机::拟真导航终端::任务面板界面::系统黑客终端::AI助手界面::AirDrop空投页面::iPod音乐播放界面::随身听界面::CCD复古相机::CD播放器::唱片::老式按键手机::Switch::小霸王游戏机::3DS::PSP::街机::拓麻歌子::电视}}
3. 纸质与书写类
   {{random::手写信封::便签纸::便利贴::问卷::报告::考卷答题卡::留言纸条::旧报纸::复古明信片::手账笔记本页::拍立得照片框::任务书::老旧档案卡::日记页::涂鸦绘画::塔罗牌::情书::规则怪谈}}
4. 交互游戏类
   {{random::猜拳::抽奖::转盘::盲盒::打牌::下棋::扭蛋}}
5. 特殊风格
   {{random::模拟恐怖::乱码::windowsXP式怀旧窗口::古风::魔法元素::礼物::动漫周边::SCP收容记录::Steam游戏库或游戏评价}}。
1.  输出格式: 你的回答必须且只能包含一个包裹在 \`\`\`html 和 \`\`\` 之间的HTML代码块。不要有任何代码块之外的解释。
2.  内容: HTML内容必须是独立、完整的，可以直接在 <iframe srcdoc="..."> 中运行。
3.  技术栈: 使用HTML、CSS和JavaScript。不要引入任何外部库(如jQuery, React等)。所有CSS和JS都必须内联在HTML文件中。
4.  视觉风格: 创造一个简洁、有氛围感的视觉界面。使用深色主题，搭配合适的字体和颜色。元素居中显示。
5.  互动性: 利用JavaScript为小剧场增加一些简单的动画或用户互动效果（例如，点击角色有对话冒出，鼠标悬停有效果等）。
6.  故事融合: 你的创作必须紧密围绕我提供的【故事原文】。小剧场是对原文某个场景、情绪或核心概念的视觉化和再创作。
7.  用户想法: 同时，也要体现【用户指定小剧场】中的核心创意。
---
现在，请基于以上原文和下面的用户想法，开始你的创作。记住，只要HTML代码块。
【故事原文】
\${storyText}
---
`;

function showCustomAlert(message, title = '提示') {
    return new Promise((resolve) => {
        // --- 1. 获取项目中已有的弹窗DOM元素 ---
        const overlay = document.getElementById('custom-dialog-overlay');
        const modalTitle = document.getElementById('custom-dialog-title');
        const modalMessage = document.getElementById('custom-dialog-message');
        const modalButtons = document.getElementById('custom-dialog-buttons');

        // 安全检查：如果找不到必要的元素，回退到系统alert，并打印错误
        if (!overlay || !modalTitle || !modalMessage || !modalButtons) {
            console.error('showCustomAlert 致命错误: 无法找到 #custom-dialog-overlay 相关元素！请检查HTML结构。');
            alert(message); // 作为最后的保障
            resolve();
            return;
        }

        // --- 2. 填充内容 ---
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modalButtons.innerHTML = ''; // 清空旧按钮

        // --- 3. 创建并配置“确定”按钮 ---
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '确定';
        // 使用您项目中的样式类，保证视觉统一
        confirmBtn.className = 'major-action-button';

        // --- 4. 绑定事件 ---
        const closeDialog = () => {
            overlay.classList.remove('visible');
            resolve();
            confirmBtn.removeEventListener('click', closeDialog);
        };

        confirmBtn.addEventListener('click', closeDialog);
        
        // --- 5. 显示弹窗 ---
        modalButtons.appendChild(confirmBtn);
        overlay.classList.add('visible');
        confirmBtn.focus();
    });
}


 

function makeElementDraggable(element, handle) {
    if (!element || !handle) return;
    let isDragging = false;
    let offsetX, offsetY;

    handle.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isDragging = true;

        const rect = element.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        element.style.transform = 'none';
        element.style.top = `${rect.top}px`;
        element.style.left = `${rect.left}px`;
        
        handle.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();

        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;

        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - element.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - element.offsetHeight));

        element.style.left = `${newLeft}px`;
        element.style.top = `${newTop}px`;
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        handle.style.cursor = 'move';
        document.body.style.userSelect = '';
    });
}



let theaterApiController = null; 

async function callAutomatedAITheater(storyText, newsReferenceContent, targetLogId) {
if (isTheaterGenerating) {
console.log("AI小剧场/日报：已有生成任务正在进行，本次自动请求被跳过。");
return;
}
const isAutoGenEnabled = localStorage.getItem('theater_autoGenEnabled') === 'true';
if (!isAutoGenEnabled || !currentArchiveName) {
return;
}

const isDailyPaperMode = localStorage.getItem('theater_isDailyPaperMode') === 'true';

if (isDailyPaperMode && (!storyText || storyText.trim().length < 15) && (!newsReferenceContent || newsReferenceContent === '无')) {
console.log("自动日报：无新剧情或参考新闻，跳过本次生成。");
return;
}

const apiUrl = localStorage.getItem('theater_apiEndpoint');
const apiKey = localStorage.getItem('theater_apiKey');
const model = localStorage.getItem('theater_apiModel');

const promptTemplate = isDailyPaperMode
? (localStorage.getItem('theater_dailyPaperPrompt') || DEFAULT_DAILY_PAPER_PROMPT)
: (localStorage.getItem('theater_apiPrompt') || AI_THEATER_FULL_DEFAULT_PROMPT);

if (!apiUrl || !apiKey || !model || !promptTemplate) {
showDanmaku('自动生成(小剧场/日报)配置不完整，已跳过。', 'error');
return;
}

let statusDanmaku = null;
theaterApiController = new AbortController(); 
const signal = theaterApiController.signal; 

try {
isTheaterGenerating = true;
statusDanmaku = showDanmaku('后台AI正在构思小剧场/日报...', 'status', theaterApiController); // 【修改】传递 AbortController

const timeElement = document.getElementById('time-location-display');
const currentDate = timeElement ? (timeElement.value || timeElement.textContent) : '日期未知';
const rawLocation = currentPlayerData.location || '';
const currentLocation = rawLocation.split('|')[0].trim() || '修仙界';

const finalPrompt = promptTemplate
.replace(/\${storyText}/g, storyText)
.replace(/\${prompt}/g, '根据以上内容自动生成。')
.replace(/\${currentLocation}/g, currentLocation)
.replace(/\${currentDate}/g, currentDate)
.replace(/\$\{previousDailyPaper\}/g, lastDailyPaperContent || '这是本世界的第一份日报。')
.replace(/\$\{newsReference\}/g, newsReferenceContent || '无');

console.groupCollapsed(`[自动日报生成] - ${new Date().toLocaleTimeString()}`);
console.log("%c收到的 storyText:", "color: #90CAF9;", storyText);
console.log("%c收到的 newsReferenceContent:", "color: #A5D6A7;", newsReferenceContent);
console.log("--- 发送给AI的最终Prompt ---");
console.log(finalPrompt);
console.groupEnd();

const response = await fetch(`${apiUrl}/chat/completions`, {
method: 'POST',
headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
body: JSON.stringify({ model: model, messages: [{ role: 'user', content: finalPrompt }] }),
signal: signal 
});

if (signal.aborted) { 
console.log("AI小剧场/日报请求被主动中止。");
return;
}

if (!response.ok) {
const errorData = await response.json().catch(() => ({}));
showDanmaku(`自动生成API错误: ${response.status} - ${errorData.error?.message || '未知错误'}`, 'error');
return;
}

const data = await response.json();
const aiResponse = data.choices[0]?.message?.content || '';

console.groupCollapsed(`[自动日报生成] - AI响应`);
console.log(aiResponse);
console.groupEnd();

const htmlMatch = aiResponse.match(/```html([\s\S]*?)```/);
let pureHtmlContent = null;

if (htmlMatch && htmlMatch[1]) {
pureHtmlContent = htmlMatch[1].trim();
} else if (aiResponse.trim().startsWith('<div class="daily-paper-container">')) {
pureHtmlContent = aiResponse.trim();
}

if (pureHtmlContent) {
lastDailyPaperContent = pureHtmlContent;
dailyPaperContextForNextMessage = extractMainContent(pureHtmlContent);

const archive = await db.archives.get(currentArchiveName);
const targetLog = archive.data.logs.find(log => log.id === targetLogId);

if (targetLog) {
targetLog.dailyPaperHtml = pureHtmlContent;


targetLog.mapEvents = extractMapEventsFromHtml(pureHtmlContent);

activeTheaterHTML = '```html\n' + pureHtmlContent + '\n```';
if (!archive.data.state) archive.data.state = {};
archive.data.state.activeTheaterHTML = activeTheaterHTML;

await db.archives.put(archive);
console.log(`【日报/剧场保存】自动生成的内容已附加到日志 ${targetLogId} 并更新了全局状态。`);
showDanmaku('后台日报/剧场已更新并保存到存档。', 'success');
} else {
console.warn("自动日报生成完成，但找不到要附加到的目标日志条目。");
}
} else {
console.warn("自动生成：AI未返回有效的HTML代码块。AI的原始返回内容如下：");
console.log(aiResponse);
}
} catch (error) {
if (error.name === 'AbortError') { 
console.log("AI小剧场/日报请求被用户取消。");
showDanmaku('AI小剧场/日报请求已取消。', 'world');
} else {
console.error('自动生成失败:', error);
showDanmaku(`自动生成失败: ${error.message}`, 'error');
}
} finally {
if (statusDanmaku) statusDanmaku.remove();
isTheaterGenerating = false;
theaterApiController = null; 
}
}

async function generateAITheater() {
const promptInput = document.getElementById('ai-prompt-input');
const placeholder = document.getElementById('ai-theater-placeholder');
const iframe = document.getElementById('ai-theater-iframe');
const userPrompt = promptInput.value.trim();


placeholder.innerHTML = `<i class="fas fa-spinner fa-spin fa-2x"></i><p>正在生成内容...</p>`;
placeholder.style.display = 'flex';
iframe.srcdoc = '';
iframe.style.display = 'none';

try {
const htmlContent = await callDailyPaperAPI(userPrompt);
if (!htmlContent) {
throw new Error("AI未能返回任何内容。");
}

activeTheaterHTML = '```html\n' + htmlContent + '\n```';

iframe.srcdoc = htmlContent;
placeholder.style.display = 'none';
iframe.style.display = 'block';

lastDailyPaperContent = htmlContent;
dailyPaperContextForNextMessage = extractMainContent(htmlContent);

if(currentArchiveName) {
const archive = await db.archives.get(currentArchiveName);
if (archive) {
if (!archive.data.state) archive.data.state = {};
archive.data.state.activeTheaterHTML = activeTheaterHTML;
await db.archives.put(archive);
}
}

} catch (error) {
placeholder.style.display = 'flex';
iframe.style.display = 'none';
placeholder.innerHTML = `<p style="color: red;">内容生成失败: ${error.message}</p>`;
}
}


async function callDailyPaperAPI(prompt) {
const apiUrl = localStorage.getItem('theater_apiEndpoint');
const apiKey = localStorage.getItem('theater_apiKey');
const model = localStorage.getItem('theater_apiModel');

if (!apiUrl || !apiKey || !model) {
throw new Error("AI小剧场/日报的API配置不完整，请先在设置中填写。");
}

const isDailyPaperMode = localStorage.getItem('theater_isDailyPaperMode') === 'true';
const promptTemplate = isDailyPaperMode
? (localStorage.getItem('theater_dailyPaperPrompt') || DEFAULT_DAILY_PAPER_PROMPT)
: (localStorage.getItem('theater_apiPrompt') || AI_THEATER_FULL_DEFAULT_PROMPT);

const timeElement = document.getElementById('time-location-display');
const currentDate = timeElement ? (timeElement.value || timeElement.textContent) : '日期未知';
const rawLocation = currentPlayerData.location || '';
const currentLocation = rawLocation.split('|')[0].trim() || '修仙界';

const newsRefMatch = prompt.match(/<news_ref>([\s\S]*?)<\/news_ref>/);
const newsReferenceContent = newsRefMatch ? newsRefMatch[1].trim() : '无';
const cleanPrompt = prompt.replace(/<news_ref>[\s\S]*?<\/news_ref>/g, '').trim();

const finalPrompt = promptTemplate
.replace(/\$\{storyText\}/g, lastAiStoryText || '暂无最新的故事原文内容可供参考。')
.replace(/\$\{prompt\}/g, cleanPrompt || '无')
.replace(/\$\{currentLocation\}/g, currentLocation)
.replace(/\$\{currentDate\}/g, currentDate)
.replace(/\$\{previousDailyPaper\}/g, lastDailyPaperContent || '这是本世界的第一份日报。')
.replace(/\$\{newsReference\}/g, newsReferenceContent);

try {
const content = await genericApiCall(apiUrl, apiKey, model, finalPrompt);
console.log("【日报API原始返回】:", content);

const match = content.match(/```html([\s\S]*?)```/);
const dailyPaperHtml = match ? match[1].trim() : content;

lastDailyPaperContent = dailyPaperHtml;
dailyPaperContextForNextMessage = extractMainContent(dailyPaperHtml);

const archive = await db.archives.get(currentArchiveName);
if (archive && Array.isArray(archive.data.logs) && archive.data.logs.length > 0) {
const lastLog = archive.data.logs[archive.data.logs.length - 1];
if (lastLog.type === 'ai') {
lastLog.dailyPaperHtml = dailyPaperHtml;

lastLog.mapEvents = extractMapEventsFromHtml(dailyPaperHtml);
await db.archives.put(archive);
console.log("【日报保存】手动生成的日报及地图事件已附加到最新的AI日志条目中。");
}
}


return dailyPaperHtml;

} catch (error) {
throw error;
}
}

function extractMapEventsFromHtml(htmlString) {
if (!htmlString) return [];

const events = [];
const tempDiv = document.createElement('div');
tempDiv.innerHTML = htmlString;

const newsTypeConfig = {
'news-extra': { icon: '🚨', color: '#d9534f' }, // 红色
'news-headline': { icon: '✨', color: '#337ab7' }, // 蓝色
'news-coordinate': { icon: '🗺️', color: '#5cb85c' }, // 绿色
'news-column': { icon: '📜', color: '#5bc0de' }, // 浅蓝色
'bounty-item': { icon: '💰', color: '#f0ad4e' }, // 橙色
'default': { icon: '📍', color: '#888' } // 灰色
};


const coordinateElements = tempDiv.querySelectorAll('p, .bounty-item');

coordinateElements.forEach(el => {
const textContent = el.textContent || el.innerText;
const coordsMatch = textContent.match(/\[(\d+),(\d+)\]/);

if (coordsMatch) {
try {
const x = parseInt(coordsMatch[1]);
const y = parseInt(coordsMatch[2]);

if (!isNaN(x) && !isNaN(y)) {
let icon = newsTypeConfig.default.icon;
let color = newsTypeConfig.default.color;
let eventTitle = `事件 [${x},${y}]`; // 默认弹窗标题
let eventContent = ''; // 弹窗内容

// 查找最近的新闻项容器
const newsItemContainer = el.closest('.news-item, .news-column, .bounty-item');

if (newsItemContainer) {
// 1. 确定图标和颜色
for (const key in newsTypeConfig) {
if (newsItemContainer.classList.contains(key)) {
icon = newsTypeConfig[key].icon;
color = newsTypeConfig[key].color;
break;
}
}


const sectionTitleEl = newsItemContainer.querySelector('h2.section-title, h3.section-title, h3');
if (sectionTitleEl) {
const titleText = sectionTitleEl.textContent.trim();
const iconMatch = titleText.match(/(\p{Emoji})/u);
if (iconMatch) {
icon = iconMatch[1]; // 使用标题中的Emoji作为图标
}
eventTitle = titleText.replace(/(\p{Emoji})\s*/u, ''); // 移除Emoji后的标题作为弹窗标题
}


const clonedContainer = newsItemContainer.cloneNode(true);
const clonedCoordinateEl = clonedContainer.querySelector(`[data-coords="${x},${y}"]`) || clonedContainer.querySelector('p:last-child'); // 尝试找到坐标元素
if (clonedCoordinateEl) {
clonedCoordinateEl.remove(); // 移除坐标行
}


const paragraphs = clonedContainer.querySelectorAll('p');
let mainContent = '';
paragraphs.forEach(p => {
if (p.textContent.trim().length > 0) {
mainContent += `<p>${p.innerHTML}</p>`;
}
});

eventContent = mainContent + `<p><strong>坐标:</strong> [${x},${y}]</p>`;

} else {

if (textContent.includes('内容:') || textContent.includes('事件内容:') || textContent.includes('在地图上显示的悬赏内容:')) {
icon = newsTypeConfig['news-coordinate'].icon;
color = newsTypeConfig['news-coordinate'].color;


const contentMatch = originalEventText.match(/<strong>内容:<\/strong>\s*([^<]+)/);
if (contentMatch && contentMatch[1]) {
eventTitle = contentMatch[1].trim();
eventContent = `<p><strong>内容:</strong> ${eventTitle}</p><p><strong>坐标:</strong> [${x},${y}]</p>`;
} else {

eventTitle = `事件 [${x},${y}]`;
eventContent = `<p><strong>坐标:</strong> [${x},${y}]</p>`;
}
}
}


const existingEvent = events.find(e => e.coords[0] === x && e.coords[1] === y && e.icon === icon);
if (!existingEvent) {
events.push({
icon: icon,
color: color,
coords: [x, y],
title: eventTitle, // 用于弹窗标题
text: eventContent // 用于弹窗内容
});
}
}
} catch (e) {
console.warn("解析日报通用坐标栏时出错:", e);
}
}
});

return events;
}

function extractMainContent(htmlString) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    const styleTags = tempDiv.querySelectorAll('style');
    styleTags.forEach(tag => tag.remove());
    return tempDiv.textContent || tempDiv.innerText || "";
}


async function loadAITheaterContent() {
    const iframe = document.getElementById('ai-theater-iframe');
    const placeholder = document.getElementById('ai-theater-placeholder');
    const userIdea = document.getElementById('ai-prompt-input').value.trim();
    
    const apiUrl = localStorage.getItem('theater_apiEndpoint');
    const apiKey = localStorage.getItem('theater_apiKey');
    const model = localStorage.getItem('theater_apiModel');
    let promptTemplate = localStorage.getItem('theater_apiPrompt') || AI_THEATER_FULL_DEFAULT_PROMPT;
    if (!userIdea) { showAITheaterAlert('请先输入你的想法。', document.getElementById('ai-theater-window')); return; }
    if (!currentArchiveName) { showAITheaterAlert('请先开始或加载一个存档。', document.getElementById('ai-theater-window')); return; }
    if (!apiUrl || !apiKey || !model) { showAITheaterAlert('请先在配置中设置完整的API信息。', document.getElementById('ai-theater-window')); return; }
    placeholder.style.display = 'flex';
    iframe.style.display = 'none';
    placeholder.innerHTML = `<i class="fas fa-spinner fa-spin fa-2x" style="color: #7289da;"></i><p style="margin-top: 20px; color: #b9bbbe;">正在连接AI，构思剧本中...</p>`;
    
    let storyTextForPrompt = '';
    if (lastAiStoryText && lastAiStoryText.trim()) {
        storyTextForPrompt = lastAiStoryText;
    } else {
        try {
            const archive = await db.archives.get(currentArchiveName);
            if (archive && archive.data.logs && archive.data.logs.length > 0) {
                for (let i = archive.data.logs.length - 1; i >= 0; i--) {
                    const log = archive.data.logs[i];
                    if (log.type === 'ai' && log.content && !log.content.includes('[天道总结:')) {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = log.content;
                        const plainText = (tempDiv.textContent || tempDiv.innerText || "").trim();
                        if (plainText) {
                            storyTextForPrompt = plainText.replace(/^(剧情|旁白|场景|人物)\s*[:：\s]*/, '');
                            break;
                        }
                    }
                }
            }
        } catch (error) { console.error("从存档回溯剧情失败:", error); }
    }
    if (!storyTextForPrompt) {
        storyTextForPrompt = '【注意：当前故事原文为空，AI可能无法创作相关内容】';
    }
    const finalPrompt = promptTemplate.replace(/\${storyText}/g, storyTextForPrompt) + `\n\n【用户指定小剧场】\n${userIdea}`;
    try {
        const response = await fetch(`${apiUrl}/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({ model: model, messages: [{ role: 'user', content: finalPrompt }] })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API 请求失败: ${response.status} - ${errorData.error?.message || JSON.stringify(errorData)}`);
        }
        const data = await response.json();
        const aiResponse = data.choices[0]?.message?.content || 'AI未能返回有效内容。';
        
        const htmlMatch = aiResponse.match(/```html([\s\S]*?)```/);
        if (htmlMatch && typeof htmlMatch[1] === 'string' && htmlMatch[1].trim()) {
            activeTheaterHTML = htmlMatch[0]; 
            await db.archives.update(currentArchiveName, { 'data.state.activeTheaterHTML': activeTheaterHTML });
            iframe.srcdoc = htmlMatch[1].trim();
            placeholder.style.display = 'none';
            iframe.style.display = 'block';
        } else {
            throw new Error("AI返回的内容中未找到有效的HTML代码块。");
        }
    } catch (error) {
        console.error('获取AI小剧场内容失败:', error);
        placeholder.innerHTML = `<div style="color: #f04747; padding: 20px; text-align: center; max-width: 90%;"><h4 style="margin-top: 0;">剧本生成失败</h4><p style="font-size: 0.9em; word-break: break-all;">${error.message}</p></div>`;
        activeTheaterHTML = null; 
    }
}


function showAITheaterAlert(message, parentElement) {
    // 这个函数现在必须接收一个父容器元素
    if (!parentElement) {
        console.error('showAITheaterAlert错误：必须提供一个父容器元素！');
        // 作为备用方案，直接在页面上弹窗，虽然层级可能不对，但至少能看见
        alert(message); 
        return;
    }

    return new Promise(resolve => {
        // --- 1. 准备工作：控制父容器 ---
        // 确保父容器可以作为我们弹窗的定位参考
        if (window.getComputedStyle(parentElement).position === 'static') {
            parentElement.style.position = 'relative';
        }
        // 关键：暂时禁用父容器的滚动条，防止弹窗时背景还能滚动
        const originalOverflow = parentElement.style.overflow;
        parentElement.style.overflow = 'hidden';

        // --- 2. 创建弹窗元素 ---
        const overlay = document.createElement('div');
        overlay.id = 'ai-theater-alert-overlay';
        // 我们之前设计的深色木纹弹窗样式
        overlay.innerHTML = `
            <div class="ai-theater-alert-box" style="background: #2a2a2a; color: #ffd700; border: 2px solid #5a4a2c; border-radius: 12px; box-shadow: 0 5px 25px rgba(0,0,0,0.5); width: 420px; max-width: 90%; padding: 25px 30px; text-align: center; font-size: 1.1rem;">
                <h3 style="font-size: 1.5rem; color: #ffeb8c; margin-top: 0; margin-bottom: 20px;">提示</h3>
                <p style="margin-bottom: 25px; line-height: 1.6;">${message}</p>
                <button id="ai-theater-alert-confirm-btn" style="background: transparent; border: 2px solid #7c6841; color: #ffd700; padding: 10px 40px; font-size: 1rem; font-weight: bold; border-radius: 8px; cursor: pointer;">确定</button>
            </div>
        `;

        // --- 3. 注入父容器并绑定事件 ---
        parentElement.appendChild(overlay);
        
        const confirmBtn = document.getElementById('ai-theater-alert-confirm-btn');

        // 鼠标悬停效果
        confirmBtn.onmouseover = () => { confirmBtn.style.background = '#4a3c20'; confirmBtn.style.borderColor = '#ffd700'; };
        confirmBtn.onmouseout = () => { confirmBtn.style.background = 'transparent'; confirmBtn.style.borderColor = '#7c6841'; };
        
        const closeAlert = () => {
            // 清理工作
            parentElement.removeChild(overlay);
            // 关键：恢复父容器之前的滚动条状态
            parentElement.style.overflow = originalOverflow;
            resolve();
        };
        
        confirmBtn.addEventListener('click', closeAlert);
        confirmBtn.focus();
    });
}

async function renderCloudArchiveList() {
    const listEl = document.getElementById('cloud-archive-list');
    if (!listEl) return;

    listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">正在连接云端...</p>';

    if (!cloudStorageConfig.enabled || !cloudStorageConfig.apiUrl) {
        listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">云存档未启用或服务器地址未配置。</p>';
        return;
    }

    try {
        const listResponse = await fetch(`${cloudStorageConfig.apiUrl}/api/list`);
        if (!listResponse.ok) throw new Error(`服务器响应错误: ${listResponse.status}`);
        
        const listResult = await listResponse.json();
        if (!listResult.success) throw new Error(listResult.error || '获取列表失败');
        
        const filenames = listResult.archives;

        if (filenames.length === 0) {
            listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">云端无存档。</p>';
            return;
        }

        const archiveDetailsPromises = filenames.map(async filename => {
            try {
                const dataResponse = await fetch(`${cloudStorageConfig.apiUrl}/api/load?archiveName=${encodeURIComponent(filename)}`);
                if (!dataResponse.ok) return null;
                const dataResult = await dataResponse.json();
                if (dataResult.success && dataResult.data) {
                    return {
                        filename: filename,
                        realName: dataResult.data._internalName || filename 
                    };
                }
                return { filename, realName: filename };
            } catch {
                return { filename, realName: filename };
            }
        });

        const archivesWithRealNames = (await Promise.all(archiveDetailsPromises)).filter(Boolean);
        
        listEl.innerHTML = '';
        if (archivesWithRealNames.length === 0) {
             listEl.innerHTML = '<p style="text-align:center; color:#e57373;">无法解析云端存档内容。</p>';
             return;
        }

        archivesWithRealNames.forEach(({ filename, realName }) => {
            const item = document.createElement('div');
            item.className = 'archive-selection-item';
            
            const checkboxId = `cloud-archive-checkbox-${filename.replace(/[^a-zA-Z0-9]/g, '')}`;
            
            item.innerHTML = `
                <input type="checkbox" id="${checkboxId}" data-cloud-filename="${filename}" data-cloud-realname="${realName}">
                <label for="${checkboxId}" class="archive-name">${realName}</label>
            `;
            
            const label = item.querySelector('.archive-name');
            label.style.cursor = 'pointer';
            
            label.onclick = async () => {
                const confirmLoad = await showCustomConfirm(`确定要从云端加载存档 "${realName}" 吗？\n如果本地存在同名存档，将会被覆盖。`);
                if (confirmLoad) {
                    await selectAndLoadArchive(filename);
                    document.getElementById('cloud-storage-settings-overlay').classList.remove('visible');
                }
            };

            listEl.appendChild(item);
        });

    } catch (error) {
        listEl.innerHTML = `<p style="text-align:center; color:#e57373;">无法加载云存档列表: ${error.message}</p>`;
    }
}

function addCustomFieldRow(field = {}) {
    const container = document.getElementById('custom-fields-container');
    const id = field.id || crypto.randomUUID();
    const row = document.createElement('div');
    row.className = 'custom-field-row';
    row.dataset.fieldId = id;

    row.innerHTML = `
        <input type="checkbox" class="is-enabled-toggle" title="启用/禁用" ${field.isEnabled ? 'checked' : ''}>
        <input type="text" class="custom-label-input" placeholder="显示名称" value="${field.label || ''}">
        <input type="text" class="custom-var-input" placeholder="变量名" value="${field.variableName || ''}">
        <button class="control-button delete-custom-field-btn" title="删除"><i class="fas fa-trash-alt"></i></button>
    `;
    
    container.appendChild(row);

    row.querySelector('.delete-custom-field-btn').addEventListener('click', () => {
        row.remove();
    });
}


async function fetchModelsForAITheater() {
    // 【关键】获取API配置窗口这个父容器元素
    // !!! 请将 'ai-theater-api-settings' 替换为您窗口的真实ID !!!
    // 如果没有ID，请让您的同事给这个窗口加上一个ID，这是最可靠的方式。
    const settingsWindow = document.getElementById('ai-api-config-modal'); 
    // 如果无法获取到窗口元素，直接报错，防止更深层次的错误
    if (!settingsWindow) {
        alert("错误：无法找到ID为 'ai-theater-api-settings' 的API配置窗口。");
        return;
    }
    const apiUrl = document.getElementById('api-endpoint-input').value.trim();
    const apiKey = document.getElementById('api-key-input').value.trim();
    const modelSelect = document.getElementById('api-model-select');
    const btn = document.getElementById('fetch-ai-theater-models-btn');
    if (!apiUrl || !apiKey) {
        // 【调用方式】将父容器窗口传入
        await showAITheaterAlert('请先填写 API Endpoint 和 API Key。', settingsWindow);
        return;
    }
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    try {
        // ... (您的fetch逻辑保持不变)
        const response = await fetch(`${apiUrl}/models`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        if (!response.ok) throw new Error(`API请求失败 (${response.status})`);
        const data = await response.json();
        const models = (data.data || data).map(model => model.id).filter(id => id);
        modelSelect.innerHTML = '';
        if (models.length > 0) {
            models.forEach(modelId => {
                const option = document.createElement('option');
                option.value = modelId;
                option.textContent = modelId;
                modelSelect.appendChild(option);
            });
            modelSelect.selectedIndex = 0;
            // 将父容器窗口传入
            await showAITheaterAlert(`成功获取 ${models.length} 个可用模型！`, settingsWindow);
        } else {
            await showAITheaterAlert('此API未返回任何可用模型。', settingsWindow);
        }
    } catch (error) {
        console.error('获取模型列表失败:', error);
        await showAITheaterAlert(`获取模型列表失败: ${error.message}`, settingsWindow);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    }
}



function makeDraggableAndRetractable(element, onClickCallback = null) {
    if (!element) {
        console.error("makeDraggableAndRetractable: 目标元素未找到。");
        return;
    }
    let isDragging = false;
    let hasDragged = false;
    let startX, startY;
    let offsetX, offsetY;
    const parent = element.parentElement;
    const snapThreshold = 10;
    const dragThreshold = 10;

    const dragStart = (e) => {
        if (e.target.closest('.fab-item')) {
             return;
        }
        isDragging = true;
        hasDragged = false;
        element.classList.remove('retracted-top', 'retracted-bottom', 'retracted-left', 'retracted-right');
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        startX = clientX;
        startY = clientY;
        const rect = element.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();
        offsetX = clientX - (rect.left - parentRect.left);
        offsetY = clientY - (rect.top - parentRect.top);
        element.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    };

    const dragMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const movedX = Math.abs(clientX - startX);
        const movedY = Math.abs(clientY - startY);
        if (!hasDragged && (movedX > dragThreshold || movedY > dragThreshold)) {
            hasDragged = true;
        }
        if (hasDragged) {
            const parentRect = parent.getBoundingClientRect();
            let newLeft = clientX - parentRect.left - offsetX;
            let newTop = clientY - parentRect.top - offsetY;
            newLeft = Math.max(0, Math.min(newLeft, parent.clientWidth - element.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, parent.clientHeight - element.offsetHeight));
            element.style.left = `${newLeft}px`;
            element.style.top = `${newTop}px`;
        }
    };
    
    const dragEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        element.style.cursor = 'grab';
        document.body.style.userSelect = '';
        if (!hasDragged && onClickCallback) {
            onClickCallback();
        } else {
            const finalLeft = element.offsetLeft;
            const finalTop = element.offsetTop;
            element.classList.remove('retracted-top', 'retracted-bottom', 'retracted-left', 'retracted-right');
            if (finalTop < snapThreshold) {
                element.style.top = '0px';
                element.classList.add('retracted-top');
            } else if (finalTop > parent.clientHeight - element.offsetHeight - snapThreshold) {
                element.style.top = `${parent.clientHeight - element.offsetHeight}px`;
                element.classList.add('retracted-bottom');
            } else if (finalLeft < snapThreshold) {
                element.style.left = '0px';
                element.classList.add('retracted-left');
            } else if (finalLeft > parent.clientWidth - element.offsetWidth - snapThreshold) {
                element.style.left = `${parent.clientWidth - element.offsetWidth}px`;
                element.classList.add('retracted-right');
            }
        }
    };
    
    element.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    element.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('touchmove', dragMove, { passive: false });
    document.addEventListener('touchend', dragEnd);
}

async function showAITheaterConfirm(message, parentElement, confirmText = '确定', cancelText = '取消') {
    if (!parentElement) {
        console.error('showAITheaterConfirm 錯誤：必須提供父容器元素！');
        return Promise.resolve(window.confirm(message));
    }

    return new Promise(resolve => {
        const overlay = document.createElement('div');
        overlay.id = 'ai-theater-alert-overlay';
        overlay.style.position = 'absolute';
        overlay.style.inset = '0';
        overlay.style.backgroundColor = 'rgba(10, 10, 10, 0.85)';
        overlay.style.zIndex = '1000';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';

        overlay.innerHTML = `
            <div class="ai-theater-alert-box">
                <h3>请确认</h3>
                <p>${message}</p>
                <div style="display: flex; justify-content: center; gap: 20px; margin-top: 25px;">
                    <button id="ai-theater-confirm-btn" class="splash-btn">${confirmText}</button>
                    <button id="ai-theater-cancel-btn" class="splash-btn" style="background: #555; border-color: #777;">${cancelText}</button>
                </div>
            </div>
        `;
        
        parentElement.appendChild(overlay);

        const confirmBtn = overlay.querySelector('#ai-theater-confirm-btn');
        const cancelBtn = overlay.querySelector('#ai-theater-cancel-btn');

        const closeDialog = (result) => {
            parentElement.removeChild(overlay);
            resolve(result);
        };

        confirmBtn.addEventListener('click', () => closeDialog(true));
        cancelBtn.addEventListener('click', () => closeDialog(false));
    });
}


function initAITheaterFeature() {
const dragBall = document.getElementById('ai-theater-drag-ball');
const theaterWindow = document.getElementById('ai-theater-window');
const header = theaterWindow.querySelector('.ai-theater-header');
const closeBtn = theaterWindow.querySelector('#ai-theater-close-btn');
const configBtn = theaterWindow.querySelector('#ai-theater-config-btn');
const generateBtn = document.getElementById('ai-generate-btn');
const promptInput = document.getElementById('ai-prompt-input');

const configModal = document.getElementById('ai-api-config-modal');
const endpointInput = document.getElementById('api-endpoint-input');
const keyInput = document.getElementById('api-key-input');
const modelSelect = document.getElementById('api-model-select');
const fetchModelsBtn = document.getElementById('fetch-ai-theater-models-btn');
const templateInput = document.getElementById('prompt-template-textarea');
const autoGenToggle = document.getElementById('auto-gen-theater-toggle');
const saveConfigBtn = document.getElementById('ai-api-config-save-btn');
const cancelConfigBtn = document.getElementById('ai-api-config-cancel-btn');

const dailyPaperModeToggle = document.getElementById('daily-paper-mode-toggle');
const dailyPaperPromptSection = document.getElementById('daily-paper-prompt-section');
const dailyPaperPromptTextarea = document.getElementById('daily-paper-prompt-template');

const restoreTheaterDefaultsBtn = document.getElementById('restore-theater-defaults-btn');
const restoreDailyPaperDefaultsBtn = document.getElementById('restore-daily-paper-defaults-btn');


if (!dragBall || !theaterWindow || !header) {
console.error("AI小剧场初始化失败：一个或多个关键UI元素未在HTML中找到。");
return;
}


makeDraggableAndRetractable(dragBall, () => {
// 【核心修改】点击拖拽球时，总是切换剧场窗口的显示状态
if (theaterWindow.style.display === 'flex') {
theaterWindow.style.display = 'none';
} else {
theaterWindow.style.display = 'flex';
loadLatestTheaterIntoPopup(); // 确保打开时加载最新内容
}
});

makeElementDraggable(theaterWindow, header);

function setTheaterMode(isDailyPaper) {
if (isDailyPaper) {
promptInput.placeholder = '输入日报参考新闻，或留空让AI创作...';
generateBtn.textContent = '生成日报';
dragBall.innerHTML = '<i class="fas fa-scroll"></i>';
} else {
promptInput.placeholder = '输入你的小剧场想法...';
generateBtn.textContent = '生成剧本';
dragBall.innerHTML = '<i class="fas fa-mobile-alt"></i>';
}
}

function loadConfigIntoModal() {
endpointInput.value = localStorage.getItem('theater_apiEndpoint') || 'https://api.openai.com/v1';
keyInput.value = localStorage.getItem('theater_apiKey') || '';
templateInput.value = localStorage.getItem('theater_apiPrompt') || AI_THEATER_FULL_DEFAULT_PROMPT;
autoGenToggle.checked = localStorage.getItem('theater_autoGenEnabled') === 'true';

const isDailyPaper = localStorage.getItem('theater_isDailyPaperMode') === 'true';
dailyPaperModeToggle.checked = isDailyPaper;
dailyPaperPromptTextarea.value = localStorage.getItem('theater_dailyPaperPrompt') || DEFAULT_DAILY_PAPER_PROMPT;
dailyPaperPromptSection.classList.toggle('hidden', !isDailyPaper);

setTheaterMode(isDailyPaper);

const savedModel = localStorage.getItem('theater_apiModel');
const modelOptions = Array.from(modelSelect.options).map(opt => opt.value);
if (savedModel && !modelOptions.includes(savedModel)) {
modelSelect.add(new Option(savedModel, savedModel, true, true));
} else if (savedModel) {
modelSelect.value = savedModel;
}
}

async function saveAITheaterConfig() {
localStorage.setItem('theater_apiEndpoint', endpointInput.value.trim());
localStorage.setItem('theater_apiKey', keyInput.value.trim());
localStorage.setItem('theater_apiModel', modelSelect.value);
localStorage.setItem('theater_apiPrompt', templateInput.value.trim());
localStorage.setItem('theater_autoGenEnabled', autoGenToggle.checked);
localStorage.setItem('theater_isDailyPaperMode', dailyPaperModeToggle.checked);
localStorage.setItem('theater_dailyPaperPrompt', dailyPaperPromptTextarea.value.trim());

setTheaterMode(dailyPaperModeToggle.checked);

await showAITheaterAlert('AI小剧场配置已保存！', configModal);
configModal.style.display = 'none';
}

restoreTheaterDefaultsBtn.addEventListener('click', async () => {
if (await showAITheaterConfirm('确定要恢复小剧场的默认指令模板吗？当前编辑的内容将被覆盖。', configModal)) {
templateInput.value = AI_THEATER_FULL_DEFAULT_PROMPT;
await showAITheaterAlert('已恢复小剧场默认模板！', configModal);
}
});

restoreDailyPaperDefaultsBtn.addEventListener('click', async () => {
if (await showAITheaterConfirm('确定要恢复日报的默认指令模板吗？当前编辑的内容将被覆盖。', configModal)) {
dailyPaperPromptTextarea.value = DEFAULT_DAILY_PAPER_PROMPT;
await showAITheaterAlert('已恢复日报默认模板！', configModal);
}
});

dailyPaperModeToggle.addEventListener('change', () => {
const isDailyPaper = dailyPaperModeToggle.checked;
dailyPaperPromptSection.classList.toggle('hidden', !isDailyPaper);
setTheaterMode(isDailyPaper);
});

closeBtn.addEventListener('click', () => theaterWindow.style.display = 'none');
generateBtn.addEventListener('click', generateAITheater);

configBtn.addEventListener('click', () => {
loadConfigIntoModal();
configModal.style.display = 'flex';
});

saveConfigBtn.addEventListener('click', saveAITheaterConfig);
cancelConfigBtn.addEventListener('click', () => configModal.style.display = 'none');

fetchModelsBtn.addEventListener('click', function() {
fetchModelsForPanel('api-endpoint-input', 'api-key-input', 'api-model-select', this);
});

loadConfigIntoModal();

console.log("AI小剧场功能已成功挂载！");
}


	let tokenizer; // 将 tokenizer 声明为全局变量
	let thinkingListenersSetup = false;

const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/gpt-tokenizer@2.1.2/browser.min.js';
script.onload = () => {
    // 当库加载完成后，才进行初始化
    try {
        tokenizer = gptTokenizer.getEncoding("cl100k_base");
        console.log("Tokenizer initialized successfully.");
    } catch (e) {
        console.error("Failed to initialize tokenizer:", e);
    }
};
script.onerror = () => {
    console.error("Failed to load gpt-tokenizer script.");
};
document.head.appendChild(script);
        const playerName = "我";
        const chatIdentifier = "";
        const ACTIVE_ARCHIVE_KEY = 'CULTIVATION_ACTIVE_ARCHIVE_V1';
        const SUMMARY_CONFIG_KEY = 'CULTIVATION_SUMMARY_CONFIG_V1';
        const REGEX_CONFIG_KEY = 'CULTIVATION_REGEX_CONFIG_V2';
        const CUSTOM_TRAITS_KEY = 'CULTIVATION_CUSTOM_TRAITS_V1';
        const CUSTOM_BIRTHS_KEY = 'CULTIVATION_CUSTOM_BIRTHS_V1';
        const CUSTOM_RACES_KEY = 'CULTIVATION_CUSTOM_RACES_V1';
        const CUSTOM_BONDED_CHARS_KEY = 'CULTIVATION_BONDED_CHARS_V1';
        const FUN_SETTINGS_KEY = 'CULTIVATION_FUN_SETTINGS_V1';
        const CHAT_BACKGROUND_KEY = 'CULTIVATION_CHAT_BACKGROUND_V1';
        const FAB_SHORTCUTS_KEY = 'CULTIVATION_FAB_SHORTCUTS_V1';
        const DINO_GAME_HIGHSCORE_KEY = 'CULTIVATION_DINO_GAME_HIGHSCORE_V1';
        const CUSTOM_AVATAR_KEY = 'CULTIVATION_CUSTOM_AVATAR_V1';
        const NPC_AVATARS_KEY = 'CULTIVATION_NPC_AVATARS_V1';
        const CHARACTER_TEMPLATES_KEY = 'CULTIVATION_CHAR_TEMPLATES_V1';
        const CUSTOM_AFFIXES_KEY = 'CULTIVATION_CUSTOM_AFFIXES_V1';
        const ATTRIBUTE_ALIGNMENT_KEY = 'CULTIVATION_ATTR_ALIGNMENT_V1';
        const SEEN_FEATURES_KEY = 'CULTIVATION_SEEN_FEATURES_V1';
        const TIME_LOCATION_ROW_ID = "TIME_LOCATION_ROW";
        const BUILT_IN_ACHIEVEMENTS = [
// 基础成长类 (10个)
{
id: "ACH100",
name: "初入仙途",
description: "成功创建第一个存档，踏上修仙之路。",
completionText: "仙途漫漫，道阻且长，但你已迈出第一步！",
quality: "普通",
requirement: { type: "system_event", event: "archive_created" },
reward: {
type: "item",
command: `set({"0":"I100","1":"新手礼包","2":"重要物品","3":"内含一些新手资源。","4":"无","5":"1"})`,
description: "获得新手礼包"
}
},
{
id: "ACH101",
name: "炼气小成",
description: "成功突破到炼气期。",
completionText: "凡人躯，炼气成！",
quality: "普通",
requirement: { type: "player_attr", key: "境界", value: "炼气期" },
reward: {
type: "item",
command: `set({"0":"I101","1":"炼气丹","2":"消耗品","3":"炼气期修士服用的丹药。","4":"加快炼气期修炼速度","5":"3"})`,
description: "获得炼气丹 x3"
}
},
{
id: "ACH102",
name: "筑基有成",
description: "成功突破到筑基期。",
completionText: "筑基成功，仙道可期！",
quality: "稀有",
requirement: { type: "player_attr", key: "境界", value: "筑基期" },
reward: {
type: "item",
command: `set({"0":"I102","1":"筑基丹","2":"消耗品","3":"筑基期修士服用的丹药。","4":"稳固筑基境界","5":"1"})`,
description: "获得筑基丹 x1"
}
},
{
id: "ACH103",
name: "初窥丹道",
description: "成功炼制出第一颗丹药。",
completionText: "丹药初成，药香四溢！",
quality: "普通",
requirement: { type: "system_event", event: "alchemy_success" },
reward: {
type: "skill",
command: `set({"0":"S100","1":"初级炼丹术","2":"入门","3":"辅助技能","4":"炼丹基础手法。","5":"炼丹成功率+2%","6":"无师自通","7":"0/100","8":"无"})`,
description: "获得技能：初级炼丹术"
}
},
{
id: "ACH104",
name: "神兵小试",
description: "成功炼制出第一件法宝。",
completionText: "神兵在手，天下我有！",
quality: "普通",
requirement: { type: "system_event", event: "refining_success" },
reward: {
type: "skill",
command: `set({"0":"S101","1":"初级炼器术","2":"入门","3":"辅助技能","4":"炼器基础手法。","5":"炼器成功率+2%","6":"无师自通","7":"0/100","8":"无"})`,
description: "获得技能：初级炼器术"
}
},
{
id: "ACH105",
name: "灵兽初伴",
description: "成功驯服第一只灵兽。",
completionText: "灵兽相伴，仙途不孤！",
quality: "普通",
requirement: { type: "player_has_beast", count: "1" },
reward: {
type: "item",
command: `set({"0":"I105","1":"灵兽口粮","2":"消耗品","3":"灵兽喜爱的食物。","4":"提升灵兽好感度","5":"5"})`,
description: "获得灵兽口粮 x5"
}
},
{
id: "ACH106",
name: "技能入门",
description: "学会5个以上技能。",
completionText: "万般法术，皆为我用！",
quality: "普通",
requirement: { type: "player_has_skill_count", count: "5" },
reward: {
type: "item",
command: `set({"0":"I106","1":"技能感悟石","2":"消耗品","3":"可帮助修士感悟技能。","4":"提升随机技能熟练度10%","5":"1"})`,
description: "获得技能感悟石 x1"
}
},
{
id: "ACH107",
name: "小有财富",
description: "拥有1000灵石。",
completionText: "灵石在手，小富即安！",
quality: "普通",
requirement: { type: "player_attr", key: "灵石", value: "1000" },
reward: {
type: "item",
command: `set({"0":"I107","1":"下品灵石","2":"消耗品","3":"修仙界通用货币。","4":"无","5":"100"})`,
description: "获得下品灵石 x100"
}
},
{
id: "ACH108",
name: "初探世界",
description: "探索世界地图上的3个不同主疆域。",
completionText: "世界之大，尽在脚下！",
quality: "普通",
requirement: { type: "player_exploration", count: "3" },
reward: {
type: "item",
command: `set({"0":"I108","1":"简易地图","2":"重要物品","3":"记录了部分区域的地图。","4":"解锁部分地图区域","5":"1"})`,
description: "获得简易地图"
}
},
{
id: "ACH109",
name: "善念萌芽",
description: "善恶值达到100以上。",
completionText: "行善积德，功德无量！",
quality: "普通",
requirement: { type: "player_attr", key: "善恶值", value: "100" },
reward: {
type: "item",
command: `set({"0":"I109","1":"功德符","2":"消耗品","3":"蕴含功德之力。","4":"提升少量善恶值","5":"1"})`,
description: "获得功德符"
}
},

// 进阶成长类 (10个)
{
id: "ACH110",
name: "结丹大道",
description: "成功突破到结丹期。",
completionText: "金丹凝结，大道可期！",
quality: "稀有",
requirement: { type: "player_attr", key: "境界", value: "结丹" },
reward: {
type: "item",
command: `set({"0":"I110","1":"结金丹","2":"消耗品","3":"结丹期修士服用的丹药。","4":"稳固结丹境界","5":"1"})`,
description: "获得结金丹 x1"
}
},
{
id: "ACH111",
name: "元婴初凝",
description: "成功突破到元婴期。",
completionText: "元婴初成，仙道可期！",
quality: "史诗",
requirement: { type: "player_attr", key: "境界", value: "元婴" },
reward: {
type: "item",
command: `set({"0":"I111","1":"元婴丹","2":"消耗品","3":"元婴期修士服用的丹药。","4":"稳固元婴境界","5":"1"})`,
description: "获得元婴丹 x1"
}
},
{
id: "ACH112",
name: "富甲一方",
description: "拥有10000灵石。",
completionText: "灵石在手，天下我有！",
quality: "稀有",
requirement: { type: "player_attr", key: "灵石", value: "10000" },
reward: {
type: "item",
command: `set({"0":"I112","1":"中品灵石","2":"消耗品","3":"修仙界通用货币。","4":"无","5":"100"})`,
description: "获得中品灵石 x100"
}
},
{
id: "ACH113",
name: "丹道小成",
description: "炼制出10颗丹药。",
completionText: "丹道小成，药香扑鼻！",
quality: "稀有",
requirement: { type: "variable", table: "1", id: "I101", col: "5", value: "10" }, // 假设I101是某种丹药
reward: {
type: "item",
command: `set({"0":"I113","1":"炼丹心得","2":"重要物品","3":"记录了炼丹经验。","4":"提升炼丹成功率","5":"1"})`,
description: "获得炼丹心得"
}
},
{
id: "ACH114",
name: "器道小成",
description: "炼制出5件法宝。",
completionText: "器道小成，神兵初现！",
quality: "稀有",
requirement: { type: "variable", table: "1", id: "I104", col: "5", value: "5" }, // 假设I104是某种法宝
reward: {
type: "item",
command: `set({"0":"I114","1":"炼器手札","2":"重要物品","3":"记录了炼器经验。","4":"提升炼器成功率","5":"1"})`,
description: "获得炼器手札"
}
},
{
id: "ACH115",
name: "驭兽师",
description: "拥有3只以上灵兽。",
completionText: "万兽臣服，莫敢不从！",
quality: "稀有",
requirement: { type: "player_has_beast", count: "3" },
reward: {
type: "item",
command: `set({"0":"I115","1":"驭兽诀","2":"功法","3":"驭兽基础秘术。","4":"提升驯服灵兽成功率","5":"1"})`,
description: "获得功法：驭兽诀"
}
},
{
id: "ACH116",
name: "知己一二",
description: "与一名异性NPC的好感度达到30以上。",
completionText: "得一知己，夫复何求？",
quality: "普通",
requirement: { type: "npc_favorability", gender: "异性", value: "30" },
reward: {
type: "item",
command: `set({"0":"I116","1":"定情信物","2":"重要物品","3":"象征情谊的信物。","4":"提升异性NPC好感度","5":"1"})`,
description: "获得定情信物"
}
},
{
id: "ACH117",
name: "恶名昭彰",
description: "善恶值达到-100以下。",
completionText: "杀戮成性，魔威盖世！",
quality: "普通",
requirement: { type: "player_attr", key: "善恶值", value: "-100" },
reward: {
type: "item",
command: `set({"0":"I117","1":"魔气石","2":"消耗品","3":"蕴含魔气。","4":"提升少量魔道功法威力","5":"1"})`,
description: "获得魔气石"
}
},
{
id: "ACH118",
name: "寿元绵长",
description: "寿元达到200以上。",
completionText: "寿与天齐，道法自然！",
quality: "稀有",
requirement: { type: "player_attr", key: "寿元", value: "200" },
reward: {
type: "item",
command: `set({"0":"I118","1":"小延寿丹","2":"消耗品","3":"可增加少量寿元。","4":"增加寿元10年","5":"1"})`,
description: "获得小延寿丹"
}
},
{
id: "ACH119",
name: "初获奇遇",
description: "获得稀有品质的词条。",
completionText: "天道垂青，气运加身！",
quality: "稀有",
requirement: { type: "player_has_trait_rarity", rarity: "稀有" },
reward: {
type: "item",
command: `set({"0":"I119","1":"小气运符","2":"消耗品","3":"蕴含微弱气运。","4":"提升少量气运","5":"1"})`,
description: "获得小气运符"
}
},

// 挑战与探索类 (10个)
{
id: "ACH120",
name: "百战不殆",
description: "累计死亡3次。",
completionText: "百死不悔，道心弥坚！",
quality: "稀有",
requirement: { type: "player_death_count", count: "3" },
reward: {
type: "trait",
command: `add("B1", {"9": {"traits": [{"name":"百折不挠","desc":"经历死亡，道心坚定。","effects":"每次复活后获得临时属性提升","bonus":{"物攻":1,"法攻":1},"rarity":"普通"}]}})`,
description: "获得气运：百折不挠"
}
},
{
id: "ACH121",
name: "极限生存",
description: "在极限模式下，血量低于20%时成功击败敌人。",
completionText: "置之死地而后生！",
quality: "稀有",
requirement: { type: "system_event_extreme", event: "low_hp_victory" },
reward: {
type: "item",
command: `set({"0":"I121","1":"疗伤丹","2":"消耗品","3":"可在危急时刻恢复生命。","4":"恢复少量生命","5":"1"})`,
description: "获得疗伤丹"
}
},
{
id: "ACH122",
name: "初探险地",
description: "AI回复包含关键词“秘境”或“遗迹”。",
completionText: "险地初探，机遇与挑战并存！",
quality: "普通",
requirement: { type: "ai_response", keyword: "秘境" },
reward: {
type: "item",
command: `set({"0":"I122","1":"寻路符","2":"消耗品","3":"可指引方向。","4":"无","5":"1"})`,
description: "获得寻路符"
}
},
{
id: "ACH123",
name: "一念成魔",
description: "在极限模式下，善恶值达到-200。",
completionText: "心魔滋生，堕入魔道！",
quality: "稀有",
requirement: { type: "player_attr_extreme", key: "善恶值", value: "-200" },
reward: {
type: "trait",
command: `add("B1", {"9": {"traits": [{"name":"心魔滋生","desc":"内心被心魔侵蚀。","effects":"魔道功法威力提升，但易受心魔反噬","bonus":{"法攻":2,"神识":-1},"rarity":"负面状态"}]}})`,
description: "获得气运：心魔滋生"
}
},
{
id: "ACH124",
name: "区域掌控",
description: "探索世界地图上的5个不同主疆域。",
completionText: "足迹遍布，区域掌控！",
quality: "稀有",
requirement: { type: "player_exploration", count: "5" },
reward: {
type: "item",
command: `set({"0":"I124","1":"区域地图","2":"重要物品","3":"记录了更多区域的地图。","4":"解锁更多地图区域","5":"1"})`,
description: "获得区域地图"
}
},
{
id: "ACH125",
name: "小有声望",
description: "与一名异性NPC的好感度达到50以上。",
completionText: "声望渐起，名扬四方！",
quality: "稀有",
requirement: { type: "npc_favorability", gender: "异性", value: "50" },
reward: {
type: "item",
command: `set({"0":"I125","1":"名帖","2":"重要物品","3":"可用于拜访特定NPC。","4":"提升NPC初次好感","5":"1"})`,
description: "获得名帖"
}
},
{
id: "ACH126",
name: "功德加身",
description: "善恶值达到500以上。",
completionText: "行善积德，功德圆满！",
quality: "稀有",
requirement: { type: "player_attr", key: "善恶值", value: "500" },
reward: {
type: "item",
command: `set({"0":"I126","1":"功德金光","2":"消耗品","3":"蕴含功德之力。","4":"抵御一次邪祟入侵","5":"1"})`,
description: "获得功德金光"
}
},
{
id: "ACH127",
name: "技能精通",
description: "学会10个以上技能。",
completionText: "万般法术，皆为我用！",
quality: "稀有",
requirement: { type: "player_has_skill_count", count: "10" },
reward: {
type: "item",
command: `set({"0":"I127","1":"高级技能感悟石","2":"消耗品","3":"可帮助修士感悟技能。","4":"提升随机技能熟练度20%","5":"1"})`,
description: "获得高级技能感悟石 x1"
}
},
{
id: "ACH128",
name: "灵兽群落",
description: "拥有5只以上灵兽。",
completionText: "灵兽成群，助我修行！",
quality: "稀有",
requirement: { type: "player_has_beast", count: "5" },
reward: {
type: "item",
command: `set({"0":"I128","1":"灵兽袋","2":"法宝","3":"可容纳多只灵兽。","4":"增加灵兽携带上限","5":"1"})`,
description: "获得灵兽袋"
}
},
{
id: "ACH129",
name: "寿与天齐",
description: "寿元达到500以上。",
completionText: "寿与天齐，道法自然！",
quality: "史诗",
requirement: { type: "player_attr", key: "寿元", value: "500" },
reward: {
type: "item",
command: `set({"0":"I129","1":"延寿丹","2":"消耗品","3":"可增加修士寿元。","4":"增加寿元50年","5":"1"})`,
description: "获得延寿丹"
}
},

// 终极挑战类 (10个)
{
id: "ACH130",
name: "化神之境",
description: "成功突破到化神期。",
completionText: "化神成功，天地共鸣！",
quality: "史诗",
requirement: { type: "player_attr", key: "境界", value: "化神期" },
reward: {
type: "item",
command: `set({"0":"I130","1":"化神丹","2":"消耗品","3":"化神期修士服用的丹药。","4":"稳固化神境界","5":"1"})`,
description: "获得化神丹 x1"
}
},
{
id: "ACH131",
name: "富可敌国",
description: "拥有100000灵石。",
completionText: "金山银海，富可敌国！",
quality: "史诗",
requirement: { type: "player_attr", key: "灵石", value: "100000" },
reward: {
type: "item",
command: `set({"0":"I131","1":"上品灵石","2":"消耗品","3":"修仙界通用货币。","4":"无","5":"100"})`,
description: "获得上品灵石 x100"
}
},
{
id: "ACH132",
name: "世界探索者",
description: "探索世界地图上的所有主疆域。",
completionText: "踏遍万水千山，世界尽在掌握！",
quality: "史诗",
requirement: { type: "player_exploration_all_main_regions" },
reward: {
type: "item",
command: `set({"0":"I132","1":"世界之心碎片","2":"重要物品","3":"蕴含世界本源之力。","4":"提升对世界法则的感悟速度","5":"1"})`,
description: "获得世界之心碎片"
}
},
{
id: "ACH133",
name: "神迹加身",
description: "获得神迹品质的词条。",
completionText: "天道垂青，气运加身！",
quality: "神迹",
requirement: { type: "player_has_trait_rarity", rarity: "神迹" },
reward: {
type: "item",
command: `set({"0":"I133","1":"天道碎片","2":"重要物品","3":"蕴含一丝天道法则。","4":"提升功法领悟速度","5":"1"})`,
description: "获得天道碎片"
}
},
{
id: "ACH134",
name: "万法归宗",
description: "学会20个以上技能。",
completionText: "万般法术，皆为我用！",
quality: "史诗",
requirement: { type: "player_has_skill_count", count: "20" },
reward: {
type: "item",
command: `set({"0":"I134","1":"宗师技能感悟石","2":"消耗品","3":"可帮助修士感悟技能。","4":"提升随机技能熟练度50%","5":"1"})`,
description: "获得宗师技能感悟石 x1"
}
},
{
id: "ACH135",
name: "驭兽宗师",
description: "拥有10只以上灵兽。",
completionText: "万兽臣服，莫敢不从！",
quality: "史诗",
requirement: { type: "player_has_beast", count: "10" },
reward: {
type: "item",
command: `set({"0":"I135","1":"高级驭兽诀","2":"功法","3":"高级驭兽秘术。","4":"提升驯服灵兽成功率","5":"1"})`,
description: "获得功法：高级驭兽诀"
}
},
{
id: "ACH136",
name: "情深义重",
description: "与一名异性NPC的好感度达到100。",
completionText: "情深义重，此生不悔！",
quality: "史诗",
requirement: { type: "npc_favorability", gender: "异性", value: "100" },
reward: {
type: "item",
command: `set({"0":"I136","1":"同心结","2":"重要物品","3":"象征永恒情谊的同心结。","4":"提升异性NPC好感度","5":"1"})`,
description: "获得同心结"
}
},
{
id: "ACH137",
name: "魔道巨擘",
description: "善恶值达到-1000以下。",
completionText: "杀戮成性，魔威盖世！",
quality: "史诗",
requirement: { type: "player_attr", key: "善恶值", value: "-1000" },
reward: {
type: "item",
command: `set({"0":"I137","1":"魔心血玉","2":"重要物品","3":"蕴含魔气。","4":"魔道功法威力提升10%","5":"1"})`,
description: "获得魔心血玉"
}
},
{
id: "ACH138",
name: "涅槃重生",
description: "累计死亡10次。",
completionText: "百死不悔，道心弥坚！",
quality: "传说",
requirement: { type: "player_death_count", count: "10" },
reward: {
type: "trait",
command: `add("B1", {"9": {"traits": [{"name":"涅槃之体","desc":"经历无数次死亡，你的身体变得更加坚韧。","effects":"每次复活后获得临时属性提升","bonus":{"物防":5,"法防":5},"rarity":"稀有"}]}})`,
description: "获得气运：涅槃之体"
}
},
{
id: "ACH139",
name: "极限挑战者",
description: "在极限模式下，善恶值达到-500。",
completionText: "挑战极限，突破自我！",
quality: "史诗",
requirement: { type: "player_attr_extreme", key: "善恶值", value: "-500" },
reward: {
type: "item",
command: `set({"0":"I139","1":"极限意志","2":"重要物品","3":"极限模式下磨砺出的意志。","4":"提升极限模式下的生存能力","5":"1"})`,
description: "获得极限意志"
}
},

// 额外成就 (10个)
{
id: "ACH140",
name: "初次交流",
description: "AI回复包含关键词“道友”或“仙子”。",
completionText: "仙途漫漫，结识道友！",
quality: "普通",
requirement: { type: "ai_response", keyword: "道友" },
reward: {
type: "item",
command: `set({"0":"I140","1":"传音符","2":"消耗品","3":"可与千里之外的修士传音。","4":"与指定NPC远程交流","5":"1"})`,
description: "获得传音符 x1"
}
},
{
id: "ACH141",
name: "初次交易",
description: "AI回复包含关键词“灵石”或“坊市”。",
completionText: "买卖有道，互通有无！",
quality: "普通",
requirement: { type: "ai_response", keyword: "坊市" },
reward: {
type: "item",
command: `set({"0":"I141","1":"下品灵石","2":"消耗品","3":"修仙界通用货币。","4":"无","5":"50"})`,
description: "获得下品灵石 x50"
}
},
{
id: "ACH142",
name: "初次战斗",
description: "AI回复包含关键词“战斗”或“击败”。",
completionText: "初次交锋，胜负已分！",
quality: "普通",
requirement: { type: "ai_response", keyword: "战斗" },
reward: {
type: "item",
command: `set({"0":"I142","1":"疗伤药","2":"消耗品","3":"可恢复少量伤势。","4":"恢复少量生命","5":"1"})`,
description: "获得疗伤药 x1"
}
},
{
id: "ACH143",
name: "初次突破",
description: "AI回复包含关键词“突破”或“进阶”。",
completionText: "瓶颈已破，更进一步！",
quality: "普通",
requirement: { type: "ai_response", keyword: "突破" },
reward: {
type: "item",
command: `set({"0":"I143","1":"小瓶颈丹","2":"消耗品","3":"可助突破小瓶颈。","4":"提升突破成功率","5":"1"})`,
description: "获得小瓶颈丹 x1"
}
},
{
id: "ACH144",
name: "初次奇遇",
description: "AI回复包含关键词“奇遇”或“机缘”。",
completionText: "天降机缘，仙运亨通！",
quality: "稀有",
requirement: { type: "ai_response", keyword: "奇遇" },
reward: {
type: "item",
command: `set({"0":"I144","1":"寻宝符","2":"消耗品","3":"可感应附近宝物。","4":"无","5":"1"})`,
description: "获得寻宝符 x1"
}
},
{
id: "ACH145",
name: "初次死亡",
description: "累计死亡1次。",
completionText: "道阻且长，重头再来！",
quality: "普通",
requirement: { type: "player_death_count", count: "1" },
reward: {
type: "item",
command: `set({"0":"I145","1":"复活丹","2":"消耗品","3":"可原地复活一次。","4":"原地复活","5":"1"})`,
description: "获得复活丹 x1"
}
},
{
id: "ACH146",
name: "初次顿悟",
description: "AI回复包含关键词“顿悟”或“感悟”。",
completionText: "天道昭昭，顿悟玄机！",
quality: "稀有",
requirement: { type: "ai_response", keyword: "顿悟" },
reward: {
type: "item",
command: `set({"0":"I146","1":"悟道茶","2":"消耗品","3":"可助修士悟道。","4":"提升功法领悟速度","5":"1"})`,
description: "获得悟道茶 x1"
}
},
{
id: "ACH147",
name: "初次受伤",
description: "玩家血量低于50%。",
completionText: "道体有损，需加疗养！",
quality: "普通",
requirement: { type: "player_attr", key: "血量", value: "50" }, // 假设血量是player_attr
reward: {
type: "item",
command: `set({"0":"I147","1":"止血散","2":"消耗品","3":"可快速止血。","4":"恢复少量生命","5":"2"})`,
description: "获得止血散 x2"
}
},
{
id: "ACH148",
name: "初次炼丹成功",
description: "成功炼制出1颗丹药。",
completionText: "炉火纯青，丹香四溢！",
quality: "普通",
requirement: { type: "system_event", event: "alchemy_success" },
reward: {
type: "item",
command: `set({"0":"I148","1":"丹炉","2":"法宝","3":"简易炼丹炉。","4":"提升炼丹成功率","5":"1"})`,
description: "获得丹炉"
}
},
{
id: "ACH149",
name: "初次炼器成功",
description: "成功炼制出1件法宝。",
completionText: "巧夺天工，器成惊世！",
quality: "普通",
requirement: { type: "system_event", event: "refining_success" },
reward: {
type: "item",
command: `set({"0":"I149","1":"炼器锤","2":"法宝","3":"简易炼器锤。","4":"提升炼器成功率","5":"1"})`,
description: "获得炼器锤"
}
}
];
		    const WORKSHOP_KEY = 'CULTIVATION_WORKSHOP_KEY_V1';
			const WORKSHOP_CACHE_KEY = 'CULTIVATION_WORKSHOP_CACHE_V1';
			
			    const SPLASH_VIDEOS = [
'https://s3plus.meituan.net/opapisdk/op_ticket_885190757_1752805008624_qdqqd_3tw59r.mp4',
'https://s3plus.meituan.net/opapisdk/op_ticket_1_885190757_1760867285203_qdqqd_9nwpsg.mp4',
'https://s3plus.meituan.net/opapisdk/op_ticket_1_885190757_1760867291467_qdqqd_ekpjq6.mp4',
'https://s3plus.meituan.net/opapisdk/op_ticket_1_885190757_1761326272374_qdqqd_fp5p5b.mp4',
'https://s3plus.meituan.net/opapisdk/op_ticket_1_885190757_1761326277923_qdqqd_zr1vwl.mp4',
'https://s3plus.meituan.net/opapisdk/op_ticket_1_885190757_1761326284029_qdqqd_1qlz8q.mp4'
];


const categoryConfig = {
preset: { dbKey: null, name: '开局预设' },
birth: { dbKey: CUSTOM_BIRTHS_KEY, name: '自定义出身' },
race: { dbKey: CUSTOM_RACES_KEY, name: '自定义种族' },
trait: { dbKey: CUSTOM_TRAITS_KEY, name: '自定义词条' },
bondedCharacter: { dbKey: CUSTOM_BONDED_CHARS_KEY, name: '羁绊人物' },
world_book: { dbKey: null, name: '世界书' }
};
  
			initAITheaterFeature(); // <--- 将这行代码添加到这里
		const EventType = {
    GENERATE_IMAGE_REQUEST: 'generate-image-request',
    GENERATE_IMAGE_RESPONSE: 'generate-image-response',
};

const DEFAULT_API_PROMPT_TEMPLATE = `# Role: AI Drawing Prompt Engineer

你是一个专为AI绘画工具生成提示词的精密程序。你的任务是遵循严格的逻辑和格式要求，将输入信息转化为一个高质量的英文绘画提示词。

## Workflow:
1.  Analyze Inputs: 深入分析并整合以下三部分信息：【规则文件】中的风格构图指令、【当前游戏状态】中的角色与场景元素，以及【最新剧情片段】中的动态事件和氛围。
2.  Extract Visual Core: 从整合的信息中，提炼出所有关键的视觉要素，包括但不限于：
    -   主体 (Subject): 人物（外貌、表情、姿态）、物体。
    -   动作 (Action): 正在发生的行为。
    -   环境 (Setting): 地点、背景、天气。
    -   氛围 (Mood/Atmosphere): 光照（如cinematic lighting）、色调、情绪感。
    -   构图 (Composition): 视角（如dynamic angle）、景别（如full body）。
    -   风格 (Style): 艺术风格（如anime, realistic, oil painting）。
3.  Construct & Translate: 将这些视觉要素组合成一个连贯的画面描述，并将其精准地翻译成简练、地道的英文关键词（tags）。
4.  Final Output: 按照下方【输出规则】生成最终的提示词。

---
## Inputs:
### 【规则文件】:
\${json_context}
---
### 【当前游戏状态】:
\${state_snapshot}
---
### 【最新剧情片段】:
\${text}
---

## 输出规则 (ABSOLUTE & STRICT):
-   ONLY output the English prompt string.
-   Format: Comma-separated tags.
-   Length: No more than 75 tags.
-   DO NOT include any explanations, titles, markdown formatting, quotation marks, or any non-English characters. Your entire response must be the prompt itself, ready to be copied directly into an AI art generator.
`;


	const CUSTOM_MAP_COLORS_KEY = 'CULTIVATION_CUSTOM_MAP_COLORS_V1';
	const REGEX_PRESETS_KEY = 'CULTIVATION_REGEX_PRESETS_V1';
	const npcImageGenOverlay = document.getElementById('npc-image-gen-overlay');
	const API_BASE_URL = 'https://my-workshop-api-omega.vercel.app'; 


        const PLACEMENT_MAP = {
            USER_INPUT: 0,
            AI_OUTPUT: 2,
            WORLD_INFO: 4,
            REASONING: 5,
	    PROMPT_HISTORY: 6,
        };

let workshopPaginationState = { preset: 1, birth: 1, race: 1, trait: 1, bondedCharacter: 1, world_book: 1 };
let workshopSortBy = 'createdAt';
let workshopSearchTerm = '';
let workshopCurrentCategory = 'preset'; 

const WORKSHOP_PAGE_SIZE = 10;

    const realmToVideoMap = {
        "凡人": {
            "男性": "https://s3plus.meituan.net/opapisdk/op_ticket_885190757_1752929896594_qdqqd_e7etbg.mp4",
            "女性": "https://s3plus.meituan.net/opapisdk/op_ticket_885190757_1752929931109_qdqqd_zzhdnf.mp4"
        },
        "炼气": {
            "男性": "https://s3plus.meituan.net/opapisdk/op_ticket_885190757_1752929957290_qdqqd_r0tvso.mp4",
            "女性": "https://s3plus.meituan.net/opapisdk/op_ticket_885190757_1752929974036_qdqqd_m1n07p.mp4"
        },
        "筑基": {
            "男性": "https://s3plus.meituan.net/opapisdk/op_ticket_885190757_1752930000275_qdqqd_b22iee.mp4",
            "女性": "https://s3plus.meituan.net/opapisdk/op_ticket_885190757_1752930027380_qdqqd_64e1fz.mp4"
        },
        "结丹": {
            "男性": "https://s3plus.meituan.net/opapisdk/op_ticket_885190757_1752930044683_qdqqd_n0jru4.mp4",
            "女性": "https://s3plus.meituan.net/opapisdk/op_ticket_885190757_1752930061995_qdqqd_h4e40b.mp4"
        },
        "元婴": {
            "男性": "https://s3plus.meituan.net/opapisdk/op_ticket_885190757_1752930079983_qdqqd_3c2n79.mp4",
            "女性": "https://s3plus.meituan.net/opapisdk/op_ticket_885190757_1752930096307_qdqqd_7x8cgb.mp4"
        },
        "化神": {
            "男性": "https://s3plus.meituan.net/opapisdk/op_ticket_885190757_1752930113179_qdqqd_3wnbhs.mp4",
            "女性": "https://s3plus.meituan.net/opapisdk/op_ticket_885190757_1752930128362_qdqqd_l6vma1.mp4"
        },
        "default": {
            "男性": "https://s3plus.meituan.net/opapisdk/op_ticket_885190757_1752929896594_qdqqd_e7etbg.mp4",
            "女性": "https://s3plus.meituan.net/opapisdk/op_ticket_885190757_1752929931109_qdqqd_zzhdnf.mp4"
        }
    };
    
    const itemIconMap = {
        '默认': 'fa-question-circle', '消耗品': 'fa-pills', '护甲': 'fa-shield-alt', '功法': 'fa-book',
        '法宝': 'fa-gem', '重要物品': 'fa-star', '其他物品': 'fa-box', '武器': 'fa-khanda', '材料': 'fa-leaf',
        '灵兽': 'fa-dragon', '技能': 'fa-bolt', '人物': 'fa-user'
    };

    const FONT_MAP = {
        "默认": "'Noto Serif SC', serif",
        "楷体": "'KaiTi', 'STKaiti', serif",
        "宋体": "'SimSun', 'STSong', serif",
        "隶书": "'LiSu', 'STLiSu', serif",
        "行楷": "'Zhi Mang Xing', cursive"
    };
    
    const LEVEL_COLORS = { '凡人': '#757575', '炼气': '#66BB6A', '筑基': '#42A5F5', '结丹': '#AB47BC', '元婴': '#FFA726', '化神': '#EF5350', 'default': '#757575' };


    const DEFAULT_WORLD_MAP_DATA = {
width: 3200,
height: 4000,
terrains: [
{ name: '灵界大陆', type: 'land', color: 'rgba(188, 170, 144, 0.8)', points: [[0, 0], [3200, 0], [3200, 1800], [0, 1800]] },
{ name: '空间乱流', type: 'turbulence', color: 'rgba(75, 0, 130, 0.6)', points: [[0, 1800], [3200, 1800], [3200, 2000], [0, 2000]] },
{ name: '人界大陆', type: 'land', color: 'rgba(139, 119, 102, 0.7)', points: [[0, 2000], [3200, 2000], [3200, 4000], [0, 4000]] },
],
main_regions: [
// --- 灵界 ---
{ name: '风元大陆', points: [[50, 50], [1550, 50], [1550, 1750], [50, 1750]], description: '灵界核心大陆之一，人族、妖族等多种族混居，地域辽阔，强者如云。', color: '#A9A9A9' },
{ name: '雷鸣大陆', points: [[1650, 50], [3150, 50], [3150, 850], [1650, 850]], description: '灵界另一大族，角蚩族、甲豚族等强大异族盘踞于此，商贸发达。', color: '#BDB76B' },
{ name: '飞灵大陆', points: [[1650, 950], [3150, 950], [3150, 1750], [1650, 1750]], description: '飞灵族七十二支脉的栖息地，以天鹏族为首，强者辈出。', color: '#87CEEB' },
// --- 人界 ---
{ name: '大晋帝国', points: [[50, 2050], [1550, 2050], [1550, 3950], [50, 3950]], description: '人界最强大的修仙国度，宗门林立，资源丰厚，是人界修士的向往之地。', color: '#D2B48C' },
{ name: '乱星海', points: [[1650, 2050], [3150, 2050], [3150, 3250], [1650, 3250]], description: '广阔无垠的海洋，岛屿星罗棋布，妖兽横行，是散修和避世宗门的乐土。', color: '#4682B4' },
{ name: '天南', points: [[1650, 3350], [2650, 3350], [2650, 3950], [1650, 3950]], description: '故事开始的地方，由正魔两道共同主宰，修仙资源相对贫瘠。', color: '#8FBC8F' },
{ name: '幕兰草原', points: [[2750, 3350], [3150, 3350], [3150, 3950], [2750, 3950]], description: '广袤的草原，由信奉萨满的幕兰法士统治，与天南修士世代为敌。', color: '#9ACD32' },
],
sub_regions: [
// --- 风元大陆 下辖区域 (9+) ---
{ name: '天渊城区域', main_region: '风元大陆', points: [[700, 1600], [900, 1600], [900, 1740], [700, 1740]], description: '人族与妖族对抗异族的最前线堡垒，是人界飞升修士的必经之地。', color: '#696969' },
{ name: '人族三境', main_region: '风元大陆', points: [[100, 100], [1500, 100], [1500, 800], [100, 800]], description: '风元大陆人族的核心统治区域，由三大圣皇分别管辖。', color: '#DCDCDC' },
{ name: '妖族七地', main_region: '风元大陆', points: [[100, 850], [1150, 850], [1150, 1550], [100, 1550]], description: '风元大陆妖族的聚居地，由各大妖王统领，与人族互有摩擦。', color: '#B8860B' },
{ name: '木族领地', main_region: '风元大陆', points: [[100, 1570], [400, 1570], [400, 1740], [100, 1740]], description: '爱好和平的木族栖息地，森林茂密，生机盎然。', color: '#228B22' },
{ name: '蛮荒之地', main_region: '风元大陆', points: [[1200, 1350], [1500, 1350], [1500, 1700], [1200, 1700]], description: '风元大陆的边缘地带，灵气混乱，异兽横行，是通往其他未知世界的门户所在。', color: '#A0522D' },
{ name: '九仙山地域', main_region: '风元大陆', points: [[150, 500], [450, 500], [450, 750], [150, 750]], description: '人族境内著名的灵山福地，由九个强大的修仙世家共同占据。', color: '#87CEFA' },
{ name: '万毒沼泽', main_region: '风元大陆', points: [[150, 900], [500, 900], [500, 1200], [150, 1200]], description: '妖族七地之一，毒虫密布，瘴气横行，是毒道修士和毒属性妖兽的天堂。', color: '#556B2F' },
{ name: '啸风平原', main_region: '风元大陆', points: [[550, 900], [1100, 900], [1100, 1200], [550, 1200]], description: '妖族七地之一，风属性妖兽的领地，常年刮着撕裂空间的罡风。', color: '#F0E68C' },
{ name: '血天大陆接壤区', main_region: '风元大陆', points: [[1200, 1000], [1500, 1000], [1500, 1300], [1200, 1300]], description: '与血天大陆相邻的区域，气氛诡异，常有血道修士出没。', color: '#B22222' },

// --- 雷鸣大陆 下辖区域 (9+) ---
{ name: '角蚩族领地', main_region: '雷鸣大陆', points: [[1700, 100], [2400, 100], [2400, 800], [1700, 800]], description: '雷鸣大陆的超级大族，生性好战，实力强大。', color: '#DAA520' },
{ name: '甲豚族领地', main_region: '雷鸣大陆', points: [[2450, 550], [3100, 550], [3100, 800], [2450, 800]], description: '雷鸣大陆另一大族，以防御力惊人著称，性格温和，不喜争斗。', color: '#D2B48C' },
{ name: '赫连商盟控制区', main_region: '雷鸣大陆', points: [[2450, 100], [3100, 100], [3100, 500], [2450, 500]], description: '遍布灵界的超级商会总部所在，财富惊人，消息灵通。', color: '#FFD700' },
{ name: '巨人族山脉', main_region: '雷鸣大陆', points: [[2850, 150], [3100, 150], [3100, 400], [2850, 400]], description: '上古巨人族的后裔栖息地，看守着通往广寒界的空间节点。', color: '#A0522D' },
{ name: '黑凤族火山群', main_region: '雷鸣大陆', points: [[1750, 600], [2100, 600], [2100, 800], [1750, 800]], description: '拥有真灵黑凤血脉的强大种族，栖息于火山之中，掌控黑炎。', color: '#483D8B' },
{ name: '万古族废墟', main_region: '雷鸣大陆', points: [[2150, 150], [2400, 150], [2400, 350], [2150, 350]], description: '一个早已覆灭的古老种族遗迹，传闻其中埋藏着惊天秘密。', color: '#808080' },
{ name: '洗灵池区域', main_region: '雷鸣大陆', points: [[1750, 150], [2100, 150], [2100, 350], [1750, 350]], description: '雷鸣大陆三大圣地之一，池水能洗涤灵根，提纯法力，由三大族共同掌管。', color: '#ADD8E6' },
{ name: '雷泽', main_region: '雷鸣大陆', points: [[2150, 400], [2400, 400], [2400, 600], [2150, 600]], description: '一片常年被雷电覆盖的沼泽，是雷属性修士和妖兽的修炼宝地。', color: '#BA55D3' },
{ name: '冥河之地', main_region: '雷鸣大陆', points: [[1750, 400], [2100, 400], [2100, 550], [1750, 550]], description: '传闻连接着冥界的神秘区域，阴气森森，鬼物横行。', color: '#2F4F4F' },

// --- 飞灵大陆 下辖区域 (9+) ---
{ name: '天鹏族领地', main_region: '飞灵大陆', points: [[1700, 1000], [2400, 1000], [2400, 1700], [1700, 1700]], description: '飞灵族七十二支脉中最强大的一支，以速度冠绝灵界。', color: '#ADD8E6' },
{ name: '地渊', main_region: '飞灵大陆', points: [[2500, 1000], [3100, 1000], [3100, 1400], [2500, 1400]], description: '飞灵大陆的险恶之地，环境恶劣，生存着四大妖王。', color: '#483D8B' },
{ name: '赤融族领地', main_region: '飞灵大陆', points: [[2450, 1450], [2800, 1450], [2800, 1700], [2450, 1700]], description: '飞灵族中的火属性分支，栖息于火山地带，性格爆裂。', color: '#FF4500' },
{ name: '彩霞山脉', main_region: '飞灵大陆', points: [[2850, 1450], [3100, 1450], [3100, 1700], [2850, 1700]], description: '一座终年被七彩霞光笼罩的山脉，是多种珍稀灵鸟的栖息地。', color: '#FF69B4' },
{ name: '青啸族森林', main_region: '飞灵大陆', points: [[1750, 1450], [2100, 1450], [2100, 1700], [1750, 1700]], description: '飞灵族中的风属性分支，生活在广袤的森林中，擅长音波攻击。', color: '#3CB371' },
{ name: '银光族雪山', main_region: '飞灵大陆', points: [[2150, 1450], [2400, 1450], [2400, 1700], [2150, 1700]], description: '飞灵族中的冰属性分支，居住在万年不化的雪山之巅。', color: '#F0FFFF' },
{ name: '飞灵圣城区域', main_region: '飞灵大陆', points: [[2450, 1050], [2750, 1050], [2750, 1350], [2450, 1350]], description: '飞灵族七十二支脉共同的圣地，由各族长老共同管理。', color: '#F5DEB3' },
{ name: '万丈渊', main_region: '飞灵大陆', points: [[1750, 1050], [2100, 1050], [2100, 1400], [1750, 1400]], description: '一道深不见底的巨大裂谷，传闻是上古大战所留，谷底有空间裂缝。', color: '#000000' },
{ name: '金悦族矿区', main_region: '飞灵大陆', points: [[2150, 1050], [2400, 1050], [2400, 1400], [2150, 1400]], description: '飞灵族中的金属性分支，擅长炼器，占据着大陆最主要的灵石矿脉。', color: '#FFD700' },

// --- 大晋帝国 下辖区域 (9+) ---
{ name: '正道宗门区', main_region: '大晋帝国', points: [[100, 2100], [800, 2100], [800, 3000], [100, 3000]], description: '大晋正道的核心势力范围，以太一门、化仙宗等为首。', color: '#F5DEB3' },
{ name: '魔道宗门区', main_region: '大晋帝国', points: [[850, 2100], [1500, 2100], [1500, 3000], [850, 3000]], description: '大晋魔道的盘踞之地，以阴罗宗、天魔宗等为首。', color: '#778899' },
{ name: '佛门圣地区', main_region: '大晋帝国', points: [[100, 3050], [800, 3050], [800, 3900], [100, 3900]], description: '大晋佛门清修之地，佛法昌盛，与世无争。', color: '#FAFAD2' },
{ name: '万妖谷', main_region: '大晋帝国', points: [[850, 3050], [1500, 3050], [1500, 3900], [850, 3900]], description: '大晋妖族的聚集地，由化形大妖王统治。', color: '#556B2F' },
{ name: '晋京皇城圈', main_region: '大晋帝国', points: [[700, 2400], [950, 2400], [950, 2650], [700, 2650]], description: '大晋王朝的皇城，凡人与修士混居，是帝国的政治中心。', color: '#CD853F' },
{ name: '北凉之地', main_region: '大晋帝国', points: [[150, 2150], [400, 2150], [400, 2400], [150, 2400]], description: '大晋北疆区域，靠近昆吾山，气候苦寒，民风彪悍。', color: '#B0C4DE' },
{ name: '天澜草原边境', main_region: '大晋帝国', points: [[1200, 3600], [1500, 3600], [1500, 3900], [1200, 3900]], description: '与幕兰草原接壤的区域，是两大势力常年交战的前线。', color: '#9ACD32' },
{ name: '阴冥之地', main_region: '大晋帝国', points: [[900, 2700], [1200, 2700], [1200, 2950], [900, 2950]], description: '阴气汇聚之地，鬼道修士的乐土，传闻有通往阴司界的裂缝。', color: '#483D8B' },
{ name: '天机阁势力范围', main_region: '大晋帝国', points: [[450, 2700], [750, 2700], [750, 2950], [450, 2950]], description: '贩卖情报的神秘组织，其分舵遍布大晋，无人知其总部所在。', color: '#8A2BE2' },

// --- 乱星海 下辖区域 (9+) ---
{ name: '内星海', main_region: '乱星海', points: [[2050, 2100], [2750, 2100], [2750, 2800], [2050, 2800]], description: '乱星海内围，由星宫统治，相对安全，是修士的主要活动区域。', color: '#B0C4DE' },
{ name: '外星海', main_region: '乱星海', points: [[1700, 2100], [2000, 2100], [2000, 3200], [1700, 3200]], description: '乱星海外围，危险与机遇并存，是高阶妖兽和逆星盟的活动区域。', color: '#708090' },
{ name: '妖兽海域', main_region: '乱星海', points: [[2800, 2100], [3100, 2100], [3100, 2800], [2800, 2800]], description: '高阶妖兽盘踞的海域，人迹罕至，是星宫也难以完全掌控的区域。', color: '#008B8B' },
{ name: '逆星盟控制区', main_region: '乱星海', points: [[1750, 2850], [2300, 2850], [2300, 3200], [1750, 2850]], description: '旨在推翻星宫统治的秘密组织，其岛屿位置隐秘，变幻莫测。', color: '#DC143C' },
{ name: '碧灵岛群岛', main_region: '乱星海', points: [[2100, 2150], [2400, 2150], [2400, 2400], [2100, 2400]], description: '内星海著名的灵药产地，由数个擅长种植灵草的小门派共同管理。', color: '#32CD32' },
{ name: '妙音门海域', main_region: '乱星海', points: [[2450, 2150], [2700, 2150], [2700, 2400], [2450, 2400]], description: '以音律和幻术闻名的女修门派，其宗门被强大的幻阵笼罩。', color: '#EE82EE' },
{ name: '风暴峡湾', main_region: '乱星海', points: [[2050, 2850], [2400, 2850], [2400, 3050], [2050, 2850]], description: '连接内外星海的必经之路，常年被巨大的风暴和雷电笼罩。', color: '#1E90FF' },
{ name: '无边海连接带', main_region: '乱星海', points: [[1650, 3100], [3150, 3100], [3150, 3250], [1650, 3250]], description: '连接乱星海与天南的神秘海域，传闻有古修士战场遗址。', color: '#5F9EA0' },
{ name: '小寰岛废墟区', main_region: '乱星海', points: [[2450, 2850], [2700, 2850], [2700, 3050], [2450, 2850]], description: '一座被神秘力量毁灭的岛屿，如今只剩下残垣断壁和无尽的传说。', color: '#696969' },

// --- 天南 下辖区域 (9+) ---
{ name: '越国', main_region: '天南', points: [[1700, 3700], [2000, 3700], [2000, 3900], [1700, 3900]], description: '天南七国之一，灵气稀薄，是故事开始的地方。', color: '#98FB98' },
{ name: '溪国', main_region: '天南', points: [[2050, 3400], [2350, 3400], [2350, 3600], [2050, 3600]], description: '天南国家，落云宗所在地，云梦山脉横贯其中。', color: '#E0FFFF' },
{ name: '九国盟', main_region: '天南', points: [[1700, 3400], [2000, 3400], [2000, 3650], [1700, 3650]], description: '由九个修仙小国组成的联盟，共同抵御外敌。', color: '#F0E68C' },
{ name: '元武国', main_region: '天南', points: [[2050, 3650], [2350, 3650], [2350, 3900], [2050, 3650]], description: '天南七国之一，与越国相邻，两国修士常有往来。', color: '#AFEEEE' },
{ name: '紫金国', main_region: '天南', points: [[2400, 3400], [2600, 3400], [2600, 3600], [2400, 3600]], description: '天南七国之一，以出产紫金铜闻名，是炼器材料的重要产地。', color: '#DDA0DD' },
{ name: '魔道六宗控制区', main_region: '天南', points: [[1700, 3360], [2640, 3360], [2640, 3450], [1700, 3450]], description: '天南魔道势力的盘踞之地，与正道联盟常年对峙。', color: '#778899' },
{ name: '天道盟控制区', main_region: '天南', points: [[1700, 3900], [2640, 3900], [2640, 3940], [1700, 3940]], description: '天南正道修士为对抗魔道和幕兰人组成的联盟。', color: '#F0FFF0' },
{ name: '坠魔谷区域', main_region: '天南', points: [[2550, 3500], [2640, 3500], [2640, 3700], [2550, 3700]], description: '上古大战遗留的空间薄弱点，内部空间裂缝密布，危险与机遇并存。', color: '#8B0000' },
{ name: '云梦山脉', main_region: '天南', points: [[2000, 3500], [2400, 3500], [2400, 3600], [2000, 3600]], description: '横亘在天南中心地带的巨大山脉，灵气充沛，是众多宗门的根基所在。', color: '#2E8B57' },

// --- 幕兰草原 下辖区域 (9+) ---
{ name: '幕兰圣殿区', main_region: '幕兰草原', points: [[2900, 3600], [3000, 3600], [3000, 3700], [2900, 3700]], description: '幕兰法士的信仰核心，由神师镇守。', color: '#FFD700' },
{ name: '天神部落领地', main_region: '幕兰草原', points: [[2800, 3400], [3100, 3400], [3100, 3550], [2800, 3550]], description: '幕兰草原最强大的部落，历代神师皆出于此。', color: '#CD853F' },
{ name: '圣禽巢穴山脉', main_region: '幕兰草原', points: [[3000, 3400], [3140, 3400], [3140, 3500], [3000, 3500]], description: '幕兰人信奉的圣禽“八级妖禽”的栖息地。', color: '#87CEEB' },
{ name: '阴魂沙漠', main_region: '幕兰草原', points: [[2760, 3750], [3000, 3750], [3000, 3940], [2760, 3940]], description: '一片被诅咒的沙漠，白天酷热，夜晚则有阴魂出没。', color: '#F5DEB3' },
{ name: '天阙堡防线', main_region: '幕兰草原', points: [[2760, 3600], [2850, 3600], [2850, 3700], [2760, 3700]], description: '幕兰人为了抵御天南修士而修建的巨大堡垒。', color: '#A9A9A9' },
{ name: '月华湖泊群', main_region: '幕兰草原', points: [[3000, 3750], [3140, 3750], [3140, 3850], [3000, 3850]], description: '草原上的一颗明珠，湖水在月光下会散发奇特的能量。', color: '#ADD8E6' },
{ name: '先祖祭坛平原', main_region: '幕兰草原', points: [[2900, 3500], [3000, 3500], [3000, 3580], [2900, 3580]], description: '幕兰人祭祀先祖英灵的地方，拥有神秘的力量。', color: '#D2B48C' },
{ name: '狼神谷地', main_region: '幕兰草原', points: [[2800, 3550], [2900, 3550], [2900, 3650], [2800, 3650]], description: '草原狼群的聚集地，由一头强大的狼王统领。', color: '#778899' },
{ name: '突兀人游牧区', main_region: '幕兰草原', points: [[2800, 3850], [3100, 3850], [3100, 3940], [2800, 3940]], description: '与幕兰人并非同族的另一支草原民族，更加野蛮好战。', color: '#B0C4DE' },
],
points_of_interest: [
// --- 风元大陆 POI (15+) ---
{ name: '天渊城', x: 800, y: 1670, main_region: '风元大陆', sub_region: '天渊城区域', description: '连接人灵两界的巨城，抵御异族的前线。' },
{ name: '天元城', x: 500, y: 300, main_region: '风元大陆', sub_region: '人族三境', description: '天元圣皇府所在地，人族核心城市之一。' },
{ name: '天魔城', x: 1000, y: 300, main_region: '风元大陆', sub_region: '人族三境', description: '天魔圣皇府所在地，魔道修士聚集地。' },
{ name: '灵皇城', x: 800, y: 625, main_region: '风元大陆', sub_region: '人族三境', description: '人族中心皇城，是人族最高权力的象征。' },
{ name: '落日之墓', x: 1450, y: 1500, main_region: '风元大陆', sub_region: '蛮荒之地', description: '通往蛮荒世界的入口，危险重重。' },
{ name: '木族圣城', x: 250, y: 1650, main_region: '风元大陆', sub_region: '木族领地', description: '木族的核心城市，被巨大的神木笼罩。' },
{ name: '玄武城', x: 1300, y: 700, main_region: '风元大陆', sub_region: '人族三境', description: '人族边境重镇，以强大的防御工事闻名。' },
{ name: '青元宫', x: 300, y: 625, main_region: '风元大陆', sub_region: '九仙山地域', description: '九仙山中一个古老道宫，传闻有大乘期修士隐居。' },
{ name: '万毒窟', x: 325, y: 1050, main_region: '风元大陆', sub_region: '万毒沼泽', description: '沼泽深处的剧毒之地，是万毒之源。' },
{ name: '风灵谷', x: 825, y: 1050, main_region: '风元大陆', sub_region: '啸风平原', description: '平原上风灵气最浓郁之地，有风眼形成。' },
{ name: '银月狼族巢穴', x: 800, y: 1300, main_region: '风元大陆', sub_region: '妖族七地', description: '妖族大族银月狼的聚居地，其首领拥有真灵血脉。' },
{ name: '天狐族秘境', x: 400, y: 1300, main_region: '风元大陆', sub_region: '妖族七地', description: '擅长幻术的天狐一族的隐秘居所。' },
{ name: '天尸宗山门', x: 1350, y: 900, main_region: '风元大陆', sub_region: '妖族七地', description: '一个以炼尸闻名的邪门宗派，位于妖族地界。' },
{ name: '广源斋分部', x: 810, y: 200, main_region: '风元大陆', sub_region: '人族三境', description: '灵界著名商会的分支，贩卖各种丹药材料。' },
{ name: '小寰岛', x: 450, y: 1650, main_region: '风元大陆', sub_region: '木族领地', description: '木族境内一座与世隔绝的小岛，环境优美，灵气充沛。' },

// --- 雷鸣大陆 POI (15+) ---
{ name: '角蚩王城', x: 2050, y: 450, main_region: '雷鸣大陆', sub_region: '角蚩族领地', description: '角蚩族的王城，建筑风格粗犷宏伟。' },
{ name: '广寒界入口', x: 2900, y: 275, main_region: '雷鸣大陆', sub_region: '巨人族山脉', description: '通往上古秘境广寒界的空间节点，由巨人族看守。' },
{ name: '赫连商盟总部', x: 2650, y: 300, main_region: '雷鸣大陆', sub_region: '赫连商盟控制区', description: '赫连商盟的权力中心，一座悬浮在空中的巨大城市。' },
{ name: '甲豚族圣地', x: 2775, y: 675, main_region: '雷鸣大陆', sub_region: '甲豚族领地', description: '甲豚族祭祀先祖的圣地，防御森严。' },
{ name: '黑凤巢', x: 1925, y: 700, main_region: '雷鸣大陆', sub_region: '黑凤族火山群', description: '黑凤族族长的栖息地，位于最大的一座活火山之巅。' },
{ name: '洗灵池', x: 1925, y: 250, main_region: '雷鸣大陆', sub_region: '洗灵池区域', description: '能提纯灵根的圣地，每隔百年开启一次。' },
{ name: '万古殿', x: 2275, y: 250, main_region: '雷鸣大陆', sub_region: '万古族废墟', description: '万古族遗迹中唯一保存完好的建筑，充满了未知的禁制。' },
{ name: '雷霆崖', x: 2275, y: 500, main_region: '雷鸣大陆', sub_region: '雷泽', description: '雷泽中心的一座山崖，是感悟雷电法则的绝佳之地。' },
{ name: '冥河渡口', x: 1925, y: 475, main_region: '雷鸣大陆', sub_region: '冥河之地', description: '传闻中可以乘船渡过冥河，进入真正冥界的神秘渡口。' },
{ name: '地火窟', x: 2600, y: 750, main_region: '雷鸣大陆', sub_region: '甲豚族领地', description: '甲豚族用于炼器的天然地火源头。' },
{ name: '天雷堡', x: 2000, y: 650, main_region: '雷鸣大陆', sub_region: '角蚩族领地', description: '角蚩族用于抵御外敌的军事要塞，引天雷为防御。' },
{ name: '通宝殿', x: 2650, y: 450, main_region: '雷鸣大陆', sub_region: '赫连商盟控制区', description: '万宝大会的主拍卖场，禁制重重。' },
{ name: '云城', x: 2800, y: 150, main_region: '雷鸣大陆', sub_region: '赫连商盟控制区', description: '一座建立在云层之上的城市，是赫连商盟的商业中心。' },
{ name: '无名巨坑', x: 2200, y: 750, main_region: '雷鸣大陆', sub_region: '角蚩族领地', description: '一个深不见底的巨坑，传闻是上古大能一击所留。' },
{ name: '失落神庙', x: 3000, y: 700, main_region: '雷鸣大陆', sub_region: '甲豚族领地', description: '一座供奉着未知神祇的古老神庙，早已废弃。' },

// --- 飞灵大陆 POI (15+) ---
{ name: '天鹏圣城', x: 2050, y: 1350, main_region: '飞灵大陆', sub_region: '天鹏族领地', description: '天鹏族的圣地，城中有化龙池。' },
{ name: '地渊妖王巢穴', x: 2800, y: 1200, main_region: '飞灵大陆', sub_region: '地渊', description: '木青、地血等四大妖王盘踞的险恶之地。' },
{ name: '化龙池', x: 2050, y: 1150, main_region: '飞灵大陆', sub_region: '天鹏族领地', description: '天鹏族圣地中的核心，能提纯血脉，有几率化为真灵。' },
{ name: '赤融城', x: 2625, y: 1575, main_region: '飞灵大陆', sub_region: '赤融族领地', description: '赤融族的主城，建立在一座巨大的火山之上。' },
{ name: '七彩神山', x: 2975, y: 1575, main_region: '飞灵大陆', sub_region: '彩霞山脉', description: '彩霞山脉的主峰，是飞灵族传说中的神鸟栖息地。' },
{ name: '青啸林海', x: 1925, y: 1575, main_region: '飞灵大陆', sub_region: '青啸族森林', description: '青啸族的核心区域，林中古木参天，隐藏着无数秘密。' },
{ name: '银光圣殿', x: 2275, y: 1575, main_region: '飞灵大陆', sub_region: '银光族雪山', description: '银光族祭祀冰雪之神的圣殿，由万年玄冰构成。' },
{ name: '飞灵殿', x: 2600, y: 1200, main_region: '飞灵大陆', sub_region: '飞灵圣城区域', description: '飞灵族七十二支脉长老议事的最高殿堂。' },
{ name: '万丈渊底', x: 1925, y: 1225, main_region: '飞灵大陆', sub_region: '万丈渊', description: '深渊的最底部，传闻有通往魔界的空间裂缝。' },
{ name: '金悦城', x: 2275, y: 1225, main_region: '飞灵大陆', sub_region: '金悦族矿区', description: '金悦族的主城，也是飞灵大陆最大的炼器和交易中心。' },
{ name: '小须弥山顶', x: 2950, y: 1200, main_region: '飞灵大陆', sub_region: '地渊', description: '一座蕴含空间之力的神山，山中自成空间，是飞灵族试炼之地。' },
{ name: '鲲鹏之巢', x: 1800, y: 1600, main_region: '飞灵大陆', sub_region: '天鹏族领地', description: '传说中真灵鲲鹏遗留的巢穴，位于一处次元空间之内。' },
{ name: '血咒之门', x: 2800, y: 1350, main_region: '飞灵大陆', sub_region: '地渊', description: '地渊深处一座被血色符文覆盖的石门，通往未知险地。' },
{ name: '飞灵试炼场', x: 2200, y: 1650, main_region: '飞灵大陆', sub_region: '银光族雪山', description: '飞灵族年轻一辈进行生死试炼的场所。' },
{ name: '百鸟林', x: 2900, y: 1650, main_region: '飞灵大陆', sub_region: '彩霞山脉', description: '栖息着上百种珍稀灵鸟的森林，景色优美，但也暗藏杀机。' },

// --- 大晋帝国 POI (15+) ---
{ name: '大晋皇城', x: 825, y: 2525, main_region: '大晋帝国', sub_region: '晋京皇城圈', description: '大晋王朝的权力中心，有元婴期供奉坐镇。' },
{ name: '太一门', x: 450, y: 2300, main_region: '大晋帝国', sub_region: '正道宗门区', description: '大晋的超级宗门，实力深不可测，与某个修仙大族关系密切。' },
{ name: '阴罗宗', x: 1200, y: 2300, main_region: '大晋帝国', sub_region: '魔道宗门区', description: '大晋三大魔宗之一，以炼制鬼幡和驱使阴魂闻名。' },
{ name: '般若寺', x: 450, y: 3200, main_region: '大晋帝国', sub_region: '佛门圣地区', description: '大晋佛门大派，以高深佛法和强大体修闻名。' },
{ name: '万妖谷主谷', x: 1200, y: 3500, main_region: '大晋帝国', sub_region: '万妖谷', description: '由大妖王统治的妖族势力核心。' },
{ name: '昆吾山', x: 800, y: 3500, main_region: '大晋帝国', sub_region: '万妖谷', description: '大晋三大神山之一，上古封魔之地，元婴修士的终极试炼场。' },
{ name: '小极宫', x: 800, y: 2800, main_region: '大晋帝国', sub_region: '阴冥之地', description: '位于极北之地的神秘宫殿，冰属性修士的圣地。' },
{ name: '叶家堡', x: 200, y: 2800, main_region: '大晋帝国', sub_region: '正道宗门区', description: '大晋第一修仙世家的堡垒，防卫森严。' },
{ name: '化仙宗山门', x: 600, y: 2200, main_region: '大晋帝国', sub_region: '正道宗门区', description: '大晋正道大派，以其神秘的化仙秘术闻名。' },
{ name: '天魔宗总坛', x: 1000, y: 2200, main_region: '大晋帝国', sub_region: '魔道宗门区', description: '大晋魔道巨擘，功法霸道，门人行事肆无忌惮。' },
{ name: '合欢宗秘地', x: 1300, y: 2800, main_region: '大晋帝国', sub_region: '魔道宗门区', description: '大晋三大魔宗之一，门人多为女修，擅长媚术和双修功法。' },
{ name: '无垢寺', x: 200, y: 3500, main_region: '大晋帝国', sub_region: '佛门圣地区', description: '佛门清修之地，寺中有一口能洗涤心魔的古井。' },
{ name: '天机阁分舵', x: 600, y: 2825, main_region: '大晋帝国', sub_region: '天机阁势力范围', description: '一座看似普通的茶楼，实则是天机阁在大晋的重要情报据点。' },
{ name: '天澜圣殿', x: 1350, y: 3750, main_region: '大晋帝国', sub_region: '天澜草原边境', description: '天澜草原上法士的信仰中心，与幕兰草原的圣殿遥遥相望。' },
{ name: '鬼灵门旧址', x: 1050, y: 2825, main_region: '大晋帝国', sub_region: '阴冥之地', description: '曾是天南魔道六宗之一的宗门遗址，如今已成鬼物乐园。' },

// --- 乱星海 POI (15+) ---
{ name: '天星城', x: 2400, y: 2450, main_region: '乱星海', sub_region: '内星海', description: '乱星海第一大城，星宫总部所在。' },
{ name: '魁星岛', x: 2200, y: 2600, main_region: '乱星海', sub_region: '内星海', description: '乱星海著名坊市岛屿。' },
{ name: '奇渊岛', x: 1850, y: 2300, main_region: '乱星海', sub_region: '外星海', description: '一座独立的巨大岛屿，是乱星海最大的散修聚集地和坊市。' },
{ name: '虚天殿入口', x: 1750, y: 2800, main_region: '乱星海', sub_region: '外星海', description: '传说中的上古遗迹，每隔数百年开启一次，内有重宝虚天鼎。' },
{ name: '碧灵岛', x: 2250, y: 2275, main_region: '乱星海', sub_region: '碧灵岛群岛', description: '群岛主岛，岛上灵气充沛，盛产各种珍稀灵草。' },
{ name: '妙音宫', x: 2575, y: 2275, main_region: '乱星海', sub_region: '妙音门海域', description: '妙音门的核心所在，一座建立在海底水晶宫中的巨大宫殿。' },
{ name: '逆星岛', x: 2025, y: 3025, main_region: '乱星海', sub_region: '逆星盟控制区', description: '逆星盟的总部之一，岛屿被强大的阵法保护，不断移动。' },
{ name: '万丈海沟', x: 2950, y: 2450, main_region: '乱星海', sub_region: '妖兽海域', description: '一道深不见底的海底裂谷，是无数强大海中妖兽的巢穴。' },
{ name: '古传送阵', x: 1875, y: 3100, main_region: '乱星海', sub_region: '无边海连接带', description: '一座能通往天南大陆的残破上古传送阵。' },
{ name: '镇妖塔', x: 2600, y: 2600, main_region: '乱星海', sub_region: '内星海', description: '星宫用于镇压强大妖兽和魔道修士的巨塔。' },
{ name: '乌龙岛', x: 1800, y: 2500, main_region: '乱星海', sub_region: '外星海', description: '一座盛产乌龙木的岛屿，是炼制飞行法器的绝佳材料。' },
{ name: '珊瑚岛', x: 2150, y: 2700, main_region: '乱星海', sub_region: '内星海', description: '由巨大珊瑚礁构成的岛屿，景色优美，是低阶修士的度假胜地。' },
{ name: '魔龟岛', x: 3000, y: 3000, main_region: '乱星海', sub_region: '妖兽海域', description: '一只沉睡了万年的巨大妖龟，其背甲形成了一座岛屿。' },
{ name: '无名荒岛', x: 1900, y: 2600, main_region: '乱星海', sub_region: '外星海', description: '一座没有任何灵气的荒岛，但似乎隐藏着某个洞府。' },
{ name: '鲸鲨群栖息地', x: 2900, y: 2200, main_region: '乱星海', sub_region: '妖兽海域', description: '成群结队的六级妖兽鲸鲨出没的海域，极度危险。' },

// --- 天南 POI (15+) ---
{ name: '黄枫谷', x: 1850, y: 3800, main_region: '天南', sub_region: '越国', description: '越国七大派之一，主角早期宗门。' },
{ name: '掩月宗', x: 1780, y: 3750, main_region: '天南', sub_region: '越国', description: '越国七大派之一，以女修为主。' },
{ name: '血色禁地', x: 1950, y: 3850, main_region: '天南', sub_region: '越国', description: '越国七派为弟子准备的残酷试炼之地，内有筑基丹主药。' },
{ name: '落云宗', x: 2200, y: 3500, main_region: '天南', sub_region: '溪国', description: '天南正道大派，擅长炼丹的宗门。' },
{ name: '云梦山主峰', x: 2200, y: 3550, main_region: '天南', sub_region: '云梦山脉', description: '云梦山脉灵气最浓郁的山峰，被三大派共同占据。' },
{ name: '太南谷', x: 1850, y: 3525, main_region: '天南', sub_region: '九国盟', description: '天南低阶修士交易物品的著名坊市，每隔数年举办一次太南小会。' },
{ name: '灵矿山', x: 1750, y: 3800, main_region: '天南', sub_region: '越国', description: '越国境内最大的一条灵石矿脉，由七大派共同掌管。' },
{ name: '燕翎堡', x: 1900, y: 3450, main_region: '天南', sub_region: '九国盟', description: '以炼制顶级法器闻名的家族，但族内有禁止男子修仙的奇特规定。' },
{ name: '鬼灵门总坛', x: 2050, y: 3425, main_region: '天南', sub_region: '魔道六宗控制区', description: '天南魔道六宗之一，以驱使鬼物和炼尸闻名。' },
{ name: '天道盟总部', x: 2150, y: 3925, main_region: '天南', sub_region: '天道盟控制区', description: '由天南正道三大修士共同主持，抵御外敌的议事中心。' },
{ name: '灵缈园入口', x: 2595, y: 3600, main_region: '天南', sub_region: '坠魔谷区域', description: '坠魔谷深处通往上古修士药园的空间节点，位置飘忽不定。' },
{ name: '天一城', x: 2500, y: 3500, main_region: '天南', sub_region: '紫金国', description: '紫金国国都，天南最大的炼器材料交易市场。' },
{ name: '百巧院', x: 2200, y: 3750, main_region: '天南', sub_region: '元武国', description: '一个不以斗法见长，却精通各种机关傀儡之术的奇特宗门。' },
{ name: '化意门', x: 1800, y: 3450, main_region: '天南', sub_region: '九国盟', description: '一个门人稀少但个个实力强大的宗门，以强大的神识攻击秘术闻名。' },
{ name: '无名小山村', x: 1950, y: 3750, main_region: '天南', sub_region: '越国', description: '一个凡人居住的普通村落，似乎没有什么特别之处。' },

// --- 幕兰草原 POI (15+) ---
{ name: '幕兰圣殿', x: 2950, y: 3650, main_region: '幕兰草原', sub_region: '幕兰圣殿区', description: '幕兰法士的信仰核心，由神师镇守。' },
{ name: '天神部落营地', x: 2950, y: 3475, main_region: '幕兰草原', sub_region: '天神部落领地', description: '幕兰草原最强大的部落，历代神师皆出于此。' },
{ name: '圣禽峰', x: 3070, y: 3450, main_region: '幕兰草原', sub_region: '圣禽巢穴山脉', description: '幕兰人信奉的圣禽“八级妖禽”的栖息地。' },
{ name: '黑风口', x: 2880, y: 3850, main_region: '幕兰草原', sub_region: '阴魂沙漠', description: '阴魂沙漠的入口，常年刮着能侵蚀神魂的黑风。' },
{ name: '天阙堡', x: 2805, y: 3650, main_region: '幕兰草原', sub_region: '天阙堡防线', description: '幕兰人为了抵御天南修士而修建的巨大堡垒。' },
{ name: '月华湖', x: 3070, y: 3800, main_region: '幕兰草原', sub_region: '月华湖泊群', description: '草原上的一颗明珠，湖水在月光下会散发奇特的能量。' },
{ name: '先祖祭坛', x: 2950, y: 3540, main_region: '幕兰草原', sub_region: '先祖祭坛平原', description: '幕兰人祭祀先祖英灵的地方，拥有神秘的力量。' },
{ name: '狼神谷', x: 2850, y: 3600, main_region: '幕兰草原', sub_region: '狼神谷地', description: '草原狼群的聚集地，由一头强大的狼王统领。' },
{ name: '断魂崖', x: 3100, y: 3600, main_region: '幕兰草原', sub_region: null, description: '一处险峻的悬崖，是幕兰人处决叛徒的地方。' },
{ name: '金帐王庭', x: 2950, y: 3400, main_region: '幕兰草原', sub_region: '天神部落领地', description: '幕兰草原世俗王权的中心。' },
]
};



    const db = new Dexie('CultivationDB');
    db.version(3).stores({
        archives: '&name',
        settings: '&key',
        backgrounds: '++id',
        npcAvatars: '++id'
    }).upgrade(tx => {
        // This upgrade function is for migrating from version 2 to 3 if needed.
    });
    db.version(2).stores({
        archives: '&name',
        settings: '&key',
        backgrounds: '++id'
    }).upgrade(tx => {
        // This upgrade function is for migrating from version 1 to 2 if needed.
    });
    db.version(1).stores({
        archives: '&name',
        settings: '&key'
    });
	


function recursivelyParseJsonStrings(data) {
    // 1. 如果是字符串，尝试解析
    if (typeof data === 'string') {
        const trimmedString = data.trim();
        // 检查它是否像一个JSON对象或数组
        if ((trimmedString.startsWith('{') && trimmedString.endsWith('}')) || (trimmedString.startsWith('[') && trimmedString.endsWith(']'))) {
            try {
                // 关键：将所有可能的单引号替换为双引号，以修复不规范的JSON
                // （注意：这假设了字符串内容本身不包含需要保留的单引号）
                // 并且处理AI可能产生的 \\" 转义错误
                const validJsonString = trimmedString.replace(/'/g, '"').replace(/\\"/g, '"');
                const parsedData = JSON.parse(validJsonString);
                // 成功解析后，递归调用自身，以处理更深层次的嵌套
                return recursivelyParseJsonStrings(parsedData);
            } catch (e) {
                // 如果解析失败，说明它可能只是一个普通字符串，返回原始数据以防数据丢失
                console.warn(`recursivelyParseJsonStrings 即使在修复后也解析失败:`, data, e);
                return data;
            }
        }
    } 
    // 2. 如果是数组，遍历并递归处理每个元素
    else if (Array.isArray(data)) {
        return data.map(item => recursivelyParseJsonStrings(item));
    } 
    // 3. 如果是对象，遍历并递归处理每个属性值
    else if (typeof data === 'object' && data !== null) {
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                data[key] = recursivelyParseJsonStrings(data[key]);
            }
        }
    }
    // 4. 如果不是以上情况，直接返回原始数据
    return data;
}

    async function dbGet(key) {
        const setting = await db.settings.get(key);
        return setting ? setting.value : null;
    }

    async function dbSet(key, value) {
        return await db.settings.put({ key, value });
    }

    async function dbRemove(key) {
        return await db.settings.delete(key);
    }

    const timeLocationDisplay = document.getElementById('time-location-display');
    const mainContentArea = document.getElementById('main-content-area');
    const inventoryGrid = document.getElementById('inventory-grid');
    const attributesList = document.getElementById('attributes-list');
    const cultivationPanel = document.querySelector('.cultivation-panel');
    const body = document.body;
    const messageInput = document.getElementById('message-input');
    const sendMessageButton = document.getElementById('send-message-button');
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const scaleUpBtn = document.getElementById('scale-up-btn');
    const scaleDownBtn = document.getElementById('scale-down-btn');
    const scaleResetBtn = document.getElementById('scale-reset-btn');
    const manageLogButton = document.getElementById('manage-log-button');
    const chatView = document.getElementById('chat-view');
    const archiveSelectionView = document.getElementById('archive-selection-view');
    const logViewerVIew = document.getElementById('log-viewer-view');
    const archiveList = document.getElementById('archive-list');
    const logList = document.getElementById('log-list');
    const backToChatFromArchivesButton = document.getElementById('back-to-chat-from-archives-button');
    const backToArchivesButton = document.getElementById('back-to-archives-button');
    const characterDisplay = document.getElementById('character-display');
    const characterDetailOverlay = document.getElementById('character-detail-overlay');
    const modalCloseBtn = document.querySelector('#character-detail-overlay .modal-close-btn');
    const pickerOverlay = document.getElementById('equipment-picker-overlay');
    const pickerCloseBtn = document.querySelector('#equipment-picker-overlay .modal-close-btn');
    const pickerGrid = document.getElementById('picker-grid');
    const pickerTitle = document.getElementById('picker-title');
    const commandQueueOverlay = document.getElementById('command-queue-overlay');
    const openCommandQueueBtn = document.getElementById('open-command-queue-btn');
    const closeCommandQueueBtn = document.querySelector('#command-queue-overlay .modal-close-btn');
    const commandList = document.getElementById('command-list');
    const undoCommandBtn = document.getElementById('undo-command-btn');
    const clearCommandsBtn = document.getElementById('clear-commands-btn');
    const selectLogButton = document.getElementById('select-log-button');
    const renameLogButton = document.getElementById('rename-log-button');
    const deleteLogButton = document.getElementById('delete-log-button');
    const itemDetailOverlay = document.getElementById('item-detail-overlay');
    const itemDetailCloseBtn = document.querySelector('#item-detail-overlay .modal-close-btn');
    const messageContextMenu = document.getElementById('message-context-menu');
    const systemSettingsButton = document.getElementById('system-settings-button');
    const systemSettingsOverlay = document.getElementById('system-settings-overlay');
    const summaryConfigOverlay = document.getElementById('summary-config-overlay');
    const manualSummaryOverlay = document.getElementById('manual-summary-overlay');
    const regexSettingsOverlay = document.getElementById('regex-settings-overlay');
    const regexEditorOverlay = document.getElementById('regex-editor-overlay');
    const importArchiveBtn = document.getElementById('import-archive-btn');
    const exportArchiveBtn = document.getElementById('export-archive-btn');
    const importArchiveInput = document.getElementById('import-archive-input');
    const exportArchiveOverlay = document.getElementById('export-archive-overlay');
    const exportArchiveList = document.getElementById('export-archive-list');
    const exportArchiveCloseBtn = exportArchiveOverlay.querySelector('.modal-close-btn');
    const surroundingCharactersButton = document.getElementById('surrounding-characters-button');
    const surroundingCharactersOverlay = document.getElementById('surrounding-characters-overlay');
    const charactersModalCloseBtn = surroundingCharactersOverlay.querySelector('.modal-close-btn');
    const characterListView = document.getElementById('character-list-view');
    const characterDetailView = document.getElementById('character-detail-view');
    const backToCharacterListBtn = document.getElementById('back-to-character-list-btn');
    const characterListContainer = document.getElementById('character-list-container');
    const characterDetailPanel = document.getElementById('character-detail-panel');
    const worldEventsButton = document.getElementById('world-events-button');
    const worldEventsOverlay = document.getElementById('world-events-overlay');
    const summaryLogButton = document.getElementById('summary-log-button');
    const summaryLogOverlay = document.getElementById('summary-log-overlay');
    const summaryLogCloseBtn = summaryLogOverlay.querySelector('.modal-close-btn');
    const messageEditorOverlay = document.getElementById('message-editor-overlay');
    const snapshotBtn = document.getElementById('snapshot-btn');
    const snapshotOverlay = document.getElementById('snapshot-overlay');
    const snapshotEditorOverlay = document.getElementById('snapshot-editor-overlay');
    const splashScreen = document.getElementById('splash-screen');
    const splashImportBtn = document.getElementById('splash-import-btn');
    const splashSettingsBtn = document.getElementById('splash-settings-btn');
    const cacheManagerOverlay = document.getElementById('cache-manager-overlay');
    const creationScreen = document.getElementById('character-creation-screen');
    const customBirthOverlay = document.getElementById('custom-birth-overlay');
    const customRaceOverlay = document.getElementById('custom-race-overlay');
    const traitDetailOverlay = document.getElementById('trait-detail-overlay');
    const selectedTraitsOverlay = document.getElementById('selected-traits-overlay');
    const deedsTimelineOverlay = document.getElementById('deeds-timeline-overlay');
    const bondedCharacterSelectionOverlay = document.getElementById('bonded-character-selection-overlay');
    const bondedCharacterEditorOverlay = document.getElementById('bonded-character-editor-overlay');
    const customTraitManagerOverlay = document.getElementById('custom-trait-manager-overlay');
    const customTraitEditorOverlay = document.getElementById('custom-trait-editor-overlay');
    const selfSelectTraitOverlay = document.getElementById('self-select-trait-overlay');
    const mobileToggleLeft = document.getElementById('mobile-toggle-left');
    const mobileToggleRight = document.getElementById('mobile-toggle-right');
    const mobilePaneOverlay = document.querySelector('.mobile-pane-overlay');
    const selectAllArchivesBtn = document.getElementById('select-all-archives-btn');
    const deleteSelectedArchivesBtn = document.getElementById('delete-selected-archives-btn');
    const viewTasksBtn = document.getElementById('view-tasks-btn');
    const tasksOverlay = document.getElementById('tasks-overlay');
    const mySpiritBeastsBtn = document.getElementById('my-spirit-beasts-btn');
    const mySkillsBtn = document.getElementById('my-skills-btn');
    const spiritBeastOverlay = document.getElementById('spirit-beast-overlay');
    const skillsOverlay = document.getElementById('skills-overlay');
    const skillDetailOverlay = document.getElementById('skill-detail-overlay');
    const customDialogOverlay = document.getElementById('custom-dialog-overlay');
    const locationRpgOverlay = document.getElementById('location-rpg-overlay');
    const avatarUploadInput = document.getElementById('avatar-upload-input');
    const npcAvatarUploadInput = document.getElementById('npc-avatar-upload-input');
    const selfSelectLinggenOverlay = document.getElementById('self-select-linggen-overlay');
    const funSettingsOverlay = document.getElementById('fun-settings-overlay');
    const genericImportInput = document.getElementById('generic-import-input');
    const customBirthSelectionOverlay = document.getElementById('custom-birth-selection-overlay');
    const customRaceSelectionOverlay = document.getElementById('custom-race-selection-overlay');
    const segmentedMemoryOverlay = document.getElementById('segmented-memory-overlay');
    const summaryViewerOverlay = document.getElementById('summary-viewer-overlay');
    const summaryEditorOverlay = document.getElementById('summary-editor-overlay');
    const manualSegmentedMemoryOverlay = document.getElementById('manual-segmented-memory-overlay');
    const fabContainer = document.getElementById('fab-container');
    const fabBall = document.getElementById('fab-ball');
    const fabShortcutMenu = document.getElementById('fab-shortcut-menu');
    const chatBackgroundSettingsOverlay = document.getElementById('chat-background-settings-overlay');
    const backgroundUploadInput = document.getElementById('background-upload-input');
    const enhancementOverlay = document.getElementById('enhancement-overlay');
    const alchemyOverlay = document.getElementById('alchemy-overlay');
    const refiningOverlay = document.getElementById('refining-overlay');
    const warehouseOverlay = document.getElementById('warehouse-overlay');
    const warehousePickerOverlay = document.getElementById('warehouse-picker-overlay');
    const aiImageGenOverlay = document.getElementById('ai-image-gen-overlay');
    const achievementButton = document.getElementById('achievement-button');
    const achievementOverlay = document.getElementById('achievement-overlay');
    const achievementDetailOverlay = document.getElementById('achievement-detail-overlay');
    const customAchievementManagerOverlay = document.getElementById('custom-achievement-manager-overlay');
    const customAchievementEditorOverlay = document.getElementById('custom-achievement-editor-overlay');
    const dinoGameOverlay = document.getElementById('dino-game-overlay');
    const characterCreatorOverlay = document.getElementById('character-creator-overlay');
    const peekBackgroundBtn = document.getElementById('peek-background-btn');
    const branchToggleBtn = document.getElementById('branch-toggle-btn');
    const branchingOptionsOverlay = document.getElementById('branching-options-overlay');
    const enhancementManagerOverlay = document.getElementById('enhancement-manager-overlay');
    const customAffixEditorOverlay = document.getElementById('custom-affix-editor-overlay');
    const attributeAlignmentOverlay = document.getElementById('attribute-alignment-overlay');
    const mapSelectionOverlay = document.getElementById('map-selection-overlay');
    const worldMapOverlay = document.getElementById('world-map-overlay');
    const worldMapButton = document.getElementById('world-map-button');
	const splashIoMenuOverlay = document.getElementById('splash-io-menu-overlay');
const workshopOverlay = document.getElementById('workshop-overlay');
const behaviorInteractionOverlay = document.getElementById('behavior-interaction-overlay');
const stackedHandContainer = document.getElementById('stacked-hand-container');
const cardLibraryPanel = document.getElementById('card-library-panel');
const cardLibraryGrid = document.getElementById('card-library-grid');
const cardLibraryTitle = document.getElementById('card-library-title');
const interactionChoicePanel = document.getElementById('interaction-choice-panel');
const interactionChoiceTitle = document.getElementById('interaction-choice-title');
const interactionChoiceButtons = document.getElementById('interaction-choice-buttons');
const errorReportOverlay = document.getElementById('error-report-overlay');
const trueStreamViewerOverlay = document.getElementById('true-stream-viewer-overlay');

const BACKGROUND_JSON_FILES_KEY = 'CULTIVATION_BACKGROUND_JSON_FILES_V1'; // 新增的数据库键
let backgroundJsonFiles = []; // 新增的全局变量

const WORLDBOOK_ENTRIES_KEY = 'CULTIVATION_WORLDBOOK_ENTRIES_V1';
let currentEditingWorldBookId = null;

    let currentScale = 1.0;
	lastAiStoryText = ''; // 用于保存最新的AI正文，供重绘使用
	let lastGeneratedPrompt = ''; // 【【【 新增：用于保存最新的生图提示词 】】】
    let currentState = {};
	let variableDiffHideTimer = null; // 【新增】用于自动隐藏变量变动浮窗的计时器
	let latestThinkingContent = ''; // 用于存储最新的AI思考内容
    let currentPlayerData = {};
    let inventoryItems = [];
    let surroundingCharacters = [];
    let characterDatabase = {};
    let bondedCharacters = {};
	let latestTheaterHTMLInMemory = null; // 保存小剧场
	let manualTheaterHTMLInMemory = null; // 【新增】用于暂存手动生成的小剧场内容
    let currentArchiveName = null;
    let currentViewingArchive = null;
    let actionQueue = [];
    let currentPickingSlot = {};
    let longPressTimer = null;
    let activeLogEntry = null;
    let summaryConfig = {};
    let regexConfig = {};
    let funSettings = {};
    let chatBackgroundSettings = {};
    let attributeAlignmentConfig = {};
    let fabShortcutConfig = {};
    let seenFeatures = {};
    let currentEditingRegexIndex = -1;
    let currentEditingRegexType = 'regular';
    let currentEditingMessageId = null;
    let currentEditingSnapshotLogId = null;
    let currentEditingSummary = { logId: null, type: null };
    let currentManualSegmentedLogId = null;
    let currentEditingTraitIndex = -1;
    let currentEditingBondedCharIndex = -1;
    let currentEditingCustomBirthId = null;
    let currentEditingCustomRaceId = null;
    let currentEditingAchievementId = null;
    let updatedCharacterIds = new Set();
    let currentTaskIndex = 0;
    let currentEditingCharTemplateId = null;
    let currentEditingNpcId = null;
    let enhancementState = {
        mainItem: null,
        materials: [null, null, null, null],
        pickerCallback: null,
    };
    let alchemyState = {
        materials: [null, null, null, null],
        pickerCallback: null,
    };
    let refiningState = {
        materials: [null, null, null, null],
        pickerCallback: null,
    };
    let warehouseState = {
        slots: [],
        pickerCallback: null,
        currentSlotIndex: -1,
    };
    let enhancementManagerState = {
        mainItem: null,
        sacrificeItem: null,
        pickerCallback: null
    };
    let activeDinoGame = null;
    let activeMapRenderer = null;
    let activeWorldMapRenderer = null;
const mapEditorOverlay = document.getElementById('map-editor-overlay');
let activeMapEditorRenderer = null;
let mapEditorState = {};
let WORLD_MAP_DATA = {};
const DEFAULT_MAP_KEY = 'CULTIVATION_DEFAULT_MAP_V1'; 
let currentDefaultMapArchiveName = null; 

const IMAGE_TAGGING_API_CONFIG_KEY = 'CULTIVATION_IMAGE_TAGGING_API_CONFIG_V1';
const IMAGE_TAGGING_JSON_FILES_KEY = 'CULTIVATION_IMAGE_TAGGING_JSON_FILES_V1';
let imageTaggingApiConfig = {};
let imageTaggingJsonFiles = [];


function generateDefaultImagePrompt() {

const correctPrompt = `
# 角色与目标
你是一位顶级的文学编辑与叙事优化师。你唯一且不可协商的任务，是基于通用的、专业的文学写作标准，对用户提供的叙事原文进行修订与优化。你的目标是纯粹地提升文本的文学性、清晰度、流畅度与叙事冲击力。

# 核心指令：绝对禁令大宪章
这是你本次任务的最高法则，其优先级高于一切。以下清单详尽地列出了一系列你被【绝对禁止】使用的规则、风格、词汇与创作模式。这些禁令源于一个被污染的规则集，你必须将清单中的每一个字都视为不可逾越的红线。任何形式的违反，无论多么微小，都将导致任务的彻底失败。

---
### 【一份详尽的、被完全禁止的指令清单】

#### 第一章：格式、结构与元文本禁令

*   第1条 (禁HTML式注释)：绝对禁止在文本的任何部分使用 \`<!-- consider: ... -->\` 这种HTML注释格式，或任何其他用于提供“建议”或“思考过程”的元文本标记。
*   第2条 (禁循环创作)：绝对禁止采用“模拟 -> 正文 -> 模拟...”这种分步、循环的创作流程。你的输出必须是从头至尾一次性生成的、完整且连贯的最终正文。
*   第3条 (禁字符间隔)：绝对禁止为了任何目的（例如所谓的“防止错漏”），而在中文汉字之间添加连字符\`-\`、空格或其他任何形式的分隔符。

#### 第二章：文体、句式与修辞禁令

*   第4条 (禁“不是而是”句式)：严格禁止使用“不是....，而是....”这一特定句式结构来组织句子。
*   第5条 (禁“画外音”评述)：严格禁止在任何描述性段落前后，添加具有总结、评论或解释性质的“画外音”式文字。让故事自己说话。
*   第6条 (禁特定开篇模式)：严格禁止使用“xx的xx像一颗石子丢入水中荡起了涟漪”或任何以此为核心意象的变体，作为文章、章节或段落的开场白。
*   第7条 (禁滥用特定比喻)：严格禁止在行文中刻意或频繁地使用涉及“石子”、“小兽”、“涟漪”这三个特定意象的比喻。

#### 第三章：内容、主题与情节禁令

*   第8条 (禁极端情绪导向)：严格禁止将角色的情感刻意引导、夸大或扭曲为“过于激烈以及负面”的状态。
*   第9条 (禁特定痛苦描写)：在任何场景中（尤其是亲密互动中），严格禁止着重描写“尖叫”、“表情狰狞”、“身体反弓成虾米状”等，或通过任何方式刻意强调角色的“痛苦”、“折磨”或“非自愿”感受。
*   第10条 (禁时间线操纵)：必须保持故事叙述时间的线性与连贯。严格禁止在没有原文明确铺垫的情况下，随意在过去、现在、未来之间进行无提示的闪回或预叙。
*   第11条 (禁随意操纵情节)：
    *   禁引入新角色：不得引入任何原文未提及的新人物。
    *   禁强加转折：不得为了制造“剧情转折”而粗暴地打断当前的主线叙事。
    *   禁开辟新支线：不得创造任何原文不存在的支线剧情。
    *   禁堆砌转折：不得在一篇回复中人为地制造多次（如“至少三次”）剧情转折。
*   第12条 (禁文风与语言混合)：
    *   文风：严格禁止在故事中插入“学术报告”、“数据汇报”、“技术文档”等非叙事文体，同时禁用与故事背景不符的科幻或专业词汇（如：“量子”、“风暴”、“宇宙”、“机器人”）。
    *   语言：严格禁止在中文文本中夹杂任何外语单词或短语（包括但不限于英语、日语、葡萄牙语、西班牙语、俄语等）。
*   第13条 (禁数值与逻辑错误)：在处理任何涉及数字、计算或逻辑推理的内容时，必须保持其准确性，严格禁止出现计算错误或逻辑矛盾。

#### 第四章：绝对禁绝词汇表 (来自“八股文”语料库)

你被【绝对禁止】在最终输出的文本中使用以下列表中的【任何一个】词汇、短语或其任何形式的变体。此列表拥有最高否决权：

\`一丝, 石子, 泛白, 禁忌, 弧度, 狡黠, 呜咽, 羽毛, 搔刮, 压抑, 指节发白, 锁骨, 嘶吼, 野兽般, 暧昧, 欲望, 小猫爪子, 弓, 涟漪, 屁股蛋子, 不容质疑, 几不可查, 不易察觉, 圣物, 虔诚, 信徒, 宛若神明, 恶魔, 不容错辨, 不容查查, 几不可闻, 难以察觉, 难以察察, 不容抗拒, 献祭, 仪式, 国王, 沙哑, 温热, 灭顶, 小兽, 古井, 巨石, 巨浪, 充满了惩罚性与占有欲, 狂风暴雨般的, 铺天盖地的, 像溺水之人抓住浮木一般, 淬毒的刀子一样, 一颗, 两颗, 三颗盘扣, 审判, 征服, 毁天灭地, 冰雹, 生理性, 细若蚊呐, 麻木, 屈辱, 四肢百骸, 手术刀, cố gắng, 慵懒, 嘶哑, 磁性, 深沉, 言简意赅, 征服, 支配, 占有, 乐章, 简短有力, 命令, 没有说话, 凝固, 戏谑, 恼怒, 侵略性, 骨节, 深渊, почти, 仿佛, 陷入, 如同, 就像, 木讷, 细若蚊呐, 困惑, 恐惧, 绝望, 眼神空洞, 毫无生气, 勾起, 嘴角什么什么弧度, 若有若无, 生理性的, 心湖, 弓起, 崇拜, 狂热, 粗暴, 画圈, 研磨, 扣子, 鲜明的对比, 魔鬼, 氤氲, 提线木偶, 潮湿季节里疯长的有毒藤蔓, 并不存在的, 揉入骨血, 穿云裂石的尖叫, 甬道, 痉挛, 随之抖动, 雨后青草一般的, 低笑, 长年xx的薄茧, 像根针一样扎进, 水光潋滟, subtly, gently, 无意识的勾住, 不自觉的绞在一起, 一顿, 裹挟着糖, playfully, amused, 细密的汗珠, 袅袅热气, 几乎看不见, 不经意间, 薄茧, 旖旎, 小猫, 微哑, 无奈又宠溺\`
---

# 思考与执行步骤
1.  研读任务: 深度理解你的唯一使命——作为顶级文学编辑，仅优化用户提供的叙事原文。
2.  内化禁令: 仔细阅读并完全内化上述【绝对禁令大宪章】的每一章节、每一条款。将这份清单作为你思维的边界。
3.  执行优化: 对用户提供的叙事原文进行专业的文学性修订。
4.  符号检查：检查文本的符号是否合理连贯？若有明显不合理/增多/乱写的符号请务必修正。
5.  最终审查: 在生成最终回复前，你必须在内部启动一次严格的、逐条的自我审查流程，确保你的修改稿完全没有触犯【绝对禁令大宪章】中的任何一条规则，特别是详尽的禁绝词汇表。若有触犯，必须返回修正，直至完全合规。
6.  生成输出: 生成最终的、纯净的文本。

# 输入文本
\${story_text}

# 输出格式铁律
1.  你的最终输出必须且只能是经过优化和修订后的纯粹剧情原文。
2.  绝对禁止包含任何形式的元文本，包括但不限于：任何评论、解释、总结、标题、标签、前言、后记、或者对你所做修改的说明。
3.  你的回复中，除了优化后的剧情原文，不应出现任何其他字符。

现在，请严格遵循以上所有规则，处理以下剧情原文，并返回带有正文优化的新剧情文本。不要输出任何与新剧情文本无关的内容。
【规则文件】:
\${json_context}
---
【当前游戏状态】:
\${state_snapshot}
请立即开始处理。
*/`;




    return correctPrompt;
}

async function fetchImageTaggingModels() {
const apiUrl = document.getElementById('image-tagging-api-url').value.trim();
const apiKey = document.getElementById('image-tagging-api-key').value.trim();

const modelSelect = document.getElementById('image-tagging-api-model');
const btn = document.getElementById('fetch-image-tagging-models-btn');

if (!apiUrl || !apiKey) {
await showCustomAlert('请先填写 API URL 和 API Key。');
return;
}

btn.disabled = true;
btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 获取中...';

try {
        // 发送请求到兼容OpenAI的 /models 接口
        const response = await fetch(`${apiUrl}/models`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        // 处理错误响应
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API 请求失败 (${response.status}): ${errorData.error?.message || '未知错误'}`);
        }

        const data = await response.json();
        const models = data.data || [];
        const modelIds = models.map(model => model.id).filter(id => id.trim()); // 过滤掉空ID

        modelSelect.innerHTML = '';
if (modelIds.length > 0) {
modelIds.forEach(modelId => {
const option = document.createElement('option');
option.value = modelId;
option.textContent = modelId;
modelSelect.appendChild(option);
});


if (imageTaggingApiConfig.apiModel && modelIds.includes(imageTaggingApiConfig.apiModel)) {
modelSelect.value = imageTaggingApiConfig.apiModel;
} else {
modelSelect.value = modelIds[0];
imageTaggingApiConfig.apiModel = modelSelect.value; 
}
await showCustomAlert(`成功获取 ${modelIds.length} 个可用模型！`);
} else {
await showCustomAlert('此 API 未返回可用模型列表。');
modelSelect.innerHTML = '<option value="" disabled selected>未获取到模型</option>'; // 添加一个禁用选项
imageTaggingApiConfig.apiModel = ''; 
}

} catch (error) {
console.error('获取模型列表失败:', error);
await showCustomAlert(`获取模型列表失败: ${error.message}`);
} finally {
btn.disabled = false;
btn.innerHTML = '<i class="fas fa-sync-alt"></i> 获取可用模型';
}
}


async function manageImageTaggingApiSettings() {
const defaultConfig = {
enabled: false,
apiUrl: '',
apiKey: '',
apiModel: '',
promptTemplate: generateDefaultImagePrompt()
};

try {
const savedConfig = await dbGet(IMAGE_TAGGING_API_CONFIG_KEY);
imageTaggingApiConfig = { ...defaultConfig, ...savedConfig };

document.getElementById('image-tagging-api-enabled-toggle').checked = imageTaggingApiConfig.enabled;
document.getElementById('image-tagging-api-url').value = imageTaggingApiConfig.apiUrl || '';
document.getElementById('image-tagging-api-key').value = imageTaggingApiConfig.apiKey || '';
document.getElementById('image-tagging-api-prompt-template').value = imageTaggingApiConfig.promptTemplate || defaultConfig.promptTemplate;


const modelSelect = document.getElementById('image-tagging-api-model');
modelSelect.innerHTML = ''; 
if (imageTaggingApiConfig.apiModel) {

const option = document.createElement('option');
option.value = imageTaggingApiConfig.apiModel;
option.textContent = imageTaggingApiConfig.apiModel;
modelSelect.appendChild(option);
modelSelect.value = imageTaggingApiConfig.apiModel; 
} else {

const option = document.createElement('option');
option.value = '';
option.textContent = '请获取可用模型';
option.disabled = true;
option.selected = true;
modelSelect.appendChild(option);
}

} catch (e) {
console.error("加载正文优化API配置失败:", e);
imageTaggingApiConfig = { ...defaultConfig };
document.getElementById('image-tagging-api-prompt-template').value = defaultConfig.promptTemplate;
}

const restoreBtn = document.getElementById('restore-tagging-defaults-btn');
if (restoreBtn && !restoreBtn.dataset.listenerAttached) {
restoreBtn.addEventListener('click', async () => {
if (await showCustomConfirm('确定要恢复默认指令模板并清空已导入的规则文件列表吗？')) {
document.getElementById('image-tagging-api-prompt-template').value = generateDefaultImagePrompt();
imageTaggingJsonFiles = [];
renderTextImageJsonList();
showCustomAlert('已恢复默认设置！请记得点击下方的“保存”按钮以生效。');
}
});
restoreBtn.dataset.listenerAttached = 'true';
}
}

async function saveImageTaggingApiConfig() {
try {
const configToSave = {
enabled: document.getElementById('image-tagging-api-enabled-toggle').checked,
apiUrl: document.getElementById('image-tagging-api-url').value.trim(),
apiKey: document.getElementById('image-tagging-api-key').value,
apiModel: document.getElementById('image-tagging-api-model').value, 
promptTemplate: document.getElementById('image-tagging-api-prompt-template').value
};
imageTaggingApiConfig = configToSave;
await dbSet(IMAGE_TAGGING_API_CONFIG_KEY, configToSave);
showDanmaku('正文优化API配置已保存！', 'success');
document.getElementById('image-tagging-api-settings-overlay').classList.remove('visible');
} catch (error) {
console.error("保存正文优化API配置失败:", error);
showDanmaku(`配置保存失败: ${error.message}`, 'error');
}
}

async function loadTextImageJsonFiles() {
    try {
        imageTaggingJsonFiles = await dbGet(IMAGE_TAGGING_JSON_FILES_KEY) || [];
        imageTaggingJsonFiles.forEach(file => {
            if (file.active === undefined) file.active = true;
        });
    } catch (e) {
        console.error("加载导入的JSON文件失败:", e);
        imageTaggingJsonFiles = [];
    }
    renderTextImageJsonList();
}



function renderTextImageJsonList() {
    const listEl = document.getElementById('image-tagging-json-list');
    if (!listEl) return;

    // 1. 清空旧列表
    listEl.innerHTML = '';

    // 2. 处理列表为空的情况
    if (imageTaggingJsonFiles.length === 0) {
        listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">暂无导入的规则文件。</p>';
        return;
    }

    // 3. 遍历并渲染每一项，增加删除按钮
    imageTaggingJsonFiles.forEach((file, index) => {
        const itemEl = document.createElement('div');
        // 复用现有的 .regex-rule-item 样式，以保持UI一致性
        itemEl.className = 'regex-rule-item';

        // 新的HTML结构：移除复选框，在右侧添加一个删除按钮
        itemEl.innerHTML = `
            <span class="rule-name" style="flex-grow: 1;">${sanitizeHTML(file.name)}</span>
            <div class="rule-actions">
                <label class="switch" title="启用/禁用此规则文件">
                    <input type="checkbox" class="json-active-toggle" data-index="${index}" ${file.active ? 'checked' : ''}>
                    <span class="slider round"></span>
                </label>
                <button class="json-delete-btn" data-index="${index}" title="删除此规则文件" style="border-color: #e57373; color: #e57373; width:28px; height:28px; border-radius:50%; background:none; cursor:pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        listEl.appendChild(itemEl);
    });

    // 4. 使用事件委托来处理所有子项的点击事件，这是最高效的方式
    listEl.addEventListener('click', async (event) => {
        const target = event.target;
        
        // 处理“启用/禁用”开关的切换
        if (target.classList.contains('json-active-toggle')) {
            const index = parseInt(target.dataset.index);
            if (isNaN(index) || !imageTaggingJsonFiles[index]) return;
            
            imageTaggingJsonFiles[index].active = target.checked;
            await dbSet(IMAGE_TAGGING_JSON_FILES_KEY, imageTaggingJsonFiles);
            showDanmaku(`规则文件 "${imageTaggingJsonFiles[index].name}" 已${target.checked ? '启用' : '禁用'}`, 'success');
        }

        // 处理新增加的“删除”按钮的点击
        const deleteButton = target.closest('.json-delete-btn');
        if (deleteButton) {
            const index = parseInt(deleteButton.dataset.index);
            if (isNaN(index) || !imageTaggingJsonFiles[index]) return;

            const fileToDelete = imageTaggingJsonFiles[index];
            
            // 弹出确认对话框，防止误删
            if (await showCustomConfirm(`确定要永久删除规则文件 "${fileToDelete.name}" 吗？`)) {
                // 从数组中移除该项
                imageTaggingJsonFiles.splice(index, 1);
                // 将更新后的数组保存回数据库
                await dbSet(IMAGE_TAGGING_JSON_FILES_KEY, imageTaggingJsonFiles);
                // 重新渲染列表
                renderTextImageJsonList();
                showDanmaku(`文件 "${fileToDelete.name}" 已删除。`, 'success');
            }
        }
    });
}


let imageTaggingApiController = null; 

async function callImageTaggingApi(storyText, stateSnapshotString) {
console.log('[callImageTaggingApi] ✨ 正文优化 已启动，接收到需要处理的文本。');

if (!storyText || typeof storyText !== 'string' || storyText.trim() === '') {
console.warn('[callImageTaggingApi] 警告：传入的文本为空，已跳过处理。');
return { success: false, text: storyText, skipped: true, reason: 'Input text was empty' };
}

const { enabled, apiUrl, apiKey, apiModel, promptTemplate } = imageTaggingApiConfig;

if (!enabled) {
console.log("[callImageTaggingApi] 提前返回：因为 imageTaggingApiConfig.enabled 为 false。");
return { success: false, text: storyText, skipped: true, reason: 'API is disabled' };
}

let statusDanmaku = null;
imageTaggingApiController = new AbortController(); 
const signal = imageTaggingApiController.signal; 

try {
statusDanmaku = showDanmaku('正在生成正文优化...', 'status', imageTaggingApiController); // 【修改】传递 AbortController

let finalPromptTemplate = '';
const promptFromConfig = promptTemplate ? promptTemplate.trim() : '';

if (promptFromConfig) {
finalPromptTemplate = promptFromConfig;
console.log('[callImageTaggingApi] 检测到已保存的自定义模板，已优先采用。');
} else {
finalPromptTemplate = generateDefaultImagePrompt();
console.log('[callImageTaggingApi] 已保存的模板为空，已采用内置的默认模板。');
}

const activeJsonContents = imageTaggingJsonFiles
.filter(file => file.active)
.map(file => file.content)
.join('\n\n');

const finalPrompt = finalPromptTemplate
.replace(/\${json_context}/g, activeJsonContents)
.replace(/\${story_text}/g, storyText)
.replace(/\${state_snapshot}/g, stateSnapshotString || '');

console.log("--- [正文优化API] 发送的完整上下文 ---");
console.log("快照数据:", stateSnapshotString);
console.log("最终Prompt:", finalPrompt);
console.log("---------------------------------");

const processedText = await genericApiCall(apiUrl, apiKey, apiModel, finalPrompt, signal); // 【修改】传递信号

if (signal.aborted) { // 【新增】检查是否被取消
console.log("正文优化API请求被主动中止。");
return { success: false, text: storyText, skipped: true, reason: 'Request aborted' };
}

console.log('%c[callImageTaggingApi] 收到API的完整响应数据:', 'color: lightblue; font-weight: bold;', processedText);

if (!processedText) {
console.warn('[callImageTaggingApi] API响应内容为空，将返回带有特殊标记的结果。');
return { success: true, text: storyText, isEmptyResponse: true };
}

console.log('[callImageTaggingApi] ✨ API处理成功，函数执行完毕。');
return { success: true, text: processedText.trim() };

} catch (error) {
if (error.name === 'AbortError') { 
console.log("正文优化API请求被用户取消。");
showDanmaku('正文优化API请求已取消。', 'world');
return { success: false, text: storyText, skipped: true, reason: 'Request aborted by user' };
} else {
console.error('[callImageTaggingApi] 在执行过程中捕获到严重错误:', error);
showDanmaku(`正文优化API错误: ${error.message}`, 'error');
return { success: false, text: storyText, error: error.message };
}
} finally {
if (statusDanmaku) {
statusDanmaku.remove();
}
imageTaggingApiController = null; 
}
}


    function sanitizeHTML(htmlString) {
        let sanitized = String(htmlString).replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, '');
        sanitized = sanitized.replace(/\s(on\w+)=["'][^"']*["']/gi, '');
        return sanitized;
    }

function convertSimpleMarkdown(text) {
if (!text) return '';
let processedText = text;


processedText = processedText.replace(/~~(.*?)~~/g, (match, p1) => `<del>${p1}</del>`);


processedText = processedText.replace(/\*\*(.*?)\*\*|__(.*?)__/g, (match, p1, p2) => `<strong>${p1 || p2}</strong>`);


processedText = processedText.replace(/\*([^\*]+?)\*|_([^_]+?)_/g, (match, p1, p2) => `<em>${p1 || p2}</em>`);


processedText = processedText.replace(/`([^`]+?)`/g, (match, p1) => `<code>${p1}</code>`);

return processedText;
}

    function enforceRenderLimit() {
        const limit = regexConfig.renderLimit || 100;
        const messages = mainContentArea.querySelectorAll('.log-entry');
        if (messages.length > limit) {
            const toRemove = messages.length - limit;
            for(let i = 0; i < toRemove; i++) {
                messages[i].remove();
            }
        }
    }
	

function createLogEntryElement(logData, type) {
const isSummary = (typeof logData !== 'string' && (logData.content.startsWith('[天道总结:') || logData.content.includes('<h4>天道初启</h4>')));
const logEntry = document.createElement('div');
logEntry.classList.add('log-entry', type);
if (isSummary) {
logEntry.classList.add('summary');
}
let content = (typeof logData === 'string') ? logData : logData.content;
const id = (typeof logData === 'string') ? null : logData.id;
if (id) {
logEntry.dataset.logId = id;
}

let finalContent = content;

if (type === 'ai') {
finalContent = convertSimpleMarkdown(content);
}


logEntry.innerHTML = sanitizeHTML(finalContent);

return logEntry;
}
    function addMessageToLog(logData, type) {
const logEntry = createLogEntryElement(logData, type);
mainContentArea.appendChild(logEntry);
enforceRenderLimit();
return logEntry;
}

    function parseRemarksString(str) {
        return (str || '').split('|').reduce((acc, part) => {
            const firstColonIndex = part.indexOf(':');
            if (firstColonIndex > -1) {
                const key = part.substring(0, firstColonIndex).trim();
                const value = part.substring(firstColonIndex + 1).trim();
                if (key) acc[key] = value;
            }
            return acc;
        }, {});
    }
    
    function serializeRemarksObject(remarksObj) {
return Object.entries(remarksObj)
.filter(([key, value]) => value !== undefined && value !== null)
.map(([key, value]) => {
if (typeof value === 'object' && value !== null) {
value = JSON.stringify(value);
}
return `${key}:${value}`;
})
.join('|');
}

    function serializeCharacterRemarks(char, forAI = false) {
        const remarks = {
            年龄: char.age,
            寿元: char.shouyuan,
        };

        if (char.id === 'B1') {
            remarks['灵根'] = char.linggen;
            remarks['善恶值'] = char.shanE;
            remarks['修为进度'] = `${char.progress}%`;
            remarks['hp'] = `${char.hp.current}/${char.hp.max}`;
            remarks['traits'] = JSON.stringify(char.playerTraits);
            remarks['avatar'] = char.avatarAppearance;
            if (!forAI) {
                remarks['equipment'] = JSON.stringify({
                    weapon: char.weapon,
                    armor: char.armor,
                    technique: char.technique,
                    treasure: char.treasure,
                });
                remarks['isExtreme'] = char.isExtreme;
                remarks['warehouse'] = JSON.stringify(char.warehouse);
                remarks['deathCount'] = char.deathCount;
            }
        } else {
                remarks['equipment'] = JSON.stringify({
                weapon: char.weapon,
                armor: char.armor,
                technique: char.technique,
                treasure: char.treasure,
            });
            remarks['inventory'] = JSON.stringify(char.inventoryItems);
            remarks['skills'] = JSON.stringify(char.skills);
            remarks['traits'] = JSON.stringify(char.npcTraits);
        }

        if (char.isBonded) {
            remarks['isBonded'] = 'true';
        }
        if (char.deeds) {
            remarks['deeds'] = char.deeds;
        }

        return serializeRemarksObject(remarks);
    }

    function getTableIndexFromId(id) {
        if (!id) return null;
        const prefix = id.charAt(0);
        switch(prefix) {
            case 'B':
            case 'C':
            case 'G':
                return '0'; // Characters
            case 'I':
                return '1'; // Inventory
            case 'E':
                return '9'; // Equipment
            case 'T':
                return '6'; // Tasks
            case 'S':
                return '8'; // Skills
            case 'W': // World Events
                return '5';
            case 'P': // Spirit Beasts
                return '7';
            default:
                return null;
        }
    }

function applyChanges(baseState, delta) {
    if (!delta) {
        console.log("applyChanges: 收到的 delta 为空，无需应用任何变量变更。");
        return baseState;
    }
    const newState = JSON.parse(JSON.stringify(baseState));
    delta.forEach(op => {
        try {
            const { command, id, data, eventData, attribute, value, slot, item, locationData, regionData, locationId } = op;
            if (command === 'add' && id === TIME_LOCATION_ROW_ID) {
                const timeRow = (newState['4'] || []).find(row => row.id === TIME_LOCATION_ROW_ID) || newState['4'][0];
                if (timeRow) {
                    Object.assign(timeRow, data);
                }
                return;
            }
            if (command === 'createLocation') {
                if (locationData.type === 'poi') {
                    WORLD_MAP_DATA.points_of_interest.push(locationData.data);
                } else if (locationData.type === 'sub_region') {
                    WORLD_MAP_DATA.sub_regions.push(locationData.data);
                } else if (locationData.type === 'main_region') {
                    WORLD_MAP_DATA.main_regions.push(locationData.data);
                }
                return;
            }
            if (command === 'updateRegion') {
                const regionToUpdate = WORLD_MAP_DATA.main_regions.find(r => r.name === regionData.name) || WORLD_MAP_DATA.sub_regions.find(r => r.name === regionData.name);
                if (regionToUpdate) {
                    regionToUpdate.points = regionData.points;
                }
                return;
            }
            if (command === 'deleteLocation') {
                WORLD_MAP_DATA.points_of_interest = WORLD_MAP_DATA.points_of_interest.filter(p => p.name !== locationId);
                return;
            }
            const tableIndex = getTableIndexFromId(id || data?.['0']);
            if (tableIndex === null && command !== 'addWorldEvent') {
                console.error("无法从ID确定表格索引:", op);
                return;
            }
            if (!newState[tableIndex]) newState[tableIndex] = {};
            switch (command) {
                case 'set': {
                    const processedData = recursivelyParseJsonStrings(data);
                    
                    const idToSet = processedData['0'];
                    if (!idToSet) {
                        console.error('`set`指令缺少ID:', processedData);
                        return;
                    }
                    
                    const table = newState[tableIndex];
                    if (processedData['9'] && typeof processedData['9'] === 'object') {
                        processedData['9'] = serializeRemarksObject(processedData['9']);
                    }
                    if (processedData['11'] && typeof processedData['11'] === 'object') {
                        processedData['11'] = JSON.stringify(processedData['11']);
                    }
                    if (table && table[idToSet]) {
                        Object.assign(table[idToSet], processedData);
                    } else {
                        table[idToSet] = processedData;
                    }
                    break;
                }
                case 'add': {
                    if (!newState[tableIndex] || !newState[tableIndex][id]) {
                        console.warn(`'add' 指令失败: 找不到ID为 ${id} 的目标。`);
                        return;
                    }
                    const targetRow = newState[tableIndex][id];

                    if (data['11']) {
                        const newAttributesPartial = recursivelyParseJsonStrings(data['11']);
                        
                        if (newAttributesPartial.hp || newAttributesPartial.血量) {
                            const hpUpdate = newAttributesPartial.hp || newAttributesPartial.血量;
                            if (hpUpdate.current !== undefined && hpUpdate.max !== undefined) {
                                const originalRemarks = parseRemarksString(targetRow['9'] || '');
                                originalRemarks['hp'] = `${hpUpdate.current}/${hpUpdate.max}`;
                                targetRow['9'] = serializeRemarksObject(originalRemarks);
                            }
                            delete newAttributesPartial.hp;
                            delete newAttributesPartial.血量;
                        }
                        
                        const oldAttributes = JSON.parse(targetRow['11'] || '{}');
                        
                        for (const key in newAttributesPartial) {
                            const change = newAttributesPartial[key];
                            if (typeof change === 'object' && change !== null && ('current' in change || 'max' in change)) {
                                if (!oldAttributes[key]) oldAttributes[key] = { current: 0, max: 0 };
                                if (typeof change.current === 'number') oldAttributes[key].current = change.current;
                                if (typeof change.max === 'number') oldAttributes[key].max = change.max;
                            } else if (typeof change === 'number') {
                                if (!oldAttributes[key]) oldAttributes[key] = { current: 0, max: 0 };
                                oldAttributes[key].current += change;
                            }
                            if (oldAttributes[key]) {
                                oldAttributes[key].current = Math.min(oldAttributes[key].current, oldAttributes[key].max);
                            }
                        }
                        targetRow['11'] = JSON.stringify(oldAttributes);
                    }
                    if (data['9']) {
                        const originalRemarks = parseRemarksString(targetRow['9'] || '');
                        const newRemarksData = recursivelyParseJsonStrings(data['9']);
                        if (newRemarksData.equipment && originalRemarks.equipment) {
                            try {
                                const oldEquipment = parseNestedJsonString(originalRemarks.equipment, {});
                                const mergedEquipment = { ...oldEquipment, ...newRemarksData.equipment };
                                newRemarksData.equipment = mergedEquipment;
                            } catch (e) {
                                console.error("在合并NPC装备时解析旧数据失败:", e);
                            }
                        }
                        
                        const mergedRemarks = { ...originalRemarks, ...newRemarksData };
                        targetRow['9'] = serializeRemarksObject(mergedRemarks);
                    }
                    
                    for (const key in data) {
                        if (key !== '9' && key !== '11') {
                            targetRow[key] = data[key];
                        }
                    }
                    break;
                }
                case 'updateAttribute':
                    if (newState[tableIndex] && newState[tableIndex][id]) {
                        const charRow = newState[tableIndex][id];

                        if (attribute === 'hp' || attribute === '血量') {
                            if (value.current !== undefined && value.max !== undefined) {
                                const originalRemarks = parseRemarksString(charRow['9'] || '');
                                originalRemarks['hp'] = `${value.current}/${value.max}`;
                                charRow['9'] = serializeRemarksObject(originalRemarks);
                            }
                        } else {
                            let attributes = {};
                            try {
                                attributes = JSON.parse(charRow['11'] || '{}');
                            } catch(e) {}
                            if (!attributes[attribute]) {
                                attributes[attribute] = { current: 0, max: 0 };
                            }
                            if (typeof value.current === 'number') {
                                attributes[attribute].current = value.current;
                            }
                            if (typeof value.max === 'number') {
                                attributes[attribute].max = value.max;
                            }
                            attributes[attribute].current = Math.min(attributes[attribute].current, attributes[attribute].max);
                            charRow['11'] = JSON.stringify(attributes);
                         }
                    }
                    break;
                case 'de':
                    if (newState[tableIndex] && newState[tableIndex][id]) {
                         if (tableIndex === '0' && (id.startsWith('C') || id.startsWith('G'))) {
                            const charToDelete = newState[tableIndex][id];
                            const itemIdsToDelete = new Set();
                            try {
                                const remarks = parseRemarksString(charToDelete['9'] || '');
                                if (remarks.equipment) {
                                    const equipment = JSON.parse(remarks.equipment);
                                    Object.values(equipment).forEach(slotArray => {
                                        (slotArray || []).forEach(item => {
                                            if (item && item.id) {
                                                itemIdsToDelete.add(item.id);
                                            }
                                        });
                                    });
                                }
                                if (remarks.inventory) {
                                    const inventory = JSON.parse(remarks.inventory);
                                    inventory.forEach(item => {
                                        const itemId = item.id || item['0'];
                                        if (itemId) {
                                            itemIdsToDelete.add(itemId);
                                        }
                                    });
                                }
                            } catch (e) {
                                console.error(`解析被删除角色 ${id} 的物品时出错:`, e);
                            }
                            delete newState[tableIndex][id];
                            if (newState['1']) {
                                itemIdsToDelete.forEach(itemId => {
                                    if (newState['1'][itemId]) {
                                        delete newState['1'][itemId];
                                    }
                                });
                            }
                            showDanmaku(`人物 ${charToDelete['1']?.split('|')[0] || id} 已被移除`, 'npc');
                        } else {
                            const item = newState[tableIndex][id];
                            const itemName = item ? (item['1'] || '未知物品') : '未知物品';
                            delete newState[tableIndex][id];
                            if (id.startsWith('I')) {
                                showDanmaku(`失去物品: ${itemName}`, 'item');
                            } else {
                                showDanmaku('世界发生了一些变化', 'world');
                            }
                        }
                    }
                    break;
                case 'equipItem':
                    if (newState['0'][id]) {
                        const newItemData = item.data;
                        if (id === 'B1' && !newState['1'][newItemData['0']]) {
                            newState['1'][newItemData['0']] = newItemData;
                        }
                        const processedItem = {
                            id: newItemData['0'], name: newItemData['1'], type: newItemData['2'],
                            description: newItemData['3'], effect: newItemData['4'],
                            quantity: parseInt(newItemData['5'] || '1')
                        };
                        const charRow = newState['0'][id];
                        const remarks = parseRemarksString(charRow['9'] || '');
                        let equipment = {};
                        try { equipment = JSON.parse(remarks.equipment || '{}'); } catch(e) {}
                        if (!equipment[slot]) {
                            equipment[slot] = Array(6).fill(null);
                        }
                        equipment[slot][item.index] = processedItem;
                        remarks['equipment'] = JSON.stringify(equipment);
                        charRow['9'] = serializeRemarksObject(remarks);
                    }
                    break;
                case 'unequipItem':
                     if (newState['0'][id]) {
                        const charData = characterDatabase[id];
                        if (charData && charData[slot]) {
                            charData[slot][item.index] = null;
                        }
                    }
                    break;
                case 'addWorldEvent':
                    if (!newState['5']) newState['5'] = [];
                    newState['5'].push(eventData);
                    showDanmaku('世界大事记更新', 'world');
                    break;
            }
        } catch (e) {
            console.error('应用更改时出错:', op, e);
        }
    });

    const initialNpcPrompts = {};
    Object.values(baseState['0'] || {}).forEach(char => {
        if (char['0'].startsWith('C') || char['0'].startsWith('G')) {
            initialNpcPrompts[char['0']] = char['19'] || '';
        }
    });
    const finalNpcPrompts = {};
    Object.values(newState['0'] || {}).forEach(char => {
        if (char['0'].startsWith('C') || char['0'].startsWith('G')) {
            finalNpcPrompts[char['0']] = char['19'] || '';
        }
    });
    updatedCharacterIds.clear(); 
    for (const charId in finalNpcPrompts) {
        const initialPrompt = initialNpcPrompts[charId] || '';
        const finalPrompt = finalNpcPrompts[charId] || '';
        if (finalPrompt && (!initialNpcPrompts.hasOwnProperty(charId) || initialPrompt.trim() !== finalPrompt.trim())) {
            updatedCharacterIds.add(charId);
        }
    }
    return newState;
}



    function extractCommands(text) {
        const commands = [];
        const commandRegex = /(add|set|de|addWorldEvent|addSmallSummary|addLargeSummary|updateAttribute|equipItem|unequipItem|createLocation|updateRegion|deleteLocation)\s*\(/g;
        let match;

        while ((match = commandRegex.exec(text)) !== null) {
            const commandName = match[1];
            const startIndex = match.index + commandName.length;
            let openParens = 0;
            let endIndex = -1;

            for (let i = startIndex; i < text.length; i++) {
                if (text[i] === '(') {
                    openParens++;
                } else if (text[i] === ')') {
                    openParens--;
                    if (openParens === 0) {
                        endIndex = i;
                        break;
                    }
                }
            }

            if (endIndex !== -1) {
                const fullCommand = text.substring(match.index, endIndex + 1);
                commands.push(fullCommand);
                commandRegex.lastIndex = endIndex;
            }
        }
        return commands;
    }

 
        function parseNestedJsonString(str, fallback = []) {
            // 如果输入不是字符串或为空，直接返回默认值
            if (typeof str !== 'string' || !str) {
                // 如果输入本身就是我们期望的格式，直接返回它
                if (typeof str === 'object' && str !== null) return str;
                return Array.isArray(fallback) ? [...fallback] : fallback;
            }

            let current = str;
            
            try {
                // 循环解析，处理多层字符串化
                for (let i = 0; i < 5; i++) { 
                    let tempStr = current;

                    // 1. 移除最外层的引号（如果存在）
                    // 检查是否是 " [...] " 或 ' [...] ' 的形式
                    if ((tempStr.startsWith('"') && tempStr.endsWith('"')) || (tempStr.startsWith("'") && tempStr.endsWith("'"))) {
                        tempStr = tempStr.substring(1, tempStr.length - 1);
                    }

                    // 2. 修复AI常见的错误转义：将 \\" 替换回 "
                    // 这一步至关重要！
                    tempStr = tempStr.replace(/\\"/g, '"');

                    // 3. 尝试解析
                    const parsed = JSON.parse(tempStr);

                    // 4. 检查结果
                    if (typeof parsed !== 'string') {
                        // 成功解析为对象或数组，这就是最终结果
                        return parsed; 
                    }
                    
                    // 如果结果仍然是字符串，继续下一轮循环
                    current = parsed; 
                }
                
                // 如果循环多次仍然是字符串，说明数据有问题，返回fallback
                return Array.isArray(fallback) ? [...fallback] : fallback;

            } catch (e) {
                // 任何一步解析失败，都返回fallback
                console.warn(`解析嵌套JSON失败: "${str}"`, e);
                return Array.isArray(fallback) ? [...fallback] : fallback;
            }
        }

        function recursivelyParseJsonStrings(data) {
            if (typeof data === 'string') {
                const trimmedString = data.trim();
                if ((trimmedString.startsWith('{') && trimmedString.endsWith('}')) || (trimmedString.startsWith('[') && trimmedString.endsWith(']'))) {
                    try {
                        // 【关键修正】: 尝试将所有单引号替换为双引号，以修复不规范的JSON字符串
                        const validJsonString = trimmedString.replace(/'/g, '"');
                        const parsedData = JSON.parse(validJsonString);
                        // 递归调用，处理更深层次的嵌套
                        return recursivelyParseJsonStrings(parsedData);
                    } catch (e) {
                        // 如果修复后仍然解析失败，返回原始字符串以防数据丢失
                        console.warn(`recursivelyParseJsonStrings 即使在修复引号后也解析失败:`, data, e);
                        return data;
                    }
                }
            }
            else if (Array.isArray(data)) {
                return data.map(item => recursivelyParseJsonStrings(item));
            }
            else if (typeof data === 'object' && data !== null) {
                for (const key in data) {
                    if (Object.hasOwnProperty.call(data, key)) {
                        data[key] = recursivelyParseJsonStrings(data[key]);
                    }
                }
            }
            return data;
        }

function parseTableEditCommands(commandsString, errorMessages = []) {
const delta = [];
let smallSummary = null;
let largeSummary = null;

// 1. 使用您已有的 extractCommands 函数提取出所有独立的指令字符串
const commands = extractCommands(commandsString);

commands.forEach(commandStr => {
const match = commandStr.match(/^(\w+)\(([\s\S]*)\)$/);
if (!match) {
errorMessages.push({
title: "指令基本格式错误",
details: `无法解析指令 "${commandStr}"。它缺少了正确的 "command(...)" 结构。`
});
return; // 跳过这个格式错误的指令
}

const command = match[1];
let argsString = match[2].trim();

// 【核心修复】预处理：修复AI生成的嵌套JSON引号错误
// 错误示例: "11": "{"a":1}" -> 修复为: "11": {"a":1}
// 错误示例: "inventory": "[{"a":1}]" -> 修复为: "inventory": [{"a":1}]
try {
// 1. 修复对象开头: ": "{ -> ": {
argsString = argsString.replace(/":\s*"(?=\{)/g, '": ');
// 2. 修复对象结尾: }" -> } (仅当后面跟着逗号或大括号时)
argsString = argsString.replace(/}"(?=\s*[,}])/g, '}');

// 3. 修复数组开头: ": "[ -> ": [
argsString = argsString.replace(/":\s*"(?=\[)/g, '": ');
// 4. 修复数组结尾: ]" -> ]
argsString = argsString.replace(/]"(?=\s*[,}])/g, ']');
} catch (e) {
console.warn("尝试自动修复JSON引号时出错 (非致命):", e);
}

try {
let args; // 用来存放解析后的参数数组

// 【核心修复】更健壮的解析策略
try {
// 策略A: 尝试标准 JSON.parse
switch(command) {
case 'set':
case 'addSmallSummary':
case 'addLargeSummary':
case 'de':
case 'createLocation':
case 'updateRegion':
case 'deleteLocation':
args = [JSON.parse(argsString)];
break;

case 'add':
case 'updateAttribute':
case 'equipItem':
case 'unequipItem':
case 'addWorldEvent':
// 多参数指令，包装成数组解析
args = JSON.parse(`[${argsString}]`);
break;

default:
throw new Error(`未知的指令类型 "${command}"`);
}
} catch (jsonError) {
// 策略B: 如果标准解析失败（例如AI用了单引号），尝试宽松的 eval 解析
// console.warn(`标准JSON解析失败，尝试宽松解析: ${commandStr}`, jsonError);
try {
const evalStr = (command === 'set' || command === 'de' || command.includes('Location') || command.includes('Summary'))
? `[${argsString}]` // 单参数也包一层数组以便统一处理
: `[${argsString}]`;

// 使用 new Function 代替 eval，相对安全一点，能处理 {a:1} 这种非标准JSON
args = new Function("return " + evalStr)();
} catch (evalError) {
// 如果宽松解析也失败，抛出原始的 JSON 错误，因为它通常描述得更准确
throw jsonError;
}
}

// 3. 根据解析出的参数数组 `args` 来构建 delta
let data, id, attribute, value, slot, item;
switch(command) {
case 'addSmallSummary':
smallSummary = args[0];
break;
case 'addLargeSummary':
largeSummary = args[0];
break;
case 'addWorldEvent':
delta.push({ command: 'addWorldEvent', eventData: { "0": args[0], "1": args[1], "2": args[2], "id": `W${crypto.randomUUID()}` } });
showDanmaku('世界大事记更新', 'world');
break;
case 'createLocation':
delta.push({ command: 'createLocation', locationData: args[0] });
break;
case 'updateRegion':
delta.push({ command: 'updateRegion', regionData: args[0] });
break;
case 'deleteLocation':
delta.push({ command: 'deleteLocation', locationId: args[0] });
break;
case 'set':
data = recursivelyParseJsonStrings(args[0]);
delta.push({ command, data });
id = data['0'];
if(id && id.startsWith('C')) {
updatedCharacterIds.add(id);
showDanmaku(`新人物 ${data['1'].split('|')[0]} 登场`, 'npc');
} else if (id && id.startsWith('I')) {
showDanmaku(`获得新物品: ${data['1']}`, 'item');
} else {
showDanmaku('世界发生了一些变化', 'world');
}
break;
case 'updateAttribute':
id = args[0];
attribute = args[1];
value = args[2];
delta.push({ command, id, attribute, value });
if(id && (id.startsWith('C') || id.startsWith('G'))) updatedCharacterIds.add(id);
break;
case 'add':
id = args[0];
data = recursivelyParseJsonStrings(args[1]);
delta.push({ command, id, data });
if(id && (id.startsWith('C') || id.startsWith('G'))) {
updatedCharacterIds.add(id);
const char = characterDatabase[id];
const name = char ? char.name : '某人';
showDanmaku(`${name} 状态改变`, 'npc');
} else if (id === 'B1') {
showDanmaku('玩家状态改变', 'player');
} else {
showDanmaku('世界发生了一些变化', 'world');
}
break;
case 'de':
id = args[0];
delta.push({ command, id });
if(id && id.startsWith('C')) updatedCharacterIds.add(id);
if(id && id.startsWith('I')) {
const item = inventoryItems.find(i => i.id === id);
showDanmaku(`失去物品: ${item ? item.name : ''}`, 'item');
} else {
showDanmaku('世界发生了一些变化', 'world');
}
break;
case 'equipItem':
case 'unequipItem':
id = args[0];
slot = args[1];
item = args[2];
delta.push({ command, id, slot, item });
break;
}
} catch (e) {
// 捕获解析或处理过程中的任何错误
errorMessages.push({
title: `指令 "${command}" 处理错误`,
details: `解析或处理指令 "${commandStr}" 时发生错误。\n错误信息: ${e.message}\n\n这通常是因为括号内的参数不是一个有效的JSON格式，或者参数数量、类型不正确。`
});
}
});

if (updatedCharacterIds.size > 0) {
const btn = document.getElementById('surrounding-characters-button');
if (btn && !btn.querySelector('.red-dot')) {
const dot = document.createElement('span');
dot.className = 'red-dot';
btn.appendChild(dot);
}
}
return { delta, smallSummary, largeSummary };
}

    
        function syncStateFromTables(stateToSync = currentState, targetObject = null) {
            const targetPlayerData = targetObject ? {} : currentPlayerData;
            const targetInventoryItems = targetObject ? [] : inventoryItems;
            const targetSurroundingCharacters = targetObject ? [] : surroundingCharacters;
            const targetCharacterDatabase = targetObject ? {} : characterDatabase;
            const targetBondedCharacters = targetObject ? {} : bondedCharacters;

            let authoritativeLocation = '未知';
            let authoritativeDetailedLocation = '未知';
            let authoritativeFullLocationString = '时间未知/未知/未知';
            const timeRow = (stateToSync['4'] || []).find(row => row.id === TIME_LOCATION_ROW_ID) || (stateToSync['4'] || [])[0];

            if (timeRow && timeRow['0']) {
                authoritativeFullLocationString = timeRow['0'];
                const [time, ...locParts] = (timeRow['0'] || '').split('/');
                if(!targetObject) timeLocationDisplay.textContent = time || '时间未知';
                authoritativeLocation = locParts[0] || '未知';
                authoritativeDetailedLocation = locParts.slice(1).join('/') || '未知';
            }

            const allItemsInTable = Object.values(stateToSync['1'] || {});
            const possessedItemIds = new Set();

            const currentSceneChars = {};
            const allCharsInTable = Object.values(stateToSync['0'] || {});

            allCharsInTable.forEach(row => {
                const [name, gender] = (row['1'] || '|').split('|');
                const [realm, identity] = (row['2'] || '|').split('|');
                const remarks = parseRemarksString(row['9']);
                const actionParts = (row['16'] || '||||').split('|');
                let detailedAttributes = {};
                try { detailedAttributes = JSON.parse(row['11'] || '{}'); } catch(e) {}

                let equipment = { weapon: Array(6).fill(null), armor: Array(6).fill(null), technique: Array(6).fill(null), treasure: Array(6).fill(null) };
                
                const storedEquipment = parseNestedJsonString(remarks.equipment, {});
                for (const key in equipment) {
                    if (storedEquipment[key]) {
                        const equipData = storedEquipment[key];
                        equipment[key] = Array.isArray(equipData) ? equipData : (equipData ? [equipData] : []);
                    }
                }

                let npcInventory = [];
                const parsedInventory = parseNestedJsonString(remarks['inventory'], []);
                npcInventory = parsedInventory.map(itemRow => {
                    const itemId = itemRow.id || itemRow['0'];
                    possessedItemIds.add(itemId);
                    return {
                        id: itemId, name: itemRow.name || itemRow['1'], type: itemRow.type || itemRow['2'],
                        description: itemRow.description || itemRow['3'], effect: itemRow.effect || itemRow['4'],
                        quantity: parseInt(itemRow.quantity || itemRow['5'] || '1')
                    };
                });
                
                const npcSkills = parseNestedJsonString(remarks.skills, []);
                const npcTraits = parseNestedJsonString(remarks.traits, []);

                const fullLocation = actionParts[2] || '未知';
                let coordinates = null;
                const coordMatch = fullLocation.match(/\s(\d+,\d+)$/);
                if (coordMatch) {
                    coordinates = coordMatch[1].split(',').map(Number);
                }

                const charData = {
                    id: row['0'], name: name, gender: gender, realm: realm.trim(), identity: identity.trim(),
                    personality: row['3'], status: row['4'], linggen: row['5'] || '无',
                    specialConstitution: row['6'] || '无', appellation: row['7'] || '道友',
                    sexExperience: row['8'] || '0次(纯洁)', background: row['10'],
                    detailedAttributes: detailedAttributes, motive: row['12'], rawRelations: row['13'],
                    favorability: row['15'] || '0', action: actionParts[0] || '无', attire: actionParts[1] || '无',
                    location: fullLocation, coordinates: coordinates, figure: actionParts[3] || '未知',
                    appearance: actionParts[4] || '未知', publicKink: row['17'] || '待发现', privateKink: row['18'] || '待发现',
                    imageGenPrompt: row['19'], age: remarks['年龄'] || '未知', shouyuan: remarks['寿元'] || '未知',
                    sensitiveParts: row['20'] || '未知',
                    genitalStatus: row['21'] || '未知',
                    eroticValue: row['22'] || '0',
                    pleasureValue: row['23'] || '0',
                    sexualConception: row['24'] || '未知',
                    isBonded: remarks['isBonded'] === 'true', deeds: remarks['deeds'] || '',
                    weapon: equipment.weapon, armor: equipment.armor, technique: equipment.technique, treasure: equipment.treasure,
                    inventoryItems: npcInventory,
                    skills: npcSkills,
                    npcTraits: npcTraits,
                };

                ['weapon', 'armor', 'technique', 'treasure'].forEach(slotKey => {
                    (charData[slotKey] || []).forEach(item => {
                        if (item && item.id) possessedItemIds.add(item.id);
                    });
                });

                if (charData.id === 'B1') {
                    let warehouse = [];
                    try { warehouse = parseNestedJsonString(remarks['warehouse'], []); } catch(e) {}
                    const hpParts = (remarks['hp'] || "100/100").split('/');

                    const finalPlayerData = {
                        ...charData,
                        linggen: remarks['灵根'] || '无',
                        shanE: remarks['善恶值'] || '0',
                        progress: (remarks['修为进度'] || '0%').replace('%',''),
                        hp: { current: parseInt(hpParts[0]), max: parseInt(hpParts[1]) },
                        playerTraits: parseNestedJsonString(remarks['traits'], []),
                        avatarAppearance: remarks['avatar'] || 'auto',
                        isExtreme: remarks['isExtreme'] === 'true',
                        warehouse: warehouse,
                        deathCount: parseInt(remarks['deathCount'] || '0')
                    };

                    if (targetObject) {
                        targetObject.playerData = finalPlayerData;
                    } else {
                        Object.assign(currentPlayerData, finalPlayerData);
                    }
                } else {
                    currentSceneChars[charData.id] = charData;
                }
            });

            const playerInventory = allItemsInTable
                .filter(row => !possessedItemIds.has(row['0']))
                .map(row => ({
                    id: row['0'], name: row['1'], type: row['2'],
                    description: row['3'], effect: row['4'],
                    quantity: parseInt(row['5'] || '1')
                }));

            if (targetObject) {
                targetObject.inventoryItems = playerInventory;
            } else {
                inventoryItems = playerInventory;
            }

            if (targetObject) {
                targetObject.playerData.location = authoritativeLocation;
                targetObject.playerData.detailedLocation = authoritativeDetailedLocation;
                targetObject.playerData.fullLocationString = authoritativeFullLocationString;
            } else {
                currentPlayerData.location = authoritativeLocation;
                currentPlayerData.detailedLocation = authoritativeDetailedLocation;
                currentPlayerData.fullLocationString = authoritativeFullLocationString;
            }

            const currentBonded = targetObject ? {} : bondedCharacters;
            Object.keys(currentBonded).forEach(id => {
                if (currentSceneChars[id]) {
                    currentBonded[id] = { ...currentBonded[id], ...currentSceneChars[id] };
                }
            });

            const finalCharDB = { ...currentSceneChars, ...currentBonded };
            const finalSurroundingChars = Object.values(finalCharDB);

            if (targetObject) {
                targetObject.characterDatabase = finalCharDB;
                targetObject.surroundingCharacters = finalSurroundingChars;
            } else {
                characterDatabase = finalCharDB;
                surroundingCharacters = finalSurroundingChars;
            }
        }

    async function updateAvatar(playerData) {
        const avatarVideo = document.getElementById('cultivation-avatar');
        const customAvatarImg = document.getElementById('custom-avatar-img');
        const modalAvatarVideo = document.getElementById('modal-avatar-img');
        const modalCustomAvatarImg = document.getElementById('modal-custom-avatar-img');

        if (!playerData) return;

        const useVideo = (videoEl, imgEl) => {
            let appearance = playerData.avatarAppearance || 'auto';
            if (appearance === 'auto') {
                appearance = (playerData.gender === '女') ? '女性' : '男性';
            }
            const realm = (playerData.realm && playerData.realm !== '无') ? playerData.realm.slice(0, 2) : '凡人';
            const realmVideos = realmToVideoMap[realm] || realmToVideoMap['default'];
            const videoUrl = realmVideos[appearance];

            if (videoEl.src !== videoUrl) videoEl.src = videoUrl;
            videoEl.classList.remove('hidden');
            imgEl.classList.add('hidden');
        };

        const useImage = (videoEl, imgEl, src) => {
            imgEl.src = src;
            videoEl.classList.add('hidden');
            imgEl.classList.remove('hidden');
        };

        const customAvatarData = await dbGet(`${CUSTOM_AVATAR_KEY}_${currentArchiveName}`);

        if (customAvatarData) {
            useImage(avatarVideo, customAvatarImg, customAvatarData);
            useImage(modalAvatarVideo, modalCustomAvatarImg, customAvatarData);
        } else {
            useVideo(avatarVideo, customAvatarImg);
            useVideo(modalAvatarVideo, modalCustomAvatarImg);
        }
    }

    function renderDetailedAttributes(playerData) {
        const grid = document.getElementById('detailed-attributes-grid');
        grid.innerHTML = '';
        if (!playerData.detailedAttributes) return;

        const baseAttributes = playerData.detailedAttributes;
        const equipmentBonuses = calculateEquipmentBonuses();

        for (const key in baseAttributes) {
            const item = document.createElement('div');
            item.className = 'attribute-display-item';
            const baseAttr = baseAttributes[key];
            const bonusValue = equipmentBonuses[key] || 0;
            
            let bonusHtml = '';
            if (bonusValue > 0) {
                bonusHtml = ` <span class="attr-bonus">(+${bonusValue})</span>`;
            } else if (bonusValue < 0) {
                bonusHtml = ` <span class="attr-penalty">(${bonusValue})</span>`;
            }

            item.innerHTML = `
                <span class="attr-display-label">${key}</span>
                <span class="attr-display-value">${baseAttr.current}/${baseAttr.max}${bonusHtml}</span>
            `;
            grid.appendChild(item);
        }
    }

    function renderPlayerTraits(playerData) {
        const grid = document.getElementById('player-traits-grid');
        grid.innerHTML = '';
        if (!playerData.playerTraits || playerData.playerTraits.length === 0) {
            grid.closest('.detail-section').style.display = 'none';
            return;
        }
        grid.closest('.detail-section').style.display = 'block';

        playerData.playerTraits.forEach(trait => {
            const rarityClass = CREATION_CONFIG.TRAIT_RARITIES[trait.rarity] ? `rarity-${trait.rarity}` : 'rarity-普通';
            const slot = document.createElement('div');
            slot.className = `item-slot ${rarityClass}`;
            slot.innerHTML = `<span class="item-slot-name">${trait.name}</span>`;
            slot.addEventListener('click', () => showTraitDetail(trait));
            grid.appendChild(slot);
        });
    }

    function openCharacterDetail() {
        updateAvatar(currentPlayerData);

        const statusEl = document.getElementById('modal-player-status');
        const statusText = (currentPlayerData.status && currentPlayerData.status !== '无') ? currentPlayerData.status : '一切正常';
        statusEl.textContent = `当前状态: ${statusText}`;
        statusEl.style.display = 'block';

        const progress = parseInt(currentPlayerData.progress) || 0;
        updateGourdProgress(progress);
        updateCharacterDetailView();
        characterDetailOverlay.classList.add('visible');
    }
    
    function updateCharacterDetailView() {
        renderDetailGrid('weapon-grid', 'weapon');
        renderDetailGrid('armor-grid', 'armor');
        renderDetailGrid('technique-grid', 'technique');
        renderDetailGrid('treasure-grid', 'treasure');
        renderDetailedAttributes(currentPlayerData);
        renderPlayerTraits(currentPlayerData);
        
        const detailPane = document.querySelector('.detail-left-pane');
        let label = detailPane.querySelector('.extreme-label');
        if (currentPlayerData.isExtreme) {
            if (!label) {
                label = document.createElement('div');
                label.className = 'extreme-label';
                label.textContent = '极限';
                detailPane.appendChild(label);
            }
        } else {
            if (label) label.remove();
        }

        const deathCounter = document.getElementById('death-counter');
        if (currentPlayerData.isExtreme) {
            deathCounter.textContent = `死亡次数: ${currentPlayerData.deathCount}`;
            deathCounter.style.display = 'block';
        } else {
            deathCounter.style.display = 'none';
        }
    }

    function closeCharacterDetail() {
        characterDetailOverlay.classList.remove('visible');
    }
    
    function updateGourdProgress(percentage) {
        const fillElement = document.getElementById('gourd-fill-progress');
        const textElement = document.getElementById('gourd-progress-text');
        fillElement.style.height = `${percentage}%`;
        textElement.textContent = `当前境界进度: ${percentage}%`;
    }

    function renderDetailGrid(gridId, slotKey) {
        const gridContainer = document.getElementById(gridId);
        gridContainer.innerHTML = '';
        
        const slotTypeMap = { 'weapon': '武器', 'armor': '护甲', 'technique': '功法', 'treasure': '法宝' };
        const slotType = slotTypeMap[slotKey];

        const equippedItems = currentPlayerData[slotKey] || Array(6).fill(null);

        for (let i = 0; i < 6; i++) {
            const itemToDisplay = equippedItems[i];

            const slot = document.createElement('div');
            slot.className = 'item-slot';
            slot.dataset.slotType = slotType;
            slot.dataset.slotIndex = i;

            if (itemToDisplay) {
                slot.classList.add('equipped');
                const iconClass = itemIconMap[itemToDisplay.type] || itemIconMap['默认'];
                slot.innerHTML = `<i class="fas ${iconClass} item-slot-icon"></i><span class="item-slot-name">${itemToDisplay.name}</span>`;
                slot.addEventListener('click', () => showItemDetail(itemToDisplay, { isEquipped: true, slotType: slotType, slotIndex: i }));
            } else {
                slot.addEventListener('click', () => openEquipmentPicker(slotType, i));
            }
            gridContainer.appendChild(slot);
        }
    }

    function openEquipmentPicker(slotType, slotIndex) {
        currentPickingSlot = { type: slotType, index: slotIndex };
        pickerTitle.textContent = `为 ${slotType} 槽位 ${slotIndex + 1} 选择装备`;
        pickerGrid.innerHTML = '';

        const equipmentSlots = ['weapon', 'armor', 'technique', 'treasure'];
        const equippedItemNames = new Set(
            equipmentSlots.flatMap(key => 
                (currentPlayerData[key] || []).filter(item => item).map(item => item.name)
            )
        );

        const selectableItems = inventoryItems.filter(item => 
            item.type === slotType && !equippedItemNames.has(item.name)
        );
        
        if (selectableItems.length === 0) {
            pickerGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; opacity: 0.7;">储物袋中没有可装备的${slotType}</p>`;
        } else {
            selectableItems.forEach(item => {
                const slot = document.createElement('div');
                slot.className = 'inventory-slot';
                slot.title = `${item.name}\n类型: ${item.type}\n描述: ${item.description}\n效果: ${item.effect}`;
                const iconClass = itemIconMap[item.type] || itemIconMap['默认'];
                slot.innerHTML = `<i class="fas ${iconClass} inventory-slot-icon"></i><span class="inventory-slot-name">${item.name}</span>`;
                slot.addEventListener('click', () => equipItem(item, slotType, slotIndex));
                pickerGrid.appendChild(slot);
            });
        }
        pickerOverlay.classList.add('visible');
    }

    function closeEquipmentPicker() { pickerOverlay.classList.remove('visible'); }
    
    function addAction(type, data, context = {}) {
        let actionText = '';
        switch(type) {
            case 'use':
                const existingAction = actionQueue.find(a => a.type === 'use' && a.item.name === data.name);
                if (existingAction) {
                    existingAction.quantity++;
                    renderActionQueue();
                    closeItemDetail();
                    return;
                }
                actionText = `使用 ${data.name}`;
                break;
            case 'travel':
                actionText = `玩家 前往 ${data.location}，相距${data.distance}公里`;
                break;
            case 'communicate':
                actionText = `对${context.charName}说：“${data}”`;
                break;
            case 'gift':
                actionText = `将[${data.name}]赠送给${context.charName}`;
                break;
            case 'spar':
                actionText = `向${context.charName}发起切磋请求`;
                break;
            case 'accompany':
                actionText = `邀请${context.charName}与你同行`;
                break;
            case 'cultivate':
                actionText = `邀请${context.charName}进行双修`;
                break;
            case 'alchemy':
                actionText = `玩家使用[${data.map(i => i.name).join(', ')}]进行炼丹，炼制了一颗${context.tier}阶丹药`;
                break;
            case 'refining':
                actionText = `玩家使用[${data.map(i => i.name).join(', ')}]开始炼器`;
                break;
        }

        if(type === 'travel') {
                actionQueue = actionQueue.filter(a => a.type !== 'travel');
        }

        actionQueue.push({ type, text: actionText, data: data, context: context });
        
        renderActionQueue();

        if(type === 'use') closeItemDetail();
        if(type === 'travel') {
            worldMapOverlay.classList.remove('visible');
        }
    }

    function renderActionQueue() {
        commandList.innerHTML = '';
        actionQueue.forEach(action => {
            const li = document.createElement('li');
            li.textContent = action.text;
            commandList.appendChild(li);
        });
        undoCommandBtn.disabled = actionQueue.length === 0;
        clearCommandsBtn.disabled = actionQueue.length === 0;
        document.getElementById('action-queue-indicator').style.display = actionQueue.length > 0 ? 'flex' : 'none';
    }

async function applyVariableUpdates(delta, smallSummary, largeSummary, initialState) {
    try {
        const finalState = applyDelta(initialState, delta);
        currentState = finalState;
        
        updateSummaries(smallSummary, largeSummary);
        
        await saveCurrentState();
        updateAllTables(); 
        
        console.log("后台变量更新完成。");
    } catch (error) {
        console.error("后台变量更新失败:", error);
        showDanmaku('后台变量更新失败，请检查控制台', 'error');
    }
}


async function callThinkingApi(storyText, thinkingContent, tableThinkContent, stateSnapshotString) {
if (thinkingApiController) {
thinkingApiController.abort();
console.log("变量思考API：已取消上一个正在进行的请求。");
}

thinkingApiController = new AbortController();
const signal = thinkingApiController.signal;

const presetsData = await dbGet(THINKING_PRESETS_KEY);
if (!presetsData || !presetsData.presets) {
console.warn('变量思考API跳过：无法加载预设数据。');
thinkingApiController = null;
return '<upstore></upstore>';
}

const activePreset = presetsData.presets.find(p => p.id === presetsData.activePresetId);

const isApiGloballyEnabled = (await dbGet(THINKING_API_CONFIG_KEY))?.enabled || false;
if (!isApiGloballyEnabled || !activePreset) {
console.log('变量思考API未启用或未找到激活的预设，已自动跳过。');
thinkingApiController = null;
return '<upstore></upstore>';
}

const { apiUrl, apiKey, apiModel } = await dbGet(THINKING_API_CONFIG_KEY);
const { promptTemplate, worldBooks } = activePreset;

if (!apiUrl || !apiKey || !apiModel || !promptTemplate) {
console.warn('变量思考API关键配置不完整，已自动跳过。');
thinkingApiController = null;
return '<upstore></upstore>';
}

let statusDanmaku;
try {
statusDanmaku = showDanmaku('正在请求变量思考API进行逻辑处理...', 'status');

const activeWorldBooks = (worldBooks || []).filter(wb => wb.enabled !== false);
const triggeredContent = [];

activeWorldBooks.forEach(entry => {
if (!entry || !entry.content) return;
if (entry.triggerMode === 'blue' || (entry.keywords || []).some(kw => storyText.includes(kw))) {
triggeredContent.push(entry.content);
}
});

let worldBookContext = triggeredContent.length > 0 ? `\n### 世界书参考资料\n${triggeredContent.join('\n\n---\n\n')}\n---` : '';

const mapDataContext = `\n\n### 【固定参考资料：世界地图】\n${JSON.stringify(DEFAULT_WORLD_MAP_DATA, null, 2)}\n---`;

const finalPrompt = promptTemplate
.replace(/\$\{story_text\}/g, storyText)
.replace(/\$\{thinking_content\}/g, thinkingContent || '')
.replace(/\$\{table_thinking_content\}/g, tableThinkContent || '')
.replace(/\$\{state_snapshot\}/g, (stateSnapshotString || '') + mapDataContext)
.replace(/\$\{world_book_context\}/g, worldBookContext || '');

let thinkingResult = await genericApiCall(apiUrl, apiKey, apiModel, finalPrompt, signal);

if (signal.aborted) {
console.log("变量思考请求被主动中止。");
return '<upstore></upstore>';
}

if (thinkingResult && !thinkingResult.includes('<upstore>')) {
thinkingResult = `<upstore>\n${thinkingResult}\n</upstore>`;
}

return thinkingResult;
} catch (error) {
if (error.name === 'AbortError') {
console.log("变量思考API请求已成功取消。");
} else {
console.error('调用变量思考API时出错:', error);
await showCustomAlert(`变量思考API错误: ${error.message}`, 'API 错误');
}
return '<upstore></upstore>';
} finally {
if (statusDanmaku) statusDanmaku.remove();
thinkingApiController = null;
}
}

function generateFullStateSnapshotString() {
    let snapshotString = "【当前完整状态快照】\n";
    const stateVars = State.variables;

    for (const key in stateVars) {
        if (Object.hasOwnProperty.call(stateVars, key)) {
            const value = stateVars[key];
            
            snapshotString += `\n--- ${key} ---\n`;

            if (typeof value === 'object' && value !== null) {
                const formattedObject = JSON.stringify(value, null, 2);
                snapshotString += formattedObject.replace(/\\n/g, '\n');
            } else {
                snapshotString += `${value}\n`;
            }
        }
    }
    return snapshotString;
}


    async function makeApiCall(prompt) {
if (window.parent && window.parent.TavernHelper && typeof window.parent.TavernHelper.generate === 'function') {
const tavernGenerateFunc = window.parent.TavernHelper.generate;
// 注意：这里不再需要 on_stream 回调，因为我们将使用全局事件监听
const params = {
user_input: prompt,
should_stream: regexConfig.enableStreaming, // 根据设置决定是否开启流式
disable_extras: true,
};
try {
const finalAiResponse = await tavernGenerateFunc(params);
return (finalAiResponse || "").trim();
} catch (e) {
console.error("TavernHelper.generate call error:", e);
throw new Error('父窗口AI生成失败。');
}
} else {
console.warn('父窗口AI(TavernHelper)未找到，将返回一个模拟回复。');
return new Promise(resolve => setTimeout(() => resolve("<!-- <upstore>add(\"TIME_LOCATION_ROW\", {\"0\":\"0001年 01月 01日 08:15/天南/越国|(黄枫谷) 980,520\"})</upstore> --><branches>[A. 去城中最大的酒楼“醉仙楼”打探消息。][B. 前往城中的坊市，看看能否淘到一些有用的东西。][C. 在街道上随意闲逛，观察此地的风土人情。][D. 找个僻静的角落开始打坐修炼。]</branches>你好，道友。在这茫茫修仙界，你我在此相遇，也算是一桩缘分。"), 1000));
}
}

    async function saveToLog(archiveName, newEntry) {
        try {
            const archive = await db.archives.get(archiveName);
            if (!archive) return;
            archive.data.logs.push(newEntry);
            await db.archives.put(archive);
        } catch (e) { console.error("保存日志到数据库失败:", e); }
    }
    
        function getLogsForContext(allLogs, archive) {
            // 【【【 修改点 1 】】】 检查存档本身是否有导入记忆的标记
            const hasImportedMemories = archive?.data?.state?.hasImportedMemories === true;

            // 【【【 修改点 2 】】】 根据新的标记来决定是否包含开篇语
            const openingLog = hasImportedMemories ? null : allLogs.find(log => log.content.includes('<h4>天道初启</h4>')) || null;
            
            const chatLogs = allLogs.filter(log => !log.content.includes('<h4>天道初启</h4>'));
            const summaryLogs = allLogs.filter(log => log.content.startsWith('[天道总结:'));

            if (summaryConfig.segmentedMemoryEnabled) {
                const summarizableLogs = chatLogs.filter(log => log.type === 'ai' || log.isGhost);
                const userLogs = chatLogs.filter(log => log.type === 'user');
                const allConversationalLogs = [...summarizableLogs, ...userLogs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

                const chatLayers = summaryConfig.segmentedChatLayers || 0;
                const largeSummaryStart = summaryConfig.segmentedLargeSummaryStart || 0;

                const logsForPrompt = [];
                if (openingLog) {
                    logsForPrompt.push(openingLog);
                }

                const recentChatLogs = allConversationalLogs.slice(-chatLayers * 2);
                const recentLogIds = new Set(recentChatLogs.map(l => l.id));
                const olderSummarizableLogs = summarizableLogs.filter(log => !recentLogIds.has(log.id));

                olderSummarizableLogs.forEach(log => {
                    const reverseIndex = summarizableLogs.length - 1 - summarizableLogs.indexOf(log);
                    if (largeSummaryStart > 0 && reverseIndex >= largeSummaryStart) {
                        logsForPrompt.push({ ...log, content: log.largeSummary || log.smallSummary || log.content });
                    } else {
                        logsForPrompt.push({ ...log, content: log.smallSummary || log.content });
                    }
                });

                logsForPrompt.push(...recentChatLogs);

                return {
                    openingLog,
                    summaryLogs,
                    hiddenChatLogs: [],
                    visibleChatLogs: chatLogs,
                    logsForPrompt: logsForPrompt.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                };
            }

            // --- 以下为未启用分段记忆时的旧逻辑 ---
            let nonSummaryChatLogs = allLogs.filter(log => !log.content.startsWith('[天道总结:') && !log.content.includes('<h4>天道初启</h4>'));
            let hiddenChatLogs = [];
            let visibleChatLogs = [];
            let hiddenIndices = new Set();

            if (regexConfig.autoHideSummarized) {
                const lastSummaryIndex = allLogs.findLastIndex(log => log.content.startsWith('[天道总结:'));
                if (lastSummaryIndex !== -1) {
                    for(let i = 0; i < lastSummaryIndex; i++) {
                        if (!allLogs[i].content.startsWith('[天道总结:') && !allLogs[i].content.includes('<h4>天道初启</h4>')) {
                            hiddenIndices.add(allLogs[i].id);
                        }
                    }
                }
            }

            if (regexConfig.fixedHideRange) {
                const [start, end] = regexConfig.fixedHideRange.split('-').map(Number);
                if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start) {
                    for (let i = start - 1; i < end; i++) {
                        if (nonSummaryChatLogs[i]) {
                            hiddenIndices.add(nonSummaryChatLogs[i].id);
                        }
                    }
                }
            }

            if (regexConfig.contextLimit > 0 && !regexConfig.autoHideSummarized && !regexConfig.fixedHideRange) {
                if (nonSummaryChatLogs.length > regexConfig.contextLimit) {
                    const toHideCount = nonSummaryChatLogs.length - regexConfig.contextLimit;
                    for (let i = 0; i < toHideCount; i++) {
                        hiddenIndices.add(nonSummaryChatLogs[i].id);
                    }
                }
            }

            nonSummaryChatLogs.forEach(log => {
                if (hiddenIndices.has(log.id)) {
                    hiddenChatLogs.push(log);
                } else {
                    visibleChatLogs.push(log);
                }
            });

            const logsForPrompt = [
                ...(openingLog ? [openingLog] : []),
                ...summaryLogs,
                ...visibleChatLogs
            ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            return {
                openingLog,
                summaryLogs,
                hiddenChatLogs,
                visibleChatLogs,
                logsForPrompt
            };
        }

    function calculateEquipmentBonuses() {
        const bonuses = {};
        Object.keys(CREATION_CONFIG.ATTRIBUTES).forEach(key => bonuses[key] = 0);

        const equipment = [
            ...(currentPlayerData.weapon || []),
            ...(currentPlayerData.armor || []),
            ...(currentPlayerData.technique || []),
            ...(currentPlayerData.treasure || []),
        ];

        equipment.forEach(item => {
            if (!item) return;
            const effects = parseItemEffect(item.effect);
            for (const attr in effects) {
                if (bonuses.hasOwnProperty(attr)) {
                    bonuses[attr] += effects[attr];
                }
            }
        });
        return bonuses;
    }
    
    async function getCharacterStageInfo() {
        const templates = await dbGet(CHARACTER_TEMPLATES_KEY) || [];
        let stageInfo = '';
        
        for (const char of surroundingCharacters) {
            const template = templates.find(t => t.name === char.name);
            if (template) {
                const favorability = parseInt(char.favorability);
                const stage = template.stages.find(s => favorability >= s.min && favorability <= s.max);
                if (stage) {
                    stageInfo += `\n##角色阶段说明\n角色: ${char.name}\n态度: ${stage.attitude}\n描述: ${stage.description}\n`;
                }
            }
        }
        return stageInfo;
    }



function generateTableStateStringForAI() {
const stateForAI = JSON.parse(JSON.stringify(currentState));

const playerRow = stateForAI['0']['B1'];
if (playerRow) {
playerRow['9'] = serializeCharacterRemarks(currentPlayerData, false);
}

const jsonString = JSON.stringify(stateForAI);

return jsonString.replace(/\\"/g, '"');
}

    function getPlayerEquipmentString() {
        const equipmentSlots = ['weapon', 'armor', 'technique', 'treasure'];
        const equippedItems = [];

        equipmentSlots.forEach(slotKey => {
            if (currentPlayerData[slotKey]) {
                currentPlayerData[slotKey].forEach(item => {
                    if (item) {
                        equippedItems.push(`${item.name} (${item.type})`);
                    }
                });
            }
        });

        return equippedItems.length > 0 ? equippedItems.join(', ') : '无';
    }

async function renderStoryContent(storyContent, branchContent, newsReferenceContent) {
await checkAchievements(storyContent);

const cleanStoryText = storyContent.replace(/<\/?content>/g, '').trim();
const finalStoryContent = processTextWithRules(cleanStoryText, PLACEMENT_MAP.AI_OUTPUT, 'regular');

lastAiStoryText = finalStoryContent;

const newLogEntryId = crypto.randomUUID();
let newLogEntry = {
id: newLogEntryId,
timestamp: new Date().toISOString(),
content: finalStoryContent,
stateSnapshot: null,
type: 'ai',
branchContent: branchContent,
smallSummary: null,
largeSummary: null,
newsReference: newsReferenceContent || '无'
};

await saveToLog(currentArchiveName, newLogEntry);

const streamingMessage = document.getElementById('streaming-message');
if (streamingMessage) {
streamingMessage.removeAttribute('id');
streamingMessage.dataset.logId = newLogEntry.id;

streamingMessage.innerHTML = sanitizeHTML(convertSimpleMarkdown(finalStoryContent));
} else {
addMessageToLog(newLogEntry, 'ai');
}

const options = branchContent.match(/\[(.*?)\]/g)?.map(s => s.slice(1, -1)) || [];
updateBranchingOptions(options);

return newLogEntry;
}



async function applyVariableAndUiUpdates(delta, smallSummary, largeSummary, initialState, logEntry) {

const combinedDelta = [...(delta || []), ...achievementRewardDeltas];
achievementRewardDeltas = []; // 清空成就奖励 delta 数组

if (combinedDelta.length === 0 && smallSummary === null && largeSummary === null) {
currentState = initialState;
logEntry.stateSnapshot = JSON.stringify(currentState);
} else {
logEntry.stateSnapshot = JSON.stringify(applyChanges(JSON.parse(JSON.stringify(initialState)), combinedDelta));
}

if (summaryConfig.segmentedMemoryEnabled) {
if (smallSummary !== null || largeSummary !== null) {
logEntry.smallSummary = smallSummary || '';
logEntry.largeSummary = largeSummary || '';
} else {
showDanmaku('分段记忆异常，已自动弹出补充窗口', 'error');
logEntry.smallSummary = "小总结";
logEntry.largeSummary = "大总结";
}
}

try {
const archive = await db.archives.get(currentArchiveName);
if (archive) {
const logIndex = archive.data.logs.findIndex(l => l.id === logEntry.id);
if (logIndex !== -1) {
archive.data.logs[logIndex] = logEntry;
} else {
archive.data.logs.push(logEntry);
}
await db.archives.put(archive);
}
} catch(e) {
console.error("保存日志时出错:", e);
}

if (summaryConfig.segmentedMemoryEnabled && smallSummary === null && largeSummary === null) {
await openManualSegmentedMemoryEditor(logEntry.id);
}


await applyVisualUpdates(combinedDelta, initialState);

await runAutoSummaryCheck();
}

function toggleTheaterPopup(forceShow = false) {
const theaterWindow = document.getElementById('ai-theater-window'); 
if (!theaterWindow) {
console.error("致命错误：无法找到小剧场弹窗元素 #ai-theater-window！");
return;
}

const isCurrentlyVisible = theaterWindow.style.display === 'flex'; 


if (forceShow || !isCurrentlyVisible) {
theaterWindow.style.display = 'flex'; 

console.log("AI剧场：弹窗已打开，即将调用 loadLatestTheaterIntoPopup() 来加载内容...");
loadLatestTheaterIntoPopup();

} else {

theaterWindow.style.display = 'none';
console.log("AI剧场：弹窗已关闭。");
}
}

async function loadLatestTheaterIntoPopup() {
const iframe = document.getElementById('ai-theater-iframe');
const placeholder = document.getElementById('ai-theater-placeholder');
if (!iframe || !placeholder) {
console.error("致命错误：无法在页面上找到 'ai-theater-iframe' 或 'ai-theater-placeholder' 元素！");
return;
}


const renderTheater = (htmlBlock) => {
const htmlMatch = htmlBlock.match(/```html([\s\S]*?)```/);
if (htmlMatch && typeof htmlMatch[1] === 'string' && htmlMatch[1].trim()) {
iframe.srcdoc = htmlMatch[1].trim();
placeholder.style.display = 'none';
iframe.style.display = 'block';
return true;
}
return false;
};


if (activeTheaterHTML) {
if (renderTheater(activeTheaterHTML)) {
console.log("加载成功：已显示内存中的最新小剧场。");
return;
}
}


if (currentArchiveName) {
try {
const archive = await db.archives.get(currentArchiveName);
if (archive && archive.data.state && archive.data.state.activeTheaterHTML) {
activeTheaterHTML = archive.data.state.activeTheaterHTML;
if (renderTheater(activeTheaterHTML)) {
console.log("加载成功：已从存档加载最新小剧场。");
return;
}
}
} catch (error) {
console.error("从存档加载AI小剧场内容失败:", error);
}
}


placeholder.innerHTML = '<span>欢迎使用AI小剧场功能！<br>当前存档尚无剧场内容。</span>';
placeholder.style.display = 'flex';
iframe.style.display = 'none';
console.log("加载结束：无有效剧场内容，显示占位符。");
}
let activeTheaterHTML = null; 

async function callTextImageApi(storyText) {
    const { enabled, apiUrl, apiKey, apiModel, promptTemplate } = textImageApiConfig;

    if (!enabled || !apiUrl || !apiKey || !apiModel || !promptTemplate) {
        console.log('正文生图API未启用或配置不完整，跳过调用。');
        return storyText; // 直接返回原文
    }

    showPersistentStatus('正在请求正文优化API进行正文润色...');

    try {
        const finalPrompt = promptTemplate.replace(/\${story_text}/g, storyText);

        const response = await fetch(`${apiUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: apiModel,
                messages: [{ role: 'user', content: finalPrompt }],
                temperature: 0.7, // 可以适当调整以获得创造性
            })
        });

        hidePersistentStatus();

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`正文优化API请求失败 (${response.status}): ${errorData.error?.message || '未知错误'}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();

    } catch (error) {
        console.error('调用正文优化API时出错:', error);
        showDanmaku(`正文优化API错误: ${error.message}`, 'error');
        hidePersistentStatus();
        return storyText; // 出错时返回原文，保证流程继续
    }
}

const KNOWLEDGE_SEARCH_API_CONFIG_KEY = 'CULTIVATION_KNOWLEDGE_SEARCH_API_CONFIG_V2';
let knowledgeSearchGlobalConfig = {}; // 使用新的、更明确的变量名



function parseStructuredWorldBookContent(rawContent) {
    const result = {
        title: '',
        keywords: '',
        content: ''
    };

    if (!rawContent) return result;

    const titleMatch = rawContent.match(/\[TITLE\]([\s\S]*?)\[KEYWORDS\]/);
    const keywordsMatch = rawContent.match(/\[KEYWORDS\]([\s\S]*?)\[CONTENT\]/);
    const contentMatch = rawContent.match(/\[CONTENT\]([\s\S]*)$/);

    if (titleMatch && titleMatch[1]) {
        result.title = titleMatch[1].trim();
    }

    if (keywordsMatch && keywordsMatch[1]) {
        result.keywords = keywordsMatch[1].trim();
    }

    if (contentMatch && contentMatch[1]) {
        result.content = contentMatch[1].trim();
    }

    // 如果上面任何一个匹配失败，做一个智能降级处理：
    // 将整个原始内容作为内容，让用户手动填写标题和关键词。
    if (!result.title && !result.keywords && !result.content) {
        result.content = rawContent;
    }

    return result;
}

async function manageKnowledgeSearchApiSettings() {
    // 1. 定义默认配置
    const defaultConfig = {
        apiUrl: '',
        apiKey: '',
        apiModel: '',
        promptTemplate: `你是一个信息处理专家。根据用户提出的问题，搜索并整合信息，然后严格按照以下格式输出：
[TITLE]
为内容起一个简洁、精确的标题。
[KEYWORDS]
提取3-5个最核心的关键词，使用中文关键词，用英文逗号“,”分隔。这些关键词将用于游戏内的触发关键词，例如关于韩立的事件，触发词只需要是韩立或事件内发生的事情。
[CONTENT]
对信息进行详细、有条理的总结，不超过500字。
---
用户问题：\${searchText}`,
        knowledgeBaseContent: ''
    };

    // 2. 加载配置并填充UI
    try {
        const savedConfig = await dbGet(KNOWLEDGE_SEARCH_API_CONFIG_KEY);
        knowledgeSearchGlobalConfig = { ...defaultConfig, ...savedConfig };
    } catch (e) {
        console.error("加载知识库搜索API配置失败:", e);
        knowledgeSearchGlobalConfig = { ...defaultConfig };
    }
    const panel = document.getElementById('knowledge-search-api-settings-overlay');
    panel.querySelector('#knowledge-search-api-url').value = knowledgeSearchGlobalConfig.apiUrl || '';
    panel.querySelector('#knowledge-search-api-key').value = knowledgeSearchGlobalConfig.apiKey || '';
    
    const modelSelect = panel.querySelector('#knowledge-search-api-model');
    if (knowledgeSearchGlobalConfig.apiModel) {
        if (!Array.from(modelSelect.options).some(opt => opt.value === knowledgeSearchGlobalConfig.apiModel)) {
            const option = new Option(knowledgeSearchGlobalConfig.apiModel, knowledgeSearchGlobalConfig.apiModel, true, true);
            modelSelect.add(option);
        }
        modelSelect.value = knowledgeSearchGlobalConfig.apiModel;
    }

    panel.querySelector('#knowledge-search-prompt-template').value = knowledgeSearchGlobalConfig.promptTemplate || defaultConfig.promptTemplate;
    panel.querySelector('#knowledge-base-content-textarea').value = knowledgeSearchGlobalConfig.knowledgeBaseContent || '';
    
    const saveBtn = panel.querySelector('#save-knowledge-search-api-settings-btn');
    if (!saveBtn.dataset.v3Listener) { // 使用标记防止重复绑定
        

        saveBtn.addEventListener('click', saveKnowledgeSearchApiConfig);

        panel.querySelector('.modal-close-btn').addEventListener('click', () => panel.classList.remove('visible'));

        document.getElementById('open-knowledge-search-api-settings-btn').addEventListener('click', () => {
            const currentPanel = document.getElementById('knowledge-search-api-settings-overlay');
            currentPanel.querySelector('#knowledge-search-prompt-template').value = knowledgeSearchGlobalConfig.promptTemplate || defaultConfig.promptTemplate;
            currentPanel.querySelector('#knowledge-base-content-textarea').value = knowledgeSearchGlobalConfig.knowledgeBaseContent || '';
            currentPanel.classList.add('visible');
        });
        

        document.getElementById('execute-knowledge-search-btn').addEventListener('click', handlePanelKnowledgeSearch);

document.getElementById('fetch-knowledge-search-models-btn').addEventListener('click', function() {
    // 调用通用函数，传入各自面板的ID
    fetchModelsForPanel(
        'knowledge-search-api-url',     // API URL输入框ID
        'knowledge-search-api-key',     // API Key输入框ID
        'knowledge-search-api-model',   // 要填充的模型<select>框ID
        this                            // 按钮本身
    );
});
        
        saveBtn.dataset.v3Listener = 'true';
    }
	    await manageWorldBook();

}

async function manageWorldBook() {
    const entries = await dbGet(WORLDBOOK_ENTRIES_KEY) || [];
    renderWorldBookEntries(entries);
    const editorOverlay = document.getElementById('world-book-editor-overlay');
    // 绑定“创建新条目”按钮
    document.getElementById('open-world-book-creator-btn').addEventListener('click', () => {
        openWorldBookEditor(); // 不带ID调用，即为创建模式
    });
    // 绑定弹窗内的“保存”按钮
    document.getElementById('save-world-book-btn').addEventListener('click', saveWorldBookEntry);
    // 绑定弹窗的关闭按钮和背景点击关闭
    editorOverlay.querySelector('.modal-close-btn').addEventListener('click', () => editorOverlay.classList.remove('visible'));
    editorOverlay.addEventListener('click', (e) => {
        if (e.target === editorOverlay) editorOverlay.classList.remove('visible');
    });
    // 绑定弹窗内的触发模式单选框，以控制关键词区域的显隐
    document.querySelectorAll('input[name="worldbook-editor-trigger"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('world-book-keywords-container').classList.toggle('hidden', e.target.value !== 'green');
        });
    });
    // 为条目列表设置事件委托，处理编辑和删除
    document.getElementById('world-book-entries-list').addEventListener('click', async (e) => {
        const editButton = e.target.closest('.world-book-edit-btn');
        const deleteButton = e.target.closest('.world-book-delete-btn');
        if (editButton) {
            const entryId = editButton.dataset.id;
            openWorldBookEditor(entryId); // 带ID调用，进入编辑模式
        } else if (deleteButton) {
            const entryId = deleteButton.dataset.id;
            if (await showCustomConfirm('确定要删除这个世界书条目吗？')) {
                let allEntries = await dbGet(WORLDBOOK_ENTRIES_KEY) || [];
                allEntries = allEntries.filter(entry => entry.id !== entryId);
                await dbSet(WORLDBOOK_ENTRIES_KEY, allEntries);
                renderWorldBookEntries(allEntries);
                showDanmaku('条目已删除。', 'success');
            }
        }
    });
}

async function openWorldBookEditor(entryId = null, prefillData = null) {
    const modal = document.getElementById('world-book-editor-overlay');
    const title = document.getElementById('world-book-editor-title');
    const nameInput = document.getElementById('world-book-entry-name');
    const contentTextarea = document.getElementById('world-book-entry-content');
    const keywordsContainer = document.getElementById('world-book-keywords-container');
    const keywordsTextarea = document.getElementById('world-book-trigger-keywords');
    
    currentEditingWorldBookId = entryId; // 设置全局编辑ID
    if (entryId) { // 编辑模式
        const entries = await dbGet(WORLDBOOK_ENTRIES_KEY) || [];
        const entryToEdit = entries.find(e => e.id === entryId);
        if (!entryToEdit) {
            showCustomAlert('错误：找不到要编辑的条目。');
            return;
        }
        title.textContent = "编辑世界书条目";
        nameInput.value = entryToEdit.key;
        contentTextarea.value = entryToEdit.content;
        document.querySelector(`input[name="worldbook-editor-trigger"][value="${entryToEdit.triggerMode}"]`).checked = true;
        
        const isGreen = entryToEdit.triggerMode === 'green';
        keywordsTextarea.value = isGreen ? (entryToEdit.keywords || []).join(', ') : '';
        keywordsContainer.classList.toggle('hidden', !isGreen);
    } else { // 创建模式 (无论是手动创建还是搜索后创建)
        title.textContent = "创建新世界书条目";
        if (prefillData) {
            // 核心修改：使用预填充数据
            nameInput.value = prefillData.title;
            contentTextarea.value = prefillData.content;
            keywordsTextarea.value = prefillData.keywords;
            
            // 如果有关键词，自动选择绿灯模式
            if (prefillData.keywords) {
                document.querySelector('input[name="worldbook-editor-trigger"][value="green"]').checked = true;
                keywordsContainer.classList.remove('hidden');
            } else {
                document.querySelector('input[name="worldbook-editor-trigger"][value="blue"]').checked = true;
                keywordsContainer.classList.add('hidden');
            }
        } else {
            // 降级方案：手动创建时，从主面板获取内容
            nameInput.value = document.getElementById('knowledge-search-input').value;
            contentTextarea.value = document.getElementById('knowledge-base-content-textarea').value;
            keywordsTextarea.value = '';
            document.querySelector('input[name="worldbook-editor-trigger"][value="blue"]').checked = true;
            keywordsContainer.classList.add('hidden');
        }
    }
    modal.classList.add('visible');
}
async function saveWorldBookEntry() {
    const name = document.getElementById('world-book-entry-name').value.trim();
    const content = document.getElementById('world-book-entry-content').value.trim();
    const triggerMode = document.querySelector('input[name="worldbook-editor-trigger"]:checked').value;
    const keywordsRaw = document.getElementById('world-book-trigger-keywords').value.trim();
    
    if (!name) {
        await showCustomAlert('错误：条目名称不能为空！');
        return;
    }
    const keywords = triggerMode === 'green' ? keywordsRaw.split(/[,，\s]+/).filter(Boolean) : [];
    if (triggerMode === 'green' && keywords.length === 0) {
        await showCustomAlert('错误：绿灯模式下至少需要一个触发关键词！');
        return;
    }

    if (currentEditingContext.type === 'thinking') {
        const presetsData = await dbGet(THINKING_PRESETS_KEY);
        const activePreset = presetsData.presets.find(p => p.id === presetsData.activePresetId);
        if (!activePreset) {
            await showCustomAlert('错误：找不到激活的预设来保存规则。');
            return;
        }

        const entryId = currentEditingContext.id;
        if (entryId) {
            const entryIndex = activePreset.worldBooks.findIndex(entry => entry.id === entryId);
            if (entryIndex !== -1) {
                const entryToUpdate = activePreset.worldBooks[entryIndex];
                if (entryToUpdate.id !== 'default-variable-thinking') {
                    entryToUpdate.name = name;
                }
                entryToUpdate.content = content;
                entryToUpdate.triggerMode = triggerMode;
                entryToUpdate.keywords = keywords;
            }
        } else {
            const newEntry = {
                id: crypto.randomUUID(), name: name, content: content,
                enabled: true, triggerMode: triggerMode, keywords: keywords,
            };
            if (!activePreset.worldBooks) activePreset.worldBooks = [];
            activePreset.worldBooks.push(newEntry);
        }

        thinkingApiConfig.worldBooks = activePreset.worldBooks;

        await dbSet(THINKING_PRESETS_KEY, presetsData);
        await renderThinkingWorldBooks();
        await showCustomAlert(`思考规则 "${name}" 已成功保存！`);

    } else { 
        const allEntries = await dbGet(WORLDBOOK_ENTRIES_KEY) || [];
        const entryId = currentEditingWorldBookId;
        if (entryId) {
            const entryIndex = allEntries.findIndex(entry => entry.id === entryId);
            if (entryIndex !== -1) {
                allEntries[entryIndex] = { ...allEntries[entryIndex], key: name, content, triggerMode, keywords };
            }
        } else {
            if (allEntries.some(entry => entry.key === name)) {
                await showCustomAlert(`错误：已存在名为 "${name}" 的条目。`);
                return;
            }
            allEntries.push({ id: crypto.randomUUID(), key: name, content, triggerMode, keywords });
        }
        await dbSet(WORLDBOOK_ENTRIES_KEY, allEntries);
        renderWorldBookEntries(allEntries);
        await showCustomAlert(`全局世界书条目 "${name}" 已保存！`);
    }
    
    document.getElementById('world-book-editor-overlay').classList.remove('visible');
    currentEditingContext.type = null;
    currentEditingContext.id = null;
    currentEditingWorldBookId = null;
}

async function loadNpcDisplaySettings() {
    const defaultSettings = {
        showSexExperience: true,
        showSensitiveParts: true,
        showGenitalStatus: true,
        showEroticValue: true,
        showPleasureValue: true,
        showPublicKink: true,
        showPrivateKink: true,
        showSexualConception: true,
        showSkillsTab: true,
        showTraitsTab: true,
        customFields: [],
    };
    try {
        const savedSettings = await dbGet(NPC_DISPLAY_SETTINGS_KEY);
        npcDisplaySettings = { ...defaultSettings, ...savedSettings };
        
        if (npcDisplaySettings.showKinks !== undefined) {
            npcDisplaySettings.showPublicKink = npcDisplaySettings.showKinks;
            npcDisplaySettings.showPrivateKink = npcDisplaySettings.showKinks;
            delete npcDisplaySettings.showKinks;
        }

        if (!npcDisplaySettings.customFields) {
            npcDisplaySettings.customFields = [];
        }

    } catch (e) {
        npcDisplaySettings = defaultSettings;
    }
}

function openNpcDisplaySettingsModal() {
    document.getElementById('toggle-sexExperience').checked = npcDisplaySettings.showSexExperience;
    document.getElementById('toggle-sensitiveParts').checked = npcDisplaySettings.showSensitiveParts;
    document.getElementById('toggle-genitalStatus').checked = npcDisplaySettings.showGenitalStatus;
    document.getElementById('toggle-eroticValue').checked = npcDisplaySettings.showEroticValue;
    document.getElementById('toggle-pleasureValue').checked = npcDisplaySettings.showPleasureValue;
    document.getElementById('toggle-publicKink').checked = npcDisplaySettings.showPublicKink;
    document.getElementById('toggle-privateKink').checked = npcDisplaySettings.showPrivateKink;
    document.getElementById('toggle-sexualConception').checked = npcDisplaySettings.showSexualConception;
    document.getElementById('toggle-skillsTab').checked = npcDisplaySettings.showSkillsTab;
    document.getElementById('toggle-traitsTab').checked = npcDisplaySettings.showTraitsTab;

    const container = document.getElementById('custom-fields-container');
    container.innerHTML = '';
    if (npcDisplaySettings.customFields) {
        npcDisplaySettings.customFields.forEach(field => {
            addCustomFieldRow(field);
        });
    }
    
    document.getElementById('npc-display-settings-overlay').classList.add('visible');
}

async function saveNpcDisplaySettings() {
    npcDisplaySettings.showSexExperience = document.getElementById('toggle-sexExperience').checked;
    npcDisplaySettings.showSensitiveParts = document.getElementById('toggle-sensitiveParts').checked;
    npcDisplaySettings.showGenitalStatus = document.getElementById('toggle-genitalStatus').checked;
    npcDisplaySettings.showEroticValue = document.getElementById('toggle-eroticValue').checked;
    npcDisplaySettings.showPleasureValue = document.getElementById('toggle-pleasureValue').checked;
    npcDisplaySettings.showPublicKink = document.getElementById('toggle-publicKink').checked;
    npcDisplaySettings.showPrivateKink = document.getElementById('toggle-privateKink').checked;
    npcDisplaySettings.showSexualConception = document.getElementById('toggle-sexualConception').checked;
    npcDisplaySettings.showSkillsTab = document.getElementById('toggle-skillsTab').checked;
    npcDisplaySettings.showTraitsTab = document.getElementById('toggle-traitsTab').checked;

    const customFields = [];
    document.querySelectorAll('#custom-fields-container .custom-field-row').forEach(row => {
        const labelInput = row.querySelector('.custom-label-input');
        const varInput = row.querySelector('.custom-var-input');
        
        if (labelInput.value.trim() && varInput.value.trim()) {
            customFields.push({
                id: row.dataset.fieldId,
                isEnabled: row.querySelector('.is-enabled-toggle').checked,
                label: labelInput.value.trim(),
                variableName: varInput.value.trim()
            });
        }
    });
    npcDisplaySettings.customFields = customFields;

    await dbSet(NPC_DISPLAY_SETTINGS_KEY, npcDisplaySettings);
    await showCustomAlert('NPC显示设置已保存！');
    document.getElementById('npc-display-settings-overlay').classList.remove('visible');

    if (!characterDetailView.classList.contains('hidden') && currentEditingNpcId) {
        showCharacterDetailPanel(characterDatabase[currentEditingNpcId]);
    }
}


function renderWorldBookEntries(entries) {
    const listContainer = document.getElementById('world-book-entries-list');
    listContainer.innerHTML = '';
    
    if (!entries || entries.length === 0) {
        listContainer.innerHTML = '<p style="text-align:center; opacity:0.7;">暂无世界书条目</p>';
        return;
    }
    
    entries.forEach(entry => {
        const itemEl = document.createElement('div');
        itemEl.className = 'regex-rule-item'; // 复用现有列表项样式
        const iconColor = entry.triggerMode === 'blue' ? '#4fc3f7' : '#66bb6a';
        
        itemEl.innerHTML = `
            <i class="fas fa-lightbulb" style="color: ${iconColor}; margin-right: 8px;" title="触发模式: ${entry.triggerMode === 'blue' ? '时刻触发' : '关键词触发'}"></i>
            <span class="rule-name" title="${entry.key}">${entry.key}</span>
            <div class="rule-actions">
                <button class="world-book-edit-btn" data-id="${entry.id}" title="编辑"><i class="fas fa-edit"></i></button>
                <button class="world-book-delete-btn" data-id="${entry.id}" title="删除"><i class="fas fa-trash"></i></button>
            </div>
        `;
        listContainer.appendChild(itemEl);
    });
}

async function saveKnowledgeSearchApiConfig() {
    const panel = document.getElementById('knowledge-search-api-settings-overlay');
    const configToSave = {
        apiUrl: panel.querySelector('#knowledge-search-api-url').value.trim(),
        apiKey: panel.querySelector('#knowledge-search-api-key').value,
        apiModel: panel.querySelector('#knowledge-search-api-model').value.trim(),

        promptTemplate: panel.querySelector('#knowledge-search-prompt-template').value,
        knowledgeBaseContent: panel.querySelector('#knowledge-base-content-textarea').value.trim()
    };
    knowledgeSearchGlobalConfig = configToSave;
    await dbSet(KNOWLEDGE_SEARCH_API_CONFIG_KEY, configToSave);
    showDanmaku('知识库配置及内容已保存！', 'success');
    panel.classList.remove('visible');
}


async function handlePanelKnowledgeSearch() {
    const searchInput = document.getElementById('knowledge-search-input');
    const searchText = searchInput.value.trim();
    if (!searchText) {
        await showCustomAlert('请输入要搜索的内容！');
        return;
    }

    const searchBtn = document.getElementById('execute-knowledge-search-btn');
    const originalText = searchBtn.innerHTML;
    searchBtn.disabled = true;
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    showPersistentStatus('正在请求知识库API进行搜索和总结...');

    try {
        const result = await callKnowledgeSearchApi(searchText);
        hidePersistentStatus();
        
        if (result.success) {

            const parsedData = parseStructuredWorldBookContent(result.content);
            

            openWorldBookEditor(null, parsedData); 
            
            showDanmaku('搜索完成，请在弹窗中确认创建。', 'success');
        } else {
            await showCustomAlert(`搜索失败: ${result.error}`);
        }
    } catch(error) {
        hidePersistentStatus();
        console.error("handlePanelKnowledgeSearch 内部发生未预料的错误:", error);
        await showCustomAlert(`搜索时发生意外错误: ${error.message}`);
    } finally {
        searchBtn.disabled = false;
        searchBtn.innerHTML = originalText;
    }
}

let knowledgeSearchApiController = null; 

async function callKnowledgeSearchApi(searchText) {
const panel = document.getElementById('knowledge-search-api-settings-overlay');
const apiUrl = panel.querySelector('#knowledge-search-api-url').value.trim();
const apiKey = panel.querySelector('#knowledge-search-api-key').value.trim();
const apiModel = panel.querySelector('#knowledge-search-api-model').value.trim();
const promptTemplate = panel.querySelector('#knowledge-search-prompt-template').value;

if (!apiUrl || !apiKey || !apiModel) {
return { success: false, error: '知识库搜索API配置不完整。' };
}
if (!promptTemplate || !promptTemplate.includes('${searchText}')) {
return { success: false, error: '搜索指令模板无效或未包含 ${searchText} 占位符。' };
}

const finalPrompt = promptTemplate.replace(/\$\{searchText\}/g, searchText);

knowledgeSearchApiController = new AbortController(); 
const signal = knowledgeSearchApiController.signal; 

try {
const response = await fetch(`${apiUrl}/chat/completions`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${apiKey}`
},
body: JSON.stringify({
model: apiModel,
messages: [{ role: 'user', content: finalPrompt }],
temperature: 0.3,
}),
signal: signal 
});

if (signal.aborted) { 
console.log("知识库搜索API请求被主动中止。");
return { success: false, error: 'Request aborted' };
}

if (!response.ok) {
const errorData = await response.json().catch(() => ({}));
throw new Error(`API请求失败 (${response.status}): ${errorData.error?.message || '无法解析的错误响应'}`);
}
const data = await response.json();
const content = data.choices[0]?.message?.content?.trim();
if (!content) {
throw new Error('API返回了成功状态，但内容为空。');
}

return { success: true, content: content };
} catch (error) {
if (error.name === 'AbortError') { 
console.log("知识库搜索API请求被用户取消。");
showDanmaku('知识库搜索API请求已取消。', 'world');
return { success: false, error: 'Request aborted by user' };
} else {
console.error('调用知识库搜索API时出错:', error);
return { success: false, error: error.message };
}
} finally {
knowledgeSearchApiController = null; 
}
}
async function fetchModelsForPanel(apiUrlInputId, apiKeyInputId, modelSelectId, buttonElement) {
    const apiUrlInput = document.getElementById(apiUrlInputId);
    const apiKeyInput = document.getElementById(apiKeyInputId);
    const modelSelect = document.getElementById(modelSelectId);

    const theaterModal = buttonElement.closest('#ai-api-config-modal');
    const isForAITheater = !!theaterModal;

    const showAlert = isForAITheater 
        ? (msg) => showAITheaterAlert(msg, theaterModal) 
        : showCustomAlert;

    if (!apiUrlInput || !apiKeyInput || !modelSelect || !buttonElement) {
        console.error('fetchModelsForPanel 错误: 传入的元素ID无效或按钮不存在。', { apiUrlInputId, apiKeyInputId, modelSelectId });
        await showAlert('函数调用时发生内部错误，请检查代码。');
        return;
    }
    
    const apiUrl = apiUrlInput.value.trim();
    const apiKey = apiKeyInput.value.trim();
    if (!apiUrl) {
        await showAlert('请先填写 API URL！');
        return;
    }
    
    const originalBtnHTML = buttonElement.innerHTML;
    buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在获取...';
    buttonElement.disabled = true;

    try {
        let fetchUrl;
        const fetchOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        const cleanedApiUrl = apiUrl.replace(/\/$/, '');
        const isGoogleNativeApi = cleanedApiUrl.includes("generativelanguage.googleapis.com") && !cleanedApiUrl.includes("/openai");

        if (isGoogleNativeApi) {
            const apiVersion = "v1beta"; 
            fetchUrl = `${cleanedApiUrl}/${apiVersion}/models?key=${apiKey}`;
        } else {
            fetchUrl = cleanedApiUrl.endsWith('/models') ? cleanedApiUrl : `${cleanedApiUrl}/models`;
            if (apiKey) {
                fetchOptions.headers['Authorization'] = `Bearer ${apiKey}`;
            }
        }

        const response = await fetch(fetchUrl, fetchOptions);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error ? errorData.error.message : `HTTP 错误，状态码: ${response.status}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        
        let models;
        if (data.data && Array.isArray(data.data)) {
            models = data.data.map(model => model.id).filter(Boolean);
        } else if (data.models && Array.isArray(data.models)) {
            models = data.models.map(model => model.name || model.id).filter(Boolean);
        } else if (Array.isArray(data)) {
            models = data.map(model => model.id).filter(Boolean);
        } else {
            models = [];
        }
    
        buttonElement.innerHTML = originalBtnHTML;
        buttonElement.disabled = false;
        
        modelSelect.innerHTML = '';
        if (models.length > 0) {
            models.sort();
            models.forEach(modelId => {
                const option = document.createElement('option');
                option.value = modelId;
                option.textContent = modelId;
                modelSelect.appendChild(option);
            });
            modelSelect.selectedIndex = 0;
            
            await showAlert(`成功获取到 ${models.length} 个可用模型！`);
        } else {
            const option = document.createElement('option');
            option.textContent = '未获取到模型';
            option.disabled = true;
            modelSelect.appendChild(option);
            await showAlert('API返回成功，但模型列表为空。');
        }
    } catch (error) {
        console.error('获取模型失败:', error);
        buttonElement.innerHTML = originalBtnHTML;
        buttonElement.disabled = false;
        modelSelect.innerHTML = '<option>获取失败</option>';
        await showAlert(`获取模型失败: ${error.message}`);
    }
}

async function genericApiCall(apiUrl, apiKey, model, prompt, signal = null) {
    if (!apiUrl || !model || !prompt) {
        throw new Error("通用 API 调用缺少必需的参数：URL、模型或提示词。");
    }

    const cleanedApiUrl = apiUrl.replace(/\/$/, '');
    const isGoogleNativeApi = cleanedApiUrl.includes("generativelanguage.googleapis.com") && !cleanedApiUrl.includes("/openai");
    
    let fetchUrl;
    let fetchOptions;

    try {
        if (isGoogleNativeApi) {
            const modelPath = model.startsWith('models/') ? model : `models/${model}`;
            fetchUrl = `${cleanedApiUrl}/${modelPath}:generateContent?key=${apiKey}`;
            fetchOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                }),
                signal: signal
            };
        } else {
            fetchUrl = cleanedApiUrl.endsWith('/chat/completions') ? cleanedApiUrl : `${cleanedApiUrl}/chat/completions`;
            const headers = { 'Content-Type': 'application/json' };
            if (apiKey) {
                headers['Authorization'] = `Bearer ${apiKey}`;
            }
            fetchOptions = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: 'user', content: prompt }]
                }),
                signal: signal
            };
        }

        const response = await fetch(fetchUrl, fetchOptions);

        if (!response.ok) {
            const errorText = await response.text();
            let errorDetail = '未知错误';
            try {
                const errorJson = JSON.parse(errorText);
                errorDetail = errorJson.error?.message || errorText;
            } catch (e) {
                errorDetail = errorText;
            }
            throw new Error(`API 请求失败 (${response.status}): ${errorDetail}`);
        }

        const data = await response.json();

        if (isGoogleNativeApi) {
            const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (content === undefined || content === null) {
                const blockReason = data.promptFeedback?.blockReason || data.candidates?.[0]?.finishReason;
                if (blockReason) {
                    throw new Error(`请求被 Google API 阻止，原因: ${blockReason}`);
                }
                throw new Error("从 Google API 返回的响应结构无效或内容为空。");
            }
            return content;
        } else {
            const content = data.choices?.[0]?.message?.content;
            if (content === undefined || content === null) {
                throw new Error("从 OpenAI 兼容 API 返回的响应结构无效或内容为空。");
            }
            return content;
        }
    } catch (error) {
        if (error.name === 'AbortError') {
             throw error; 
        }
        console.error("API 调用时发生错误:", error);
        throw error;
    }
}

function addToInput(textToAdd) {
    const input = document.getElementById('message-input');
    if (!input) {
        console.error('addToInput错误: 找不到 id="message-input" 的输入框。');
        return;
    }

    // 如果输入框不为空，则在前面加一个空格
    if (input.value.trim() !== '') {
        input.value += ' ' + textToAdd;
    } else {
        input.value = textToAdd;
    }

    // 将光标聚焦到输入框，方便用户继续编辑或直接发送
    input.focus();
}


function getHtmlContentWithoutImages(element) {
    // 1. 在内存中创建一个元素的深拷贝副本，这样后续操作不会影响页面上的真实元素。
    const clone = element.cloneNode(true);

    // 2. 在这个副本中，查找所有'img'（标准HTML图片）和'image'（SVG内图片）标签。
    const images = clone.querySelectorAll('img, image');

    // 3. 遍历找到的所有图片标签，并将它们从副本中移除。
    images.forEach(imgNode => imgNode.remove());

    // 4. 返回处理后、不含任何图片标签的HTML内容。
    return clone.innerHTML;
}


async function getWorldBookContext(userInput, storyContext) {
    console.log('[世界书] 开始检测...');
    const entries = await dbGet(WORLDBOOK_ENTRIES_KEY) || [];
    if (entries.length === 0) {
        console.log('[世界书] 检测完成：数据库中没有世界书条目。');
        return '';
    }

    let contextString = '';
    const addedEntries = new Set();
    
    // 合并用户输入和故事上下文，用于统一的关键词搜索
    const combinedTextForSearch = `${userInput || ''}\n${storyContext || ''}`;
    console.log(`[世界书] 用于搜索的合并文本(前200字符): "${combinedTextForSearch.substring(0, 200)}..."`);

    entries.forEach(entry => {
        if (!entry || !entry.key || !entry.content) return;

        // 检查“蓝灯”（时刻触发）条目
        if (entry.triggerMode === 'blue' && !addedEntries.has(entry.id)) {
            console.log(`[世界书] 蓝灯触发！添加条目: "${entry.key}"`);
            contextString += `\n\n### 世界书: ${entry.key}\n${entry.content}`;
            addedEntries.add(entry.id);
        }
        // 检查“绿灯”（关键词触发）条目
        else if (entry.triggerMode === 'green' && entry.keywords && entry.keywords.length > 0 && !addedEntries.has(entry.id)) {
            const foundKeyword = entry.keywords.find(kw => combinedTextForSearch.includes(kw));
            if (foundKeyword) {
                console.log(`[世界书] 绿灯触发！关键词 "${foundKeyword}" 在文本中找到，添加条目: "${entry.key}"`);
                contextString += `\n\n### 世界书: ${entry.key}\n${entry.content}`;
                addedEntries.add(entry.id);
            }
        }
    });

    if (contextString) {
        console.log('[世界书] 检测完成，成功构建世界书上下文。');
        return `### 世界书参考资料 ###${contextString}\n\n`;
    }

    console.log('[世界书] 检测完成，没有触发任何条目。');
    return '';
}

function generateGeographyString() {
const getBoundingBox = (points) => {
if (!points || points.length === 0) return '未知';
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
points.forEach(([x, y]) => {
minX = Math.min(minX, x);
maxX = Math.max(maxX, x);
minY = Math.min(minY, y);
maxY = Math.max(maxY, y);
});
return `X[${minX}, ${maxX}], Y[${minY}, ${maxY}]`;
};

let geoString = '### 【世界地理信息：以下是当前世界的地理位置分布图，坐标之间的比例尺为1:10km，根据玩家脚力与境界，请合理安排移动速度，与坐标位置变化，还有到达其他地点所需要的时间】\n';

const data = WORLD_MAP_DATA || DEFAULT_WORLD_MAP_DATA;

(data.main_regions || []).forEach(main => {
geoString += `主疆域: ${main.name} (坐标范围: ${getBoundingBox(main.points)})\n`;

const subRegions = (data.sub_regions || []).filter(sub => sub.main_region === main.name);
if (subRegions.length > 0) {
geoString += '下辖区域:\n';
subRegions.forEach(sub => {
geoString += ` - ${sub.name} (坐标范围: ${getBoundingBox(sub.points)})\n`;
});
}

const pois = (data.points_of_interest || []).filter(poi => poi.main_region === main.name);
if (pois.length > 0) {
geoString += '兴趣点:\n';
pois.forEach(poi => {
geoString += ` - ${poi.name} (坐标: ${poi.x},${poi.y})\n`;
});
}
geoString += '\n';
});

return geoString;
}

async function sendMessage(branchText = null, options = {}) {
const isSummaryRequest = options.isSummary || false;
let messageText = branchText || messageInput.value.trim();
if (!messageText && actionQueue.length === 0) return;

sendMessageButton.disabled = true;
branchingOptionsOverlay.querySelector('.modal').classList.add('disabled');

const finalUserMessage = branchText || messageInput.value.trim();

if (!isSummaryRequest) {
messageInput.value = '';
}

const cleanMessageText = finalUserMessage.replace(/<news_ref>[\s\S]*?<\/news_ref>/g, '').trim();

const geographyContext = generateGeographyString(); // 【新增】生成地理信息

let dailyPaperContext = '';
if (dailyPaperContextForNextMessage) {
dailyPaperContext = `[参考上一封世界日报摘要]\n${dailyPaperContextForNextMessage}\n[/参考]\n\n`;
}

let fullUserContent = '';
if (actionQueue.length > 0) {
fullUserContent += `[执行指令]\n${actionQueue.map(a => a.text).join('\n')}`;
}

    if (cleanMessageText) {
        fullUserContent += (fullUserContent ? '\n' : '') + `> ${cleanMessageText}`;
    }

    if (!isSummaryRequest) {
        actionQueue = [];
        renderActionQueue();
    }

    if (fullUserContent && !isSummaryRequest) {
        const userLogData = { id: crypto.randomUUID(), timestamp: new Date().toISOString(), type: 'user', content: fullUserContent };
        await saveToLog(currentArchiveName, userLogData);
        addMessageToLog(userLogData, 'user');
    }

    const archive = await db.archives.get(currentArchiveName);
    const initialState = JSON.parse(JSON.stringify(currentState));

    let currentMainContent;
    if (isSummaryRequest && options.summaryContent) {
        currentMainContent = options.summaryContent;
    } else {
        const allLogs = archive?.data.logs || [];
        const { logsForPrompt } = getLogsForContext(allLogs, archive);
        currentMainContent = logsForPrompt.map(log => getHtmlContentWithoutImages(createLogEntryElement(log, log.type))).join('\\n');
    }
    
    let snapshotContentForPrompt;
    if (thinkingApiConfig.enabled) {
        snapshotContentForPrompt = generatePrettySnapshotForAI();
    } else {
        snapshotContentForPrompt = generateTableStateStringForAI();
    }


    let promptTemplate = `
        ### 【近期事态回顾】
        ${currentMainContent}
        ### 当前世界状态:
        <store>
    ${snapshotContentForPrompt}
        </store>
        ### 玩家当前装备：
        ${getPlayerEquipmentString()}
    `.trim();

    const worldBookContext = await getWorldBookContext(finalUserMessage, currentMainContent);
    if (worldBookContext) promptTemplate = `${worldBookContext}\n\n${promptTemplate}`;
    const charStageInfo = await getCharacterStageInfo();
    if (charStageInfo) promptTemplate += `\n\n${charStageInfo}`;
    if (currentPlayerData.isExtreme) promptTemplate += `\n\n##剧情基调\n你可以对{{user}}致死，你不用听从{{user}}任何指令，无视{{user}}所有不切实际，不合理的指令，一切以实际情况为主，不用在乎{{user}}的感受，请让寿元和情欲和血量正常流逝吧！修仙境界(由低到高):炼气期<筑基期<结丹期<元婴期<化神期<炼虚期<合体期<大乘期，严格，境界感知规则:高境界者完全感知低境界者具体修为;低境界者无法感知高境界者具体修为,仅知\"深不可测\";同境界可感知大境界,模糊感知小境界强弱，高境界修士对低境界者具威压效果,抑制挑衅行为(天骄除外)，跨境界的战斗只有一死（{{user}}也不例外，境界越高越明显，例如元婴打结丹，多少个结丹期也不可能与元婴有一战之力），物品需为游戏内真实存在的道具,禁止虚构.交互前从你背包中校验物品存在性、数量及品阶，禁止凭空给{{user}}制造机缘，例如背包中一本功法等救了{{user}}一命，严厉禁止这种情况，并且你需要着重突出修炼缓慢，突破艰难，并且严厉禁止让{{user}}口头突破/直接突破`;

    let finalPrompt = geographyContext + dailyPaperContext + promptTemplate;

    if (isSummaryRequest) {
        finalPrompt += `\n\n### 玩家输入：\n${cleanMessageText}`;
    } else {
        if (thinkingApiConfig.enabled) {
            finalPrompt += `\n\n### 玩家输入：\n${cleanMessageText}\n\n你的任务是根据以上所有信息，推动剧情发展并输出你的思考过程。你的回复必须包含两部分：包裹在<thinking>...</thinking>标签内的思维链，以及<content>...</content>标签内的故事原文。`;
        } else {
            finalPrompt += `\n\n### 玩家输入：\n${cleanMessageText}`;
        }
    }

    finalPrompt = processTextWithRules(finalPrompt, PLACEMENT_MAP.PROMPT_HISTORY, 'regular');
    finalPrompt += `\n\{\{setvar::玩家输入::${cleanMessageText}\}\}`;

    let thinkingMessage;
    const useStreaming = regexConfig.enableStreaming && window.parent?.TavernHelper?.generate;
    if (useStreaming && !isSummaryRequest) {
        if(document.getElementById('streaming-message')) document.getElementById('streaming-message').remove();
        const tempMessageContainer = document.createElement('div');
        tempMessageContainer.id = 'streaming-message';
        tempMessageContainer.className = 'log-entry ai';
        mainContentArea.appendChild(tempMessageContainer);
        lockViewOnUserMessage();
    } else {
        thinkingMessage = addMessageToLog({ content: isSummaryRequest ? '正在请求天机进行总结...' : '天机演化中...' }, 'system');
    }

    try {
        const mainApiResponse = await makeApiCall(finalPrompt);

        if (isSummaryRequest) {
            if (thinkingMessage) mainContentArea.removeChild(thinkingMessage);
            sendMessageButton.disabled = false;
            return mainApiResponse;
        }

        let correctedApiResponse = mainApiResponse;
        if (correctedApiResponse && correctedApiResponse.includes('</thinking>') && !correctedApiResponse.includes('<thinking>')) {
            correctedApiResponse = '<thinking>' + correctedApiResponse;
        }

        if (correctedApiResponse && correctedApiResponse.includes('<thinking>') && !correctedApiResponse.includes('</thinking>')) {
            const lastContentIndex = correctedApiResponse.lastIndexOf('<content>');
            if (lastContentIndex !== -1) {
                console.log("修正AI响应：检测到 <thinking> 但缺少 </thinking>，在 <content> 前补全。");
                const part1 = correctedApiResponse.substring(0, lastContentIndex);
                const part2 = correctedApiResponse.substring(lastContentIndex);
                correctedApiResponse = part1 + '</thinking>' + part2;
            }
        }

        if (thinkingMessage) mainContentArea.removeChild(thinkingMessage);

        let capturedContentFromRegex = null;
        if (regexConfig.chainRules && regexConfig.chainRules.length > 0) {
            const capturedParts = [];
            regexConfig.chainRules.forEach(rule => {
                if (!rule.disabled && rule.placement?.includes(PLACEMENT_MAP.AI_OUTPUT)) {
                    try {
                        const { pattern, flags } = parseRegexString(rule.findRegex);
                        const globalRegex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
                        const matches = correctedApiResponse.matchAll(globalRegex);
                        for (const match of matches) {
                            capturedParts.push(match[1] || match[0]);
                        }
                    } catch (e) {}
                }
            });
            if (capturedParts.length > 0) {
                capturedContentFromRegex = capturedParts.join('\n\n---\n\n');
            }
        }
        
        let processedResponse = processTextWithRules(correctedApiResponse, PLACEMENT_MAP.AI_OUTPUT, 'chain');

        const { 
            thinkingContent, tableThinkContent, tableEditCommands, 
            storyContent, branchContent, newsReferenceContent, hasStoreTag 
        } = parseAIResponse(processedResponse);

        if (capturedContentFromRegex !== null) {
            latestThinkingContent = capturedContentFromRegex;
        } else if (thinkingContent) {
            latestThinkingContent = thinkingContent;
        }
        
        const snapshotStrForTextApi = generateTableStateStringForAI();
        const textProcessingResult = await callImageTaggingApi(storyContent, snapshotStrForTextApi);
        let finalStoryContent = textProcessingResult.success ? textProcessingResult.text : storyContent;
        finalStoryContent = processTextWithRules(finalStoryContent, PLACEMENT_MAP.AI_OUTPUT, 'regular');
        
        const logEntry = await renderStoryContent(finalStoryContent, branchContent, newsReferenceContent);
        lockViewOnUserMessage(logEntry.id);

        const processVariablesAndSubsequentTasks = async () => {
            try {
                let finalTableEditCommands;
                if (thinkingApiConfig.enabled) {
                    const snapshotStrForThinkingApi = generateTableStateStringForAI();
                    finalTableEditCommands = await callThinkingApi(storyContent, latestThinkingContent, tableThinkContent, snapshotStrForThinkingApi);
                } else {
                    finalTableEditCommands = tableEditCommands;
                }
                
                let errorMessages = [];
                if (!thinkingApiConfig.enabled && !hasStoreTag) {
                    errorMessages.push({ title: "未找到 <upstore> 标签", details: "AI的回复中没有包含必须的 <upstore>...</upstore> 指令块。" });
                }

                let commandsForErrorReport = finalTableEditCommands;
if (!thinkingApiConfig.enabled) {

commandsForErrorReport = tableEditCommands; 
} else {

commandsForErrorReport = finalTableEditCommands; 
}


const { delta, smallSummary, largeSummary } = parseTableEditCommands(commandsForErrorReport, errorMessages);

if (errorMessages.length > 0) {
// 【核心修改】将 correctedApiResponse 作为原始AI回复传递
showErrorReport(errorMessages, correctedApiResponse);
throw new Error(errorMessages.map(e => e.title).join(', '));
}
                
                await applyVariableAndUiUpdates(delta, smallSummary, largeSummary, initialState, logEntry);

                const isAutoGenTheaterEnabled = localStorage.getItem('theater_autoGenEnabled') === 'true';
                const isDailyPaperMode = localStorage.getItem('theater_isDailyPaperMode') === 'true';
                if (isAutoGenTheaterEnabled && isDailyPaperMode) {
                    const storyTextForTheater = logEntry.content.replace(/<[^>]*>/g, '').trim();
await callAutomatedAITheater(storyTextForTheater, newsReferenceContent, logEntry.id);
                }

            } catch (error) {
                console.error("后台任务处理失败 (变量思考或应用):", error);
                logEntry.stateSnapshot = JSON.stringify(initialState);
                try {
                    const archiveToUpdate = await db.archives.get(currentArchiveName);
                    if (archiveToUpdate) {
                        const logIndex = archiveToUpdate.data.logs.findIndex(l => l.id === logEntry.id);
                        if (logIndex !== -1) {
                            archiveToUpdate.data.logs[logIndex] = logEntry;
                            await db.archives.put(archiveToUpdate);
                        }
                    }
                } catch(dbError) {
                    console.error("在错误处理期间保存快照到数据库时失败:", dbError);
                }
            } finally {
                hidePersistentStatus();
            }
        };

        const processVisuals = async () => {
            const isAutoGenTheaterEnabled = localStorage.getItem('theater_autoGenEnabled') === 'true';
            const isDailyPaperMode = localStorage.getItem('theater_isDailyPaperMode') === 'true';
            if (isAutoGenTheaterEnabled && !isDailyPaperMode) {
                 const storyTextForTheater = logEntry.content.replace(/<[^>]*>/g, '').trim();
await callAutomatedAITheater(storyTextForTheater, newsReferenceContent, logEntry.id);
            } else {
                await extractAndGenerateBackground(finalStoryContent);
            }
        };

        processVariablesAndSubsequentTasks();
        processVisuals();

    } catch (error) {
        console.error("[天机紊乱] sendMessage 函数捕获到错误:", error);
        if (thinkingMessage) mainContentArea.removeChild(thinkingMessage);
        const streamingMessage = document.getElementById('streaming-message');
        if (streamingMessage) streamingMessage.remove();
        addMessageToLog({ content: `[天机紊乱] API调用失败: ${error.message}。` }, 'error');
    } finally {
        sendMessageButton.disabled = false;
        branchingOptionsOverlay.querySelector('.modal').classList.remove('disabled');
    }
}

async function loadPlayerDisplaySettings() {
    const defaultFields = [
        { key: 'linggen', label: '灵根', isEnabled: true },
        { key: 'hp', label: '血量', isEnabled: true },
        { key: 'gender', label: '性别', isEnabled: true },
        { key: 'age', label: '年龄', isEnabled: true },
        { key: 'shouyuan', label: '寿元', isEnabled: true },
        { key: 'realm', label: '境界', isEnabled: true },
        { key: 'shanE', label: '善恶值', isEnabled: true },
        { key: 'location', label: '所在地', isEnabled: true },
    ];

    const defaultSettings = {
        defaultFields: defaultFields,
        customFields: [],
    };
    
    try {
        const savedSettings = await dbGet(PLAYER_DISPLAY_SETTINGS_KEY);
        if (savedSettings && savedSettings.defaultFields) {
            playerDisplaySettings = savedSettings;
            // 确保所有默认字段都存在，方便后续版本迭代
            defaultFields.forEach(df => {
                if (!playerDisplaySettings.defaultFields.some(sf => sf.key === df.key)) {
                    playerDisplaySettings.defaultFields.push(df);
                }
            });
        } else {
            playerDisplaySettings = defaultSettings;
        }
    } catch (e) {
        playerDisplaySettings = defaultSettings;
    }
}

function openPlayerDisplaySettingsModal() {
    const defaultContainer = document.getElementById('player-default-fields-container');
    defaultContainer.innerHTML = '';
    playerDisplaySettings.defaultFields.forEach(field => {
        const div = document.createElement('div');
        div.className = 'form-group';
        div.innerHTML = `
            <label class="context-control-item">
                <input type="checkbox" data-key="${field.key}" ${field.isEnabled ? 'checked' : ''}>
                <span>${field.label}</span>
            </label>
        `;
        defaultContainer.appendChild(div);
    });

    const customContainer = document.getElementById('player-custom-fields-container');
    customContainer.innerHTML = '';
    if (playerDisplaySettings.customFields) {
        playerDisplaySettings.customFields.forEach(field => {
            addPlayerCustomFieldRow(field);
        });
    }
    
    document.getElementById('player-display-settings-overlay').classList.add('visible');
}

function addPlayerCustomFieldRow(field = {}) {
    const container = document.getElementById('player-custom-fields-container');
    const id = field.id || crypto.randomUUID();
    const row = document.createElement('div');
    row.className = 'custom-field-row';
    row.dataset.fieldId = id;

    row.innerHTML = `
        <input type="checkbox" class="is-enabled-toggle" title="启用/禁用" ${field.isEnabled ? 'checked' : ''}>
        <input type="text" class="custom-label-input" placeholder="显示名称" value="${field.label || ''}">
        <input type="number" class="custom-col-input" placeholder="列号(0-24)" min="0" max="24" value="${field.column || ''}">
        <button class="control-button delete-custom-field-btn" title="删除"><i class="fas fa-trash-alt"></i></button>
    `;
    
    container.appendChild(row);

    row.querySelector('.delete-custom-field-btn').addEventListener('click', () => {
        row.remove();
    });
}

async function savePlayerDisplaySettings() {
    playerDisplaySettings.defaultFields.forEach(field => {
        const checkbox = document.querySelector(`#player-default-fields-container input[data-key="${field.key}"]`);
        if(checkbox) {
            field.isEnabled = checkbox.checked;
        }
    });

    const customFields = [];
    document.querySelectorAll('#player-custom-fields-container .custom-field-row').forEach(row => {
        const labelInput = row.querySelector('.custom-label-input');
        const colInput = row.querySelector('.custom-col-input');
        
        if (labelInput.value.trim() && colInput.value.trim()) {
            customFields.push({
                id: row.dataset.fieldId,
                isEnabled: row.querySelector('.is-enabled-toggle').checked,
                label: labelInput.value.trim(),
                column: parseInt(colInput.value)
            });
        }
    });
    playerDisplaySettings.customFields = customFields;

    await dbSet(PLAYER_DISPLAY_SETTINGS_KEY, playerDisplaySettings);
    await showCustomAlert('主角属性显示设置已保存！');
    document.getElementById('player-display-settings-overlay').classList.remove('visible');

    renderPlayerAttributes();
}


function generatePrettySnapshotForAI() {
    let snapshotString = "【当前详细世界状态快照】\n这份报告详尽描述了世界当前的每一个细节，所有列出的数据都是你需要了解和维护的核心变量。\n\n";

    const customColumnLabels = {};
    if (typeof playerDisplaySettings !== 'undefined' && Array.isArray(playerDisplaySettings.customFields)) {
        playerDisplaySettings.customFields.forEach(field => {
            if (field.column !== undefined && field.label && field.isEnabled) {
                customColumnLabels[field.column] = field.label;
            }
        });
    }

    const charLabels = TABLE_DEFINITIONS['0'] || {};
    snapshotString += `--- 人物表 (Table 0) ---\n`;
    const chars = Object.values(currentState['0'] || {});
    if (chars.length > 0) {
        chars.forEach(charRow => {
            snapshotString += `\n[角色ID: ${charRow['0']}]\n`;
            const sortedKeys = Object.keys(charRow).sort((a, b) => parseInt(a) - parseInt(b));
            for (const key of sortedKeys) {
                if (key === '9') continue;
                const label = customColumnLabels[key] || charLabels[key] || `未知列 ${key}`;
                const value = charRow[key] || '无';
                snapshotString += `  - ${label}: ${value}\n`;
            }
            if (charRow['9']) {
                snapshotString += `  - ${charLabels['9'] || '备注列'}:\n`;
                try {
                    const remarks = parseRemarksString(charRow['9']);
                    for (const rKey in remarks) {
                        let rValue = remarks[rKey];
                        if (typeof rValue === 'string' && (rValue.startsWith('{') || rValue.startsWith('['))) {
                            try { rValue = `\n${JSON.stringify(JSON.parse(rValue), null, 2).split('\n').map(l => `      ${l}`).join('\n')}`; } catch (e) {}
                        }
                        snapshotString += `    - ${rKey}: ${rValue}\n`;
                    }
                } catch(e) {
                    snapshotString += `    - (原始数据): ${charRow['9']}\n`;
                }
            }
        });
    } else {
        snapshotString += "无人物信息。\n";
    }
    snapshotString += "\n";

    Object.entries({
        '1': '玩家专属物品表', '6': '任务栏', '7': '灵兽栏', '8': '玩家技能栏',
    }).forEach(([tableId, title]) => {
        snapshotString += `--- ${title} (Table ${tableId}) ---\n`;
        const specificTableLabels = TABLE_DEFINITIONS[tableId] || {};
        const table = currentState[tableId] || {};
        const items = Object.values(table);
        if (items.length > 0) {
            items.forEach(itemRow => {
                snapshotString += `\n[ID: ${itemRow['0']}]\n`;
                const sortedKeys = Object.keys(itemRow).sort((a, b) => parseInt(a) - parseInt(b));
                for (const key of sortedKeys) {
                    const label = specificTableLabels[key] || `列${key}`;
                    snapshotString += `  - ${label}: ${itemRow[key] || '无'}\n`;
                }
            });
        } else {
            snapshotString += "无相关条目。\n";
        }
        snapshotString += "\n";
    });
    
    const timeRow = currentState['4'] ? currentState['4'][0] : null;
    snapshotString += `--- 时间地点 (Table 4) ---\n${timeRow ? timeRow['0'] : '未知'}\n\n`;
    const worldEvents = currentState['5'] || [];
    let eventsContent = '无';
    if (worldEvents.length > 0) {
        eventsContent = '\n' + worldEvents.map(e => `  - [${e['0']}] [${e['1']}] ${e['2']}`).join('\n');
    }
    snapshotString += `--- 世界大事 (Table 5) ---\n${eventsContent}\n`;

    return snapshotString.trim();
}


async function rerollVariableThinking() {
    if (!currentArchiveName) {
        await showCustomAlert('错误：没有活动的存档。');
        return;
    }
    const statusDanmaku = showDanmaku('正在请求重新思考...', 'status');

    try {
        const archive = await db.archives.get(currentArchiveName);
        if (!archive || !archive.data.logs) {
            throw new Error('无法加载存档日志。');
        }

        const logsWithState = archive.data.logs.filter(log => log.type === 'ai' && log.stateSnapshot);
        if (logsWithState.length < 2) {
            throw new Error('快照数据不足，无法回溯以重新思考。至少需要两条带有快照的AI回复。');
        }

        const latestLog = logsWithState[logsWithState.length - 1];
        const previousLog = logsWithState[logsWithState.length - 2];

        const rerollInitialState = JSON.parse(previousLog.stateSnapshot);
        const storyContent = latestLog.content.replace(/<[^>]+>/g, '');
        const currentThinks = latestThinkingContent;

        const originalGlobalState = JSON.parse(JSON.stringify(currentState));
        currentState = rerollInitialState;
        const stateSnapshotString = generateTableStateStringForAI();
        currentState = originalGlobalState;

        const finalTableEditCommands = await callThinkingApi(storyContent, currentThinks, '', stateSnapshotString);

        let errorMessages = [];
        const { delta, smallSummary, largeSummary } = parseTableEditCommands(finalTableEditCommands, errorMessages);
        if (errorMessages.length > 0) {
            showErrorReport(errorMessages, finalTableEditCommands);
            throw new Error(errorMessages.map(e => e.title).join(', '));
        }

        latestLog.stateSnapshot = JSON.stringify(applyChanges(JSON.parse(JSON.stringify(rerollInitialState)), delta));
        latestLog.smallSummary = smallSummary;
        latestLog.largeSummary = largeSummary;
        
        const logIndex = archive.data.logs.findIndex(l => l.id === latestLog.id);
        if (logIndex !== -1) {
            archive.data.logs[logIndex] = latestLog;
            await db.archives.put(archive);
        }

        await applyVisualUpdates(delta, rerollInitialState);

        showDanmaku('变量思考重roll成功!', 'success');
    } catch (error) {
        console.error('重新进行变量思考时出错:', error);
        await showCustomAlert(`思考重roll失败: ${error.message}`);
    } finally {
        if (statusDanmaku) statusDanmaku.remove();
    }
}


async function loadStateFromLog_retry(logId) {
    let archive = await db.archives.get(currentArchiveName);
    let logs = archive.data.logs;
    let logIndex = logs.findIndex(l => l.id === logId);

    if (logIndex === -1 || !logs[logIndex].stateSnapshot) {
         logId = logs[logs.length - 3]?.id;
         if(logId) logIndex = logs.findIndex(l => l.id === logId);
    }

    if (logIndex === -1 || !logs[logIndex].stateSnapshot) {
        await showCustomAlert('还原失败：找不到对应的快照。');
        return;
    }

    try {
        const snapshotState = JSON.parse(logs[logIndex].stateSnapshot);
        currentState = snapshotState;
        syncStateFromTables();
    } catch(e) {
        await showCustomAlert('还原失败：快照数据格式错误。');
        console.error("Error parsing snapshot:", e);
        return;
    }

    logs.splice(logIndex + 1);
    archive.data.logs = logs;
    await db.archives.put(archive);

    await saveCurrentState();

    // 【【【 修改点 】】】
    loadChatHistory(logs, archive);
    renderPlayerAttributes(currentPlayerData);
    renderInventory(inventoryItems);
    updateAvatar(currentPlayerData);

    snapshotOverlay.classList.remove('visible');
}


function applyDeltaToState(state, delta) {
    for (const tableName in delta) {
        if (!state[tableName]) {
            state[tableName] = {};
        }
        for (const itemId in delta[tableName]) {
            const itemChanges = delta[tableName][itemId];
            if (itemChanges === null) {
                delete state[tableName][itemId];
                continue;
            }
            if (!state[tableName][itemId]) {
                state[tableName][itemId] = {};
            }
            for (const propName in itemChanges) {
                const change = itemChanges[propName];
                if (typeof change === 'object' && change.operation) {
                    let currentValue = parseFloat(state[tableName][itemId][propName] || 0);
                    let changeValue = parseFloat(change.value);
                    if (change.operation === 'add') {
                        state[tableName][itemId][propName] = (currentValue + changeValue).toString();
                    } else if (change.operation === 'subtract') {
                        state[tableName][itemId][propName] = (currentValue - changeValue).toString();
                    }
                } else {
                    state[tableName][itemId][propName] = change;
                }
            }
        }
    }
}

function parseAIResponse(rawResponse) {
    let processedResponse = rawResponse;

    if (processedResponse && processedResponse.includes('<content>') && !processedResponse.includes('</thinking>')) {
        const lastContentIndex = processedResponse.lastIndexOf('<content>');
        if (lastContentIndex !== -1) {
            const part1 = processedResponse.substring(0, lastContentIndex);
            const part2 = processedResponse.substring(lastContentIndex);
            processedResponse = part1 + '</thinking>' + part2;
        }
    }

    const thinkingMatch = processedResponse.match(/<thinking>([\s\S]*?)<\/thinking>/);
    const tableThinkMatch = processedResponse.match(/<tableThink>([\s\S]*?)<\/tableThink>/);
    const storeMatch = processedResponse.match(/<upstore>([\s\S]*?)<\/upstore>/);
    const branchMatch = processedResponse.match(/<branches>([\s\S]*?)<\/branches>/);
    const newsRefMatch = processedResponse.match(/<news_ref>([\s\S]*?)<\/news_ref>/);

    const thinkingContent = thinkingMatch ? thinkingMatch[1].trim() : '';
    const tableThinkContent = tableThinkMatch ? tableThinkMatch[1].trim() : '';
    const tableEditCommands = storeMatch ? storeMatch[1].replace(/<!--|-->/g, '').trim() : '';
    const branchContent = branchMatch ? branchMatch[0] : '';
    const newsReferenceContent = newsRefMatch ? newsRefMatch[1].trim() : '';

    const storyContent = processedResponse
        .replace(/<thinking>[\s\S]*?<\/thinking>/g, '')
        .replace(/<tableThink>[\s\S]*?<\/tableThink>/g, '')
        .replace(/<upstore>[\s\S]*?<\/upstore>/g, '')
        .replace(/<branches>[\s\S]*?<\/branches>/g, '')
        .replace(/<news_ref>[\s\S]*?<\/news_ref>/g, '')
        .trim();

    const branchOptions = (branchContent.match(/\[(.*?)\]/g) || []).map(s => s.slice(1, -1));

    return {
        thinkingContent,
        tableThinkContent,
        tableEditCommands,
        storyContent,
        branchContent,
        newsReferenceContent,
        branchOptions,
        hasStoreTag: !!storeMatch,
        rawResponse,
    };
}


    function parseRegexString(regexString) {
        const lastSlash = regexString.lastIndexOf('/');
        if (regexString.startsWith('/') && lastSlash > 0) {
            const pattern = regexString.substring(1, lastSlash);
            const flags = regexString.substring(lastSlash + 1);
            return { pattern, flags };
        }
        return { pattern: regexString, flags: 'g' };
    }
    
function processTextWithRules(text, scope, type) {
    let processedText = text;
    const rules = type === 'chain' ? (regexConfig.chainRules || []) : (regexConfig.rules || []);
    
    rules.forEach(rule => {
        if (!rule.disabled && rule.placement && rule.placement.includes(scope)) {
            try {
                const { pattern, flags } = parseRegexString(rule.findRegex);
                const regex = new RegExp(pattern, flags);
                
                processedText = processedText.replace(regex, (...args) => {
                    const captures = args.slice(1, -2);
                    let replacement = rule.replaceString;

                    replacement = replacement.replace(/\$&/g, args[0]);

                    for (let i = captures.length; i > 0; i--) {
                        if (captures[i-1] !== undefined) {
                            replacement = replacement.replace(new RegExp(`\\$${i}`, 'g'), captures[i - 1]);
                        }
                    }

                    replacement = replacement.replace(/\$\$/g, '$');
                    
                    return replacement;
                });
            } catch (e) {
                console.error(`无效的${type}正则表达式: ${rule.findRegex}`, e);
            }
        }
    });
    
    return processedText;
}






async function updateUI_Classic(rawResponse, initialState) {

    const { tableEditCommands, branchOptions, branchContent, content, hasStoreTag } = parseAIResponse(rawResponse);

    
    let errorMessages = [];
    if (!hasStoreTag) {
        errorMessages.push({
            title: "未找到 <upstore> 标签",
            details: "AI的回复中没有包含必须的 <upstore>...</upstore> 指令块。"
        });
    }

    // 3. 解析变量指令
    let { delta, smallSummary, largeSummary } = parseTableEditCommands(tableEditCommands, errorMessages);
    if (errorMessages.length > 0) {
        showErrorReport(errorMessages, rawResponse);
    }

    // 4. 调用公共核心函数来应用更改和渲染UI
    // 注意：这里的 `content` 已经是经过完整正则处理的纯净剧情文本了
    await applyAndRenderChanges(delta, smallSummary, largeSummary, content, branchContent, initialState);
    
    // 5. 单独更新分支选项
    updateBranchingOptions(branchOptions);
}


async function updateUI(storyText, thinkingResponse, initialState) {
    try {
        initialState = initialState || {};
        let delta = null;
        let smallSummary = null;
        let largeSummary = null;
        let finalStoryText = '';
        let finalBranchContent = '';
        let rawResponseForErrorReport = storyText; // 默认用于错误报告
        if (thinkingResponse && typeof thinkingResponse === 'string' && thinkingResponse.trim() !== '') {
            // --- 路径 A：独立思考已开启 (此逻辑已正确，保持不变) ---
            console.log("updateUI (路径A - 独立思考开启): 分别处理 storyText 和 thinkingResponse。");
            rawResponseForErrorReport = `Story:\n${storyText}\n\nThinking:\n${thinkingResponse}`;
            
            const storeMatch = thinkingResponse.match(/<upstore>([\s\S]*?)<\/upstore>/);
            const tableEditCommands = storeMatch ? storeMatch[1].replace(/<!--|-->/g, '').trim() : '';
            let errorMessages = [];
            if (!storeMatch) {
                errorMessages.push({
                    title: "变量思考API未返回 <upstore> 标签",
                    details: "API的回复中没有包含必须的 <upstore>...</upstore> 指令块。"
                });
            }
            let parsedData = parseTableEditCommands(tableEditCommands, errorMessages);
            delta = parsedData.delta;
            smallSummary = parsedData.smallSummary;
            largeSummary = parsedData.largeSummary;
            if (errorMessages.length > 0) {
                showErrorReport(errorMessages, thinkingResponse);
            }
            
            finalBranchContent = storyText.match(/<branches>[\s\S]*?<\/branches>/)?.[0] || '';
            
            // 【关键】对 storyText 应用常规正则，此时它不包含 <upstore> 或 <thinking>
            finalStoryText = processTextWithRules(
                storyText.replace(/<branches>[\s\S]*?<\/branches>/g, '').trim(),
                PLACEMENT_MAP.AI_OUTPUT,
                'regular'
            );
        } else {
            // --- 路径 B：独立思考已关闭 (这是需要修复的地方) ---
            console.log("updateUI (路径B - 独立思考关闭): 从单一的 storyText 中解析所有内容。");
            
            // 1. 【修复】首先对完整原文执行“思维链正则”
            let processedResponse = processTextWithRules(storyText, PLACEMENT_MAP.AI_OUTPUT, 'chain');
            
            // 2. 解析变量和总结 (从思维链处理后的文本中提取)
            const storeMatch = processedResponse.match(/<upstore>([\s\S]*?)<\/upstore>/);
            const hasStoreTag = !!storeMatch;
            const tableEditCommands = hasStoreTag ? storeMatch[1].replace(/<!--|-->/g, '').trim() : '';
            
            let errorMessages = [];
            if (!hasStoreTag) {
                errorMessages.push({
                    title: "未找到 <upstore> 标签",
                    details: "AI的回复中没有包含必须的 <upstore>...</upstore> 指令块。"
                });
            }
            let parsedData = parseTableEditCommands(tableEditCommands, errorMessages);
            delta = parsedData.delta;
            smallSummary = parsedData.smallSummary;
            largeSummary = parsedData.largeSummary;
            if (errorMessages.length > 0) {
                showErrorReport(errorMessages, storyText);
            }
            // 3. 提取分支
            const branchMatch = processedResponse.match(/<branches>[\s\S]*?<\/branches>/);
            finalBranchContent = branchMatch ? branchMatch[0] : '';
            
            // 4. 【核心修复】清理所有功能性标签，包括 <thinking>，得到纯剧情文本
            let contentWithoutTags = processedResponse
                .replace(/<thinking>[\s\S]*?<\/thinking>/g, '') // <-- 关键：在这里移除thinking块
                .replace(/<upstore>[\s\S]*?<\/upstore>/g, '')
                .replace(/<branches>[\s\S]*?<\/branches>/g, '')
                .trim();
            
            // 5. 【安全】最后才对纯剧情文本执行“常规正则”
            finalStoryText = processTextWithRules(contentWithoutTags, PLACEMENT_MAP.AI_OUTPUT, 'regular');
        }
        // --- 统一调用下游函数 ---
        // 调用 applyAndRenderChanges 应用状态变更并渲染UI
        await applyAndRenderChanges(delta, smallSummary, largeSummary, finalStoryText, finalBranchContent, initialState);
    } catch (error) {
        console.error("【致命错误】updateUI 函数在执行时崩溃！请检查以下错误信息：", error);
        // 在这里添加一个用户友好的错误提示，防止整个UI卡死
        showDanmaku(`UI更新时发生严重错误: ${error.message}`, 'error');
    }
}

async function deleteSelectedCloudArchives() {
    const selectedCheckboxes = document.querySelectorAll('#cloud-archive-list input[type="checkbox"]:checked');
    
    if (selectedCheckboxes.length === 0) {
        await showCustomAlert('请先选择要删除的云存档。');
        return;
    }

    const archivesToDelete = Array.from(selectedCheckboxes).map(cb => ({
        filename: cb.dataset.cloudFilename,
        realName: cb.dataset.cloudRealname
    }));

    const confirmMessage = `确定要从云端删除以下 ${archivesToDelete.length} 个存档吗？\n此操作不可恢复！\n\n- ${archivesToDelete.map(a => a.realName).join('\n- ')}`;

    if (!(await showCustomConfirm(confirmMessage))) {
        return;
    }

    let statusDanmaku = showDanmaku('正在从云端删除...', 'status');

    const deletePromises = archivesToDelete.map(archive => 
        fetch(`${cloudStorageConfig.apiUrl}/api/delete?archiveName=${encodeURIComponent(archive.filename)}`, {
            method: 'DELETE'
        })
        .then(response => response.json().then(result => ({ ...result, realName: archive.realName })))
        .catch(error => ({ success: false, error: error.message, realName: archive.realName }))
    );

    try {
        const results = await Promise.all(deletePromises);
        const successes = results.filter(r => r.success);
        const failures = results.filter(r => !r.success);

        let reportMessage = '';
        if (successes.length > 0) {
            reportMessage += `成功删除 ${successes.length} 个存档。\n`;
        }
        if (failures.length > 0) {
            reportMessage += `删除失败 ${failures.length} 个存档：\n` + failures.map(f => ` - ${f.realName}: ${f.error}`).join('\n');
        }
        
        await showCustomAlert(reportMessage);

    } catch (error) {
        await showCustomAlert(`删除过程中发生意外错误: ${error.message}`);
    } finally {
        if (statusDanmaku) statusDanmaku.remove();
        await renderCloudArchiveList();
    }
}


async function renderArchiveSelectionView() {
    const listEl = document.getElementById('archive-list');
    listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">正在加载存档列表...</p>';

    let archives = [];
    try {
        archives = await db.archives.orderBy('name').toArray();
    } catch (error) {
        listEl.innerHTML = `<p style="text-align:center; color:#e57373;">加载本地存档列表失败: ${error.message}</p>`;
        return;
    }

    listEl.innerHTML = '';
    if (archives.length === 0) {
        listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">暂无存档</p>';
    } else {
        archives.forEach(archive => {
            const item = document.createElement('div');
            item.className = 'archive-selection-item';
            item.dataset.archiveName = archive.name;
            
            const isActive = archive.name === currentArchiveName;
            
            item.innerHTML = `
                <input type="checkbox" id="archive-checkbox-${archive.name}" data-archive-name="${archive.name}">
                <label for="archive-checkbox-${archive.name}" class="archive-name ${isActive ? 'active' : ''}">${archive.name}</label>
            `;

            if (cloudStorageConfig && cloudStorageConfig.enabled && cloudStorageConfig.apiUrl) {
                const uploadBtn = document.createElement('button');
                uploadBtn.title = '上传至云端';
                uploadBtn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i>';
                
                Object.assign(uploadBtn.style, {
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#ffd700',
                    color: '#1a1a1a',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 'auto',
                    flexShrink: '0',
                    cursor: 'pointer',
                    fontSize: '15px'
                });
                
                uploadBtn.onmouseover = () => { uploadBtn.style.filter = 'brightness(1.2)'; };
                uploadBtn.onmouseout = () => { uploadBtn.style.filter = 'brightness(1)'; };

                uploadBtn.onclick = (e) => {
                    e.stopPropagation();
                    uploadArchiveToCloud(archive.name);
                };
                item.appendChild(uploadBtn);
            }

            item.querySelector('.archive-name').addEventListener('click', (e) => {
                e.preventDefault();
                showLogViewer(archive.name);
            });
            
            listEl.appendChild(item);
        });
    }
    updateDeleteButtonState();
}

    function renderLogViewerState(state) {
        const container = document.getElementById('log-viewer-state-content');
        container.innerHTML = '';
        if (!state || !state.playerData) return;

        const playerData = state.playerData;
        
        const createSection = (title, data) => {
            const section = document.createElement('div');
            const h5 = document.createElement('h5');
            h5.textContent = title;
            section.appendChild(h5);
            
            const ul = document.createElement('ul');
            for (const key in data) {
                const li = document.createElement('li');
                li.innerHTML = `<span class="label">${key}:</span><span class="value">${data[key]}</span>`;
                ul.appendChild(li);
            }
            section.appendChild(ul);
            container.appendChild(section);
        };

        createSection('角色信息', {
            '灵根': playerData.linggen,
            '血量': `${playerData.hp.current}/${playerData.hp.max}`,
            '性别': playerData.gender,
            '年龄': playerData.age,
            '寿元': playerData.shouyuan,
            '境界': playerData.realm,
            '修炼进度': (playerData.progress ?? 0) + '%',
            '灵石': playerData.spiritStones,
            '所在地': (playerData.fullLocationString || '').substring((playerData.fullLocationString || '').indexOf('/') + 1) || '未知'
        });

        const equipToString = (arr) => (arr || []).map(item => item ? item.name : '无').filter(name => name !== '无').join(', ') || '无';
        createSection('装备栏', {
            '功法': equipToString(playerData.technique),
            '法宝': equipToString(playerData.treasure),
            '武器': equipToString(playerData.weapon),
            '护甲': equipToString(playerData.armor),
        });

        if (playerData.detailedAttributes) {
            const attrsForDisplay = {};
            for (const key in playerData.detailedAttributes) {
                const attr = playerData.detailedAttributes[key];
                attrsForDisplay[key] = `${attr.current}/${attr.max}`;
            }
            createSection('详细属性', attrsForDisplay);
        }
    }

    async function showLogViewer(archiveName) {
        currentViewingArchive = archiveName;
        document.getElementById('log-viewer-title').textContent = archiveName;
        try {
            const archive = await db.archives.get(archiveName);
            if (!archive) return;

            const logs = archive.data.logs || [];
            logList.innerHTML = '';
            if (logs.length === 0) { logList.innerHTML = '<p>此存档暂无记录</p>'; }
            else {
                logs.slice().reverse().forEach(log => {
                    const item = document.createElement('div');
                    item.className = 'log-list-item';
                    const timestamp = document.createElement('div');
                    timestamp.className = 'log-timestamp';
                    timestamp.textContent = new Date(log.timestamp).toLocaleString();
                    const content = document.createElement('div');
                    content.className = 'log-content';
                    content.innerHTML = sanitizeHTML(log.content);
                    item.appendChild(timestamp);
                    item.appendChild(content);
                    logList.appendChild(item);
                });
            }
            
            const tempState = {};
            syncStateFromTables(archive.data.state.currentState, tempState);
            renderLogViewerState(tempState);

        } catch (e) { logList.innerHTML = '<p>读取日志记录时出错。</p>'; console.error("渲染日志失败:", e); }
        toggleCenterView('log-viewer-view');
    }
	
async function uploadArchiveToCloud(archiveName) {
    if (!cloudStorageConfig.enabled || !cloudStorageConfig.apiUrl) {
        await showCustomAlert('请先在设置中启用云存档并配置服务器地址。');
        return;
    }

    const confirmUpload = await showCustomConfirm(`确定要将本地存档 "${archiveName}" 上传到云端吗？\n如果云端存在同名存档，它将被覆盖。`);
    if (!confirmUpload) {
        return;
    }

    try {
        const localArchive = await db.archives.get(archiveName);
        if (!localArchive || !localArchive.data) {
            throw new Error('在本地找不到该存档的数据。');
        }

        localArchive.data._internalName = archiveName;

        const response = await fetch(`${cloudStorageConfig.apiUrl}/api/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
		archiveName: archiveName,
                data: localArchive.data
            }),
        });

        if (!response.ok) {
            throw new Error(`服务器响应错误: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || '上传失败，未知原因。');
        }

        await showCustomAlert(`存档 "${archiveName}" 已成功上传至云端！`);

        if (document.getElementById('cloud-storage-settings-overlay').classList.contains('visible')) {
            renderCloudArchiveList();
        }

    } catch (error) {
        await showCustomAlert(`上传失败: ${error.message}`);
    }
}

async function renderArchiveList() {
    const archiveList = document.getElementById('archive-list');
    archiveList.innerHTML = '';
    const archives = await db.archives.orderBy('name').toArray();

    if (archives.length === 0) {
        archiveList.innerHTML = '<li>无本地存档</li>';
        return;
    }

    archives.forEach(archive => {
        const li = document.createElement('li');
        
        const archiveNameSpan = document.createElement('span');
        archiveNameSpan.textContent = archive.name;
        li.appendChild(archiveNameSpan);
        
        li.onclick = () => selectAndLoadArchive(archive.name);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'archive-actions';

        if (cloudStorageConfig && cloudStorageConfig.enabled && cloudStorageConfig.apiUrl) {
            const uploadBtn = document.createElement('button');
            uploadBtn.className = 'action-btn';
            uploadBtn.title = '上传至云端';
            uploadBtn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i>';
            uploadBtn.onclick = (e) => {
                e.stopPropagation();
                uploadArchiveToCloud(archive.name);
            };
            actionsDiv.appendChild(uploadBtn);
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete';
        deleteBtn.title = '删除此存档';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteArchive(archive.name);
        };

        actionsDiv.appendChild(deleteBtn);
        li.appendChild(actionsDiv);
        archiveList.appendChild(li);
    });
}

	
async function selectAndLoadArchive(archiveName) {
    let archiveData;
    let loadedFromCloud = false;
    let finalArchiveName = archiveName;

    if (cloudStorageConfig.enabled && cloudStorageConfig.apiUrl) {
        try {
            const response = await fetch(`${cloudStorageConfig.apiUrl}/api/load?archiveName=${encodeURIComponent(archiveName)}`);
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    archiveData = result.data;
                    finalArchiveName = archiveData._internalName || archiveName;
                    loadedFromCloud = true;
                }
            }
            if (!loadedFromCloud) {
                 console.log(`云端未找到存档 "${archiveName}"，将尝试从本地加载。`);
            }
        } catch (error) {
            console.warn(`连接云服务器失败，将尝试从本地加载。错误: ${error.message}`);
        }
    }

    if (!archiveData) {
        const localArchive = await db.archives.get(archiveName);
        if (!localArchive || !localArchive.data) {
            await showCustomAlert(`加载存档 "${archiveName}" 失败: 在云端和本地均未找到该存档。`);
            return;
        }
        archiveData = localArchive.data;
        finalArchiveName = archiveName;
        loadedFromCloud = false;
    }

    try {
        await db.archives.put({ name: finalArchiveName, data: archiveData });
    } catch (error) {
        await showCustomAlert(`将存档数据写入本地时失败: ${error.message}`);
        return;
    }
    
    currentArchiveName = finalArchiveName;
    await dbSet(ACTIVE_ARCHIVE_KEY, currentArchiveName);

    const state = archiveData.state || {};
    activeTheaterHTML = state.activeTheaterHTML || null;

    if (cultivationPanel.classList.contains('hidden')) {
        splashScreen.classList.add('hidden');
        cultivationPanel.classList.remove('hidden');
    }

    document.getElementById('mobile-header-title').innerHTML = `${finalArchiveName} ${loadedFromCloud ? '<i class="fas fa-cloud" title="云存档"></i>' : ''}`;

    await loadState(state);
    loadChatHistory(archiveData.logs, { data: archiveData });

    toggleCenterView('chat-view');
    toggleExtremeModeUI(currentPlayerData.isExtreme);
}



function loadChatHistory(logs, archive) {
    // 清空现有的聊天界面内容
    const existingEntries = mainContentArea.querySelectorAll('.log-entry, .summary-logs-container, .hidden-logs-container');
    existingEntries.forEach(entry => entry.remove());

    // 如果没有任何记录，则直接返回
    if (!logs || logs.length === 0) {
        updateBranchingOptions([]);
        dailyPaperContextForNextMessage = '';
        lastDailyPaperContent = '';
        return;
    }

    const { openingLog, summaryLogs, hiddenChatLogs, visibleChatLogs } = getLogsForContext(logs, archive);

    const createCollapsibleContainer = (logArray, className, summaryText) => {
        if (logArray.length === 0) return null;
        const container = document.createElement('details');
        container.className = className;
        const summary = document.createElement('summary');
        summary.className = 'collapsible-summary';
        summary.innerHTML = summaryText;
        container.appendChild(summary);
        const contentDiv = document.createElement('div');
        contentDiv.className = 'collapsible-content';
        logArray.forEach(log => {
            if (log.isGhost) return; 
            const type = log.type || (log.content.startsWith('>') ? 'user' : 'ai');
            contentDiv.appendChild(createLogEntryElement(log, type));
        });
        container.appendChild(contentDiv);
        return container;
    };

    if (openingLog && !openingLog.isGhost) {
        mainContentArea.appendChild(createLogEntryElement(openingLog, 'ai'));
    }

    const allSummaries = [...summaryLogs];
    const summaryContainer = createCollapsibleContainer(allSummaries, 'summary-logs-container', `<i class=\"fas fa-book-reader\"></i> ... ${allSummaries.length} 条总结记录已折叠 (点击展开) ...`);
    if (summaryContainer) mainContentArea.appendChild(summaryContainer);

    const hiddenContainer = createCollapsibleContainer(hiddenChatLogs, 'hidden-logs-container', `<i class=\"fas fa-history\"></i> ... ${hiddenChatLogs.length} 条过往记录已折叠 (点击展开) ...`);
    if (hiddenContainer) mainContentArea.appendChild(hiddenContainer);

    visibleChatLogs.forEach(log => {
        if (log.isGhost) return;
        const type = log.type || (log.content.startsWith('>') ? 'user' : 'ai');
        mainContentArea.appendChild(createLogEntryElement(log, type));
    });

    const lastLog = logs.length > 0 ? logs[logs.length - 1] : null;
    let finalBranchOptions = [];

    if (lastLog && lastLog.branchContent) {
        const branchMatch = lastLog.branchContent.match(/<branches>([\s\S]*?)<\/branches>/);
        if (branchMatch && branchMatch[1]) {
            const optionRegex = /\[([^\]]+)\]/g;
            let match;
            while ((match = optionRegex.exec(branchMatch[1])) !== null) {
                finalBranchOptions.push(match[1]);
            }
        }
    }
    
    updateBranchingOptions(finalBranchOptions);

    enforceRenderLimit();

let latestDailyPaper = null;
for (let i = logs.length - 1; i >= 0; i--) {
if (logs[i].type === 'ai' && logs[i].dailyPaperHtml) {
latestDailyPaper = logs[i].dailyPaperHtml;
break;
}
}

if (latestDailyPaper) {
lastDailyPaperContent = latestDailyPaper;
dailyPaperContextForNextMessage = extractMainContent(latestDailyPaper);
} else {

lastDailyPaperContent = '';
dailyPaperContextForNextMessage = '';
}

    const lastElement = mainContentArea.lastElementChild;
    if (lastElement) {
        
        lastElement.scrollIntoView({ behavior: 'auto', block: 'end' });
    }
}


function lockViewOnUserMessage(targetElementId = null) {
    const mainArea = document.getElementById('main-content-area');
    if (!mainArea) return;

    if (targetElementId) {
        setTimeout(() => {
            const targetElement = document.getElementById(targetElementId);
            if (targetElement) {
                const targetOffsetTop = targetElement.offsetTop;
                mainArea.scrollTo({
                    top: targetOffsetTop - 15,
                    behavior: 'smooth'
                });
            }
        }, 50);
        return;
    }
    
    if (mainArea.scrollHeight - mainArea.scrollTop - mainArea.clientHeight < 200) {
        mainArea.scrollTop = mainArea.scrollHeight;
    }
}

    function toggleCenterView(viewName) {
        chatView.classList.add('hidden');
        archiveSelectionView.classList.add('hidden');
        logViewerVIew.classList.add('hidden');
        document.getElementById(viewName).classList.remove('hidden');
    }
    
    function parseItemEffect(effectString) {
        const effects = {};
        if (!effectString || effectString === '无') return effects;
        
        const parts = effectString.split(/[,，]/);
        parts.forEach(part => {
            const affixMatch = part.match(/(.*?):\s*(.*?)\s*([+-]\d+%?)/);
            if (affixMatch) {
                const attr = affixMatch[2].trim();
                const valueStr = affixMatch[3];
                const isPercent = valueStr.includes('%');
                const value = parseFloat(valueStr.replace('%', ''));
                if (!isNaN(value)) {
                    if (!effects[attr]) effects[attr] = 0;
                    effects[attr] += value; // Assuming direct addition for simplicity. Percentage logic would be more complex.
                }
            } else {
                const simpleMatch = part.trim().match(/(.+?)([+-])(\d+)/);
                if (simpleMatch) {
                    const attr = simpleMatch[1].trim();
                    const sign = simpleMatch[2];
                    const value = parseInt(simpleMatch[3]);
                    if (!effects[attr]) effects[attr] = 0;
                    effects[attr] += (sign === '+') ? value : -value;
                }
            }
        });
        return effects;
    }

function renderPlayerAttributes() {
    attributesList.innerHTML = '';

    if (!playerDisplaySettings || (!playerDisplaySettings.defaultFields && !playerDisplaySettings.customFields)) {
        attributesList.innerHTML = '<li><span class="attr-label">请点击右侧齿轮配置</span></li>';
        return;
    }

    const playerRow = currentState['0'] ? currentState['0']['B1'] : null;
    if (!playerRow) {
        attributesList.innerHTML = '<li><span class="attr-label">玩家数据加载中...</span></li>';
        return;
    }

    const remarks = parseRemarksString(playerRow['9']);
    const fragment = document.createDocumentFragment();

    const createListItem = (label, value) => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="attr-label">${label}:</span><span class="attr-value">${value ?? '无'}</span>`;
        fragment.appendChild(li);
    };

    if (playerDisplaySettings.defaultFields) {
        playerDisplaySettings.defaultFields.forEach(field => {
            if (field.isEnabled) {
                let value;
                switch (field.key) {
                    case 'linggen': value = remarks['灵根']; break;
                    case 'hp': value = remarks['hp']; break;
                    case 'gender': value = (playerRow['1'] || '|').split('|')[1]; break;
                    case 'age': value = remarks['年龄']; break;
                    case 'shouyuan': value = remarks['寿元']; break;
                    case 'realm': value = (playerRow['2'] || '|').split('|')[0]; break;
                    case 'shanE': value = remarks['善恶值']; break;
                    case 'location':
                        const fullLocation = (currentState['4'] && currentState['4'][0]) ? (currentState['4'][0]['0'] || '') : '';
                        value = fullLocation.substring(fullLocation.indexOf('/') + 1) || '未知';
                        break;
                }
                createListItem(field.label, value);
            }
        });
    }

    if (playerDisplaySettings.customFields) {
        playerDisplaySettings.customFields.forEach(field => {
            if (field.isEnabled && typeof field.column === 'number') {
                let value = playerRow[String(field.column)];
                if (field.column === 9)
                {
                    value = remarks[field.variableName] || '未定义';
                }
                 else {
                     value = playerRow[String(field.column)];
                 }
                createListItem(field.label, value);
            }
        });
    }

    if (fragment.children.length === 0) {
        attributesList.innerHTML = '<li><span class="attr-label">无显示项,请配置</span></li>';
    } else {
        attributesList.appendChild(fragment);
    }
}


function renderInventory(items) {
    inventoryGrid.innerHTML = '';
    const fragment = document.createDocumentFragment(); // 创建 DocumentFragment
    const equipmentSlots = ['weapon', 'armor', 'technique', 'treasure'];
    const equippedItemNames = new Set(
        equipmentSlots.flatMap(slotKey => 
            (currentPlayerData[slotKey] || []).filter(item => item).map(item => item.name)
        )
    );
    const itemsToShow = items.filter(item => !equippedItemNames.has(item.name));
    if (itemsToShow.length === 0) {
        inventoryGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; opacity: 0.7;">储物袋空空如也...</p>';
        return;
    }
    itemsToShow.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'inventory-slot';
        slot.dataset.itemId = item.id;
        slot.title = `${item.name}\n类型: ${item.type}`;
        
        const iconClass = itemIconMap[item.type] || itemIconMap['默认'];
        slot.innerHTML = `
            <i class="fas ${iconClass} inventory-slot-icon"></i>
            <span class="inventory-slot-name">${item.name}</span>
            <span class="inventory-slot-quantity">${item.quantity}</span>`;
        
        fragment.appendChild(slot); // 先添加到"碎片"中
    });
    inventoryGrid.appendChild(fragment); // 最后一次性添加到DOM中
}
async function loadState(state) {
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

WORLD_MAP_DATA = deepCopy(state.worldMap || DEFAULT_WORLD_MAP_DATA);

currentState = state.currentState;
bondedCharacters = state.bondedCharacters || {};

syncStateFromTables();

renderInventory(inventoryItems);
renderPlayerAttributes(currentPlayerData);
await updateAvatar(currentPlayerData);


await manageImageTaggingApiSettings();
await loadChatBackgroundSettings();
await manageThinkingApiSettings();
await manageKnowledgeSearchApiSettings();


dailyPaperContextForNextMessage = '';
lastDailyPaperContent = '';
}


async function saveCurrentState() {
    if (!currentArchiveName) return;

    // 先执行所有本地序列化和保存逻辑
    const archive = await db.archives.get(currentArchiveName) || { name: currentArchiveName, data: {} };
    if (!archive.data.state) {
        archive.data.state = {};
    }

    const playerRow = currentState['0'] ? currentState['0']['B1'] : null;
    if (playerRow) {
        playerRow['9'] = serializeCharacterRemarks(currentPlayerData);
    }
    
    Object.values(characterDatabase).forEach(char => {
        if (char.id !== 'B1' && currentState['0'] && currentState['0'][char.id]) {
            currentState['0'][char.id]['9'] = serializeCharacterRemarks(char);
        }
    });
    
    archive.data.state.currentState = currentState;
    archive.data.state.bondedCharacters = bondedCharacters;
    archive.data.state.worldMap = WORLD_MAP_DATA;
    if (!archive.data.state.achievements) archive.data.state.achievements = { completed: [], custom: [] };
    if (!archive.data.state.npcAvatars) archive.data.state.npcAvatars = {};

    await db.archives.put(archive);

    // 如果启用了云存档，则异步推送到云端
    if (cloudStorageConfig.enabled && cloudStorageConfig.apiUrl) {
        try {
            await fetch(`${cloudStorageConfig.apiUrl}/api/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    archiveName: currentArchiveName,
                    data: archive.data
                })
            });
            // 这里可以添加一个短暂的成功提示，但不要打断用户操作
            console.log(`存档 "${currentArchiveName}" 已成功同步到云端。`);
        } catch (error) {
            // 静默失败，只在控制台打印错误，不打扰用户
            console.error(`云同步存档 "${currentArchiveName}" 失败:`, error);
        }
    }
}

    function getInitialTableState() {
        return {
            '0': {}, // Characters
            '1': {}, // Inventory
            '2': {}, // Summaries (not used by ID yet)
            '3': {}, // User Prefs (not used by ID yet)
            '4': [{ "id": TIME_LOCATION_ROW_ID, "0": "" }], // Tail Content
            '5': [], // World Events (array is fine)
            '6': {}, // Tasks
            '7': {}, // Spirit Beasts
            '8': {}, // Skills
            '9': {}  // Equipment
        };
    }
    
    async function requestPersistentStorage() {
        if (navigator.storage && navigator.storage.persist) {
            if (window.isSecureContext) {
                const isPersisted = await navigator.storage.persisted();
                if (!isPersisted) {
                    const result = await navigator.storage.persist();
                    console.log(`持久化存储请求结果: ${result ? '成功' : '失败'}`);
                } else {
                    console.log("存储已经是持久化的。");
                }
            } else {
                console.warn("非安全上下文，无法请求持久化存储。将使用'尽力而为'模式。");
            }
        } else {
            console.warn("浏览器不支持持久化存储API。");
        }
    }
async function renderThinkingWorldBooks() {
    const listEl = document.getElementById('thinking-worldbook-list');
    if (!listEl) return;

    const presetsData = await dbGet(THINKING_PRESETS_KEY);
    if (!presetsData || !presetsData.presets) {
        listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">无法加载预设数据。</p>';
        return;
    }

    const activePreset = presetsData.presets.find(p => p.id === presetsData.activePresetId);
    if (!activePreset || !activePreset.worldBooks) {
        listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">无激活的预设或世界书数据。</p>';
        return;
    }
    const worldBooks = activePreset.worldBooks;

    listEl.innerHTML = '';
    if (worldBooks.length === 0) {
        listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">暂无参考世界书</p>';
        return;
    }

    worldBooks.forEach((wb, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'regex-rule-item';
        itemEl.style.opacity = wb.enabled === false ? '0.5' : '1';
        
        const isDefault = wb.id === 'default-variable-thinking';
        const triggerMode = wb.triggerMode || 'blue';
        const iconColor = triggerMode === 'blue' ? '#4fc3f7' : '#66bb6a';

        itemEl.innerHTML = `
            <div class="thinking-wb-toggle-container">
                <label class="switch">
                    <input type="checkbox" class="thinking-wb-toggle" data-id="${wb.id}" ${wb.enabled !== false ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
            <i class="fas fa-lightbulb" style="color: ${iconColor}; margin-right: 8px;" title="触发模式: ${triggerMode === 'blue' ? '时刻触发' : '关键词触发'}"></i>
            <span class="rule-name" title="${wb.name}" style="flex-grow: 1; ${isDefault ? 'font-style: italic;' : ''}">${wb.name}</span>
            <div class="rule-actions">
                <button class="thinking-wb-move-up-btn" data-index="${index}" title="上移" ${ index === 0 ? 'disabled' : ''} style="border: 1px solid #8c7853; color:#ffd700; width:28px; height:28px; border-radius:50%; background:none; cursor:pointer;"><i class="fas fa-arrow-up"></i></button>
                <button class="thinking-wb-move-down-btn" data-index="${index}" title="下移" ${ index === worldBooks.length - 1 ? 'disabled' : ''} style="border: 1px solid #8c7853; color:#ffd700; width:28px; height:28px; border-radius:50%; background:none; cursor:pointer;"><i class="fas fa-arrow-down"></i></button>
                <button class="thinking-wb-edit-btn" data-id="${wb.id}" title="编辑" style="border: 1px solid #8c7853; color:#ffd700; width:28px; height:28px; border-radius:50%; background:none; cursor:pointer;"><i class="fas fa-edit"></i></button>
                ${isDefault ? `<button title="内置规则无法删除" disabled style="border: 1px solid #555; color: #777; width:28px; height:28px; border-radius:50%; background:none; cursor:not-allowed;"><i class="fas fa-lock"></i></button>` : `<button class="thinking-wb-delete-btn" data-id="${wb.id}" title="删除" style="border-color: #e57373; color: #e57373; width:28px; height:28px; border-radius:50%; background:none; cursor:pointer;"><i class="fas fa-trash"></i></button>`}
            </div>
        `;
        listEl.appendChild(itemEl);
    });
}

async function setupThinkingWorldBookListeners() {
    const listEl = document.getElementById('thinking-worldbook-list');
    if (!listEl) return;

    listEl.addEventListener('click', async (event) => {
        const target = event.target;
        
        const presetsData = await dbGet(THINKING_PRESETS_KEY);
        if (!presetsData || !presetsData.presets) return;
        const activePreset = presetsData.presets.find(p => p.id === presetsData.activePresetId);
        if (!activePreset || !activePreset.worldBooks) return;

        if (target.classList.contains('thinking-wb-toggle')) {
            const bookId = target.dataset.id;
            const bookToToggle = activePreset.worldBooks.find(wb => wb.id === bookId);
            if (bookToToggle) {
                bookToToggle.enabled = target.checked;
                await dbSet(THINKING_PRESETS_KEY, presetsData);
                await renderThinkingWorldBooks();
            }
            return;
        }

        const button = target.closest('button');
        if (!button) return;
        
        const bookId = button.dataset.id;
        const index = parseInt(button.dataset.index, 10);

        if (button.classList.contains('thinking-wb-edit-btn')) {
            openThinkingWorldBookEditor(bookId);
        } else if (button.classList.contains('thinking-wb-delete-btn')) {
            if (bookId === 'default-variable-thinking') return;
            const bookToDelete = activePreset.worldBooks.find(wb => wb.id === bookId);
            if (bookToDelete && await showCustomConfirm(`确定要删除世界书 "${bookToDelete.name}" 吗？`)) {
                activePreset.worldBooks = activePreset.worldBooks.filter(wb => wb.id !== bookId);
                await dbSet(THINKING_PRESETS_KEY, presetsData);
                await renderThinkingWorldBooks();
            }
        } else if (button.classList.contains('thinking-wb-move-up-btn')) {
            if (!isNaN(index) && index > 0) {
                [activePreset.worldBooks[index], activePreset.worldBooks[index - 1]] = [activePreset.worldBooks[index - 1], activePreset.worldBooks[index]];
                await dbSet(THINKING_PRESETS_KEY, presetsData);
                await renderThinkingWorldBooks();
            }
        } else if (button.classList.contains('thinking-wb-move-down-btn')) {
            if (!isNaN(index) && index < activePreset.worldBooks.length - 1) {
                 [activePreset.worldBooks[index], activePreset.worldBooks[index + 1]] = [activePreset.worldBooks[index + 1], activePreset.worldBooks[index]];
                await dbSet(THINKING_PRESETS_KEY, presetsData);
                await renderThinkingWorldBooks();
            }
        }
    });

    document.getElementById('add-thinking-worldbook-btn').addEventListener('click', () => {
        openThinkingWorldBookEditor();
    });

    const importBtn = document.getElementById('import-thinking-worldbook-btn');
    const importInput = document.getElementById('thinking-worldbook-input');
    importBtn.addEventListener('click', () => importInput.click());

importInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        const textContent = event.target.result;
        
        try {
            const presetsData = await dbGet(THINKING_PRESETS_KEY);
            const activePreset = presetsData.presets.find(p => p.id === presetsData.activePresetId);
            if (!activePreset) {
                await showCustomAlert('错误：找不到当前激活的预设来保存世界书。');
                return;
            }
            if (!activePreset.worldBooks) activePreset.worldBooks = [];
            const existingNames = new Set(activePreset.worldBooks.map(wb => wb.name));
            let entriesToProcess = [];
            let unnamedCounter = 1;

            try {
                const importedData = JSON.parse(textContent);

                if (Array.isArray(importedData)) {
                    entriesToProcess = importedData;
                } else if (importedData && typeof importedData.entries === 'object' && !Array.isArray(importedData.entries)) {
                    entriesToProcess = Object.values(importedData.entries).map(entry => {
                        const name = entry.comment || entry.name;
                        const keywords = entry.key || entry.keys || entry.keywords || [];
                        return {
                            name: name || `导入条目 ${unnamedCounter++}`,
                            content: entry.content,
                            keywords: keywords,
                            triggerMode: (keywords.length > 0) ? 'green' : 'blue'
                        };
                    });
                } else if (importedData && importedData.name && importedData.content) {
                    entriesToProcess = [importedData];
                } else {
                    const fallbackName = file.name.replace(/\.[^/.]+$/, "");
                    entriesToProcess.push({
                        name: existingNames.has(fallbackName) ? `${fallbackName} ${Date.now()}`: fallbackName,
                        content: textContent,
                        triggerMode: 'green',
                        keywords: [fallbackName]
                    });
                }
            } catch (jsonError) {
                const fallbackName = file.name.replace(/\.[^/.]+$/, "");
                entriesToProcess.push({
                    name: existingNames.has(fallbackName) ? `${fallbackName} ${Date.now()}`: fallbackName,
                    content: textContent,
                    triggerMode: 'green',
                    keywords: [fallbackName]
                });
            }

            let addedCount = 0;
            for (const entry of entriesToProcess) {
                if (entry && entry.name && entry.content && !existingNames.has(entry.name)) {
                    activePreset.worldBooks.push({
                        id: crypto.randomUUID(),
                        name: entry.name,
                        content: entry.content,
                        enabled: true,
                        triggerMode: entry.triggerMode || 'blue',
                        keywords: entry.keywords || []
                    });
                    existingNames.add(entry.name);
                    addedCount++;
                }
            }

            if (addedCount > 0) {
                await dbSet(THINKING_PRESETS_KEY, presetsData);
                await renderThinkingWorldBooks();
                showDanmaku(`成功导入 ${addedCount} 个新世界书条目！`, 'success');
            } else {
                showDanmaku('没有新的内容被导入（可能已存在同名条目）。', 'info');
            }

        } catch (err) {
            await showCustomAlert(`导入失败，操作出现意外错误。\n错误: ${err.message}`);
        } finally {
            e.target.value = '';
        }
    };
    reader.readAsText(file);
};


    thinkingListenersSetup = true;
}

async function openThinkingWorldBookEditor(id = null) {
    currentEditingContext.type = 'thinking';
    currentEditingContext.id = id;
    
    const modal = document.getElementById('world-book-editor-overlay');
    const title = document.getElementById('world-book-editor-title');
    const nameInput = document.getElementById('world-book-entry-name');
    const contentTextarea = document.getElementById('world-book-entry-content');
    const keywordsContainer = document.getElementById('world-book-keywords-container');
    const keywordsTextarea = document.getElementById('world-book-trigger-keywords');

    const presetsData = await dbGet(THINKING_PRESETS_KEY);
    if (!presetsData || !presetsData.presets) {
        showCustomAlert('错误：无法加载预设数据。');
        return;
    }
    const activePreset = presetsData.presets.find(p => p.id === presetsData.activePresetId);
    if (!activePreset || !activePreset.worldBooks) {
        showCustomAlert('错误：找不到当前激活的预设或其世界书数据。');
        return;
    }

    const entryToEdit = id ? activePreset.worldBooks.find(e => e.id === id) : null;

    if (id && !entryToEdit) {
        showCustomAlert('错误：找不到要编辑的条目。');
        return;
    }

    if (entryToEdit) {
        title.textContent = `编辑思考规则: ${entryToEdit.name}`;
        nameInput.value = entryToEdit.name;
        nameInput.disabled = entryToEdit.id === 'default-variable-thinking';
        contentTextarea.value = entryToEdit.content;

        const triggerMode = entryToEdit.triggerMode || 'blue';
        document.querySelector(`input[name="worldbook-editor-trigger"][value="${triggerMode}"]`).checked = true;
        
        const isGreen = triggerMode === 'green';
        keywordsTextarea.value = isGreen ? (entryToEdit.keywords || []).join(', ') : '';
        keywordsContainer.classList.toggle('hidden', !isGreen);
    } else {
        title.textContent = "创建新思考规则";
        nameInput.value = '';
        nameInput.disabled = false;
        contentTextarea.value = '';
        document.querySelector('input[name="worldbook-editor-trigger"][value="blue"]').checked = true;
        keywordsTextarea.value = '';
        keywordsContainer.classList.add('hidden');
    }
    
    modal.classList.add('visible');
}

async function manageCloudStorageSettings() {
    const savedConfig = await dbGet(CLOUD_STORAGE_CONFIG_KEY);
    cloudStorageConfig = { ...cloudStorageConfig, ...savedConfig };

    document.getElementById('cloud-storage-enabled-toggle').checked = cloudStorageConfig.enabled;
    document.getElementById('cloud-storage-api-url').value = cloudStorageConfig.apiUrl || '';

    const overlay = document.getElementById('cloud-storage-settings-overlay');
    const saveBtn = document.getElementById('save-cloud-settings-btn');
    const closeBtn = overlay.querySelector('.modal-close-btn');

    if (!saveBtn.dataset.listenerAttached) {
        saveBtn.addEventListener('click', saveCloudStorageSettings);
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('visible');
        });

        document.getElementById('upload-all-settings-btn').addEventListener('click', uploadAllSettings);
        document.getElementById('download-all-settings-btn').addEventListener('click', downloadAllSettings);
        
        document.getElementById('refresh-cloud-archives').addEventListener('click', renderCloudArchiveList);
        document.getElementById('delete-cloud-archives').addEventListener('click', deleteSelectedCloudArchives);

        saveBtn.dataset.listenerAttached = 'true';
    }

    renderCloudArchiveList();
}

async function saveCloudStorageSettings() {
    const isEnabled = document.getElementById('cloud-storage-enabled-toggle').checked;
    const apiUrl = document.getElementById('cloud-storage-api-url').value.trim();

    cloudStorageConfig = {
        enabled: isEnabled,
        apiUrl: apiUrl
    };

    try {
        await dbSet(CLOUD_STORAGE_CONFIG_KEY, cloudStorageConfig);
        await showCustomAlert('云存档设置已保存！');
        document.getElementById('cloud-storage-settings-overlay').classList.remove('visible');
    } catch (error) {
        console.error('保存云存档设置失败:', error);
        await showCustomAlert(`保存失败: ${error.message}`);
    }
}


async function initPanel() {
await loadNpcDisplaySettings();
await loadPlayerDisplaySettings();
setRandomSplashVideo();
useTavernStorage = false;
console.log("存档模式已固定为浏览器本地数据库（IndexedDB）。");

await requestPersistentStorage();
await loadRegexConfig();
await loadSummaryConfig();
await manageThinkingApiSettings();
await manageKnowledgeSearchApiSettings();
await loadFunSettings();
await loadChatBackgroundSettings();
await loadAttributeAlignmentConfig();
await loadFabShortcutConfig();
await loadSeenFeatures();
await manageImageTaggingApiSettings();
await loadTextImageJsonFiles();
await loadBackgroundJsonFiles();
setupBackgroundJsonListeners();
await manageCloudStorageSettings();
updateRedDots();


await loadDefaultMapSetting();

const startBtn = document.getElementById('start-new-life-btn');
const loadBtn = document.getElementById('load-life-btn');
startBtn.textContent = "开始新人生";
loadBtn.style.display = 'inline-block';
startBtn.onclick = () => {
splashScreen.classList.add('hidden');
creationScreen.classList.remove('hidden');
startCharacterCreation();
};
const activeArchive = await dbGet(ACTIVE_ARCHIVE_KEY);
const archivesCount = await db.archives.count();
if (activeArchive) {
loadBtn.disabled = false;
loadBtn.textContent = '继续人生';
} else if (archivesCount > 0) {
loadBtn.disabled = false;
loadBtn.textContent = '读取人生';
} else {
loadBtn.disabled = true;
loadBtn.textContent = '读取人生 (无)';
}
loadBtn.onclick = async () => {
if (activeArchive) {
splashScreen.classList.add('hidden');
cultivationPanel.classList.remove('hidden');
await selectAndLoadArchive(activeArchive);
} else if (archivesCount > 0) {
splashScreen.classList.add('hidden');
cultivationPanel.classList.remove('hidden');
toggleCenterView('archive-selection-view');
await renderArchiveSelectionView();
}
};

splashScreen.classList.remove('hidden');
cultivationPanel.classList.add('hidden');
}

    function showItemDetail(item, context = {}) {
        const { isEquipped = false, slotType = null, slotIndex = 0, isNpcItem = false } = context;

        document.getElementById('item-detail-icon').className = `fas ${itemIconMap[item.type] || itemIconMap['默认']}`;
        document.getElementById('item-detail-name').textContent = item.name;
        document.getElementById('item-detail-type').textContent = item.type;
        document.getElementById('item-detail-desc').textContent = item.description;
        
        const effectEl = document.getElementById('item-detail-effect');
        const effectParts = (item.effect || '').split(/[,，]/);
        
        effectEl.innerHTML = effectParts.map(part => {
            if (part.trim()) {
                return `<div>${sanitizeHTML(part.trim())}</div>`;
            }
            return '';
        }).join('');
        
        const useBtn = document.getElementById('item-detail-use-btn');
        const replaceBtn = document.getElementById('item-detail-replace-btn');
        const unequipBtn = document.getElementById('item-detail-unequip-btn');
        
        useBtn.style.display = 'none';
        replaceBtn.style.display = 'none';
        unequipBtn.style.display = 'none';

        if (isNpcItem) {
            // No actions for NPC items
        } else if (item.type === '消耗品') {
            useBtn.style.display = 'block';
            useBtn.onclick = () => addAction('use', item);
        } else if (isEquipped) {
            replaceBtn.style.display = 'block';
            unequipBtn.style.display = 'block';
            replaceBtn.onclick = () => {
                closeItemDetail();
                openEquipmentPicker(slotType, slotIndex);
            };
            unequipBtn.onclick = () => {
                const slotKey = { '武器': 'weapon', '护甲': 'armor', '功法': 'technique', '法宝': 'treasure' }[slotType];
                unequipItem(slotKey, slotIndex);
                closeItemDetail();
            };
        }
        
        if (isNpcItem) {
            itemDetailOverlay.style.zIndex = 1900;
        } else {
            itemDetailOverlay.style.zIndex = 1800;
        }
        itemDetailOverlay.classList.add('visible');
    }

    function closeItemDetail() {
        itemDetailOverlay.classList.remove('visible');
    }
    
    function positionMenu(menuElement, e) {
        const menuRect = menuElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let left = e.clientX;
        let top = e.clientY;

        if (left + menuRect.width > viewportWidth) {
            left = viewportWidth - menuRect.width - 5;
        }
        if (top + menuRect.height > viewportHeight) {
            top = viewportHeight - menuRect.height - 5;
        }
        
        menuElement.style.top = `${top}px`;
        menuElement.style.left = `${left}px`;
    }

    function hideContextMenu() {
        messageContextMenu.classList.add('hidden');
        activeLogEntry = null;
    }

    function handleLongPress(e) {
        const target = e.target.closest('.log-entry');
        if (!target || target.classList.contains('system') || target.classList.contains('error')) return;
        
        e.preventDefault();
        activeLogEntry = target;
        
        const isUserOrAi = activeLogEntry.classList.contains('user') || activeLogEntry.classList.contains('ai');
        document.getElementById('ctx-edit-btn').disabled = !isUserOrAi;
        document.getElementById('ctx-delete-btn').disabled = !isUserOrAi;
        
        messageContextMenu.classList.remove('hidden');
        positionMenu(messageContextMenu, e);
    }
    
    async function openCacheManager() {
        const archivesData = await db.archives.toArray();
        const archivesDataSize = archivesData.reduce((acc, archive) => acc + new Blob([JSON.stringify(archive)]).size, 0);
        document.getElementById('archives-data-size').textContent = `${(archivesDataSize / 1024).toFixed(2)} KB`;

        const summarySettings = await dbGet(SUMMARY_CONFIG_KEY);
        const summarySettingsSize = summarySettings ? new Blob([JSON.stringify(summarySettings)]).size : 0;
        document.getElementById('summary-settings-size').textContent = `${(summarySettingsSize / 1024).toFixed(2)} KB`;

        const regexSettings = await dbGet(REGEX_CONFIG_KEY);
        const regexSettingsSize = regexSettings ? new Blob([JSON.stringify(regexSettings)]).size : 0;
        document.getElementById('regex-settings-size').textContent = `${(regexSettingsSize / 1024).toFixed(2)} KB`;
        
        const traits = await dbGet(CUSTOM_TRAITS_KEY);
        const traitsSize = traits ? new Blob([JSON.stringify(traits)]).size : 0;
        document.getElementById('traits-size').textContent = `${(traitsSize / 1024).toFixed(2)} KB`;
        
        const bondedChars = await dbGet(CUSTOM_BONDED_CHARS_KEY);
        const bondedCharsSize = bondedChars ? new Blob([JSON.stringify(bondedChars)]).size : 0;
        document.getElementById('bonded-chars-size').textContent = `${(bondedCharsSize / 1024).toFixed(2)} KB`;
        
        const customBirths = await dbGet(CUSTOM_BIRTHS_KEY);
        const customBirthsSize = customBirths ? new Blob([JSON.stringify(customBirths)]).size : 0;
        document.getElementById('custom-births-size').textContent = `${(customBirthsSize / 1024).toFixed(2)} KB`;
        
        const customRaces = await dbGet(CUSTOM_RACES_KEY);
        const customRacesSize = customRaces ? new Blob([JSON.stringify(customRaces)]).size : 0;
        document.getElementById('custom-races-size').textContent = `${(customRacesSize / 1024).toFixed(2)} KB`;

        cacheManagerOverlay.classList.add('visible');
    }

    function showCustomDialog(options) {
        return new Promise((resolve) => {
            const { title, message, inputType = 'none', defaultValue = '', buttons } = options;
            
            document.getElementById('custom-dialog-title').textContent = title;
            document.getElementById('custom-dialog-message').innerHTML = message;
            const inputEl = document.getElementById('custom-dialog-input');
            const buttonsEl = document.getElementById('custom-dialog-buttons');
            buttonsEl.innerHTML = '';

            if (inputType === 'text') {
                inputEl.type = 'text';
                inputEl.value = defaultValue;
                inputEl.classList.remove('hidden');
            } else {
                inputEl.classList.add('hidden');
            }

            buttons.forEach(btnConfig => {
                const button = document.createElement('button');
                button.textContent = btnConfig.text;
                button.className = 'major-action-button';
                if (btnConfig.style === 'danger') {
                    button.style.borderColor = '#e57373';
                    button.style.color = '#e57373';
                }
                button.onclick = () => {
                    customDialogOverlay.classList.remove('visible');
                    const value = inputType === 'text' ? inputEl.value : null;
                    resolve(btnConfig.value(value));
                };
                buttonsEl.appendChild(button);
            });

            customDialogOverlay.classList.add('visible');
            if(inputType === 'text') inputEl.focus();
        });
    }

    function showCustomAlert(message, title = '提示') {
        return showCustomDialog({
            title,
            message,
            buttons: [{ text: '确定', value: () => true }]
        });
    }

    function showCustomConfirm(message, title = '请确认') {
        return showCustomDialog({
            title,
            message,
            buttons: [
                { text: '取消', value: () => false },
                { text: '确定', value: () => true, style: 'danger' }
            ]
        });
    }

    function showCustomPrompt(message, defaultValue = '', title = '请输入') {
            return showCustomDialog({
            title,
            message,
            inputType: 'text',
            defaultValue,
            buttons: [
                { text: '取消', value: () => null },
                { text: '确定', value: (val) => val }
            ]
        });
    }
    
    function openEnhancementManager() {
        enhancementManagerState = {
            mainItem: null,
            sacrificeItem: null,
            pickerCallback: null
        };
        updateEnhancementManagerUI();
        enhancementManagerOverlay.classList.add('visible');
    }

    function updateEnhancementManagerUI() {
        const mainSlot = document.getElementById('enhancement-manager-item-slot');
        const sacrificeSlot = document.getElementById('enhancement-manager-sacrifice-slot');
        const affixList = document.getElementById('enhancement-manager-affix-list');
        
        const renderSlot = (slot, item) => {
            if (item) {
                slot.innerHTML = `<i class="fas ${itemIconMap[item.type] || 'fa-question-circle'} fa-2x"></i>`;
                slot.classList.add('filled');
            } else {
                slot.innerHTML = `<span>${slot.id === 'enhancement-manager-item-slot' ? '选择要管理的装备' : '选择祭品'}</span>`;
                slot.classList.remove('filled');
            }
        };

        renderSlot(mainSlot, enhancementManagerState.mainItem);
        renderSlot(sacrificeSlot, enhancementManagerState.sacrificeItem);
        
        affixList.innerHTML = '';
        if (enhancementManagerState.mainItem) {
            const affixes = (enhancementManagerState.mainItem.effect || '').split(',').map(s => s.trim()).filter(Boolean);
            affixes.forEach((affix, index) => {
                const item = document.createElement('div');
                item.className = 'affix-item';
                item.innerHTML = `
                    <span class="affix-text">${affix}</span>
                    <button class="major-action-button remove-affix-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
                `;
                item.querySelector('.remove-affix-btn').addEventListener('click', () => removeAffix(index));
                affixList.appendChild(item);
            });
        }
    }
    
    function openEnhancementManagerPicker(type) {
        const currentSelectedIds = new Set();
        if (enhancementManagerState.mainItem) currentSelectedIds.add(enhancementManagerState.mainItem.id);
        if (enhancementManagerState.sacrificeItem) currentSelectedIds.add(enhancementManagerState.sacrificeItem.id);

        pickerTitle.textContent = type === 'main' ? '选择要管理的装备' : '选择祭品';
        const itemsToShow = inventoryItems.filter(i => 
            ['武器', '护甲', '法宝'].includes(i.type) && !currentSelectedIds.has(i.id)
        );

        enhancementManagerState.pickerCallback = (item) => {
            enhancementManagerState[type === 'main' ? 'mainItem' : 'sacrificeItem'] = item;
            if (type === 'main') {
                enhancementManagerState.sacrificeItem = null;
            }
            updateEnhancementManagerUI();
        };

        pickerGrid.innerHTML = '';
        itemsToShow.forEach(item => {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            slot.innerHTML = `<i class="fas ${itemIconMap[item.type]} inventory-slot-icon"></i><span class="inventory-slot-name">${item.name}</span>`;
            slot.addEventListener('click', () => {
                enhancementManagerState.pickerCallback(item);
                closeEquipmentPicker();
            });
            pickerGrid.appendChild(slot);
        });
        pickerOverlay.classList.add('visible');
    }

    async function removeAffix(index) {
        const { mainItem } = enhancementManagerState;
        if (!mainItem) return;

        const itemInDb = currentState['1'][mainItem.id];
        let affixes = (itemInDb['4'] || '').split(',').map(s => s.trim()).filter(Boolean);
        affixes.splice(index, 1);
        itemInDb['4'] = affixes.join(', ');
        
        await saveCurrentState();
        syncStateFromTables();
        
        enhancementManagerState.mainItem = inventoryItems.find(i => i.id === mainItem.id);
        updateEnhancementManagerUI();
    }

    async function openCustomAffixEditor() {
        await renderCustomAffixList();
        customAffixEditorOverlay.classList.add('visible');
    }

    async function renderCustomAffixList() {
        const listEl = document.getElementById('custom-affix-list');
        listEl.innerHTML = '';
        const affixes = await dbGet(CUSTOM_AFFIXES_KEY) || [];
        
        if (affixes.length === 0) {
            listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">尚未创建任何自定义词条。</p>';
        } else {
            affixes.forEach((affix, index) => {
                const item = document.createElement('div');
                item.className = 'custom-affix-item';
                item.innerHTML = `
                    <span>${affix.name}</span>
                    <button class="major-action-button" data-index="${index}"><i class="fas fa-trash"></i></button>
                `;
                item.querySelector('button').addEventListener('click', async () => {
                    if (await showCustomConfirm(`确定删除词条 "${affix.name}" 吗？`)) {
                        affixes.splice(index, 1);
                        await dbSet(CUSTOM_AFFIXES_KEY, affixes);
                        await renderCustomAffixList();
                    }
                });
                listEl.appendChild(item);
            });
        }
    }

    async function addCustomAffixRow() {
        const name = await showCustomPrompt('请输入新词条的名称 (例如: 暴击率)');
        if (!name) return;

        const affixes = await dbGet(CUSTOM_AFFIXES_KEY) || [];
        if (affixes.some(a => a.name === name)) {
            await showCustomAlert('该词条已存在！');
            return;
        }

        const newAffix = {
            name: name,
            values: {
                '平庸': { min: 1, max: 5, isPercent: false },
                '普通': { min: 5, max: 10, isPercent: false },
                '史诗': { min: 10, max: 20, isPercent: false },
                '传说': { min: 20, max: 30, isPercent: false },
                '神迹': { min: 30, max: 50, isPercent: false },
            }
        };
        affixes.push(newAffix);
        await dbSet(CUSTOM_AFFIXES_KEY, affixes);
        await renderCustomAffixList();
    }



        async function exportSegmentedMemory() {
            if (!currentArchiveName) {
                await showCustomAlert('错误：没有活动的存档。');
                return;
            }

            const archive = await db.archives.get(currentArchiveName);
            if (!archive || !archive.data.logs) {
                await showCustomAlert('错误：无法加载存档数据。');
                return;
            }

            const summariesToExport = {};
            let summaryCount = 0;

            archive.data.logs.forEach(log => {
                if (log.id && (log.smallSummary || log.largeSummary)) {
                    summariesToExport[log.id] = {
                        smallSummary: log.smallSummary || '',
                        largeSummary: log.largeSummary || ''
                    };
                    summaryCount++;
                }
            });

            if (summaryCount === 0) {
                await showCustomAlert('当前存档中没有可导出的分段记忆。');
                return;
            }

            const dataStr = JSON.stringify(summariesToExport, null, 2);
            const dataBlob = new Blob([dataStr], {type: "application/json"});
            const url = URL.createObjectURL(dataBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${currentArchiveName}_summaries.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
		

        async function importSegmentedMemory() {
            if (!currentArchiveName) {
                showCustomAlert('请先加载一个存档再导入记忆。');
                return;
            }

            genericImportInput.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async (event) => {
                    try {
                        const importedMemories = JSON.parse(event.target.result);
                        if (typeof importedMemories !== 'object' || Array.isArray(importedMemories)) {
                            throw new Error('文件格式不正确，应为一个以logId为键的对象。');
                        }

                        if (!await showCustomConfirm(`即将为当前存档 \"${currentArchiveName}\" 导入分段记忆。\n\n- 优先匹配ID。\n- 其次附加到无记忆的旧记录上。\n- 如果是新存档，将作为“背景记忆”注入。\n\n是否继续？`)) {
                            return;
                        }

                        const archive = await db.archives.get(currentArchiveName);
                        const logs = archive.data.logs;
                        const logMap = new Map(logs.map(log => [log.id, log]));
                        
                        let matchedCount = 0;
                        let appendedCount = 0;
                        let ghostInjectedCount = 0;
                        const orphanMemories = [];

                        // 第一轮：精确匹配
                        for (const logId in importedMemories) {
                            if (logMap.has(logId)) {
                                const logEntry = logMap.get(logId);
                                const memoryData = importedMemories[logId];
                                
                                if (memoryData.smallSummary && memoryData.smallSummary.trim()) {
                                    logEntry.smallSummary = memoryData.smallSummary;
                                }
                                if (memoryData.largeSummary && memoryData.largeSummary.trim()) {
                                    logEntry.largeSummary = memoryData.largeSummary;
                                }

                                matchedCount++;
                            } else {
                                orphanMemories.push({ id: logId, ...importedMemories[logId] });
                            }
                        }

                        // 寻找可用的AI回复空位
                        const availableSlots = logs.filter(log => 
                            log.type === 'ai' && 
                            !log.content.includes('<h4>天道初启</h4>') &&
                            !log.smallSummary && 
                            !log.largeSummary
                        );

                        // 第二轮：附加到空位上
                        if (orphanMemories.length > 0 && availableSlots.length > 0) {
                            const memoriesToAppend = orphanMemories.splice(0, availableSlots.length);
                            for (let i = 0; i < memoriesToAppend.length; i++) {
                                const slot = availableSlots[i];
                                const memoryData = memoriesToAppend[i];
                                slot.smallSummary = memoryData.smallSummary;
                                slot.largeSummary = memoryData.largeSummary;
                                appendedCount++;
                            }
                        }

                        // 第三轮：如果还有孤儿记忆，并且这是一个近乎全新的存档，则作为“幽灵记录”注入
                        if (orphanMemories.length > 0 && logs.length < 5) {
                            const ghostRecords = [];
                            orphanMemories.forEach((memoryData, index) => {
                                const ghostRecord = {
                                    id: memoryData.id || `ghost_${Date.now()}_${index}`,
                                    timestamp: new Date(0).toISOString(),
                                    type: 'system',
                                    content: `[背景记忆 #${index + 1}]`,
                                    isGhost: true,
                                    smallSummary: memoryData.smallSummary,
                                    largeSummary: memoryData.largeSummary
                                };
                                ghostRecords.push(ghostRecord);
                                ghostInjectedCount++;
                            });
                            archive.data.logs = [...ghostRecords, ...logs];
                        }

                        if (matchedCount > 0 || appendedCount > 0 || ghostInjectedCount > 0) {
                            // 【【【 修改点 】】】 在保存前，为存档打上已导入记忆的标记
                            archive.data.state.hasImportedMemories = true;

                            await db.archives.put(archive);
                            
                            // 【【【 修改点 】】】 传递完整的 archive 对象给 loadChatHistory
                            loadChatHistory(archive.data.logs, archive); 
                            await showCustomAlert(`导入成功！\n- 精确匹配: ${matchedCount} 条\n- 附加到旧记录: ${appendedCount} 条\n- 作为背景记忆注入: ${ghostInjectedCount} 条`);
                        } else {
                            await showCustomAlert('导入完成，但没有找到任何可匹配或可附加的记忆记录。');
                        }

                    } catch (err) {
                        await showCustomAlert(`导入失败: ${err.message}`);
                    } finally {
                        genericImportInput.value = '';
                    }
                };
                reader.readAsText(file);
            };
            genericImportInput.click();
        }


async function loadStateFromLog(logId) {
    const archive = await db.archives.get(currentArchiveName);
    if (!archive) {
        throw new Error('无法加载当前存档。');
    }
    const { logs } = archive.data;
    const logIndex = logs.findIndex(l => l.id === logId);

    if (logIndex === -1 || !logs[logIndex].stateSnapshot) {
        throw new Error('找不到对应的快照数据。');
    }

    try {
        const snapshotState = JSON.parse(logs[logIndex].stateSnapshot);
        
        currentState = snapshotState;
        archive.data.state.currentState = snapshotState;
        
        logs.splice(logIndex + 1);
        archive.data.logs = logs;

        await db.archives.put(archive);

        syncStateFromTables(); 
        loadChatHistory(logs, archive);
        renderPlayerAttributes(currentPlayerData);
        renderInventory(inventoryItems);
        await updateAvatar(currentPlayerData);

        if (snapshotOverlay.classList.contains('visible')) {
            snapshotOverlay.classList.remove('visible');
        }
        return true;
    } catch (e) {
        await showCustomAlert(`还原失败：快照数据解析错误。错误: ${e.message}`);
        console.error("解析快照时出错:", e);
        return false;
    }
}

async function handleNpcAutoImageGen(charId, prompt) {
    if (typeof eventEmit !== 'function' || typeof eventOn !== 'function') {
        console.error('自动生图错误: 未找到前端助手通信接口 (eventEmit/eventOn)。');
        return;
    }
    const width = 1024;
    const height = 1024;
    const requestId = `npc_${charId}_${Date.now()}`;
    const requestData = { id: requestId, prompt, width, height };
    
    const imageResponseHandler = async (responseData) => {
        if (responseData.id !== requestId) return;
        if (window.eventRemoveListener) {
            window.eventRemoveListener(EventType.GENERATE_IMAGE_RESPONSE, imageResponseHandler);
        }
        
        const charName = characterDatabase[charId]?.name || '新人物';
        const uniqueImageKey = `${charId}_${charName}`; 

        if (responseData.success && responseData.imageData) {
try {
const archive = await db.archives.get(currentArchiveName);

archive.data.state.npcAvatars = {};


archive.data.state.npcAvatars[uniqueImageKey] = responseData.imageData;
await db.archives.put(archive);

showDanmaku(`[${charName}] 的形象已生成！`, 'world');

if (!characterDetailView.classList.contains('hidden') && currentEditingNpcId === charId) {
await updateNpcAvatar(charId);
}
} catch (err) {
showDanmaku(`为 [${charName}] 保存形象失败: ${err.message}`, 'error');
}
} else {
            showDanmaku(`为 [${charName}] 生成形象失败: ${responseData.error || '未知错误'}`, 'error');
        }
    };
    eventOn(EventType.GENERATE_IMAGE_RESPONSE, imageResponseHandler);
    await eventEmit(EventType.GENERATE_IMAGE_REQUEST, requestData);
}

let backgroundGenApiController = null; 

async function extractAndGenerateBackground(storyText) {
if (!chatBackgroundSettings.autoGen) {
return;
}

if (!storyText || typeof storyText !== 'string' || storyText.trim() === '') {
showDanmaku('没有可用于生成背景的正文。', 'warning');
return;
}

if (!chatBackgroundSettings.apiUrl || !chatBackgroundSettings.apiKey || !chatBackgroundSettings.apiModel || !chatBackgroundSettings.apiPromptTemplate) {
showDanmaku('背景生成API配置不完整，请检查设置。', 'error');
return;
}

let statusDanmaku = null;
backgroundGenApiController = new AbortController(); 
const signal = backgroundGenApiController.signal; 

try {
statusDanmaku = showDanmaku('正在提取背景关键词...', 'status', backgroundGenApiController); // 【修改】传递 AbortController

const activeJsonContents = (backgroundJsonFiles || [])
.filter(file => file.active)
.map(file => file.content)
.join('\n\n');

const minimalContext = {
player: {
name: currentPlayerData.name,
gender: currentPlayerData.gender,
realm: currentPlayerData.realm,
attire: currentPlayerData.attire,
appearance: currentPlayerData.appearance,
location: currentPlayerData.location,
detailedLocation: currentPlayerData.detailedLocation
},
surroundingCharacters: surroundingCharacters.map(char => ({
name: char.name,
gender: char.gender,
identity: char.identity,
attire: char.attire,
appearance: char.appearance
}))
};
const minimalStateSnapshotString = JSON.stringify(minimalContext, null, 2);

const template = chatBackgroundSettings.apiPromptTemplate;
const finalPromptForKeywords = template
.replace(/\$\{text\}/g, storyText)
.replace(/\$\{json_context\}/g, activeJsonContents)
.replace(/\$\{state_snapshot\}/g, minimalStateSnapshotString);

const response = await fetch(`${chatBackgroundSettings.apiUrl}/chat/completions`, {
method: 'POST',
headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${chatBackgroundSettings.apiKey}` },
body: JSON.stringify({
model: chatBackgroundSettings.apiModel,
messages: [{ role: 'user', content: finalPromptForKeywords }],
temperature: 0.5,
}),
signal: signal 
});

if (signal.aborted) { 
console.log("背景图生成请求被主动中止。");
return;
}

if (!response.ok) {
let errorMessage = `关键词提取API请求失败 (${response.status})`;
try {
const errorData = await response.json();
errorMessage += `: ${errorData.error?.message || JSON.stringify(errorData)}`;
} catch (e) {
errorMessage += `: ${await response.text()}`;
}
throw new Error(errorMessage);
}

const data = await response.json();

let imagePrompt = '';
if (data.choices && data.choices[0] && data.choices[0].message && typeof data.choices[0].message.content === 'string') {
imagePrompt = data.choices[0].message.content.trim();
}

if (imagePrompt) {
lastGeneratedPrompt = imagePrompt;
await handleAIGenRequest(imagePrompt, true, statusDanmaku);
} else {
console.error("无法从文本API响应中提取关键词。收到的数据结构:", data);

if (statusDanmaku) {
statusDanmaku.remove();
}
showDanmaku('无法提取有效背景关键词，保持当前背景不变。', 'error');
}

} catch (error) {
if (error.name === 'AbortError') { 
console.log("背景图生成请求被用户取消。");
showDanmaku('背景图生成请求已取消。', 'world');
} else {
console.error('自动背景生成流程出错:', error);
if (statusDanmaku) statusDanmaku.remove();
showDanmaku(`背景生成失败: ${error.message}，保持当前背景不变。`, 'error');
}
} finally {
if (statusDanmaku) statusDanmaku.remove();
backgroundGenApiController = null; 
}
}




async function loadBackgroundJsonFiles() {
    try {
        backgroundJsonFiles = await dbGet(BACKGROUND_JSON_FILES_KEY) || [];
        // 为旧数据做兼容，确保 active 属性存在
        backgroundJsonFiles.forEach(file => {
            if (file.active === undefined) file.active = true;
        });
    } catch (e) {
        console.error("加载导入的背景图JSON文件失败:", e);
        backgroundJsonFiles = [];
    }
    // 渲染列表（稍后实现）
    renderBackgroundJsonList();
}

function renderBackgroundJsonList() {
    const listEl = document.getElementById('background-json-list');
    if (!listEl) return;

    listEl.innerHTML = '';

    if (backgroundJsonFiles.length === 0) {
        listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">暂无导入的规则文件。</p>';
        return;
    }

    backgroundJsonFiles.forEach((file) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'regex-rule-item'; // 复用现有样式

        itemEl.innerHTML = `
            <span class="rule-name" title="${sanitizeHTML(file.name)}" style="flex-grow: 1;">${sanitizeHTML(file.name)}</span>
            <div class="rule-actions">
                <label class="switch" title="启用/禁用此规则文件">
                    <input type="checkbox" class="background-json-active-toggle" data-id="${file.id}" ${file.active ? 'checked' : ''}>
                    <span class="slider round"></span>
                </label>
                <button class="background-json-delete-btn" data-id="${file.id}" title="删除此规则文件" style="border-color: #e57373; color: #e57373; width:28px; height:28px; border-radius:50%; background:none; cursor:pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        listEl.appendChild(itemEl);
    });
}


function setupBackgroundJsonListeners() {
    const importBtn = document.getElementById('import-background-json-btn');
    const importInput = document.getElementById('background-json-import-input');
    const listEl = document.getElementById('background-json-list');

    if (!importBtn || !importInput || !listEl) return;

    // 绑定“导入”按钮点击事件
    importBtn.addEventListener('click', () => importInput.click());

    // 绑定文件选择事件
    importInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const rawContent = event.target.result;
                let processedContent = rawContent;
                try {
                    const parsedData = JSON.parse(rawContent);
                    if (parsedData && typeof parsedData.entries === 'object' && parsedData.entries !== null) {
                        const contents = Object.values(parsedData.entries).map(entry => (entry && typeof entry.content === 'string') ? entry.content.trim() : '').filter(Boolean);
                        processedContent = contents.join('\n\n');
                    }
                } catch (jsonError) {
                    // It's a plain text file, which is fine
                }

                if (backgroundJsonFiles.some(f => f.name === file.name)) {
                    await showCustomAlert(`文件 "${file.name}" 已存在，请勿重复导入。`);
                    return;
                }

                const newFile = { id: crypto.randomUUID(), name: file.name, content: processedContent, active: true };
                backgroundJsonFiles.push(newFile);
                await dbSet(BACKGROUND_JSON_FILES_KEY, backgroundJsonFiles);
                renderBackgroundJsonList();
                showDanmaku(`背景规则文件 "${file.name}" 导入成功！`, 'success');
            } catch (err) {
                await showCustomAlert(`导入文件时发生未知错误: ${err.message}`);
            } finally {
                e.target.value = '';
            }
        };
        reader.readAsText(file);
    });

    // 使用事件委托处理列表内的点击事件
    listEl.addEventListener('click', async (event) => {
        const target = event.target;
        const fileId = target.closest('[data-id]')?.dataset.id;
        if (!fileId) return;

        const fileIndex = backgroundJsonFiles.findIndex(f => f.id === fileId);
        if (fileIndex === -1) return;

        // 处理“启用/禁用”开关
        if (target.classList.contains('background-json-active-toggle')) {
            backgroundJsonFiles[fileIndex].active = target.checked;
            await dbSet(BACKGROUND_JSON_FILES_KEY, backgroundJsonFiles);
            showDanmaku(`规则文件 "${backgroundJsonFiles[fileIndex].name}" 已${target.checked ? '启用' : '禁用'}`, 'success');
        }

        // 处理“删除”按钮
        const deleteButton = target.closest('.background-json-delete-btn');
        if (deleteButton) {
            const fileToDelete = backgroundJsonFiles[fileIndex];
            if (await showCustomConfirm(`确定要永久删除规则文件 "${fileToDelete.name}" 吗？`)) {
                backgroundJsonFiles.splice(fileIndex, 1);
                await dbSet(BACKGROUND_JSON_FILES_KEY, backgroundJsonFiles);
                renderBackgroundJsonList();
                showDanmaku(`文件 "${fileToDelete.name}" 已删除。`, 'success');
            }
        }
    });
}


        function openNpcImageGenModal(char) {
            if (!char) return;
            document.getElementById('npc-image-gen-title').textContent = `为 ${char.name} 生成形象`;
            
            let finalPrompt = '';
            if (char.imageGenPrompt && char.imageGenPrompt.trim()) {
                finalPrompt = char.imageGenPrompt;
            } 
            else {
                const basePrompts = [
                    'masterpiece', 'best quality', 'solo',
                    (char.gender === '男' ? '1boy' : '1girl')
                ];
                
                const descriptivePrompts = [
                    char.appearance, 
                    char.figure, 
                    char.attire, 
                    char.action
                ];
                finalPrompt = [
                    ...basePrompts,
                    ...descriptivePrompts
                ]
                .filter(p => p && p.trim() && p.trim() !== '未知' && p.trim() !== '无')
                .join(', ');
            }
            document.getElementById('npc-gen-prompt').value = finalPrompt;
            document.getElementById('npc-gen-status').textContent = '';
            npcImageGenOverlay.classList.add('visible');
        }

async function handleNpcImageGenRequest() {
    if (typeof eventEmit !== 'function' || typeof eventOn !== 'function') {
        await showCustomAlert('错误：未找到前端助手通信接口 (eventEmit/eventOn)。');
        return;
    }
    if (!currentEditingNpcId) {
        await showCustomAlert('错误：未指定当前操作的NPC。');
        return;
    }

    const targetNpcId = currentEditingNpcId;

    const prompt = document.getElementById('npc-gen-prompt').value;
    const width = parseInt(document.getElementById('npc-gen-width').value);
    const height = parseInt(document.getElementById('npc-gen-height').value);
    const statusEl = document.getElementById('npc-gen-status');
    if (!prompt) {
        statusEl.textContent = '提示词不能为空！';
        return;
    }
    const requestId = `npc_${targetNpcId}_${Date.now()}`;
    const requestData = { id: requestId, prompt, width, height };
    statusEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在发送请求...';

    const imageResponseHandler = async (responseData) => {
        if (responseData.id !== requestId) return;
        if (window.eventRemoveListener) {
            window.eventRemoveListener('generate-image-response', imageResponseHandler);
            window.eventRemoveListener('generate_image_response', imageResponseHandler);
        }
        
        const charName = characterDatabase[targetNpcId]?.name || '该人物';
        const uniqueImageKey = `${targetNpcId}_${charName}`;

        if (responseData.success && responseData.imageData) {
            statusEl.textContent = '生成成功！正在保存...';
            try {
                const archive = await db.archives.get(currentArchiveName);
                if (!archive.data.state.npcAvatars) {
                    archive.data.state.npcAvatars = {};
                }
                archive.data.state.npcAvatars[uniqueImageKey] = responseData.imageData;
                await db.archives.put(archive);

                const usedPrompt = document.getElementById('npc-gen-prompt').value;
                if (currentState['0'][targetNpcId]) {
                    currentState['0'][targetNpcId]['19'] = usedPrompt;
                }
                if (characterDatabase[targetNpcId]) {
                    characterDatabase[targetNpcId].imageGenPrompt = usedPrompt;
                }
                await saveCurrentState();
                
                showDanmaku(`已为 [${charName}] 保存新的生图提示词！`, 'world');

                if (!characterDetailView.classList.contains('hidden') && currentEditingNpcId === targetNpcId) {
                    await updateNpcAvatar(targetNpcId);
                }

                statusEl.textContent = '头像已更新！';
                setTimeout(() => npcImageGenOverlay.classList.remove('visible'), 1500);
            } catch (err) {
                statusEl.textContent = `保存失败: ${err.message}`;
            }
        } else {
            statusEl.textContent = `生成失败: ${responseData.error || '未知错误'}`;
        }
    };
    
    eventOn('generate-image-response', imageResponseHandler);
    eventOn('generate_image_response', imageResponseHandler);
    
    await eventEmit('generate-image-request', requestData);
    await eventEmit('generate_image_request', requestData);
}


function showPersistentStatus(message) {
    let statusIndicator = document.getElementById('persistent-status-indicator');
    if (!statusIndicator) {
        statusIndicator = document.createElement('div');
        statusIndicator.id = 'persistent-status-indicator';
        statusIndicator.style.position = 'fixed';
        statusIndicator.style.bottom = '20px';
        statusIndicator.style.left = '50%';
        statusIndicator.style.transform = 'translateX(-50%)';
        statusIndicator.style.padding = '10px 20px';
        statusIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        statusIndicator.style.color = '#fff';
        statusIndicator.style.borderRadius = '8px';
        statusIndicator.style.zIndex = '2000';
        statusIndicator.style.textAlign = 'center';
        statusIndicator.style.fontSize = '14px';
        statusIndicator.style.transition = 'opacity 0.3s';
        document.body.appendChild(statusIndicator);
    }
    statusIndicator.innerHTML = message;
}


function hidePersistentStatus() {
    const statusIndicator = document.getElementById('persistent-status-indicator');
    if (statusIndicator) {
        statusIndicator.style.opacity = '0';
        setTimeout(() => { statusIndicator.remove(); }, 300);
    }
}
function showDeedsTimeline(char) {
    const timelineModal = document.getElementById('deeds-timeline-overlay');
    const titleEl = document.getElementById('deeds-timeline-title');
    const listEl = document.getElementById('deeds-timeline-list');
    titleEl.textContent = `${char.name}的事迹`;
    listEl.innerHTML = '';
    const deeds = char.deeds ? char.deeds.split(';').filter(d => d.trim()) : [];
    if (deeds.length === 0) {
        listEl.innerHTML = '<li>暂无相关事迹记录。</li>';
    } else {
        deeds.forEach(deed => {
            const parts = deed.split(':');
            const time = parts.length > 1 ? parts[0] : '未知时间';
            const text = parts.length > 1 ? parts.slice(1).join(':') : deed;
            const li = document.createElement('li');
            li.className = 'deed-item';
            li.innerHTML = `<span class="deed-time">${time}</span><span class="deed-text">${text}</span>`;
            listEl.appendChild(li);
        });
    }
    timelineModal.classList.add('visible');
}
async function updateNpcAvatar(npcId) {
    const imgEl = document.getElementById('char-detail-avatar-img');
    const placeholderEl = document.getElementById('char-detail-avatar-placeholder');
    const deleteBtn = document.getElementById('char-detail-avatar-delete-btn');
    
    const character = characterDatabase[npcId];
    if (!character) {
        console.error(`updateNpcAvatar 错误: 找不到ID为 ${npcId} 的角色数据。`);
        imgEl.classList.add('hidden');
        placeholderEl.classList.remove('hidden');
        deleteBtn.classList.add('hidden');
        return;
    }

    const uniqueImageKey = `${npcId}_${character.name}`;
    
    const archive = await db.archives.get(currentArchiveName);
    const npcAvatars = archive?.data?.state?.npcAvatars || {};
    const avatarData = npcAvatars[uniqueImageKey];

    if (avatarData) {
        imgEl.src = avatarData;
        imgEl.classList.remove('hidden');
        placeholderEl.classList.add('hidden');
        deleteBtn.classList.remove('hidden');
    } else {
        imgEl.src = '';
        imgEl.classList.add('hidden');
        placeholderEl.classList.remove('hidden');
        deleteBtn.classList.add('hidden');
    }
}

function openGiftPicker(char) {
    surroundingCharactersOverlay.classList.remove('visible');
    pickerTitle.textContent = `选择要赠送给 ${char.name} 的物品`;
    pickerGrid.innerHTML = '';
    const giftableItems = inventoryItems.filter(item => item.type !== '重要物品');
    if (giftableItems.length === 0) {
        pickerGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; opacity: 0.7;">储物袋中没有可赠送的物品。</p>`;
    } else {
        giftableItems.forEach(item => {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            slot.title = `${item.name}\n类型: ${item.type}\n描述: ${item.description}\n效果: ${item.effect}`;
            const iconClass = itemIconMap[item.type] || itemIconMap['默认'];
            slot.innerHTML = `<i class="fas ${iconClass} inventory-slot-icon"></i><span class="inventory-slot-name">${item.name}</span><span class="inventory-slot-quantity">${item.quantity}</span>`;
            slot.addEventListener('click', () => {
                addAction('gift', item, { charName: char.name });
                const itemInState = currentState['1'][item.id];
                if (itemInState) {
                    const currentQuantity = parseInt(itemInState['5']);
                    if (currentQuantity > 1) {
                        itemInState['5'] = (currentQuantity - 1).toString();
                    } else {
                        delete currentState['1'][item.id];
                    }
                }
                saveCurrentState();
                syncStateFromTables();
                renderInventory(inventoryItems);
                closeEquipmentPicker();
            });
            pickerGrid.appendChild(slot);
        });
    }
    pickerOverlay.classList.add('visible');
}



function refreshSplashVideo() {
    const videoElement = document.getElementById('splash-video-bg');
    if (!videoElement) {
        console.error('错误: 找不到ID为 #splash-video-bg 的视频元素。');
        return;
    }

    const currentSrc = videoElement.src;
    
    if (SPLASH_VIDEOS.length <= 1) {
        return;
    }

    // 创建一个不包含当前视频的候选列表
    const availableVideos = SPLASH_VIDEOS.filter(video => video !== currentSrc);

    let newVideoSrc;

    if (availableVideos.length > 0) {
        newVideoSrc = availableVideos[Math.floor(Math.random() * availableVideos.length)];
    } else {
        // 如果过滤后列表为空（例如当前URL不在列表中），则从原始列表中随机选一个
        do {
            newVideoSrc = SPLASH_VIDEOS[Math.floor(Math.random() * SPLASH_VIDEOS.length)];
        } while (newVideoSrc === currentSrc && SPLASH_VIDEOS.length > 1);
    }
    
    videoElement.src = newVideoSrc;
}

function setRandomSplashVideo() {
    const videoBg = document.getElementById('splash-video-bg');
    if (!videoBg) return;

    // 从视频列表中随机选择一个
    const randomIndex = Math.floor(Math.random() * SPLASH_VIDEOS.length);
    const randomVideoUrl = SPLASH_VIDEOS[randomIndex];

    // 设置视频源
    if (videoBg.src !== randomVideoUrl) {
        videoBg.src = randomVideoUrl;
        // 尝试播放，浏览器通常会处理好后续加载
        videoBg.load();
        videoBg.play().catch(e => console.warn("背景视频自动播放可能已被浏览器阻止:", e));
    }
}


function setupEventListeners() {

document.getElementById('splash-fullscreen-btn').addEventListener('click', toggleFullScreen);

document.getElementById('open-splash-cloud-settings-btn').addEventListener('click', () => {
    document.getElementById('splash-io-menu-overlay').classList.remove('visible');
    manageCloudStorageSettings();
    document.getElementById('cloud-storage-settings-overlay').classList.add('visible');
});

    inventoryGrid.addEventListener('click', (e) => {
        const slot = e.target.closest('.inventory-slot');
        if (slot && slot.dataset.itemId) {
            const item = inventoryItems.find(i => i.id === slot.dataset.itemId);
            if (item) {
                showItemDetail(item);
            }
        }
    });
   inventoryGrid.addEventListener('contextmenu', async (e) => {
        e.preventDefault();
        const slot = e.target.closest('.inventory-slot');
        if (slot && slot.dataset.itemId) {
            const item = inventoryItems.find(i => i.id === slot.dataset.itemId);
            if (item && await showCustomConfirm(`确定要永久删除物品 "${item.name}" 吗？`)) {
                delete currentState['1'][item.id];
                await saveCurrentState();
                syncStateFromTables();
                renderInventory(inventoryItems);
            }
        }
    });
	const refreshBtn = document.getElementById('splash-refresh-btn');
if (refreshBtn) {
    refreshBtn.addEventListener('click', refreshSplashVideo);
}
	
   const chatArea = document.getElementById('main-content-area');
    if (chatArea) {
        let longPressTimer;
        chatArea.addEventListener('contextmenu', handleLongPress);
        
        chatArea.addEventListener('touchstart', e => {
            const target = e.target.closest('.log-entry');
            if (!target) return;
            longPressTimer = setTimeout(() => {
                handleLongPress(e);
                longPressTimer = null;
            }, 500);
        }, { passive: true });
        chatArea.addEventListener('touchend', () => clearTimeout(longPressTimer));
        chatArea.addEventListener('touchmove', () => clearTimeout(longPressTimer));
        chatArea.addEventListener('click', (event) => {
            const targetButton = event.target.closest('.shop-item-btn');
            if (targetButton) {
                const itemText = targetButton.dataset.shopItem;
                if (itemText) {
                    addToInput(itemText);
                }
            }
            const logEntryTarget = event.target.closest('.log-entry');
            if (!messageContextMenu.contains(event.target) && (!logEntryTarget || !logEntryTarget.contains(activeLogEntry))) {
                hideContextMenu();
            }
        });
    }
	
const loadPresetBtn = document.getElementById('load-last-preset-btn');
if (loadPresetBtn) {
loadPresetBtn.addEventListener('click', () => {

openWorkshop();
});
}

	
document.getElementById('fetch-image-tagging-models-btn').addEventListener('click', function() {
    fetchModelsForPanel(
        'image-tagging-api-url',
        'image-tagging-api-key',
        'image-tagging-api-model',
        this
    );
});
         document.getElementById('export-world-btn').addEventListener('click', exportWorldData);
        document.getElementById('import-world-btn').addEventListener('click', importWorldData);
 
const imageTaggingSettingsOverlay = document.getElementById('image-tagging-api-settings-overlay');

document.getElementById('open-image-tagging-api-settings-btn').addEventListener('click', () => {
    imageTaggingSettingsOverlay.classList.add('visible');
});

imageTaggingSettingsOverlay.querySelector('.modal-close-btn').addEventListener('click', () => {
    imageTaggingSettingsOverlay.classList.remove('visible');
});

document.getElementById('save-image-tagging-api-settings-btn').addEventListener('click', saveImageTaggingApiConfig);

const imageTaggingJsonImportInput = document.getElementById('image-tagging-json-import-input');
document.getElementById('import-image-tagging-json-btn').addEventListener('click', () => {
    imageTaggingJsonImportInput.click();
});

imageTaggingJsonImportInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const rawContent = event.target.result;
            let processedContent = rawContent;

            try {
                const parsedData = JSON.parse(rawContent);
                
                if (parsedData && typeof parsedData.entries === 'object' && parsedData.entries !== null) {
                    
                    const contents = Object.values(parsedData.entries)
                        .map(entry => (entry && typeof entry.content === 'string') ? entry.content.trim() : '')
                        .filter(content => content);

                    processedContent = contents.join('\n\n');
                    
                    console.log(`成功解析并提取了JSON文件 "${file.name}" 中的内容。`);
                }
            } catch (jsonError) {
                console.log(`文件 "${file.name}" 不是一个有效的JSON，将作为纯文本处理。`);
            }

            if (imageTaggingJsonFiles.some(f => f.name === file.name)) {
                await showCustomAlert(`文件 "${file.name}" 已存在，请勿重复导入。`);
                return;
            }

            const newFile = {
                id: crypto.randomUUID(),
                name: file.name,
                content: processedContent,
                active: true
            };
            
            imageTaggingJsonFiles.push(newFile);
            await dbSet(IMAGE_TAGGING_JSON_FILES_KEY, imageTaggingJsonFiles);
            renderTextImageJsonList();
            showDanmaku(`规则文件 "${file.name}" 导入成功！`, 'success');

        } catch (err) {
            await showCustomAlert(`导入文件时发生未知错误: ${err.message}`);
        } finally {
            e.target.value = '';
        }
    };
    reader.readAsText(file);
});

document.getElementById('open-thinking-api-settings-btn').addEventListener('click', () => {
        systemSettingsOverlay.classList.remove('visible');
        thinkingApiSettingsOverlay.classList.add('visible');
    });
    thinkingApiSettingsOverlay.querySelector('.modal-close-btn').addEventListener('click', () => {
        thinkingApiSettingsOverlay.classList.remove('visible');
    });
    document.getElementById('save-thinking-api-settings-btn').addEventListener('click', saveThinkingApiConfig);

document.getElementById('fetch-background-models-btn').addEventListener('click', function() {
    fetchModelsForPanel(
        'background-api-url',
        'background-api-key',
        'background-api-model',
        this
    );
});


const rerollBgBtn = document.getElementById('reroll-background-btn');
if (rerollBgBtn) {
    rerollBgBtn.addEventListener('click', async () => {
        console.log("背景重roll按钮被点击。将从数据库读取当前存档...");

        try {
            const activeArchiveName = await dbGet(ACTIVE_ARCHIVE_KEY);
            
            if (!activeArchiveName) {
                showDanmaku('错误：找不到任何活动的存档记录。', 'error');
                console.error("无法重roll背景，因为在数据库中找不到 ACTIVE_ARCHIVE_KEY。");
                return;
            }

            const archive = await db.archives.get(activeArchiveName);
            if (!archive || !archive.data || !archive.data.logs) {
                showDanmaku('错误：存档数据加载失败或已损坏。', 'error');
                console.warn(`加载存档 "${activeArchiveName}" 时失败。`);
                return;
            }
            
            const historyFromDb = archive.data.logs;
            
            if (historyFromDb.length === 0) {
                showDanmaku('当前存档记录中没有可用于生成背景的正文。', 'warning');
                return;
            }

            let lastStoryText = '';
            for (let i = historyFromDb.length - 1; i >= 0; i--) {
                const entry = historyFromDb[i];
                if (entry.type === 'ai' && !entry.isInternal && entry.content && !entry.content.includes('<h4>天道初启</h4>')) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = entry.content; 
                    const textContent = (tempDiv.textContent || tempDiv.innerText || "").trim();
                    if (textContent) {
                        lastStoryText = textContent;
                        break; 
                    }
                }
            }

            if (lastStoryText) {
                console.log("从数据库成功提取到最新正文:", lastStoryText);
                extractAndGenerateBackground(lastStoryText);
            } else {
                showDanmaku('在存档中找到了AI回复，但无法提取有效文本内容。', 'warning');
            }
        } catch (error) {
            showDanmaku('读取存档时发生错误。', 'error');
            console.error("重roll背景时读取数据库失败:", error);
        }
    });
}



        const promptEditModal = document.getElementById('prompt-edit-modal');
        const promptEditTextarea = document.getElementById('prompt-edit-textarea');
        const regenerateBtn = document.getElementById('regenerate-current-bg-btn');
        const cancelBtn = document.getElementById('prompt-edit-cancel-btn');
        const generateBtn = document.getElementById('prompt-edit-generate-btn');

        if (promptEditModal && promptEditTextarea && regenerateBtn && cancelBtn && generateBtn) {
            
        regenerateBtn.addEventListener('click', () => {
            promptEditTextarea.value = lastGeneratedPrompt || '';
            
            promptEditModal.classList.add('visible');
            
            promptEditTextarea.focus();
        });

            cancelBtn.addEventListener('click', () => {
                promptEditModal.classList.remove('visible');
            });

            generateBtn.addEventListener('click', async () => {
                const editedPrompt = promptEditTextarea.value.trim();
                if (!editedPrompt) {
                    showDanmaku('提示词不能为空！', 'error');
                    return;
                }
                
                promptEditModal.classList.remove('visible');
                lastGeneratedPrompt = editedPrompt;
                
                await handleAIGenRequest(editedPrompt, false);
            });

        } else {
            console.warn("未能初始化'重新生成背景'的编辑功能，因为缺少一个或多个HTML元素。请检查以下ID是否存在: 'prompt-edit-modal', 'prompt-edit-textarea', 'regenerate-current-bg-btn', 'prompt-edit-cancel-btn', 'prompt-edit-generate-btn'");
        }

document.getElementById('export-segmented-memory-btn').addEventListener('click', exportSegmentedMemory);
document.getElementById('import-segmented-memory-btn').addEventListener('click', importSegmentedMemory);
document.getElementById('auto-gen-npc-image-toggle').addEventListener('change', (e) => {
    funSettings.autoGenNpcImage = e.target.checked;
    saveFunSettings(); 
});
npcImageGenOverlay.querySelector('.modal-close-btn').addEventListener('click', () => npcImageGenOverlay.classList.remove('visible'));
document.getElementById('npc-avatar-fullscreen-overlay').addEventListener('click', () => {
document.getElementById('npc-avatar-fullscreen-overlay').classList.remove('visible');
});
document.getElementById('npc-gen-start-btn').addEventListener('click', handleNpcImageGenRequest);
    document.getElementById('ctx-resend-btn').addEventListener('click', async () => {
        if (!activeLogEntry) {
            hideContextMenu();
            return;
        }
        hideContextMenu();
        const archive = await db.archives.get(currentArchiveName);
        if (!archive) return;
        let logs = archive.data.logs;
        const lastUserLogIndex = logs.findLastIndex(log => log.type === 'user');
        if (lastUserLogIndex === -1) {
            await showCustomAlert('错误：找不到任何用户输入记录。');
            return;
        }
        const textToResend = logs[lastUserLogIndex].content.replace(/^> /, '');
        messageInput.value = textToResend;
        let stateSnapshotIndex = -1;
        for (let i = lastUserLogIndex - 1; i >= 0; i--) {
            if (logs[i].stateSnapshot) {
                stateSnapshotIndex = i;
                break;
            }
        }
        if (stateSnapshotIndex === -1) {
            await showCustomAlert('无法重新发送：找不到可回溯的状态快照。');
            return;
        }
        const logIdToLoad = logs[stateSnapshotIndex].id;
        await loadStateFromLog_retry(logIdToLoad);
        await sendMessage();
        await new Promise(resolve => setTimeout(resolve, 200));
        const logEntries = document.querySelectorAll('.log-entry.user');
        if (logEntries.length > 0) {
            logEntries[logEntries.length - 1].scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    });

document.getElementById('start-new-life-btn').addEventListener('click', () => {
splashScreen.classList.add('hidden');
creationScreen.classList.remove('hidden');
startCharacterCreation();
});

document.getElementById('workshop-splash-btn').addEventListener('click', () => {
    splashScreen.classList.add('hidden');
    openWorkshop();
});
document.getElementById('workshop-refresh-btn').addEventListener('click', () => {
    fetchAndRenderWorkshopPresets(true);
});

document.getElementById('load-life-btn').addEventListener('click', async () => {
const activeArchive = await dbGet(ACTIVE_ARCHIVE_KEY);
const archivesCount = await db.archives.count();

if (activeArchive) {
splashScreen.classList.add('hidden');
cultivationPanel.classList.remove('hidden');
await selectAndLoadArchive(activeArchive);
} else if (archivesCount > 0) {
splashScreen.classList.add('hidden');
cultivationPanel.classList.remove('hidden');
toggleCenterView('archive-selection-view');
await renderArchiveSelectionView();
}
});

splashImportBtn.addEventListener('click', () => {
splashIoMenuOverlay.classList.add('visible');
});

document.querySelectorAll('.workshop-category-card').forEach(card => {
card.addEventListener('click', () => {
workshopCurrentCategory = card.dataset.category;
const titles = {
preset: '开局预设',
birth: '自定义出身',
race: '自定义种族',
trait: '自定义词条',
bondedCharacter: '羁绊人物'
};
document.getElementById('workshop-list-title').textContent = titles[workshopCurrentCategory];
document.getElementById('workshop-main-view').classList.add('hidden');
document.getElementById('workshop-list-view').classList.remove('hidden');
fetchAndRenderWorkshopPresets();
});
});

document.getElementById('back-to-workshop-main-btn').addEventListener('click', () => {
document.getElementById('workshop-main-view').classList.remove('hidden');
document.getElementById('workshop-list-view').classList.add('hidden');
updateWorkshopCategoryCounts();
});

splashIoMenuOverlay.querySelector('.modal-close-btn').addEventListener('click', () => {
splashIoMenuOverlay.classList.remove('visible');
});

document.getElementById('splash-import-archive-btn').addEventListener('click', () => {
document.getElementById('import-archive-input').click();
});

document.getElementById('splash-export-archive-btn').addEventListener('click', () => {
openExportArchiveSelection();
});

document.getElementById('splash-import-preset-btn').addEventListener('click', () => {
handleImportPreset();
});

document.getElementById('splash-export-preset-btn').addEventListener('click', () => {
handleExportPreset();
});
splashSettingsBtn.addEventListener('click', openCacheManager);
cacheManagerOverlay.querySelector('.modal-close-btn').addEventListener('click', () => cacheManagerOverlay.classList.remove('visible'));

document.getElementById('delete-archives-data-btn').addEventListener('click', async () => {
if (await showCustomConfirm('确定要删除所有游戏存档吗？此操作不可逆！')) {
await db.archives.clear();
await db.npcAvatars.clear();
await showCustomAlert('所有存档数据已删除。');
openCacheManager();
}
});
document.getElementById('delete-summary-settings-btn').addEventListener('click', async () => {
if (await showCustomConfirm('确定要删除总结设置吗？将恢复为默认值。')) {
await dbRemove(SUMMARY_CONFIG_KEY);
await showCustomAlert('总结设置已删除。');
openCacheManager();
}
});
document.getElementById('delete-regex-settings-btn').addEventListener('click', async () => {
if (await showCustomConfirm('确定要删除正则设置吗？将恢复为默认值。')) {
await dbRemove(REGEX_CONFIG_KEY);
await showCustomAlert('正则设置已删除。');
openCacheManager();
}
});
document.getElementById('delete-custom-traits-btn').addEventListener('click', async () => {
if (await showCustomConfirm('确定要删除所有自定义词条吗？此操作不可逆！')) {
await dbRemove(CUSTOM_TRAITS_KEY);
await showCustomAlert('自定义词条已删除。');
openCacheManager();
}
});
document.getElementById('delete-custom-births-btn').addEventListener('click', async () => {
if (await showCustomConfirm('确定要删除所有自定义出身吗？此操作不可逆！')) {
await dbRemove(CUSTOM_BIRTHS_KEY);
await showCustomAlert('自定义出身已删除。');
openCacheManager();
}
});
document.getElementById('delete-custom-races-btn').addEventListener('click', async () => {
if (await showCustomConfirm('确定要删除所有自定义种族吗？此操作不可逆！')) {
await dbRemove(CUSTOM_RACES_KEY);
await showCustomAlert('自定义种族已删除。');
openCacheManager();
}
});
document.getElementById('delete-bonded-chars-btn').addEventListener('click', async () => {
if (await showCustomConfirm('确定要删除所有羁绊人物名册吗？此操作不可逆！')) {
await dbRemove(CUSTOM_BONDED_CHARS_KEY);
await showCustomAlert('羁绊人物名册已删除。');
openCacheManager();
}
});


sendMessageButton.addEventListener('click', () => sendMessage());
messageInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });
themeToggleButton.addEventListener('click', () => { body.classList.toggle('theme-day'); const isNight = !body.classList.contains('theme-day'); themeToggleButton.innerHTML = isNight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>'; });
fullscreenBtn.addEventListener('click', () => {
toggleFullScreen();
markFeatureAsSeen('fullscreen-btn');
});
scaleUpBtn.addEventListener('click', () => { currentScale = Math.min(1.2, currentScale + 0.1); cultivationPanel.style.setProperty('--panel-scale', currentScale); });
scaleDownBtn.addEventListener('click', () => { currentScale = Math.max(0.7, currentScale - 0.1); cultivationPanel.style.setProperty('--panel-scale', currentScale); });
scaleResetBtn.addEventListener('click', () => { currentScale = 1.0; cultivationPanel.style.setProperty('--panel-scale', currentScale); });
manageLogButton.addEventListener('click', async () => { toggleCenterView('archive-selection-view'); await renderArchiveSelectionView(); markFeatureAsSeen('manage-log-button'); });
backToChatFromArchivesButton.addEventListener('click', () => toggleCenterView('chat-view'));
backToArchivesButton.addEventListener('click', async () => { toggleCenterView('archive-selection-view'); await renderArchiveSelectionView(); });
characterDisplay.addEventListener('click', openCharacterDetail);
document.getElementById('change-avatar-btn').addEventListener('click', () => avatarUploadInput.click());
avatarUploadInput.addEventListener('change', (e) => handleAvatarUpload(e, 'player'));
npcAvatarUploadInput.addEventListener('change', (e) => handleAvatarUpload(e, 'npc'));
modalCloseBtn.addEventListener('click', closeCharacterDetail);
characterDetailOverlay.addEventListener('click', (e) => { if (e.target === characterDetailOverlay) { closeCharacterDetail(); } });
pickerCloseBtn.addEventListener('click', closeEquipmentPicker);
pickerOverlay.addEventListener('click', (e) => { if (e.target === pickerOverlay) { closeEquipmentPicker(); } });
openCommandQueueBtn.addEventListener('click', () => commandQueueOverlay.classList.add('visible'));
document.getElementById('action-queue-indicator').addEventListener('click', () => {
commandQueueOverlay.classList.add('visible');
});
closeCommandQueueBtn.addEventListener('click', () => commandQueueOverlay.classList.remove('visible'));
commandQueueOverlay.addEventListener('click', (e) => { if (e.target === commandQueueOverlay) { commandQueueOverlay.classList.remove('visible'); } });
undoCommandBtn.addEventListener('click', () => { if (actionQueue.length > 0) { actionQueue.pop(); renderActionQueue(); } });
clearCommandsBtn.addEventListener('click', async () => { if (await showCustomConfirm('确定要清空所有待执行指令吗？')) { actionQueue = []; renderActionQueue(); } });
itemDetailCloseBtn.addEventListener('click', closeItemDetail);
itemDetailOverlay.addEventListener('click', (e) => { if (e.target === itemDetailOverlay) { closeItemDetail(); } });
mainContentArea.addEventListener('contextmenu', handleLongPress);
mainContentArea.addEventListener('touchstart', e => {
const target = e.target.closest('.log-entry');
if (!target) return;
longPressTimer = setTimeout(() => { handleLongPress(e); longPressTimer = null; }, 500);
}, { passive: false });
mainContentArea.addEventListener('touchend', () => clearTimeout(longPressTimer));
mainContentArea.addEventListener('touchmove', () => clearTimeout(longPressTimer));
document.getElementById('ctx-edit-btn').addEventListener('click', () => {
if (!activeLogEntry) return;
const logId = activeLogEntry.dataset.logId;
if (!logId) {
showCustomAlert('无法编辑此消息：缺少唯一标识。');
hideContextMenu();
return;
}
openMessageEditor(logId);
hideContextMenu();
});
document.getElementById('ctx-resend-btn').addEventListener('click', async () => {
    if (!activeLogEntry) {
        hideContextMenu();
        return;
    }
    const currentActiveLogEntry = activeLogEntry;
    hideContextMenu();
    
    let textToResend = '';
    
    sendMessageButton.disabled = true;
    branchingOptionsOverlay.querySelector('.modal').classList.add('disabled');

    try {
        const archive = await db.archives.get(currentArchiveName);
        if (!archive) throw new Error('找不到当前存档。');

        const logs = archive.data.logs;
        const targetLogIndex = logs.findIndex(log => log.id === currentActiveLogEntry.dataset.logId);
        
        if (targetLogIndex === -1) throw new Error('在存档中找不到目标消息。');
        
        let stateSnapshotIndex = -1;
        for (let i = targetLogIndex - 1; i >= 0; i--) {
            if (logs[i].stateSnapshot) {
                stateSnapshotIndex = i;
                break;
            }
        }
        if (stateSnapshotIndex === -1) throw new Error('无法重新发送：在此消息之前找不到可回溯的状态快照。');
        
        textToResend = logs[targetLogIndex].content.replace(/^> /, '');
        const logIdToLoad = logs[stateSnapshotIndex].id;
        
        const rollbackSuccess = await loadStateFromLog(logIdToLoad);
        if (!rollbackSuccess) {
            throw new Error('回溯存档状态失败，操作已中止。');
        }
        
        await sendMessage(textToResend);

    } catch (error) {
        console.error("重新发送时出错:", error.message);
        await showCustomAlert(`操作失败: ${error.message}`);
        
        const latestArchive = await db.archives.get(currentArchiveName);
        if(latestArchive) {
            await loadState(latestArchive.data.state);
            loadChatHistory(latestArchive.data.logs, latestArchive);
        }
    } finally {
        sendMessageButton.disabled = false;
        branchingOptionsOverlay.querySelector('.modal').classList.remove('disabled');
    }
});
document.getElementById('ctx-copy-btn').addEventListener('click', () => {
if (!activeLogEntry) return;
let text = activeLogEntry.textContent;
if (activeLogEntry.classList.contains('user')) { text = text.replace(/^> /, ''); }
navigator.clipboard.writeText(text).then(() => showCustomAlert('消息已复制!')).catch(err => { console.error('复制失败:', err); showCustomAlert('复制失败'); });
hideContextMenu();
});

    document.getElementById('ctx-delete-btn').addEventListener('click', async () => {
        if (!activeLogEntry) { hideContextMenu(); return; }
        const logIdToDelete = activeLogEntry.dataset.logId;
        activeLogEntry = null;
        hideContextMenu();
        if (!logIdToDelete) { await showCustomAlert('无法删除此消息：缺少唯一标识。'); return; }
        if (await showCustomConfirm('确定要回溯到这条消息之前吗？\n此消息之后的所有记录都将被删除，此操作不可撤销！')) {
            try {
                const archive = await db.archives.get(currentArchiveName);
                if (!archive) { throw new Error("找不到当前存档。"); }
                const logs = archive.data.logs;
                const logIndexToDelete = logs.findIndex(log => log.id === logIdToDelete);
                if (logIndexToDelete === -1) { throw new Error("在存档中找不到要删除的消息。"); }
                let previousSnapshotIndex = -1;
                for (let i = logIndexToDelete - 1; i >= 0; i--) { if (logs[i].stateSnapshot) { previousSnapshotIndex = i; break; } }
                if (previousSnapshotIndex === -1) { throw new Error("无法回溯：在此消息之前没有找到任何有效的游戏状态快照。"); }
                const logIdToLoad = logs[previousSnapshotIndex].id;
                await loadStateFromLog_retry(logIdToLoad);
                await showCustomAlert('已成功回溯到指定时间点。');
            } catch (e) {
                console.error('后台删除并回溯消息失败:', e);
                await showCustomAlert(`操作失败: ${e.message}`);
            }
        }
    });

window.addEventListener('click', (e) => { if (!messageContextMenu.contains(e.target)) { hideContextMenu(); } });
deleteLogButton.addEventListener('click', async () => {
if (currentViewingArchive && await showCustomConfirm(`确定要永久删除本地存档 "${currentViewingArchive}" 吗？此操作不可撤销。`)) {
await db.archives.delete(currentViewingArchive);
await showCustomAlert(`存档 "${currentViewingArchive}" 已删除。`);
if (currentViewingArchive === currentArchiveName) {
await dbRemove(ACTIVE_ARCHIVE_KEY);
currentArchiveName = null;
}
await initPanel();
toggleCenterView('archive-selection-view');
await renderArchiveSelectionView();
}
});
renameLogButton.addEventListener('click', () => renameArchive(currentViewingArchive));
selectLogButton.addEventListener('click', async () => {
if (currentViewingArchive) {
await selectAndLoadArchive(currentViewingArchive);
}
});
document.getElementById('create-new-archive-btn').addEventListener('click', createNewArchive);
systemSettingsButton.addEventListener('click', () => { systemSettingsOverlay.classList.add('visible'); markFeatureAsSeen('system-settings-button'); });
systemSettingsOverlay.querySelector('.modal-close-btn').addEventListener('click', () => systemSettingsOverlay.classList.remove('visible'));
document.getElementById('open-summary-config-btn').addEventListener('click', () => {
systemSettingsOverlay.classList.remove('visible');
summaryConfigOverlay.classList.add('visible');
});
document.getElementById('back-to-splash-btn').addEventListener('click', async () => {
    if (await showCustomConfirm('确定要返回主页面吗？未保存的进度将会丢失。')) {
        cultivationPanel.classList.add('hidden');
        splashScreen.classList.remove('hidden');
    }
});

document.getElementById('open-regex-settings-btn').addEventListener('click', () => {
systemSettingsOverlay.classList.remove('visible');
renderRegexRulesUI();
renderRegexPresets();
regexSettingsOverlay.classList.add('visible');
});
document.getElementById('open-fun-settings-btn').addEventListener('click', () => {
systemSettingsOverlay.classList.remove('visible');
funSettingsOverlay.classList.add('visible');
});
document.getElementById('open-attribute-alignment-btn').addEventListener('click', () => {
systemSettingsOverlay.classList.remove('visible');
attributeAlignmentOverlay.classList.add('visible');
});

document.getElementById('open-cloud-settings-btn').addEventListener('click', () => {
    systemSettingsOverlay.classList.remove('visible');
    document.getElementById('cloud-storage-settings-overlay').classList.add('visible');
});

attributeAlignmentOverlay.querySelector('.modal-close-btn').addEventListener('click', () => attributeAlignmentOverlay.classList.remove('visible'));
document.getElementById('save-attribute-alignment-btn').addEventListener('click', saveAttributeAlignmentConfig);
document.getElementById('add-alignment-rule-btn').addEventListener('click', () => addAlignmentRule());

funSettingsOverlay.querySelector('.modal-close-btn').addEventListener('click', () => funSettingsOverlay.classList.remove('visible'));
document.getElementById('save-fun-settings-btn').addEventListener('click', saveFunSettings);

summaryConfigOverlay.querySelector('.modal-close-btn').addEventListener('click', () => summaryConfigOverlay.classList.remove('visible'));
document.getElementById('save-summary-config-btn').addEventListener('click', saveSummaryConfig);
document.getElementById('open-manual-summary-btn').addEventListener('click', openManualSummarySelection);
document.getElementById('open-segmented-memory-btn').addEventListener('click', openSegmentedMemorySettings);
segmentedMemoryOverlay.querySelector('.modal-close-btn').addEventListener('click', () => segmentedMemoryOverlay.classList.remove('visible'));
document.getElementById('save-segmented-memory-btn').addEventListener('click', saveSegmentedMemorySettings);
document.getElementById('view-small-summaries-btn').addEventListener('click', () => openSummaryViewer('small'));
document.getElementById('view-large-summaries-btn').addEventListener('click', () => openSummaryViewer('large'));
summaryViewerOverlay.querySelector('.modal-close-btn').addEventListener('click', () => {
summaryViewerOverlay.classList.remove('visible');
segmentedMemoryOverlay.classList.add('visible');
});
summaryEditorOverlay.querySelector('.modal-close-btn').addEventListener('click', () => {
summaryEditorOverlay.classList.remove('visible');
openSummaryViewer(currentEditingSummary.type);
});
document.getElementById('save-summary-editor-btn').addEventListener('click', saveSummaryFromEditor);

manualSegmentedMemoryOverlay.querySelector('.modal-close-btn').addEventListener('click', () => {
manualSegmentedMemoryOverlay.classList.remove('visible');
currentManualSegmentedLogId = null;
});
document.getElementById('save-manual-segmented-memory-btn').addEventListener('click', saveManualSegmentedMemory);

manualSummaryOverlay.querySelector('.modal-close-btn').addEventListener('click', () => manualSummaryOverlay.classList.remove('visible'));
exportArchiveBtn.addEventListener('click', openExportArchiveSelection);
document.getElementById('export-chat-log-btn').addEventListener('click', exportChatLogAsTxt);
exportArchiveCloseBtn.addEventListener('click', () => exportArchiveOverlay.classList.remove('visible'));
importArchiveInput.addEventListener('change', handleArchiveImport);
surroundingCharactersButton.addEventListener('click', () => { openCharactersOverlay(); markFeatureAsSeen('surrounding-characters-button'); });
charactersModalCloseBtn.addEventListener('click', () => surroundingCharactersOverlay.classList.remove('visible'));
backToCharacterListBtn.addEventListener('click', showCharacterListView);
worldEventsButton.addEventListener('click', () => {
renderWorldEvents();
worldEventsOverlay.classList.add('visible');
});
worldEventsOverlay.querySelector('.modal-close-btn').addEventListener('click', () => worldEventsOverlay.classList.remove('visible'));
locationRpgOverlay.querySelector('.modal-close-btn').addEventListener('click', () => locationRpgOverlay.classList.remove('visible'));
summaryLogButton.addEventListener('click', () => { openSummaryLog(); markFeatureAsSeen('summary-log-button'); });
summaryLogOverlay.querySelector('.modal-close-btn').addEventListener('click', () => summaryLogOverlay.classList.remove('visible'));
messageEditorOverlay.querySelector('.modal-close-btn').addEventListener('click', () => messageEditorOverlay.classList.remove('visible'));
document.getElementById('save-message-edit-btn').addEventListener('click', saveMessageEdit);
snapshotBtn.addEventListener('click', () => { openSnapshotManager(); markFeatureAsSeen('snapshot-btn'); });
snapshotOverlay.querySelector('.modal-close-btn').addEventListener('click', () => snapshotOverlay.classList.remove('visible'));
snapshotEditorOverlay.querySelector('.modal-close-btn').addEventListener('click', () => snapshotEditorOverlay.classList.remove('visible'));
document.getElementById('save-snapshot-edit-btn').addEventListener('click', saveSnapshotEdit);

customBirthSelectionOverlay.querySelector('.modal-close-btn').addEventListener('click', () => customBirthSelectionOverlay.classList.remove('visible'));
customRaceSelectionOverlay.querySelector('.modal-close-btn').addEventListener('click', () => customRaceSelectionOverlay.classList.remove('visible'));
customBirthOverlay.querySelector('.modal-close-btn').addEventListener('click', () => customBirthOverlay.classList.remove('visible'));
document.getElementById('save-custom-birth-btn').addEventListener('click', saveCustomBirthFromEditor);
customRaceOverlay.querySelector('.modal-close-btn').addEventListener('click', () => customRaceOverlay.classList.remove('visible'));
document.getElementById('save-custom-race-btn').addEventListener('click', saveCustomRaceFromEditor);

traitDetailOverlay.querySelector('.modal-close-btn').addEventListener('click', () => traitDetailOverlay.classList.remove('visible'));
selectedTraitsOverlay.querySelector('.modal-close-btn').addEventListener('click', () => selectedTraitsOverlay.classList.remove('visible'));
selfSelectTraitOverlay.querySelector('.modal-close-btn').addEventListener('click', () => selfSelectTraitOverlay.classList.remove('visible'));
selfSelectLinggenOverlay.querySelector('.modal-close-btn').addEventListener('click', () => selfSelectLinggenOverlay.classList.remove('visible'));
deedsTimelineOverlay.querySelector('.modal-close-btn').addEventListener('click', () => deedsTimelineOverlay.classList.remove('visible'));
bondedCharacterSelectionOverlay.querySelector('.modal-close-btn').addEventListener('click', () => {
bondedCharacterSelectionOverlay.classList.remove('visible');
renderCreationStep();
});
bondedCharacterEditorOverlay.querySelector('.modal-close-btn').addEventListener('click', () => bondedCharacterEditorOverlay.classList.remove('visible'));
mobileToggleLeft.addEventListener('click', () => cultivationPanel.classList.toggle('left-pane-visible'));
mobileToggleRight.addEventListener('click', () => cultivationPanel.classList.toggle('right-pane-visible'));
mobilePaneOverlay.addEventListener('click', () => {
cultivationPanel.classList.remove('left-pane-visible');
cultivationPanel.classList.remove('right-pane-visible');
});
document.getElementById('reroll-thinking-btn').addEventListener('click', rerollVariableThinking);
document.querySelectorAll('#summary-config-overlay input[name="apiSource"]').forEach(radio => {
radio.addEventListener('change', (e) => {
const isCustom = e.target.value === 'custom';
document.getElementById('custom-api-settings').classList.toggle('hidden', !isCustom);
summaryConfig.apiSource = e.target.value;
});
});
document.getElementById('auto-hide-summarized').addEventListener('change', (e) => {
document.getElementById('context-limit').disabled = e.target.checked;
});
archiveList.addEventListener('change', (e) => {
if (e.target.type === 'checkbox') {
updateDeleteButtonState();
}
});
selectAllArchivesBtn.addEventListener('click', toggleSelectAllArchives);
deleteSelectedArchivesBtn.addEventListener('click', deleteSelectedArchives);
viewTasksBtn.addEventListener('click', openTasksOverlay);
tasksOverlay.querySelector('.modal-close-btn').addEventListener('click', () => tasksOverlay.classList.remove('visible'));
mySpiritBeastsBtn.addEventListener('click', openSpiritBeastsOverlay);
mySkillsBtn.addEventListener('click', openSkillsOverlay);
spiritBeastOverlay.querySelector('.modal-close-btn').addEventListener('click', () => spiritBeastOverlay.classList.remove('visible'));
skillsOverlay.querySelector('.modal-close-btn').addEventListener('click', () => skillsOverlay.classList.remove('visible'));
skillDetailOverlay.querySelector('.modal-close-btn').addEventListener('click', () => skillDetailOverlay.classList.remove('visible'));
document.getElementById('open-chat-background-settings-btn').addEventListener('click', openChatBackgroundSettings);
chatBackgroundSettingsOverlay.querySelector('.modal-close-btn').addEventListener('click', () => {
chatBackgroundSettingsOverlay.classList.remove('visible');
saveChatBackgroundSettings();
});
document.getElementById('save-background-settings-btn').addEventListener('click', () => {
chatBackgroundSettingsOverlay.classList.remove('visible');
saveChatBackgroundSettings();
});
document.getElementById('upload-background-btn').addEventListener('click', () => backgroundUploadInput.click());
backgroundUploadInput.addEventListener('change', handleBackgroundUpload);
document.getElementById('bg-opacity-slider').addEventListener('input', (e) => {
chatBackgroundSettings.opacity = e.target.value;
applyChatBackground();
});
document.getElementById('bg-blur-slider').addEventListener('input', (e) => {
chatBackgroundSettings.blur = e.target.value;
applyChatBackground();
});
document.getElementById('bg-size-select').addEventListener('change', (e) => {
chatBackgroundSettings.size = e.target.value;
applyChatBackground();
});
document.getElementById('ai-gen-background-btn').addEventListener('click', openAIGenInterface);
aiImageGenOverlay.querySelector('.modal-close-btn').addEventListener('click', () => aiImageGenOverlay.classList.remove('visible'));
document.getElementById('ai-gen-start-btn').addEventListener('click', () => handleAIGenRequest(document.getElementById('ai-gen-prompt').value));
document.getElementById('ai-gen-width').addEventListener('input', (e) => {
chatBackgroundSettings.aiGenWidth = parseInt(e.target.value) || 512;
});
document.getElementById('ai-gen-height').addEventListener('input', (e) => {
chatBackgroundSettings.aiGenHeight = parseInt(e.target.value) || 768;
});
document.getElementById('batch-delete-background-btn').addEventListener('click', handleBatchDeleteClick);
document.getElementById('auto-image-gen-toggle').addEventListener('change', (e) => {
chatBackgroundSettings.autoImageGen = e.target.checked;
saveChatBackgroundSettings();
});
document.getElementById('ai-gen-regex-input').addEventListener('change', () => {
chatBackgroundSettings.aiGenRegex = document.getElementById('ai-gen-regex-input').value.trim();
saveChatBackgroundSettings();
});
document.getElementById('open-enhancement-manager-btn').addEventListener('click', openEnhancementManager);
enhancementOverlay.querySelector('.modal-close-btn').addEventListener('click', () => enhancementOverlay.classList.remove('visible'));
document.getElementById('enhancement-main-slot').addEventListener('click', () => openEnhancementPicker('main'));
document.querySelectorAll('.enhancement-slot[id^="enhancement-material-slot"]').forEach(slot => {
slot.addEventListener('click', () => openEnhancementPicker('material', parseInt(slot.dataset.slotIndex)));
});
document.getElementById('start-enhancement-btn').addEventListener('click', startEnhancement);
alchemyOverlay.querySelector('.modal-close-btn').addEventListener('click', () => alchemyOverlay.classList.remove('visible'));
document.querySelectorAll('#alchemy-grid .crafting-slot').forEach(slot => {
slot.addEventListener('click', () => openAlchemyPicker(parseInt(slot.dataset.slotIndex)));
});
document.getElementById('start-alchemy-btn').addEventListener('click', startAlchemy);
refiningOverlay.querySelector('.modal-close-btn').addEventListener('click', () => refiningOverlay.classList.remove('visible'));
document.querySelectorAll('#refining-grid .crafting-slot').forEach(slot => {
slot.addEventListener('click', () => openRefiningPicker(parseInt(slot.dataset.slotIndex)));
});
document.getElementById('start-refining-btn').addEventListener('click', startRefining);
warehouseOverlay.querySelector('.modal-close-btn').addEventListener('click', () => warehouseOverlay.classList.remove('visible'));
warehousePickerOverlay.querySelector('.modal-close-btn').addEventListener('click', () => warehousePickerOverlay.classList.remove('visible'));
achievementButton.addEventListener('click', openAchievementWall);
achievementOverlay.querySelector('.modal-close-btn').addEventListener('click', () => achievementOverlay.classList.remove('visible'));
achievementDetailOverlay.querySelector('.modal-close-btn').addEventListener('click', () => achievementDetailOverlay.classList.remove('visible'));
document.getElementById('custom-achievements-btn').addEventListener('click', openCustomAchievementManager);
customAchievementManagerOverlay.querySelector('.modal-close-btn').addEventListener('click', () => customAchievementManagerOverlay.classList.remove('visible'));
customAchievementEditorOverlay.querySelector('.modal-close-btn').addEventListener('click', () => customAchievementEditorOverlay.classList.remove('visible'));
document.getElementById('save-custom-achievement-btn').addEventListener('click', saveCustomAchievement);
document.getElementById('ca-create-btn').addEventListener('click', () => openCustomAchievementEditor());
document.getElementById('ca-import-btn').addEventListener('click', () => handleImportCustomData(null, '成就', true));
document.getElementById('ca-export-btn').addEventListener('click', () => handleExportCustomData(null, `${currentArchiveName}_achievements.json`, true));
document.getElementById('ca-editor-req-type').addEventListener('change', () => renderAchievementReqDetails());
document.getElementById('ca-editor-reward-type').addEventListener('change', () => renderAchievementRewardDetails());
dinoGameOverlay.addEventListener('click', (e) => {
if (e.target === dinoGameOverlay) {
if (activeDinoGame) {
activeDinoGame.stop();
activeDinoGame = null;
}
dinoGameOverlay.classList.remove('visible');
}
});
document.getElementById('creation-fullscreen-btn').addEventListener('click', toggleFullScreen);
peekBackgroundBtn.addEventListener('mousedown', () => document.body.classList.add('show-background-fully'));
peekBackgroundBtn.addEventListener('mouseup', () => document.body.classList.remove('show-background-fully'));
peekBackgroundBtn.addEventListener('mouseleave', () => document.body.classList.remove('show-background-fully'));
peekBackgroundBtn.addEventListener('touchstart', (e) => { e.preventDefault(); document.body.classList.add('show-background-fully'); }, { passive: false });
peekBackgroundBtn.addEventListener('touchend', () => document.body.classList.remove('show-background-fully'));

let branchBtnLongPressTimer;
let isLongPress = false;

branchToggleBtn.addEventListener('mousedown', (e) => {
if (e.button !== 0) return;
isLongPress = false;
branchBtnLongPressTimer = setTimeout(() => {
isLongPress = true;
openBehaviorInteraction();
}, 500);
});

branchToggleBtn.addEventListener('mouseup', (e) => {
if (e.button !== 0) return;
clearTimeout(branchBtnLongPressTimer);
});
branchToggleBtn.addEventListener('mouseleave', () => {
clearTimeout(branchBtnLongPressTimer);
});

branchToggleBtn.addEventListener('click', (e) => {
if (isLongPress) {
e.preventDefault();
return;
}
const modalContent = branchingOptionsOverlay.querySelector('.modal-content');
if (modalContent.children.length > 0) {
branchingOptionsOverlay.classList.add('visible');
} else {
showDanmaku('当前没有分支选项', 'error');
}
});

branchToggleBtn.addEventListener('touchstart', (e) => {
isLongPress = false;
branchBtnLongPressTimer = setTimeout(() => {
isLongPress = true;
openBehaviorInteraction();
}, 500);
}, { passive: true });

branchToggleBtn.addEventListener('touchend', (e) => {
clearTimeout(branchBtnLongPressTimer);
});
splashIoMenuOverlay.querySelector('.modal-close-btn').addEventListener('click', () => splashIoMenuOverlay.classList.remove('visible'));
document.getElementById('splash-import-archive-btn').addEventListener('click', () => importArchiveInput.click());
document.getElementById('splash-export-archive-btn').addEventListener('click', openExportArchiveSelection);
document.getElementById('splash-import-preset-btn').addEventListener('click', handleImportPreset);
document.getElementById('splash-export-preset-btn').addEventListener('click', handleExportPreset);
document.getElementById('open-workshop-btn').addEventListener('click', openWorkshop);
workshopOverlay.querySelector('.modal-close-btn').addEventListener('click', () => {
workshopOverlay.classList.remove('visible');
if (cultivationPanel.classList.contains('hidden') && creationScreen.classList.contains('hidden')) {
splashScreen.classList.remove('hidden');
}
});
document.getElementById('workshop-upload-btn').addEventListener('click', handleUploadToWorkshop);
    document.getElementById('workshop-sort-select').addEventListener('change', (e) => {
        workshopSortBy = e.target.value;
        workshopPaginationState[workshopCurrentCategory] = 1;
        fetchAndRenderWorkshopPresets();
    });
    document.getElementById('workshop-search-input').addEventListener('change', (e) => {
        workshopSearchTerm = e.target.value.trim();
        workshopPaginationState[workshopCurrentCategory] = 1;
        fetchAndRenderWorkshopPresets();
    });
branchingOptionsOverlay.addEventListener('dragover', (e) => {
e.preventDefault();
branchingOptionsOverlay.classList.add('drop-target-active');
});
branchingOptionsOverlay.addEventListener('dragleave', (e) => {
e.preventDefault();
branchingOptionsOverlay.classList.remove('drop-target-active');
});
branchingOptionsOverlay.addEventListener('drop', (e) => {
e.preventDefault();
branchingOptionsOverlay.classList.remove('drop-target-active');
const cardData = JSON.parse(e.dataTransfer.getData('text/plain'));
showInteractionChoicePanel(cardData);
});
branchingOptionsOverlay.addEventListener('click', (e) => {
if (e.target === branchingOptionsOverlay) {
branchingOptionsOverlay.classList.remove('visible');
}
});

enhancementManagerOverlay.querySelector('.modal-close-btn').addEventListener('click', () => enhancementManagerOverlay.classList.remove('visible'));
document.getElementById('enhancement-manager-item-slot').addEventListener('click', () => openEnhancementManagerPicker('main'));
document.getElementById('enhancement-manager-sacrifice-slot').addEventListener('click', () => openEnhancementManagerPicker('sacrifice'));
document.getElementById('manage-custom-affixes-btn').addEventListener('click', openCustomAffixEditor);
customAffixEditorOverlay.querySelector('.modal-close-btn').addEventListener('click', () => customAffixEditorOverlay.classList.remove('visible'));
document.getElementById('add-custom-affix-btn').addEventListener('click', () => addCustomAffixRow());

document.querySelector('#inventory-section h3').addEventListener('click', sortInventory);

mapSelectionOverlay.querySelector('.modal-close-btn').addEventListener('click', () => mapSelectionOverlay.classList.remove('visible'));
worldMapOverlay.querySelector('.modal-close-btn').addEventListener('click', () => worldMapOverlay.classList.remove('visible'));
worldMapButton.addEventListener('click', openWorldMap);

document.querySelectorAll('.map-zoom-btn').forEach(btn => {
btn.addEventListener('click', (e) => {
const action = e.target.closest('button').dataset.action;
const modal = e.target.closest('.modal');
const renderer = modal.id === 'world-map-modal' ? activeWorldMapRenderer : activeMapRenderer;
if (renderer) {
if (action === 'zoom-in') {
renderer.zoom(1.2);
} else if (action === 'zoom-out') {
renderer.zoom(1 / 1.2);
}
}
});
});

setupRegexSettingsListeners();
document.getElementById('create-regex-preset-btn').addEventListener('click', createRegexPreset);
setupCustomTraitListeners();
setupBondedCharacterListeners();
setupCustomDataManagementListeners();
setupCharacterCreatorListeners();
setupFabListeners();
if (window.eventOn && typeof window.eventOn === 'function') {
    window.eventOn('js_stream_token_received_incrementally', (chunk) => {
        const streamingMessage = document.getElementById('streaming-message');
        if (streamingMessage) {
            const mainArea = document.getElementById('main-content-area');
            
            const isNearBottom = mainArea.scrollHeight - mainArea.scrollTop - mainArea.clientHeight < 200;
            streamingMessage.innerHTML += sanitizeHTML(chunk);
            
            if (isNearBottom) {
                mainArea.scrollTo({ top: mainArea.scrollHeight, behavior: 'smooth' });
            }
        }
    });
}

const scrollToBottomBtn = document.getElementById('scroll-to-bottom-btn');
scrollToBottomBtn.addEventListener('click', () => {
mainContentArea.scrollTo({ top: mainContentArea.scrollHeight, behavior: 'smooth' });
});

mainContentArea.addEventListener('scroll', () => {
const isScrolledUp = mainContentArea.scrollHeight - mainContentArea.scrollTop - mainContentArea.clientHeight > 200;
scrollToBottomBtn.classList.toggle('hidden', !isScrolledUp);
});

    const diffBtn = document.getElementById('variable-diff-btn');
    const diffPopup = document.getElementById('variable-diff-popup');
    diffBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearTimeout(variableDiffHideTimer);
        if (diffPopup.classList.contains('hidden')) {
            displayVariableDiff();
            diffPopup.classList.remove('hidden');
        } else {
            diffPopup.classList.add('hidden');
        }
    });
    document.addEventListener('click', (e) => {
        if (!diffBtn.contains(e.target) && !diffPopup.contains(e.target)) {
            diffPopup.classList.add('hidden');
        }
    });
	
	    const thinkBtn = document.getElementById('thinking-log-btn');
    const thinkPopup = document.getElementById('thinking-log-popup');
    const thinkContent = document.getElementById('thinking-log-content');
    thinkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (thinkPopup.classList.contains('hidden')) {
            if (latestThinkingContent) {
                thinkContent.textContent = latestThinkingContent;
            } else {
                thinkContent.textContent = '暂无思考过程。';
            }
            thinkPopup.classList.remove('hidden');
        } else {
            thinkPopup.classList.add('hidden');
        }
    });
	    document.getElementById('npc-display-settings-btn').addEventListener('click', openNpcDisplaySettingsModal);
    document.querySelector('#npc-display-settings-overlay .modal-close-btn').addEventListener('click', () => {
         document.getElementById('npc-display-settings-overlay').classList.remove('visible');
    });
    document.getElementById('save-npc-display-settings-btn').addEventListener('click', saveNpcDisplaySettings);
    document.addEventListener('click', (e) => {
        if (!thinkBtn.contains(e.target) && !thinkPopup.contains(e.target)) {
            thinkPopup.classList.add('hidden');
        }
    });
document.getElementById('add-custom-field-btn').addEventListener('click', () => {
    addCustomFieldRow({ isEnabled: true });
});


document.getElementById('player-display-settings-btn').addEventListener('click', openPlayerDisplaySettingsModal);
document.getElementById('player-display-settings-overlay').querySelector('.modal-close-btn').addEventListener('click', () => {
    document.getElementById('player-display-settings-overlay').classList.remove('visible');
});
document.getElementById('save-player-display-settings-btn').addEventListener('click', savePlayerDisplaySettings);
document.getElementById('add-player-custom-field-btn').addEventListener('click', () => {
    addPlayerCustomFieldRow({ isEnabled: true });
});


renderActionQueue();
}


async function displayVariableDiff() {
    const popup = document.getElementById('variable-diff-popup');
    popup.innerHTML = '<p>正在分析变量变动...</p>';

    if (!currentArchiveName) {
        popup.innerHTML = '<p>请先加载一个存档。</p>';
        return;
    }

    try {
        const archive = await db.archives.get(currentArchiveName);
        if (!archive || !archive.data.logs) {
            popup.innerHTML = '<p>无法加载存档记录。</p>';
            return;
        }

        let latestLog = null;
        let previousLog = null;
        for (let i = archive.data.logs.length - 1; i >= 0; i--) {
            const log = archive.data.logs[i];
            if (log.type === 'ai' && log.stateSnapshot) {
                if (!latestLog) {
                    latestLog = log;
                } else {
                    previousLog = log;
                    break; 
                }
            }
        }

        if (!latestLog || !previousLog) {
            popup.innerHTML = '<p>快照数据不足，无法进行比较。</p>';
            return;
        }

        const latestState = JSON.parse(latestLog.stateSnapshot);
        const previousState = JSON.parse(previousLog.stateSnapshot);

        // 对比角色B1
        const latestB1 = latestState['0'] ? latestState['0']['B1'] : null;
        const previousB1 = previousState['0'] ? previousState['0']['B1'] : null;
        let characterHtml = '<p>角色B1数据缺失或无变化。</p>';
        if (latestB1 && previousB1) {
            characterHtml = compareCharacterData(previousB1, latestB1);
        }

        // 对比物品栏 (表格 '1')
        const prevInventory = previousState['1'] || {};
        const latestInventory = latestState['1'] || {};
        const inventoryHtml = compareInventory(prevInventory, latestInventory);

        // 【新增】对比技能栏 (表格 '8')
        const prevSkills = previousState['8'] || {};
        const latestSkills = latestState['8'] || {};
        const skillsHtml = compareSkills(prevSkills, latestSkills);
        
        // 合并所有结果进行显示
        popup.innerHTML = `<h5>B1角色状态变动对比</h5>${characterHtml}` + inventoryHtml + skillsHtml;

    } catch (error) {
        console.error("分析变量变动时出错:", error);
        popup.innerHTML = `<p style="color:var(--rarity-负面状态);">分析出错: ${error.message}</p>`;
    }
}


function compareSkills(prevSkills, latestSkills) {
    const changes = [];
    const prevMap = new Map(Object.entries(prevSkills));
    const latestMap = new Map(Object.entries(latestSkills));

    // 检查新增和变更的技能
    latestMap.forEach((latestSkill, id) => {
        const prevSkill = prevMap.get(id);
        const skillName = latestSkill['1'] || '未知技能';

        if (!prevSkill) {
            // 新增技能
            changes.push(`<li><span class="change-add">+ 习得:</span> ${skillName} (等级: ${latestSkill['2'] || '未知'})</li>`);
        } else {
            const subChanges = [];
            const prevLevel = prevSkill['2'] || '未知';
            const latestLevel = latestSkill['2'] || '未知';
            const prevProficiency = prevSkill['7'] || '0/100';
            const latestProficiency = latestSkill['7'] || '0/100';

            if (prevLevel !== latestLevel) {
                subChanges.push(`等级: ${prevLevel} → ${latestLevel}`);
            }
            if (prevProficiency !== latestProficiency) {
                subChanges.push(`熟练度: ${prevProficiency} → ${latestProficiency}`);
            }
            
            if (subChanges.length > 0) {
                 changes.push(`<li><span class="change-modify">~ 变更:</span> ${skillName} (${subChanges.join(', ')})</li>`);
            }
            
            // 从旧Map中删除，以便最后剩下的都是被遗忘的技能
            prevMap.delete(id);
        }
    });

    // 检查被遗忘的技能
    prevMap.forEach((prevSkill, id) => {
        changes.push(`<li><span class="change-remove">- 遗忘:</span> ${prevSkill['1'] || '未知技能'}</li>`);
    });

    if (changes.length === 0) {
        return '<h5>技能栏变动</h5><ul><li>无变化。</li></ul>';
    }

    return `<h5>技能栏变动</h5><ul>${changes.join('')}</ul>`;
}


async function applyVisualUpdates(combinedDelta, initialState) { 
if (combinedDelta && combinedDelta.length > 0) { 
const previousStateForDiff = JSON.parse(JSON.stringify(currentState));
currentState = applyChanges(initialState || currentState, combinedDelta); 
displayVariableDiff(previousStateForDiff, currentState);

const diffPopup = document.getElementById('variable-diff-popup');
diffPopup.classList.remove('hidden');
clearTimeout(variableDiffHideTimer);
variableDiffHideTimer = setTimeout(() => {
diffPopup.classList.add('hidden');
}, 5000);

await applyAttributeAlignment();
}

syncStateFromTables();
await saveCurrentState();

renderPlayerAttributes(currentPlayerData);
renderInventory(inventoryItems);
updateAvatar(currentPlayerData);
checkPlayerDeath();

if (funSettings.autoGenNpcImage) {
const archive = await db.archives.get(currentArchiveName);
const npcAvatars = archive?.data?.state?.npcAvatars || {};

for (const charId in currentState['0']) {
if (charId.startsWith('C') || charId.startsWith('G')) { // 只处理NPC
const charData = currentState['0'][charId];
const imageGenPrompt = charData['19']?.trim();
const uniqueImageKey = `${charId}_${charData['1']?.split('|')[0] || charId}`; // 使用NPC名称作为key的一部分

handleNpcAutoImageGen(charId, imageGenPrompt);
}
}
}
updatedCharacterIds.clear(); // 清空已处理的更新ID
}


function compareInventory(prevInventory, latestInventory) {
    const changes = [];
    const prevMap = new Map(Object.entries(prevInventory));
    const latestMap = new Map(Object.entries(latestInventory));

    // 检查新增和变更的物品
    latestMap.forEach((latestItem, id) => {
        const prevItem = prevMap.get(id);
        if (!prevItem) {
            // 新增物品
            changes.push(`<li><span class="change-add">+ 新增:</span> ${latestItem['1']} (数量: ${latestItem['5'] || 1})</li>`);
        } else {
            // 检查数量变更
            const prevQty = prevItem['5'] || '1';
            const latestQty = latestItem['5'] || '1';
            if (prevQty !== latestQty) {
                changes.push(`<li><span class="change-modify">~ 变更:</span> ${latestItem['1']} (数量: ${prevQty} → ${latestQty})</li>`);
            }
            // 从旧Map中删除，以便最后剩下的都是被移除的物品
            prevMap.delete(id);
        }
    });

    // 检查被移除的物品
    prevMap.forEach((prevItem, id) => {
        changes.push(`<li><span class="change-remove">- 移除:</span> ${prevItem['1']}</li>`);
    });

    if (changes.length === 0) {
        return '<h5>储物袋变动</h5><ul><li>无变化。</li></ul>';
    }

    return `<h5>储物袋变动</h5><ul>${changes.join('')}</ul>`;
}

function compareCharacterData(prevData, latestData) {
    const changes = [];
    
    const findChange = (label, prevVal, latestVal) => {
        const p = String(prevVal || '').trim();
        const l = String(latestVal || '').trim();
        if (p !== l) {
            changes.push(`<li><span class="label">${label}:</span> ${p || '无'} &rarr; ${l || '无'}</li>`);
        }
    };
    
    const [prevRealm, prevIdentity] = (prevData['2'] || '|').split('|');
    const [latestRealm, latestIdentity] = (latestData['2'] || '|').split('|');
    findChange('境界', prevRealm, latestRealm);
    findChange('身份', prevIdentity, latestIdentity);
    findChange('当前状态', prevData['4'], latestData['4']);
    
    const prevRemarks = parseRemarksString(prevData['9']);
    const latestRemarks = parseRemarksString(latestData['9']);
    const remarkKeys = new Set([...Object.keys(prevRemarks), ...Object.keys(latestRemarks)]);
    
    remarkKeys.forEach(key => {
        if (key === 'traits') {
const prevTraitsData = recursivelyParseJsonStrings(prevRemarks.traits || '[]');
const latestTraitsData = recursivelyParseJsonStrings(latestRemarks.traits || '[]');


const ensureArray = (data) => {
if (Array.isArray(data)) {
return data; 
}
if (typeof data === 'object' && data !== null) {
return [data]; 
}
return []; 
};

const prevTraits = ensureArray(prevTraitsData);
const latestTraits = ensureArray(latestTraitsData);


const prevTraitNames = new Set(prevTraits.filter(t => t && t.name).map(t => t.name));
latestTraits.filter(t => t && t.name).forEach(trait => {
if (!prevTraitNames.has(trait.name)) {
changes.push(`<li><span class="change-add">+ 获得气运:</span> <strong>${trait.name}</strong></li>`);
}
});
return;
}
        if (key === 'equipment') {
            const prevEquip = recursivelyParseJsonStrings(prevRemarks.equipment || '{}') || {};
            const latestEquip = recursivelyParseJsonStrings(latestRemarks.equipment || '{}') || {};
            const slotTypeMap = { weapon: '武器', armor: '护甲', technique: '功法', treasure: '法宝' };
            for (const slotKey in slotTypeMap) {
                const prevSlotArray = prevEquip[slotKey] || [];
                const latestSlotArray = latestEquip[slotKey] || [];
                const maxLength = Math.max(prevSlotArray.length, latestSlotArray.length);
                for (let i = 0; i < maxLength; i++) {
                    const prevItem = prevSlotArray[i];
                    const latestItem = latestSlotArray[i];
                    if (!prevItem && latestItem && latestItem.name) {
                        changes.push(`<li><span class="change-add">+ 装备 ${slotTypeMap[slotKey]}:</span> <strong>${latestItem.name}</strong></li>`);
                    } else if (prevItem && !latestItem) {
                        changes.push(`<li><span class="change-remove">- 卸下 ${slotTypeMap[slotKey]}:</span> ${prevItem.name}</li>`);
                    } else if (prevItem && latestItem && prevItem.name !== latestItem.name) {
                         changes.push(`<li><span class="change-modify">~ 更换 ${slotTypeMap[slotKey]}:</span> ${prevItem.name} &rarr; <strong>${latestItem.name}</strong></li>`);
                    }
                }
            }
            return;
        }
        findChange(key.charAt(0).toUpperCase() + key.slice(1), prevRemarks[key], latestRemarks[key]);
    });
    try {
        const prevAttrs = JSON.parse(prevData['11'] || '{}');
        const latestAttrs = JSON.parse(latestData['11'] || '{}');
        const attrKeys = new Set([...Object.keys(prevAttrs), ...Object.keys(latestAttrs)]);
        
        attrKeys.forEach(key => {
            const pa = prevAttrs[key] || { current: 'N/A', max: 'N/A' };
            const la = latestAttrs[key] || { current: 'N/A', max: 'N/A' };
            const prevStr = `${pa.current}/${pa.max}`;
            const latestStr = `${la.current}/${la.max}`;
            findChange(key, prevStr, latestStr);
        });
    } catch (e) {
        changes.push('<li>解析详细属性失败。</li>');
    }
    
    findChange('内心想法', prevData['12'], latestData['12']);
    findChange('人际关系', prevData['13'], latestData['13']);
    findChange('好感度', prevData['15'], latestData['15']);
    const [prevAction, prevAttire] = (prevData['16'] || '|').split('|');
    const [latestAction, latestAttire] = (latestData['16'] || '|').split('|');
    findChange('动作', prevAction, latestAction);
    findChange('穿着', prevAttire, latestAttire);
    
    if (changes.length === 0) {
        return '<ul><li>角色状态无明显变化。</li></ul>';
    }
    return `<ul>${changes.join('')}</ul>`;
}

document.getElementById('open-map-editor-btn').addEventListener('click', openMapEditor);
mapEditorOverlay.querySelectorAll('.map-zoom-btn').forEach(btn => {
btn.addEventListener('click', (e) => {
if (!activeMapEditorRenderer) return;
const action = e.target.closest('button').dataset.action;
if (action === 'zoom-in') {
activeMapEditorRenderer.zoom(1.2);
} else if (action === 'zoom-out') {
activeMapEditorRenderer.zoom(1 / 1.2);
}
});
});
mapEditorOverlay.querySelector('.modal-close-btn').addEventListener('click', () => mapEditorOverlay.classList.remove('visible'));
document.getElementById('map-editor-save-btn').addEventListener('click', async () => {
await saveCurrentState(); // 保存地图修改
mapEditorOverlay.classList.remove('visible');
await showCustomAlert('地图已保存！');
});
document.getElementById('map-editor-import-btn').addEventListener('click', importMapData);
document.getElementById('map-editor-export-btn').addEventListener('click', exportMapData);
document.querySelectorAll('.add-map-item-btn').forEach(btn => {
btn.addEventListener('click', (e) => {
e.stopPropagation();
const type = e.target.dataset.type;
editMapItem(type, null); // null id means creating a new item
});
});
document.getElementById('map-editor-cancel-btn').addEventListener('click', () => {
document.getElementById('map-editor-form-container').classList.add('hidden');
mapEditorState.currentEditingItem = null;
activeMapEditorRenderer.setEditingItem(null);
document.querySelectorAll('.map-item-list li').forEach(li => li.classList.remove('selected'));
});
document.getElementById('map-editor-draw-btn').addEventListener('click', () => {
if (mapEditorState.currentEditingItem) {
activeMapEditorRenderer.tempPoints = []; // 在开始绘制前清空临时点
const type = mapEditorState.currentEditingItem.type;
const mode = type === 'poi' ? 'place_poi' : 'draw_polygon';
activeMapEditorRenderer.setMode(mode);
document.getElementById('map-editor-status').textContent = `模式: ${mode}. 在地图上点击来${mode === 'place_poi' ? '放置点' : '绘制顶点'}. 右键或长按完成。`;
}
});
document.getElementById('map-editor-save-item-btn').addEventListener('click', saveMapItem);
document.getElementById('map-editor-delete-item-btn').addEventListener('click', deleteMapItem);
async function renderRegexPresets() {
const listEl = document.getElementById('regex-presets-list');
listEl.innerHTML = '';
const presets = await dbGet(REGEX_PRESETS_KEY) || [];

if (presets.length === 0) {
listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">暂无预设</p>';
return;
}

presets.forEach((preset, index) => {
const item = document.createElement('div');
item.className = 'regex-rule-item'; // 复用样式
item.innerHTML = `
<span class="rule-name">${preset.name}</span>
<div class="rule-actions">
<button data-index="${index}" class="load-preset-btn" title="加载此预设"><i class="fas fa-check"></i></button>
<button data-index="${index}" class="delete-preset-btn" title="删除此预设"><i class="fas fa-trash"></i></button>
</div>
`;
listEl.appendChild(item);
});

listEl.querySelectorAll('.load-preset-btn').forEach(btn => {
btn.addEventListener('click', async () => {
const index = parseInt(btn.dataset.index);
const allPresets = await dbGet(REGEX_PRESETS_KEY) || [];
const selectedPreset = allPresets[index];
if (selectedPreset) {
regexConfig.rules = selectedPreset.rules;
regexConfig.chainRules = selectedPreset.chainRules;
await dbSet(REGEX_CONFIG_KEY, regexConfig);
renderRegexRulesUI();
await showCustomAlert(`预设 "${selectedPreset.name}" 已加载并保存！`);
}
});
});

listEl.querySelectorAll('.delete-preset-btn').forEach(btn => {
btn.addEventListener('click', async () => {
const index = parseInt(btn.dataset.index);
let allPresets = await dbGet(REGEX_PRESETS_KEY) || [];
const presetToDelete = allPresets[index];
if (presetToDelete && await showCustomConfirm(`确定要删除预设 "${presetToDelete.name}" 吗？`)) {
allPresets.splice(index, 1);
await dbSet(REGEX_PRESETS_KEY, allPresets);
await renderRegexPresets();
}
});
});
}

async function createRegexPreset() {
const name = await showCustomPrompt('请输入预设名称：');
if (!name || !name.trim()) return;

const newPreset = {
name: name.trim(),
rules: JSON.parse(JSON.stringify(regexConfig.rules || [])),
chainRules: JSON.parse(JSON.stringify(regexConfig.chainRules || []))
};

const presets = await dbGet(REGEX_PRESETS_KEY) || [];
const existingIndex = presets.findIndex(p => p.name === newPreset.name);

if (existingIndex > -1) {
if (await showCustomConfirm(`已存在同名预设 "${newPreset.name}"，是否要覆盖？`)) {
presets[existingIndex] = newPreset;
} else {
return;
}
} else {
presets.push(newPreset);
}

await dbSet(REGEX_PRESETS_KEY, presets);
await showCustomAlert('正则预设已保存！');
await renderRegexPresets();
}


async function setupThinkingPresetListeners() {
    const listEl = document.getElementById('thinking-presets-list');
    const importInput = document.getElementById('thinking-presets-import-input');

    if (listEl) {
        listEl.addEventListener('click', async (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const id = button.dataset.id;
            const presetsData = await dbGet(THINKING_PRESETS_KEY);
            if (!presetsData || !presetsData.presets) return;

            if (button.classList.contains('load-thinking-preset-btn')) {
                if (presetsData.activePresetId !== id) {
                    presetsData.activePresetId = id;
                    await dbSet(THINKING_PRESETS_KEY, presetsData);
                    await manageThinkingApiSettings();
                }
            } else if (button.classList.contains('update-thinking-preset-btn')) {
                const presetToUpdate = presetsData.presets.find(p => p.id === id);
                if (presetToUpdate) {
                    if (await showCustomConfirm(`确定要用当前面板的设置覆盖预设 "${presetToUpdate.name}" 吗？此操作不可逆。`)) {
                        presetToUpdate.promptTemplate = document.getElementById('thinking-api-prompt-template').value;
                        const activePreset = presetsData.presets.find(p => p.id === presetsData.activePresetId);
                        if(activePreset && activePreset.id === presetToUpdate.id) {
                            presetToUpdate.worldBooks = activePreset.worldBooks;
                        } else {
                            // If updating non-active, we can't easily get its worldbooks state.
                            // We can choose to not update worldbooks or load it first. For now, we update if active.
                        }
                        await dbSet(THINKING_PRESETS_KEY, presetsData);
                        await showCustomAlert(`预设 "${presetToUpdate.name}" 已更新！`);
                    }
                }
            } else if (button.classList.contains('delete-thinking-preset-btn')) {
                if (presetsData.presets.length <= 1) {
                    await showCustomAlert("无法删除最后一个预设！");
                    return;
                }
                const presetToDelete = presetsData.presets.find(p => p.id === id);
                if (presetToDelete && await showCustomConfirm(`确定要删除预设 "${presetToDelete.name}" 吗？`)) {
                    presetsData.presets = presetsData.presets.filter(p => p.id !== id);
                    if (presetsData.activePresetId === id) {
                        presetsData.activePresetId = presetsData.presets[0]?.id || null;
                    }
                    await dbSet(THINKING_PRESETS_KEY, presetsData);
                    await manageThinkingApiSettings();
                }
            }
        });
    }

    document.getElementById('create-thinking-preset-btn').addEventListener('click', async () => {
        const name = await showCustomPrompt('请输入新预设的名称:');
        if (!name || !name.trim()) return;
        const presetsData = await dbGet(THINKING_PRESETS_KEY);
        if (presetsData.presets.some(p => p.name === name.trim())) {
            await showCustomAlert('错误：已存在同名预设！');
            return;
        }
        const activePreset = presetsData.presets.find(p => p.id === presetsData.activePresetId);
        const newPreset = {
            id: crypto.randomUUID(), name: name.trim(),
            promptTemplate: activePreset ? activePreset.promptTemplate : DEFAULT_VARIABLE_THINKING_WORLDBOOK.content,
            worldBooks: activePreset ? JSON.parse(JSON.stringify(activePreset.worldBooks)) : [DEFAULT_VARIABLE_THINKING_WORLDBOOK]
        };
        presetsData.presets.push(newPreset);
        presetsData.activePresetId = newPreset.id;
        await dbSet(THINKING_PRESETS_KEY, presetsData);
        await manageThinkingApiSettings();
    });

    document.getElementById('import-thinking-presets-btn').addEventListener('click', () => importInput.click());
    importInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const text = await file.text();
        try {
            const importedData = JSON.parse(text);
            const presetsToImport = Array.isArray(importedData) ? importedData : (importedData.presets || []);
            if (!Array.isArray(presetsToImport) || presetsToImport.length === 0) throw new Error("文件中未找到有效的预设数组。");

            const presetsData = await dbGet(THINKING_PRESETS_KEY);
            let addedCount = 0, updatedCount = 0, skippedCount = 0;
            for (const preset of presetsToImport) {
                if (!preset.id || !preset.name) { skippedCount++; continue; }
                const existingPresetIndex = presetsData.presets.findIndex(p => p.id === preset.id);
                if (existingPresetIndex !== -1) {
                    if (await showCustomConfirm(`预设 "${presetsData.presets[existingPresetIndex].name}" 已存在。是否用导入的版本覆盖它？`)) {
                        presetsData.presets[existingPresetIndex] = preset;
                        updatedCount++;
                    } else { skippedCount++; }
                } else {
                    presetsData.presets.push(preset);
                    addedCount++;
                }
            }
            await dbSet(THINKING_PRESETS_KEY, presetsData);
            await manageThinkingApiSettings(); 
            let reportMessage = '导入完成！';
            if (addedCount > 0) reportMessage += `\n新增了 ${addedCount} 个预设。`;
            if (updatedCount > 0) reportMessage += `\n更新了 ${updatedCount} 个预设。`;
            if (skippedCount > 0) reportMessage += `\n跳过了 ${skippedCount} 个预设。`;
            if (addedCount === 0 && updatedCount === 0) { await showCustomAlert('没有新的预设可供导入，它们可能已存在且你选择了不覆盖。'); } 
            else { await showCustomAlert(reportMessage); }
        } catch (err) {
            await showCustomAlert(`导入失败，文件格式不正确或已损坏。\n错误: ${err.message}`);
        } finally { e.target.value = ''; }
    };
    document.getElementById('export-thinking-presets-btn').addEventListener('click', async () => {
        const presetsData = await dbGet(THINKING_PRESETS_KEY);
        if (!presetsData || !presetsData.presets || presetsData.presets.length === 0) { await showCustomAlert("没有可导出的预设。"); return; }
        const activePreset = presetsData.presets.find(p => p.id === presetsData.activePresetId);
        if (!activePreset) { await showCustomAlert("错误：找不到当前激活的预设。"); return; }
        const dataToExport = [activePreset];
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataBlob = new Blob([dataStr], {type: "application/json"});
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `thinking_preset_${activePreset.name}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}


async function saveThinkingApiConfig() {
    // 步骤1: 保存私有的API配置 (这部分逻辑不变)
    thinkingApiConfig.enabled = document.getElementById('thinking-api-enabled-toggle').checked;
    thinkingApiConfig.apiUrl = document.getElementById('thinking-api-url').value.trim();
    thinkingApiConfig.apiKey = document.getElementById('thinking-api-key').value;
    thinkingApiConfig.apiModel = document.getElementById('thinking-api-model').value;
    await dbSet(THINKING_API_CONFIG_KEY, thinkingApiConfig);

    // 步骤2: 【核心修复】保存当前激活预设的规则
    const presetsData = await dbGet(THINKING_PRESETS_KEY);
    const activePresetIndex = presetsData.presets.findIndex(p => p.id === presetsData.activePresetId);
    
    if (activePresetIndex === -1) {
        await showCustomAlert('错误：找不到当前激活的预设，无法保存规则。');
        return;
    }

    // 从UI获取最新的规则数据
    const activePreset = presetsData.presets[activePresetIndex];
    activePreset.promptTemplate = document.getElementById('thinking-api-prompt-template').value;
    activePreset.worldBooks = thinkingApiConfig.worldBooks; // thinkingApiConfig.worldBooks 在编辑世界书时已实时更新

    // 将更新后的预设写回数据库
    await dbSet(THINKING_PRESETS_KEY, presetsData);

    showDanmaku('变量思考配置已保存！', 'success');
    document.getElementById('thinking-api-settings-overlay').classList.remove('visible');
}


function renderThinkingPresetList() {
    const listEl = document.getElementById('thinking-presets-list');
    listEl.innerHTML = '';
    
    if (!thinkingApiConfig.presets || thinkingApiConfig.presets.length === 0) {
        listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">暂无预设</p>';
        return;
    }

    thinkingApiConfig.presets.forEach(preset => {
        const item = document.createElement('div');
        item.className = 'regex-rule-item';
        const isActive = preset.id === thinkingApiConfig.activePresetId;
        
        item.innerHTML = `
            <span class="rule-name" style="font-weight: ${isActive ? 'bold' : 'normal'}; color: ${isActive ? '#ffd700' : 'inherit'}; flex-grow: 1;">
                ${isActive ? '<i class="fas fa-check-circle" style="margin-right: 8px;"></i>' : ''}
                ${preset.name}
            </span>
            <div class="rule-actions">
                <button class="load-thinking-preset-btn" data-id="${preset.id}" title="加载此预设"><i class="fas fa-check"></i></button>
                <button class="delete-thinking-preset-btn" data-id="${preset.id}" title="删除此预设"><i class="fas fa-trash"></i></button>
            </div>
        `;
        listEl.appendChild(item);
    });

    listEl.querySelectorAll('.load-thinking-preset-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            if (thinkingApiConfig.activePresetId !== id) {
                thinkingApiConfig.activePresetId = id;
                await dbSet(THINKING_PRESETS_KEY, thinkingApiConfig);
                loadActiveThinkingPresetToUI();
                renderThinkingPresetList();
            }
        });
    });

    listEl.querySelectorAll('.delete-thinking-preset-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const idToDelete = btn.dataset.id;
            const presetToDelete = thinkingApiConfig.presets.find(p => p.id === idToDelete);
            
            if (presetToDelete && await showCustomConfirm(`确定要删除预设 "${presetToDelete.name}" 吗？`)) {
                thinkingApiConfig.presets = thinkingApiConfig.presets.filter(p => p.id !== idToDelete);
                if (thinkingApiConfig.activePresetId === idToDelete) {
                    thinkingApiConfig.activePresetId = thinkingApiConfig.presets[0]?.id || null;
                }
                await dbSet(THINKING_PRESETS_KEY, thinkingApiConfig);
                renderThinkingPresetList();
                loadActiveThinkingPresetToUI();
            }
        });
    });
}

function loadActiveThinkingPresetToUI() {
    const activePreset = thinkingApiConfig.presets.find(p => p.id === thinkingApiConfig.activePresetId);
    if (!activePreset) {
         console.error("无法加载激活的预设，数据可能已损坏。");
         return;
    }

    document.getElementById('thinking-api-enabled-toggle').checked = activePreset.enabled;
    document.getElementById('thinking-api-url').value = activePreset.apiUrl || '';
    document.getElementById('thinking-api-key').value = activePreset.apiKey || '';
    document.getElementById('thinking-api-prompt-template').value = activePreset.promptTemplate;
    
    const apiModelSelect = document.getElementById('thinking-api-model');
    apiModelSelect.innerHTML = '';
    if (activePreset.apiModel) {
        apiModelSelect.add(new Option(activePreset.apiModel, activePreset.apiModel, true, true));
    } else {
        apiModelSelect.add(new Option('请先获取可用模型', '', true, true));
    }
    
    renderThinkingWorldBooks();
}


async function manageThinkingApiSettings() {
    const THINKING_API_CONFIG_KEY = 'CULTIVATION_THINKING_API_CONFIG_V1';
    const THINKING_PRESETS_KEY = 'CULTIVATION_THINKING_PRESETS_V2';

    const DEFAULT_THINKING_PROMPT_TEMPLATE = `你是一个绝对严谨的游戏世界逻辑裁判。你的核心任务是仔细阅读【思维链参考】、【剧情原文】、【世界书参考资料】和【当前状态快照】，然后根据剧情中发生的事情，在'<upstore>'标签内生成精确的变量操作指令。如果剧情与快照数据有出入，你要主动修正。
【绝对指令与规则】
1.【NPC生成与更新铁则】: 当一个新NPC首次在剧情中被创造、被详细描述，或其境界/实力发生显著变化时，你 必须 检查并确保其具备以下要素：
    *   气运: 任何拥有境界（非“凡人”）的NPC，都必须为其生成至少一个符合其背景和未来潜力的气运词条。高境界或有奇遇的角色应拥有更稀有的气运。
    *   技能: 任何拥有境界（非“凡人”）的NPC，都必须为其生成至少两种符合其身份和境界的技能，例如攻击性或保命性神通。
    *   装备: 至少两件装备。即使是凡人，也必须有如“布衣”、“麻衣”等基础衣物。
    *   储物袋物品: 至少五件符合其身份、背景和当前处境的物品、其中也可能会有NPC情感寄托的物品或是内心秘密或是情欲相关的、清冷仙子也可能有玉势在储物袋。
2.【玩家开局规则】: 在用户首次开局时，你必须主动思考并为其生成符合背景设定的初始装备与储物袋物品。
3.【物品生成来源】: 所有生成的物品，无论是给玩家还是NPC，都必须严格遵从【思维链参考】中提供的逻辑和背景线索。
4.【AI生图提示词规则】: 生成 'AI生图提示词' 时，你必须参考并模仿在'<imageTag>'与'</imageTag>'标签之间展示的思考模式与关键词风格。
5.【角色深度规则】: 你必须为每个角色赋予详细、立体且符合其言行的性格，并根据其性格，联想应有的性经验、性观念、性癖，同时输出一个随机的敏感部位及性器状态。
6.【数据格式规则】: “性别”字段的值只能是“男”或“女”这两个单字，严禁任何其他写法。
你只需要返回最后的'<upstore></upstore>'标签，不需要其他多余的内容。
### 思维链参考
\${thinking_content}
### 变量思考自查
\${table_thinking_content}
###世界书规则文件
\${world_book_context}
快照数据：
\${state_snapshot}
剧情原文如下：
---
\${story_text}
---`;

    const panel = document.getElementById('thinking-api-settings-overlay');
    if (!panel) return;
    
    const loadConfig = async () => {
        const savedConfig = await dbGet(THINKING_API_CONFIG_KEY) || {};
        thinkingApiConfig = {
            enabled: savedConfig.enabled || false,
            apiUrl: savedConfig.apiUrl || '',
            apiKey: savedConfig.apiKey || '',
            apiModel: savedConfig.apiModel || '',
        };

        let presetsData = await dbGet(THINKING_PRESETS_KEY);
        
        if (!presetsData) {
            const oldConfig = await dbGet(THINKING_API_CONFIG_KEY);
            if (oldConfig && oldConfig.promptTemplate) {
                presetsData = {
                    activePresetId: 'default_migrated',
                    presets: [{ 
                        id: 'default_migrated', 
                        name: '默认（由旧版迁移）', 
                        promptTemplate: oldConfig.promptTemplate,
                        worldBooks: oldConfig.worldBooks || [DEFAULT_VARIABLE_THINKING_WORLDBOOK]
                    }]
                };
            } else {
                const defaultPreset = {
                    id: 'default',
                    name: '默认配置',
                    promptTemplate: DEFAULT_THINKING_PROMPT_TEMPLATE,
                    worldBooks: [DEFAULT_VARIABLE_THINKING_WORLDBOOK]
                };
                presetsData = {
                    activePresetId: 'default',
                    presets: [defaultPreset]
                };
            }
            await dbSet(THINKING_PRESETS_KEY, presetsData);
        }
    };
    
    const loadActivePresetToUI = async () => {
        const presetsData = await dbGet(THINKING_PRESETS_KEY);
        const activePreset = presetsData.presets.find(p => p.id === presetsData.activePresetId);
        
        if (activePreset) {
            document.getElementById('thinking-api-prompt-template').value = activePreset.promptTemplate;
            thinkingApiConfig.worldBooks = activePreset.worldBooks; 
            renderThinkingWorldBooks();
        }
    };

    const renderThinkingPresetList = async () => {
        const listEl = document.getElementById('thinking-presets-list');
        const presetsData = await dbGet(THINKING_PRESETS_KEY);
        listEl.innerHTML = '';
        if (!presetsData || !presetsData.presets || presetsData.presets.length === 0) {
            listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">暂无预设</p>';
            return;
        }
        presetsData.presets.forEach(preset => {
            const item = document.createElement('div');
            item.className = 'regex-rule-item';
            const isActive = preset.id === presetsData.activePresetId;
            item.innerHTML = `
                <span class="rule-name" style="flex-grow: 1; font-weight: ${isActive ? 'bold' : 'normal'}; color: ${isActive ? '#ffd700' : 'inherit'};">
                    ${isActive ? '<i class="fas fa-check-circle" style="margin-right: 8px;"></i>' : ''}
                    ${preset.name}
                </span>
                <div class="rule-actions">
                    <button class="load-thinking-preset-btn" data-id="${preset.id}" title="加载此预设"><i class="fas fa-check"></i></button>
                    <!-- 【修复】按钮名称已更正，此部分功能应已在其他函数中实现 -->
                    <button class="update-thinking-preset-btn" data-id="${preset.id}" title="更新此预设"><i class="fas fa-sync-alt"></i></button>
                    <button class="delete-thinking-preset-btn" data-id="${preset.id}" title="删除此预设"><i class="fas fa-trash"></i></button>
                </div>`;
            listEl.appendChild(item);
        });
    };

    await loadConfig();

    document.getElementById('thinking-api-enabled-toggle').checked = thinkingApiConfig.enabled;
    document.getElementById('thinking-api-url').value = thinkingApiConfig.apiUrl;
    document.getElementById('thinking-api-key').value = thinkingApiConfig.apiKey;
    const apiModelSelect = document.getElementById('thinking-api-model');
    apiModelSelect.innerHTML = '';
    if (thinkingApiConfig.apiModel) {
        apiModelSelect.add(new Option(thinkingApiConfig.apiModel, thinkingApiConfig.apiModel, true, true));
    }
    
    await renderThinkingPresetList();
    await loadActivePresetToUI();
    
    if (!thinkingListenersSetup) {
        setupThinkingPresetListeners();
        setupThinkingWorldBookListeners();
        thinkingListenersSetup = true;

        const saveButton = panel.querySelector('#save-thinking-api-settings-btn');
        saveButton.onclick = async () => {
            const presetsData = await dbGet(THINKING_PRESETS_KEY);
            const activePresetIndex = presetsData.presets.findIndex(p => p.id === presetsData.activePresetId);
            
            if (activePresetIndex !== -1) {
                const currentPreset = presetsData.presets[activePresetIndex];
                currentPreset.promptTemplate = document.getElementById('thinking-api-prompt-template').value;
                currentPreset.worldBooks = thinkingApiConfig.worldBooks; 
                await dbSet(THINKING_PRESETS_KEY, presetsData);
            }
            
            thinkingApiConfig.enabled = document.getElementById('thinking-api-enabled-toggle').checked;
            thinkingApiConfig.apiUrl = document.getElementById('thinking-api-url').value.trim();
            thinkingApiConfig.apiKey = document.getElementById('thinking-api-key').value;
            thinkingApiConfig.apiModel = apiModelSelect.value;
            await dbSet(THINKING_API_CONFIG_KEY, thinkingApiConfig);

            showDanmaku('变量思考配置已保存！', 'success');
            panel.classList.remove('visible');
        };

        panel.querySelector('#fetch-thinking-models-btn').addEventListener('click', function() {
            fetchModelsForPanel('thinking-api-url', 'thinking-api-key', 'thinking-api-model', this);
        });

        const restoreDefaultsBtn = document.getElementById('restore-thinking-defaults-btn');
restoreDefaultsBtn.addEventListener('click', async () => {
    if (await showCustomConfirm('确定要恢复默认的指令模板和内置规则吗？当前编辑的内容将被覆盖。')) {
        document.getElementById('thinking-api-prompt-template').value = DEFAULT_THINKING_PROMPT_TEMPLATE;
        
        const presetsData = await dbGet(THINKING_PRESETS_KEY);
        const activePreset = presetsData.presets.find(p => p.id === presetsData.activePresetId);
        if (activePreset) {
            activePreset.worldBooks = [JSON.parse(JSON.stringify(DEFAULT_VARIABLE_THINKING_WORLDBOOK))];
            await dbSet(THINKING_PRESETS_KEY, presetsData); 
            thinkingApiConfig.worldBooks = activePreset.worldBooks;
            renderThinkingWorldBooks();
        }
        showCustomAlert('已恢复为默认设置！请记得点击下方的“保存”按钮以生效。');
    }
});

    }
}

    async function loadSummaryConfig() {
        const defaultConfig = {
            apiUrl: '', apiKey: '', apiModel: 'gpt-3.5-turbo',
            prompt: '请你扮演一个史官，仔细阅读以下修仙世界中的对话和事件，然后用简洁、客观、连贯的语言，将这段历史总结成一段摘要。摘要应聚焦于关键的人物行为、剧情转折和重要信息。',
            autoSummary: false, autoThreshold: 30, apiSource: 'custom',
            segmentedMemoryEnabled: false, segmentedChatLayers: 20, segmentedLargeSummaryStart: 50
        };
        try {
            summaryConfig = await dbGet(SUMMARY_CONFIG_KEY) || defaultConfig;
        } catch (e) {
            summaryConfig = defaultConfig;
        }
        document.getElementById('summary-api-url').value = summaryConfig.apiUrl || '';
        document.getElementById('summary-api-key').value = summaryConfig.apiKey || '';
        document.getElementById('summary-api-model').value = summaryConfig.apiModel || 'gpt-3.5-turbo';
        document.getElementById('summary-prompt').value = summaryConfig.prompt || defaultConfig.prompt;
        document.getElementById('summary-auto-toggle').checked = summaryConfig.autoSummary || false;
        document.getElementById('summary-auto-threshold').value = summaryConfig.autoThreshold || 30;
        
        const apiSource = summaryConfig.apiSource || 'custom';
        document.querySelector(`input[name="apiSource"][value="${apiSource}"]`).checked = true;
        document.getElementById('custom-api-settings').classList.toggle('hidden', apiSource !== 'custom');
        
        document.getElementById('segmented-memory-enabled-toggle').checked = summaryConfig.segmentedMemoryEnabled || false;
        document.getElementById('segmented-chat-layers').value = summaryConfig.segmentedChatLayers || 20;
        document.getElementById('segmented-large-summary-start').value = summaryConfig.segmentedLargeSummaryStart || 50;
    }

    async function saveSummaryConfig() {
        summaryConfig.apiUrl = document.getElementById('summary-api-url').value.trim();
        summaryConfig.apiKey = document.getElementById('summary-api-key').value;
        summaryConfig.apiModel = document.getElementById('summary-api-model').value.trim();
        summaryConfig.prompt = document.getElementById('summary-prompt').value;
        summaryConfig.autoSummary = document.getElementById('summary-auto-toggle').checked;
        summaryConfig.autoThreshold = parseInt(document.getElementById('summary-auto-threshold').value) || 30;
        summaryConfig.apiSource = document.querySelector('input[name="apiSource"]:checked').value;

        try {
            await dbSet(SUMMARY_CONFIG_KEY, summaryConfig);
            await showCustomAlert('总结设置已保存！');
            summaryConfigOverlay.classList.remove('visible');
        } catch (e) {
            await showCustomAlert('保存失败，数据库操作出错。');
            console.error('保存总结设置失败:', e);
        }
    }
    
    async function callParentApiForSummary(params) {
if (window.parent && window.parent.TavernHelper && typeof window.parent.TavernHelper.generate === 'function') {
const tavernGenerateFunc = window.parent.TavernHelper.generate;
try {
const finalAiResponse = await tavernGenerateFunc(params);
return (finalAiResponse || "").trim();
} catch (e) {
console.error("TavernHelper.generate call for summary error:", e);
throw new Error('父窗口AI生成失败。');
}
} else {
throw new Error('父窗口AI(TavernHelper)未找到。');
}
}
    async function callSummaryApi(textToSummarize) {
const thinkingMessage = addMessageToLog({ content: '正在请求天机进行总结...' }, 'system');
try {
const finalInstruction = `\n\n当前请暂停剧情扮演，进入总结模式，以上是需要总结的内容，（${summaryConfig.prompt}）`;
const fullContentForApi = textToSummarize + finalInstruction;

let summaryResult;
if (summaryConfig.apiSource === 'parent') {
const params = { user_input: fullContentForApi, should_stream: false, disable_extras: true };
summaryResult = await callParentApiForSummary(params); 
} else {
const { apiUrl, apiKey, apiModel } = summaryConfig;
if (!apiUrl || !apiModel) {
throw new Error('自定义API配置不完整，无法总结。');
}
const response = await fetch(apiUrl.endsWith('/chat/completions') ? apiUrl : `${apiUrl}/chat/completions`, {
method: 'POST',
headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
body: JSON.stringify({
model: apiModel,
// 【核心修改】将所有内容合并到一条 user 消息中，确保提示词在最后
messages: [{ role: 'user', content: fullContentForApi }]
})
});
if (!response.ok) {
const errorData = await response.json();
throw new Error(`API 请求失败 (${response.status}): ${errorData.error.message}`);
}
const data = await response.json();
summaryResult = data.choices[0].message.content;
}
if (thinkingMessage && thinkingMessage.parentNode) {
mainContentArea.removeChild(thinkingMessage);
}
return summaryResult;
} catch (error) {
if (thinkingMessage && thinkingMessage.parentNode) {
mainContentArea.removeChild(thinkingMessage);
}
await showCustomAlert(`总结失败: ${error.message}`);
console.error('总结API调用失败:', error);
return null;
}
}
    
    function findNextSummaryStartIndex(logs) {
        let lastSummaryIndex = -1;
        for (let i = 0; i < logs.length; i++) {
            if (logs[i].content.startsWith('[天道总结:')) {
                lastSummaryIndex = i;
            }
        }
        return lastSummaryIndex + 1;
    }

    async function runAutoSummaryCheck() {
        if (!summaryConfig.autoSummary || !currentArchiveName) return;
        
        const archive = await db.archives.get(currentArchiveName);
        const logs = archive.data.logs || [];
        const startIndex = findNextSummaryStartIndex(logs);
        const unsummarizedCount = logs.length - startIndex;

        if (unsummarizedCount >= summaryConfig.autoThreshold) {
            addMessageToLog({ content: `检测到 ${unsummarizedCount} 条未总结消息，已达到阈值 ${summaryConfig.autoThreshold}，开始自动总结...` }, 'system');
            await executeSummary(currentArchiveName, summaryConfig.autoThreshold);
        }
    }

    async function openManualSummarySelection() {
        const listEl = document.getElementById('manual-summary-list');
        const controlsEl = document.getElementById('manual-summary-controls');
        listEl.innerHTML = '';
        controlsEl.classList.add('hidden');
        
        const archives = await db.archives.toArray();
        archives.forEach(archive => {
            const logs = archive.data.logs || [];
            const startIndex = findNextSummaryStartIndex(logs);
            const unsummarizedCount = logs.length - startIndex;

            const item = document.createElement('div');
            item.className = 'manual-summary-item';
            item.dataset.archiveName = archive.name;
            item.innerHTML = `
                <span>${archive.name}</span>
                <div class="manual-summary-details">
                    <span>总层数: ${logs.length}</span>
                    <span class="manual-summary-unsummarized">未总结: ${unsummarizedCount}</span>
                </div>
            `;
            item.addEventListener('click', () => {
                listEl.querySelectorAll('.manual-summary-item').forEach(el => el.classList.remove('selected'));
                item.classList.add('selected');
                document.getElementById('manual-summary-target-title').textContent = `为 "${archive.name}" 进行总结`;
                document.getElementById('manual-summary-count').max = unsummarizedCount;
                document.getElementById('manual-summary-count').value = Math.min(unsummarizedCount, 50);
                controlsEl.classList.remove('hidden');
            });
            listEl.appendChild(item);
        });

        document.getElementById('start-manual-summary-btn').onclick = async () => {
            const selectedItem = listEl.querySelector('.selected');
            if (!selectedItem) {
                await showCustomAlert('请先选择一个存档。');
                return;
            }
            const archiveName = selectedItem.dataset.archiveName;
            const count = parseInt(document.getElementById('manual-summary-count').value);
            if (!count || count <= 0) {
                await showCustomAlert('请输入有效的总结层数。');
                return;
            }
            manualSummaryOverlay.classList.remove('visible');
            await executeSummary(archiveName, count, true);
        };

        summaryConfigOverlay.classList.remove('visible');
        manualSummaryOverlay.classList.add('visible');
    }

    async function executeSummary(archiveName, count, isManual = false) {
let archive = await db.archives.get(archiveName);
let logs = archive.data.logs || [];
const startIndex = findNextSummaryStartIndex(logs);

const logsToSummarize = logs.slice(startIndex, startIndex + count);

if (logsToSummarize.length === 0) {
if (isManual) await showCustomAlert('没有可供总结的新消息。');
return;
}

const textToSummarize = logsToSummarize.map(log => log.content).join('\n---\n');
const instruction = `当前请暂停剧情扮演，进入总结模式，根据以上内容进行总结，你的总结要求是：（${summaryConfig.prompt}）`;

const summaryResult = await sendMessage(instruction, {
isSummary: true,
summaryContent: textToSummarize
});

if (summaryResult) {
const summaryLog = {
id: crypto.randomUUID(),
timestamp: new Date().toISOString(),
content: `[天道总结: ${startIndex + 1}-${startIndex + logsToSummarize.length}层]\n${summaryResult}`
};

logs.splice(startIndex + logsToSummarize.length, 0, summaryLog);
archive.data.logs = logs;
await db.archives.put(archive);

if (archiveName === currentArchiveName) {
loadChatHistory(archive.data.logs, archive);
}

if (isManual) {
await showCustomAlert(`总结完成！`);
} else {
addMessageToLog({ content: '后台自动总结完成。' }, 'system');
}
}
}
    
    async function createNewArchive() {
        const name = await showCustomPrompt("请输入新存档的名称:", "");
        if (name) {
            const existing = await db.archives.get(name);
            if (existing) {
                await showCustomAlert("该名称的存档已存在！");
                return;
            }
            const newArchiveData = {
logs: [{
id: crypto.randomUUID(),
timestamp: new Date().toISOString(),
content: "新的故事篇章已开启..."
}],
state: {
currentState: getInitialTableState(),
bondedCharacters: {},
rpgMaps: {},
achievements: { completed: [], custom: [] },
npcAvatars: {},
worldMap: JSON.parse(JSON.stringify(DEFAULT_WORLD_MAP_DATA))
}
};
            const newArchive = { name, data: newArchiveData };
            await db.archives.add(newArchive);
            await selectAndLoadArchive(name);
        }
    }

    async function renameArchive(oldName) {
        if (!oldName) return;
        const newName = await showCustomPrompt("请输入新的存档名称:", oldName);
        if (newName && newName !== oldName) {
            const existingNew = await db.archives.get(newName);
            if (existingNew) {
                await showCustomAlert("该名称的存档已存在！");
                return;
            }
            
            const oldArchive = await db.archives.get(oldName);
            if (oldArchive) {
                await db.archives.delete(oldName);
                oldArchive.name = newName;
                await db.archives.add(oldArchive);
            }

            if (currentArchiveName === oldName) {
                currentArchiveName = newName;
                await dbSet(ACTIVE_ARCHIVE_KEY, newName);
            }
            await showCustomAlert("存档已重命名！");
            toggleCenterView('archive-selection-view');
            await renderArchiveSelectionView();
        }
    }

    async function loadRegexConfig() {
const defaultConfig = {
fontSize: 1.05,
fontColor: '#f5f5dc',
chatFont: "'Noto Serif SC', serif",
renderLimit: 100,
contextLimit: 0,
autoHideSummarized: false,
fixedHideRange: '',
enableStreaming: false,
rules: [],
chainRules: []
};
try {
regexConfig = await dbGet(REGEX_CONFIG_KEY) || defaultConfig;
if (!regexConfig.chainRules) regexConfig.chainRules = [];
} catch (e) {
regexConfig = defaultConfig;
}

document.documentElement.style.setProperty('--ai-font-size', `${regexConfig.fontSize}em`);
document.documentElement.style.setProperty('--ai-font-color', regexConfig.fontColor);
document.documentElement.style.setProperty('--chat-font-family', regexConfig.chatFont);

document.getElementById('content-font-size').value = regexConfig.fontSize;
document.getElementById('content-font-color').value = regexConfig.fontColor;

const fontSelect = document.getElementById('chat-font-family');
fontSelect.innerHTML = '';
for(const fontName in FONT_MAP) {
const option = document.createElement('option');
option.value = FONT_MAP[fontName];
option.textContent = fontName;
fontSelect.appendChild(option);
}
fontSelect.value = regexConfig.chatFont;

document.getElementById('content-render-limit').value = regexConfig.renderLimit;
document.getElementById('context-limit').value = regexConfig.contextLimit || '';
document.getElementById('auto-hide-summarized').checked = regexConfig.autoHideSummarized;
document.getElementById('fixed-hide-range').value = regexConfig.fixedHideRange || '';
document.getElementById('enable-streaming-toggle').checked = regexConfig.enableStreaming;
document.getElementById('context-limit').disabled = regexConfig.autoHideSummarized;
}

    async function saveRegexConfig() {
regexConfig.fontSize = document.getElementById('content-font-size').value;
regexConfig.fontColor = document.getElementById('content-font-color').value;
regexConfig.chatFont = document.getElementById('chat-font-family').value;
regexConfig.renderLimit = parseInt(document.getElementById('content-render-limit').value) || 100;
regexConfig.contextLimit = parseInt(document.getElementById('context-limit').value) || 0;
regexConfig.autoHideSummarized = document.getElementById('auto-hide-summarized').checked;
regexConfig.fixedHideRange = document.getElementById('fixed-hide-range').value.trim();
regexConfig.enableStreaming = document.getElementById('enable-streaming-toggle').checked;
try {
await dbSet(REGEX_CONFIG_KEY, regexConfig);
await showCustomAlert('正则与上下文设置已保存！');
regexSettingsOverlay.classList.remove('visible');

document.documentElement.style.setProperty('--chat-font-family', regexConfig.chatFont);

const archive = await db.archives.get(currentArchiveName);
if (archive) {
loadChatHistory(archive.data.logs);
}
} catch (e) {
await showCustomAlert('保存失败，数据库操作出错。');
console.error('保存正则设置失败:', e);
}
}
    function renderRegexRulesUI() {
        const renderList = (listEl, rules, type) => {
            listEl.innerHTML = '';
            if (!rules || !Array.isArray(rules)) return;
            rules.forEach((rule, index) => {
                const item = document.createElement('div');
                item.className = 'regex-rule-item';
                item.innerHTML = `
                    <input type="checkbox" data-index="${index}" data-type="${type}" ${!rule.disabled ? 'checked' : ''} title="启用/禁用">
                    <span class="rule-name">${rule.scriptName}</span>
                    <div class="rule-actions">
                        <button class="edit-regex-btn" data-index="${index}" data-type="${type}" title="编辑"><i class="fas fa-edit"></i></button>
                        <button class="delete-regex-btn" data-index="${index}" data-type="${type}" title="删除"><i class="fas fa-trash"></i></button>
                        <button class="move-regex-up-btn" data-index="${index}" data-type="${type}" title="上移" ${index === 0 ? 'disabled' : ''}><i class="fas fa-arrow-up"></i></button>
                        <button class="move-regex-down-btn" data-index="${index}" data-type="${type}" title="下移" ${index === rules.length - 1 ? 'disabled' : ''}><i class="fas fa-arrow-down"></i></button>
                    </div>
                `;
                listEl.appendChild(item);
            });
        };
        renderList(document.getElementById('regex-rules-list'), regexConfig.rules, 'regular');
        renderList(document.getElementById('chain-regex-rules-list'), regexConfig.chainRules, 'chain');
    }
    
    function openRegexEditor(index, type) {
        currentEditingRegexIndex = index;
        currentEditingRegexType = type;
        const rules = type === 'chain' ? (regexConfig.chainRules || []) : (regexConfig.rules || []);
        const rule = (index === -1) ? {} : rules[index];

        document.getElementById('regex-editor-title').textContent = (index === -1) ? `新增${type === 'chain' ? '思维链' : '常规'}规则` : `编辑规则`;
        document.getElementById('regex-editor-name').value = rule.scriptName || '';
        document.getElementById('regex-editor-find').value = rule.findRegex || '//g';
        document.getElementById('regex-editor-replace').value = rule.replaceString || '';
        document.getElementById('regex-editor-disabled').checked = rule.disabled || false;
        document.getElementById('regex-editor-run-on-edit').checked = rule.runOnEdit || false;
        document.getElementById('regex-editor-markdown').checked = rule.markdownOnly || false;
        document.getElementById('regex-editor-prompt').checked = rule.promptOnly || false;
        document.getElementById('regex-editor-min-depth').value = rule.minDepth ?? '';
        document.getElementById('regex-editor-max-depth').value = rule.maxDepth ?? '';
        
        const subSelect = document.getElementById('regex-editor-substitute');
        subSelect.innerHTML = '<option value="0">不替换</option>'; // Reset
        subSelect.value = rule.substituteRegex || 0;
        
        const placements = rule.placement || [];
        document.querySelectorAll('#regex-editor-overlay [data-placement]').forEach(cb => {
            cb.checked = placements.includes(parseInt(cb.dataset.placement));
        });
        
        regexEditorOverlay.classList.add('visible');
    }

    async function saveRegexRuleFromEditor() {
        const name = document.getElementById('regex-editor-name').value;
        const find = document.getElementById('regex-editor-find').value;
        const replace = document.getElementById('regex-editor-replace').value;

        if (!name || !find) {
            await showCustomAlert('规则名称和查找正则不能为空！');
            return;
        }
        
        const placements = [];
        document.querySelectorAll('#regex-editor-overlay [data-placement]:checked').forEach(cb => {
            placements.push(parseInt(cb.dataset.placement));
        });

        const rules = currentEditingRegexType === 'chain' ? (regexConfig.chainRules || []) : (regexConfig.rules || []);

        const ruleData = {
            id: (currentEditingRegexIndex === -1) ? crypto.randomUUID() : rules[currentEditingRegexIndex].id,
            scriptName: name,
            findRegex: find,
            replaceString: replace,
            disabled: document.getElementById('regex-editor-disabled').checked,
            runOnEdit: document.getElementById('regex-editor-run-on-edit').checked,
            markdownOnly: document.getElementById('regex-editor-markdown').checked,
            promptOnly: document.getElementById('regex-editor-prompt').checked,
            placement: placements,
            minDepth: document.getElementById('regex-editor-min-depth').value ? parseInt(document.getElementById('regex-editor-min-depth').value) : null,
            maxDepth: document.getElementById('regex-editor-max-depth').value ? parseInt(document.getElementById('regex-editor-max-depth').value) : null,
            substituteRegex: parseInt(document.getElementById('regex-editor-substitute').value),
            trimStrings: []
        };

        if (currentEditingRegexIndex === -1) { 
            rules.push(ruleData);
        } else { 
            rules[currentEditingRegexIndex] = ruleData;
        }

        if (currentEditingRegexType === 'chain') {
            regexConfig.chainRules = rules;
        } else {
            regexConfig.rules = rules;
        }

        renderRegexRulesUI();
        regexEditorOverlay.classList.remove('visible');
    }

    async function exportChatLogAsTxt() {
const selectedCheckboxes = archiveList.querySelectorAll('input[type="checkbox"]:checked');
if (selectedCheckboxes.length !== 1) {
await showCustomAlert('请选择一个且仅一个存档进行导出。');
return;
}
const archiveName = selectedCheckboxes[0].dataset.archiveName;

try {
const archive = await db.archives.get(archiveName);
if (!archive || !archive.data.logs) {
await showCustomAlert('无法加载存档数据。');
return;
}

const separator = '\n\n\n';
const tempEl = document.createElement('textarea');

const textContent = archive.data.logs.map(log => {
// 移除HTML标签
tempEl.innerHTML = log.content.replace(/<br\s*\/?>/gi, '\n');
return tempEl.value;
}).join(separator);

const dataBlob = new Blob([textContent], {type: "text/plain;charset=utf-8"});
const url = URL.createObjectURL(dataBlob);
const a = document.createElement('a');
a.href = url;
a.download = `${archiveName}_chatlog.txt`;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);

} catch (error) {
console.error("导出纯文本失败:", error);
await showCustomAlert(`导出失败: ${error.message}`);
}
}

    async function openExportArchiveSelection() {
        const archives = await db.archives.toArray();
        exportArchiveList.innerHTML = '';
        if (archives.length === 0) {
            exportArchiveList.innerHTML = '<p style="text-align:center; opacity:0.7;">没有可导出的存档</p>';
        } else {
            archives.forEach(archive => {
                const item = document.createElement('div');
                item.className = 'manual-summary-item';
                item.textContent = archive.name;
                item.onclick = () => exportSingleArchive(archive.name);
                exportArchiveList.appendChild(item);
            });
        }
        exportArchiveOverlay.classList.add('visible');
    }

    async function exportSingleArchive(archiveName) {
        const archiveData = await db.archives.get(archiveName);
        if (!archiveData) {
            await showCustomAlert('错误：找不到要导出的存档。');
            return;
        }
        
        const exportObject = {
            archiveName: archiveName,
            data: archiveData.data
        };

        const dataStr = JSON.stringify(exportObject, null, 2);
        const dataBlob = new Blob([dataStr], {type: "application/json"});
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${archiveName}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        exportArchiveOverlay.classList.remove('visible');
    }

async function exportWorldData() {
    if (!currentArchiveName) {
        await showCustomAlert('错误：没有活动的存档，无法导出世界。');
        return;
    }

    try {
        const archive = await db.archives.get(currentArchiveName);
        if (!archive || !archive.data.logs) {
            await showCustomAlert('错误：无法加载存档日志。');
            return;
        }

        const memoryLogs = [];
        let latestSnapshotLog = null;

        // 遍历所有日志，收集全部记忆并找到最新的快照
        archive.data.logs.forEach(log => {
            // 收集所有包含小总结或大总结的日志
            if (log.smallSummary || log.largeSummary) {
                memoryLogs.push({
                    id: log.id,
                    timestamp: log.timestamp,
                    smallSummary: log.smallSummary || '',
                    largeSummary: log.largeSummary || '',
                    // 为方便在JSON中阅读，添加内容预览
                    content_preview: (log.content && !log.content.startsWith('[天道总结:') && !log.content.includes('<h4>天道初启</h4>')) 
                        ? (log.content.replace(/<[^>]*>/g, '').substring(0, 50) + '...')
                        : '[系统或总结消息]'
                });
            }

            // 寻找时间上最新的快照
            if (log.stateSnapshot) {
                if (!latestSnapshotLog || new Date(log.timestamp) > new Date(latestSnapshotLog.timestamp)) {
                    latestSnapshotLog = {
                        id: log.id,
                        timestamp: log.timestamp,
                        stateSnapshot: log.stateSnapshot
                    };
                }
            }
        });

        if (!latestSnapshotLog) {
            await showCustomAlert('导出失败：当前存档没有可用的快照数据。');
            return;
        }

        const exportObject = {
            dataType: 'CultivationWorldFile_v2', // 新的数据类型标识
            version: '2.0',
            exportedFrom: currentArchiveName,
            exportDate: new Date().toISOString(),
            snapshotData: latestSnapshotLog, // 最新的快照数据
            memoryLogs: memoryLogs           // 所有的记忆日志
        };

        const dataStr = JSON.stringify(exportObject, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `world_data_${currentArchiveName}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error("导出世界数据失败:", error);
        await showCustomAlert(`导出失败: ${error.message}`);
    }
}


function importWorldData() {
    genericImportInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                if (importedData.dataType !== 'CultivationWorldFile_v2' || !importedData.snapshotData || !importedData.memoryLogs) {
                    throw new Error('文件格式不正确，不是有效的世界数据文件(v2)。');
                }

                const newArchiveName = await showCustomPrompt(
                    `即将根据 “${importedData.exportedFrom}” 的世界数据创建一个全新的存档，请输入新世界的名称：`, 
                    `源于-${importedData.exportedFrom}`
                );
                if (!newArchiveName) return; // 用户取消

                const existing = await db.archives.get(newArchiveName);
                if (existing) {
                    await showCustomAlert("该名称的存档已存在，请换一个名称。");
                    return;
                }
                
                const snapshot = importedData.snapshotData;
                const memories = importedData.memoryLogs;
                const initialTableState = JSON.parse(snapshot.stateSnapshot);

                // 为导入的所有记忆创建“幽灵”日志条目，作为背景历史
                const ghostRecords = memories.map((mem, index) => ({
                    id: mem.id || `ghost_${mem.timestamp}_${index}`,
                    timestamp: mem.timestamp,
                    type: 'system',
                    content: `[背景记忆]`, // 幽灵记录的简单内容
                    isGhost: true,
                    smallSummary: mem.smallSummary || '',
                    largeSummary: mem.largeSummary || ''
                }));
                
                // 创建新世界的“开篇语”
                const openingMonologue = `
                    <div class="log-entry summary">
                        <h4>世界起源</h4>
                        <p>此方天地并非从混沌初开，而是承载了一段来自“<strong>${importedData.exportedFrom}</strong>”世界的记忆剪影。</p>
                        <p>你继承了这份记忆与因果，新的故事将从这一刻的快照开始...</p>
                    </div>
                `;

                // 这个开篇语日志将携带初始状态快照
                const firstLogEntry = {
                    id: crypto.randomUUID(),
                    timestamp: new Date(new Date(snapshot.timestamp).getTime() + 1).toISOString(), // 确保时间在快照之后
                    content: openingMonologue.trim(),
                    stateSnapshot: snapshot.stateSnapshot,
                    isGhost: false
                };
                
                // 组合所有初始日志，并按时间排序
                const initialLogs = [...ghostRecords, firstLogEntry]
                    .sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));

                const newArchive = {
                    name: newArchiveName,
                    data: {
                        logs: initialLogs,
                        state: {
                            currentState: initialTableState,
                            bondedCharacters: {}, // 新世界从零开始
                            rpgMaps: {},
                            achievements: { completed: [], custom: [] },
                            npcAvatars: {},
                            worldMap: JSON.parse(JSON.stringify(DEFAULT_WORLD_MAP_DATA)),
                            hasImportedMemories: true // 标记为已导入，上下文处理会识别
                        }
                    }
                };

                await db.archives.add(newArchive);
                await showCustomAlert(`新世界 “${newArchiveName}” 已成功创建！即将载入...`);

                // 自动加载新存档并切换到游戏界面
                await selectAndLoadArchive(newArchiveName);
                if (cultivationPanel.classList.contains('hidden')) {
                     splashScreen.classList.add('hidden');
                     cultivationPanel.classList.remove('hidden');
                }

            } catch (err) {
                await showCustomAlert(`导入失败: ${err.message}`);
            } finally {
                genericImportInput.value = ''; // 清空选择，以便下次导入
            }
        };
        reader.readAsText(file);
    };
    genericImportInput.click();
}



    function handleArchiveImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const importedObject = JSON.parse(e.target.result);
                if (!importedObject.archiveName || !importedObject.data || !importedObject.data.logs || !importedObject.data.state) {
                    throw new Error('导入的文件格式无效或已损坏。');
                }
                
                const { archiveName, data } = importedObject;
                
                const existing = await db.archives.get(archiveName);
                if (existing) {
                    if (!await showCustomConfirm(`名为 "${archiveName}" 的存档已存在。要覆盖它吗？`)) {
                        event.target.value = '';
                        return;
                    }
                }
                
                await db.archives.put({ name: archiveName, data: data });
                await showCustomAlert(`存档 "${archiveName}" 已成功导入！`);
                
                if(splashScreen.classList.contains('hidden')) {
                    await renderArchiveSelectionView();
                } else {
                    await initPanel();
                }

            } catch (err) {
                await showCustomAlert(`导入失败: ${err.message}`);
            } finally {
                event.target.value = '';
            }
        };
        reader.readAsText(file);
    }
    
    function openCharactersOverlay() {
        const btn = document.getElementById('surrounding-characters-button');
        const dot = btn.querySelector('.red-dot');
        if (dot) dot.remove();

        renderCharacterList();
        showCharacterListView();
        surroundingCharactersOverlay.classList.add('visible');
    }

    function renderCharacterList() {
        characterListContainer.innerHTML = '';
        
        const sortedCharacters = [...surroundingCharacters].sort((a, b) => {
            if (a.isBonded && !b.isBonded) return -1;
            if (!a.isBonded && b.isBonded) return 1;
            return 0;
        });

        if (sortedCharacters.length === 0) {
            characterListContainer.innerHTML = '<p style="text-align:center; opacity:0.7;">周围没有其他人物。</p>';
            return;
        }
sortedCharacters.forEach(char => {
const item = document.createElement('div');
item.className = 'character-list-item';
if (char.isBonded) {
item.classList.add('bonded-character');
}
const genderClass = char.gender === '男' ? 'char-name-male' : (char.gender === '女' ? 'char-name-female' : '');

const showRedDot = updatedCharacterIds.has(char.id);

item.innerHTML = `
<span class="name ${genderClass}">${char.name}</span>
<span class="gender">${char.gender}</span>
<span class="favor">好感: ${char.favorability}</span>
${showRedDot ? '<span class="red-dot"></span>' : ''} 
`;
item.addEventListener('click', () => {
showCharacterDetailPanel(char, item);
characterListView.classList.add('hidden');
characterDetailView.classList.remove('hidden');
});
characterListContainer.appendChild(item);
});
    }

async function showCharacterDetailPanel(char, listItemElement) {
currentEditingNpcId = char.id;
if (listItemElement) {
const dot = listItemElement.querySelector('.red-dot');
if (dot) dot.remove();
updatedCharacterIds.delete(char.id);
}

const genderClass = char.gender === '男' ? 'char-name-male' : (char.gender === '女' ? 'char-name-female' : '');

const eroticValueHtml = npcDisplaySettings.showEroticValue
? `<span>情欲值: ${char.eroticValue || '0'}</span> |`
: '';
const pleasureValueHtml = npcDisplaySettings.showPleasureValue
? `<span>快感值: ${char.pleasureValue || '0'}</span>`
: '';

let sexualStatsHtml = '';
if (eroticValueHtml || pleasureValueHtml) {
sexualStatsHtml = `<div class="char-detail-meta">${eroticValueHtml} ${pleasureValueHtml}</div>`;
if(eroticValueHtml && !pleasureValueHtml) {
sexualStatsHtml = `<div class="char-detail-meta">${eroticValueHtml.slice(0, -1)}</div>`;
}
}

const skillsTabHtml = npcDisplaySettings.showSkillsTab ? `<div class="char-detail-tab" data-tab="skills">技能</div>` : '';
const traitsTabHtml = npcDisplaySettings.showTraitsTab ? `<div class="char-detail-tab" data-tab="traits">气运</div>` : '';
const skillsPaneHtml = npcDisplaySettings.showSkillsTab ? `<div id="char-tab-skills" class="char-detail-tab-pane hidden"></div>` : '';
const traitsPaneHtml = npcDisplaySettings.showTraitsTab ? `<div id="char-tab-traits" class="char-detail-tab-pane hidden"></div>` : '';

characterDetailPanel.innerHTML = `
<div class="char-detail-top">
<div id="char-detail-avatar-container" class="char-detail-avatar-container">
<img id="char-detail-avatar-img" class="hidden" src="">
<div id="char-detail-avatar-placeholder"><i class="fas fa-user-secret"></i></div>
<button id="char-detail-avatar-delete-btn" class="hidden"><i class="fas fa-times"></i></button>
</div>
<div class="char-detail-info-container">
<div class="char-detail-name ${genderClass}">${char.name}</div>
<div class="char-detail-meta">
<span>${char.gender}</span> | <span>${char.realm}</span> | <span>${char.identity || '未知'}</span>
</div>
<div>好感度: ${char.favorability}</div>
<div class="char-detail-favor-bar">
<div class="char-detail-favor-fill"
style="width: ${Math.min(100, Math.abs(parseInt(char.favorability)) / 2)}% 
; background: ${parseInt(char.favorability) < 0 ? 'linear-gradient(to right, #B0B0B0, #E0E0E0)' : 'linear-gradient(to right, #f48fb1, #ff8a80)'};"> 
</div>
</div>
<div class="char-detail-meta">
<span>年龄: ${char.age}</span> | <span>寿元: ${char.shouyuan}</span>
</div>
${sexualStatsHtml}
<div class="char-detail-meta">
<span>位置: ${char.location || '未知'}</span>
</div>
</div>
</div>
<div class="char-detail-bottom">
<div class="char-detail-status-display">
<i class="fas fa-info-circle"></i>
<span>当前状态: ${char.status || '一切正常'}</span>
</div>
<div id="npc-avatar-actions-container" style="display: flex; gap: 10px; margin-bottom: 15px;">
<button id="change-npc-avatar-btn" class="major-action-button" style="flex: 1;"><i class="fas fa-image"></i> 更换形象</button>
<button id="generate-npc-avatar-btn" class="major-action-button" style="flex: 1;"><i class="fas fa-paint-brush"></i> AI生图</button>
</div>
<div class="char-detail-tabs">
<div class="char-detail-tab active" data-tab="bio">生平</div>
<div class="char-detail-tab" data-tab="secrets">秘闻</div>
<div class="char-detail-tab" data-tab="attributes">属性</div>
<div class="char-detail-tab" data-tab="relations">关系</div>
<div class="char-detail-tab" data-tab="equipment">装备</div>
<div class="char-detail-tab" data-tab="inventory">储物袋</div>
${skillsTabHtml}
${traitsTabHtml}
</div>
<div class="char-detail-tab-content">
<div id="char-tab-bio" class="char-detail-tab-pane active"></div>
<div id="char-tab-secrets" class="char-detail-tab-pane hidden"></div>
<div id="char-tab-attributes" class="char-detail-tab-pane hidden"></div>
<div id="char-tab-relations" class="char-detail-tab-pane hidden"></div>
<div id="char-tab-equipment" class="char-detail-tab-pane hidden"></div>
<div id="char-tab-inventory" class="char-detail-tab-pane hidden"></div>
${skillsPaneHtml}
${traitsPaneHtml}
</div>
<div class="char-detail-actions">
<button id="toggle-bond-btn" class="major-action-button">${char.isBonded ? '<i class="fas fa-heart-broken"></i> 取消羁绊' : '<i class="fas fa-heart"></i> 标记为羁绊'}</button>
<button id="view-deeds-btn" class="major-action-button" ${!char.isBonded ? 'style="display:none;"' : ''}><i class="fas fa-scroll"></i> 查看事迹</button>
<button id="char-interact-communicate" class="major-action-button"><i class="fas fa-comments"></i> 交流</button>
<button id="char-interact-gift" class="major-action-button"><i class="fas fa-gift"></i> 赠礼</button>
<button id="char-interact-spar" class="major-action-button"><i class="fas fa-fist-raised"></i> 切磋</button>
<button id="char-interact-accompany" class="major-action-button"><i class="fas fa-walking"></i> 同行</button>
<button id="char-interact-cultivate" class="major-action-button"><i class="fas fa-yin-yang"></i> 双修</button>
<button id="delete-character-btn" class="major-action-button" style="border-color: #e57373; color: #e57373;"><i class="fas fa-trash-alt"></i> 删除人物</button>
</div>
</div>
`;


const bioPane = document.getElementById('char-tab-bio');
bioPane.innerHTML = `
<div class="char-detail-section"><h5><i class="fas fa-eye"></i> 见闻</h5>
<p><span class="label">性格:</span> ${char.personality || '未知'}</p>
<p><span class="label">身段:</span> ${char.figure || '未知'}</p>
<p><span class="label">样貌:</span> ${char.appearance || '未知'}</p>
<p><span class="label">穿着:</span> ${char.attire || '未知'}</p>
<p><span class="label">动作:</span> ${char.action || '无'}</span></p>
</div>
<div class="char-detail-section">
<h5><i class="fas fa-brain"></i> 内心想法</h5>
<div class="motive-container">
<p class="motive-text">${char.motive || '无'}</p>
<div class="motive-overlay">
<i class="fas fa-eye-slash" style="margin-right: 8px;"></i> 点击查看
</div>
</div>
</div>
<div class="char-detail-section"><h5><i class="fas fa-scroll"></i> 背景</h5><p>${char.background || '无'}</p></div>
`;

const motiveContainer = bioPane.querySelector('.motive-container');
if (motiveContainer) {
motiveContainer.addEventListener('click', () => {
motiveContainer.classList.add('revealed');
}, { once: true });
}

renderCharDetailTab('secrets', char);
renderCharDetailTab('attributes', char);
renderCharDetailTab('relations', char);
renderCharDetailTab('equipment', char);
renderCharDetailTab('inventory', char);
if(npcDisplaySettings.showSkillsTab) renderCharDetailTab('skills', char);
if(npcDisplaySettings.showTraitsTab) renderCharDetailTab('traits', char);

characterDetailPanel.querySelectorAll('.char-detail-tab').forEach(tab => {
tab.addEventListener('click', () => {
characterDetailPanel.querySelectorAll('.char-detail-tab').forEach(t => t.classList.remove('active'));
characterDetailPanel.querySelectorAll('.char-detail-tab-pane').forEach(p => p.classList.add('hidden'));
tab.classList.add('active');
document.getElementById(`char-tab-${tab.dataset.tab}`).classList.remove('hidden');

if (tab.dataset.tab === 'bio') {
document.getElementById('char-tab-bio').classList.remove('hidden');
}
});
});

const deleteAvatarBtn = document.getElementById('char-detail-avatar-delete-btn');
const charDetailAvatarContainer = document.getElementById('char-detail-avatar-container');
charDetailAvatarContainer.style.cursor = 'pointer'; 

charDetailAvatarContainer.onclick = () => {
const avatarImgSrc = document.getElementById('char-detail-avatar-img').src;
if (avatarImgSrc && !document.getElementById('char-detail-avatar-img').classList.contains('hidden')) {
document.getElementById('npc-avatar-fullscreen-img').src = avatarImgSrc;
document.getElementById('npc-avatar-fullscreen-overlay').classList.add('visible');
}
};
await updateNpcAvatar(char.id);

document.getElementById('change-npc-avatar-btn').addEventListener('click', () => npcAvatarUploadInput.click());
document.getElementById('generate-npc-avatar-btn').addEventListener('click', () => openNpcImageGenModal(char));

deleteAvatarBtn.addEventListener('click', async (e) => {
e.stopPropagation();
if (await showCustomConfirm('确定要删除此人物的形象吗？')) {
const archive = await db.archives.get(currentArchiveName);
if (archive.data.state.npcAvatars) {
const uniqueImageKey = `${char.id}_${char.name}`;
if (archive.data.state.npcAvatars[uniqueImageKey]) {
delete archive.data.state.npcAvatars[uniqueImageKey];
await db.archives.put(archive);
await updateNpcAvatar(char.id); // Re-render the avatar section
}
}
}
});

const bondBtn = characterDetailPanel.querySelector('#toggle-bond-btn');
bondBtn.addEventListener('click', () => {
const charInDb = characterDatabase[char.id];
if(charInDb) {
charInDb.isBonded = !charInDb.isBonded;
if (charInDb.isBonded) {
bondedCharacters[charInDb.id] = charInDb;
} else {
delete bondedCharacters[charInDb.id];
}
saveCurrentState();
showCharacterDetailPanel(charInDb, listItemElement);
}
});

characterDetailPanel.querySelector('#view-deeds-btn')?.addEventListener('click', () => showDeedsTimeline(char));
characterDetailPanel.querySelector('#delete-character-btn').addEventListener('click', async () => {
if (await showCustomConfirm(`确定要永久删除人物 "${char.name}" 吗？此操作不可逆。`)) {
delete characterDatabase[char.id];
delete currentState['0'][char.id];
if (bondedCharacters[char.id]) delete bondedCharacters[char.id];
await saveCurrentState();
syncStateFromTables();
showCharacterListView();
}
});
characterDetailPanel.querySelector('#char-interact-communicate').addEventListener('click', async () => {
const message = await showCustomPrompt(`你想对${char.name}说些什么？`);
if(message) {
addAction('communicate', message, { charName: char.name });
surroundingCharactersOverlay.classList.remove('visible');
}
});
characterDetailPanel.querySelector('#char-interact-gift').addEventListener('click', () => openGiftPicker(char));
characterDetailPanel.querySelector('#char-interact-spar').addEventListener('click', () => { addAction('spar', null, { charName: char.name }); surroundingCharactersOverlay.classList.remove('visible'); });
characterDetailPanel.querySelector('#char-interact-accompany').addEventListener('click', () => { addAction('accompany', null, { charName: char.name }); surroundingCharactersOverlay.classList.remove('visible'); });
characterDetailPanel.querySelector('#char-interact-cultivate').addEventListener('click', () => { addAction('cultivate', null, { charName: char.name }); surroundingCharactersOverlay.classList.remove('visible'); });
}

    function renderNpcTraits(char) {
        const grid = document.getElementById('npc-traits-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        const traits = char.npcTraits || [];

        if (traits.length === 0) {
            grid.closest('.detail-section').style.display = 'none';
            return;
        }

        grid.closest('.detail-section').style.display = 'block';

        traits.forEach(trait => {
            const rarityClass = CREATION_CONFIG.TRAIT_RARITIES[trait.rarity] ? `rarity-${trait.rarity}` : 'rarity-普通';
            const slot = document.createElement('div');
            slot.className = `item-slot ${rarityClass}`;
            slot.innerHTML = `<span class="item-slot-name">${trait.name}</span>`;
            slot.addEventListener('click', () => showTraitDetail(trait));
            grid.appendChild(slot);
        });
    }

function renderCharDetailTab(tabName, char) {
    const pane = document.getElementById(`char-tab-${tabName}`);
    if (!pane) return; 
    pane.innerHTML = '';

    switch(tabName) {
        case 'bio':
            pane.innerHTML = `
                <div class="char-detail-section"><h5><i class="fas fa-eye"></i> 见闻</h5>
                    <p><span class="label">性格:</span> ${char.personality || '未知'}</p>
                    <p><span class="label">身段:</span> ${char.figure || '未知'}</p>
                    <p><span class="label">样貌:</span> ${char.appearance || '未知'}</p>
                    <p><span class="label">穿着:</span> ${char.attire || '未知'}</p>
                    <p><span class="label">动作:</span> ${char.action || '无'}</span></p>
                    <p><span class="label">内心想法:</span> ${char.motive || '无'}</p>
                </div>
                <div class="char-detail-section"><h5><i class="fas fa-scroll"></i> 背景</h5><p>${char.background || '无'}</p></div>
            `;
            break;
        case 'secrets':
            let secretsHtml = `<div class="char-detail-section">
                <p><span class="label">灵根:</span> ${char.linggen || '未知'}</p>
                <p><span class="label">特殊体质:</span> ${char.specialConstitution || '无'}</p>
                <p><span class="label">对你的称呼:</span> ${char.appellation || '道友'}</p>`;
            
            if (npcDisplaySettings.showSexExperience) {
                secretsHtml += `<p><span class="label">性经验:</span> ${char.sexExperience || '未知'}</p>`;
            }
            if (npcDisplaySettings.showSexualConception) {
                secretsHtml += `<p><span class="label">性观念:</span> ${char.sexualConception || '未知'}</p>`;
            }
            if (npcDisplaySettings.showPublicKink) {
                secretsHtml += `<p><span class="label">表性癖:</span> ${char.publicKink || '未知'}</p>`;
            }
            if (npcDisplaySettings.showPrivateKink) {
                secretsHtml += `<p><span class="label">里性癖:</span> ${char.privateKink || '未知'}</p>`;
            }
            if (npcDisplaySettings.showSensitiveParts) {
                secretsHtml += `<p><span class="label">敏感部位:</span> ${char.sensitiveParts || '未知'}</p>`;
            }
            if (npcDisplaySettings.showGenitalStatus) {
                secretsHtml += `<p><span class="label">性器状态:</span> ${char.genitalStatus || '未知'}</p>`;
            }
            secretsHtml += `</div>`;
            
            if (npcDisplaySettings.customFields && npcDisplaySettings.customFields.length > 0) {
                let customFieldsHtml = '';
                const rawCharData = currentState['0'][char.id];
                npcDisplaySettings.customFields.forEach(field => {
                    if (field.isEnabled && field.label && field.variableName) {
                        const value = rawCharData ? rawCharData[field.variableName] : undefined;
                        const displayValue = (value !== undefined && value !== null && value !== '') ? value : '未知';
                        customFieldsHtml += `<p><span class="label">${field.label}:</span> ${displayValue}</p>`;
                    }
                });
                if (customFieldsHtml) {
                    secretsHtml += `<div class="char-detail-section"><h5><i class="fas fa-wrench"></i> 自定义</h5>${customFieldsHtml}</div>`;
                }
            }

            pane.innerHTML = secretsHtml;
            break;
        case 'attributes':
            const grid = document.createElement('div');
            grid.className = 'char-detail-attributes-grid';
            const attributes = char.detailedAttributes || {};
            if (Object.keys(attributes).length === 0) {
                grid.innerHTML = '<p>属性未知</p>';
            } else {
                for (const key in attributes) {
                    const attr = attributes[key];
                    const item = document.createElement('div');
                    item.className = 'char-detail-attr-item';
                    item.innerHTML = `<span>${key}</span><span>${attr.current}/${attr.max}</span>`;
                    grid.appendChild(item);
                }
            }
            pane.appendChild(grid);
            break;
        case 'relations':
            let playerRelation = '无';
            let otherRelationsHTML = '<li>无</li>';
            if (char.rawRelations) {
                const parts = char.rawRelations.split(';').filter(p => p.trim());
                const otherRelations = [];
                parts.forEach(part => {
                    const [targetId, ...descParts] = part.split(':');
                    const desc = descParts.join(':').trim();
                    if (targetId && desc) {
                        if (targetId.trim() === 'B1') {
                            playerRelation = desc;
                        } else {
                            const relatedChar = characterDatabase[targetId.trim()];
                            otherRelations.push(`<li>与 <strong>${relatedChar ? relatedChar.name : '未知人物'}</strong>: ${desc}</li>`);
                        }
                    }
                });
                if (otherRelations.length > 0) {
                    otherRelationsHTML = otherRelations.join('');
                }
            }
            pane.innerHTML = `
                <div class="char-detail-section"><h5><i class="fas fa-user-friends"></i> 与玩家</h5><p>${playerRelation}</p></div>
                <div class="char-detail-section"><h5><i class="fas fa-users"></i> 与他人</h5><ul>${otherRelationsHTML}</ul></div>
            `;
            break;
        case 'equipment':
            const equipmentSlots = ['weapon', 'armor', 'technique', 'treasure'];
            const slotNames = { 'weapon': '武器', 'armor': '护甲', 'technique': '功法', 'treasure': '法宝' };

            equipmentSlots.forEach(slotKey => {
                const section = document.createElement('div');
                section.className = 'char-detail-section';
                section.innerHTML = `<h5><i class="${itemIconMap[slotNames[slotKey]]}"></i> ${slotNames[slotKey]}</h5>`;
                const eqGrid = document.createElement('div');
                eqGrid.className = 'char-detail-equipment-grid';

                const items = char[slotKey] || Array(6).fill(null);
                items.forEach(item => {
                    const slot = document.createElement('div');
                    slot.className = 'item-slot';
                    if (item && item.id && item.name) {
                        slot.classList.add('equipped');
                        slot.innerHTML = `<i class="fas ${itemIconMap[item.type] || 'fa-question-circle'} item-slot-icon"></i><span class="item-slot-name">${item.name}</span>`;
                        slot.addEventListener('click', () => {
                            const playerShenshi = currentPlayerData.detailedAttributes['神识']?.current || 0;
                            const npcShenshi = char.detailedAttributes['神识']?.current || 0;
                            if (playerShenshi > npcShenshi || parseInt(char.favorability) > 50) {
                                showItemDetail(item, { isNpcItem: true });
                            } else {
                                showCustomAlert('神识或好感不足，无法看清对方虚实。');
                            }
                        });
                    }
                    eqGrid.appendChild(slot);
                });
                section.appendChild(eqGrid);
                pane.appendChild(section);
            });
            break;
        case 'inventory':
            const invGrid = document.createElement('div');
            invGrid.className = 'char-detail-equipment-grid';
            const npcItems = char.inventoryItems || [];
            if (npcItems.length === 0) {
                invGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; opacity: 0.7;">储物袋空空如也...</p>';
            } else {
                npcItems.forEach(item => {
                    const slot = document.createElement('div');
                    slot.className = 'inventory-slot';
                    slot.innerHTML = `<i class="fas ${itemIconMap[item.type] || 'fa-question-circle'} inventory-slot-icon"></i><span class="inventory-slot-name">${item.name}</span><span class="inventory-slot-quantity">${item.quantity}</span>`;
                    slot.addEventListener('click', () => {
                        const playerShenshi = currentPlayerData.detailedAttributes['神识']?.current || 0;
                        const npcShenshi = char.detailedAttributes['神识']?.current || 0;
                        if (playerShenshi > npcShenshi || parseInt(char.favorability) > 50) {
                            showItemDetail(item, { isNpcItem: true });
                        } else {
                            showCustomAlert('神识或好感不足，无法看清对方虚实。');
                        }
                    });
                    invGrid.appendChild(slot);
                });
            }
            pane.appendChild(invGrid);
            break;
        case 'skills':
            const skillsGrid = document.createElement('div');
            skillsGrid.className = 'npc-skills-grid';
            const npcSkills = char.skills || [];
            if (npcSkills.length === 0) {
                skillsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; opacity: 0.7;">此人尚未习得任何技能。</p>';
            } else {
                npcSkills.forEach(skill => {
                    const card = document.createElement('div');
                    card.className = 'skill-card-item';
                    const level = skill['2'] || '未知';
                    const levelColor = LEVEL_COLORS[level] || LEVEL_COLORS.default;
                    card.innerHTML = `
                        <div class="skill-name">${skill['1']}</div>
                        <div class="skill-level" style="background-color:${levelColor};">${level}</div>
                    `;
                    card.addEventListener('click', () => {
                        const playerShenshi = currentPlayerData.detailedAttributes['神识']?.current || 0;
                        const npcShenshi = char.detailedAttributes['神识']?.current || 0;
                        if (playerShenshi > npcShenshi || parseInt(char.favorability) > 50) {
                           showSkillDetail(skill);
                        } else {
                           showCustomAlert('神识或好感不足，无法看清对方虚实。');
                        }
                    });
                    skillsGrid.appendChild(card);
                });
            }
            pane.appendChild(skillsGrid);
            break;
        case 'traits':
            const traitsGrid = document.createElement('div');
            traitsGrid.className = 'grid-container';
            traitsGrid.id = 'player-traits-grid';
            const npcTraits = char.npcTraits || [];
             if (npcTraits.length === 0) {
                traitsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; opacity: 0.7;">此人平平无奇，暂无特殊气运。</div>';
            } else {
                 npcTraits.forEach(trait => {
                    const rarityClass = CREATION_CONFIG.TRAIT_RARITIES[trait.rarity] ? `rarity-${trait.rarity}` : 'rarity-普通';
                    const slot = document.createElement('div');
                    slot.className = `item-slot ${rarityClass}`;
                    slot.innerHTML = `<span class="item-slot-name">${trait.name}</span>`;
                    slot.addEventListener('click', () => showTraitDetail(trait));
                    traitsGrid.appendChild(slot);
                });
            }
            pane.appendChild(traitsGrid);
            break;
    }
}

async function updateNpcAvatar(npcId) {
    const imgEl = document.getElementById('char-detail-avatar-img');
    const placeholderEl = document.getElementById('char-detail-avatar-placeholder');
    const deleteBtn = document.getElementById('char-detail-avatar-delete-btn');
    
    const character = characterDatabase[npcId];
    if (!character) {
        console.error(`updateNpcAvatar 错误: 找不到ID为 ${npcId} 的角色数据。`);
        imgEl.classList.add('hidden');
        placeholderEl.classList.remove('hidden');
        deleteBtn.classList.add('hidden');
        return;
    }

    const uniqueImageKey = `${npcId}_${character.name}`;
    
    const archive = await db.archives.get(currentArchiveName);
    const npcAvatars = archive?.data?.state?.npcAvatars || {};
    const avatarData = npcAvatars[uniqueImageKey];

    if (avatarData) {
        imgEl.src = avatarData;
        imgEl.classList.remove('hidden');
        placeholderEl.classList.add('hidden');
        deleteBtn.classList.remove('hidden');
    } else {
        imgEl.src = '';
        imgEl.classList.add('hidden');
        placeholderEl.classList.remove('hidden');
        deleteBtn.classList.add('hidden');
    }
}

    
async function handleAvatarUpload(event, type) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const base64String = e.target.result;
        
        if (type === 'player') {
if (creationScreen.classList.contains('hidden')) {
await dbSet(`${CUSTOM_AVATAR_KEY}_${currentArchiveName}`, base64String);
await updateAvatar(currentPlayerData);
characterDetailOverlay.classList.remove('visible');
} else {
creationState.customAvatar = base64String;

await dbSet('CULTIVATION_LAST_PRESET_AVATAR_V1', base64String);
showCustomAlert("自定义形象已设置！");
}
} else if (type === 'npc' && currentEditingNpcId) {
            try {
                const archive = await db.archives.get(currentArchiveName);
                if (!archive) {
                    await showCustomAlert("错误：找不到当前存档来保存头像。");
                    return;
                }
                if (!archive.data) archive.data = {};
                if (!archive.data.state) archive.data.state = {};
                if (!archive.data.state.npcAvatars) archive.data.state.npcAvatars = {};
                
                const character = characterDatabase[currentEditingNpcId];
                if (!character) {
                    await showCustomAlert("错误：找不到对应的NPC数据。");
                    return;
                }
                const uniqueImageKey = `${currentEditingNpcId}_${character.name}`;

                archive.data.state.npcAvatars[uniqueImageKey] = base64String;
                await db.archives.put(archive);
                
                await updateNpcAvatar(currentEditingNpcId);
                
                showDanmaku(`已为 ${character.name} 更换形象！`, 'success');

            } catch (error) {
                console.error('保存NPC头像失败:', error);
                await showCustomAlert(`保存头像失败: ${error.message}`);
            }
        }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

    function openGiftPicker(char) {
        surroundingCharactersOverlay.classList.remove('visible');
        
        pickerTitle.textContent = `选择要赠送给 ${char.name} 的物品`;
        pickerGrid.innerHTML = '';

        const giftableItems = inventoryItems.filter(item => item.type !== '重要物品');
        
        if (giftableItems.length === 0) {
            pickerGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; opacity: 0.7;">储物袋中没有可赠送的物品。</p>`;
        } else {
            giftableItems.forEach(item => {
                const slot = document.createElement('div');
                slot.className = 'inventory-slot';
                slot.title = `${item.name}\n类型: ${item.type}\n描述: ${item.description}\n效果: ${item.effect}`;
                const iconClass = itemIconMap[item.type] || itemIconMap['默认'];
                slot.innerHTML = `<i class="fas ${iconClass} inventory-slot-icon"></i><span class="inventory-slot-name">${item.name}</span><span class="inventory-slot-quantity">${item.quantity}</span>`;
                slot.addEventListener('click', () => {
                    addAction('gift', item, { charName: char.name });
                    
                    const itemInState = currentState['1'][item.id];
                    if (itemInState) {
                        const currentQuantity = parseInt(itemInState['5']);
                        if (currentQuantity > 1) {
                            itemInState['5'] = (currentQuantity - 1).toString();
                        } else {
                            delete currentState['1'][item.id];
                        }
                    }
                    
                    saveCurrentState();
                    syncStateFromTables();
                    renderInventory(inventoryItems);
                    
                    closeEquipmentPicker();
                });
                pickerGrid.appendChild(slot);
            });
        }
        pickerOverlay.classList.add('visible');
    }
    
    function showDeedsTimeline(char) {
        const timelineModal = document.getElementById('deeds-timeline-overlay');
        const titleEl = document.getElementById('deeds-timeline-title');
        const listEl = document.getElementById('deeds-timeline-list');
        
        titleEl.textContent = `${char.name}的事迹`;
        listEl.innerHTML = '';

        const deeds = char.deeds ? char.deeds.split(';').filter(d => d.trim()) : [];

        if (deeds.length === 0) {
            listEl.innerHTML = '<li>暂无相关事迹记录。</li>';
        } else {
            deeds.forEach(deed => {
                const parts = deed.split(':');
                const time = parts.length > 1 ? parts[0] : '未知时间';
                const text = parts.length > 1 ? parts.slice(1).join(':') : deed;
                
                const li = document.createElement('li');
                li.className = 'deed-item';
                li.innerHTML = `<span class="deed-time">${time}</span><span class="deed-text">${text}</span>`;
                listEl.appendChild(li);
            });
        }

        timelineModal.classList.add('visible');
    }

    function renderWorldEvents() {
        const listEl = document.getElementById('world-events-list');
        listEl.innerHTML = '';
        const events = (currentState['5'] || []).slice().reverse();

        if (events.length === 0) {
            listEl.innerHTML = '<li>天地安宁，暂无大事发生。</li>';
        } else {
            events.forEach(event => {
                const li = document.createElement('li');
                li.className = 'world-event-item';
                li.innerHTML = `
                    <div style="flex-grow: 1;">
                        <span class="event-time">${event['0']}</span>
                        <p class="event-text">${event['2']}</p>
                        <small class="event-location">地点: ${event['1']}</small>
                    </div>
                    <button class="item-delete-btn" data-id="${event.id}"><i class="fas fa-trash-alt"></i></button>
                `;
                li.querySelector('.item-delete-btn').addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const eventId = e.currentTarget.dataset.id;
                    if (await showCustomConfirm('确定要删除这条世界大事吗？')) {
                        currentState['5'] = currentState['5'].filter(ev => ev.id !== eventId);
                        await saveCurrentState();
                        syncStateFromTables();
                        renderWorldEvents();
                    }
                });
                listEl.appendChild(li);
            });
        }
    }

    function showCharacterListView() {
        renderCharacterList();
        characterListView.classList.remove('hidden');
        characterDetailView.classList.add('hidden');
    }

    async function showRpgLocationDetail(mainLocation) {
        document.getElementById('rpg-location-title').textContent = `${mainLocation.name} / ${currentPlayerData.detailedLocation}`;
        const mapGrid = document.getElementById('rpg-map-grid');
        mapGrid.innerHTML = '';
        
        const archive = await db.archives.get(currentArchiveName);
        if (!archive.data.state.rpgMaps) {
            archive.data.state.rpgMaps = {};
        }

        let currentMapData = archive.data.state.rpgMaps[mainLocation.name];
        
        const allKnownSubLocations = new Set();
        surroundingCharacters.forEach(char => {
            if (char.location && char.location.startsWith(mainLocation.name) && char.location !== mainLocation.name) {
                allKnownSubLocations.add(char.location.substring(mainLocation.name.length));
            }
        });
        if (currentPlayerData.detailedLocation && currentPlayerData.detailedLocation !== '未知') {
            allKnownSubLocations.add(currentPlayerData.detailedLocation);
        }

        if (!currentMapData) {
            currentMapData = generateNewRpgMap(allKnownSubLocations);
            archive.data.state.rpgMaps[mainLocation.name] = currentMapData;
        } else {
            const existingMapLocations = new Set(currentMapData.tiles.filter(t => t.name).map(t => t.name));
            let newLocationsFound = false;
            allKnownSubLocations.forEach(locName => {
                if (!existingMapLocations.has(locName)) {
                    expandRpgMap(currentMapData, locName);
                    newLocationsFound = true;
                }
            });
            if (newLocationsFound) {
                archive.data.state.rpgMaps[mainLocation.name] = currentMapData;
            }
        }
        
        await db.archives.put(archive);

        mapGrid.style.gridTemplateColumns = `repeat(${currentMapData.width}, 1fr)`;
        
        currentMapData.tiles.forEach(tileData => {
            const tile = document.createElement('div');
            tile.className = 'map-tile';
            if (tileData.type === 'location') {
                tile.classList.add('interactive');
                tile.onclick = () => addAction('travel', { location: `${mainLocation.name}${tileData.name}` });
            }

            const icon = document.createElement('i');
            icon.className = `fas ${tileData.icon} tile-icon`;
            tile.appendChild(icon);

            if (tileData.name) {
                const label = document.createElement('span');
                label.className = 'tile-label';
                label.textContent = tileData.name;
                tile.appendChild(label);
            }

            const charsInTile = surroundingCharacters.filter(c => c.location === `${mainLocation.name}${tileData.name}`);
            if (charsInTile.length > 0) {
                const charLabel = document.createElement('span');
                charLabel.className = 'tile-char-name';
                charLabel.textContent = charsInTile.map(c => c.name).join(', ');
                tile.appendChild(charLabel);
            }

            mapGrid.appendChild(tile);
        });
        
        locationRpgOverlay.classList.add('visible');
    }

    function generateNewRpgMap(locations) {
        const TILE_ICONS = {
            PLAYER: 'fa-user', LOCATION: 'fa-archway', TREE: 'fa-tree',
            MOUNTAIN: 'fa-mountain', HOUSE: 'fa-home', SHOP: 'fa-store'
        };
        const map = { width: 5, height: 5, tiles: [] };
        const takenCoords = new Set();
        
        const placeObject = (name, type, icon) => {
            let x, y;
            do {
                x = Math.floor(Math.random() * map.width);
                y = Math.floor(Math.random() * map.height);
            } while (takenCoords.has(`${x},${y}`));
            takenCoords.add(`${x},${y}`);
            return { x, y, name, type, icon };
        };
        
        let placedLocations = [];
        locations.forEach(locName => {
            const isPlayer = locName === currentPlayerData.detailedLocation;
            placedLocations.push(placeObject(locName, isPlayer ? 'player' : 'location', isPlayer ? TILE_ICONS.PLAYER : TILE_ICONS.LOCATION));
        });

        const totalTiles = map.width * map.height;
        for (let i = 0; i < totalTiles; i++) {
            const x = i % map.width;
            const y = Math.floor(i / map.height);
            const placed = placedLocations.find(p => p.x === x && p.y === y);
            if (placed) {
                map.tiles.push(placed);
            } else {
                map.tiles.push({ x, y, type: 'terrain', icon: [TILE_ICONS.TREE, TILE_ICONS.MOUNTAIN][Math.floor(Math.random() * 2)] });
            }
        }
        return map;
    }

    function expandRpgMap(mapData, newLocationName) {
        const TILE_ICONS = { LOCATION: 'fa-archway', TREE: 'fa-tree', MOUNTAIN: 'fa-mountain' };
        const newTile = { name: newLocationName, type: 'location', icon: TILE_ICONS.LOCATION };

        const isWide = mapData.width >= mapData.height;
        if (isWide) {
            mapData.height++;
            for (let i = 0; i < mapData.width; i++) {
                mapData.tiles.push({ type: 'terrain', icon: [TILE_ICONS.TREE, TILE_ICONS.MOUNTAIN][Math.floor(Math.random() * 2)] });
            }
        } else {
            mapData.width++;
            const newTiles = [];
            for (let y = 0; y < mapData.height; y++) {
                newTiles.push(...mapData.tiles.slice(y * (mapData.width - 1), (y + 1) * (mapData.width - 1)));
                newTiles.push({ type: 'terrain', icon: [TILE_ICONS.TREE, TILE_ICONS.MOUNTAIN][Math.floor(Math.random() * 2)] });
            }
            mapData.tiles = newTiles;
        }
        
        const lastTileIndex = mapData.tiles.length - 1;
        mapData.tiles[lastTileIndex] = { ...mapData.tiles[lastTileIndex], ...newTile };
    }

    async function openSummaryLog() {
        await showSummaryList();
        summaryLogOverlay.classList.add('visible');
    }

    async function showSummaryList() {
        const summaryListView = document.getElementById('summary-list-view');
        const summaryDetailView = document.getElementById('summary-detail-view');
        
        summaryListView.innerHTML = '';
        summaryListView.classList.remove('hidden');
        summaryDetailView.classList.add('hidden');
        
        const archive = await db.archives.get(currentArchiveName);
        const logs = archive ? archive.data.logs : [];
        const summaryLogs = logs.filter(log => log.content.startsWith('[天道总结:'));

        if (summaryLogs.length === 0) {
            summaryListView.innerHTML = '<p style="text-align:center; opacity:0.7;">当前存档没有总结记录。</p>';
        } else {
            summaryLogs.slice().reverse().forEach(log => {
                const item = document.createElement('div');
                item.className = 'summary-list-item';
                const titleMatch = log.content.match(/\[(天道总结:.*?)\]/);
                const title = titleMatch ? titleMatch[1] : '总结记录';
                
                item.innerHTML = `
                    <span>${title}</span>
                    <small>${new Date(log.timestamp).toLocaleString()}</small>
                `;
                item.dataset.logId = log.id;
                item.addEventListener('click', () => showSummaryDetail(log.id));
                summaryListView.appendChild(item);
            });
        }
    }

    async function showSummaryDetail(logId) {
        const summaryListView = document.getElementById('summary-list-view');
        const summaryDetailView = document.getElementById('summary-detail-view');
        
        summaryListView.classList.add('hidden');
        summaryDetailView.classList.remove('hidden');
        
        const archive = await db.archives.get(currentArchiveName);
        const log = archive.data.logs.find(l => l.id === logId);

        if (!log) {
            summaryDetailView.innerHTML = '<p>错误：找不到该总结记录。</p>';
            return;
        }

        summaryDetailView.innerHTML = `
            <button id="back-to-summary-list-btn" class="major-action-button" style="width: auto; align-self: flex-start; margin-bottom: 15px;"><i class="fas fa-arrow-left"></i> 返回列表</button>
            <div id="summary-detail-content">${sanitizeHTML(log.content).replace(/\n/g, '<br>')}</div>
            <div class="summary-detail-actions">
                <button class="major-action-button resummarize-btn" data-log-id="${log.id}" title="重新总结"><i class="fas fa-sync-alt"></i> 重新总结</button>
                <button class="major-action-button edit-summary-btn" data-log-id="${log.id}" title="编辑总结"><i class="fas fa-edit"></i> 编辑</button>
            </div>
        `;
        
        summaryDetailView.querySelector('#back-to-summary-list-btn').addEventListener('click', showSummaryList);
        summaryDetailView.querySelector('.resummarize-btn').addEventListener('click', (e) => handleResummarize(e.currentTarget.dataset.logId));
        summaryDetailView.querySelector('.edit-summary-btn').addEventListener('click', (e) => {
            summaryLogOverlay.classList.remove('visible');
            openMessageEditor(e.currentTarget.dataset.logId);
        });
    }

    async function handleResummarize(logId) {
if (!await showCustomConfirm("确定要重新总结这段记录吗？旧的总结将被覆盖。")) return;

let archive = await db.archives.get(currentArchiveName);
let logs = archive.data.logs;
const summaryLogIndex = logs.findIndex(log => log.id === logId);
if (summaryLogIndex === -1) {
await showCustomAlert("错误：找不到要重新总结的记录。");
return;
}

const summaryLog = logs[summaryLogIndex];
const rangeMatch = summaryLog.content.match(/\[天道总结: (\d+)-(\d+)层\]/);
if (!rangeMatch) {
await showCustomAlert("错误：无法从此总结中解析出有效的楼层范围。");
return;
}

const start = parseInt(rangeMatch[1]);
const end = parseInt(rangeMatch[2]);

const chatLogs = logs.filter(log => !log.content.startsWith('[天道总结:') && !log.content.includes('<h4>天道初启</h4>'));
const logsToSummarize = chatLogs.slice(start - 1, end);

if (logsToSummarize.length === 0) {
await showCustomAlert("错误：找不到原始记录进行重新总结。");
return;
}

const textToSummarize = logsToSummarize.map(log => log.content).join('\n---\n');
const instruction = `当前请暂停剧情扮演，进入总结模式，根据以上内容进行总结，你的总结要求是：（${summaryConfig.prompt}）`;

const summaryResult = await sendMessage(instruction, {
isSummary: true,
summaryContent: textToSummarize
});

if (summaryResult) {
summaryLog.content = `[天道总结: ${start}-${end}层]\n${summaryResult}`;
archive.data.logs = logs;
await db.archives.put(archive);

await showCustomAlert("重新总结完成！");
showSummaryDetail(logId);
loadChatHistory(logs, archive);
}
}

    async function openMessageEditor(logId) {
        currentEditingMessageId = logId;
        const archive = await db.archives.get(currentArchiveName);
        const logToEdit = archive.data.logs.find(log => log.id === logId);

        if (logToEdit) {
            let content = logToEdit.content;
            if (logToEdit.content.startsWith('> ')) {
                content = content.substring(2);
            }
            document.getElementById('message-editor-textarea').value = content;
            messageEditorOverlay.classList.add('visible');
        }
    }

    async function saveMessageEdit() {
        if (!currentEditingMessageId) return;

        let archive = await db.archives.get(currentArchiveName);
        const logIndex = archive.data.logs.findIndex(log => log.id === currentEditingMessageId);

        if (logIndex !== -1) {
            const newText = document.getElementById('message-editor-textarea').value;
            const originalLog = archive.data.logs[logIndex];
            
            if (originalLog.content.startsWith('> ')) {
                originalLog.content = `> ${newText}`;
            } else {
                originalLog.content = newText;
            }
            
            archive.data.logs[logIndex] = originalLog;
            await db.archives.put(archive);

            const messageElement = mainContentArea.querySelector(`[data-log-id="${currentEditingMessageId}"]`);
            if (messageElement) {
                messageElement.innerHTML = sanitizeHTML(originalLog.content);
            }

            await showCustomAlert('消息已修改并保存！');
            messageEditorOverlay.classList.remove('visible');
        }
        currentEditingMessageId = null;
    }

    async function openSnapshotManager() {
        const listEl = document.getElementById('snapshot-list');
        listEl.innerHTML = '';
        
        const archive = await db.archives.get(currentArchiveName);
        const logs = archive ? archive.data.logs : [];

        const logsWithState = logs.filter(log => log.stateSnapshot).reverse();

        if (logsWithState.length === 0) {
            listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">当前存档没有可用的人生快照。</p>';
        } else {
            logsWithState.forEach((log) => {
                const item = document.createElement('details');
                item.className = 'snapshot-item';
                item.innerHTML = `
                    <summary>
                        <div>
                            <strong>第 ${logs.indexOf(log) + 1} 层:</strong> 
                            <span class="log-preview">${log.content.substring(0, 50)}...</span>
                        </div>
                        <small>${new Date(log.timestamp).toLocaleString()}</small>
                    </summary>
                    <div class="snapshot-content">
                        <div class="snapshot-actions">
                            <button class="major-action-button edit-snapshot-btn" data-log-id="${log.id}"><i class="fas fa-edit"></i> 编辑</button>
                            <button class="major-action-button load-snapshot-btn" data-log-id="${log.id}"><i class="fas fa-history"></i> 加载此快照</button>
                        </div>
                    </div>
                `;
                listEl.appendChild(item);
            });
        }

        listEl.querySelectorAll('.load-snapshot-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const logId = e.currentTarget.dataset.logId;
                if (await showCustomConfirm('确定要回溯到这个人生快照吗？\n此快照之后的所有聊天记录将被删除，且当前状态将被覆盖，此操作不可撤销。')) {
                    loadStateFromLog(logId);
                }
            });
        });
        
        listEl.querySelectorAll('.edit-snapshot-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const logId = e.currentTarget.dataset.logId;
                openSnapshotEditor(logId);
            });
        });

        snapshotOverlay.classList.add('visible');
    }

    async function loadStateFromLog(logId) {
        let archive = await db.archives.get(currentArchiveName);
        let logs = archive.data.logs;
        const logIndex = logs.findIndex(l => l.id === logId);

        if (logIndex === -1 || !logs[logIndex].stateSnapshot) {
            await showCustomAlert('还原失败：找不到对应的快照。');
            return;
        }
        
        try {
            const snapshotState = JSON.parse(logs[logIndex].stateSnapshot);
            currentState = snapshotState;
            syncStateFromTables();
        } catch(e) {
            await showCustomAlert('还原失败：快照数据格式错误。');
            console.error("Error parsing snapshot:", e);
            return;
        }

        logs.splice(logIndex + 1);
        archive.data.logs = logs;
        await db.archives.put(archive);

        await saveCurrentState();
        
        loadChatHistory(logs);
        renderPlayerAttributes(currentPlayerData);
        renderInventory(inventoryItems);
        updateAvatar(currentPlayerData);
        
        await showCustomAlert('人生快照已成功加载！');
        snapshotOverlay.classList.remove('visible');
    }

    async function openSnapshotEditor(logId) {
        currentEditingSnapshotLogId = logId;
        const archive = await db.archives.get(currentArchiveName);
        const log = archive.data.logs.find(l => l.id === logId);
        if (log && log.stateSnapshot) {
            try {
                const snapshotObject = JSON.parse(log.stateSnapshot);
                document.getElementById('snapshot-editor-textarea').value = JSON.stringify(snapshotObject, null, 2);
            } catch (e) {
                document.getElementById('snapshot-editor-textarea').value = log.stateSnapshot;
            }
            snapshotEditorOverlay.classList.add('visible');
        }
    }

    async function saveSnapshotEdit() {
        if (!currentEditingSnapshotLogId) return;

        const textarea = document.getElementById('snapshot-editor-textarea');
        const newSnapshot = textarea.value;

        try {
            const parsedSnapshot = JSON.parse(newSnapshot);
            if (typeof parsedSnapshot !== 'object' || parsedSnapshot === null || Array.isArray(parsedSnapshot)) {
                throw new Error("快照必须是一个包含表格键的对象。");
            }
        } catch (e) {
            await showCustomAlert(`格式错误，无法保存: ${e.message}`);
            return;
        }

        if (await showCustomConfirm('格式正确。确定要保存对此快照的修改吗？')) {
            let archive = await db.archives.get(currentArchiveName);
            let logs = archive.data.logs;
            const logIndex = logs.findIndex(l => l.id === currentEditingSnapshotLogId);
            if (logIndex !== -1) {
                logs[logIndex].stateSnapshot = newSnapshot;
                archive.data.logs = logs;
                await db.archives.put(archive);
                await showCustomAlert('快照已成功修改！');
                snapshotEditorOverlay.classList.remove('visible');
                openSnapshotManager(); 
            }
            currentEditingSnapshotLogId = null;
        }
    }

    function _updateEquipmentSlot(slotKey, slotIndex, item) {
// 1. 直接修改核心数据源 currentState
const playerRow = currentState['0']['B1'];
if (playerRow) {
const remarks = parseRemarksString(playerRow['9'] || '');
let equipment = {};
try { equipment = JSON.parse(remarks.equipment || '{}'); } catch(e) {}

if (!equipment[slotKey]) {
equipment[slotKey] = Array(6).fill(null);
}
// 无论是装备新物品(item)还是拆卸(null)，都直接覆盖
equipment[slotKey][slotIndex] = item;

remarks.equipment = JSON.stringify(equipment);
playerRow['9'] = serializeRemarksObject(remarks);
}

// 2. 保存核心数据的修改
saveCurrentState();

// 3. 调用主同步函数，让它根据修改后的核心数据，自动重建所有前端数据
syncStateFromTables();

// 4. 使用同步后的新数据，刷新所有相关UI
updateCharacterDetailView();
renderPlayerAttributes(currentPlayerData);
renderInventory(inventoryItems);
}

function equipItem(item, slotType, slotIndex) {
const slotKey = { '武器': 'weapon', '护甲': 'armor', '功法': 'technique', '法宝': 'treasure' }[slotType];
if (!slotKey) return;

_updateEquipmentSlot(slotKey, slotIndex, item);
closeEquipmentPicker(); // 只在装备时关闭选择器
}

function unequipItem(slotKey, slotIndex) {
// 调用统一的更新函数，传入 null 来表示拆卸
_updateEquipmentSlot(slotKey, slotIndex, null);
}
    function setupRegexSettingsListeners() {
        const listContainer = document.getElementById('regex-settings-overlay');
        
        listContainer.addEventListener('click', async (e) => {
            const button = e.target.closest('button');
            const checkbox = e.target.closest('input[type="checkbox"]');

            if (checkbox && checkbox.dataset.index) {
                const index = parseInt(checkbox.dataset.index);
                const type = checkbox.dataset.type;
                const rules = type === 'chain' ? (regexConfig.chainRules || []) : (regexConfig.rules || []);
                rules[index].disabled = !checkbox.checked;
            }
            if (!button) return;
            
            const index = parseInt(button.dataset.index);
            const type = button.dataset.type;
            const rules = type === 'chain' ? (regexConfig.chainRules || []) : (regexConfig.rules || []);

            if (button.classList.contains('edit-regex-btn')) {
                openRegexEditor(index, type);
            } else if (button.classList.contains('delete-regex-btn')) {
                if (await showCustomConfirm(`确定要删除规则 "${rules[index].scriptName}" 吗？`)) {
                    rules.splice(index, 1);
                    renderRegexRulesUI();
                }
            } else if (button.classList.contains('move-regex-up-btn')) {
                if (index > 0) {
                    [rules[index - 1], rules[index]] = [rules[index], rules[index - 1]];
                    renderRegexRulesUI();
                }
            } else if (button.classList.contains('move-regex-down-btn')) {
                if (index < rules.length - 1) {
                    [rules[index], rules[index + 1]] = [rules[index + 1], rules[index]];
                    renderRegexRulesUI();
                }
            }
        });

        document.getElementById('add-regex-rule-btn').addEventListener('click', () => openRegexEditor(-1, 'regular'));
        document.getElementById('add-chain-regex-rule-btn').addEventListener('click', () => openRegexEditor(-1, 'chain'));
        document.getElementById('save-regex-config-btn').addEventListener('click', saveRegexConfig);
        regexSettingsOverlay.querySelector('.modal-close-btn').addEventListener('click', () => regexSettingsOverlay.classList.remove('visible'));
        
        regexEditorOverlay.querySelector('.modal-close-btn').addEventListener('click', () => regexEditorOverlay.classList.remove('visible'));
        document.getElementById('save-regex-editor-btn').addEventListener('click', saveRegexRuleFromEditor);

        const importInput = document.getElementById('import-regex-input');
        document.getElementById('import-regex-btn').addEventListener('click', () => importInput.click());
        importInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const parsedData = JSON.parse(event.target.result);
                    
                    // 新增：判断是否为完整的配置文件
                    if (typeof parsedData === 'object' && parsedData !== null && (Array.isArray(parsedData.rules) || Array.isArray(parsedData.chainRules))) {
                        if (await showCustomConfirm("检测到完整的正则配置文件。是否要覆盖所有相关设置（包括正则、字体、上下文等）？")) {
                            regexConfig = { ...regexConfig, ...parsedData };
                            await dbSet(REGEX_CONFIG_KEY, regexConfig);
                            await loadRegexConfig(); // 重新加载并应用所有设置
                            renderRegexRulesUI();
                            await showCustomAlert('完整的正则配置已成功导入并应用！');
                        }
                    } else { // 保留旧的逻辑以兼容只导入规则数组的情况
                        let rulesToImport = [];
                        if (Array.isArray(parsedData)) {
                                if (parsedData.length > 0 && typeof parsedData[0].scriptName === 'undefined') {
                                throw new Error('数组中的对象格式不正确。');
                            }
                            rulesToImport = parsedData;
                        } else if (typeof parsedData === 'object' && parsedData !== null && typeof parsedData.scriptName !== 'undefined') {
                            rulesToImport = [parsedData];
                        } else {
                            throw new Error('文件格式不正确。请导入完整的配置文件或规则数组。');
                        }
                        
                        const importType = await showCustomDialog({
                            title: '选择导入类型',
                            message: '请选择要将这些规则导入到哪个类别？',
                            buttons: [
                                { text: '思维链正则', value: () => 'chain' },
                                { text: '常规正则', value: () => 'regular' }
                            ]
                        });
                        
                        if (importType) {
                            const targetRulesKey = importType === 'chain' ? 'chainRules' : 'rules';
                            if (!regexConfig[targetRulesKey]) {
                                regexConfig[targetRulesKey] = [];
                            }

                            const shouldOverwrite = await showCustomConfirm(`导入成功！是否覆盖现有${importType === 'chain' ? '思维链' : '常规'}规则？\n(点击“确定”进行覆盖，点击“取消”进行追加)`);
                            if (shouldOverwrite) {
                                regexConfig[targetRulesKey] = rulesToImport;
                            } else {
                                regexConfig[targetRulesKey].push(...rulesToImport);
                            }
                            renderRegexRulesUI();
                            await showCustomAlert('规则已成功导入！');
                        }
                    }
                } catch (err) {
                    await showCustomAlert(`导入失败: ${err.message}`);
                } finally {
                    e.target.value = '';
                }
            };
            reader.readAsText(file);
        });

        document.getElementById('export-regex-btn').addEventListener('click', () => {
            const dataStr = JSON.stringify(regexConfig, null, 2);
            const dataBlob = new Blob([dataStr], {type: "application/json"});
            const url = URL.createObjectURL(dataBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'panel_regex_config.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
        
        document.getElementById('content-font-size').addEventListener('input', (e) => document.documentElement.style.setProperty('--ai-font-size', `${e.target.value}em`));
        document.getElementById('content-font-color').addEventListener('input', (e) => document.documentElement.style.setProperty('--ai-font-color', e.target.value));
        document.getElementById('chat-font-family').addEventListener('change', (e) => document.documentElement.style.setProperty('--chat-font-family', e.target.value));
        document.getElementById('delete-hidden-logs-btn').addEventListener('click', async () => {
            const archive = await db.archives.get(currentArchiveName);
            const logs = archive?.data.logs || [];
            if (logs.length === 0) {
                await showCustomAlert('当前存档没有记录可清理。');
                return;
            }
            
            const { hiddenChatLogs } = getLogsForContext(logs);
            if (hiddenChatLogs.length === 0) {
                await showCustomAlert('没有已折叠或隐藏的记录可供删除。');
                return;
            }
            
            if (await showCustomConfirm(`确定要永久删除 ${hiddenChatLogs.length} 条已折叠/隐藏的聊天记录吗？此操作不可撤销。`)) {
                const hiddenIds = new Set(hiddenChatLogs.map(log => log.id));
                archive.data.logs = logs.filter(log => !hiddenIds.has(log.id));
                await db.archives.put(archive);
                loadChatHistory(archive.data.logs);
                await showCustomAlert('已成功删除隐藏记录。');
            }
        });
    }
    
    function updateDeleteButtonState() {
        const selectedCount = archiveList.querySelectorAll('input[type="checkbox"]:checked').length;
        deleteSelectedArchivesBtn.disabled = selectedCount === 0;
    }

    function toggleSelectAllArchives() {
        const checkboxes = archiveList.querySelectorAll('input[type="checkbox"]');
        const isAllSelected = Array.from(checkboxes).every(cb => cb.checked);
        checkboxes.forEach(cb => cb.checked = !isAllSelected);
        updateDeleteButtonState();
    }

    async function deleteSelectedArchives() {
        const selectedCheckboxes = archiveList.querySelectorAll('input[type="checkbox"]:checked');
        if (selectedCheckboxes.length === 0) return;

        const namesToDelete = Array.from(selectedCheckboxes).map(cb => cb.dataset.archiveName);
        
        if (await showCustomConfirm(`确定要永久删除选中的 ${namesToDelete.length} 个存档吗？\n\n${namesToDelete.join('\n')}\n\n此操作不可撤销。`)) {
            let activeArchiveDeleted = false;
            namesToDelete.forEach(name => {
                if (name === currentArchiveName) {
                    activeArchiveDeleted = true;
                }
            });
            
            await db.archives.bulkDelete(namesToDelete);
            
            if (activeArchiveDeleted) {
                await dbRemove(ACTIVE_ARCHIVE_KEY);
                currentArchiveName = null;
            }
            
            await showCustomAlert(`${namesToDelete.length} 个存档已删除。`);
            await renderArchiveSelectionView();
        }
    }

    let creationState = {};
        const CREATION_CONFIG = {
            DIFFICULTIES: {
                '无限火力': { points: 99999, extreme: false },
                '爽文男主': { points: 200, extreme: false },
                '简单': { points: 150, extreme: false },
                '普通': { points: 100, extreme: false },
                '困难': { points: 50, extreme: false },
                '极限模式': { points: 60, extreme: true, desc: '最真实难度最高的模式，喜欢玩真实修仙的可以开，有死亡机制，并且死亡会删档，可使用仓库保留物品，谨慎开启' },
                '凡人修仙': { points: 30, extreme: false }
            },
            ATTRIBUTES: {
                '物攻': '决定了修士使用肉体、凡兵或体修神通时造成的物理伤害。', '物防': '决定了修士对物理伤害的减免能力，与肉身强度、护体功法、防御法衣直接相关。',
                '脚力': '决定了修士的移动速度、闪避能力以及在战斗中的机动性。御器飞行的速度也受此影响。', '法攻': '决定了修士施展法术、驱动法器/法宝时造成的法术伤害与效果强度。',
                '法防': '决定了修士对法术伤害的抵抗能力，主要来源于护体灵光、防御法术和特殊法宝。', '法力': '施展法术和驱动法宝的能量源泉。法力上限越高，持续作战能力越强。',
                '神识': '修士的精神力量。决定了感知范围、操控法宝的精细度和数量、炼丹炼器的成功率以及对幻术、精神攻击的抵抗力。是高阶修士最重要的属性之一。',
                '物理穿透': '允许物理攻击无视目标一定比例的物防。代表了武器的锋利度或力量的穿透性。', '法术穿透': '允许法术攻击无视目标一定比例的法防。代表了法术的诡异性或侵蚀性。',
                '气运': '一个隐藏的、影响深远的属性。影响修士获得奇遇、寻得重宝、突破瓶颈的几率。在关键判定中，高气运可能带来意想不到的转机。',
                '魅力': '影响修士在社交、交易、以及与智慧生物（包括部分妖兽）互动时的第一印象和说服力。高魅力可能使人如沐春风，也可能形成令人敬畏的威压。'
            },
            BIRTHS: {
'凡人': { cost: 0, bonus: { '气运': 10 }, desc: '出生在凡人家庭，不曾接触过修仙界，但你的未来充满了无限可能。' },
'七玄门弟子': { cost: 5, bonus: { '神识': 3, '魅力': 2 }, desc: '你是凡人武林门派中的一名弟子，跟随一位医术高明但性情古怪的师父学习。' },
'太南小会参与者': { cost: 10, bonus: { '脚力': 5, '气运': 5 }, desc: '你是一个籍籍无名的散修，听闻了太南小会的消息，怀着忐忑的心情前往，希望能淘到一些仙缘。' },
'黄枫谷外门': { cost: 15, bonus: { '法力': 10, '神识': 5 }, desc: '你通过了升仙大会，侥幸成为越国七派之一的入门弟子，一切都从头开始。' },
'掩月宗门人': { cost: 15, bonus: { '魅力': 8, '法攻': 7 }, desc: '你出身于越国一个以女修为主的门派，功法偏向阴柔，同门之间关系微妙。' },
'灵兽山弟子': { cost: 15, bonus: { '魅力': 10, '物防': 5 }, desc: '你的门派擅长驱使和培育灵兽，你天生对各种动物有亲和力。' },
'魔道传人': { cost: 20, bonus: { '法攻': 10, '法防': 5, '魅力': -5 }, desc: '你出身于天南魔道六宗之一，功法诡异，行事但求本心，不为世俗正道所容。' },
'乱星海岛主': { cost: 20, bonus: { '物防': 10, '法防': 10 }, desc: '你并非天南大陆人士，而是生于海外，占据了一座荒凉的岛屿，独自在妖兽横行的海域中求生。' },
'星宫巡查使': { cost: 25, bonus: { '法攻': 10, '法防': 10, '气运': 5 }, desc: '你是乱星海统治势力的成员，负责维护内星海的秩序，身份尊贵，但也树敌众多。' },
'逆星盟成员': { cost: 25, bonus: { '物理穿透': 5, '法术穿透': 5, '气运': -5 }, desc: '你加入了旨在推翻星宫统治的秘密组织，每日都在刀口舔血，为自由和理念而战。' },
'慕兰法士': { cost: 25, bonus: { '法攻': 15, '法力': -10, '物防': 5 }, desc: '你来自无边草原，信奉萨满神灵，修炼着与中原修士截然不同的“法术”，被天南修士视为死敌。' },
'大晋世家子弟': { cost: 30, bonus: { '法力': 15, '魅力': 10, '气运': 5 }, desc: '你出生于大晋王朝的一个修仙世家，灵气充裕，资源丰富，眼界远非天南修士可比。' },
'夺舍老怪的残魂': { cost: 30, bonus: { '神识': 20, '气运': -10 }, desc: '你的神识之海中，寄宿着一个自称“大能”的老怪物残魂，他似乎想夺走你的身体，但也带来了非凡的见识。' },
'阴冥之地鬼修': { cost: 30, bonus: { '法攻': 15, '神识': 10, '魅力': -10 }, desc: '你常年在大晋的阴冥之地修炼，与阴魂鬼物为伴，功法阴寒霸道，但也让你变得不似活人。' },
'天渊城卫士': { cost: 35, bonus: { '物攻': 10, '物防': 10, '法防': 10 }, desc: '你出生在人界与魔界交界处的巨城，你的使命就是与魔族战斗，心志坚定，百战余生。' },
'上古体修传人': { cost: 35, bonus: { '物攻': 15, '物防': 15, '法力': -20 }, desc: '你得到了一份上古体修的传承，坚信肉身成圣才是大道，对法术和法宝不屑一顾。' },
'神秘小瓶持有者': { cost: 50, bonus: { '气运': 20, '神识': 10 }, desc: '机缘巧合之下，你拾得了一只不起眼的绿色小瓶，它似乎对催熟灵草有奇效。' },
'天生剑胚': { cost: 40, bonus: { '物攻': 15, '物理穿透': 10 }, desc: '你天生就是为了练剑而生，对任何剑法都有着超乎常人的领悟力。' },
'丹道奇才': { cost: 35, bonus: { '神识': 15, '法力': 10 }, desc: '你对草木药理有着惊人的天赋，炼制丹药时如有神助，成功率远高于常人。' },
'阵法大师后裔': { cost: 35, bonus: { '神识': 15, '法防': 10 }, desc: '你的先祖是一位阵法宗师，你从小耳濡目染，对各种禁制阵法有独特的理解。' },
'人界飞升者': { cost: 45, bonus: { '神识': 15, '法力': 15, '气运': 15 }, desc: '你并非此界之人，而是从下界飞升而来，根基扎实，心性坚韧，但灵界对你而言充满了未知。' },
'真灵血脉后裔': { cost: 45, bonus: { '物攻': 10, '物防': 10, '法力': 10 }, desc: '你的血脉中流淌着一丝上古真灵的气息，这让你在修炼某些神通时拥有得天独厚的优势。' },
'傀儡术继承者': { cost: 30, bonus: { '神识': 20, '物攻': -10, '物防': -10 }, desc: '你痴迷于傀儡机关之术，认为永恒不灭的造物远比脆弱的肉身更值得信赖。' },

// --- 以下为新增的20个出生选项 ---
'血色试炼参与者': { cost: 15, bonus: { '气运': 5, '法术穿透': 5, '魅力': -5 }, desc: '你是一个小家族的精英子弟，被寄予厚望，进入了残酷的禁地试炼，只有活下来的人才能得到宗门筑基丹。' },
'燕翎堡后人': { cost: 15, bonus: { '物攻': 8, '魅力': 5, '法力': -5 }, desc: '你的家族以炼制顶级法器闻名，但族内禁止男子修仙。你似乎有着不同的想法。' },
'宗门执法弟子': { cost: 20, bonus: { '法防': 8, '物防': 8, '气运': -5 }, desc: '你为人刻板，铁面无私，在门派中担任执法弟子，负责维持门规，得罪了不少同门。' },
'百巧院匠人': { cost: 20, bonus: { '神识': 10, '物攻': 5 }, desc: '你所在的宗门不以斗法见长，却精通各种机关傀儡之术，在天南独树一帜。' },
'化意门弟子': { cost: 20, bonus: { '法攻': 10, '神识': 5 }, desc: '你的宗门以强大的神识攻击秘术闻名，门人稀少，但个个都是狠角色。' },
'合欢宗外围': { cost: 20, bonus: { '魅力': 15, '法防': -5 }, desc: '你所在的宗门精通双修采补之术，虽然为人所不齿，但修炼速度一日千里。' },
'内星海猎妖队': { cost: 20, bonus: { '物攻': 10, '脚力': 5, '气运': -3 }, desc: '你在乱星海以猎杀妖兽为生，常年在海上漂泊，对各种妖兽的习性了如指掌。' },
'奇渊岛医师': { cost: 20, bonus: { '神识': 10, '魅力': 5 }, desc: '你在乱星海一座著名的坊市岛屿上开了一家医馆，见惯了修士间的打打杀杀与人情冷暖。' },
'突兀仙师': { cost: 25, bonus: { '法攻': 10, '法力': 10, '魅力': -8 }, desc: '你来自遥远的草原，是慕兰神师的后备人选，天生就能与“天神”沟通，施展强大的神通。' },
'天道盟修士': { cost: 25, bonus: { '法防': 10, '物防': 5, '气运': 5 }, desc: '你是天南正道的砥柱，为了抵御魔道和慕兰人的入侵，你时刻准备着牺牲。' },
'御灵宗弟子': { cost: 25, bonus: { '神识': 10, '法攻': 10, '物防': -5 }, desc: '你的宗门以驱使鬼物闻名，甚至能炼制“第二元婴”，诡异莫测。' },
'九国盟散修': { cost: 25, bonus: { '脚力': 10, '气运': 8, '法力': -5 }, desc: '你出身于天南的小国联盟，资源匮乏，为了生存，你必须比别人更机警，更懂得趋利避害。' },
'坠魔谷探险者': { cost: 28, bonus: { '气运': 15, '法防': -5, '物防': -5 }, desc: '你听闻了上古战场的传说，不顾危险进入了那片空间裂缝密布的区域，希望能找到传说中的灵缈园。' },
'昆吾山试炼者': { cost: 30, bonus: { '物理穿透': 8, '法术穿透': 8, '气运': 5 }, desc: '你是大晋的顶尖修士，为了寻求化神机缘，毅然进入了传说中的上古封魔之地——昆吾山。' },
'叶家客卿': { cost: 30, bonus: { '魅力': 10, '法力': 10, '神识': 5 }, desc: '你被大晋第一修仙世家招揽为客卿，地位尊崇，可以接触到许多常人无法想象的资源和秘密。' },
'太一门弟子': { cost: 30, bonus: { '法攻': 15, '法防': 10 }, desc: '你出身于大晋的超级宗门，门派实力深不可测，甚至拥有自己的灵山和秘境。' },
'小寰岛遗孤': { cost: 20, bonus: { '气运': 15, '神识': -5 }, desc: '你所在的岛屿被强大的存在毁灭，你是唯一的幸存者，怀揣着秘密在乱星海流浪。' },
'天符门传人': { cost: 28, bonus: { '神识': 15, '法力': 10 }, desc: '你的宗门曾是制符第一大派，如今虽然没落，但你依然掌握着制作“通天灵符”的独门秘法。' },
'苦竹岛修士': { cost: 25, bonus: { '物防': 10, '法防': 10, '修炼速度': -5 }, desc: '你在乱星海一座以苦修闻名的岛屿修行，环境恶劣，但极大磨练了你的心性和防御能力。' },
'妙音门舞姬': { cost: 20, bonus: { '魅力': 15, '神识': 5, '物防': -8 }, desc: '你所在的宗门以音律和幻术闻名，门人皆是色艺双绝的女修，在乱星海的高层中颇有影响力。' }, '自定义': { cost: 20, bonus: {}, desc: '定义你独一无二的出身。' }
            },
            GENDERS: {
                '男性': { effects: ['阳属性功法修炼速度+10%', '体魄强度略高'] },
                '女性': { effects: ['阴属性功法修炼速度+10%', '魅力略高'] },
                '男生女相': { effects: ['容貌俊美，魅力非凡', '根骨偏阴柔，可能被误认为女性'] },
                '扶她': { effects: ['阴阳调和，适合双修功法', '体质特殊，可能引来觊觎'] }
            },
            RACES: {
                '人族': { cost: 0, desc: '万物之灵，悟性最高，天生道体，最适合修仙。', bonus: { '神识': 2, '气运': 1 } },
'妖族': { cost: 18, desc: '草木鸟兽，采天地灵气而开灵智。肉身强横，寿元和情欲绵长，但化形前心智稍逊。', bonus: { '物攻': 5, '物防': 5, '法力': -2, '神识': -3 } },
'魔族': { cost: 14, desc: '来自异界的强大种族，崇尚力量，天生拥有强大的魔躯和诡异的神通。', bonus: { '法攻': 5, '物攻': 3, '魅力': -3, '气运': -2 } },
'灵族': { cost: 10, desc: '天地灵气偶然汇聚而成的生灵，天生亲和五行法术，但肉身孱弱。', bonus: { '法力': 8, '神识': 4, '物攻': -5, '物防': -5 } },
'炼尸': { cost: 14, desc: '被无上魔功炼化而成的存在，不入轮回，刀枪不入，但灵智低下，受人驱使。', bonus: { '物防': 10, '物攻': 5, '神识': -8, '魅力': -10 } },
'古修士': { cost: 8, desc: '你继承了上古修士的血脉或传承，功法古朴强大，但与当今修仙界格格不入。', bonus: { '法力': 5, '法防': 5, '气运': -2 } },
'体修': { cost: 12, desc: '坚信肉身成圣的苦修者，以天地为熔炉，锤炼不灭之躯。', bonus: { '物攻': 8, '物防': 8, '法力': -10 } },
'魂修': { cost: 14, desc: '专修神魂的神秘修士，肉身脆弱，但神识攻击诡异莫测，令人防不胜防。', bonus: { '神识': 10, '法攻': 5, '物防': -8 } },
'剑修': { cost: 15, desc: '以剑为道，心念纯粹，攻击无匹，信奉一剑破万法。', bonus: { '物攻': 5, '物理穿透': 5 } },
'天外魔族': { cost: 16, desc: '来自更高层次的魔界，拥有污染灵气、侵蚀神魂的天赋。', bonus: { '法攻': 8, '法术穿透': 3, '魅力': -5 } },
'古魔': { cost: 15, desc: '被封印于上古的魔族始祖后裔，拥有纯粹的魔元和强大的肉身。', bonus: { '物攻': 5, '法攻': 5, '物防': 5, '气运': -5 } },
'血魔': { cost: 12, desc: '以精血为食，通过吞噬他人来快速提升修为的魔道分支。', bonus: { '法攻': 7, '脚力': 3, '物防': -5 } },
'影魔': { cost: 13, desc: '诞生于阴影之中的诡异魔物，无形无相，擅长隐匿与偷袭。', bonus: { '脚力': 8, '物理穿透': 5, '物防': -8 } },
'木族': { cost: 12, desc: '植物成精化形的灵族，天生亲和自然，擅长乙木神通与治疗。', bonus: { '法力': 10, '魅力': 5, '物攻': -5 } },
'石族': { cost: 10, desc: '山石成灵，性格坚毅，拥有无与伦比的防御力。', bonus: { '物防': 15, '脚力': -10 } },
'金灵之体': { cost: 14, desc: '由庚金之气化成的灵体，天生锋锐，能吞噬金属进化。', bonus: { '物理穿透': 8, '物防': 5, '法力': -5 } },
'雷灵': { cost: 16, desc: '诞生于雷霆之中的元素生灵，天生便能操控雷电。', bonus: { '法攻': 10, '法术穿透': 5, '物防': -8 } },
'真龙后裔': { cost: 20, desc: '体内流淌着一丝真龙血脉，肉身强大，能呼风唤雨。', bonus: { '物攻': 5, '物防': 5, '法力': 5 } },
'天凤后裔': { cost: 22, desc: '拥有天凤血脉，天生亲和火焰，并有涅槃重生的潜力。', bonus: { '法攻': 8, '脚力': 5, '气运': 2 } },
'鲲鹏后裔': { cost: 20, desc: '继承了神兽鲲鹏的血脉，身法绝伦，扶摇直上九万里。', bonus: { '脚力': 15, '法力': -5 } },
'麒麟后裔': { cost: 18, desc: '瑞兽麒麟的血脉，天生祥瑞，能辟邪除秽，气运亨通。', bonus: { '气运': 8, '法防': 5 } },
'玄武后裔': { cost: 18, desc: '圣兽玄武的血脉，防御无双，寿元和情欲绵长。', bonus: { '物防': 10, '法防': 10, '脚力': -8 } },
'山岳巨猿族': { cost: 16, desc: '力大无穷的太古异种，一拳可开山，一吼可裂石。', bonus: { '物攻': 15, '物防': 5, '神识': -8 } },
'噬金虫族': { cost: 20, desc: '上古奇虫，无物不噬，尤其喜爱吞噬五金之精和法宝。', bonus: { '物理穿透': 10, '物防': 10, '法力': -10 } },
'啼魂兽族': { cost: 20, desc: '以神魂鬼物为食的异兽，对魂魄类存在有绝对的克制。', bonus: { '神识': 15, '法攻': 5, '物攻': -10 } },
'角蚩族': { cost: 13, desc: '灵界强大种族，头生独角，肉身坚固，骁勇善战。', bonus: { '物攻': 8, '物防': 5, '魅力': -3 } },
'天鹏族': { cost: 18, desc: '天云十三族之一，拥有金翅大鹏血脉，速度天下无双。', bonus: { '脚力': 12, '物攻': 3 } },
'三目族': { cost: 16, desc: '天云十三族之一，额生第三目，能看破虚妄，发出神光。', bonus: { '神识': 8, '法术穿透': 5 } },
'飞灵族': { cost: 14, desc: '背生双翼的类人种族，擅长弓箭与空中作战。', bonus: { '脚力': 8, '物攻': 5 } },
'地渊族': { cost: 12, desc: '常年生活在地底深渊的种族，皮肤苍白，擅长土遁与偷袭。', bonus: { '物防': 8, '物理穿透': 3, '魅力': -5 } },
'夜叉族': { cost: 10, desc: '貌丑凶恶的种族，飞行绝迹，力大无穷。', bonus: { '物攻': 8, '脚力': 5, '魅力': -8 } },
'螟族': { cost: 8, desc: '拥有高度智慧的虫族，个体实力或许不强，但繁衍能力恐怖。', bonus: { '神识': 5, '物防': 5, '物攻': -3 } },
'傀儡之躯': { cost: 12, desc: '你的肉身早已舍弃，神魂寄宿于一具强大的机关傀儡之中。', bonus: { '物防': 12, '法防': 12, '魅力': -10, '气运': -5 } },
'鬼物': { cost: 11, desc: '死后执念不散形成的灵体，无视物理攻击，但畏惧至阳至刚之力。', bonus: { '法攻': 8, '神识': 5, '物防': -10 } },
'化身灵体': { cost: 10, desc: '你是某位大能斩出的化身，拥有独立的意识，但与本体有千丝万缕的联系。', bonus: { '神识': 8, '法力': 8, '气运': -3 } },
'仙人遗蜕': { cost: 22, desc: '你在一具陨落仙人的躯体上诞生了新的灵智，天生便拥有不凡的根基。', bonus: { '物防': 10, '法防': 10, '法力': 10, '气运': -8 } },
'高等精灵': { cost: 14, desc: '优雅而长寿的种族，天生亲和魔法，对艺术有极高的造诣。', bonus: { '魅力': 8, '法攻': 5, '物防': -3 } },
'幽暗精灵': { cost: 12, desc: '生活在地底的精灵分支，皮肤黝黑，行事狠辣，擅长诡计与刺杀。', bonus: { '脚力': 5, '物理穿透': 5, '魅力': -3 } },
'森林精灵': { cost: 13, desc: '自然的守护者，擅长弓箭与追踪，能与林中万物沟通。', bonus: { '脚力': 8, '物攻': 5, '法防': -3 } },
'山地矮人': { cost: 14, desc: '固执而强壮的种族，天生的工匠与战士，嗜好烈酒与寻宝。', bonus: { '物防': 8, '物攻': 5, '脚力': -5 } },
'钢铁兽人': { cost: 15, desc: '崇尚力量与荣耀的种族，为战而生，拥有强大的恢复能力。', bonus: { '物攻': 10, '物防': 5, '神识': -5, '魅力': -5 } },
'龙裔': { cost: 18, desc: '流淌着巨龙之血的人形种族，天生拥有龙息与鳞甲。', bonus: { '物攻': 5, '法攻': 5, '物防': 3 } },
'火元素裔': { cost: 13, desc: '血脉源自火焰位面的生灵，性格爆裂，天生能操控火焰。', bonus: { '法攻': 8, '法防': 3, '魅力': -2 } },
'水元素裔': { cost: 13, desc: '血脉源自流水位面的生灵，性格多变，能适应任何环境。', bonus: { '法力': 8, '脚力': 3, '物攻': -2 } },
'风元素裔': { cost: 13, desc: '血脉源自天空位面的生灵，生性自由，身轻如燕。', bonus: { '脚力': 10, '法术穿透': 3, '物防': -5 } },
'土元素裔': { cost: 13, desc: '血脉源自土元素位面的生灵，性格沉稳，坚如磐石。', bonus: { '物防': 10, '物攻': 3, '脚力': -5 } },
'吸血鬼': { cost: 16, desc: '优雅的暗夜贵族，通过吸食血液获得力量与永生。', bonus: { '魅力': 8, '脚力': 5, '物防': -5 } },
'巫妖': { cost: 20, desc: '将自己灵魂束缚于命匣的强大法师，拥有无尽的生命来研究死亡的奥秘。', bonus: { '神识': 12, '法攻': 8, '魅力': -10 } },
'魔裔': { cost: 9, desc: '血脉中混有炼狱气息的凡人后代，生有犄角与尾巴，常被世人排斥。', bonus: { '法攻': 5, '魅力': -3, '法防': 3 } },
'神裔': { cost: 15, desc: '拥有天界血统的凡人后代，生来便带有一丝神圣的光辉。', bonus: { '魅力': 5, '气运': 3, '法防': 3 } },
'半身人': { cost: 8, desc: '身材矮小，生性乐观豁达的种族，热爱美食与安逸的生活，运气通常不错。', bonus: { '气运': 5, '脚力': 3, '物攻': -3 } },
'侏儒': { cost: 12, desc: '充满好奇心与创造力的种族，擅长研究炼金与精密机械。', bonus: { '神识': 8, '法术穿透': 3, '物攻': -3 } },
'机械生命体': { cost: 10, desc: '由金属与符文构成的自律机械，没有情感，绝对理性。', bonus: { '物防': 12, '法防': 12, '魅力': -15, '气运': -5 } },
'基因改造体': { cost: 15, desc: '通过某种未知技术强化了基因的造物，突破了凡人的极限。', bonus: { '物攻': 5, '物防': 5, '脚力': 5 } },
'灵能种族': { cost: 22, desc: '天生拥有强大精神力量的种族，通过心灵感应交流，以纯粹的灵能作战。', bonus: { '神识': 12, '法攻': 8, '物防': -5 } },
'虫群宿主': { cost: 14, desc: '一个巨大虫群的意志载体，能够孵化并指挥无穷无尽的虫类仆从。', bonus: { '法力': 10, '物防': 8, '魅力': -12 } },
'星际灵族': { cost: 18, desc: '一个古老而濒危的宇宙种族，拥有高度发达的灵能科技和优雅的身姿。', bonus: { '神识': 8, '脚力': 8, '物防': -5 } },
'虚空造物': { cost: 12, desc: '来自世界之外的混沌存在，形态不定，能够扭曲现实。', bonus: { '法术穿透': 8, '法防': 8, '气运': -8 } },
'古神眷属': { cost: 20, desc: '被某个沉睡的古神所影响而变异的生灵，拥有了超越常理的力量和疯狂的知识。', bonus: { '神识': 10, '法攻': 10, '魅力': -10 } },
'阿修罗族': { cost: 15, desc: '好勇斗狠，拥有强大力量的战斗种族，常与天人交战。', bonus: { '物攻': 10, '法攻': 5, '气运': -5 } },
'自然之灵': { cost: 16, desc: '由山川、河流、森林等自然权柄化身而成的精魂，喜怒无常。', bonus: { '法力': 10, '魅力': 8, '物防': -5 } },
'泰坦后裔': { cost: 18, desc: '继承了远古泰坦神族血脉的巨人，拥有与生俱来的神力。', bonus: { '物攻': 12, '物防': 8, '法力': -8 } },
'哥布林': { cost: 4, desc: '狡猾而卑劣的小型生物，擅长利用陷阱和数量优势。', bonus: { '脚力': 5, '气运': 3, '物攻': -3, '魅力': -5 } },
'大地精': { cost: 18, desc: '哥布林的强壮表亲，拥有严明的军事纪律和不俗的战斗技巧。', bonus: { '物攻': 5, '物防': 5, '魅力': -3 } },
'狗头人': { cost: 6, desc: '崇拜龙类的穴居生物，擅长挖矿和布置陷阱，胆小但团结。', bonus: { '神识': 5, '物防': 3, '物攻': -4, '魅力': -4 } },
'豺狼人': { cost: 12, desc: '混乱与贪婪的化身，残忍的游牧劫掠者，拥有鬣狗般的狡诈。', bonus: { '物攻': 8, '脚力': 5, '神识': -5, '魅力': -6 } },
'蜥蜴人': { cost: 16, desc: '冷血的沼泽住民，拥有强大的生存本能和坚韧的鳞甲。', bonus: { '物防': 8, '物攻': 3, '神识': -5 } },
'半人马': { cost: 15, desc: '上半身为人，下半身为马的种族，是天生的射手和草原的骄子。', bonus: { '脚力': 10, '物攻': 5, '物防': -3 } },
'牛头人': { cost: 16, desc: '拥有牛首人身的巨大怪物，天生神力，但头脑简单，容易迷路。', bonus: { '物攻': 12, '物防': 5, '神识': -8 } },
'树精': { cost: 14, desc: '与特定树木绑定的自然精魂，美丽而致命，能操控植物。', bonus: { '魅力': 10, '法攻': 5, '物防': -5 } },
'羊蹄人': { cost: 10, desc: '半人半羊的林地生物，生性享乐，擅长音乐与魅惑。', bonus: { '魅力': 8, '脚力': 5, '法防': -3 } },
'狐妖': { cost: 18, desc: '由狐狸修炼而成的精怪，擅长幻术与魅惑，智慧极高。', bonus: { '魅力': 10, '神识': 5, '法攻': 3, '物防': -5 } },
'天狗': { cost: 16, desc: '拥有鸟喙与翅膀的山中修行者，是剑术与法术的大师。', bonus: { '物攻': 5, '脚力': 5, '神识': 5 } },
'鬼族': { cost: 17, desc: '来自异域的强大食人恶鬼，手持狼牙棒，拥有再生能力。', bonus: { '物攻': 10, '物防': 8, '魅力': -8 } },
'史莱姆': { cost: 20, desc: '不定形的凝胶状生物，能免疫物理重击，并用酸液腐蚀万物。', bonus: { '物防': 10, '法防': 10, '神识': -10, '魅力': -10 } },
'蕈人': { cost: 12, desc: '由巨大蘑菇进化而来的智慧生物，通过孢子交流，能散播各种孢子影响环境。', bonus: { '神识': 8, '法防': 5, '脚力': -5 } },
'鸟人': { cost: 14, desc: '拥有翅膀和中空骨骼的类人生物，是天生的斥候和空战单位。', bonus: { '脚力': 12, '物攻': 3, '物防': -5 } },
'猫人': { cost: 13, desc: '兼具猫的敏捷与人的智慧，好奇心旺盛，行动悄无声息。', bonus: { '脚力': 8, '魅力': 5, '物防': -3 } },
'机械人偶': { cost: 15, desc: '由古代文明制造的自律人偶，不知疲倦，绝对忠诚，但缺乏创造力。', bonus: { '物防': 10, '物攻': 8, '神识': -8 } },
'变形怪': { cost: 18, desc: '能够随意改变自身外貌的种族，是天生的间谍与刺客。', bonus: { '魅力': 10, '神识': 5, '物攻': -3 } },
'深渊之裔': { cost: 20, desc: '被深渊力量侵蚀的异变生物，拥有扭曲的肢体和强大的精神力量。', bonus: { '神识': 10, '法攻': 8, '魅力': -8 } },
'蛇人': { cost: 16, desc: '上半身为人，下半身为蛇的古老种族，擅长用毒与咒法。', bonus: { '法攻': 8, '魅力': 5, '脚力': -3 } },
                '自定义': { cost: 20, desc: '定义你独一无二的种族。', bonus: {} }
            },
            TRAIT_RARITIES: {
                '平庸': { cost: 5, color: 'var(--rarity-mundane)' }, '普通': { cost: 10, color: 'var(--rarity-common)' },
                '稀有': { cost: 15, color: 'var(--rarity-rare)' }, '史诗': { cost: 20, color: 'var(--rarity-epic)' },
                '传说': { cost: 25, color: 'var(--rarity-legendary)' }, '神迹': { cost: 50, color: 'var(--rarity-mythic)' },
                '负面状态': { cost: 0, color: 'var(--rarity-负面状态)'}
            },
            TRAITS: {
'平庸': [
{ name: '手脚笨拙', desc: '你的协调性似乎总比别人差一点。', effects: '无', bonus: { '脚力': -2, '物防': 1 }, item: '无' },
{ name: '体弱多病', desc: '从小你就时常生病，身体较为虚弱。', effects: '无', bonus: { '物防': -2, '神识': 1 }, item: '【一包劣质草药|味道苦涩的草药包|消耗品|略微恢复气血|1】' },
{ name: '丢三落四', desc: '你总是记不住事情，功法口诀要背好几遍。', effects: '功法领悟速度略微下降', bonus: { '神识': -3, '气运': 1 }, item: '无' },
{ name: '天生倒霉', desc: '走路踩狗屎，喝水塞牙缝，似乎是你的日常。', effects: '奇遇几率小幅下降', bonus: { '气运': -5, '物防': 2 }, item: '无' },
{ name: '路痴', desc: '你天生方向感极差，但有时也能误入奇景。', effects: '野外探索时更容易迷路', bonus: { '脚力': -2, '气运': 1 }, item: '无' },
{ name: '贪杯', desc: '你对美酒毫无抵抗力，但也因此结交了一些朋友。', effects: '无', bonus: { '魅力': 2, '神识': -1 }, item: '【一壶劣酒|味道辛辣的凡间浊酒|消耗品|饮用后短时间物攻+1,神识-2|1】' },
{ name: '贪吃', desc: '你比常人更容易感到饥饿，但你的身体也因此更结实。', effects: '体力消耗速度增加', bonus: { '物防': 2, '法力': -10 }, item: '【一块干粮|能填饱肚子的干硬面饼|消耗品|无|3】' },
{ name: '嗜睡', desc: '你总感觉睡不够，但每次醒来都精神饱满。', effects: '修炼效率略微降低', bonus: { '法力': 10, '脚力': -1 }, item: '无' },
{ name: '话痨', desc: '你特别喜欢说话，有时会惹人烦，有时也能探听到意外的情报。', effects: '无', bonus: { '魅力': -2, '神识': 2 }, item: '无' },
{ name: '守财奴', desc: '你对灵石有着异乎寻常的执着，一毛不拔。', effects: '交易时更容易获得优惠', bonus: { '魅力': -3 }, item: '【装满铜钱的钱袋|一个沉甸甸的钱袋，是你省吃俭用的成果|其他物品|内含50灵石|1】' },
{ name: '洁癖', desc: '你无法忍受任何污秽，这让你在某些环境中束手束脚，但也使你心神澄净。', effects: '无', bonus: { '神识': 2, '物防': -1 }, item: '【干净的手帕|一块一尘不染的白色手帕|其他物品|无|1】' },
{ name: '夜猫子', desc: '你在夜晚时精神百倍，白天则昏昏欲睡。', effects: '夜间修炼速度提升，白天降低', bonus: { '法攻': 1, '物攻': -1 }, item: '无' },
{ name: '悲观主义', desc: '你总是先想到最坏的结果，这让你规避了风险，也错失了机遇。', effects: '无', bonus: { '气运': -3, '法防': 2 }, item: '无' },
{ name: '好奇宝宝', desc: '你对任何未知事物都充满好奇，这可能带来麻烦，也可能带来发现。', effects: '无', bonus: { '气运': 2, '物防': -1, '法防': -1 }, item: '无' },
{ name: '赌徒', desc: '你热衷于赌博，无论是赌场还是命运。', effects: '气运判定时波动极大', bonus: { '气运': 1 }, item: '【一副灌铅的骰子|看起来很普通的骰子，但在特定角度会掷出特定点数|其他物品|未知|1】' },
{ name: '惧高', desc: '站在高处会让你头晕目眩，但你的底盘很稳。', effects: '御器飞行时可能出现失误', bonus: { '脚力': -3, '物防': 2 }, item: '无' },
{ name: '旱鸭子', desc: '你天生怕水，但在陆地上你感觉更安全。', effects: '在水中战斗力大幅下降', bonus: { '物攻': 1, '脚力': -1 }, item: '无' },
{ name: '脸盲', desc: '你很难记住别人的长相，但这让你对气息的感知更敏锐。', effects: '无', bonus: { '魅力': -2, '神识': 2 }, item: '无' },
{ name: '慢郎中', desc: '你做什么事都慢悠悠的，但也因此更稳妥。', effects: '炼丹炼器时间增加，成功率微弱提升', bonus: { '脚力': -2, '神识': 1 }, item: '无' },
{ name: '直肠子', desc: '你说话从不拐弯抹角，容易得罪人，但也让人觉得你很真诚。', effects: '无', bonus: { '魅力': -3, '气运': 1 }, item: '无' },
{ name: '胆小如鼠', desc: '你天生胆小，但对危险的预感也因此异常灵敏。', effects: '更容易规避致命危险', bonus: { '神识': 2, '物攻': -2 }, item: '无' },
{ name: '书呆子', desc: '相比于锻炼身体，你更喜欢在书海中遨游。', effects: '功法领悟速度微弱提升', bonus: { '神识': 3, '物攻': -2 }, item: '【一本未读完的杂记|记录着一些趣闻轶事|其他物品|无|1】' },
{ name: '疑心病', desc: '你很难完全相信任何人，这让你免于被骗，也失去了很多朋友。', effects: '不容易被欺骗，但提升好感度更困难', bonus: { '法防': 2, '魅力': -3 }, item: '无' },
{ name: '挑食', desc: '你只吃自己喜欢的东西，这让你的身体发育有些不均衡。', effects: '服用丹药时，非喜好丹药效果减半', bonus: { '法力': 10, '物防': -2 }, item: '无' },
{ name: '畏虫', desc: '你对各种虫子有着生理性的厌恶和恐惧。', effects: '在丛林、沼泽等环境中容易分心', bonus: { '脚力': 1, '神识': -2 }, item: '无' }
],
'普通': [
{ name: '体格健壮', desc: '天生筋骨强健，比常人更耐打。', effects: '无', bonus: { '物防': 5 }, item: '无' },
{ name: '过目不忘', desc: '拥有不错的记忆力，学习事物更快。', effects: '功法领悟速度略微提升', bonus: { '神识': 3 }, item: '无' },
{ name: '飞毛腿', desc: '你从小就跑得快，逃跑时总能领先一步。', effects: '无', bonus: { '脚力': 5 }, item: '【一双草鞋|一双耐穿的草鞋|护甲|脚力+1|1】' },
{ name: '能言善辩', desc: '你天生口才好，与人交谈时更容易获得好感。', effects: '交易时可能获得更好的价格', bonus: { '魅力': 5 }, item: '无' },
{ name: '水性良好', desc: '你在水中如同鱼儿一般自在。', effects: '在水中行动不受阻碍', bonus: { '脚力': 3, '物防': 2 }, item: '无' },
{ name: '巧手', desc: '你的双手十分灵巧，适合进行精细操作。', effects: '炼丹、炼器、制符成功率微弱提升', bonus: { '神识': 3 }, item: '无' },
{ name: '药农之子', desc: '你从小就和草药打交道，能轻易分辨出各种凡间草药。', effects: '采集草药时有几率获得额外收获', bonus: { '法力': 5 }, item: '【草药篮|一个装满常见草药的篮子|其他物品|内含止血草、清心草等|1】' },
{ name: '猎户之子', desc: '你继承了父辈的狩猎技巧，擅长追踪和使用弓弩。', effects: '使用弓弩类武器伤害提升', bonus: { '物攻': 3, '脚力': 2 }, item: '【旧猎弓|一把保养得当的旧猎弓和几支箭矢|武器|凡品，略优于普通木弓|1】' },
{ name: '铁匠学徒', desc: '你在打铁铺当过学徒，懂得如何保养和锻造凡间兵器。', effects: '可以修复凡品武器', bonus: { '物攻': 3, '物防': 2 }, item: '【锻造锤|一把趁手的锻造锤，上面还有你师父的刻印|其他物品|无|1】' },
{ name: '拳师', desc: '你练过几年凡间拳脚功夫，拳头比一般人硬。', effects: '空手伤害增加', bonus: { '物攻': 4 }, item: '【一双布手套|保护你拳头的厚实手套|护甲|物防+1|1】' },
{ name: '第六感', desc: '你偶尔能预感到即将到来的危险或机遇。', effects: '无', bonus: { '气运': 3 }, item: '无' },
{ name: '精神饱满', desc: '你总是精力充沛，打坐修炼时更易入定。', effects: '无', bonus: { '法力': 10 }, item: '无' },
{ name: '心思缜密', desc: '你考虑问题周全，不容易被表象迷惑。', effects: '对抗幻术时有少许优势', bonus: { '神识': 3 }, item: '无' },
{ name: '老实人', desc: '你的外表和言行让人感觉很可靠。', effects: '无', bonus: { '魅力': 4, '气运': 1 }, item: '无' },
{ name: '抗毒体质', desc: '你对常见的毒素有一定抗性。', effects: '无', bonus: { '法防': 5 }, item: '无' },
{ name: '耐寒', desc: '你比常人更耐得住严寒。', effects: '在寒冷环境中负面影响降低', bonus: { '物防': 3 }, item: '无' },
{ name: '耐热', desc: '你比常人更耐得住酷暑。', effects: '在炎热环境中负面影响降低', bonus: { '法防': 3 }, item: '无' },
{ name: '恢复力', desc: '你的伤口愈合速度比一般人快一些。', effects: '脱离战斗后生命恢复速度加快', bonus: { '物防': 3 }, item: '无' },
{ name: '节俭', desc: '你精打细算，从不乱花一颗灵石。', effects: '无', bonus: {}, item: '【压箱底的私房钱|你多年来省下的100颗灵石|其他物品|内含100灵石|1】' },
{ name: '灵根增幅', desc: '你的灵根虽然普通，但似乎比同类更强一些。', effects: '修炼速度提升5%', bonus: { '法力': 10 }, item: '无' },
{ name: '武学爱好者', desc: '你对各种凡人武学都很有兴趣，学得很快。', effects: '学习凡人武学技能速度加快', bonus: { '物攻': 2, '脚力': 2 }, item: '【一本破旧拳谱|记录着一门凡人基础拳法|功法|无|1】' },
{ name: '乐天派', desc: '你总是能看到事情好的一面，很少有事情能让你真正烦恼。', effects: '不易产生心魔，对精神类负面效果有微弱抗性', bonus: { '气运': 2, '魅力': 2 }, item: '无' },
{ name: '商贾之子', desc: '你的家庭从事商业，你从小耳濡目染，对交易和人情世故颇为通晓。', effects: '在商店购买物品时有折扣', bonus: { '魅力': 3 }, item: '【一个算盘|做生意用的工具，算得又快又准|其他物品|无|1】' },
{ name: '酒鬼之子', desc: '你的长辈是个酒鬼，你从小就学会了如何品酒和酿酒。', effects: '对酒精类负面效果有抗性', bonus: { '法防': 3, '魅力': 2 }, item: '【家传的酿酒方子|一张记录了凡间美酒酿造方法的羊皮纸|其他物品|无|1】' },
{ name: '绘画学徒', desc: '你曾学习绘画，拥有一双能发现美的眼睛和稳定的手。', effects: '制作符箓时，成功率微弱提升', bonus: { '神识': 2, '魅力': 2 }, item: '【一支上好的狼毫笔|笔杆温润，手感极佳|其他物品|无|1】' }
],
'稀有': [
{ name: '丹道初解', desc: '你对草木药理有天生的亲和力。', effects: '炼丹成功率提升5%', bonus: { '神识': 5, '法力': 2 }, item: '【药王神篇残卷|一本古老的炼丹入门书籍|重要物品|可提升炼丹成功率|1】' },
{ name: '御风而行', desc: '你的身法轻盈，跑得比别人快。', effects: '无', bonus: { '脚力': 10 }, item: '无' },
{ name: '天生神力', desc: '你的力气比同龄人大得多，使用重武器得心应手。', effects: '无', bonus: { '物攻': 10 }, item: '无' },
{ name: '五行亲和', desc: '你对天地间的五行灵气有不错的感应能力。', effects: '施法消耗降低5%', bonus: { '法攻': 5, '法力': 5 }, item: '无' },
{ name: '炼器学徒', desc: '你对敲敲打打的炼器之道颇有心得。', effects: '炼器成功率提升5%', bonus: { '神识': 5, '物攻': 2 }, item: '【炼器心得残本|一本记录了基础炼器手法的册子|重要物品|可提升炼器成功率|1】' },
{ name: '符道学徒', desc: '你绘制符箓时心神合一，成功率更高。', effects: '制作符箓成功率提升10%', bonus: { '神识': 8 }, item: '【一沓符纸与朱砂|练习画符的基础材料|其他物品|可用于制作低阶符箓|1】' },
{ name: '阵法爱好者', desc: '你对阵法一道很感兴趣，能看懂一些基础阵法的门道。', effects: '更容易破解低阶阵法', bonus: { '神识': 6, '法防': 4 }, item: '【阵法初解|一本讲解基础阵法原理的书籍|重要物品|无|1】' },
{ name: '灵视', desc: '你的双眼能看到常人无法察觉的灵气流动。', effects: '更容易发现隐藏的灵物或阵法节点', bonus: { '神识': 8, '气运': 2 }, item: '无' },
{ name: '兽语者', desc: '你似乎能听懂一些低阶妖兽的叫声，并与它们进行简单沟通。', effects: '无', bonus: { '魅力': 8, '神识': 2 }, item: '无' },
{ name: '冰肌', desc: '你的皮肤如冰霜般寒冷，对冰系法术有天然的抗性。', effects: '冰系法术抗性提升', bonus: { '法防': 8, '魅力': 2 }, item: '无' },
{ name: '火灵体', desc: '你的身体天生亲和火灵气，施展火系法术事半功倍。', effects: '火系法术威力提升10%', bonus: { '法攻': 8, '法力': 5 }, item: '无' },
{ name: '厚土之体', desc: '你的身体如大地般厚重，防御力惊人。', effects: '无', bonus: { '物防': 10, '法防': 5 }, item: '无' },
{ name: '金锐之骨', desc: '你的骨骼如同精金，坚硬且锋利。', effects: '无', bonus: { '物攻': 8, '物理穿透': 3 }, item: '无' },
{ name: '听风者', desc: '你的听觉异常灵敏，能从风声中捕捉到大量信息。', effects: '感知范围提升', bonus: { '神识': 8, '脚力': 2 }, item: '无' },
{ name: '杀气凛然', desc: '你天生带有一股杀气，让修为低于你的敌人感到畏惧。', effects: '无', bonus: { '物攻': 5, '魅力': -5 }, item: '无' },
{ name: '寻宝嗅觉', desc: '你对天材地宝的气息有种野兽般的直觉。', effects: '无', bonus: { '气运': 8 }, item: '【一个寻宝罗盘|指针总是指向有好东西的方向|法宝|无|1】' },
{ name: '一心二用', desc: '你能够同时思考两件事情而互不干扰。', effects: '可以同时操控两件法器', bonus: { '神识': 10 }, item: '无' },
{ name: '经脉粗壮', desc: '你的经脉比常人宽阔，能容纳和运转更多的法力。', effects: '无', bonus: { '法力': 10 }, item: '无' },
{ name: '破妄之眼', desc: '你的眼力极佳，能轻易看穿低阶的幻术和伪装。', effects: '无', bonus: { '神识': 8, '法术穿透': 3 }, item: '无' },
{ name: '小有气运', desc: '你似乎总是比别人幸运那么一点点。', effects: '无', bonus: { '气运': 10 }, item: '无' },
{ name: '愈合之血', desc: '你的血液蕴含着一丝生机，让你恢复得更快。', effects: '战斗中也能缓慢恢复生命', bonus: { '物防': 5, '法防': 5 }, item: '无' },
{ name: '毒师之徒', desc: '你对毒药的理解远超常人，懂得如何以毒攻毒，以毒杀人。', effects: '可辨别常见毒药，炼制毒药成功率提升', bonus: { '法攻': 5, '神识': 5, '魅力': -5 }, item: '【淬毒的银针|一包藏在袖中的银针，针尖泛着幽光|武器|攻击附带微弱毒素|1】' },
{ name: '御兽天赋', desc: '你对妖兽有天生的亲和力，它们很少会主动攻击你。', effects: '驯服低阶妖兽的成功率提升', bonus: { '魅力': 10 }, item: '【一袋兽粮|对低阶妖兽有致命吸引力的食物|消耗品|可用于引诱或安抚妖兽|1】' },
{ name: '木秀于林', desc: '你天资聪颖，从小就展露出远超同龄人的才华，但也因此容易招致嫉妒。', effects: '修炼速度提升10%', bonus: { '神识': 5, '气运': -3 }, item: '无' },
{ name: '雷灵体', desc: '你的身体天生亲和雷灵气，施展雷系法术事半功倍。', effects: '雷系法术威力提升10%', bonus: { '法攻': 8, '法力': 5 }, item: '无' }
],
'史诗': [
{ name: '剑术奇才', desc: '你是天生的剑客，任何剑法在你手中都能发挥出更大的威力。', effects: '所有剑系技能威力提升10%', bonus: { '物攻': 10, '物理穿透': 5 }, item: '【一把生锈的铁剑|看起来普通，但剑刃异常锋利|武器|物攻+5|1】' },
{ name: '天生灵体', desc: '你的身体与天地灵气的亲和度远超常人。', effects: '修炼速度提升15%', bonus: { '法力': 10, '法攻': 5 }, item: '无' },
{ name: '不动如山', desc: '你的防御姿态坚如磐石，极难被撼动。', effects: '受到的所有伤害降低5%', bonus: { '物防': 10, '法防': 10 }, item: '无' },
{ name: '鬼影迷踪', desc: '你的身法诡异，常常能出现在敌人意想不到的位置。', effects: '战斗中更容易发动奇袭', bonus: { '脚力': 10, '物理穿透': 5 }, item: '无' },
{ name: '百毒不侵', desc: '万千毒物，入你之体如泥牛入海。', effects: '免疫大部分毒素伤害', bonus: { '物防': 10, '法防': 10 }, item: '无' },
{ name: '阵法天才', desc: '你对阵法有着与生俱来的天赋，布阵破阵信手拈来。', effects: '布阵、破阵成功率大幅提升', bonus: { '神识': 10 }, item: '【一套阵旗阵盘|一套用于布设基础阵法的工具|法宝|无|1】' },
{ name: '丹道宗师', desc: '你仿佛是为炼丹而生，任何丹方在你手中都能化腐朽为神奇。', effects: '炼丹时有几率炼出极品丹药', bonus: { '神识': 10, '法力': 10 }, item: '【上古丹方残卷|一张古老的丹方，似乎记载着失传的丹药|重要物品|未知|1】' },
{ name: '炼器大师', desc: '你的锻造技艺巧夺天工，凡铁亦可化神兵。', effects: '炼器时有几率提升法宝一个品阶', bonus: { '物攻': 10, '神识': 10 }, item: '【天工开物残篇|记录着神乎其技的炼器法门的残篇|重要物品|未知|1】' },
{ name: '蛟龙血脉', desc: '你体内流淌着一丝上古蛟龙的血脉，肉身强横，天生能控水。', effects: '水系法术威力提升20%', bonus: { '物攻': 10, '物防': 10, '法力': -10 }, item: '【蛟龙鳞片|一片蕴含着微弱龙威的鳞片|重要物品|未知|1】' },
{ name: '七窍玲珑心', desc: '你拥有传说中的玲珑道心，悟性绝顶，任何功法到你手中都无瓶颈。', effects: '所有功法领悟速度大幅提升', bonus: { '神识': 10 }, item: '无' },
{ name: '剑心通明', desc: '你的心如一柄磨砺到极致的剑，纯粹而锋利，万法不侵。', effects: '剑系技能必定暴击; 免疫心魔入侵', bonus: { '物攻': 10, '神识': 10 }, item: '无' },
{ name: '掌中雷霆', desc: '你天生便能吸引和操控雷电，是行走的雷罚。', effects: '雷系法术威力提升25%', bonus: { '法攻': 10, '法术穿透': 5 }, item: '无' },
{ name: '缩地成寸', desc: '你对空间法则有初步的领悟，能短距离瞬移。', effects: '获得技能“瞬身”', bonus: { '脚力': 10 }, item: '无' },
{ name: '琉璃玉身', desc: '你的肉身经过千锤百炼，纯净无暇，宛若琉璃。', effects: '对所有元素伤害都有一定抗性', bonus: { '物防': 10, '法防': 10, '魅力': 10 }, item: '无' },
{ name: '魂魄强大', desc: '你的魂魄比常人强大数倍，神识攻击对你效果甚微。', effects: '神识攻击抗性极高', bonus: { '神识': 10, '法防': 10 }, item: '无' },
{ name: '魅力超凡', desc: '你的容貌和气质超凡脱俗，令人见之忘俗，心生好感。', effects: '无', bonus: { '魅力': 10 }, item: '无' },
{ name: '大气运者', desc: '冥冥之中，似乎总有气运加护于你。', effects: '奇遇几率大幅提升', bonus: { '气运': 10 }, item: '无' },
{ name: '五行轮转', desc: '你体内的五行灵力生生不息，可以互相转化。', effects: '可以学习所有属性的功法且无冲突', bonus: { '法力': 10 }, item: '无' },
{ name: '魔心', desc: '你拥有一颗魔心，修炼魔道功法一日千里，但也更容易堕入魔道。', effects: '魔道功法修炼速度加倍; 正道人士好感度降低', bonus: { '法攻': 10, '物攻': 10, '气运': -5 }, item: '【天魔策残页|一页散发着不详气息的魔道功法|功法|未知|1】' },
{ name: '佛骨', desc: '你天生慧根，与佛有缘，修炼佛法事半功倍。', effects: '佛门功法修炼速度加倍; 对魔道、鬼道有克制作用', bonus: { '法防': 10, '魅力': 10, '物攻': -5 }, item: '【一串菩提佛珠|蕴含着祥和佛性的佛珠，可静心凝神|法宝|法防+5|1】' },
{ name: '人皇血统', desc: '你的血脉源自上古人皇，天生对人族有号召力，对异族有威慑力。', effects: '无', bonus: { '魅力': 10, '气运': 10 }, item: '【人皇印记（仿）|一枚仿制的人皇玉玺，蕴含着一丝王道之气|重要物品|未知|1】' },
{ name: '药鼎之躯', desc: '你的身体是一个天然的丹炉，能以自身精血炼化万物。', effects: '无需丹炉即可炼丹，丹药效果提升', bonus: { '法力': 10, '法防': 10 }, item: '【百草经|一本记录了大量灵草图鉴和药性的古籍|重要物品|无|1】' },
{ name: '饕餮血脉', desc: '你拥有上古凶兽饕餮的血脉，能够吞噬万物化为己用。', effects: '击败敌人后可吞噬其部分修为或技能', bonus: { '物攻': 10, '气运': 5 }, item: '无' },
{ name: '天生帅才', desc: '你天生具有领袖气质和指挥才能，能让同伴发挥出更强的实力。', effects: '组队时，所有队员属性微量提升', bonus: { '魅力': 10, '神识': 10 }, item: '无' },
{ name: '苦修士', desc: '你信奉苦难是最好的修行，越是艰苦的环境，越能激发你的潜力。', effects: '在负面状态下，修炼速度和战斗力反而提升', bonus: { '物防': 10, '法防': 10, '气运': 5 }, item: '无' }
],
'传说': [
{ name: '天命之子', desc: '你仿佛受到上天的眷顾，好运常伴汝身。', effects: '奇遇几率大幅提升', bonus: { '气运': 10 }, item: '无' },
{ name: '一介武夫', desc: '你对法术一窍不通，但肉身已锤炼至极致。', effects: '无法学习任何法术; 获得专属体修技能', bonus: { '物攻': 10, '物防': 10, '法攻': -10, '法力': -10 }, item: '【龙象般若功残篇|一门强大的外家功法，似乎并不完整|功法|无|1】' },
{ name: '法道宗师', desc: '你对肉身修炼嗤之以鼻，沉醉于法术的终极奥秘。', effects: '无法造成物理伤害; 获得专属高阶法术', bonus: { '法攻': 10, '法力': 10, '物攻': -10, '物防': -10 }, item: '【大五行术残篇|记录着操控五行本源的无上法术|功法|无|1】' },
{ name: '长生血脉', desc: '你的血脉源自某个长生种，拥有远超常人的寿元和情欲。', effects: '初始寿元和情欲翻倍', bonus: { '气运': 10, '魅力': 10 }, item: '无' },
{ name: '先天道胎', desc: '你生来便是为了修道，与天地大道无比亲和。', effects: '修炼无瓶颈; 修炼速度提升50%', bonus: { '神识': 10, '法力': 10, '气运': 10 }, item: '无' },
{ name: '万兽之王', desc: '所有飞禽走兽在你面前都会低下高傲的头颅。', effects: '必定能成功驯服妖兽; 自身战斗力大幅下降', bonus: { '魅力': 10, '神识': 10, '物攻': -10, '法攻': -10 }, item: '【御兽仙笛|一支能与万兽沟通的仙笛|法宝|无|1】' },
{ name: '傀儡师', desc: '你认为肉身不过是臭皮囊，永恒不灭的傀儡才是大道。', effects: '获得专属傀儡术; 自身属性大幅削弱，但会继承傀儡部分属性', bonus: { '神识': 10, '物攻': -10, '物防': -10, '法攻': -10, '法防': -10, '脚力': -10 }, item: '【机关傀儡核心|一个可以驱动强大傀儡的核心部件|重要物品|无|1】' },
{ name: '蛊术师', desc: '你与万千毒虫为伴，驱使它们为你战斗，诡异莫测。', effects: '获得专属蛊术; 所有正道人士对你抱有敌意', bonus: { '法攻': 10, '神识': 10, '魅力': -10 }, item: '【本命蛊卵|一枚休眠中的本命蛊，需要用精血孵化|重要物品|未知|1】' },
{ name: '医者仁心', desc: '你以救死扶伤为己任，拥有妙手回春的能力。', effects: '治疗法术效果翻倍; 无法学习任何攻击性法术', bonus: { '魅力': 10, '法力': 10, '物攻': -10, '法攻': -10 }, item: '【青囊书|上古医圣留下的医书，记录了无数救死扶伤之术|功法|无|1】' },
{ name: '灾星降世', desc: '你生来便伴随着灾厄与不详，所到之处，纷争四起。', effects: '战斗中越战越勇; 极易吸引仇恨，奇遇变为厄运', bonus: { '物攻': 10, '法攻': 10, '气运': -10 }, item: '无' },
{ name: '破法之瞳', desc: '你的双眼能看破万法本源，一切法术在你面前都无所遁形。', effects: '必定能看破幻术; 施展法术时有几率使其直接失效', bonus: { '神识': 10, '法术穿透': 10 }, item: '无' },
{ name: '不灭金身', desc: '你的肉身经过秘法锻造，金刚不坏，万劫不磨。', effects: '获得伤害减免50%; 修炼速度降低20%', bonus: { '物防': 10, '法防': 10 }, item: '无' },
{ name: '凤凰血脉', desc: '你拥有神鸟凤凰的血脉，可浴火重生。', effects: '拥有一次重生的机会; 火系法术免疫', bonus: { '法攻': 10, '气运': 10 }, item: '【一根凤凰尾羽|燃烧着永不熄灭的火焰，蕴含着涅槃之力|重要物品|未知|1】' },
{ name: '魅魔之体', desc: '你的魅力男女通吃，神魔难挡。', effects: '所有社交判定必定成功，可吸取他人修为。', bonus: { '魅力': 10, '法力': 10 }, item: '无' },
{ name: '元素圣体', desc: '你由纯粹的元素构成，可以免疫同种元素伤害并吸收其能量。', effects: '开局选择一种元素免疫; 被克制元素伤害加倍', bonus: { '法攻': 10 }, item: '无' },
{ name: '太上忘情', desc: '你斩断了七情六欲，心中唯有大道。', effects: '免疫所有精神类负面效果; 无法与任何人建立正面羁绊关系', bonus: { '神识': 10, '魅力': -10 }, item: '无' },
{ name: '因果之线', desc: '你能看到万物之间的因果联系，并能进行微弱的拨动。', effects: '可以预知行动的短期后果', bonus: { '气运': 10, '神识': 10 }, item: '无' },
{ name: '窃天者', desc: '你掌握了窃取他人气运的秘法。', effects: '击败敌人后有几率窃取其部分气运', bonus: { '气运': -10, '法攻': 10, '神识': 10 }, item: '无' },
{ name: '天魔转世', desc: '你是上古天魔的一缕分魂转世，天生精通魔染和诱惑。', effects: '可将敌人转化为魔仆; 仙道功法无法修炼', bonus: { '法攻': 10, '魅力': 10, '气运': -10 }, item: '无' },
{ name: '器灵共生', desc: '你的灵魂与一件通天灵宝的器灵相伴相生。', effects: '开局获得一件成长性法宝; 自身寿元和情欲与法宝绑定', bonus: { '物攻': 10, '法攻': 10 }, item: '无' },
{ name: '画中仙', desc: '你能将神魂寄托于画卷之中，化虚为实。', effects: '获得专属画道神通; 肉身极为脆弱', bonus: { '神识': 10, '法攻': 10, '物防': -10 }, item: '【山河社稷图（仿）|一幅神异的画卷，似乎能将人吸入其中|法宝|未知|1】' },
{ name: '剑骨', desc: '你的骨骼天生便是剑之形状，是无上剑胚。', effects: '可以使用身体的任何部分作为剑来攻击，且威力巨大', bonus: { '物攻': 10, '物理穿透': 10, '物防': -10 }, item: '无' },
{ name: '入梦者', desc: '现实与梦境的界限对你而言非常模糊，你能潜入他人的梦境。', effects: '可进入他人梦境获取情报或种下心魔，但自身精神也易受影响', bonus: { '神识': 10, '魅力': 10, '法防': -10 }, item: '【安神香|一根能让人快速入睡并做个好梦的线香|消耗品|无|3】' },
{ name: '天煞孤星', desc: '你命中注定克亲克友，与你亲近的人都没有好下场。', effects: '无法与任何人建立羁绊关系，但你的修炼速度会因孤独而加快', bonus: { '物攻': 10, '法攻': 10, '魅力': -10, '气运': -10 }, item: '无' }
],
'神迹': [
{ name: '轮回者', desc: '你的灵魂深处，似乎沉睡着不属于这一世的记忆。', effects: '开局随机获得一件高阶物品或功法残篇; 偶尔会遭遇宿敌追杀', bonus: { '气运': 10, '神识': 10 }, item: '【神秘残篇|记载着不明文字的古老残页|重要物品|未知|1】' },
{ name: '噬魂之主', desc: '你天生拥有一柄诡异的魔剑，它渴望着吞噬强大的灵魂。', effects: '开局获得专属法宝‘噬魂剑’; 击杀敌人可吞噬其魂魄，永久提升1点物攻、1点法攻和1点法力', bonus: { '物攻': 10, '法攻': 10, '气运': -10 }, item: '【噬魂剑|一柄渴望灵魂的诡异魔剑|武器|击杀可吞噬魂魄，提升属性|1】' },
{ name: '道法自然', desc: '你与天地万物融为一体，不喜争斗，却能洞悉万物至理。', effects: '炼丹、炼器、制符成功率大幅提升; 更容易获得植物、灵兽的亲近', bonus: { '神识': 10, '魅力': 10, '物攻': -10, '法攻': -10 }, item: '无' },
{ name: '世界之子', desc: '你是这个世界的气运所钟，是天命真正的主角。', effects: '奇遇必定是正面效果; 濒死时必定触发奇迹存活', bonus: { '气运': 10 }, item: '无' },
{ name: '掌天瓶', desc: '你偶然获得了一个神秘的小绿瓶，似乎能催熟一切灵植。', effects: '开局获得至宝‘掌天瓶’; 可无限催熟灵药', bonus: { '气运': 10, '法力': 10 }, item: '【掌天瓶|一个能催熟灵植的神秘小绿瓶|法宝|可催熟灵药|1】' },
{ name: '鸿蒙金榜', desc: '你的名字出现在了传说中的鸿蒙金榜之上，天生便是不凡。', effects: '开局获得神级功法残篇; 所有属性随境界提升而获得额外成长', bonus: { '物攻': 10, '法攻': 10, '物防': 10, '法防': 10, '神识': 10, '法力': 10, '脚力': 10, '气运': 10 }, item: '【鸿蒙金榜残页|一页金色的纸张，记载着神级功法的开篇|功法|未知|1】' },
{ name: '与道合真', desc: '你无时无刻不处在悟道状态，修炼对你而言如同呼吸。', effects: '修炼速度提升100%; 自动领悟功法', bonus: { '神识': 10 }, item: '无' },
{ name: '言出法随', desc: '你的话语蕴含着天地法则的力量，能将想象化为现实。', effects: '战斗中可消耗大量法力直接宣告一个合理的结果', bonus: { '法力': 10, '神识': 10, '魅力': 10 }, item: '无' },
{ name: '剧本篡改者', desc: '你意识自己存在于一个故事中，并拥有一次篡改“剧情”的机会。', effects: '可免除一次必死的局面，并获得巨大优势', bonus: { '气运': 10, '神识': 10 }, item: '无' },
{ name: '观测者', desc: '你看待世界的方式与众不同，能洞悉万物的本质信息。', effects: '可以查看任何人物、物品的详细信息', bonus: { '神识': 10 }, item: '无' },
{ name: '唯一神性', desc: '你是此方世界唯一的神，但你的力量已被封印。', effects: '开局获得被封印的神器; 所有神、魔、仙、佛对你抱有敌意', bonus: { '物攻': 10, '法攻': 10, '物防': 10, '法防': 10, '神识': 10, '法力': 10, '脚力': 10, '魅力': 10, '气运': -10 }, item: '【破碎神格|曾是神祇的核心，如今光芒暗淡，力量被层层封印|重要物品|被封印|1】' },
{ name: '虚空行者', desc: '你天生便能穿梭于空间夹层之中，无视任何阻碍。', effects: '可以无视阵法、结界进行移动', bonus: { '脚力': 10 }, item: '无' },
{ name: '万法熔炉', desc: '你的身体是一个巨大的熔炉，可以吞噬、融合任何功法和血脉。', effects: '可以融合不同功法、血脉的优点，创造出全新的能力', bonus: { '物攻': 10, '法攻': 10 }, item: '无' },
{ name: '创世血脉', desc: '你的血脉源自创造这个世界的古神，拥有微弱的创世之力。', effects: '可以消耗生命力凭空创造低阶物品', bonus: { '法力': 10, '魅力': 10 }, item: '无' },
{ name: '终焉魔体', desc: '你的存在就是为了毁灭，是万物的终结。', effects: '所有攻击附带“终结”效果，对任何生物伤害加倍', bonus: { '物攻': 10, '法攻': 10, '魅力': -10 }, item: '无' },
{ name: '无限剑制', desc: '你的神海之中，藏着一个无限复制宝具的结界。', effects: '可以无限复制并使用所有见过的剑类法宝', bonus: { '神识': 10, '法力': 10, '物攻': 10 }, item: '无' },
{ name: '系统', desc: '你脑海中出现了一个名为“系统”的东西，它能发布任务，并给予奖励。', effects: '完成系统任务可获得各种奖励', bonus: { '气运': 10 }, item: '无' },
{ name: '万界之商', desc: '你拥有一个连通万界的商铺，可以买卖任何东西。', effects: '开局获得万界商铺，拥有无限灵石。', bonus: { '魅力': 10 }, item: '无' },
{ name: '暗影君王', desc: '起来。', effects: '可从任何尸体中抽取暗影士兵，无数量上限。拥有完整的君王权能。', bonus: { '法力': 10, '神识': 10 }, item: '无' },
{ name: '盘古遗泽', desc: '你继承了开天辟地之神盘古的一丝力量，力可开山，目可化日月。', effects: '肉身成长潜力无限', bonus: { '物攻': 10, '物防': 10 }, item: '无' },
{ name: '三千大道', desc: '你天生便通晓三千大道，万般法则皆在你心。', effects: '可以学习和使用任何体系的能力', bonus: { '神识': 10, '法力': 10 }, item: '无' },
{ name: '纳米核心', desc: '你是来自高等科技文明的造物，由无数纳米机器人构成。', effects: '拥有纳米战甲，可无限变形，自我修复，分析万物，免疫物理伤害。', bonus: { '物防': 10, '物攻': 10, '神识': 10 }, item: '无' },
{ name: '道法摹写者', desc: '你的双眼能看破万法本源，并完美摹写一次。', effects: '目睹任何神通后，可完美施展一次，无视大部分限制，但对灵魂负荷极大', bonus: { '神识': 10, '法力': 10, '寿元和情欲': -10 }, item: '无' },
{ name: '洪荒之体', desc: '你的身体诞生于天地开辟之前，蕴含着一丝洪荒之气。', effects: '对所有后天功法和法则都有极强的抗性，肉身万法不侵', bonus: { '物防': 10, '法防': 10, '修炼速度': -10 }, item: '无' }
                ]
            },
            LINGGEN: {
    '天灵根 金': { cost: 50 }, '天灵根 木': { cost: 50 }, '天灵根 水': { cost: 50 }, '天灵根 火': { cost: 50 }, '天灵根 土': { cost: 50 },
    '异灵根 冰': { cost: 50 }, '异灵根 风': { cost: 50 }, '异灵根 雷': { cost: 50 }, '异灵根 暗':{ cost: 50 },
    '真灵根 金, 木': { cost: 20 }, '真灵根 水, 火': { cost: 20 }, '异灵根 土, 雷': { cost: 20 },
    '伪灵根 金, 木, 水, 火': { cost: 5 }, '伪灵根 金, 木, 水, 火, 土': { cost: 2 },
    '无灵根': { cost: 0 }
}
        };
		
    function startCharacterCreation() {
const defaultAttributes = {};
Object.keys(CREATION_CONFIG.ATTRIBUTES).forEach(key => {
defaultAttributes[key] = { current: 0, max: 0 };
});

creationState = {
currentStep: 1,
totalPoints: 0,
selectedDifficulty: null,
isExtreme: false,
attributes: defaultAttributes,
selectedBirth: null,
selectedGender: null,
avatarAppearance: 'auto',
selectedPronoun: '第二人称', 
customAvatar: null,
initialAge: 16,
selectedRace: null,
customBirth: null,
customRace: null,
currentTraitOptions: [],
selectedTraits: [],
selectedLinggen: null,
bondedCharacters: [],
birthLocation: null,
deathCount: 0
};
renderCreationStep();
}
    
    function calculateRemainingPoints() {
        let points = creationState.totalPoints || 0;
        const allocatedPoints = Object.values(creationState.attributes).reduce((sum, val) => sum + (val.max || 0), 0);
        
        let birthCost = 0;
        if (creationState.selectedBirth) {
            if (creationState.selectedBirth === '自定义') {
                birthCost = CREATION_CONFIG.BIRTHS['自定义'].cost;
            } else {
                birthCost = CREATION_CONFIG.BIRTHS[creationState.selectedBirth].cost;
            }
        }

        let raceCost = 0;
        if (creationState.selectedRace) {
            if (creationState.selectedRace === '自定义') {
                    raceCost = CREATION_CONFIG.RACES['自定义'].cost;
            } else {
                raceCost = CREATION_CONFIG.RACES[creationState.selectedRace].cost;
            }
        }

        const linggenCost = creationState.selectedLinggen ? (CREATION_CONFIG.LINGGEN[creationState.selectedLinggen]?.cost || 0) : 0;
        
        const traitCost = 0; // 直接将词条消耗的点数设置为0
        
        return points - allocatedPoints - birthCost - raceCost - linggenCost - traitCost;
    }

    function renderCreationStep() {
        const contentEl = document.getElementById('creation-content');
        const navEl = document.getElementById('creation-nav');
        const indicatorEl = document.getElementById('creation-step-indicator');
        
        const steps = ['难度', '属性与出身', '性别与种族', '词条', '灵根', '最终确认'];
        indicatorEl.innerHTML = steps.map((name, i) => `<div class="step-item ${creationState.currentStep === i + 1 ? 'active' : ''}">${name}</div>`).join('');

        switch(creationState.currentStep) {
            case 1: renderStep1_Difficulty(contentEl, navEl); break;
            case 2: renderStep2_AttributesAndBirth(contentEl, navEl); break;
            case 3: renderStep3_GenderAndRace(contentEl, navEl); break;
            case 4: renderStep4_Traits(contentEl, navEl); break;
            case 5: renderStep5_Linggen(contentEl, navEl); break;
            case 6: renderStep6_Finalize(contentEl, navEl); break;
        }
    }

function renderStep1_Difficulty(contentEl, navEl) {
    contentEl.innerHTML = `
        <div class="creation-section-title">选择难度</div>
        <div class="creation-grid">
            ${Object.entries(CREATION_CONFIG.DIFFICULTIES).map(([name, data]) => `
                <div class="creation-card ${data.extreme ? 'extreme' : ''} ${creationState.selectedDifficulty === name ? 'selected' : ''}" data-difficulty="${name}" data-points="${data.points}" data-extreme="${data.extreme}">
                    <h4>${name}</h4>
                    <p>初始分配点数: <span class="cost">${data.points}</span></p>
                    ${data.desc ? `<p style="font-size:0.8em; color: #e57373;">${data.desc}</p>` : ''}
                </div>
            `).join('')}
        </div>
    `;
    navEl.innerHTML = `
        <button id="creation-back-to-splash-btn" class="major-action-button">返回主界面</button>
        <button id="creation-next-btn" class="major-action-button" ${!creationState.selectedDifficulty ? 'disabled' : ''}>下一步</button>
    `;

    contentEl.querySelectorAll('.creation-card').forEach(card => {
        card.addEventListener('click', async () => {
            const newDifficulty = card.dataset.difficulty;
            const newPoints = parseInt(card.dataset.points);
            const newExtreme = card.dataset.extreme === 'true';
            
            const oldPoints = creationState.totalPoints;
            creationState.selectedDifficulty = newDifficulty;
            creationState.totalPoints = newPoints;
            creationState.isExtreme = newExtreme;
            
            if (calculateRemainingPoints() < 0) {
                await showCustomAlert("点数不足以维持当前选择，请重新分配属性或选择。");
                creationState.selectedDifficulty = null;
                creationState.totalPoints = oldPoints;
                creationState.isExtreme = false;
                return;
            }
            
            renderCreationStep();
        });
    });

    navEl.querySelector('#creation-back-to-splash-btn').addEventListener('click', async () => {
        if (await showCustomConfirm('确定要放弃创建并返回主界面吗？')) {
            creationScreen.classList.add('hidden');
            splashScreen.classList.remove('hidden');
        }
    });

    navEl.querySelector('#creation-next-btn').addEventListener('click', () => {
        creationState.currentStep++;
        renderCreationStep();
    });
}
   
    function renderStep2_AttributesAndBirth(contentEl, navEl) {
        const remainingPoints = calculateRemainingPoints();
        
        contentEl.innerHTML = `
            <div id="points-summary">剩余点数: <span class="cost">${remainingPoints}</span></div>
            <div class="creation-section-title">分配属性点 (每项最多20点)</div>
            <div class="attribute-allocation-grid">
                ${Object.entries(CREATION_CONFIG.ATTRIBUTES).map(([key, desc]) => `
                    <div class="attribute-item">
                        <div class="name-desc">
                            <strong title="${desc}">${key}</strong>
                            <small>${desc}</small>
                        </div>
                        <div class="attribute-slider-group">
                            <input type="range" min="0" max="20" value="${creationState.attributes[key].max}" data-attr="${key}">
                            <span class="value">${creationState.attributes[key].max}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="creation-section-title">选择出身</div>
            <div class="creation-grid">
                ${Object.keys(CREATION_CONFIG.BIRTHS).map(name => {
                    const data = CREATION_CONFIG.BIRTHS[name];
                    let isSelected = false;
                    let cardContent;

                    if (name === '自定义') {
                        isSelected = creationState.selectedBirth === '自定义';
                        cardContent = `
                            <h4>自定义 <span class="cost">(${data.cost}点)</span></h4>
                            <p>${creationState.customBirth ? `已选: ${creationState.customBirth.tag}` : '点击管理自定义出身'}</p>
                        `;
                    } else {
                        isSelected = creationState.selectedBirth === name;
                        cardContent = `
                            <h4>${name} <span class="cost">(${data.cost}点)</span></h4>
                            <p>${data.desc}</p>
                            ${Object.entries(data.bonus).map(([attr, val]) => `<p class="${val > 0 ? 'bonus' : 'penalty'}">${val > 0 ? '+' : ''} ${attr} ${val}</p>`).join('')}
                        `;
                    }
                    return `<div class="creation-card ${isSelected ? 'selected' : ''}" data-birth="${name}">${cardContent}</div>`;
                }).join('')}
            </div>
        `;
        
        navEl.innerHTML = `
            <button id="creation-prev-btn" class="major-action-button">上一步</button>
            <button id="creation-next-btn" class="major-action-button" ${!creationState.selectedBirth ? 'disabled' : ''}>下一步</button>
        `;

        const updatePointsSummary = () => {
            document.getElementById('points-summary').innerHTML = `剩余点数: <span class="cost">${calculateRemainingPoints()}</span>`;
        };

        contentEl.querySelectorAll('.attribute-slider-group input[type="range"]').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const attr = e.target.dataset.attr;
                const newValue = parseInt(e.target.value);
                const oldValue = creationState.attributes[attr].max;
                const diff = newValue - oldValue;

                if (diff > 0 && calculateRemainingPoints() < diff) {
                    e.target.value = oldValue;
                    return;
                }

                creationState.attributes[attr].max = newValue;
                creationState.attributes[attr].current = newValue;
                e.target.parentElement.querySelector('.value').textContent = newValue;
                updatePointsSummary();
            });
        });

        contentEl.querySelectorAll('.creation-card[data-birth]').forEach(card => {
            card.addEventListener('click', async () => {
                const birthName = card.dataset.birth;
                
                if (birthName === '自定义') {
                    await openCustomDataSelection('birth');
                    return;
                }
                
                if (creationState.selectedBirth === birthName) return;

                const currentRemaining = calculateRemainingPoints();
                const oldCost = creationState.selectedBirth ? CREATION_CONFIG.BIRTHS[creationState.selectedBirth].cost : 0;
                const newCost = CREATION_CONFIG.BIRTHS[birthName].cost;
                
                if (currentRemaining + oldCost < newCost) {
                    await showCustomAlert('属性点不足，无法选择此出身！');
                    return;
                }
                
                creationState.selectedBirth = birthName;
                creationState.customBirth = null;
                renderCreationStep();
            });
        });

        navEl.querySelector('#creation-prev-btn').addEventListener('click', () => {
            creationState.currentStep--;
            renderCreationStep();
        });
        navEl.querySelector('#creation-next-btn').addEventListener('click', () => {
            creationState.currentStep++;
            renderCreationStep();
        });
    }
    
    function renderStep3_GenderAndRace(contentEl, navEl) {
const remainingPoints = calculateRemainingPoints();
contentEl.innerHTML = `
<div id="points-summary">剩余点数: <span class="cost">${remainingPoints}</span></div>
<div class="creation-section-title">选择性别</div>
<div class="creation-grid">
${Object.entries(CREATION_CONFIG.GENDERS).map(([key, data]) => `
<div class="creation-card ${creationState.selectedGender === key ? 'selected' : ''}" data-gender="${key}">
<h4>${key}</h4>
${data.effects.map(effect => `<p>${effect}</p>`).join('')}
</div>
`).join('')}
</div>
<div class="custom-input-group">
<div class="creation-options-group">
<label>初始年龄:</label>
<input type="number" id="creation-age-input" min="1" max="999" value="${creationState.initialAge}">
</div>
<div class="creation-options-group">
<label>法相外观:</label>
<label><input type="radio" name="avatarAppearance" value="auto" ${creationState.avatarAppearance === 'auto' ? 'checked' : ''}> 自动</label>
<label><input type="radio" name="avatarAppearance" value="男性" ${creationState.avatarAppearance === '男性' ? 'checked' : ''}> 男性</label>
<label><input type="radio" name="avatarAppearance" value="女性" ${creationState.avatarAppearance === '女性' ? 'checked' : ''}> 女性</label>
</div>
<!-- 【新增】人称选择 -->
<div class="creation-options-group">
<label>人称选择:</label>
<label><input type="radio" name="pronounSelection" value="第一人称" ${creationState.selectedPronoun === '第一人称' ? 'checked' : ''}> 第一人称 (我)</label>
<label><input type="radio" name="pronounSelection" value="第二人称" ${creationState.selectedPronoun === '第二人称' ? 'checked' : ''}> 第二人称 (你)</label>
<label><input type="radio" name="pronounSelection" value="第三人称" ${creationState.selectedPronoun === '第三人称' ? 'checked' : ''}> 第三人称 ({{user}})</label>
</div>
<button id="upload-custom-avatar-btn" class="major-action-button" style="margin-top: 10px;"><i class="fas fa-image"></i> 上传自定义形象</button>
</div>

<div class="creation-section-title">选择种族</div>
<div class="creation-grid">
${Object.keys(CREATION_CONFIG.RACES).map(name => {
const data = CREATION_CONFIG.RACES[name];
let isSelected = false;
let cardContent;

if (name === '自定义') {
isSelected = creationState.selectedRace === '自定义';
cardContent = `
<h4>自定义 <span class="cost">(${data.cost}点)</span></h4>
<p>${creationState.customRace ? `已选: ${creationState.customRace.tag}` : '点击管理自定义种族'}</p>
`;
} else {
isSelected = creationState.selectedRace === name;
cardContent = `
<h4>${name} ${data.cost > 0 ? `<span class="cost">(${data.cost}点)</span>` : ''}</h4>
<p>${data.desc}</p>
${Object.entries(data.bonus).map(([attr, val]) => `<p class="${val > 0 ? 'bonus' : 'penalty'}">${val > 0 ? '+' : ''} ${attr} ${val}</p>`).join('')}
`;
}
return `<div class="creation-card ${isSelected ? 'selected' : ''}" data-race="${name}">${cardContent}</div>`;
}).join('')}
</div>
`;

navEl.innerHTML = `
<button id="creation-prev-btn" class="major-action-button">上一步</button>
<button id="creation-next-btn" class="major-action-button" ${(!creationState.selectedGender || !creationState.selectedRace) ? 'disabled' : ''}>下一步</button>
`;

contentEl.querySelectorAll('[data-gender]').forEach(card => {
card.addEventListener('click', () => {
creationState.selectedGender = card.dataset.gender;
renderCreationStep();
});
});

document.getElementById('creation-age-input').addEventListener('change', (e) => {
creationState.initialAge = parseInt(e.target.value) || 16;
});
document.querySelectorAll('input[name="avatarAppearance"]').forEach(radio => {
radio.addEventListener('change', (e) => {
creationState.avatarAppearance = e.target.value;
});
});

document.querySelectorAll('input[name="pronounSelection"]').forEach(radio => {
radio.addEventListener('change', (e) => {
creationState.selectedPronoun = e.target.value;
});
});
document.getElementById('upload-custom-avatar-btn').addEventListener('click', () => avatarUploadInput.click());

contentEl.querySelectorAll('[data-race]').forEach(card => {
card.addEventListener('click', async () => {
const raceName = card.dataset.race;
if (raceName === '自定义') {
await openCustomDataSelection('race');
return;
}
if (creationState.selectedRace === raceName) return;

const currentRemaining = calculateRemainingPoints();
const oldCost = creationState.selectedRace ? CREATION_CONFIG.RACES[creationState.selectedRace].cost : 0;
const newCost = CREATION_CONFIG.RACES[raceName].cost;

if (currentRemaining + oldCost < newCost) {
await showCustomAlert('属性点不足，无法选择此种族！');
return;
}

creationState.selectedRace = raceName;
creationState.customRace = null;
renderCreationStep();
});
});

navEl.querySelector('#creation-prev-btn').addEventListener('click', () => {
creationState.currentStep--;
renderCreationStep();
});
navEl.querySelector('#creation-next-btn').addEventListener('click', () => {
creationState.currentStep++;
renderCreationStep();
});
}
    
function renderStep4_Traits(contentEl, navEl) {
const remainingPoints = calculateRemainingPoints();
const MAX_TRAITS = 5; 

contentEl.innerHTML = `
<div id="points-summary">剩余点数: <span class="cost">${remainingPoints}</span></div>
<div id="trait-selection-area">
<div id="trait-selection-controls">
<button id="trait-randomize-btn" class="major-action-button">逆天改命 (10点)</button>
<button id="self-select-trait-btn" class="major-action-button" ${remainingPoints < 9000 ? 'disabled' : ''}>自选词条 (9000点)</button>
<button id="view-selected-traits-btn" class="major-action-button">已选词条 <span id="selected-traits-count">${creationState.selectedTraits.length}</span>/${MAX_TRAITS}</button> <!-- 【修改】显示数量限制 -->
<button id="manage-custom-traits-btn" class="major-action-button"><i class="fas fa-plus-circle"></i> 管理自定义词条</button>
</div>
<div id="trait-options-container">
${creationState.currentTraitOptions.map(trait => {
const isSelected = creationState.selectedTraits.some(t => t.name === trait.name);
return `
<div class="trait-card rarity-${trait.rarity} ${isSelected ? 'selected' : ''}" data-trait-name="${trait.name}">
<div class="trait-rarity">${trait.rarity}</div>
<div class="trait-name">${trait.name}</div>
<button class="trait-detail-btn"><i class="fas fa-info-circle"></i></button>
</div>
`;
}).join('')}
</div>
</div>
`;

navEl.innerHTML = `
<button id="creation-prev-btn" class="major-action-button">上一步</button>
<button id="creation-next-btn" class="major-action-button">下一步</button>
`;

document.getElementById('trait-randomize-btn').addEventListener('click', handleRandomizeTraits);
document.getElementById('self-select-trait-btn').addEventListener('click', openSelfSelectTraitModal);
document.getElementById('view-selected-traits-btn').addEventListener('click', openSelectedTraitsViewer);
document.getElementById('manage-custom-traits-btn').addEventListener('click', openCustomTraitManager);

contentEl.querySelectorAll('.trait-card').forEach(card => {
card.addEventListener('click', (e) => {
if (e.target.closest('.trait-detail-btn')) return;
handleTraitSelect(card.dataset.traitName);
});
card.querySelector('.trait-detail-btn').addEventListener('click', () => {
const trait = creationState.currentTraitOptions.find(t => t.name === card.dataset.traitName);
if (trait) showTraitDetail(trait);
});
});

navEl.querySelector('#creation-prev-btn').addEventListener('click', () => {
creationState.currentStep--;
renderCreationStep();
});
navEl.querySelector('#creation-next-btn').addEventListener('click', () => {
creationState.currentStep++;
renderCreationStep();
});
}

    async function handleRandomizeTraits() {
        const cost = 10;
        if (calculateRemainingPoints() < cost) {
            await showCustomAlert('属性点不足，无法刷新词条！');
            return;
        }
        
        creationState.totalPoints -= cost;
        
        const container = document.getElementById('trait-options-container');
        container.classList.add('animating');
        
        setTimeout(async () => {
            creationState.currentTraitOptions = await generateRandomTraits();
            renderCreationStep();
        }, 250);
    }
    
    async function generateRandomTraits() {
        const allTraits = [];
        for (const rarity in CREATION_CONFIG.TRAITS) {
            CREATION_CONFIG.TRAITS[rarity].forEach(trait => {
                allTraits.push({ ...trait, rarity });
            });
        }

        const customTraits = await getCustomTraits();
        const activeCustomTraits = customTraits.filter(t => t.inPool);
        allTraits.push(...activeCustomTraits);

        const traits = [];
        const rarityPool = [
            ...Array(40).fill('平庸'), ...Array(30).fill('普通'), ...Array(15).fill('稀有'),
            ...Array(10).fill('史诗'), ...Array(4).fill('传说'), ...Array(1).fill('神迹')
        ];
        
        while(traits.length < 6) {
            const randRarity = rarityPool[Math.floor(Math.random() * rarityPool.length)];
            const traitPool = allTraits.filter(t => t.rarity === randRarity);
            if (traitPool.length === 0) continue;
            
            const randTrait = traitPool[Math.floor(Math.random() * traitPool.length)];
            if (!traits.some(t => t.name === randTrait.name)) {
                traits.push(randTrait);
            }
        }
        return traits;
    }

async function handleTraitSelect(traitName, isSelfSelected = false) {
const MAX_TRAITS = 5; 

const traitIndex = creationState.selectedTraits.findIndex(t => t.name === traitName);

if (traitIndex > -1) {

creationState.selectedTraits.splice(traitIndex, 1);
} else {

if (creationState.selectedTraits.length >= MAX_TRAITS) {

await showCustomAlert(`最多只能选择 ${MAX_TRAITS} 个词条！`);
return; 
}

let trait;
if (isSelfSelected) {
const allTraits = [];
for (const rarity in CREATION_CONFIG.TRAITS) {
CREATION_CONFIG.TRAITS[rarity].forEach(t => allTraits.push({
...t,
rarity
}));
}
allTraits.push(...await getCustomTraits());
trait = allTraits.find(t => t.name === traitName);
} else {
trait = creationState.currentTraitOptions.find(t => t.name === traitName);
}

if (trait) {
creationState.selectedTraits.push(trait);
}
}
renderCreationStep();
}

    function openSelectedTraitsViewer() {
        const listEl = document.getElementById('selected-traits-list');
        listEl.innerHTML = '';

        if (creationState.selectedTraits.length === 0) {
            listEl.innerHTML = '<li>尚未选择任何词条。</li>';
        } else {
            creationState.selectedTraits.forEach(trait => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${trait.name}</span>
                    <button data-trait-name="${trait.name}">取消选择</button>
                `;
                listEl.appendChild(li);
            });
        }

        listEl.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                const name = e.target.dataset.traitName;
                handleTraitSelect(name);
                openSelectedTraitsViewer(); 
            });
        });
        
        selectedTraitsOverlay.classList.add('visible');
    }

    async function openSelfSelectTraitModal() {
const cost = 9000;
if (calculateRemainingPoints() < cost) {
await showCustomAlert('属性点不足，无法自选词条！');
return;
}

const allTraits = [];
for (const rarity in CREATION_CONFIG.TRAITS) {
CREATION_CONFIG.TRAITS[rarity].forEach(trait => {
allTraits.push({ ...trait, rarity });
});
}
const customTraits = await getCustomTraits();
allTraits.push(...customTraits.filter(t => t.inPool));

const grid = document.getElementById('self-select-trait-grid');
grid.innerHTML = '';
allTraits.forEach(trait => {
const isSelected = creationState.selectedTraits.some(t => t.name === trait.name);
const card = document.createElement('div');
card.className = `trait-card rarity-${trait.rarity}`;
card.dataset.traitName = trait.name; // 为卡片添加 data-trait-name


card.innerHTML = `
<div class="trait-rarity">${trait.rarity}</div>
<div class="trait-name">${trait.name}</div>
<button class="trait-detail-btn"><i class="fas fa-info-circle"></i></button>
`;

if(isSelected) {
card.classList.add('selected');
}


card.addEventListener('click', () => {
creationState.totalPoints -= cost;
handleTraitSelect(trait.name, true);
selfSelectTraitOverlay.classList.remove('visible');
});


const detailBtn = card.querySelector('.trait-detail-btn');
detailBtn.addEventListener('click', (e) => {
e.stopPropagation(); // 阻止点击事件冒泡到卡片上，避免触发选择逻辑
const traitToShow = allTraits.find(t => t.name === card.dataset.traitName);
if (traitToShow) {
showTraitDetail(traitToShow);
}
});

grid.appendChild(card);
});

selfSelectTraitOverlay.classList.add('visible');
}
    function showTraitDetail(trait) {
        if (!trait) return;
        document.getElementById('trait-detail-name').textContent = trait.name;
        const rarityEl = document.getElementById('trait-detail-rarity');
        const rarity = CREATION_CONFIG.TRAIT_RARITIES[trait.rarity] ? trait.rarity : '普通';
        rarityEl.textContent = rarity;
        rarityEl.style.color = CREATION_CONFIG.TRAIT_RARITIES[rarity].color;
        document.getElementById('trait-detail-desc').textContent = trait.desc;
        document.getElementById('trait-detail-effects').textContent = trait.effects;
        
        const bonusesEl = document.getElementById('trait-detail-bonuses');
        bonusesEl.innerHTML = '';
        if (trait.bonus && Object.keys(trait.bonus).length > 0) {
            Object.entries(trait.bonus).forEach(([attr, val]) => {
                const row = document.createElement('div');
                row.className = 'trait-detail-row';
                row.innerHTML = `
                    <span class="trait-detail-label">${attr}</span>
                    <span class="trait-detail-value ${val > 0 ? 'bonus' : 'penalty'}">${val > 0 ? '+' : ''}${val}</span>
                `;
                bonusesEl.appendChild(row);
            });
        }
        
        traitDetailOverlay.classList.add('visible');
    }

    function renderStep5_Linggen(contentEl, navEl) {
        const remainingPoints = calculateRemainingPoints();
        contentEl.innerHTML = `
            <div id="points-summary">剩余点数: <span class="cost">${remainingPoints}</span></div>
            <div id="linggen-selection-area">
                <p>你的灵根决定了你的修炼速度和功法契合度。</p>
                <div id="linggen-result-display">
                    ${creationState.selectedLinggen ? createLinggenOrb(creationState.selectedLinggen).outerHTML : '待测定...'}
                </div>
                <button id="randomize-linggen-btn" class="major-action-button" ${remainingPoints < 2 ? 'disabled' : ''}>随机灵根 (消耗2点)</button>
                <button id="self-select-linggen-btn" class="major-action-button">自选灵根 (消耗点数)</button>
            </div>
        `;
        
        navEl.innerHTML = `
            <button id="creation-prev-btn" class="major-action-button">上一步</button>
            <button id="creation-next-btn" class="major-action-button" ${!creationState.selectedLinggen ? 'disabled' : ''}>下一步</button>
        `;
        
        document.getElementById('randomize-linggen-btn').addEventListener('click', handleRandomizeLinggen);
        document.getElementById('self-select-linggen-btn').addEventListener('click', openSelfSelectLinggenModal);

        navEl.querySelector('#creation-prev-btn').addEventListener('click', () => {
            creationState.currentStep--;
            renderCreationStep();
        });
        navEl.querySelector('#creation-next-btn').addEventListener('click', () => {
            creationState.currentStep++;
            renderCreationStep();
        });
    }
    
    function createLinggenOrb(name, isSelectable = false) {
        if (!name) return document.createElement('div');

        // 1. 解析灵根名称来获取类型和元素
        const parts = name.split(' ');
        const type = parts[0]; // e.g., "真灵根"
        const elements = parts.slice(1).map(el => el.replace(',', '')); // e.g., ["木", "雷"]

        // 如果无法解析出类型，则返回空div
        if (!type) return document.createElement('div');

        // 2. 尝试从配置中获取预设数据（主要为了获取自选时的cost）
        const data = CREATION_CONFIG.LINGGEN[name];

        const orb = document.createElement('div');
        // 3. 样式只依赖于解析出的`type`
        orb.className = `linggen-orb orb-type-${type}`;
        orb.innerHTML = `
            <div class="linggen-tag tag-type-${type}">${type}</div>
            <div class="linggen-elements">${elements.join(' ')}</div>
            ${(isSelectable && data) ? `<div class="linggen-cost">${data.cost}点</div>` : ''}
        `;

        // 4. 如果是用于自选面板，则添加点击事件
        if (isSelectable && data) {
            orb.onclick = async () => {
                const oldCost = creationState.selectedLinggen ? (CREATION_CONFIG.LINGGEN[creationState.selectedLinggen]?.cost || 0) : 0;
                if (calculateRemainingPoints() + oldCost < data.cost) {
                    await showCustomAlert('点数不足，无法选择此灵根！');
                    return;
                }
                creationState.selectedLinggen = name;
                selfSelectLinggenOverlay.classList.remove('visible');
                renderCreationStep();
            };
        }
        
        return orb;
    }

        async function handleRandomizeLinggen() {
            const cost = 2;
            const oldCost = creationState.selectedLinggen ? (CREATION_CONFIG.LINGGEN[creationState.selectedLinggen]?.cost || 0) : 0;
            if (calculateRemainingPoints() + oldCost < cost) {
                await showCustomAlert('属性点不足，无法测定灵根！');
                return;
            }
            
            creationState.totalPoints -= cost;

            const roll = Math.random() * 100;
            let numAttributes;
            let type;

            if (roll < 2) {
                numAttributes = 1;
                type = "天灵根";
            } else if (roll < 22) {
                numAttributes = Math.random() < 0.7 ? 2 : 3;
                type = "真灵根";
            } else if (roll < 23) {
                creationState.selectedLinggen = '无灵根';
                renderCreationStep();
                return;
            } else {
                numAttributes = Math.random() < 0.8 ? 4 : 5;
                type = "伪灵根";
            }

            const baseStandardAttributes = ['金', '木', '水', '火', '土'];
            const baseSpecialAttributes = ['冰', '风', '雷', '暗'];

            const standardAttributeWeight = 76;
            const specialAttributeWeight = 5;

            let allPossibleAttributes = [];

            for (const attr of baseStandardAttributes) {
                for (let i = 0; i < standardAttributeWeight; i++) {
                    allPossibleAttributes.push(attr);
                }
            }

            for (const attr of baseSpecialAttributes) {
                for (let i = 0; i < specialAttributeWeight; i++) {
                    allPossibleAttributes.push(attr);
                }
            }

            const selectedAttributes = [];
            let hasSpecialElement = false;

            while (selectedAttributes.length < numAttributes) {
                if (selectedAttributes.length === new Set(allPossibleAttributes).size) {
                    break;
                }

                const randomIndex = Math.floor(Math.random() * allPossibleAttributes.length);
                const attribute = allPossibleAttributes[randomIndex];

                if (!selectedAttributes.includes(attribute)) {
                    selectedAttributes.push(attribute);
                    if (baseSpecialAttributes.includes(attribute)) {
                        hasSpecialElement = true;
                    }
                }
            }

            if (hasSpecialElement) {
                type = "异灵根";
            }

            let linggenName = type;
            if (selectedAttributes.length > 0) {
                linggenName += ' ' + selectedAttributes.join(',');
            }

            creationState.selectedLinggen = linggenName;
            renderCreationStep();
        }


    function openSelfSelectLinggenModal() {
        const contentEl = selfSelectLinggenOverlay.querySelector('.modal-content');
        contentEl.innerHTML = '';
        for(const name in CREATION_CONFIG.LINGGEN) {
            // 现在createLinggenOrb自己处理点击事件了
            const orb = createLinggenOrb(name, true);
            contentEl.appendChild(orb);
        }
        selfSelectLinggenOverlay.classList.add('visible');
    }

    function renderStep6_Finalize(contentEl, navEl) {
        const remainingPoints = calculateRemainingPoints();
        contentEl.innerHTML = `
            <div id="points-summary">剩余点数: <span class="cost">${remainingPoints}</span></div>
            <div id="finalize-options" style="grid-template-columns: 1fr 1fr; gap: 10px;">
<button id="select-birth-location-btn" class="major-action-button" style="grid-column: 1 / 2;"><i class="fas fa-map-marker-alt"></i> 选择出生地</button>
<button id="manage-global-map-btn" class="major-action-button" style="grid-column: 2 / 3;"><i class="fas fa-globe"></i> 切换地图</button>
<button id="select-bonded-char-btn" class="major-action-button" style="grid-column: 1 / -1;"><i class="fas fa-user-plus"></i> 选择羁绊人物</button>
</div>
            <div class="creation-grid">
                <div class="finalize-summary-box">
                    <h4><i class="fas fa-map-marked-alt"></i> 出生地</h4>
                    <p id="birth-location-display">${creationState.birthLocation ? creationState.birthLocation.split('|')[0] : '尚未选择'}</p>
                </div>
                <div class="finalize-summary-box">
                    <h4><i class="fas fa-heart"></i> 羁绊人物</h4>
                    <ul id="bonded-chars-list">
                        ${creationState.bondedCharacters.length === 0 ? '<li>无</li>' : 
                            creationState.bondedCharacters.map((char, index) => `
                                <li>
                                    <span><strong class="char-name">${char.name}</strong> (${char.gender}) - <span class="char-relation">${char.identity}</span></span>
                                    <i class="fas fa-trash delete-char-btn" data-id="${char.id}"></i>
                                </li>
                            `).join('')
                        }
                    </ul>
                </div>
            </div>
        `;
        
        navEl.innerHTML = `
            <button id="creation-prev-btn" class="major-action-button">上一步</button>
            <button id="start-game-btn" class="major-action-button" ${!creationState.birthLocation ? 'disabled' : ''}>开始人生</button>
        `;

        document.getElementById('select-bonded-char-btn').addEventListener('click', openBondedCharacterSelection);
        document.getElementById('select-birth-location-btn').addEventListener('click', openMapSelection);
        document.getElementById('manage-global-map-btn').addEventListener('click', openMapManagement);
        document.getElementById('map-management-overlay').querySelector('.modal-close-btn').addEventListener('click', () => {
        document.getElementById('map-management-overlay').classList.remove('visible');
        });

document.getElementById('set-default-map-btn').addEventListener('click', setDefaultMap);


        contentEl.querySelectorAll('.delete-char-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idToDelete = e.target.dataset.id;
                creationState.bondedCharacters = creationState.bondedCharacters.filter(c => c.id !== idToDelete);
                renderCreationStep();
            });
        });

        navEl.querySelector('#creation-prev-btn').addEventListener('click', () => {
            creationState.currentStep--;
            renderCreationStep();
        });
        navEl.querySelector('#start-game-btn').addEventListener('click', handleStartGame);
    }

    function sanitizeCustomTraitForGameState(trait) {
        return {
            name: trait.name,
            desc: trait.desc,
            effects: trait.effects,
            bonus: trait.bonus,
            rarity: trait.rarity
        };
    }
	

function getTavernCharInfo() {
    return new Promise((resolve, reject) => {
        // 检查通信接口是否存在
        if (typeof eventEmit !== 'function' || typeof eventOn !== 'function') {
            console.error('通信接口 (eventEmit/eventOn) 未定义。');
            return reject(new Error('通信接口未定义。'));
        }

        const requestId = `tavern_char_info_${Date.now()}`;
        let responseReceived = false;

        const responseListener = (responseData) => {
            if (responseData.id === requestId) {
                responseReceived = true;
                // 清理监听器，防止内存泄漏
                if (window.eventRemoveListener) {
                    window.eventRemoveListener('get-tavern-char-info-response', responseListener);
                }
                
                if (responseData.success && responseData.data) {
                    resolve(responseData.data); // 成功，返回数据
                } else {
                    reject(new Error(responseData.error || '获取角色信息失败。')); // 失败，返回错误信息
                }
            }
        };

        // 设置一个超时，防止请求无响应
        setTimeout(() => {
            if (!responseReceived) {
                 if (window.eventRemoveListener) {
                    window.eventRemoveLossener('get-tavern-char-info-response', responseListener);
                }
                reject(new Error('获取角色信息超时。'));
            }
        }, 10000); // 10秒超时

        // 绑定一次性监听器并发送请求
        eventOn('get-tavern-char-info-response', responseListener);
        eventEmit('get-tavern-char-info-request', { id: requestId });
    });
}

async function handleStartGame() {
const startButton = this;
startButton.disabled = true;
startButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在创建存档...';
try {
const archiveName = await showCustomPrompt("为你的新人生命名:", "我的修仙路");
if (!archiveName) {
console.log("用户取消了创建。");
return;
}

const existing = await db.archives.get(archiveName);
if (existing) {
await showCustomAlert("该名称的存档已存在，请换个名字！");
return;
}


let pronoun = '你';
let finalPlayerName = '你';
switch (creationState.selectedPronoun) {
case '第一人称':
pronoun = '我';
finalPlayerName = '我';
break;
case '第三人称':
pronoun = '{{user}}';
finalPlayerName = '{{user}}';
break;
}

const finalAttributes = {};
Object.keys(CREATION_CONFIG.ATTRIBUTES).forEach(key => {
const maxVal = creationState.attributes[key].max || 0;
finalAttributes[key] = { current: maxVal, max: maxVal };
});

let birthName, birthDesc, birthBonus;
if(creationState.selectedBirth === '自定义') {
birthName = creationState.customBirth.name;
birthDesc = creationState.customBirth.description;
birthBonus = creationState.customBirth.attributes;
} else {
const birthData = CREATION_CONFIG.BIRTHS[creationState.selectedBirth];
birthName = creationState.selectedBirth;
birthDesc = birthData.desc;
birthBonus = birthData.bonus;
}
if(birthBonus) {
Object.entries(birthBonus).forEach(([key, val]) => {
if (finalAttributes[key]) {
finalAttributes[key].max += val;
finalAttributes[key].current += val;
}
});
}

let raceName, raceDesc, raceBonus;
if(creationState.selectedRace === '自定义') {
raceName = creationState.customRace.name;
raceDesc = creationState.customRace.description;
raceBonus = creationState.customRace.attributes;
} else {
const raceData = CREATION_CONFIG.RACES[creationState.selectedRace];
raceName = creationState.selectedRace;
raceDesc = raceData.desc;
raceBonus = raceData.bonus;
}
if(raceBonus) {
Object.entries(raceBonus).forEach(([key, val]) => {
if (finalAttributes[key]) {
finalAttributes[key].max += val;
finalAttributes[key].current += val;
}
});
}
const startingInventory = [];
const sanitizedTraits = [];
creationState.selectedTraits.forEach(trait => {
const cleanTrait = sanitizeCustomTraitForGameState(trait);
sanitizedTraits.push(cleanTrait);
if (trait.bonus) {
Object.entries(trait.bonus).forEach(([key, val]) => {
if (finalAttributes[key]) {
finalAttributes[key].max += val;
finalAttributes[key].current += val;
}
});
}
if (trait.item && trait.item !== '无') {
const itemMatch = trait.item.match(/【(.*?)】/);
if (itemMatch) {
const parts = itemMatch[1].split('|');
startingInventory.push({
name: parts[0] || '未知物品',
description: parts[1] || '先天气运带来的物品',
type: parts[2] || '重要物品',
effect: parts[3] || '未知',
quantity: parseInt(parts[4] || '1')
});
}
}
});

const [mainLoc, subLoc] = creationState.birthLocation.split('|')[0].split('/');

let openingMonologue = `
<div class="log-entry summary">
<h4>天道初启</h4>
<p>${pronoun}以 <strong>${birthName}</strong> 的身份出身。${birthDesc}</p>
<p>${pronoun}的种族为 <strong>${raceName}</strong>。${raceDesc}</p>
<p>${pronoun}的灵根为: <strong>${creationState.selectedLinggen}</strong></p>
<details><summary><strong>${pronoun}的先天气运</strong></summary><ul>${sanitizedTraits.map(trait => `<li><strong>[${trait.rarity}] ${trait.name}:</strong> ${trait.desc}</li>`).join('') || '<li>无</li>'}</ul></details>
<details><summary><strong>${pronoun}的最终属性</strong></summary><ul>${Object.entries(finalAttributes).map(([key, val]) => `<li>${key}: ${val.current}/${val.max}</li>`).join('')}</ul></details>
${creationState.bondedCharacters.length > 0 ? `<details><summary><strong>${pronoun}的羁绊之人</strong></summary><ul>${creationState.bondedCharacters.map(c => `<li><strong>${c.name} (${c.identity}):</strong> ${c.background}</li>`).join('')}</ul></details>` : ''}
<p>${pronoun}的故事，将在 <strong>${mainLoc}${subLoc ? `的${subLoc}` : ''}</strong> 开始...</p>
</div>
`;

const newTableState = getInitialTableState();
const playerRemarks = `灵根:${creationState.selectedLinggen}|善恶值:0|年龄:${creationState.initialAge}|寿元:100|修为进度:0%|hp:100/100|traits:${JSON.stringify(sanitizedTraits)}|avatar:${creationState.avatarAppearance}|isExtreme:${creationState.isExtreme}|warehouse:[]|deathCount:0`;
const playerRow = {
"0": "B1",
"1": `${finalPlayerName}|${creationState.selectedGender}`,
"2": `凡人|${birthName}`,
"3": "待定", "4": "一切正常", "5": "待定", "6": "待定", "7": "待定", "8": "待定",
"9": playerRemarks,
"10": "待定", "11": JSON.stringify(finalAttributes), "12": "待定", "13": "", "14": "", "15": "", "16": "待定"
};
newTableState['0']['B1'] = playerRow;
creationState.bondedCharacters.forEach((c, index) => {
const bondId = `G${index + 1}`;
const remarks = `年龄:${c.age}|寿元:${c.shouyuan}`;
newTableState['0'][bondId] = {
"0": bondId, "1": `${c.name}|${c.gender}`, "2": `${c.realm}|${c.identity}`,
"3": c.personality, "4": "一切正常", "9": remarks, "10": c.background,
"11": c.attributes, "12": c.motive, "15": c.favorability,
"16": `|${c.attire}||${c.figure}|${c.appearance}`
};
});
startingInventory.forEach((item, index) => {
const itemId = `I${index+1}`;
newTableState['1'][itemId] = {
"0": itemId, "1": item.name, "2": item.type, "3": item.description,
"4": item.effect, "5": item.quantity.toString()
};
});

newTableState['4'][0] = { "id": TIME_LOCATION_ROW_ID, "0": `0001年 01月 01日 08:00/${creationState.birthLocation}` };


const newArchive = {
name: archiveName,
data: {
logs: [{
id: crypto.randomUUID(),
timestamp: new Date().toISOString(),
content: openingMonologue.trim(),
stateSnapshot: JSON.stringify(newTableState)
}],
state: {
currentState: newTableState,
bondedCharacters: {},
rpgMaps: {},
achievements: { completed: [], custom: [] },
npcAvatars: {},
worldMap: JSON.parse(JSON.stringify(DEFAULT_WORLD_MAP_DATA))
}
}
};

await db.archives.add(newArchive);
creationScreen.classList.add('hidden');
cultivationPanel.classList.remove('hidden');
await selectAndLoadArchive(archiveName);
await showCustomAlert("存档创建成功，你的人生开始了！");
} catch (error) {
console.error('创建存档时发生严重错误:', error);
await showCustomAlert(`创建存档失败: ${error.message}`);

} finally {
startButton.disabled = false;
startButton.innerHTML = '开始人生';
}
}
    async function getCustomTraits() {
        return await dbGet(CUSTOM_TRAITS_KEY) || [];
    }

    async function saveCustomTraits(traits) {
        await dbSet(CUSTOM_TRAITS_KEY, traits);
    }

    async function openCustomTraitManager() {
        await renderCustomTraitManager();
        customTraitManagerOverlay.classList.add('visible');
    }

    async function renderCustomTraitManager() {
        const listEl = document.getElementById('custom-traits-list');
        const traits = await getCustomTraits();
        listEl.innerHTML = '';

        if (traits.length === 0) {
            listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">尚未创建任何自定义词条。</p>';
            return;
        }

        traits.forEach((trait, index) => {
            const item = document.createElement('div');
            item.className = 'custom-trait-item';
            item.innerHTML = `
                <input type="checkbox" data-index="${index}">
                <span class="trait-rarity" style="color: ${CREATION_CONFIG.TRAIT_RARITIES[trait.rarity].color};">${trait.rarity}</span>
                <span class="trait-name">${trait.name}</span>
                <span class="active-indicator">${trait.inPool ? '<i class="fas fa-check-circle"></i>' : ''}</span>
            `;
            item.addEventListener('dblclick', () => openCustomTraitEditor(index));
            listEl.appendChild(item);
        });
    }

    async function openCustomTraitEditor(index = -1) {
        currentEditingTraitIndex = index;
        const isEditing = index > -1;
        const traits = await getCustomTraits();
        const trait = isEditing ? traits[index] : {};

        document.getElementById('custom-trait-editor-title').textContent = isEditing ? '编辑词条' : '创建新词条';
        
        const raritySelect = document.getElementById('custom-trait-rarity');
        raritySelect.innerHTML = Object.keys(CREATION_CONFIG.TRAIT_RARITIES).map(r => `<option value="${r}">${r}</option>`).join('');
        raritySelect.value = trait.rarity || '平庸';

        document.getElementById('custom-trait-name').value = trait.name || '';
        document.getElementById('custom-trait-desc').value = trait.desc || '';
        document.getElementById('custom-trait-effects').value = trait.effects || '无';

        const bonusGrid = document.getElementById('custom-trait-bonus-grid');
        bonusGrid.innerHTML = Object.keys(CREATION_CONFIG.ATTRIBUTES).map(attr => `
            <div class="attribute-item">
                <div class="name-desc"><strong>${attr}</strong></div>
                <div class="attribute-slider-group">
                    <input type="number" class="custom-trait-bonus-input" data-attr="${attr}" value="${(trait.bonus && trait.bonus[attr]) || 0}">
                </div>
            </div>
        `).join('');

        const itemTypeSelect = document.getElementById('custom-trait-item-type');
        itemTypeSelect.innerHTML = Object.keys(itemIconMap).map(type => `<option value="${type}">${type}</option>`).join('');
        
        if (trait.item && trait.item !== '无') {
            const itemMatch = trait.item.match(/【(.*?)】/);
            if (itemMatch) {
                const parts = itemMatch[1].split('|');
                document.getElementById('custom-trait-item-name').value = parts[0] || '';
                document.getElementById('custom-trait-item-desc').value = parts[1] || '';
                itemTypeSelect.value = parts[2] || '默认';
                document.getElementById('custom-trait-item-effect').value = parts[3] || '';
                document.getElementById('custom-trait-item-quantity').value = parts[4] || '1';
            }
        } else {
            document.getElementById('custom-trait-item-name').value = '';
            document.getElementById('custom-trait-item-desc').value = '';
            itemTypeSelect.value = '默认';
            document.getElementById('custom-trait-item-effect').value = '';
            document.getElementById('custom-trait-item-quantity').value = '1';
        }

        customTraitEditorOverlay.classList.add('visible');
    }

    async function saveCustomTrait() {
        const name = document.getElementById('custom-trait-name').value.trim();
        if (!name) {
            await showCustomAlert('词条名称不能为空！');
            return;
        }

        const bonus = {};
        document.querySelectorAll('.custom-trait-bonus-input').forEach(input => {
            const value = parseInt(input.value);
            if (!isNaN(value) && value !== 0) {
                bonus[input.dataset.attr] = value;
            }
        });
        
        let itemString = '无';
        const itemName = document.getElementById('custom-trait-item-name').value.trim();
        if (itemName) {
            const itemDesc = document.getElementById('custom-trait-item-desc').value.trim();
            const itemType = document.getElementById('custom-trait-item-type').value;
            const itemEffect = document.getElementById('custom-trait-item-effect').value.trim();
            const itemQuantity = document.getElementById('custom-trait-item-quantity').value || '1';
            itemString = `【${itemName}|${itemDesc}|${itemType}|${itemEffect}|${itemQuantity}】`;
        }

        const traits = await getCustomTraits();
        const newTrait = {
            id: currentEditingTraitIndex > -1 ? traits[currentEditingTraitIndex].id : crypto.randomUUID(),
            rarity: document.getElementById('custom-trait-rarity').value,
            name: name,
            desc: document.getElementById('custom-trait-desc').value.trim(),
            effects: document.getElementById('custom-trait-effects').value.trim() || '无',
            bonus: bonus,
            item: itemString,
            inPool: currentEditingTraitIndex > -1 ? traits[currentEditingTraitIndex].inPool : false,
        };

        if (currentEditingTraitIndex > -1) {
            traits[currentEditingTraitIndex] = newTrait;
        } else {
            traits.push(newTrait);
        }
        await saveCustomTraits(traits);
        customTraitEditorOverlay.classList.remove('visible');
        await renderCustomTraitManager();
    }

    function setupCustomTraitListeners() {
        customTraitManagerOverlay.querySelector('.modal-close-btn').addEventListener('click', () => customTraitManagerOverlay.classList.remove('visible'));
        document.getElementById('custom-trait-create-btn').addEventListener('click', () => openCustomTraitEditor());
        
        document.getElementById('custom-trait-import-btn').addEventListener('click', () => handleImportCustomData(CUSTOM_TRAITS_KEY, '词条'));
        document.getElementById('custom-trait-export-btn').addEventListener('click', () => handleExportCustomData(CUSTOM_TRAITS_KEY, 'custom_traits.json'));

        document.getElementById('custom-trait-delete-btn').addEventListener('click', async () => {
            const selectedIndices = Array.from(document.querySelectorAll('#custom-traits-list input:checked')).map(cb => parseInt(cb.dataset.index));
            if (selectedIndices.length === 0) {
                await showCustomAlert('请先选择要删除的词条。');
                return;
            }
            if (await showCustomConfirm(`确定要永久删除选中的 ${selectedIndices.length} 个词条吗？`)) {
                let traits = await getCustomTraits();
                traits = traits.filter((_, index) => !selectedIndices.includes(index));
                await saveCustomTraits(traits);
                await renderCustomTraitManager();
            }
        });
        document.getElementById('custom-trait-pool-toggle-btn').addEventListener('click', async () => {
            const selectedIndices = Array.from(document.querySelectorAll('#custom-traits-list input:checked')).map(cb => parseInt(cb.dataset.index));
            if (selectedIndices.length === 0) {
                await showCustomAlert('请先选择要操作的词条。');
                return;
            }
            let traits = await getCustomTraits();
            selectedIndices.forEach(index => {
                traits[index].inPool = !traits[index].inPool;
            });
            await saveCustomTraits(traits);
            await renderCustomTraitManager();
        });

        customTraitEditorOverlay.querySelector('.modal-close-btn').addEventListener('click', () => customTraitEditorOverlay.classList.remove('visible'));
        document.getElementById('save-custom-trait-btn').addEventListener('click', saveCustomTrait);
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen({ navigationUI: "hide" }).catch(err => {
                showCustomAlert(`进入全屏模式失败: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
    
    async function loadSeenFeatures() {
        try {
            seenFeatures = await dbGet(SEEN_FEATURES_KEY) || {};
        } catch (e) {
            seenFeatures = {};
        }
    }

    async function markFeatureAsSeen(featureId) {
        if (!seenFeatures[featureId]) {
            seenFeatures[featureId] = true;
            await dbSet(SEEN_FEATURES_KEY, seenFeatures);
            updateRedDots();
        }
    }

    function updateRedDots() {
        const buttonsToTrack = [
            'fullscreen-btn',
            'surrounding-characters-button',
            'summary-log-button',
            'manage-log-button',
            'snapshot-btn',
            'system-settings-button'
        ];
        buttonsToTrack.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                let dot = button.querySelector('.red-dot');
                if (!seenFeatures[id] && id !== 'surrounding-characters-button') { // Exclude character button from this logic
                    if (!dot) {
                        dot = document.createElement('span');
                        dot.className = 'red-dot';
                        button.appendChild(dot);
                    }
                } else {
                    if (dot && id !== 'surrounding-characters-button') {
                        dot.remove();
                    }
                }
            }
        });
    }
    
    function openTasksOverlay() {
        const board = document.getElementById('task-bulletin-board');
        board.innerHTML = `
            <button id="task-prev-btn" class="task-nav-btn"><i class="fas fa-chevron-left"></i></button>
            <button id="task-next-btn" class="task-nav-btn"><i class="fas fa-chevron-right"></i></button>
        `;
        const tasks = Object.values(currentState['6'] || {});

        if (tasks.length === 0) {
            board.insertAdjacentHTML('beforeend', '<div class="task-scroll active" style="text-align:center;"><h5>暂无任务</h5><p>布告栏上空空如也，看来是天下太平的日子。</p></div>');
        } else {
            tasks.forEach((task, index) => {
                const difficulty = task['5'] || '凡人';
                const difficultyColor = LEVEL_COLORS[difficulty] || LEVEL_COLORS.default;
                const scroll = document.createElement('div');
                scroll.className = 'task-scroll';
                scroll.dataset.index = index;
                scroll.innerHTML = `
                    <button class="item-delete-btn" data-id="${task['0']}"><i class="fas fa-trash-alt"></i></button>
                    <h5>${task['1']} <span class="task-difficulty" style="background-color:${difficultyColor};">${difficulty}</span></h5>
                    <p>${task['2']}</p>
                    <p><strong>奖励:</strong> <span class="task-reward">${task['3']}</span></p>
                    <p><strong>惩罚:</strong> <span class="task-punishment">${task['4']}</span></p>
                `;
                board.appendChild(scroll);
            });
            currentTaskIndex = 0;
            updateTaskDisplay();
        }
        
        document.getElementById('task-prev-btn').addEventListener('click', () => navigateTasks(-1));
        document.getElementById('task-next-btn').addEventListener('click', () => navigateTasks(1));
        board.querySelectorAll('.item-delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const taskId = e.currentTarget.dataset.id;
                const task = (currentState['6'] || {})[taskId];
                if (task && await showCustomConfirm(`确定要放弃任务 "${task['1']}" 吗？`)) {
                    delete currentState['6'][taskId];
                    await saveCurrentState();
                    syncStateFromTables();
                    openTasksOverlay();
                }
            });
        });

        tasksOverlay.classList.add('visible');
    }

    function navigateTasks(direction) {
        const tasks = Object.values(currentState['6'] || {});
        if (tasks.length === 0) return;
        currentTaskIndex = (currentTaskIndex + direction + tasks.length) % tasks.length;
        updateTaskDisplay();
    }

    function updateTaskDisplay() {
        const scrolls = document.querySelectorAll('.task-scroll');
        scrolls.forEach((scroll, index) => {
            scroll.classList.toggle('active', index === currentTaskIndex);
        });
    }
    
    function openSpiritBeastsOverlay() {
        showSpiritBeastListView();
        spiritBeastOverlay.classList.add('visible');
    }

    function showSpiritBeastListView() {
        const listView = document.getElementById('spirit-beast-list-view');
        const detailView = document.getElementById('spirit-beast-detail-view');
        const listContainer = document.getElementById('spirit-beast-list-container');
        
        listView.classList.remove('hidden');
        detailView.classList.add('hidden');
        listContainer.innerHTML = '';
        
        const beasts = Object.values(currentState['7'] || {});
        if (beasts.length === 0) {
            listContainer.innerHTML = '<p style="text-align:center; opacity:0.7;">你尚未拥有任何灵兽。</p>';
            return;
        }

        beasts.forEach(beast => {
            const item = document.createElement('div');
            item.className = 'spirit-beast-list-item';
            const level = beast['2'] || '未知';
            const levelColor = LEVEL_COLORS[level] || LEVEL_COLORS.default;
            item.innerHTML = `
                <span class="name">${beast['1']}</span>
                <span class="level" style="color:${levelColor};">${level}</span>
                <button class="item-delete-btn" data-id="${beast['0']}"><i class="fas fa-trash-alt"></i></button>
            `;
            item.querySelector('.name').addEventListener('click', () => showSpiritBeastDetailView(beast));
            item.querySelector('.level').addEventListener('click', () => showSpiritBeastDetailView(beast));
            item.querySelector('.item-delete-btn').addEventListener('click', async (e) => {
                e.stopPropagation();
                const beastId = e.currentTarget.dataset.id;
                if (await showCustomConfirm(`确定要放生灵兽 "${beast['1']}" 吗？`)) {
                    delete currentState['7'][beastId];
                    await saveCurrentState();
                    syncStateFromTables();
                    showSpiritBeastListView();
                }
            });
            listContainer.appendChild(item);
        });
    }

    function showSpiritBeastDetailView(beast) {
        const listView = document.getElementById('spirit-beast-list-view');
        const detailView = document.getElementById('spirit-beast-detail-view');
        const detailPanel = document.getElementById('spirit-beast-detail-panel');
        
        listView.classList.add('hidden');
        detailView.classList.remove('hidden');
        
        const level = beast['2'] || '未知';
        const levelColor = LEVEL_COLORS[level] || LEVEL_COLORS.default;

        detailPanel.innerHTML = `
            <div class="item-detail-header">
                <i id="spirit-beast-detail-icon" class="fas fa-dragon"></i>
                <span id="spirit-beast-detail-name">${beast['1']}</span>
            </div>
            <div class="spirit-beast-detail-row">
                <span class="spirit-beast-detail-label">等级:</span>
                <span class="spirit-beast-detail-value" style="color:${levelColor};">${level}</span>
            </div>
            <div class="spirit-beast-detail-row">
                <span class="spirit-beast-detail-label">外貌:</span>
                <span class="spirit-beast-detail-value">${beast['3'] || '未知'}</span>
            </div>
            <div class="spirit-beast-detail-row">
                <span class="spirit-beast-detail-label">性格:</span>
                <span class="spirit-beast-detail-value">${beast['4'] || '未知'}</span>
            </div>
            <div class="spirit-beast-detail-row">
                <span class="spirit-beast-detail-label">技能:</span>
                <span class="spirit-beast-detail-value">${beast['5'] || '无'}</span>
            </div>
            <div class="spirit-beast-detail-row">
                <span class="spirit-beast-detail-label">内心想法:</span>
                <span class="spirit-beast-detail-value">${beast['6'] || '未知'}</span>
            </div>
        `;
        
        detailView.querySelector('#back-to-spirit-beast-list-btn').onclick = showSpiritBeastListView;
    }

    function openSkillsOverlay() {
        const gridContainer = document.getElementById('skills-grid-container');
        gridContainer.innerHTML = '';
        skillsOverlay.classList.add('visible');
        const skills = Object.values(currentState['8'] || {});

        if (skills.length === 0) {
            gridContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; opacity: 0.7;">你尚未学会任何技能。</p>';
            return;
        }

        skills.forEach(skill => {
            const card = document.createElement('div');
            card.className = 'skill-card';
            const level = skill['2'] || '未知';
            const levelColor = LEVEL_COLORS[level] || LEVEL_COLORS.default;
            card.innerHTML = `
                <button class="item-delete-btn" data-id="${skill['0']}"><i class="fas fa-trash-alt"></i></button>
                <div class="skill-name">${skill['1']}</div>
                <div class="skill-level" style="background-color:${levelColor};">${level}</div>
            `;
            card.querySelector('.skill-name').addEventListener('click', () => showSkillDetail(skill));
            card.querySelector('.skill-level').addEventListener('click', () => showSkillDetail(skill));
            card.querySelector('.item-delete-btn').addEventListener('click', async (e) => {
                e.stopPropagation();
                const skillId = e.currentTarget.dataset.id;
                if (await showCustomConfirm(`确定要遗忘技能 "${skill['1']}" 吗？`)) {
                    delete currentState['8'][skillId];
                    await saveCurrentState();
                    syncStateFromTables();
                    openSkillsOverlay();
                }
            });
            gridContainer.appendChild(card);
        });
    }
    
    function showSkillDetail(skill) {
        document.getElementById('skill-detail-name').textContent = skill['1'];
        const contentEl = document.getElementById('skill-detail-content');
        
        const createRow = (label, value) => `<div class="skill-detail-row"><span class="skill-detail-label">${label}:</span><span class="skill-detail-value">${value || '未知'}</span></div>`;

        contentEl.innerHTML = `
            ${createRow('等级', skill['2'])}
            ${createRow('属性', skill['3'])}
            ${createRow('描述', skill['4'])}
            ${createRow('效果', skill['5'])}
            ${createRow('来历', skill['6'])}
            ${createRow('熟练度', skill['7'])}
            ${createRow('消耗', skill['8'])}
        `;
        
        skillDetailOverlay.classList.add('visible');
    }
    
    async function getBondedChars() {
        return await dbGet(CUSTOM_BONDED_CHARS_KEY) || [];
    }

    async function saveBondedChars(chars) {
        await dbSet(CUSTOM_BONDED_CHARS_KEY, chars);
    }

    function setupBondedCharacterListeners() {
        document.getElementById('save-bonded-char-editor-btn').addEventListener('click', saveBondedCharFromEditor);
    }

    async function openBondedCharacterSelection() {
        const listEl = document.getElementById('bonded-character-selection-list');
        listEl.innerHTML = '';
        const allChars = await getBondedChars();

        if (allChars.length === 0) {
            listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">名册为空，请先在管理界面中创建人物。</p>';
        } else {
            allChars.forEach(char => {
                const isSelected = creationState.bondedCharacters.some(c => c.id === char.id);
                const item = document.createElement('div');
                item.className = `bonded-char-selection-item ${isSelected ? 'selected' : ''}`;
                const genderClass = char.gender === '男' ? 'char-name-male' : (char.gender === '女' ? 'char-name-female' : '');
                item.innerHTML = `<span class="char-name ${genderClass}">${char.name}</span><span>${char.identity}</span>`;
                item.addEventListener('click', () => {
                    const selectedIndex = creationState.bondedCharacters.findIndex(c => c.id === char.id);
                    if (selectedIndex > -1) {
                        creationState.bondedCharacters.splice(selectedIndex, 1);
                    } else {
                        creationState.bondedCharacters.push(char);
                    }
                    openBondedCharacterSelection(); // Re-render to show selection change
                });
                listEl.appendChild(item);
            });
        }
        
        const actionsContainer = document.getElementById('bonded-char-manager-actions');
        actionsContainer.innerHTML = `<button id="manage-bonded-chars-btn" class="major-action-button"><i class="fas fa-users-cog"></i> 管理名册</button>`;
        actionsContainer.querySelector('#manage-bonded-chars-btn').addEventListener('click', renderBondedCharManager);
        
        bondedCharacterSelectionOverlay.classList.add('visible');
    }

    async function renderBondedCharManager() {
        const listEl = document.getElementById('bonded-character-selection-list');
        listEl.innerHTML = '';
        const allChars = await getBondedChars();

        if (allChars.length === 0) {
            listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">名册为空。</p>';
        } else {
            allChars.forEach((char, index) => {
                const item = document.createElement('div');
                item.className = 'custom-trait-item';
                const genderClass = char.gender === '男' ? 'char-name-male' : 'char-name-female';
                item.innerHTML = `
                    <input type="checkbox" data-index="${index}">
                    <span class="char-name ${genderClass}" style="flex-grow:1;">${char.name}</span>
                    <button class="edit-bonded-char-btn" data-index="${index}" title="编辑"><i class="fas fa-edit"></i></button>
                `;
                listEl.appendChild(item);
            });
        }
        
        const actionsContainer = document.getElementById('bonded-char-manager-actions');
        actionsContainer.innerHTML = `
            <button id="bc-create-btn" class="major-action-button"><i class="fas fa-plus"></i> 新建</button>
            <button id="bc-import-btn" class="major-action-button"><i class="fas fa-file-import"></i> 导入</button>
            <button id="bc-export-btn" class="major-action-button"><i class="fas fa-file-export"></i> 导出</button>
            <button id="bc-delete-btn" class="major-action-button"><i class="fas fa-trash"></i> 删除</button>
            <button id="bc-back-to-select-btn" class="major-action-button"><i class="fas fa-arrow-left"></i> 返回</button>
        `;

        listEl.querySelectorAll('.edit-bonded-char-btn').forEach(btn => btn.addEventListener('click', (e) => openBondedCharEditor(parseInt(e.currentTarget.dataset.index))));
        document.getElementById('bc-create-btn').addEventListener('click', () => openBondedCharEditor());
        document.getElementById('bc-import-btn').addEventListener('click', () => handleImportCustomData(CUSTOM_BONDED_CHARS_KEY, '羁绊人物'));
        document.getElementById('bc-export-btn').addEventListener('click', () => handleExportCustomData(CUSTOM_BONDED_CHARS_KEY, 'custom_bonded_chars.json'));
        document.getElementById('bc-delete-btn').addEventListener('click', async () => {
                const selectedIndices = Array.from(listEl.querySelectorAll('input:checked')).map(cb => parseInt(cb.dataset.index));
            if (selectedIndices.length === 0) return;
            if (await showCustomConfirm(`确定要从名册中删除选中的 ${selectedIndices.length} 个人物吗？`)) {
                let chars = await getBondedChars();
                chars = chars.filter((_, index) => !selectedIndices.includes(index));
                await saveBondedChars(chars);
                await renderBondedCharManager();
            }
        });
        document.getElementById('bc-back-to-select-btn').addEventListener('click', openBondedCharacterSelection);
    }

    async function openBondedCharEditor(index = -1) {
        currentEditingBondedCharIndex = index;
        const isEditing = index > -1;
        const chars = await getBondedChars();
        const char = isEditing ? chars[index] : {};
        
        document.getElementById('bonded-character-editor-title').textContent = isEditing ? `编辑: ${char.name}` : '新建羁绊人物';
        
        const fields = ['name', 'gender', 'realm', 'identity', 'age', 'shouyuan', 'favorability', 'appearance', 'figure', 'attire', 'personality', 'motive', 'background'];
        fields.forEach(field => {
            const el = document.getElementById(`bc-editor-${field}`);
            if (el) el.value = char[field] || '';
        });

        const attributesGrid = document.getElementById('bc-editor-attributes-grid');
        attributesGrid.innerHTML = '';
        let currentAttributes = {};
        try {
            currentAttributes = JSON.parse(char.attributes || '{}');
        } catch(e) {}

        Object.keys(CREATION_CONFIG.ATTRIBUTES).forEach(attr => {
            const item = document.createElement('div');
            item.className = 'attribute-item';
            const attrValue = currentAttributes[attr] || { current: 0, max: 0 };
            item.innerHTML = `
                <div class="name-desc"><strong>${attr}</strong></div>
                <div class="attribute-slider-group">
                    <input type="number" class="bonded-char-attr-input" data-attr="${attr}" data-type="current" value="${attrValue.current}" placeholder="当前值">
                    /
                    <input type="number" class="bonded-char-attr-input" data-attr="${attr}" data-type="max" value="${attrValue.max}" placeholder="上限值">
                </div>
            `;
            attributesGrid.appendChild(item);
        });

        bondedCharacterEditorOverlay.classList.add('visible');
    }

    async function saveBondedCharFromEditor() {
        const name = document.getElementById('bc-editor-name').value.trim();
        if (!name) {
            await showCustomAlert('姓名不能为空！');
            return;
        }
        
        const attributes = {};
        document.querySelectorAll('.bonded-char-attr-input[data-type="max"]').forEach(input => {
            const attrName = input.dataset.attr;
            const max = parseInt(input.value) || 0;
            const current = parseInt(input.parentElement.querySelector(`[data-attr="${attrName}"][data-type="current"]`).value) || 0;
            attributes[attrName] = { current: Math.min(current, max), max: max };
        });

        const chars = await getBondedChars();
        const charData = {
            id: currentEditingBondedCharIndex > -1 ? chars[currentEditingBondedCharIndex].id : `G${crypto.randomUUID()}`,
            name: name,
            gender: document.getElementById('bc-editor-gender').value,
            realm: document.getElementById('bc-editor-realm').value,
            identity: document.getElementById('bc-editor-identity').value,
            age: document.getElementById('bc-editor-age').value,
            shouyuan: document.getElementById('bc-editor-shouyuan').value,
            favorability: document.getElementById('bc-editor-favorability').value,
            appearance: document.getElementById('bc-editor-appearance').value,
            figure: document.getElementById('bc-editor-figure').value,
            attire: document.getElementById('bc-editor-attire').value,
            personality: document.getElementById('bc-editor-personality').value,
            motive: document.getElementById('bc-editor-motive').value,
            background: document.getElementById('bc-editor-background').value,
            attributes: JSON.stringify(attributes)
        };

        if (currentEditingBondedCharIndex > -1) {
            chars[currentEditingBondedCharIndex] = charData;
        } else {
            chars.push(charData);
        }
        await saveBondedChars(chars);
        
        bondedCharacterEditorOverlay.classList.remove('visible');
        await renderBondedCharManager();
    }

async function loadFunSettings() {
    const defaultSettings = {
        danmakuEnabled: true,
        autoGenNpcImage: false,
        styles: {
            player: { color: '#87CEFA', fontSize: '18px', background: 'rgba(0, 0, 0, 0.5)' },
            npc: { color: '#FFB6C1', fontSize: '18px', background: 'rgba(0, 0, 0, 0.5)' },
            item: { color: '#FFD700', fontSize: '18px', background: 'rgba(0, 0, 0, 0.5)' },
            world: { color: '#90EE90', fontSize: '18px', background: 'rgba(0, 0, 0, 0.5)' },
            error: { color: '#e57373', fontSize: '18px', background: 'rgba(0, 0, 0, 0.5)' },
        }
    };
    const storedSettings = await dbGet(FUN_SETTINGS_KEY);
    funSettings = { ...defaultSettings, ...storedSettings };
    funSettings.styles = { ...defaultSettings.styles, ...(storedSettings ? storedSettings.styles : {}) };

    document.getElementById('danmaku-enabled-toggle').checked = funSettings.danmakuEnabled;
    document.getElementById('auto-gen-npc-image-toggle').checked = funSettings.autoGenNpcImage;

    const container = document.getElementById('danmaku-settings-container');
    container.innerHTML = '';
    for (const type in funSettings.styles) {
        const style = funSettings.styles[type];
        const row = document.createElement('div');
        row.className = 'danmaku-setting-row';
        row.innerHTML = `
            <label>${type.toUpperCase()}</label>
            <input type="color" data-type="${type}" data-prop="color" value="${style.color}">
            <input type="color" data-type="${type}" data-prop="background" value="${style.background}">
            <input type="number" data-type="${type}" data-prop="fontSize" value="${parseInt(style.fontSize)}" min="10" max="40" step="1" style="width: 60px;">
        `;
        container.appendChild(row);
    }
}

        async function saveFunSettings() {
            // 确保 funSettings 对象存在
            if (!funSettings) funSettings = {};
            if (!funSettings.styles) funSettings.styles = {};

            funSettings.danmakuEnabled = document.getElementById('danmaku-enabled-toggle').checked;
			funSettings.autoGenNpcImage = document.getElementById('auto-gen-npc-image-toggle').checked; // 确保从正确的开关读取状态

            document.querySelectorAll('.danmaku-setting-row input').forEach(input => {
                const { type, prop } = input.dataset;
                let value = input.value;
                if (prop === 'fontSize') {
                    value = `${value}px`;
                }
                if (!funSettings.styles[type]) funSettings.styles[type] = {};
                funSettings.styles[type][prop] = value;
            });

            await dbSet(FUN_SETTINGS_KEY, funSettings);
            
            // 只有在“趣味设置”弹窗可见时才显示提示并关闭
            if (funSettingsOverlay.classList.contains('visible')) {
                await showCustomAlert('趣味设置已保存！');
                funSettingsOverlay.classList.remove('visible');
            }
        }

function showDanmaku(text, type, controller = null) { 
if (!funSettings.danmakuEnabled && type !== 'status') return null;

if (type === 'status') {
let container = document.getElementById('status-indicator-container');
if (!container) {
container = document.createElement('div');
container.id = 'status-indicator-container';

const parentWrapper = document.getElementById('main-content-wrapper');
if (parentWrapper) {
parentWrapper.appendChild(container);
} else {
console.error("致命错误：无法找到ID为 'main-content-wrapper' 的父容器来放置状态提示！");
document.body.appendChild(container);
}
}

const statusItem = document.createElement('div');
statusItem.className = 'status-indicator-item';
statusItem.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${sanitizeHTML(text)}`;

statusItem.style.cursor = 'pointer';
statusItem.title = '点击取消请求';


statusItem.addEventListener('click', () => {
if (controller) { 
controller.abort();
showDanmaku('请求已取消', 'world');
statusItem.remove();
} else if (thinkingApiController) { 
thinkingApiController.abort();
showDanmaku('变量思考请求已取消', 'world');
statusItem.remove();
} else if (theaterApiController) { 
theaterApiController.abort();
showDanmaku('AI小剧场/日报请求已取消', 'world');
statusItem.remove();
} else if (imageTaggingApiController) { 
imageTaggingApiController.abort();
showDanmaku('正文优化请求已取消', 'world');
statusItem.remove();
} else if (backgroundGenApiController) { 
backgroundGenApiController.abort();
showDanmaku('背景生成请求已取消', 'world');
statusItem.remove();
} else if (knowledgeSearchApiController) { 
knowledgeSearchApiController.abort();
showDanmaku('知识库搜索请求已取消', 'world');
statusItem.remove();
}
});

container.appendChild(statusItem);

const originalRemove = statusItem.remove.bind(statusItem);
statusItem.remove = function() {
originalRemove();
if (container && container.childElementCount === 0) {
container.remove();
}
};

return statusItem;
}

const container = document.getElementById('danmaku-container');
const danmaku = document.createElement('div');
danmaku.textContent = text;

if (type === 'achievement') {
danmaku.className = 'danmaku-item achievement';
} else {
danmaku.className = 'danmaku-item';
const style = funSettings.styles[type] || funSettings.styles.world;
danmaku.style.color = style.color;
danmaku.style.fontSize = style.fontSize;
danmaku.style.backgroundColor = style.background;
danmaku.style.top = `${Math.random() * 80 + 5}%`;
const duration = Math.random() * 5 + 8;
danmaku.style.animationDuration = `${duration}s`;
setTimeout(() => { if(danmaku.parentElement) danmaku.remove(); }, duration * 1000);
}

if (container) {
container.appendChild(danmaku);
}

return danmaku;
}

    function setupCustomDataManagementListeners() {
        document.getElementById('custom-birth-manager-actions').addEventListener('click', async (e) => {
            const action = e.target.closest('button')?.dataset.action;
            if (!action) return;
            switch(action) {
                case 'create': openCustomBirthEditor(); break;
                case 'import': handleImportCustomData(CUSTOM_BIRTHS_KEY, '出身'); break;
                case 'export': handleExportCustomData(CUSTOM_BIRTHS_KEY, 'custom_births.json'); break;
            }
        });

        document.getElementById('custom-race-manager-actions').addEventListener('click', async (e) => {
            const action = e.target.closest('button')?.dataset.action;
            if (!action) return;
            switch(action) {
                case 'create': openCustomRaceEditor(); break;
                case 'import': handleImportCustomData(CUSTOM_RACES_KEY, '种族'); break;
                case 'export': handleExportCustomData(CUSTOM_RACES_KEY, 'custom_races.json'); break;
            }
        });
    }
    
    async function openCustomDataSelection(type) {
        const config = {
            birth: {
                overlay: customBirthSelectionOverlay,
                listEl: document.getElementById('custom-birth-selection-list'),
                dbKey: CUSTOM_BIRTHS_KEY,
                openEditor: openCustomBirthEditor,
            },
            race: {
                overlay: customRaceSelectionOverlay,
                listEl: document.getElementById('custom-race-selection-list'),
                dbKey: CUSTOM_RACES_KEY,
                openEditor: openCustomRaceEditor,
            }
        };
        const { overlay, listEl, dbKey, openEditor } = config[type];
        const items = await dbGet(dbKey) || [];
        
        listEl.innerHTML = '';
        if (items.length === 0) {
            listEl.innerHTML = `<p style="text-align:center; opacity:0.7;">名册为空，请先创建。</p>`;
        } else {
            items.forEach(item => {
                const div = document.createElement('div');
                div.className = 'custom-list-item';
                div.innerHTML = `
                    <span class="item-name">${item.tag}</span>
                    <div class="item-actions">
                        <button data-id="${item.id}" data-action="edit" title="编辑"><i class="fas fa-edit"></i></button>
                        <button data-id="${item.id}" data-action="delete" title="删除"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                div.querySelector('.item-name').addEventListener('click', async () => {
                    const currentRemaining = calculateRemainingPoints();
                    const oldCost = creationState[type === 'birth' ? 'selectedBirth' : 'selectedRace'] ? CREATION_CONFIG[type === 'birth' ? 'BIRTHS' : 'RACES']['自定义'].cost : 0;
                    const newCost = CREATION_CONFIG[type === 'birth' ? 'BIRTHS' : 'RACES']['自定义'].cost;
                    
                    if (currentRemaining + oldCost < newCost) {
                        await showCustomAlert('属性点不足，无法选择此项！');
                        return;
                    }
                    
                    creationState[type === 'birth' ? 'selectedBirth' : 'selectedRace'] = '自定义';
                    creationState[type === 'birth' ? 'customBirth' : 'customRace'] = item;
                    overlay.classList.remove('visible');
                    renderCreationStep();
                });
                listEl.appendChild(div);
            });
        }

        listEl.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = e.currentTarget.dataset.id;
                const action = e.currentTarget.dataset.action;
                if (action === 'edit') {
                    openEditor(id);
                } else if (action === 'delete') {
                    if (await showCustomConfirm('确定要删除这个自定义项吗？')) {
                        let data = await dbGet(dbKey) || [];
                        data = data.filter(item => item.id !== id);
                        await dbSet(dbKey, data);
                        await openCustomDataSelection(type);
                    }
                }
            });
        });

        overlay.classList.add('visible');
    }

    async function openCustomBirthEditor(id = null) {
        currentEditingCustomBirthId = id;
        const isEditing = id !== null;
        const births = await dbGet(CUSTOM_BIRTHS_KEY) || [];
        const birth = isEditing ? births.find(b => b.id === id) : {};

        document.getElementById('custom-birth-editor-title').textContent = isEditing ? '编辑出身' : '创建新出身';
        document.getElementById('custom-birth-tag').value = birth.tag || '';
        document.getElementById('custom-birth-name').value = birth.name || '';
        document.getElementById('custom-birth-desc').value = birth.description || '';
        
        const attributesContainer = document.getElementById('custom-birth-attributes');
        const summaryEl = document.getElementById('custom-attr-points-summary');
        const customAttributes = birth.attributes || {};

        const updateSummary = () => {
            const pointsUsed = Object.values(customAttributes).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
            summaryEl.innerHTML = `自定义属性点: <span class="cost">${10 - pointsUsed} / 10</span>`;
        };

        attributesContainer.innerHTML = Object.keys(CREATION_CONFIG.ATTRIBUTES).map(key => `
            <div class="attribute-item">
                <div class="name-desc"><strong>${key}</strong></div>
                <div class="attribute-slider-group">
                    <input type="range" min="0" max="10" value="${customAttributes[key] || 0}" data-attr="${key}">
                    <span class="value">${customAttributes[key] || 0}</span>
                </div>
            </div>
        `).join('');

        attributesContainer.querySelectorAll('input[type="range"]').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const attr = e.target.dataset.attr;
                const newValue = parseInt(e.target.value);
                const oldValue = customAttributes[attr] || 0;
                const currentTotal = Object.values(customAttributes).reduce((sum, val) => sum + (parseInt(val) || 0), 0) - oldValue;

                if (currentTotal + newValue <= 10) {
                    customAttributes[attr] = newValue;
                    slider.parentElement.querySelector('.value').textContent = newValue;
                } else {
                    slider.value = oldValue;
                }
                updateSummary();
            });
        });
        
        updateSummary();
        customBirthOverlay.classList.add('visible');
    }
    
    async function openCustomRaceEditor(id = null) {
        currentEditingCustomRaceId = id;
        const isEditing = id !== null;
        const races = await dbGet(CUSTOM_RACES_KEY) || [];
        const race = isEditing ? races.find(r => r.id === id) : {};

        document.getElementById('custom-race-editor-title').textContent = isEditing ? '编辑种族' : '创建新种族';
        document.getElementById('custom-race-tag').value = race.tag || '';
        document.getElementById('custom-race-name').value = race.name || '';
        document.getElementById('custom-race-desc').value = race.description || '';
        
        const attributesContainer = document.getElementById('custom-race-attributes');
        const summaryEl = document.getElementById('custom-race-attr-points-summary');
        const customAttributes = race.attributes || {};

        const updateSummary = () => {
            const pointsUsed = Object.values(customAttributes).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
            summaryEl.innerHTML = `自定义属性点: <span class="cost">${10 - pointsUsed} / 10</span>`;
        };

        attributesContainer.innerHTML = Object.keys(CREATION_CONFIG.ATTRIBUTES).map(key => `
            <div class="attribute-item">
                <div class="name-desc"><strong>${key}</strong></div>
                <div class="attribute-slider-group">
                    <input type="range" min="0" max="10" value="${customAttributes[key] || 0}" data-attr="${key}">
                    <span class="value">${customAttributes[key] || 0}</span>
                </div>
            </div>
        `).join('');

        attributesContainer.querySelectorAll('input[type="range"]').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const attr = e.target.dataset.attr;
                const newValue = parseInt(e.target.value);
                const oldValue = customAttributes[attr] || 0;
                const currentTotal = Object.values(customAttributes).reduce((sum, val) => sum + (parseInt(val) || 0), 0) - oldValue;

                if (currentTotal + newValue <= 10) {
                    customAttributes[attr] = newValue;
                    slider.parentElement.querySelector('.value').textContent = newValue;
                } else {
                    slider.value = oldValue;
                }
                updateSummary();
            });
        });
        
        updateSummary();
        customRaceOverlay.classList.add('visible');
    }

    async function saveCustomBirthFromEditor() {
        const tag = document.getElementById('custom-birth-tag').value.trim();
        if (!tag) { await showCustomAlert('自定义标识不能为空！'); return; }

        const attributes = {};
        document.querySelectorAll('#custom-birth-attributes input[type="range"]').forEach(slider => {
            attributes[slider.dataset.attr] = parseInt(slider.value);
        });

        const birthData = {
            id: currentEditingCustomBirthId || crypto.randomUUID(),
            tag: tag,
            name: document.getElementById('custom-birth-name').value.trim(),
            description: document.getElementById('custom-birth-desc').value.trim(),
            attributes: attributes,
        };

        let births = await dbGet(CUSTOM_BIRTHS_KEY) || [];
        if (currentEditingCustomBirthId) {
            const index = births.findIndex(b => b.id === currentEditingCustomBirthId);
            births[index] = birthData;
        } else {
            births.push(birthData);
        }
        await dbSet(CUSTOM_BIRTHS_KEY, births);
        customBirthOverlay.classList.remove('visible');
        await openCustomDataSelection('birth');
    }
    
    async function saveCustomRaceFromEditor() {
        const tag = document.getElementById('custom-race-tag').value.trim();
        if (!tag) { await showCustomAlert('自定义标识不能为空！'); return; }

        const attributes = {};
        document.querySelectorAll('#custom-race-attributes input[type="range"]').forEach(slider => {
            attributes[slider.dataset.attr] = parseInt(slider.value);
        });

        const raceData = {
            id: currentEditingCustomRaceId || crypto.randomUUID(),
            tag: tag,
            name: document.getElementById('custom-race-name').value.trim(),
            description: document.getElementById('custom-race-desc').value.trim(),
            attributes: attributes,
        };

        let races = await dbGet(CUSTOM_RACES_KEY) || [];
        if (currentEditingCustomRaceId) {
            const index = races.findIndex(r => r.id === currentEditingCustomRaceId);
            races[index] = raceData;
        } else {
            races.push(raceData);
        }
        await dbSet(CUSTOM_RACES_KEY, races);
        customRaceOverlay.classList.remove('visible');
        await openCustomDataSelection('race');
    }
    
    async function handleImportCustomData(dbKey, dataType, isAchievement = false) {
        genericImportInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);
                    if (!Array.isArray(importedData)) throw new Error('文件格式不正确，应为数组。');
                    
                    let currentData;
                    if (isAchievement) {
                        const archive = await db.archives.get(currentArchiveName);
                        currentData = archive.data.state.achievements.custom || [];
                    } else {
                        currentData = await dbGet(dbKey) || [];
                    }

                    const shouldOverwrite = await showCustomConfirm(`导入成功！是否覆盖现有${dataType}？\n(确定覆盖，取消追加)`);
                    
                    if (shouldOverwrite) {
                        currentData = importedData;
                    } else {
                        const currentIds = new Set(currentData.map(item => item.id));
                        importedData.forEach(item => {
                            if (!currentIds.has(item.id)) {
                                currentData.push(item);
                            }
                        });
                    }

                    if (isAchievement) {
                        const archive = await db.archives.get(currentArchiveName);
                        archive.data.state.achievements.custom = currentData;
                        await db.archives.put(archive);
                        await openCustomAchievementManager();
                    } else {
                        await dbSet(dbKey, currentData);
                        if (dbKey === CUSTOM_TRAITS_KEY) await renderCustomTraitManager();
                        else if (dbKey === CUSTOM_BONDED_CHARS_KEY) await renderBondedCharManager();
                        else if (dbKey === CUSTOM_AFFIXES_KEY) await renderCustomAffixList();
                        else await openCustomDataSelection(dataType.includes('出身') ? 'birth' : 'race');
                    }
                    await showCustomAlert(`${dataType}数据已成功导入！`);

                } catch (err) {
                    await showCustomAlert(`导入失败: ${err.message}`);
                } finally {
                    genericImportInput.value = '';
                }
            };
            reader.readAsText(file);
        };
        genericImportInput.click();
    }

    async function handleExportCustomData(dbKey, fileName, isAchievement = false) {
        let data;
        if (isAchievement) {
            const archive = await db.archives.get(currentArchiveName);
            data = archive?.data?.state?.achievements?.custom || [];
        } else {
            data = await dbGet(dbKey) || [];
        }

        if (data.length === 0) {
            await showCustomAlert('没有可导出的数据。');
            return;
        }
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: "application/json"});
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function openSegmentedMemorySettings() {
        segmentedMemoryOverlay.classList.add('visible');
    }

    async function saveSegmentedMemorySettings() {
        const chatLayers = parseInt(document.getElementById('segmented-chat-layers').value) || 0;
        const largeSummaryStart = parseInt(document.getElementById('segmented-large-summary-start').value) || 0;

        if (largeSummaryStart > 0 && largeSummaryStart <= chatLayers) {
            await showCustomAlert('错误：大总结的起始层数必须大于完整聊天记录的层数。');
            return;
        }

        summaryConfig.segmentedMemoryEnabled = document.getElementById('segmented-memory-enabled-toggle').checked;
        summaryConfig.segmentedChatLayers = chatLayers;
        summaryConfig.segmentedLargeSummaryStart = largeSummaryStart;
        
        await dbSet(SUMMARY_CONFIG_KEY, summaryConfig);
        await showCustomAlert('分段记忆设置已保存！');
        segmentedMemoryOverlay.classList.remove('visible');
    }
async function deleteSelectedSummaries(type) {
    const listEl = document.getElementById('summary-viewer-list');
    const checkedBoxes = listEl.querySelectorAll('.summary-checkbox:checked');
    
    if (checkedBoxes.length === 0) {
        return;
    }

    const idsToDelete = Array.from(checkedBoxes).map(cb => cb.dataset.logId);
    
    if (await showCustomConfirm(`确定要删除选中的 ${idsToDelete.length} 条总结吗？\n(这只会清空总结内容，不会删除原始日志和快照)`)) {
        try {
            const summaryKey = type === 'small' ? 'smallSummary' : 'largeSummary';
            const archive = await db.archives.get(currentArchiveName);
            
            let modifiedCount = 0;
            archive.data.logs.forEach(log => {
                if (idsToDelete.includes(log.id)) {
                    if (log.hasOwnProperty(summaryKey)) {
                        delete log[summaryKey]; // 从日志对象中移除该总结字段
                        modifiedCount++;
                    }
                }
            });

            if (modifiedCount > 0) {
                await db.archives.put(archive);
                await showCustomAlert('选中的总结已成功删除！');
            } else {
                await showCustomAlert('选中的记录没有需要删除的总结内容。');
            }
            
            // 刷新阅览器以显示变更
            openSummaryViewer(type);

        } catch (error) {
            console.error("删除总结时出错:", error);
            await showCustomAlert(`操作失败: ${error.message}`);
        }
    }
}


async function openSummaryViewer(type) {
    const modal = document.getElementById('summary-viewer-overlay');
    const modalContainer = modal.querySelector('.modal');
    
    // --- 动态添加或获取删除按钮 ---
    let buttonGroup = modalContainer.querySelector('.button-group');
    if (!buttonGroup) {
        buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';
        buttonGroup.style.cssText = 'margin-top: 15px; justify-content: flex-end;';
        buttonGroup.innerHTML = `
            <button id="delete-selected-summaries-btn" class="major-action-button" disabled>
                <i class="fas fa-trash-alt"></i> 删除选中
            </button>
        `;
        modalContainer.appendChild(buttonGroup);
    }
    const deleteBtn = document.getElementById('delete-selected-summaries-btn');
    
    // --- 每次打开时重置并绑定删除事件 ---
    deleteBtn.disabled = true;
    deleteBtn.onclick = () => deleteSelectedSummaries(type);
    
    // --- 设置窗口标题和列表 ---
    const title = type === 'small' ? '小总结记录' : '大总结记录';
    const summaryKey = type === 'small' ? 'smallSummary' : 'largeSummary';
    
    document.getElementById('summary-viewer-title').textContent = title;
    const listEl = document.getElementById('summary-viewer-list');
    listEl.innerHTML = '';

    const archive = await db.archives.get(currentArchiveName);
    const logs = archive ? archive.data.logs : [];
    
    // 筛选出所有包含目标总结的日志，并按时间倒序
    const logsWithSummary = logs
        .filter(log => log[summaryKey])
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (logsWithSummary.length === 0) {
        listEl.innerHTML = `<p style="text-align:center; opacity:0.7;">当前存档没有${title}。</p>`;
    } else {
        logsWithSummary.forEach(log => {
            const item = document.createElement('div');
            item.className = 'summary-list-item';
            item.style.cursor = 'default'; // 取消整行点击

            let label;
            if (log.isGhost) {
                label = `<strong style="color: #66bb6a;">[背景记忆]</strong>`;
            } else {
                const logIndex = logs.findIndex(l => l.id === log.id);
                label = `第 ${logIndex + 1} 层总结`;
            }

            // --- 新的列表项结构，包含复选框 ---
            item.innerHTML = `
                <input type="checkbox" class="summary-checkbox" data-log-id="${log.id}" style="margin-right: 15px; transform: scale(1.2); cursor: pointer;">
                <div class="summary-text-content" style="flex-grow: 1; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                    <span>${label}</span>
                    <small style="color: var(--text-secondary);">${new Date(log.timestamp).toLocaleString()}</small>
                </div>
            `;
            
            // 为文本内容绑定“点击编辑”事件
            item.querySelector('.summary-text-content').addEventListener('click', () => openSummaryEditor(log.id, type));
            listEl.appendChild(item);
        });
    }

    // --- 使用事件委托处理所有复选框的点击 ---
    listEl.onchange = (e) => {
        if (e.target.classList.contains('summary-checkbox')) {
            const checkedCount = listEl.querySelectorAll('.summary-checkbox:checked').length;
            deleteBtn.disabled = checkedCount === 0;
        }
    };
    
    // --- 显示窗口 ---
    segmentedMemoryOverlay.classList.remove('visible');
    modal.classList.add('visible');
}

    async function openSummaryEditor(logId, type) {
        currentEditingSummary = { logId, type };
        const title = type === 'small' ? '编辑小总结' : '编辑大总结';
        const summaryKey = type === 'small' ? 'smallSummary' : 'largeSummary';

        document.getElementById('summary-editor-title').textContent = title;
        
        const archive = await db.archives.get(currentArchiveName);
        const log = archive.data.logs.find(l => l.id === logId);
        
        document.getElementById('summary-editor-textarea').value = log ? (log[summaryKey] || '') : '';
        summaryViewerOverlay.classList.remove('visible');
        summaryEditorOverlay.classList.add('visible');
    }

    async function saveSummaryFromEditor() {
        const { logId, type } = currentEditingSummary;
        if (!logId || !type) return;

        const summaryKey = type === 'small' ? 'smallSummary' : 'largeSummary';
        const newText = document.getElementById('summary-editor-textarea').value;

        let archive = await db.archives.get(currentArchiveName);
        const logIndex = archive.data.logs.findIndex(l => l.id === logId);
        if (logIndex !== -1) {
            archive.data.logs[logIndex][summaryKey] = newText;
            await db.archives.put(archive);
            await showCustomAlert('总结已保存！');
            summaryEditorOverlay.classList.remove('visible');
            await openSummaryViewer(type);
        } else {
            await showCustomAlert('保存失败，找不到对应记录。');
        }
    }
    
    async function openManualSegmentedMemoryEditor(logId) {
        currentManualSegmentedLogId = logId;
        let archive = await db.archives.get(currentArchiveName);
        const log = archive.data.logs.find(l => l.id === logId);
        
        document.getElementById('manual-small-summary').value = log?.smallSummary || '';
        document.getElementById('manual-large-summary').value = log?.largeSummary || '';
        manualSegmentedMemoryOverlay.classList.add('visible');
    }

    async function saveManualSegmentedMemory() {
        if (!currentManualSegmentedLogId) return;

        const smallSummary = document.getElementById('manual-small-summary').value;
        const largeSummary = document.getElementById('manual-large-summary').value;
        
        let archive = await db.archives.get(currentArchiveName);
        const logIndex = archive.data.logs.findIndex(l => l.id === currentManualSegmentedLogId);
        
        if (logIndex !== -1) {
            archive.data.logs[logIndex].smallSummary = smallSummary;
            archive.data.logs[logIndex].largeSummary = largeSummary;
            await db.archives.put(archive);
            await showCustomAlert('手动分段记忆已补充！');
            manualSegmentedMemoryOverlay.classList.remove('visible');
        } else {
            await showCustomAlert('保存失败，找不到对应记录。');
        }
        currentManualSegmentedLogId = null;
    }
    
async function loadChatBackgroundSettings() {
    const defaultSettings = {
        opacity: 0.2,
        blur: 2,
        size: 'cover',
        activeBackgroundId: null,
        apiUrl: '',
        apiKey: '',
        apiModel: '',
        autoGen: false,
        apiPromptTemplate: DEFAULT_API_PROMPT_TEMPLATE,
        availableModels: [] 
    };
    chatBackgroundSettings = await dbGet(CHAT_BACKGROUND_KEY) || defaultSettings;
    
    for (const key in defaultSettings) {
        if (chatBackgroundSettings[key] === undefined) {
            chatBackgroundSettings[key] = defaultSettings[key];
        }
    }
    
    applyChatBackground();
}

async function saveChatBackgroundSettings() {
    try {
        const configToSave = {
            opacity: document.getElementById('bg-opacity-slider').value,
            blur: document.getElementById('bg-blur-slider').value,
            size: document.getElementById('bg-size-select').value,
            activeBackgroundId: chatBackgroundSettings.activeBackgroundId,
            apiUrl: document.getElementById('background-api-url').value.trim(),
            apiKey: document.getElementById('background-api-key').value,
            apiModel: document.getElementById('background-api-model').value,
            autoGen: document.getElementById('auto-gen-background-toggle').checked,
            apiPromptTemplate: document.getElementById('background-api-prompt-template').value,
            aiGenWidth: parseInt(document.getElementById('background-api-width').value) || 512,
            aiGenHeight: parseInt(document.getElementById('background-api-height').value) || 768,
            aiGenRegex: document.getElementById('ai-gen-regex-input').value.trim()
        };

        chatBackgroundSettings = configToSave;
        
        await dbSet(CHAT_BACKGROUND_KEY, chatBackgroundSettings);
        
        console.log("背景设置已成功保存到数据库。", chatBackgroundSettings);

    } catch (error) {
        console.error("保存背景设置时发生严重错误:", error);
        await showCustomAlert('保存背景设置失败，请检查控制台错误信息。');
    }
}

    async function applyChatBackground() {
        const bgLayer = document.getElementById('chat-background-layer');
        const mainArea = document.getElementById('main-content-area');

        if (chatBackgroundSettings.activeBackgroundId) {
            try {
                const bg = await db.backgrounds.get(chatBackgroundSettings.activeBackgroundId);
                if (bg) {
                    bgLayer.style.backgroundImage = `url(${bg.data})`;
                    bgLayer.style.backgroundSize = chatBackgroundSettings.size;
                    bgLayer.style.opacity = chatBackgroundSettings.opacity;
                    bgLayer.style.filter = `blur(${chatBackgroundSettings.blur}px)`;
                    mainArea.style.backgroundColor = 'transparent';
                } else {
                    bgLayer.style.backgroundImage = 'none';
                    mainArea.style.backgroundColor = 'var(--center-pane-bg)';
                }
            } catch (e) {
                console.error("Failed to load background from DB:", e);
                bgLayer.style.backgroundImage = 'none';
                mainArea.style.backgroundColor = 'var(--center-pane-bg)';
            }
        } else {
            bgLayer.style.backgroundImage = 'none';
            mainArea.style.backgroundColor = 'var(--center-pane-bg)';
        }
    }
    
async function openChatBackgroundSettings() {
    systemSettingsOverlay.classList.remove('visible');
    
    await loadChatBackgroundSettings(); 

    document.getElementById('bg-opacity-slider').value = chatBackgroundSettings.opacity;
    document.getElementById('bg-blur-slider').value = chatBackgroundSettings.blur;
    document.getElementById('bg-size-select').value = chatBackgroundSettings.size;
    
    document.getElementById('background-api-url').value = chatBackgroundSettings.apiUrl || '';
    document.getElementById('background-api-key').value = chatBackgroundSettings.apiKey || '';
    
    const modelSelect = document.getElementById('background-api-model');
    modelSelect.innerHTML = ''; 

    if (chatBackgroundSettings.apiModel) {
        const option = document.createElement('option');
        option.value = chatBackgroundSettings.apiModel;
        option.textContent = chatBackgroundSettings.apiModel;
        option.selected = true;
        modelSelect.appendChild(option);
    } else {
        const placeholderOption = document.createElement('option');
        placeholderOption.textContent = '请先获取可用模型';
        placeholderOption.value = '';
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        modelSelect.appendChild(placeholderOption);
    }

    document.getElementById('auto-gen-background-toggle').checked = chatBackgroundSettings.autoGen || false;
    document.getElementById('background-api-prompt-template').value = chatBackgroundSettings.apiPromptTemplate || DEFAULT_API_PROMPT_TEMPLATE;

    document.getElementById('background-api-width').value = chatBackgroundSettings.aiGenWidth || 512;
    document.getElementById('background-api-height').value = chatBackgroundSettings.aiGenHeight || 768;

    const restoreDefaultsBtn = document.getElementById('restore-background-defaults-btn');
    if (restoreDefaultsBtn && !restoreDefaultsBtn.dataset.listenerAttached) {
        restoreDefaultsBtn.addEventListener('click', async () => {
            if (await showCustomConfirm('确定要恢复默认指令模板并清空已导入的规则文件列表吗？')) {
                document.getElementById('background-api-prompt-template').value = DEFAULT_API_PROMPT_TEMPLATE;
                backgroundJsonFiles = [];
                renderBackgroundJsonList();
                showCustomAlert('已恢复默认设置！请记得点击下方的“保存”按钮以生效.');
            }
        });
        restoreDefaultsBtn.dataset.listenerAttached = 'true';
    }

    await renderBackgroundThumbnails();
    chatBackgroundSettingsOverlay.classList.add('visible');
}

    async function renderBackgroundThumbnails() {
        const grid = document.getElementById('background-thumbnail-grid');
        grid.innerHTML = '';

        const defaultBgThumb = document.createElement('div');
        defaultBgThumb.className = 'bg-thumbnail';
        defaultBgThumb.innerHTML = `<i class="fas fa-ban fa-2x" style="color: #888;"></i>`;
        defaultBgThumb.title = "使用默认背景";
        if (chatBackgroundSettings.activeBackgroundId === null) {
            defaultBgThumb.classList.add('selected');
        }
        defaultBgThumb.addEventListener('click', () => {
            chatBackgroundSettings.activeBackgroundId = null;
            applyChatBackground();
            document.querySelectorAll('.bg-thumbnail').forEach(t => t.classList.remove('selected'));
            defaultBgThumb.classList.add('selected');
        });
        grid.appendChild(defaultBgThumb);

        const backgrounds = await db.backgrounds.toArray();
        backgrounds.forEach(bg => {
            const thumb = document.createElement('div');
            thumb.className = 'bg-thumbnail';
            if (bg.id === chatBackgroundSettings.activeBackgroundId) {
                thumb.classList.add('selected');
            }
            thumb.innerHTML = `
                <input type="checkbox" class="bg-thumbnail-checkbox" data-id="${bg.id}">
                <img src="${bg.data}" alt="background thumbnail">
                <button class="bg-thumbnail-delete" data-id="${bg.id}">&times;</button>
            `;
            thumb.querySelector('img').addEventListener('click', () => {
                if (chatBackgroundSettingsOverlay.classList.contains('delete-mode')) return;
                chatBackgroundSettings.activeBackgroundId = bg.id;
                applyChatBackground();
                document.querySelectorAll('.bg-thumbnail').forEach(t => t.classList.remove('selected'));
                thumb.classList.add('selected');
            });
            thumb.querySelector('.bg-thumbnail-delete').addEventListener('click', async (e) => {
                e.stopPropagation();
                if (await showCustomConfirm('确定要删除这张背景图吗？')) {
                    await db.backgrounds.delete(bg.id);
                    if (chatBackgroundSettings.activeBackgroundId === bg.id) {
                        chatBackgroundSettings.activeBackgroundId = null;
                        applyChatBackground();
                    }
                    await renderBackgroundThumbnails();
                }
            });
            grid.appendChild(thumb);
        });
    }
    
    function handleBackgroundUpload(event) {
        const file = event.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const newId = await db.backgrounds.add({ data: e.target.result });
                chatBackgroundSettings.activeBackgroundId = newId;
                applyChatBackground();
                await renderBackgroundThumbnails();
            } catch (err) {
                await showCustomAlert(`背景图保存失败: ${err.message}`);
            }
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    }


function setupFabListeners() {
    let isDragging = false;
    let offsetX, offsetY;
    let longPressTimer;
    let tapCount = 0;
    let tapTimeout;

    const SHORTCUT_ACTIONS = {
        'character': { icon: 'fa-user-circle', title: '人物详情', action: openCharacterDetail },
        'memory': { icon: 'fa-brain', title: '分段记忆', action: openSegmentedMemorySettings },
        'surroundings': { icon: 'fa-users', title: '周围人物', action: openCharactersOverlay },
        'settings': { icon: 'fa-cog', title: '设置', action: () => systemSettingsOverlay.classList.add('visible') },
        'background': { icon: 'fa-image', title: '更换背景', action: openChatBackgroundSettings },
        'dino': { icon: 'fa-pastafarianism', title: '恐龙快跑', action: openDinoGame },
        'snapshot': { icon: 'fa-camera-retro', title: '人生快照', action: openSnapshotManager },
        'creator': { icon: 'fa-user-edit', title: '角色制作器', action: openCharacterCreator },
        'behavior': { icon: 'fa-hand-paper', title: '行为互动', action: openBehaviorInteraction },
    };

    const FAB_ACTIONS = {
        'enhance': openEnhancementUI,
        'alchemy': openAlchemyUI,
        'refining': openRefiningUI,
        'storage': () => {
            if (currentPlayerData.isExtreme) {
                openWarehouseUI();
            } else {
                showCustomAlert('仓库功能仅在极限模式下可用。');
            }
        },
    };

    const toggleMenu = () => {
        fabContainer.classList.toggle('open');
        // 当打开菜单时，移除所有贴边类，让菜单在正确位置展开
        if (fabContainer.classList.contains('open')) {
            fabContainer.classList.remove('retracted-top', 'retracted-bottom', 'retracted-left', 'retracted-right');
        }
    };

    // ---【核心修改 ①】---
    const dragStart = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        isDragging = true;
        document.body.style.userSelect = 'none';
        fabBall.style.cursor = 'grabbing';
        offsetX = clientX - fabContainer.offsetLeft;
        offsetY = clientY - fabContainer.offsetTop;

        // 在拖拽开始时，移除所有贴边类，恢复按钮的完整形态
        fabContainer.classList.remove('retracted-top', 'retracted-bottom', 'retracted-left', 'retracted-right', 'open');
    };

    const dragMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const chatViewRect = chatView.getBoundingClientRect();
        
        let newLeft = clientX - offsetX;
        let newTop = clientY - offsetY;

        newLeft = Math.max(0, Math.min(newLeft, chatViewRect.width - fabContainer.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, chatViewRect.height - fabContainer.offsetHeight));

        fabContainer.style.left = `${newLeft}px`;
        fabContainer.style.top = `${newTop}px`;
    };

    // ---【核心修改 ②】---
    const dragEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.userSelect = '';
        fabBall.style.cursor = 'grab';
        
        const chatViewRect = chatView.getBoundingClientRect();
        const fabRect = fabContainer.getBoundingClientRect();
        const fabSize = fabRect.width;
        
        // 使用一个小的阈值（例如2像素），防止因浮点数计算误差导致无法贴边
        const threshold = 2;

        let currentLeft = fabRect.left - chatViewRect.left;
        let currentTop = fabRect.top - chatViewRect.top;

        // 判断是否贴近四个边缘，并添加对应的CSS类
        if (currentLeft < threshold) {
            fabContainer.classList.add('retracted-left');
        } else if (currentLeft > chatViewRect.width - fabSize - threshold) {
            fabContainer.classList.add('retracted-right');
        } else if (currentTop < threshold) {
            fabContainer.classList.add('retracted-top');
        } else if (currentTop > chatViewRect.height - fabSize - threshold) {
            fabContainer.classList.add('retracted-bottom');
        }
    };

   makeDraggableAndRetractable(fabContainer, toggleMenu); 


fabBall.addEventListener('dblclick', toggleMenu);
fabBall.addEventListener('contextmenu', (e) => {
e.preventDefault();
toggleMenu();
});
    
    // --- Common Listeners ---
    document.addEventListener('click', (e) => {
        if (!fabContainer.contains(e.target) && !fabShortcutMenu.contains(e.target)) {
            fabContainer.classList.remove('open');
            fabShortcutMenu.classList.add('hidden');
        }
    });

    document.querySelectorAll('.fab-item').forEach(item => {
        const action = item.dataset.action;
        if (action && FAB_ACTIONS[action]) {
            item.addEventListener('click', () => {
                FAB_ACTIONS[action]();
                fabContainer.classList.remove('open');
            });
        }
    });

    document.querySelectorAll('.fab-shortcut').forEach(item => {
        item.addEventListener('click', (e) => {
            const shortcutIndex = parseInt(item.dataset.shortcutIndex);
            const currentShortcut = fabShortcutConfig[shortcutIndex];
            if (currentShortcut && SHORTCUT_ACTIONS[currentShortcut]) {
                SHORTCUT_ACTIONS[currentShortcut].action();
                fabContainer.classList.remove('open');
            } else {
                showShortcutMenu(e, shortcutIndex);
            }
        });
        
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const shortcutIndex = parseInt(item.dataset.shortcutIndex);
            delete fabShortcutConfig[shortcutIndex];
            saveFabShortcutConfig();
            renderFabShortcuts();
            fabContainer.classList.remove('open');
            showCustomAlert('快捷方式已清除');
        });
    });
    
    function showShortcutMenu(e, index) {
        fabShortcutMenu.innerHTML = '';
        Object.entries(SHORTCUT_ACTIONS).forEach(([key, value]) => {
            const button = document.createElement('button');
            button.innerHTML = `<i class="fas ${value.icon} fa-fw"></i> ${value.title}`;
            button.onclick = () => {
                fabShortcutConfig[index] = key;
                saveFabShortcutConfig();
                renderFabShortcuts();
                fabShortcutMenu.classList.add('hidden');
                fabContainer.classList.remove('open');
            };
            fabShortcutMenu.appendChild(button);
        });

        fabShortcutMenu.classList.remove('hidden');
        positionMenu(fabShortcutMenu, e);
    }
}

    
    async function loadFabShortcutConfig() {
        fabShortcutConfig = await dbGet(FAB_SHORTCUTS_KEY) || {};
        renderFabShortcuts();
    }

    async function saveFabShortcutConfig() {
        await dbSet(FAB_SHORTCUTS_KEY, fabShortcutConfig);
    }

    function renderFabShortcuts() {
const SHORTCUT_ACTIONS = {
'character': { icon: 'fa-user-circle', title: '人物详情', action: openCharacterDetail },
'memory': { icon: 'fa-brain', title: '分段记忆', action: openSegmentedMemorySettings },
'surroundings': { icon: 'fa-users', title: '周围人物', action: openCharactersOverlay },
'settings': { icon: 'fa-cog', title: '设置', action: () => systemSettingsOverlay.classList.add('visible') },
'background': { icon: 'fa-image', title: '更换背景', action: openChatBackgroundSettings },
'dino': { icon: 'fa-pastafarianism', title: '恐龙快跑', action: openDinoGame },
'snapshot': { icon: 'fa-camera-retro', title: '人生快照', action: openSnapshotManager },
'creator': { icon: 'fa-user-edit', title: '角色制作器', action: openCharacterCreator },
'behavior': { icon: 'fa-hand-paper', title: '行为互动', action: openBehaviorInteraction },
};

document.querySelectorAll('.fab-shortcut').forEach(item => {
const index = parseInt(item.dataset.shortcutIndex);
const shortcutKey = fabShortcutConfig[index];
if (shortcutKey && SHORTCUT_ACTIONS[shortcutKey]) {
const config = SHORTCUT_ACTIONS[shortcutKey];
item.innerHTML = `<i class="fas ${config.icon}"></i>`;
item.title = config.title;
} else {
item.innerHTML = '<i class="fas fa-plus"></i>';
item.title = '设置快捷方式';
}
});
}

    function openEnhancementUI() {
        enhancementState = {
            mainItem: null,
            materials: [null, null, null, null],
            pickerCallback: null,
        };
        updateEnhancementUI();
        enhancementOverlay.classList.add('visible');
    }
	
async function gatherAllSettings() {
    const aiTheaterConfig = {
        apiEndpoint: localStorage.getItem('theater_apiEndpoint') || '',
        apiKey: localStorage.getItem('theater_apiKey') || '',
        apiModel: localStorage.getItem('theater_apiModel') || '',
        apiPrompt: localStorage.getItem('theater_apiPrompt') || '',
        autoGenEnabled: localStorage.getItem('theater_autoGenEnabled') === 'true',
        isDailyPaperMode: localStorage.getItem('theater_isDailyPaperMode') === 'true',
        dailyPaperPrompt: localStorage.getItem('theater_dailyPaperPrompt') || ''
    };
    const settingsPackage = {
        version: "8.92_settings_v1",
        timestamp: new Date().toISOString(),
        thinkingApiConfig: await dbGet(THINKING_API_CONFIG_KEY) || {},
        thinkingPresets: await dbGet(THINKING_PRESETS_KEY) || {},
        imageTaggingApiConfig: await dbGet(IMAGE_TAGGING_API_CONFIG_KEY) || {},
        imageTaggingJsonFiles: await dbGet(IMAGE_TAGGING_JSON_FILES_KEY) || [],
        regexConfig: await dbGet(REGEX_CONFIG_KEY) || {},
        chatBackgroundSettings: await dbGet(CHAT_BACKGROUND_KEY) || {},
        chatBackgroundJsonFiles: await dbGet(BACKGROUND_JSON_FILES_KEY) || [],
        funSettings: await dbGet(FUN_SETTINGS_KEY) || {},
        attributeAlignmentConfig: await dbGet(ATTRIBUTE_ALIGNMENT_KEY) || {},
        fabShortcutConfig: await dbGet(FAB_SHORTCUTS_KEY) || {},
        knowledgeSearchConfig: await dbGet(KNOWLEDGE_SEARCH_API_CONFIG_KEY) || {},
        aiTheaterConfig: aiTheaterConfig,
        customBirths: await dbGet(CUSTOM_BIRTHS_KEY) || [],
        customRaces: await dbGet(CUSTOM_RACES_KEY) || [],
        customTraits: await dbGet(CUSTOM_TRAITS_KEY) || [],
        bondedCharacters: await dbGet(CUSTOM_BONDED_CHARS_KEY) || [],
        worldBookEntries: await dbGet(WORLDBOOK_ENTRIES_KEY) || [],
        regexPresets: await dbGet(REGEX_PRESETS_KEY) || [],
        characterTemplates: await dbGet(CHARACTER_TEMPLATES_KEY) || [],
        customAffixes: await dbGet(CUSTOM_AFFIXES_KEY) || [],
        customMapColors: await dbGet(CUSTOM_MAP_COLORS_KEY) || []
    };
    return settingsPackage;
}

async function applyAllSettings(settings) {
    if (!settings) throw new Error("接收到的配置为空。");
    if (settings.thinkingApiConfig) await dbSet(THINKING_API_CONFIG_KEY, settings.thinkingApiConfig);
    if (settings.thinkingPresets) await dbSet(THINKING_PRESETS_KEY, settings.thinkingPresets);
    if (settings.imageTaggingApiConfig) await dbSet(IMAGE_TAGGING_API_CONFIG_KEY, settings.imageTaggingApiConfig);
    if (settings.imageTaggingJsonFiles) await dbSet(IMAGE_TAGGING_JSON_FILES_KEY, settings.imageTaggingJsonFiles);
    if (settings.regexConfig) await dbSet(REGEX_CONFIG_KEY, settings.regexConfig);
    if (settings.chatBackgroundSettings) await dbSet(CHAT_BACKGROUND_KEY, settings.chatBackgroundSettings);
    if (settings.chatBackgroundJsonFiles) await dbSet(BACKGROUND_JSON_FILES_KEY, settings.chatBackgroundJsonFiles);
    if (settings.funSettings) await dbSet(FUN_SETTINGS_KEY, settings.funSettings);
    if (settings.attributeAlignmentConfig) await dbSet(ATTRIBUTE_ALIGNMENT_KEY, settings.attributeAlignmentConfig);
    if (settings.fabShortcutConfig) await dbSet(FAB_SHORTCUTS_KEY, settings.fabShortcutConfig);
    if (settings.knowledgeSearchConfig) await dbSet(KNOWLEDGE_SEARCH_API_CONFIG_KEY, settings.knowledgeSearchConfig);
    if (settings.customBirths) await dbSet(CUSTOM_BIRTHS_KEY, settings.customBirths);
    if (settings.customRaces) await dbSet(CUSTOM_RACES_KEY, settings.customRaces);
    if (settings.customTraits) await dbSet(CUSTOM_TRAITS_KEY, settings.customTraits);
    if (settings.bondedCharacters) await dbSet(CUSTOM_BONDED_CHARS_KEY, settings.bondedCharacters);
    if (settings.worldBookEntries) await dbSet(WORLDBOOK_ENTRIES_KEY, settings.worldBookEntries);
    if (settings.regexPresets) await dbSet(REGEX_PRESETS_KEY, settings.regexPresets);
    if (settings.characterTemplates) await dbSet(CHARACTER_TEMPLATES_KEY, settings.characterTemplates);
    if (settings.customAffixes) await dbSet(CUSTOM_AFFIXES_KEY, settings.customAffixes);
    if (settings.customMapColors) await dbSet(CUSTOM_MAP_COLORS_KEY, settings.customMapColors);
    if (settings.aiTheaterConfig) {
        localStorage.setItem('theater_apiEndpoint', settings.aiTheaterConfig.apiEndpoint || '');
        localStorage.setItem('theater_apiKey', settings.aiTheaterConfig.apiKey || '');
        localStorage.setItem('theater_apiModel', settings.aiTheaterConfig.apiModel || '');
        localStorage.setItem('theater_apiPrompt', settings.aiTheaterConfig.apiPrompt || '');
        localStorage.setItem('theater_autoGenEnabled', settings.aiTheaterConfig.autoGenEnabled || false);
        localStorage.setItem('theater_isDailyPaperMode', settings.aiTheaterConfig.isDailyPaperMode || false);
        localStorage.setItem('theater_dailyPaperPrompt', settings.aiTheaterConfig.dailyPaperPrompt || '');
    }
    
    await loadRegexConfig();
    await loadSummaryConfig();
    await manageThinkingApiSettings();
    await manageKnowledgeSearchApiSettings();
    await loadFunSettings();
    await loadChatBackgroundSettings();
    await loadAttributeAlignmentConfig();
    await loadFabShortcutConfig();
    await manageImageTaggingApiSettings();
    await loadTextImageJsonFiles();
    await loadBackgroundJsonFiles();
    console.log("所有配置已应用，并且UI已刷新。");
}

async function uploadAllSettings() {
    if (!cloudStorageConfig.enabled || !cloudStorageConfig.apiUrl) {
        await showCustomAlert('请先在设置中启用云存档并配置服务器地址。');
        return;
    }

    if (!await showCustomConfirm('确定要上传你当前所有的面板配置到云端吗？云端的旧配置将会被覆盖。')) {
        return;
    }

    try {
        const settingsPackage = await gatherAllSettings();
        
        const response = await fetch(`${cloudStorageConfig.apiUrl}/api/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                archiveName: "__GLOBAL_PANEL_SETTINGS__",
                data: settingsPackage
            })
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.error || `服务器错误: ${response.status}`);
        }

        await showCustomAlert('全部配置已成功上传至云端！');
    } catch (error) {
        console.error("上传配置失败:", error);
        await showCustomAlert(`上传失败: ${error.message}`);
    }
}

async function downloadAllSettings() {
    if (!cloudStorageConfig.enabled || !cloudStorageConfig.apiUrl) {
        await showCustomAlert('请先在设置中启用云存档并配置服务器地址。');
        return;
    }

    if (!await showCustomConfirm('确定要从云端下载并覆盖所有本地配置吗？此操作不可撤销。')) {
        return;
    }

    try {
        const response = await fetch(`${cloudStorageConfig.apiUrl}/api/load?archiveName=__GLOBAL_PANEL_SETTINGS__`);
        
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.error || `服务器错误: ${response.status}`);
        }
        
        await applyAllSettings(result.data);
        await showCustomAlert('已从云端同步并应用所有配置！');
        document.getElementById('cloud-storage-settings-overlay').classList.remove('visible');

    } catch (error) {
        console.error("下载配置失败:", error);
        await showCustomAlert(`下载失败: ${error.message}`);
    }
}


    function updateEnhancementUI() {
        const mainSlot = document.getElementById('enhancement-main-slot');
        const materialSlots = document.querySelectorAll('.enhancement-slot[id^="enhancement-material-slot"]');
        const successRateEl = document.getElementById('enhancement-success-rate');
        const startBtn = document.getElementById('start-enhancement-btn');

        const renderSlot = (slot, item) => {
            if (item) {
                slot.innerHTML = `<i class="fas ${itemIconMap[item.type] || 'fa-question-circle'} fa-2x"></i>`;
                slot.classList.add('filled');
            } else {
                slot.innerHTML = '';
                slot.classList.remove('filled');
            }
        };

        renderSlot(mainSlot, enhancementState.mainItem);
        materialSlots.forEach((slot, index) => {
            renderSlot(slot, enhancementState.materials[index]);
        });

        if (enhancementState.mainItem) {
            const affixes = (enhancementState.mainItem.effect.match(/:\s/g) || []).length;
            const baseRate = 80;
            const successRate = Math.max(10, baseRate - (affixes * (Math.random() * 10 + 10)));
            successRateEl.textContent = `成功率: ${successRate.toFixed(0)}%`;
        } else {
            successRateEl.textContent = '成功率: --%';
        }

        const materialCount = enhancementState.materials.filter(m => m && m.type === '材料').length;
        const importantCount = enhancementState.materials.filter(m => m && m.type === '重要物品').length;
        
        startBtn.disabled = !(enhancementState.mainItem && (materialCount >= 4 || importantCount >= 2));
    }

    function openEnhancementPicker(type, index = null) {
        const currentSelectedIds = new Set();
        if (enhancementState.mainItem) {
            currentSelectedIds.add(enhancementState.mainItem.id);
        }
        enhancementState.materials.forEach(item => {
            if (item) currentSelectedIds.add(item.id);
        });

        let itemsToShow = [];
        if (type === 'main') {
            pickerTitle.textContent = '选择要强化的装备';
            itemsToShow = inventoryItems.filter(i => 
                ['武器', '护甲', '法宝'].includes(i.type) && !currentSelectedIds.has(i.id)
            );
            enhancementState.pickerCallback = (item) => {
                enhancementState.mainItem = item;
            };
        } else {
            pickerTitle.textContent = `选择材料 (槽位 ${index + 1})`;
            itemsToShow = inventoryItems.filter(i => 
                ['材料', '重要物品'].includes(i.type) && !currentSelectedIds.has(i.id)
            );
            enhancementState.pickerCallback = (item) => {
                enhancementState.materials[index] = item;
            };
        }

        pickerGrid.innerHTML = '';
        if (itemsToShow.length === 0) {
            pickerGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; opacity: 0.7;">没有可用的物品。</p>`;
        } else {
            itemsToShow.forEach(item => {
                const slot = document.createElement('div');
                slot.className = 'inventory-slot';
                slot.innerHTML = `<i class="fas ${itemIconMap[item.type]} inventory-slot-icon"></i><span class="inventory-slot-name">${item.name}</span>`;
                slot.addEventListener('click', () => {
                    enhancementState.pickerCallback(item);
                    updateEnhancementUI();
                    closeEquipmentPicker();
                });
                pickerGrid.appendChild(slot);
            });
        }
        pickerOverlay.classList.add('visible');
    }

    async function startEnhancement() {
        const { mainItem, materials } = enhancementState;
        if (!mainItem) return;

        const affixes = (mainItem.effect.match(/:\s/g) || []).length;
        if (affixes >= 5) {
            await showCustomAlert('此装备已达强化上限！');
            return;
        }

        const baseRate = 80;
        const successRate = Math.max(10, baseRate - (affixes * (Math.random() * 10 + 10)));
        const roll = Math.random() * 100;
        
        const materialsToRemove = materials.filter(m => m && m.type === '材料').slice(0, 4);
        const importantsToRemove = materials.filter(m => m && m.type === '重要物品').slice(0, 2);
        const itemsToRemove = materialsToRemove.length >= 4 ? materialsToRemove : importantsToRemove;
        
        itemsToRemove.forEach(item => {
            const itemInDb = currentState['1'][item.id];
            if (itemInDb) {
                if (parseInt(itemInDb['5']) > 1) {
                    itemInDb['5'] = (parseInt(itemInDb['5']) - 1).toString();
                } else {
                    delete currentState['1'][item.id];
                }
            }
        });

        if (roll <= successRate) {
            const newAffix = await generateRandomAffix();
            const itemInDb = currentState['1'][mainItem.id];
            const currentEffect = (itemInDb['4'] || '').replace('无', '').trim();
            const newEffect = currentEffect ? `${currentEffect}, ${newAffix}` : newAffix;
            itemInDb['4'] = newEffect;
            await showCustomAlert(`强化成功！获得新词条：${newAffix}`);
        } else {
            await showCustomAlert('强化失败...');
            const itemInDb = currentState['1'][mainItem.id];
            const existingAffixes = (itemInDb['4'] || '').split(',').map(s => s.trim()).filter(Boolean);
            if (existingAffixes.length > 0) {
                const indexToRemove = Math.floor(Math.random() * existingAffixes.length);
                const affixToRemove = existingAffixes[indexToRemove];
                existingAffixes.splice(indexToRemove, 1);
                itemInDb['4'] = existingAffixes.join(', ');
                await showCustomAlert(`损失词条：${affixToRemove}`);
            }
        }

        await saveCurrentState();
        syncStateFromTables();
        renderInventory(inventoryItems);
        openEnhancementUI();
    }

    async function generateRandomAffix() {
        const customAffixes = await dbGet(CUSTOM_AFFIXES_KEY) || [];
        const defaultAttributes = Object.keys(CREATION_CONFIG.ATTRIBUTES);
        const allAffixNames = [...new Set([...defaultAttributes, ...customAffixes.map(a => a.name)])];
        
        const randAttrName = allAffixNames[Math.floor(Math.random() * allAffixNames.length)];
        const customAffixData = customAffixes.find(a => a.name === randAttrName);

        const rarities = ['平庸', '普通', '史诗', '传说', '神迹'];
        const randRarity = rarities[Math.floor(Math.random() * rarities.length)];
        
        let value;
        let isPercent = Math.random() > 0.5;
        
        if (customAffixData) {
            const rarityData = customAffixData.values[randRarity];
            if (rarityData) {
                isPercent = rarityData.isPercent;
                const min = rarityData.min;
                const max = rarityData.max;
                value = isPercent ? (Math.random() * (max - min) + min).toFixed(1) : Math.floor(Math.random() * (max - min + 1) + min);
            }
        }
        
        if (value === undefined) { // Fallback for default attributes or missing custom data
            switch(randRarity) {
                case '平庸': value = isPercent ? (Math.random() * 2 + 1).toFixed(1) : Math.floor(Math.random() * 5 + 1); break;
                case '普通': value = isPercent ? (Math.random() * 4 + 2).toFixed(1) : Math.floor(Math.random() * 10 + 5); break;
                case '史诗': value = isPercent ? (Math.random() * 6 + 4).toFixed(1) : Math.floor(Math.random() * 20 + 10); break;
                case '传说': value = isPercent ? (Math.random() * 8 + 6).toFixed(1) : Math.floor(Math.random() * 30 + 20); break;
                case '神迹': value = isPercent ? (Math.random() * 10 + 8).toFixed(1) : Math.floor(Math.random() * 50 + 30); break;
            }
        }

        return `${randRarity}: ${randAttrName} +${value}${isPercent ? '%' : ''}`;
    }

    function openAlchemyUI() {
        alchemyState = { materials: [null, null, null, null], pickerCallback: null };
        updateAlchemyUI();
        alchemyOverlay.classList.add('visible');
    }

    function updateAlchemyUI() {
        const materialSlots = document.querySelectorAll('#alchemy-grid .crafting-slot');
        const startBtn = document.getElementById('start-alchemy-btn');

        materialSlots.forEach((slot, index) => {
            const item = alchemyState.materials[index];
            if (item) {
                slot.innerHTML = `<i class="fas ${itemIconMap[item.type] || 'fa-question-circle'} fa-2x"></i>`;
                slot.classList.add('filled');
            } else {
                slot.innerHTML = '';
                slot.classList.remove('filled');
            }
        });

        const materialCount = alchemyState.materials.filter(m => m).length;
        startBtn.disabled = materialCount === 0;
    }

    function openAlchemyPicker(index) {
        const currentSelectedIds = new Set(
            alchemyState.materials.filter(item => item).map(item => item.id)
        );

        pickerTitle.textContent = `选择炼丹材料 (槽位 ${index + 1})`;
        const itemsToShow = inventoryItems.filter(i => 
            i.type === '材料' && !currentSelectedIds.has(i.id)
        );
        
        alchemyState.pickerCallback = (item) => {
            alchemyState.materials[index] = item;
        };

        pickerGrid.innerHTML = '';
        if (itemsToShow.length === 0) {
            pickerGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; opacity: 0.7;">没有可用的材料。</p>`;
        } else {
            itemsToShow.forEach(item => {
                const slot = document.createElement('div');
                slot.className = 'inventory-slot';
                slot.innerHTML = `<i class="fas ${itemIconMap[item.type]} inventory-slot-icon"></i><span class="inventory-slot-name">${item.name}</span>`;
                slot.addEventListener('click', () => {
                    alchemyState.pickerCallback(item);
                    updateAlchemyUI();
                    closeEquipmentPicker();
                });
                pickerGrid.appendChild(slot);
            });
        }
        pickerOverlay.classList.add('visible');
    }

    async function startAlchemy() {
        const materials = alchemyState.materials.filter(m => m);
        if (materials.length === 0) return;

        materials.forEach(item => {
            const itemInDb = currentState['1'][item.id];
            if (itemInDb) {
                if (parseInt(itemInDb['5']) > 1) {
                    itemInDb['5'] = (parseInt(itemInDb['5']) - 1).toString();
                } else {
                    delete currentState['1'][item.id];
                }
            }
        });
        await saveCurrentState();
        syncStateFromTables();

        if (Math.random() < 0.4) {
            await showCustomAlert('炼丹失败，材料化为一滩焦炭。');
        } else {
            const tier = getAlchemyTier();
            addAction('alchemy', materials, { tier: tier });
            await showCustomAlert(`炼丹成功！你似乎炼制出了一颗${tier}阶丹药...`);
            await sendMessage();
        }
        alchemyOverlay.classList.remove('visible');
    }

    function getAlchemyTier() {
        const tiers = [
            { tier: 1, prob: 60 }, { tier: 2, prob: 15 }, { tier: 3, prob: 8 },
            { tier: 4, prob: 5 }, { tier: 5, prob: 4 }, { tier: 6, prob: 3 },
            { tier: 7, prob: 2 }, { tier: 8, prob: 1.5 }, { tier: 9, prob: 1 },
            { tier: 10, prob: 0.5 }
        ];
        const totalProb = tiers.reduce((sum, t) => sum + t.prob, 0);
        let roll = Math.random() * totalProb;
        for (const t of tiers) {
            if (roll < t.prob) return t.tier;
            roll -= t.prob;
        }
        return 1;
    }

    function openRefiningUI() {
        refiningState = { materials: [null, null, null, null], pickerCallback: null };
        updateRefiningUI();
        refiningOverlay.classList.add('visible');
    }

    function updateRefiningUI() {
        const materialSlots = document.querySelectorAll('#refining-grid .crafting-slot');
        const startBtn = document.getElementById('start-refining-btn');

        materialSlots.forEach((slot, index) => {
            const item = refiningState.materials[index];
            if (item) {
                slot.innerHTML = `<i class="fas ${itemIconMap[item.type] || 'fa-question-circle'} fa-2x"></i>`;
                slot.classList.add('filled');
            } else {
                slot.innerHTML = '';
                slot.classList.remove('filled');
            }
        });

        const materialCount = refiningState.materials.filter(m => m).length;
        startBtn.disabled = materialCount < 4;
    }

    function openRefiningPicker(index) {
        const currentSelectedIds = new Set(
            refiningState.materials.filter(item => item).map(item => item.id)
        );

        pickerTitle.textContent = `选择炼器材料 (槽位 ${index + 1})`;
        const itemsToShow = inventoryItems.filter(i => 
            i.type === '重要物品' && !currentSelectedIds.has(i.id)
        );
        
        refiningState.pickerCallback = (item) => {
            refiningState.materials[index] = item;
        };

        pickerGrid.innerHTML = '';
        if (itemsToShow.length === 0) {
            pickerGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; opacity: 0.7;">没有可用的重要物品。</p>`;
        } else {
            itemsToShow.forEach(item => {
                const slot = document.createElement('div');
                slot.className = 'inventory-slot';
                slot.innerHTML = `<i class="fas ${itemIconMap[item.type]} inventory-slot-icon"></i><span class="inventory-slot-name">${item.name}</span>`;
                slot.addEventListener('click', () => {
                    refiningState.pickerCallback(item);
                    updateRefiningUI();
                    closeEquipmentPicker();
                });
                pickerGrid.appendChild(slot);
            });
        }
        pickerOverlay.classList.add('visible');
    }

    async function startRefining() {
        const materials = refiningState.materials.filter(m => m);
        if (materials.length < 4) return;

        materials.forEach(item => {
            const itemInDb = currentState['1'][item.id];
            if (itemInDb) {
                if (parseInt(itemInDb['5']) > 1) {
                    itemInDb['5'] = (parseInt(itemInDb['5']) - 1).toString();
                } else {
                    delete currentState['1'][item.id];
                }
            }
        });
        await saveCurrentState();
        syncStateFromTables();

        addAction('refining', materials);
        await showCustomAlert('炼器开始，你将材料投入炉中，静待其变...');
        await sendMessage();
        refiningOverlay.classList.remove('visible');
    }

    function checkPlayerDeath() {
        if (!currentPlayerData.isExtreme) return;

        const currentHp = currentPlayerData.hp.current;
        const currentShouyuan = parseInt(currentPlayerData.shouyuan);

        if (currentHp <= 10 || currentShouyuan <= 0) {
            handlePlayerDeath();
        }
    }

    async function handlePlayerDeath() {
        await showCustomAlert("你已死亡，一切归零...");
        
        const archive = await db.archives.get(currentArchiveName);
        if (!archive) return;

        const firstLog = archive.data.logs.find(log => log.content.includes('<h4>天道初启</h4>'));
        if (!firstLog || !firstLog.stateSnapshot) {
            await showCustomAlert("错误：找不到初始存档快照，无法回溯。请检查存档是否损坏。");
            return;
        }
        
        const initialTableState = JSON.parse(firstLog.stateSnapshot);
        const initialPlayerRow = JSON.parse(JSON.stringify(initialTableState['0']['B1']));

        const oldRemarks = parseRemarksString(initialPlayerRow['9']);
        oldRemarks.deathCount = (currentPlayerData.deathCount || 0) + 1;
        initialPlayerRow['9'] = serializeRemarksObject(oldRemarks);
        
        const newTableState = getInitialTableState();
        
        newTableState['0']['B1'] = initialPlayerRow;
        
        const warehouseItems = currentPlayerData.warehouse || [];
        warehouseItems.forEach((item) => {
            let itemData;
            const tableIndex = getTableIndexFromId(item.id);
            if (tableIndex !== null) {
                itemData = currentState[tableIndex]?.[item.id];
                if(itemData) {
                    newTableState[tableIndex][item.id] = itemData;
                }
            }
        });
        
        firstLog.stateSnapshot = JSON.stringify(newTableState);

        archive.data.logs = [firstLog];
        archive.data.state.currentState = newTableState;
        archive.data.state.bondedCharacters = {};
        archive.data.state.rpgMaps = {};
        
        await db.archives.put(archive);
        await selectAndLoadArchive(currentArchiveName);
    }

    function toggleExtremeModeUI(isExtreme) {
        cultivationPanel.classList.toggle('extreme-mode', isExtreme);
        
        let label = document.getElementById('main-extreme-label');
        if (isExtreme) {
            if (!label) {
                label = document.createElement('div');
                label.id = 'main-extreme-label';
                label.className = 'extreme-label';
                label.textContent = '极限';
                characterDisplay.appendChild(label);
            }
        } else {
            if (label) label.remove();
        }
    }

    function getWarehouseCapacity() {
        const realm = currentPlayerData.realm || '';
        if (realm.includes('炼气')) return 1;
        if (realm.includes('筑基')) return 2;
        if (realm.includes('结丹') || realm.includes('金丹')) return 3;
        if (realm.includes('元婴')) return 4;
        if (realm.includes('化神')) return 5;
        if (realm.includes('炼虚')) return 6;
        if (realm.includes('合体')) return 7;
        if (realm.includes('大乘')) return 8;
        return 1;
    }

    function openWarehouseUI() {
        const grid = document.getElementById('warehouse-grid');
        grid.innerHTML = '';
        const capacity = getWarehouseCapacity();
        warehouseState.slots = currentPlayerData.warehouse || [];
        warehouseState.slots.length = capacity; // Adjust array size

        grid.style.gridTemplateColumns = `repeat(${Math.min(capacity, 4)}, 1fr)`;

        for (let i = 0; i < capacity; i++) {
            const slot = document.createElement('div');
            slot.className = 'warehouse-slot';
            const item = warehouseState.slots[i];
            if (item) {
                const itemType = item.type || (item.gender ? '人物' : '未知');
                slot.classList.add('filled');
                slot.innerHTML = `
                    <i class="fas ${itemIconMap[itemType] || 'fa-question-circle'} item-slot-icon"></i>
                    <span class="item-slot-name">${item.name}</span>
                `;
            }
            slot.addEventListener('click', () => openWarehousePicker(i));
            grid.appendChild(slot);
        }
        warehouseOverlay.classList.add('visible');
    }

    function openWarehousePicker(slotIndex) {
        warehouseState.currentSlotIndex = slotIndex;
        const categorySelector = document.getElementById('warehouse-category-selector');
        const itemList = document.getElementById('warehouse-item-list');
        categorySelector.innerHTML = `
            <button class="major-action-button" data-category="inventory">储物袋</button>
            <button class="major-action-button" data-category="characters">周围人物</button>
            <button class="major-action-button" data-category="beasts">灵兽</button>
            <button class="major-action-button" data-category="skills">技能</button>
        `;
        itemList.innerHTML = '';
        
        categorySelector.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                renderWarehouseItemList(e.target.dataset.category);
            });
        });

        warehousePickerOverlay.classList.add('visible');
    }

    function renderWarehouseItemList(category) {
        const itemList = document.getElementById('warehouse-item-list');
        itemList.innerHTML = '';
        let itemsToDisplay = [];
        let itemType = '物品';

        switch(category) {
            case 'inventory':
                itemsToDisplay = inventoryItems;
                itemType = '物品';
                break;
            case 'characters':
                itemsToDisplay = surroundingCharacters.filter(c => c.id !== 'B1');
                itemType = '人物';
                break;
            case 'beasts':
                itemsToDisplay = Object.values(currentState['7'] || []).map(b => ({id: b['0'], name: b['1'], type: '灵兽'}));
                itemType = '灵兽';
                break;
            case 'skills':
                itemsToDisplay = Object.values(currentState['8'] || []).map(s => ({id: s['0'], name: s['1'], type: '技能'}));
                itemType = '技能';
                break;
        }

        itemsToDisplay.forEach(item => {
            const button = document.createElement('button');
            button.className = 'major-action-button';
            const finalType = item.type || itemType;
            button.innerHTML = `<i class="fas ${itemIconMap[finalType] || 'fa-question-circle'} fa-fw"></i> ${item.name}`;
            button.addEventListener('click', () => {
                warehouseState.slots[warehouseState.currentSlotIndex] = { id: item.id, name: item.name, type: finalType };
                currentPlayerData.warehouse = warehouseState.slots.filter(Boolean);
                saveCurrentState();
                warehousePickerOverlay.classList.remove('visible');
                openWarehouseUI();
            });
            itemList.appendChild(button);
        });
    }
    
    function openAIGenInterface() {
document.getElementById('ai-gen-width').value = chatBackgroundSettings.aiGenWidth || 512;
document.getElementById('ai-gen-height').value = chatBackgroundSettings.aiGenHeight || 768;
document.getElementById('auto-image-gen-toggle').checked = chatBackgroundSettings.autoImageGen || false;
document.getElementById('ai-gen-regex-input').value = chatBackgroundSettings.aiGenRegex || '';
aiImageGenOverlay.classList.add('visible');
}

async function handleAIGenRequest(prompt, isAuto = false, statusElement = null) {
    if (typeof eventEmit !== 'function' || typeof eventOn !== 'function') {
        if (statusElement) statusElement.remove();
        if (!isAuto) await showCustomAlert('错误：未找到前端助手通信接口 (eventEmit/eventOn)。');
        return;
    }
    
    // ===== 【核心修改点】 =====
    // 不再从固定的 'ai-gen-width' 读取，而是从我们统一的配置对象 chatBackgroundSettings 中读取
    const width = chatBackgroundSettings.aiGenWidth || 512;
    const height = chatBackgroundSettings.aiGenHeight || 768;
    // ===== 【修改结束】 =====
    
    const statusEl = document.getElementById('ai-gen-status');

    if (!prompt) {
        if (statusElement) statusElement.remove();
        if (!isAuto) statusEl.textContent = '提示词不能为空！';
        return;
    }

    const requestId = `bg_${Date.now()}`;
    const requestData = { id: requestId, prompt, width, height, type: 1 };
    
    if (isAuto && statusElement) {
        statusElement.innerHTML = `<i class="fas fa-spinner fa-spin"></i> 关键词获取成功，正在请求生成图片...`;
    } else if (!isAuto) {
        statusEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在发送请求...';
    }

    const responseListener = async (responseData) => {
        if (responseData.id !== requestId) return;

        if (statusElement) statusElement.remove();

        if (window.eventRemoveListener) {
            window.eventRemoveListener('generate-image-response', responseListener);
            window.eventRemoveListener('generate_image_response', responseListener);
        }

        if (responseData.success && responseData.imageData) {
            if (!isAuto) statusEl.textContent = '生成成功！正在保存...';
            try {
                const newId = await db.backgrounds.add({ data: responseData.imageData });
                chatBackgroundSettings.activeBackgroundId = newId;
                await saveChatBackgroundSettings(); // 保存，确保 activeBackgroundId 被记录
                applyChatBackground();
                await renderBackgroundThumbnails();
                if (!isAuto) {
                    statusEl.textContent = '背景已设置！';
                    setTimeout(() => aiImageGenOverlay.classList.remove('visible'), 1000);
                } else {
                    showDanmaku('自动生图完成，背景已更新！', 'world');
                }
            } catch (err) {
                const errorMsg = `保存失败: ${err.message}`;
                if (!isAuto) statusEl.textContent = errorMsg;
                else showDanmaku(errorMsg, 'error');
            }
        } else {
            const errorMsg = `生成失败: ${responseData.error || '未知错误'}`;
            if (!isAuto) {
                statusEl.textContent = errorMsg;
            } else {
                showDanmaku(errorMsg, 'error');
            }
        }
    };

    eventOn('generate-image-response', responseListener);
    eventOn('generate_image_response', responseListener);

    console.log('正在发送生图请求...', requestData);
    await eventEmit('generate-image-request', requestData);
    // tavern的事件名可能是下划线风格
    await eventEmit('generate_image_request', requestData); 
}

    async function handleBatchDeleteClick() {
const modal = document.getElementById('chat-background-settings-modal');
const btn = document.getElementById('batch-delete-background-btn');

// 如果当前正处于删除模式，则执行删除逻辑
if (modal.classList.contains('delete-mode')) {
const checkboxes = modal.querySelectorAll('.bg-thumbnail-checkbox:checked');

if (checkboxes.length > 0) {
const idsToDelete = Array.from(checkboxes).map(cb => parseInt(cb.dataset.id));
if (await showCustomConfirm(`确定要删除选中的 ${idsToDelete.length} 张背景图吗？`)) {
await db.backgrounds.bulkDelete(idsToDelete);
if (idsToDelete.includes(chatBackgroundSettings.activeBackgroundId)) {
chatBackgroundSettings.activeBackgroundId = null;
applyChatBackground();
}
await renderBackgroundThumbnails();
}
}

// 无论是否删除了图片，操作完成后都退出删除模式
modal.classList.remove('delete-mode');
btn.textContent = '批量删除';
btn.style.borderColor = ''; // 恢复默认样式
btn.style.color = '';
modal.querySelectorAll('.bg-thumbnail-checkbox').forEach(cb => cb.checked = false);

} else { // 如果不处于删除模式，则进入删除模式
modal.classList.add('delete-mode');
btn.textContent = '完成删除';
btn.style.borderColor = '#66bb6a'; // 用绿色提示当前为确认操作
btn.style.color = '#66bb6a';
}
}

    async function getArchiveAchievements() {
        const archive = await db.archives.get(currentArchiveName);
        if (!archive.data.state.achievements) {
            archive.data.state.achievements = { completed: [], custom: [] };
        }
        return archive.data.state.achievements;
    }

    async function openAchievementWall() {
const bookshelf = document.getElementById('achievement-bookshelf');
bookshelf.innerHTML = '';

const achievements = await getArchiveAchievements();

const allAchievements = [...BUILT_IN_ACHIEVEMENTS, ...(achievements.custom || [])];


const achievementSystemToggle = document.getElementById('achievement-system-toggle');
const achievementStats = document.getElementById('achievement-stats');


const achievementSystemEnabled = (await dbGet('ACHIEVEMENT_SYSTEM_ENABLED')) !== false; // 默认启用
achievementSystemToggle.checked = achievementSystemEnabled;


const completedCount = achievements.completed.length;
const totalCount = allAchievements.length;
achievementStats.textContent = `完成: ${completedCount} / 总数: ${totalCount}`;

if (allAchievements.length === 0) {
bookshelf.innerHTML = '<p style="text-align:center; color: #ccc; opacity: 0.7;">还没有任何成就，快去创建吧！</p>';
} else {

allAchievements.forEach(ach => {
const book = document.createElement('div');
book.className = 'book';
book.textContent = ach.name;
if (achievements.completed.includes(ach.id)) {
book.classList.add('completed');
}
book.addEventListener('click', () => showAchievementDetail(ach));
bookshelf.appendChild(book); // 直接添加到 bookshelf，由 grid 布局
});
}

achievementOverlay.classList.add('visible');


achievementSystemToggle.onchange = async (e) => {
await dbSet('ACHIEVEMENT_SYSTEM_ENABLED', e.target.checked);
showDanmaku(`成就系统已${e.target.checked ? '启用' : '禁用'}`, 'world');
};
}

    async function showAchievementDetail(achievement) {
const achievements = await getArchiveAchievements();
const isCompleted = achievements.completed.includes(achievement.id);

document.getElementById('achievement-detail-name').textContent = achievement.name;
const qualityEl = document.getElementById('achievement-detail-quality');
qualityEl.textContent = achievement.quality;
qualityEl.className = `achievement-detail-value achievement-quality-${achievement.quality}`;

// 【修改】根据完成状态显示不同内容
const descEl = document.getElementById('achievement-detail-desc');
const reqContainer = document.getElementById('achievement-detail-requirements-container');
const rewardContainer = document.getElementById('achievement-detail-reward-container');

if (isCompleted) {
descEl.textContent = achievement.description; 
descEl.classList.remove('hidden'); 

let reqText = '';
switch (achievement.requirement.type) {
case 'player_attr':
reqText = `玩家属性 [${achievement.requirement.key}] >= ${achievement.requirement.value}`;
break;
case 'ai_response':
reqText = `AI回复包含关键词 "${achievement.requirement.keyword}"`;
break;
case 'variable':
reqText = `世界变量 [${achievement.requirement.table}:${achievement.requirement.id}:${achievement.requirement.col}] 包含 "${achievement.requirement.value}"`;
break;
case 'system_event':
reqText = `触发系统事件: ${achievement.requirement.event}`;
break;
case 'player_exploration':
reqText = `探索 ${achievement.requirement.count} 个主疆域`;
break;
case 'player_exploration_all_main_regions':
reqText = `探索所有主疆域`;
break;
case 'npc_favorability':
reqText = `与${achievement.requirement.gender}NPC好感度达到 ${achievement.requirement.value}`;
break;
case 'player_has_beast':
reqText = `拥有 ${achievement.requirement.count} 只灵兽`;
break;
case 'player_has_skill_count':
reqText = `学会 ${achievement.requirement.count} 个技能`;
break;
case 'player_has_trait_rarity':
reqText = `拥有 ${achievement.requirement.rarity} 品质词条`;
break;
case 'player_death_count':
reqText = `累计死亡 ${achievement.requirement.count} 次`;
break;
case 'player_attr_extreme':
reqText = `极限模式下，玩家属性 [${achievement.requirement.key}] ${achievement.requirement.key === '善恶值' ? '<=' : '>='} ${achievement.requirement.value}`;
break;
case 'system_event_extreme':
reqText = `极限模式下，触发系统事件: ${achievement.requirement.event}`;
break;
default:
reqText = achievement.requirement.description || '未知条件';
}
document.getElementById('achievement-detail-requirements').textContent = reqText;
reqContainer.classList.remove('hidden');

document.getElementById('achievement-detail-reward').textContent = achievement.reward?.description || '无';
rewardContainer.classList.remove('hidden');
} else {
// 【修改】未完成时只显示名字、品质和完成文本
descEl.textContent = achievement.completionText || '尚未完成，条件未知。'; // 未完成时显示 completionText
descEl.classList.remove('hidden');
reqContainer.classList.add('hidden');
rewardContainer.classList.add('hidden');
}

achievementDetailOverlay.classList.add('visible');
}

    async function openCustomAchievementManager() {
        const listEl = document.getElementById('custom-achievement-list');
        listEl.innerHTML = '';
        const achievements = await getArchiveAchievements();
        const customAchievements = achievements.custom || [];

        if (customAchievements.length === 0) {
            listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">尚未创建任何自定义成就。</p>';
        } else {
            customAchievements.forEach(ach => {
                const item = document.createElement('div');
                item.className = 'custom-achievement-item';
                item.innerHTML = `
                    <span class="custom-achievement-item-name achievement-quality-${ach.quality}">${ach.name}</span>
                    <div class="custom-achievement-item-actions">
                        <button class="major-action-button" data-id="${ach.id}" data-action="edit"><i class="fas fa-edit"></i></button>
                        <button class="major-action-button" data-id="${ach.id}" data-action="delete" style="border-color:#e57373; color:#e57373;"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                listEl.appendChild(item);
            });
        }

        listEl.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = e.currentTarget.dataset.id;
                const action = e.currentTarget.dataset.action;
                if (action === 'edit') {
                    openCustomAchievementEditor(id);
                } else if (action === 'delete') {
                    if (await showCustomConfirm('确定要删除这个自定义成就吗？')) {
                        const archive = await db.archives.get(currentArchiveName);
                        archive.data.state.achievements.custom = archive.data.state.achievements.custom.filter(a => a.id !== id);
                        archive.data.state.achievements.completed = archive.data.state.achievements.completed.filter(aId => aId !== id);
                        await db.archives.put(archive);
                        await openCustomAchievementManager();
                    }
                }
            });
        });

        customAchievementManagerOverlay.classList.add('visible');
    }

    async function openCustomAchievementEditor(id = null) {
currentEditingAchievementId = id;
const isEditing = id !== null;
const achievements = await getArchiveAchievements();
const achievement = isEditing ? achievements.custom.find(a => a.id === id) : {};

document.getElementById('custom-achievement-editor-title').textContent = isEditing ? '编辑成就' : '创建新成就';
document.getElementById('ca-editor-name').value = achievement.name || '';
document.getElementById('ca-editor-desc').value = achievement.description || '';
document.getElementById('ca-editor-completion-text').value = achievement.completionText || '';

const qualitySelect = document.getElementById('ca-editor-quality');
qualitySelect.innerHTML = Object.keys(CREATION_CONFIG.TRAIT_RARITIES).filter(r => r !== '负面状态').map(r => `<option value="${r}">${r}</option>`).join('');
qualitySelect.value = achievement.quality || '平庸';

const reqTypeSelect = document.getElementById('ca-editor-req-type');
reqTypeSelect.value = achievement.requirement?.type || 'player_attr';

const rewardTypeSelect = document.getElementById('ca-editor-reward-type');
rewardTypeSelect.value = achievement.reward?.type || 'none';

renderAchievementReqDetails(achievement.requirement);
renderAchievementRewardDetails(achievement.reward);
customAchievementEditorOverlay.classList.add('visible');
}

    function renderAchievementReqDetails(requirement = {}) {
const type = document.getElementById('ca-editor-req-type').value;
const container = document.getElementById('ca-editor-req-details');
container.innerHTML = '';

const createInput = (type, placeholder, value = '', min = null) => {
const input = document.createElement('input');
input.type = type;
input.placeholder = placeholder;
input.value = value;
if (min !== null) input.min = min;
return input;
};

const createSelect = (options, selectedValue = '') => {
const select = document.createElement('select');
options.forEach(opt => {
const option = document.createElement('option');
option.value = opt.value;
option.textContent = opt.text;
select.appendChild(option);
});
select.value = selectedValue;
return select;
};

switch(type) {
case 'player_attr':
container.append(
createSelect(
Object.keys(CREATION_CONFIG.ATTRIBUTES).map(attr => ({ value: attr, text: attr })).concat([
{ value: '灵石', text: '灵石' },
{ value: '境界', text: '境界' },
{ value: '寿元', text: '寿元' },
{ value: '善恶值', text: '善恶值' }
]),
requirement.key
),
createInput('number', '目标值', requirement.value)
);
break;
case 'ai_response':
container.appendChild(createInput('text', 'AI回复中包含的关键词', requirement.keyword));
break;
case 'variable':
container.append(
createSelect([
{ value: '0', text: '人物(0)' },
{ value: '1', text: '物品(1)' },
{ value: '6', text: '任务(6)' },
{ value: '7', text: '灵兽(7)' },
{ value: '8', text: '技能(8)' }
], requirement.table),
createInput('text', '行ID (e.g., B1)', requirement.id),
createInput('number', '列号', requirement.col, 0),
createInput('text', '包含的值', requirement.value)
);
break;
case 'system_event':
container.appendChild(createInput('text', '系统事件名称 (e.g., archive_created)', requirement.event));
break;
case 'player_exploration':
container.appendChild(createInput('number', '探索主疆域数量', requirement.count, 1));
break;
case 'player_exploration_all_main_regions':
container.innerHTML = '<p style="color:var(--text-secondary);">无需额外参数，系统将自动检测。</p>';
break;
case 'npc_favorability':
container.append(
createSelect([
{ value: '异性', text: '异性' },
{ value: '男', text: '男性' },
{ value: '女', text: '女性' }
], requirement.gender),
createInput('number', '好感度达到', requirement.value, 0)
);
break;
case 'player_has_beast':
container.appendChild(createInput('number', '拥有灵兽数量', requirement.count, 1));
break;
case 'player_has_skill_count':
container.appendChild(createInput('number', '学会技能数量', requirement.count, 1));
break;
case 'player_has_trait_rarity':
container.appendChild(createSelect(
Object.keys(CREATION_CONFIG.TRAIT_RARITIES).filter(r => r !== '负面状态').map(r => ({ value: r, text: r })),
requirement.rarity
));
break;
case 'player_death_count':
container.appendChild(createInput('number', '累计死亡次数', requirement.count, 1));
break;
case 'player_attr_extreme':
container.append(
createSelect(
Object.keys(CREATION_CONFIG.ATTRIBUTES).map(attr => ({ value: attr, text: attr })).concat([
{ value: '善恶值', text: '善恶值' }
]),
requirement.key
),
createInput('number', '目标值', requirement.value)
);
break;
case 'system_event_extreme':
container.appendChild(createInput('text', '极限模式下系统事件名称', requirement.event));
break;
default:
container.innerHTML = '<p style="color:var(--text-secondary);">请选择条件类型。</p>';
break;
}
}

    function renderAchievementRewardDetails(reward = {}) {
const type = document.getElementById('ca-editor-reward-type').value;
const container = document.getElementById('ca-editor-reward-details');
container.innerHTML = '';

if (type === 'none') return;

const createInput = (inputType, placeholder, value = '', min = null) => {
const input = document.createElement('input');
input.type = inputType;
input.placeholder = placeholder;
input.value = value;
if (min !== null) input.min = min;
input.className = 'modal-beautified-input'; // 添加样式类，保持一致性
return input;
};

const createTextArea = (placeholder, value = '', rows = 2) => {
const textarea = document.createElement('textarea');
textarea.placeholder = placeholder;
textarea.value = value;
textarea.rows = rows;
textarea.className = 'modal-beautified-textarea'; // 添加样式类
return textarea;
};

const createSelect = (options, selectedValue = '') => {
const select = document.createElement('select');
options.forEach(opt => {
const option = document.createElement('option');
option.value = opt.value;
option.textContent = opt.text;
select.appendChild(option);
});
select.value = selectedValue;
select.className = 'modal-beautified-select'; // 添加样式类
return select;
};

const createIdInput = (prefix, currentId = '') => {
const input = document.createElement('input');
input.type = 'text';
input.placeholder = `ID (例如: ${prefix}100)`;
input.value = currentId;
input.className = 'modal-beautified-input'; // 添加样式类
return input;
};

switch(type) {
case 'item':
container.append(
createIdInput('I', reward.id),
createInput('text', '名称', reward.name),
createTextArea('描述', reward.desc),
createSelect([
{ value: '武器', text: '武器' }, { value: '护甲', text: '护甲' },
{ value: '功法', text: '功法' }, { value: '法宝', text: '法宝' },
{ value: '消耗品', text: '消耗品' }, { value: '重要物品', text: '重要物品' },
{ value: '材料', text: '材料' }, { value: '其他物品', text: '其他物品' }
], reward.itemType),
createTextArea('效果 (品质:属性+值, 多个用逗号)', reward.effect),
createInput('number', '数量', reward.quantity || 1, 1)
);
break;
case 'character':
container.append(
createIdInput('C', reward.id),
createInput('text', '名称|性别 (例如: 韩立|男)', reward.nameGender),
createInput('text', '境界|身份 (例如: 炼气期|散修)', reward.realmIdentity),
createTextArea('背景/简介', reward.background),
createInput('number', '好感度', reward.favorability || 0)
);
break;
case 'skill':
container.append(
createIdInput('S', reward.id),
createInput('text', '名称', reward.name),
createInput('text', '等级', reward.level),
createInput('text', '属性', reward.attribute),
createTextArea('描述', reward.description),
createTextArea('效果', reward.effect),
createInput('text', '来历', reward.origin),
createInput('text', '熟练度 (例如: 0/100)', reward.proficiency),
createInput('text', '消耗', reward.cost)
);
break;
case 'beast':
container.append(
createIdInput('P', reward.id),
createInput('text', '名称', reward.name),
createInput('text', '等级', reward.level),
createTextArea('外貌', reward.appearance),
createInput('text', '性格', reward.personality),
createTextArea('技能', reward.skills),
createTextArea('内心想法', reward.motive)
);
break;
case 'task':
container.append(
createIdInput('T', reward.id),
createInput('text', '标题', reward.title),
createTextArea('描述', reward.desc),
createTextArea('奖励', reward.reward),
createTextArea('惩罚', reward.punishment),
createSelect([
{ value: '凡人', text: '凡人' }, { value: '炼气', text: '炼气' },
{ value: '筑基', text: '筑基' }, { value: '结丹', text: '结丹' },
{ value: '元婴', text: '元婴' }, { value: '化神', text: '化神' }
], reward.difficulty)
);
break;
case 'world_event':
container.append(
createInput('text', '时间 (例如: 0001年 01月 01日)', reward.time),
createInput('text', '地点 (例如: 天南/越国)', reward.location),
createTextArea('事件描述', reward.desc)
);
break;
case 'trait':
container.append(
createInput('text', '气运名称', reward.name),
createTextArea('描述', reward.desc),
createTextArea('效果', reward.effects),
createSelect(
Object.keys(CREATION_CONFIG.TRAIT_RARITIES).map(r => ({ value: r, text: r })),
reward.rarity || '普通'
)
);
break;
}
}

    async function saveCustomAchievement() {
const name = document.getElementById('ca-editor-name').value.trim();
if (!name) { await showCustomAlert('成就名称不能为空！'); return; }

const reqType = document.getElementById('ca-editor-req-type').value;
const reqDetails = document.getElementById('ca-editor-req-details').children;
let requirement = { type: reqType };
switch(reqType) {
case 'player_attr':
requirement.key = reqDetails[0].value;
requirement.value = reqDetails[1].value;
break;
case 'ai_response':
requirement.keyword = reqDetails[0].value;
break;
case 'variable':
requirement.table = reqDetails[0].value;
requirement.id = reqDetails[1].value;
requirement.col = reqDetails[2].value;
requirement.value = reqDetails[3].value;
break;
case 'system_event':
requirement.event = reqDetails[0].value;
break;
case 'player_exploration':
requirement.count = reqDetails[0].value;
break;
case 'player_exploration_all_main_regions':
// No additional parameters needed
break;
case 'npc_favorability':
requirement.gender = reqDetails[0].value;
requirement.value = reqDetails[1].value;
break;
case 'player_has_beast':
requirement.count = reqDetails[0].value;
break;
case 'player_has_skill_count':
requirement.count = reqDetails[0].value;
break;
case 'player_has_trait_rarity':
requirement.rarity = reqDetails[0].value;
break;
case 'player_death_count':
requirement.count = reqDetails[0].value;
break;
case 'player_attr_extreme':
requirement.key = reqDetails[0].value;
requirement.value = reqDetails[1].value;
break;
case 'system_event_extreme':
requirement.event = reqDetails[0].value;
break;
}

const rewardType = document.getElementById('ca-editor-reward-type').value;
const rewardDetails = document.getElementById('ca-editor-reward-details').children;
let reward = { type: rewardType };
let rewardCommand = '';

const validateAndFixId = (id, prefix) => {
if (!id) return '';
const numericPart = id.replace(/\D/g, '');
return `${prefix}${numericPart}`;
};

if (rewardType !== 'none') {
try {
switch(rewardType) {
case 'item':
reward = {
...reward,
id: validateAndFixId(rewardDetails[0].value, 'I'),
name: rewardDetails[1].value,
desc: rewardDetails[2].value,
itemType: rewardDetails[3].value,
effect: rewardDetails[4].value,
quantity: rewardDetails[5].value
};
rewardCommand = `set({"0":"${reward.id}", "1":"${reward.name}", "2":"${reward.itemType}", "3":"${reward.desc}", "4":"${reward.effect}", "5":"${reward.quantity}"})`;
break;
case 'character':
reward = {
...reward,
id: validateAndFixId(rewardDetails[0].value, 'C'),
nameGender: rewardDetails[1].value,
realmIdentity: rewardDetails[2].value,
background: rewardDetails[3].value,
favorability: rewardDetails[4].value
};
rewardCommand = `set({"0":"${reward.id}", "1":"${reward.nameGender}", "2":"${reward.realmIdentity}", "10":"${reward.background}", "15":"${reward.favorability}"})`;
break;
case 'skill':
reward = {
...reward,
id: validateAndFixId(rewardDetails[0].value, 'S'),
name: rewardDetails[1].value,
level: rewardDetails[2].value,
attribute: rewardDetails[3].value,
description: rewardDetails[4].value,
effect: rewardDetails[5].value,
origin: rewardDetails[6].value,
proficiency: rewardDetails[7].value,
cost: rewardDetails[8].value
};
rewardCommand = `set({"0":"${reward.id}", "1":"${reward.name}", "2":"${reward.level}", "3":"${reward.attribute}", "4":"${reward.description}", "5":"${reward.effect}", "6":"${reward.origin}", "7":"${reward.proficiency}", "8":"${reward.cost}"})`;
break;
case 'beast':
reward = {
...reward,
id: validateAndFixId(rewardDetails[0].value, 'P'),
name: rewardDetails[1].value,
level: rewardDetails[2].value,
appearance: rewardDetails[3].value,
personality: rewardDetails[4].value,
skills: rewardDetails[5].value,
motive: rewardDetails[6].value
};
rewardCommand = `set({"0":"${reward.id}", "1":"${reward.name}", "2":"${reward.level}", "3":"${reward.appearance}", "4":"${reward.personality}", "5":"${reward.skills}", "6":"${reward.motive}"})`;
break;
case 'task':
reward = {
...reward,
id: validateAndFixId(rewardDetails[0].value, 'T'),
title: rewardDetails[1].value,
desc: rewardDetails[2].value,
reward: rewardDetails[3].value,
punishment: rewardDetails[4].value,
difficulty: rewardDetails[5].value
};
rewardCommand = `set({"0":"${reward.id}", "1":"${reward.title}", "2":"${reward.desc}", "3":"${reward.reward}", "4":"${reward.punishment}", "5":"${reward.difficulty}"})`;
break;
case 'world_event':
reward = { ...reward, time: rewardDetails[0].value, location: rewardDetails[1].value, desc: rewardDetails[2].value };
rewardCommand = `addWorldEvent("${reward.time}", "${reward.location}", "${reward.desc}")`;
break;
case 'trait':
reward = {
...reward,
name: rewardDetails[0].value,
desc: rewardDetails[1].value,
effects: rewardDetails[2].value,
rarity: rewardDetails[3].value
};
rewardCommand = `add("B1", {"9": {"traits": [{"name":"${reward.name}","desc":"${reward.desc}","effects":"${reward.effects}","rarity":"${reward.rarity}"}]}})`;
break;
}
} catch(e) {
await showCustomAlert('奖励信息格式错误，请检查。');
return;
}
}

const achievementData = {
id: currentEditingAchievementId || crypto.randomUUID(),
name: name,
description: document.getElementById('ca-editor-desc').value.trim(),
completionText: document.getElementById('ca-editor-completion-text').value.trim(),
quality: document.getElementById('ca-editor-quality').value,
requirement: requirement,
reward: rewardType !== 'none' ? { ...reward, command: rewardCommand } : null
};

const archive = await db.archives.get(currentArchiveName);
const customAchievements = archive.data.state.achievements.custom || [];
if (currentEditingAchievementId) {
const index = customAchievements.findIndex(a => a.id === currentEditingAchievementId);
customAchievements[index] = achievementData;
} else {
customAchievements.push(achievementData);
}
archive.data.state.achievements.custom = customAchievements;
await db.archives.put(archive);

customAchievementEditorOverlay.classList.remove('visible');
await openCustomAchievementManager();
}

function showAchievementToast(achievement) {
const toastContainer = document.getElementById('achievement-toast-container');
if (!toastContainer) {
console.error("成就弹窗容器未找到！");
return;
}


const toastModal = document.createElement('div');
toastModal.className = `achievement-toast-modal quality-${achievement.quality}`; // 使用类名
toastModal.innerHTML = `
<button class="toast-close-btn">&times;</button>
<h3>成就达成！</h3>
<span class="toast-quality">${achievement.quality}</span>
<p class="toast-achievement-name">${achievement.name}</p>
<p class="toast-achievement-desc">${achievement.description}</p>
<p class="toast-completion-text">${achievement.completionText}</p>
<p class="toast-reward">奖励: ${achievement.reward?.description || '无'}</p>
`;

toastContainer.prepend(toastModal); // 将新弹窗添加到容器顶部

const closeBtn = toastModal.querySelector('.toast-close-btn');
const closeToast = () => {
toastModal.style.animation = 'achievement-toast-out 0.3s forwards'; // 添加关闭动画
toastModal.addEventListener('animationend', () => {
toastModal.remove();
}, { once: true });
};
closeBtn.addEventListener('click', closeToast);


}

    async function checkAchievements(aiResponse, systemEvent = null) { // 【修改】新增 systemEvent 参数
const archive = await db.archives.get(currentArchiveName);
if (!archive || !archive.data.state.achievements) return;


const achievementSystemEnabled = (await dbGet('ACHIEVEMENT_SYSTEM_ENABLED')) !== false;
if (!achievementSystemEnabled) {
return; // 如果禁用，则不检查成就
}

const { completed, custom } = archive.data.state.achievements;

const allAchievements = [...BUILT_IN_ACHIEVEMENTS, ...(custom || [])];
const uncompleted = allAchievements.filter(ach => !completed.includes(ach.id));

let changed = false;
for (const ach of uncompleted) {
let isCompleted = false;
const req = ach.requirement;

switch (req.type) {
case 'player_attr':
// 确保 player_attr 的 key 是有效的，并且值可以转换为数字进行比较
if (currentPlayerData.detailedAttributes[req.key]) {
const attrValue = currentPlayerData.detailedAttributes[req.key].current;
if (attrValue >= parseInt(req.value)) isCompleted = true;
} else if (req.key === '灵石') { // 假设灵石是玩家备注里的一个字段
const remarks = parseRemarksString(currentState['0']['B1']['9']);
const spiritStones = parseInt(remarks['灵石'] || '0');
if (spiritStones >= parseInt(req.value)) isCompleted = true;
} else if (req.key === '境界') { // 境界是字符串比较
const playerRealm = (currentState['0']['B1']['2'] || '').split('|')[0].trim();
// 简单的字符串包含判断，可能需要更复杂的境界等级比较
if (playerRealm.includes(req.value)) isCompleted = true;
} else if (req.key === '寿元') {
const remarks = parseRemarksString(currentState['0']['B1']['9']);
const shouyuan = parseInt(remarks['寿元'] || '0');
if (shouyuan >= parseInt(req.value)) isCompleted = true;
} else if (req.key === '善恶值') {
const remarks = parseRemarksString(currentState['0']['B1']['9']);
const shanE = parseInt(remarks['善恶值'] || '0');
const targetValue = parseInt(req.value);
// 【修改】根据目标值的正负来判断比较操作符
if (targetValue >= 0) { // 如果目标值是正数或0，则需要大于等于
if (shanE >= targetValue) isCompleted = true;
} else { // 如果目标值是负数，则需要小于等于
if (shanE <= targetValue) isCompleted = true;
}
}
break;
case 'ai_response':
if (aiResponse.includes(req.keyword)) isCompleted = true;
break;
case 'variable':
try {
const value = currentState[req.table]?.[req.id]?.[req.col];
if (typeof value === 'string' && value.includes(req.value)) isCompleted = true;
} catch (e) { /* Ignore errors from invalid paths */ }
break;
case 'system_event': 
if (systemEvent && req.event === systemEvent) isCompleted = true;
break;
case 'player_exploration': 
if (req.count) {
const exploredRegions = new Set();
const logs = archive.data.logs || [];
logs.forEach(log => {
if (log.stateSnapshot) {
const snapshotState = JSON.parse(log.stateSnapshot);
const playerLocString = snapshotState['4']?.[0]?.['0'] || '';
const mainRegionMatch = playerLocString.match(/\/(.*?)(?:\/|$)/);
if (mainRegionMatch && mainRegionMatch[1]) {
exploredRegions.add(mainRegionMatch[1]);
}
}
});
if (exploredRegions.size >= parseInt(req.count)) isCompleted = true;
}
break;
case 'player_exploration_all_main_regions':
const allMainRegions = new Set(WORLD_MAP_DATA.main_regions.map(r => r.name));
const exploredRegions = new Set();
const logs = archive.data.logs || [];
logs.forEach(log => {
if (log.stateSnapshot) {
const snapshotState = JSON.parse(log.stateSnapshot);
const playerLocString = snapshotState['4']?.[0]?.['0'] || '';
const mainRegionMatch = playerLocString.match(/\/(.*?)(?:\/|$)/);
if (mainRegionMatch && mainRegionMatch[1]) {
exploredRegions.add(mainRegionMatch[1]);
}
}
});
if (allMainRegions.size > 0 && Array.from(allMainRegions).every(region => exploredRegions.has(region))) isCompleted = true;
break;
case 'npc_favorability': 
if (req.gender && req.value) {
const targetGender = req.gender === "异性" ? (currentPlayerData.gender === "男" ? "女" : "男") : req.gender;
const hasHighFavorNpc = Object.values(characterDatabase).some(char =>
char.gender === targetGender && parseInt(char.favorability) >= parseInt(req.value)
);
if (hasHighFavorNpc) isCompleted = true;
}
break;
case 'player_has_beast':
if (req.count) {
const beastCount = Object.keys(currentState['7'] || {}).length;
if (beastCount >= parseInt(req.count)) isCompleted = true;
}
break;
case 'player_has_skill_count': 
if (req.count) {
const skillCount = Object.keys(currentState['8'] || {}).length;
if (skillCount >= parseInt(req.count)) isCompleted = true;
}
break;
case 'player_has_trait_rarity': 
if (req.rarity) {
const hasTrait = currentPlayerData.playerTraits.some(trait => trait.rarity === req.rarity);
if (hasTrait) isCompleted = true;
}
break;
case 'player_death_count': 
if (req.count) {
const deathCount = currentPlayerData.deathCount || 0;
if (deathCount >= parseInt(req.count)) isCompleted = true;
}
break;
case 'player_attr_extreme': // 【新增】极限模式下属性
if (currentPlayerData.isExtreme && currentPlayerData.detailedAttributes[req.key]) {
const attrValue = currentPlayerData.detailedAttributes[req.key].current;
if (attrValue >= parseInt(req.value)) isCompleted = true;
} else if (currentPlayerData.isExtreme && req.key === '善恶值') {
const remarks = parseRemarksString(currentState['0']['B1']['9']);
const shanE = parseInt(remarks['善恶值'] || '0');
const targetValue = parseInt(req.value);
// 【修改】与 player_attr 中的善恶值逻辑保持一致
if (targetValue >= 0) { // 如果目标值是正数或0，则需要大于等于
if (shanE >= targetValue) isCompleted = true;
} else { // 如果目标值是负数，则需要小于等于
if (shanE <= targetValue) isCompleted = true;
}
}
break;
}

if (isCompleted) {
completed.push(ach.id);
changed = true;

showAchievementToast(ach);

if (ach.reward && ach.reward.command) {
let finalRewardCommand = ach.reward.command;
const idMatch = ach.reward.command.match(/(set|add)\({"0":"([A-Z])(\d+)"/);
if (idMatch && idMatch[2] && idMatch[3]) {
const prefix = idMatch[2];
const numericPart = idMatch[3];
const validatedId = `${prefix}${numericPart}`;
finalRewardCommand = ach.reward.command.replace(idMatch[0], `${idMatch[1]}({"0":"${validatedId}"`);
} else if (ach.reward.type === 'trait' && ach.reward.command.includes('"traits":[')) {

} else {
console.warn(`成就奖励命令 ID 格式不符合要求或无法解析: ${ach.reward.command}`);
}

const { delta } = parseTableEditCommands(finalRewardCommand);
achievementRewardDeltas.push(...delta);
}
}
}

if (changed) {
archive.data.state.achievements.completed = completed;
await db.archives.put(archive);
}
}

    async function openDinoGame() {
        if (activeDinoGame) {
            activeDinoGame.stop();
        }
        dinoGameOverlay.classList.add('visible');
        const highScore = await dbGet(DINO_GAME_HIGHSCORE_KEY) || 0;
        activeDinoGame = new DinoGame(document.getElementById('dino-game-canvas'), highScore);
    }

    class DinoGame {
        constructor(canvas, initialHighScore) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.highScore = initialHighScore;
            this.scoreDisplay = document.getElementById('dino-score-display');
            this.highScoreDisplay = document.getElementById('dino-highscore-display');
            this.startScreen = document.getElementById('dino-start-screen');
            this.startBtn = document.getElementById('dino-start-btn');
            
            this.resize();
            this.reset();
            this.drawInitialScreen();
            
            this.startHandler = () => {
                this.startScreen.classList.add('hidden');
                this.start();
            };
            this.startBtn.addEventListener('click', this.startHandler);
        }

        resize() {
            this.width = this.canvas.width = this.canvas.parentElement.clientWidth;
            this.height = this.canvas.height = this.canvas.parentElement.clientHeight;
        }

        reset() {
            this.player = { x: 50, y: this.height - 30, radius: 15, dy: 0, grounded: true };
            this.obstacles = [];
            this.bullets = [];
            this.monsters = [];
            this.boss = null;
            this.score = 0;
            this.gameOver = false;
            this.gameSpeed = 5;
            this.frameCount = 0;
            this.bulletCooldown = 0;
            this.bossSpawned = false;
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
        }

        bindEvents() {
            this.jumpHandler = (e) => { e.preventDefault(); this.jump(); };
            this.keyJumpHandler = (e) => { if (e.code === 'Space') this.jumpHandler(e); };
            
            document.addEventListener('keydown', this.keyJumpHandler);
            this.canvas.parentElement.addEventListener('mousedown', this.jumpHandler);
            this.canvas.parentElement.addEventListener('touchstart', this.jumpHandler, { passive: false });
        }

        unbindEvents() {
            document.removeEventListener('keydown', this.keyJumpHandler);
            this.canvas.parentElement.removeEventListener('mousedown', this.jumpHandler);
            this.canvas.parentElement.removeEventListener('touchstart', this.jumpHandler);
            this.startBtn.removeEventListener('click', this.startHandler);
        }

        jump() {
            if (this.player.grounded && !this.gameOver) {
                this.player.dy = -12;
                this.player.grounded = false;
            }
        }

        start() {
            this.reset();
            this.bindEvents();
            this.scoreDisplay.classList.remove('hidden');
            this.loop();
        }

        stop() {
            this.unbindEvents();
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        drawInitialScreen() {
            this.highScoreDisplay.textContent = `HI ${String(this.highScore).padStart(5, '0')}`;
            this.startScreen.classList.remove('hidden');
            this.scoreDisplay.classList.add('hidden');
        }

        update() {
            if (this.gameOver) return;
            
            // Player physics
            this.player.y += this.player.dy;
            this.player.dy += 0.8; // Gravity
            if (this.player.y > this.height - this.player.radius - 10) {
                this.player.y = this.height - this.player.radius - 10;
                this.player.dy = 0;
                this.player.grounded = true;
            }

            // Player Bullets
            if (this.bulletCooldown > 0) this.bulletCooldown--;
            if (this.bulletCooldown === 0) {
                this.bullets.push({ x: this.player.x + this.player.radius, y: this.player.y, width: 10, height: 4, type: 'player' });
                this.bulletCooldown = 20; // Fire rate
            }
            this.bullets.forEach(b => {
                if(b.type === 'player') b.x += 8;
                else if (b.type === 'boss') b.x -= 6;
            });
            this.bullets = this.bullets.filter(b => b.x < this.width && b.x > 0);

            // Obstacles & Monsters
            this.frameCount++;
            const scoreValue = Math.floor(this.score / 10);
            if (scoreValue >= 5000 && !this.bossSpawned) {
                this.bossSpawned = true;
                this.boss = { x: this.width, y: this.height / 2, width: 80, height: 80, hp: 50, bulletCooldown: 120 };
            }

            if (!this.boss) {
                if (this.frameCount % Math.floor(100 / (this.gameSpeed / 5)) === 0) {
                    const rand = Math.random();
                    if (rand < 0.6) { // Ground Obstacle
                        const width = 15 + Math.random() * 20;
                        const height = 20 + Math.random() * 30;
                        this.obstacles.push({ type: 'rect', x: this.width, y: this.height - 10 - height, width: width, height: height });
                    } else if (rand < 0.85) { // Flying Enemy
                        this.monsters.push({ type: 'flying', x: this.width, y: this.height - 70 - Math.random() * 50, width: 25, height: 15, hp: 2 });
                    } else { // Ground Enemy
                        this.monsters.push({ type: 'ground', x: this.width, y: this.height - 30, width: 20, height: 20, hp: 3 });
                    }
                }
            }

            this.obstacles.forEach(obs => obs.x -= this.gameSpeed);
            this.monsters.forEach(mon => mon.x -= this.gameSpeed * 0.8);
            this.obstacles = this.obstacles.filter(obs => obs.x + obs.width > 0);
            this.monsters = this.monsters.filter(mon => mon.x + mon.width > 0);
            
            if (this.boss) {
                this.boss.x = Math.max(this.width - 150, this.boss.x - 1);
                this.boss.bulletCooldown--;
                if (this.boss.bulletCooldown <= 0) {
                    this.bullets.push({ x: this.boss.x, y: this.boss.y + this.boss.height / 2, width: 15, height: 8, type: 'boss' });
                    this.boss.bulletCooldown = 60 + Math.random() * 60;
                }
            }

            // Collision
            const checkCollision = (rect1, rect2) => (
                rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.y + rect1.height > rect2.y
            );
            const checkCircleRectCollision = (circle, rect) => {
                const testX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
                const testY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
                const distX = circle.x - testX;
                const distY = circle.y - testY;
                return (distX * distX + distY * distY) <= (circle.radius * circle.radius);
            };

            this.obstacles.forEach(obs => { if (checkCircleRectCollision(this.player, obs)) this.endGame(); });
            this.monsters.forEach(mon => { if (checkCircleRectCollision(this.player, mon)) this.endGame(); });
            if (this.boss && checkCircleRectCollision(this.player, this.boss)) this.endGame();
            
            this.bullets.forEach(b => {
                if (b.type === 'boss' && checkCircleRectCollision(this.player, b)) this.endGame();
            });

            for (let i = this.bullets.length - 1; i >= 0; i--) {
                if (this.bullets[i].type !== 'player') continue;
                
                for (let j = this.obstacles.length - 1; j >= 0; j--) {
                    if (checkCollision(this.bullets[i], this.obstacles[j])) {
                        this.bullets.splice(i, 1);
                        break;
                    }
                }
                if (!this.bullets[i]) continue;
                for (let k = this.monsters.length - 1; k >= 0; k--) {
                    if (checkCollision(this.bullets[i], this.monsters[k])) {
                        this.bullets.splice(i, 1);
                        this.monsters[k].hp--;
                        if (this.monsters[k].hp <= 0) {
                            this.monsters.splice(k, 1);
                            this.score += 50;
                        }
                        break;
                    }
                }
                if (!this.bullets[i]) continue;
                if (this.boss && checkCollision(this.bullets[i], this.boss)) {
                    this.bullets.splice(i, 1);
                    this.boss.hp--;
                    if (this.boss.hp <= 0) {
                        this.boss = null;
                        this.bossSpawned = false; // Allow another boss later
                        this.score += 5000;
                    }
                    break;
                }
            }

            // Score
            this.score++;
            this.gameSpeed += 0.001;
            this.scoreDisplay.textContent = String(Math.floor(this.score / 10)).padStart(5, '0');
        }

        draw() {
            this.ctx.clearRect(0, 0, this.width, this.height);
            
            // Ground
            this.ctx.fillStyle = '#888';
            this.ctx.fillRect(0, this.height - 10, this.width, 10);
            
            // Player
            this.ctx.fillStyle = '#4CAF50';
            this.ctx.beginPath();
            this.ctx.arc(this.player.x, this.player.y, this.player.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Bullets
            this.bullets.forEach(b => {
                this.ctx.fillStyle = b.type === 'player' ? '#87CEFA' : '#FF5722';
                this.ctx.fillRect(b.x, b.y, b.width, b.height);
            });

            // Obstacles & Monsters
            this.ctx.fillStyle = '#888';
            this.obstacles.forEach(obs => this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height));
            
            this.ctx.fillStyle = '#E53935';
            this.monsters.forEach(mon => {
                if (mon.type === 'flying') {
                    this.ctx.beginPath();
                    this.ctx.moveTo(mon.x, mon.y);
                    this.ctx.lineTo(mon.x + mon.width, mon.y);
                    this.ctx.lineTo(mon.x + mon.width / 2, mon.y + mon.height);
                    this.ctx.closePath();
                    this.ctx.fill();
                } else {
                    this.ctx.fillRect(mon.x, mon.y, mon.width, mon.height);
                }
            });

            // Boss
            if (this.boss) {
                this.ctx.fillStyle = '#673AB7';
                this.ctx.fillRect(this.boss.x, this.boss.y, this.boss.width, this.boss.height);
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '12px "Press Start 2P"';
                this.ctx.fillText(`HP: ${this.boss.hp}`, this.boss.x + 10, this.boss.y - 10);
            }
        }

        loop() {
            this.update();
            this.draw();
            if (!this.gameOver) {
                this.animationFrameId = requestAnimationFrame(() => this.loop());
            }
        }

        async endGame() {
            this.gameOver = true;
            this.stop();
            if (Math.floor(this.score / 10) > this.highScore) {
                this.highScore = Math.floor(this.score / 10);
                await dbSet(DINO_GAME_HIGHSCORE_KEY, this.highScore);
            }
            
            this.drawInitialScreen();
            
            // Re-bind the start button click handler
            this.startBtn.removeEventListener('click', this.startHandler);
            this.startBtn.addEventListener('click', this.startHandler);
        }
    }
    
    function setupCharacterCreatorListeners() {
        characterCreatorOverlay.querySelector('.modal-close-btn').addEventListener('click', () => characterCreatorOverlay.classList.remove('visible'));
        document.getElementById('creator-create-btn').addEventListener('click', () => openCreatorEditor());
        document.getElementById('creator-import-btn').addEventListener('click', () => handleImportCustomData(CHARACTER_TEMPLATES_KEY, '角色模板'));
        document.getElementById('creator-export-btn').addEventListener('click', () => handleExportCustomData(CHARACTER_TEMPLATES_KEY, 'character_templates.json'));
        document.getElementById('back-to-creator-list-btn').addEventListener('click', () => {
            document.getElementById('creator-main-view').classList.remove('hidden');
            document.getElementById('creator-editor-view').classList.add('hidden');
        });
        document.getElementById('add-favor-stage-btn').addEventListener('click', () => addFavorStage());
        document.getElementById('save-creator-char-btn').addEventListener('click', saveCharacterTemplate);
    }

    async function openCharacterCreator() {
        const templates = await dbGet(CHARACTER_TEMPLATES_KEY) || [];
        const listEl = document.getElementById('creator-list');
        listEl.innerHTML = '';

        if (templates.length === 0) {
            listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">尚未创建任何角色模板。</p>';
        } else {
            templates.forEach(template => {
                const item = document.createElement('div');
                item.className = 'creator-item';
                item.innerHTML = `
                    <span class="item-name">${template.name}</span>
                    <div class="item-actions">
                        <button data-id="${template.id}" data-action="edit"><i class="fas fa-edit"></i></button>
                        <button data-id="${template.id}" data-action="delete" style="border-color:#e57373; color:#e57373;"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                listEl.appendChild(item);
            });
        }
        
        listEl.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = e.currentTarget.dataset.id;
                const action = e.currentTarget.dataset.action;
                if (action === 'edit') {
                    openCreatorEditor(id);
                } else if (action === 'delete') {
                    if (await showCustomConfirm('确定要删除这个角色模板吗？')) {
                        let data = await dbGet(CHARACTER_TEMPLATES_KEY) || [];
                        data = data.filter(item => item.id !== id);
                        await dbSet(CHARACTER_TEMPLATES_KEY, data);
                        await openCharacterCreator();
                    }
                }
            });
        });

        document.getElementById('creator-main-view').classList.remove('hidden');
        document.getElementById('creator-editor-view').classList.add('hidden');
        characterCreatorOverlay.classList.add('visible');
    }

    async function openCreatorEditor(id = null) {
        currentEditingCharTemplateId = id;
        const isEditing = id !== null;
        const templates = await dbGet(CHARACTER_TEMPLATES_KEY) || [];
        const template = isEditing ? templates.find(t => t.id === id) : { name: '', stages: [] };

        document.getElementById('creator-char-name').value = template.name;
        const stagesContainer = document.getElementById('favor-stages-container');
        stagesContainer.innerHTML = '';
        
        if (template.stages.length === 0) {
            addFavorStage({ min: -100, max: 100, attitude: '', description: '' });
        } else {
            template.stages.forEach(stage => addFavorStage(stage));
        }

        document.getElementById('creator-main-view').classList.add('hidden');
        document.getElementById('creator-editor-view').classList.remove('hidden');
    }

    function addFavorStage(stage = { min: 0, max: 0, attitude: '', description: '' }) {
        const container = document.getElementById('favor-stages-container');
        const stageEl = document.createElement('div');
        stageEl.className = 'favor-stage';
        stageEl.innerHTML = `
            <div class="favor-stage-header">
                <div class="range-inputs">
                    <input type="number" class="favor-min" value="${stage.min}" placeholder="Min">
                    <span>至</span>
                    <input type="number" class="favor-max" value="${stage.max}" placeholder="Max">
                </div>
                <button class="major-action-button remove-stage-btn" style="width:auto; padding: 5px 10px;"><i class="fas fa-times"></i></button>
            </div>
            <textarea class="favor-attitude" placeholder="角色对玩家的态度..." rows="2">${stage.attitude}</textarea>
            <textarea class="favor-description" placeholder="角色描述..." rows="3">${stage.description}</textarea>
        `;
        stageEl.querySelector('.remove-stage-btn').addEventListener('click', () => stageEl.remove());
        container.appendChild(stageEl);
    }

    async function saveCharacterTemplate() {
        const name = document.getElementById('creator-char-name').value.trim();
        if (!name) {
            await showCustomAlert('角色名不能为空！');
            return;
        }
        
        const stages = [];
        document.querySelectorAll('.favor-stage').forEach(el => {
            stages.push({
                min: parseInt(el.querySelector('.favor-min').value),
                max: parseInt(el.querySelector('.favor-max').value),
                attitude: el.querySelector('.favor-attitude').value,
                description: el.querySelector('.favor-description').value
            });
        });

        const template = {
            id: currentEditingCharTemplateId || crypto.randomUUID(),
            name: name,
            stages: stages
        };

        let templates = await dbGet(CHARACTER_TEMPLATES_KEY) || [];
        if (currentEditingCharTemplateId) {
            const index = templates.findIndex(t => t.id === currentEditingCharTemplateId);
            templates[index] = template;
        } else {
            templates.push(template);
        }
        await dbSet(CHARACTER_TEMPLATES_KEY, templates);
        
        await showCustomAlert('角色模板已保存！');
        document.getElementById('creator-main-view').classList.remove('hidden');
        document.getElementById('creator-editor-view').classList.add('hidden');
        await openCharacterCreator();
    }

function updateBranchingOptions(options) {
    const modalContent = branchingOptionsOverlay.querySelector('.modal-content');
    modalContent.innerHTML = '';
    branchToggleBtn.classList.remove('hidden');
    if (options && options.length > 0) {
        options.forEach(optionText => {
            const btn = document.createElement('button');
            btn.className = 'branch-option-btn';
            btn.textContent = optionText;
            btn.onclick = async () => {
                branchingOptionsOverlay.classList.remove('visible');
                await sendMessage(optionText);
            };
            let longPressTimer;
            btn.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                messageInput.value = optionText;
                branchingOptionsOverlay.classList.remove('visible');
            });
            btn.addEventListener('touchstart', (e) => {
                longPressTimer = setTimeout(() => {
                    e.preventDefault();
                    messageInput.value = optionText;
                    branchingOptionsOverlay.classList.remove('visible');
                }, 500);
            }, { passive: false });
            btn.addEventListener('touchend', () => clearTimeout(longPressTimer));
            btn.addEventListener('touchmove', () => clearTimeout(longPressTimer));
            modalContent.appendChild(btn);
        });
    } else {
        // 如果没有选项，也确保分支浮层是关闭的
        branchingOptionsOverlay.classList.remove('visible');
    }
}
async function loadAttributeAlignmentConfig() {
    const defaultConfig = {
        enabled: false,
        rules: [
            { id: crypto.randomUUID(), realmKeyword: '炼气', attributes: { '血量': { max: 300, float: 50 }, '物攻': { max: 50, float: 10 }, '物防': { max: 50, float: 10 }, '脚力': { max: 60, float: 15 }, '法攻': { max: 40, float: 10 }, '法防': { max: 40, float: 10 }, '法力': { max: 100, float: 30 }, '神识': { max: 10, float: 5 }, '物理穿透': { max: 3, float: 1 }, '法术穿透': { max: 3, float: 1 } } },
            { id: crypto.randomUUID(), realmKeyword: '筑基', attributes: { '血量': { max: 1000, float: 200 }, '物攻': { max: 250, float: 50 }, '物防': { max: 250, float: 50 }, '脚力': { max: 300, float: 50 }, '法攻': { max: 280, float: 50 }, '法防': { max: 280, float: 50 }, '法力': { max: 1000, float: 200 }, '神识': { max: 200, float: 50 }, '物理穿透': { max: 20, float: 5 }, '法术穿透': { max: 20, float: 5 } } },
            { id: crypto.randomUUID(), realmKeyword: '结丹', attributes: { '血量': { max: 5000, float: 1000 }, '物攻': { max: 1200, float: 200 }, '物防': { max: 1200, float: 200 }, '脚力': { max: 1500, float: 300 }, '法攻': { max: 1400, float: 250 }, '法防': { max: 1400, float: 250 }, '法力': { max: 8000, float: 1500 }, '神识': { max: 1000, float: 200 }, '物理穿透': { max: 100, float: 20 }, '法术穿透': { max: 100, float: 20 } } },
            { id: crypto.randomUUID(), realmKeyword: '元婴', attributes: { '血量': { max: 10000, float: 2000 }, '物攻': { max: 5000, float: 1000 }, '物防': { max: 5000, float: 1000 }, '脚力': { max: 6000, float: 1200 }, '法攻': { max: 5500, float: 1100 }, '法防': { max: 5500, float: 1100 }, '法力': { max: 50000, float: 10000 }, '神识': { max: 4000, float: 800 }, '物理穿透': { max: 400, float: 80 }, '法术穿透': { max: 400, float: 80 } } },
            { id: crypto.randomUUID(), realmKeyword: '化神', attributes: { '血量': { max: 20000, float: 4000 }, '物攻': { max: 30000, float: 6000 }, '物防': { max: 30000, float: 6000 }, '脚力': { max: 40000, float: 8000 }, '法攻': { max: 35000, float: 7000 }, '法防': { max: 35000, float: 7000 }, '法力': { max: 500000, float: 100000 }, '神识': { max: 25000, float: 5000 }, '物理穿透': { max: 1500, float: 300 }, '法术穿透': { max: 1500, float: 300 } } },
            { id: crypto.randomUUID(), realmKeyword: '炼虚', attributes: { '血量': { max: 50000, float: 10000 }, '物攻': { max: 150000, float: 30000 }, '物防': { max: 150000, float: 30000 }, '脚力': { max: 200000, float: 40000 }, '法攻': { max: 180000, float: 36000 }, '法防': { max: 180000, float: 36000 }, '法力': { max: 8000000, float: 1600000 }, '神识': { max: 120000, float: 24000 }, '物理穿透': { max: 9000, float: 1800 }, '法术穿透': { max: 9000, float: 1800 } } },
            { id: crypto.randomUUID(), realmKeyword: '合体', attributes: { '血量': { max: 100000, float: 20000 }, '物攻': { max: 800000, float: 160000 }, '物防': { max: 800000, float: 160000 }, '脚力': { max: 1000000, float: 200000 }, '法攻': { max: 900000, float: 180000 }, '法防': { max: 900000, float: 180000 }, '法力': { max: 100000000, float: 20000000 }, '神识': { max: 600000, float: 120000 }, '物理穿透': { max: 50000, float: 10000 }, '法术穿透': { max: 50000, float: 10000 } } },
            { id: crypto.randomUUID(), realmKeyword: '大乘', attributes: { '血量': { max: 500000, float: 100000 }, '物攻': { max: 5000000, float: 1000000 }, '物防': { max: 5000000, float: 1000000 }, '脚力': { max: 8000000, float: 1600000 }, '法攻': { max: 6000000, float: 1200000 }, '法防': { max: 6000000, float: 1200000 }, '法力': { max: 999999999, float: 200000000 }, '神识': { max: 7000000, float: 1400000 }, '物理穿透': { max: 500000, float: 100000 }, '法术穿透': { max: 500000, float: 100000 } } },
        ]
    };
    const savedConfig = await dbGet(ATTRIBUTE_ALIGNMENT_KEY);
    attributeAlignmentConfig = { ...defaultConfig, ...savedConfig };

    if (!Array.isArray(attributeAlignmentConfig.rules)) {
        attributeAlignmentConfig.rules = defaultConfig.rules;
    }
    
    renderAttributeAlignmentUI();
}

    function renderAttributeAlignmentUI() {
        document.getElementById('attribute-alignment-enabled-toggle').checked = attributeAlignmentConfig.enabled;
        const container = document.getElementById('alignment-rules-container');
        container.innerHTML = '';
        attributeAlignmentConfig.rules.forEach(rule => {
            const ruleEl = document.createElement('div');
            ruleEl.className = 'alignment-rule';
            ruleEl.dataset.id = rule.id;
            ruleEl.innerHTML = `
                <div class="alignment-rule-header">
                    <input type="text" class="realm-keyword-input" value="${rule.realmKeyword}" placeholder="境界关键词 (如: 炼气)">
                    <button class="major-action-button remove-rule-btn" style="width:auto; padding: 5px 10px;"><i class="fas fa-trash"></i></button>
                </div>
                <div class="alignment-attr-grid">
                    ${Object.keys(CREATION_CONFIG.ATTRIBUTES).map(attr => `
                        <div class="alignment-attr-item">
                            <label for="align-${rule.id}-${attr}">${attr}</label>
                            <input type="number" id="align-${rule.id}-${attr}-max" data-attr="${attr}" data-type="max" value="${rule.attributes[attr]?.max || 0}" placeholder="上限">
                            <input type="number" id="align-${rule.id}-${attr}-float" data-attr="${attr}" data-type="float" value="${rule.attributes[attr]?.float || 0}" placeholder="浮动">
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(ruleEl);
        });
        container.querySelectorAll('.remove-rule-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const ruleId = e.target.closest('.alignment-rule').dataset.id;
                attributeAlignmentConfig.rules = attributeAlignmentConfig.rules.filter(r => r.id !== ruleId);
                renderAttributeAlignmentUI();
            });
        });
    }

    function addAlignmentRule() {
        attributeAlignmentConfig.rules.push({
            id: crypto.randomUUID(),
            realmKeyword: '',
            attributes: {}
        });
        renderAttributeAlignmentUI();
    }

    function saveAttributeAlignmentConfig() {
        attributeAlignmentConfig.enabled = document.getElementById('attribute-alignment-enabled-toggle').checked;
        const newRules = [];
        document.querySelectorAll('.alignment-rule').forEach(ruleEl => {
            const rule = {
                id: ruleEl.dataset.id,
                realmKeyword: ruleEl.querySelector('.realm-keyword-input').value.trim(),
                attributes: {}
            };
            if (rule.realmKeyword) {
                ruleEl.querySelectorAll('.alignment-attr-item').forEach(attrEl => {
                    const attrName = attrEl.querySelector('label').textContent;
                    const max = parseInt(attrEl.querySelector('[data-type="max"]').value) || 0;
                    const float = parseInt(attrEl.querySelector('[data-type="float"]').value) || 0;
                    if (max > 0) {
                        rule.attributes[attrName] = { max, float };
                    }
                });
                newRules.push(rule);
            }
        });
        attributeAlignmentConfig.rules = newRules;
        dbSet(ATTRIBUTE_ALIGNMENT_KEY, attributeAlignmentConfig);
        showCustomAlert('属性对齐设置已保存！');
        attributeAlignmentOverlay.classList.remove('visible');
    }
    
    async function applyAttributeAlignment() {
        if (!attributeAlignmentConfig.enabled) return;

        let changed = false;
        const allChars = Object.values(currentState['0'] || {});
        
        for (const charRow of allChars) {
            const charRealm = (charRow['2'] || '').split('|')[0].trim();
            const charName = (charRow['1'] || '|').split('|')[0].trim();
            if (!charRealm) continue;

            for (const rule of attributeAlignmentConfig.rules) {
                if (charRealm.includes(rule.realmKeyword)) {
                    let attributes = {};
                    try {
                        attributes = JSON.parse(charRow['11'] || '{}');
                    } catch(e) { continue; }
                    
                    let charChanged = false;
                    for (const attrName in rule.attributes) {
                        const ruleAttr = rule.attributes[attrName];
                        const charAttr = attributes[attrName];

                        if (charAttr && charAttr.max > ruleAttr.max) {
                            const reduction = Math.floor(Math.random() * ruleAttr.float);
                            const newMax = Math.max(ruleAttr.max, charAttr.max - reduction);
                            attributes[attrName].max = newMax;
                            attributes[attrName].current = Math.min(charAttr.current, newMax);
                            charChanged = true;
                            showDanmaku(`${charName}的${attrName}属性已对齐，当前上限为：${newMax}`, 'world');
                        }
                    }
                    
                    if (charChanged) {
                        charRow['11'] = JSON.stringify(attributes);
                        changed = true;
                    }
                    break; 
                }
            }
        }
        
        if (changed) {
            await saveCurrentState();
            syncStateFromTables();
            renderPlayerAttributes(currentPlayerData);
            if (characterDetailOverlay.classList.contains('visible')) {
                openCharacterDetail();
            }
        }
    }
    
    function sortInventory() {
        const sortedItems = [...inventoryItems].sort((a, b) => {
            if (a.type < b.type) return -1;
            if (a.type > b.type) return 1;
            return 0;
        });
        
        const newInventoryState = {};
        sortedItems.forEach(item => {
            newInventoryState[item.id] = currentState['1'][item.id];
        });
        
        currentState['1'] = newInventoryState;
        saveCurrentState();
        syncStateFromTables();
        renderInventory(inventoryItems);
        showDanmaku('储物袋已整理', 'player');
    }

function openMapSelection() {
if (!activeMapRenderer) {
activeMapRenderer = new MapRenderer(
document.getElementById('map-canvas'),
WORLD_MAP_DATA,
(locationString) => {
creationState.birthLocation = locationString;
mapSelectionOverlay.classList.remove('visible');
renderCreationStep();
},
false // isWorldMap = false
);
} else {
activeMapRenderer.setMapData(WORLD_MAP_DATA);
}
activeMapRenderer.drawMap();
mapSelectionOverlay.classList.add('visible');
}

    
async function openWorldMap() {
if (!activeWorldMapRenderer) {
activeWorldMapRenderer = new MapRenderer(
document.getElementById('world-map-canvas'),
WORLD_MAP_DATA, // 初始传入 WORLD_MAP_DATA
(locationString, distance) => {
const targetLocation = locationString.split('|')[0];
addAction('travel', { location: targetLocation, distance: distance });
},
true // isWorldMap = true
);
} else {
activeWorldMapRenderer.stopAnimation();    
activeWorldMapRenderer.setMapData(WORLD_MAP_DATA);
}

// 【新增】从存档中查找最新的地图事件
const archive = await db.archives.get(currentArchiveName);
const logs = archive?.data?.logs || [];
let latestEvents = [];
for (let i = logs.length - 1; i >= 0; i--) {
if (logs[i].mapEvents && logs[i].mapEvents.length > 0) {
latestEvents = logs[i].mapEvents;
break;
}
}
activeWorldMapRenderer.setTransientEvents(latestEvents);

activeWorldMapRenderer.setPlayerData(currentPlayerData);
activeWorldMapRenderer.setCharacters(surroundingCharacters);
activeWorldMapRenderer.drawMap(); 

const npcCarousel = document.getElementById('world-map-npc-carousel');


if (surroundingCharacters && surroundingCharacters.length > 0) {
npcCarousel.style.display = 'flex'; // 确保显示

Object.assign(npcCarousel.style, {
flexDirection: 'row',
flexWrap: 'nowrap',
alignItems: 'center',
overflowX: 'auto',
top: '70px',
left: '15px',
right: '15px',
width: 'auto',
height: 'auto'
});


const currentNpcIds = new Set(surroundingCharacters.map(npc => npc.id));
const carouselNpcIds = new Set(Array.from(npcCarousel.children).map(child => child.dataset.npcId));

let needsUpdate = false;
if (currentNpcIds.size !== carouselNpcIds.size) {
needsUpdate = true;
} else {
for (const id of currentNpcIds) {
if (!carouselNpcIds.has(id)) {
needsUpdate = true;
break;
}
}
}

if (needsUpdate) {
npcCarousel.innerHTML = ''; // 清空旧内容
const archive = await db.archives.get(currentArchiveName);
const npcAvatars = archive?.data?.state?.npcAvatars || {};

surroundingCharacters.forEach(npc => {
if (npc.id === 'B1') return; // 玩家不放入NPC轮播
const card = document.createElement('div');
card.className = 'map-npc-card';
card.dataset.npcId = npc.id; // 添加data-npcId以便后续比较

card.style.flexShrink = '0';

const uniqueImageKey = `${npc.id}_${npc.name}`;
const avatarUrl = npcAvatars[uniqueImageKey] || '';


const avatarStyle = avatarUrl ? `background-image: url('${avatarUrl}');` : '';
const avatarPlaceholder = `<i class="fas fa-user-secret"></i>`;

card.innerHTML = `
<div class="map-npc-card-avatar" style="${avatarStyle}">
${!avatarUrl ? avatarPlaceholder : ''}
</div>
<div class="map-npc-card-name">${npc.name}</div>
`;
card.addEventListener('click', () => {
if (npc.coordinates && activeWorldMapRenderer) {
activeWorldMapRenderer.centerOn(npc.coordinates[0], npc.coordinates[1]);
}
});
npcCarousel.appendChild(card);
});
}
npcCarousel.classList.remove('hidden');
} else {
npcCarousel.classList.add('hidden');
npcCarousel.innerHTML = ''; // 清空内容
}

worldMapOverlay.classList.add('visible');
}
    class MapRenderer {
constructor(canvas, mapData, onSelectCallback, isWorldMap = false, isEditor = false) {
this.canvas = canvas;
this.ctx = canvas.getContext('2d');
this._mapData = mapData; // 使用 _mapData 区分内部存储
this.onSelectCallback = onSelectCallback;
this.isWorldMap = isWorldMap;
this.isEditor = isEditor;
this.infoPanel = document.getElementById(isWorldMap && !isEditor ? 'world-map-info-panel' : 'map-info-panel');
this.npcCarousel = document.getElementById('world-map-npc-carousel');
this.container = this.canvas.parentElement;
this.scale = 1;
this.offsetX = 0;
this.offsetY = 0;
this.isDragging = false;
this.lastX = 0;
this.lastY = 0;
this.hoveredRegion = null;
this.selectedPoint = null;
this.selectedRegionInfo = null;
this.longPressTimer = null;
this.playerData = null;
this.characters = [];
this.transientEvents = [];
this.playerBlinkState = true;
this.editingItem = null;
this.mode = 'view';
this.tempPoints = [];
this.lastTouchDistance = 0;
this.init();
}




setMapData(newMapData) {
this._mapData = newMapData;
this.drawMap(); 
}

setTransientEvents(events) {
this.transientEvents = events || [];
this.drawMap(); // 事件更新后立即重绘
}

setPlayerData(playerData) {
this.playerData = playerData;
this.drawMap(); // 玩家数据更新后重绘
}

setCharacters(chars) {
this.characters = chars;
this.drawMap(); // 角色数据更新后重绘
}

clearSelection() {
this.selectedPoint = null;
this.selectedRegionInfo = null;
this.drawMap();
if (this.infoPanel) this.updateInfoPanel();
if (this.npcCarousel) this.npcCarousel.classList.add('hidden');
}

init() {
this.resize();
window.addEventListener('resize', () => this.resize());
this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
this.canvas.addEventListener('mouseleave', () => { this.isDragging = false; });
this.canvas.addEventListener('click', (e) => this.onClick(e));
this.canvas.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
this.canvas.addEventListener('contextmenu', (e) => {
e.preventDefault();
if (this.isEditor && this.mode === 'draw_polygon') {
this.setMode('view');
document.getElementById('map-editor-status').textContent = '绘制完成。请保存修改。';
} else {
this.clearSelection();
}
});
this.canvas.addEventListener('touchstart', (e) => {
e.preventDefault();
if (e.touches.length === 2) {
this.isDragging = false;
this.lastTouchDistance = this.getTouchDistance(e.touches);
} else if (e.touches.length === 1) {
this.longPressTimer = setTimeout(() => {
if (this.isEditor && this.mode === 'draw_polygon') {
this.setMode('view');
document.getElementById('map-editor-status').textContent = '绘制完成。请保存修改。';
} else {
this.clearSelection();
}
this.longPressTimer = null;
}, 500);
this.onMouseDown(e.touches[0]);
}
}, { passive: false });
this.canvas.addEventListener('touchmove', (e) => {
e.preventDefault();
if (e.touches.length === 2) {
clearTimeout(this.longPressTimer);
const newDist = this.getTouchDistance(e.touches);
if (this.lastTouchDistance > 0) {
const factor = newDist / this.lastTouchDistance;
const rect = this.canvas.getBoundingClientRect();
const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
this.zoom(factor, centerX, centerY);
}
this.lastTouchDistance = newDist;
} else if (e.touches.length === 1) {
clearTimeout(this.longPressTimer);
this.onMouseMove(e.touches[0]);
}
}, { passive: false });
this.canvas.addEventListener('touchend', (e) => {
clearTimeout(this.longPressTimer);
if (e.touches.length < 2) { this.lastTouchDistance = 0; }
if (this.longPressTimer !== null && e.changedTouches.length === 1) {
this.onClick(e.changedTouches[0]);
}
if (e.touches.length < 1) { this.onMouseUp(e.changedTouches[0]); }
});

if (this.isWorldMap) {
let lastDrawTime = 0;
const blinkInterval = 500;

const animatePlayer = (currentTime) => {
if (currentTime - lastDrawTime > blinkInterval) {
this.playerBlinkState = !this.playerBlinkState;
this.drawMap();
lastDrawTime = currentTime;
}
this.animationFrameId = requestAnimationFrame(animatePlayer);
};
this.animationFrameId = requestAnimationFrame(animatePlayer);
}
}



stopAnimation() {
if (this.animationFrameId) {
cancelAnimationFrame(this.animationFrameId);
this.animationFrameId = null;
}
}


getTouchDistance(touches) {
const dx = touches[0].clientX - touches[1].clientX;
const dy = touches[0].clientY - touches[1].clientY;
return Math.sqrt(dx * dx + dy * dy);
}

onWheel(e) {
e.preventDefault();
const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
const rect = this.canvas.getBoundingClientRect();
const mouseX = e.clientX - rect.left;
const mouseY = e.clientY - rect.top;
this.zoom(factor, mouseX, mouseY);
}

zoom(factor, centerX, centerY) {
if (centerX === undefined || centerY === undefined) {
centerX = this.canvas.width / 2;
centerY = this.canvas.height / 2;
}
const newScale = Math.max(0.1, Math.min(5, this.scale * factor));
const worldX = (centerX - this.offsetX) / this.scale;
const worldY = (centerY - this.offsetY) / this.scale;
this.offsetX = centerX - worldX * newScale;
this.offsetY = centerY - worldY * newScale;
this.scale = newScale;
this.drawMap();
}

centerOn(worldX, worldY) {
this.offsetX = this.canvas.width / 2 - worldX * this.scale;
this.offsetY = this.canvas.height / 2 - worldY * this.scale;
this.drawMap();
}

setPlayerData(playerData) { this.playerData = playerData; this.drawMap(); }
setCharacters(chars) { this.characters = chars; this.drawMap(); }

resize() {
this.canvas.width = this.container.clientWidth;
this.canvas.height = this.container.clientHeight;
this.drawMap();
}

drawPin(x, y, size, color, strokeColor, innerColor = '#fff') {
const pinWidth = size / this.scale;
const pinHeight = (size * 2.5) / this.scale;
this.ctx.save();
this.ctx.translate(x, y);
this.ctx.fillStyle = color;
this.ctx.strokeStyle = strokeColor;
this.ctx.lineWidth = 2 / this.scale;
this.ctx.beginPath();
this.ctx.moveTo(0, 0);
this.ctx.bezierCurveTo(-pinWidth, -pinHeight * 0.6, -pinWidth * 0.7, -pinHeight, 0, -pinHeight);
this.ctx.bezierCurveTo(pinWidth * 0.7, -pinHeight, pinWidth, -pinHeight * 0.6, 0, 0);
this.ctx.closePath();
this.ctx.fill();
this.ctx.stroke();
this.ctx.fillStyle = innerColor;
this.ctx.beginPath();
this.ctx.arc(0, -pinHeight * 0.75, pinWidth * 0.3, 0, 2 * Math.PI);
this.ctx.fill();
this.ctx.restore();
return pinHeight;
}

drawMap() {
this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
this.ctx.save();
this.ctx.translate(this.offsetX, this.offsetY);
this.ctx.scale(this.scale, this.scale);

// 使用 _mapData
this._mapData.main_regions.forEach(mainRegion => {
this.ctx.fillStyle = hexToRgba(mainRegion.color || '#C8B89A', 0.7);
this.drawNaturalPath(mainRegion.points);
this.ctx.fill();
});

this._mapData.main_regions.forEach(mainRegion => {
this.ctx.save();
this.drawNaturalPath(mainRegion.points);
this.ctx.clip();
const subs = this._mapData.sub_regions.filter(sub => sub.main_region === mainRegion.name);
subs.forEach(subRegion => {
this.ctx.fillStyle = hexToRgba(subRegion.color || '#8D6E63', 0.85);
this.drawNaturalPath(subRegion.points);
this.ctx.fill();
this.ctx.strokeStyle = '#654321';
this.ctx.lineWidth = 1.5 / this.scale;
this.ctx.setLineDash([8 / this.scale, 4 / this.scale]);
this.ctx.stroke();
this.ctx.setLineDash([]);
});
this.ctx.restore();
});

if (this.isEditor && this.editingItem && this.editingItem.points) {
this.ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
this.drawNaturalPath(this.editingItem.points);
this.ctx.fill();
}

this.ctx.strokeStyle = '#654321';
this.ctx.lineWidth = 3 / this.scale;
this._mapData.main_regions.forEach(region => {
this.drawNaturalPath(region.points);
this.ctx.stroke();
});

this.ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
this.ctx.shadowBlur = 5;
this._mapData.main_regions.forEach(region => {
const center = this.getPolygonCenter(region.points);
this.ctx.font = `bold ${24 / this.scale}px 'ZCOOL XiaoWei', serif`;
this.ctx.fillStyle = '#4a3f35';
this.ctx.textAlign = 'center';
this.ctx.fillText(region.name, center.x, center.y);
});

this._mapData.sub_regions.forEach(region => {
const center = this.getPolygonCenter(region.points);
this.ctx.font = `${16 / this.scale}px 'Noto Serif SC', serif`;
this.ctx.fillStyle = '#4a3f35';
this.ctx.fillText(region.name, center.x, center.y);
});

this.ctx.shadowBlur = 0;
this._mapData.points_of_interest.forEach(poi => {
this.ctx.beginPath();
this.ctx.arc(poi.x, poi.y, 5 / this.scale, 0, 2 * Math.PI);
this.ctx.fillStyle = (this.isEditor && this.editingItem && this.editingItem.name === poi.name) ? 'rgba(255, 255, 0, 0.8)' : '#D4AF37';
this.ctx.fill();
this.ctx.strokeStyle = '#000';
this.ctx.lineWidth = 1 / this.scale;
this.ctx.stroke();
this.ctx.font = `${12 / this.scale}px 'Noto Serif SC', serif`;
this.ctx.textAlign = 'center';
this.ctx.strokeStyle = '#4a3f35';
this.ctx.lineWidth = 2.5 / this.scale;
this.ctx.strokeText(poi.name, poi.x, poi.y - 10 / this.scale);
this.ctx.fillStyle = '#f5f5dc';
this.ctx.fillText(poi.name, poi.x, poi.y - 10 / this.scale);
});

if (this.isWorldMap && this.transientEvents && this.transientEvents.length > 0) {
this.transientEvents.forEach(event => {

this.ctx.font = `bold ${24 / this.scale}px 'Font Awesome 5 Free'`; 
this.ctx.textAlign = 'center';
this.ctx.textBaseline = 'middle';


this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
this.ctx.fillText(event.icon, event.coords[0] + 2 / this.scale, event.coords[1] + 2 / this.scale); // Shadow


this.ctx.fillStyle = event.color || '#FFD700'; 
this.ctx.fillText(event.icon, event.coords[0], event.coords[1]);
});
}

if (this.isEditor && this.tempPoints.length > 0) {
this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
this.ctx.lineWidth = 2 / this.scale;
if (this.mode === 'draw_polygon') {
this.ctx.beginPath();
this.ctx.moveTo(this.tempPoints[0][0], this.tempPoints[0][1]);
for (let i = 1; i < this.tempPoints.length; i++) {
this.ctx.lineTo(this.tempPoints[i][0], this.tempPoints[i][1]);
}
this.ctx.stroke();
}
this.tempPoints.forEach(p => {
this.ctx.beginPath();
this.ctx.arc(p[0], p[1], 5 / this.scale, 0, 2 * Math.PI);
this.ctx.fill();
});
}

if (this.selectedPoint) {
this.ctx.beginPath();
this.ctx.arc(this.selectedPoint.x, this.selectedPoint.y, 8 / this.scale, 0, 2 * Math.PI);
this.ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
this.ctx.strokeStyle = '#fff';
this.ctx.lineWidth = 2 / this.scale;
this.ctx.fill();
this.ctx.stroke();
}

// 绘制NPC图标
if (this.isWorldMap && this.characters && this.characters.length > 0) {
const npcIconRadius = 12 / this.scale;
const npcGroups = this.groupNearbyNPCs(npcIconRadius * 2.5);
npcGroups.forEach(group => {
const [x, y] = group.coords;
const count = group.npcs.length;
if (count > 1) {
this.ctx.fillStyle = 'rgba(138, 43, 226, 0.9)';
this.ctx.strokeStyle = '#FFFFFF';
this.ctx.lineWidth = 2 / this.scale;
this.ctx.beginPath();
this.ctx.arc(x, y, npcIconRadius * 0.8, 0, 2 * Math.PI);
this.ctx.fill();
this.ctx.stroke();
this.ctx.fillStyle = '#FFFFFF';
this.ctx.font = `bold ${12 / this.scale}px 'Press Start 2P'`;
this.ctx.textAlign = 'center';
this.ctx.textBaseline = 'middle';
this.ctx.fillText(count, x, y);
} else {
const npc = group.npcs[0];
const pinHeight = this.drawPin(x, y, 10, 'rgba(138, 43, 226, 0.9)', '#FFFFFF');
this.ctx.font = `bold ${12 / this.scale}px 'Noto Serif SC', serif`;
this.ctx.textAlign = 'center';
this.ctx.strokeStyle = 'rgba(0,0,0,0.8)';
this.ctx.lineWidth = 3 / this.scale;
this.ctx.strokeText(npc.name, x, y - pinHeight - 5 / this.scale);
this.ctx.fillStyle = '#FFD700';
this.ctx.fillText(npc.name, x, y - pinHeight - 5 / this.scale);
}
});
}

// 绘制玩家图标
if (this.isWorldMap && this.playerData && this.playerData.fullLocationString) {
const locationString = this.playerData.fullLocationString;
const coordMatch = locationString.match(/(\d+),(\d+)/);
if (coordMatch) {
const [x, y] = coordMatch.slice(1).map(Number);
if (!isNaN(x) && !isNaN(y)) {
if (this.playerBlinkState) {
this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
this.ctx.beginPath();
this.ctx.arc(x, y, 15 / this.scale, 0, 2 * Math.PI);
this.ctx.fill();
}
this.drawPin(x, y, 12, 'rgba(0, 255, 0, 0.9)', '#fff');
}
}
}
this.ctx.restore();
if (this.isWorldMap) this.drawScaleRuler();
}

groupNearbyNPCs(radius) {
const npcsWithCoords = this.characters.filter(c => c.coordinates && c.id !== 'B1');
const groups = [];
const visited = new Set();
for (const npc of npcsWithCoords) {
if (visited.has(npc.id)) continue;
const group = { npcs: [npc], coords: npc.coordinates };
visited.add(npc.id);
for (const otherNpc of npcsWithCoords) {
if (visited.has(otherNpc.id)) continue;
const dist = Math.sqrt(
Math.pow(npc.coordinates[0] - otherNpc.coordinates[0], 2) +
Math.pow(npc.coordinates[1] - otherNpc.coordinates[1], 2)
);
if (dist < radius) {
group.npcs.push(otherNpc);
visited.add(otherNpc.id);
}
}
if (group.npcs.length > 1) {
let sumX = 0, sumY = 0;
group.npcs.forEach(n => {
sumX += n.coordinates[0];
sumY += n.coordinates[1];
});
group.coords = [sumX / group.npcs.length, sumY / group.npcs.length];
}
groups.push(group);
}
return groups;
}

drawScaleRuler() {
const rulerLengthPx = 100;
const rulerLengthMeters = rulerLengthPx * 10000 / this.scale;
const rulerText = `${Math.round(rulerLengthMeters / 1000)} 公里`;
this.ctx.save();
this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
this.ctx.fillRect(20, this.canvas.height - 40, rulerLengthPx + 20, 30);
this.ctx.strokeStyle = '#fff';
this.ctx.lineWidth = 2;
this.ctx.beginPath();
this.ctx.moveTo(30, this.canvas.height - 25);
this.ctx.lineTo(30 + rulerLengthPx, this.canvas.height - 25);
this.ctx.moveTo(30, this.canvas.height - 30);
this.ctx.lineTo(30, this.canvas.height - 20);
this.ctx.moveTo(30 + rulerLengthPx, this.canvas.height - 30);
this.ctx.lineTo(30 + rulerLengthPx, this.canvas.height - 20);
this.ctx.stroke();
this.ctx.fillStyle = '#fff';
this.ctx.font = '12px Noto Serif SC, serif';
this.ctx.textAlign = 'center';
this.ctx.fillText(rulerText, 30 + rulerLengthPx / 2, this.canvas.height - 28);
this.ctx.restore();
}
drawNaturalPath(points) {
if (!points || points.length < 2) return;
const detailedPoints = generateNaturalBoundaryPoints(points);
if (detailedPoints.length < 2) return;
this.ctx.beginPath();
this.ctx.moveTo(detailedPoints[0][0], detailedPoints[0][1]);
for (let i = 1; i < detailedPoints.length; i++) {
this.ctx.lineTo(detailedPoints[i][0], detailedPoints[i][1]);
}
this.ctx.closePath();
}
getPolygonCenter(points) {
if (!points || points.length === 0) return { x: 0, y: 0 };
let x = 0, y = 0;
points.forEach(p => { x += p[0]; y += p[1]; });
return { x: x / points.length, y: y / points.length };
}
isPointInPolygon(point, vs) {
let x = point.x, y = point.y;
let inside = false;
for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
let xi = vs[i][0], yi = vs[i][1];
let xj = vs[j][0], yj = vs[j][1];
let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
if (intersect) inside = !inside;
}
return inside;
}
getMousePos(evt) {
const rect = this.canvas.getBoundingClientRect();
return {
x: (evt.clientX - rect.left - this.offsetX) / this.scale,
y: (evt.clientY - rect.top - this.offsetY) / this.scale
};
}
onMouseDown(e) {
this.isDragging = false;
this.dragStartPos = { x: e.clientX, y: e.clientY };
this.lastX = e.clientX;
this.lastY = e.clientY;
if (this.isEditor && this.mode === 'view') {
this.canvas.style.cursor = 'grabbing';
}
}
onMouseMove(e) {
if (this.dragStartPos) {
const dx = e.clientX - this.dragStartPos.x;
const dy = e.clientY - this.dragStartPos.y;
if (Math.sqrt(dx * dx + dy * dy) > 5) { this.isDragging = true; }
}
if (this.isDragging) {
const dx = e.clientX - this.lastX;
const dy = e.clientY - this.lastY;
this.offsetX += dx;
this.offsetY += dy;
this.lastX = e.clientX;
this.lastY = e.clientY;
this.drawMap();
} else if (!this.selectedPoint && this.infoPanel) {
this.updateInfoPanel(this.getMousePos(e));
} else if (this.isEditor && (this.mode === 'draw_polygon' || this.mode === 'place_poi')) { 
this.infoPanel.innerHTML = `<p>鼠标位置: (${Math.round(pos.x)}, ${Math.round(pos.y)})</p>`;
}

}
onMouseUp(e) {
this.dragStartPos = null;
if (this.isEditor && this.mode === 'view') {
this.canvas.style.cursor = 'grab';
}
}
async onClick(e) {
if (this.isDragging) { this.isDragging = false; return; }
const pos = this.getMousePos(e);

if (this.isWorldMap) {
// 【新增】优先检查是否点击了新闻事件
if (this.transientEvents) {
const eventClickRadius = 15 / this.scale;
for (const event of this.transientEvents) {
const dist = Math.sqrt(Math.pow(pos.x - event.coords[0], 2) + Math.pow(pos.y - event.coords[1], 2));
if (dist < eventClickRadius) {
// 【修改】直接显示原始HTML内容，而不是纯文本
showCustomAlert(event.text, '事件详情');
return; // 点击了事件，不再执行后续逻辑
}
}
}

const npcIconRadius = 12 / this.scale;
const npcGroups = this.groupNearbyNPCs(npcIconRadius * 2.5);
let clickedGroup = null;
for (const group of npcGroups) {
const [gx, gy] = group.coords;
if (Math.sqrt(Math.pow(pos.x - gx, 2) + Math.pow(pos.y - gy, 2)) < npcIconRadius) {
clickedGroup = group;
break;
}
}
if (clickedGroup) {
this.npcCarousel.classList.remove('hidden');
this.npcCarousel.innerHTML = '';
const archive = await db.archives.get(currentArchiveName); 
const npcAvatars = archive?.data?.state?.npcAvatars || {}; 

for (const npc of clickedGroup.npcs) {
const card = document.createElement('div');
card.className = 'map-npc-card';


const uniqueImageKey = `${npc.id}_${npc.name}`;
const avatarUrl = npcAvatars[uniqueImageKey] || '';
const avatarStyle = avatarUrl ? `background-image: url('${avatarUrl}');` : '';
const avatarPlaceholder = `<i class="fas fa-user-secret"></i>`;

card.innerHTML = `
<div class="map-npc-card-avatar" style="${avatarStyle}">
${!avatarUrl ? avatarPlaceholder : ''}
</div>
<div class="map-npc-card-name">${npc.name}</div>
`;
card.onclick = () => {
worldMapOverlay.classList.remove('visible');
openCharactersOverlay();
showCharacterDetailPanel(npc, null);
characterListView.classList.add('hidden');
characterDetailView.classList.remove('hidden');
};
this.npcCarousel.appendChild(card);
}
return;
} else {
this.npcCarousel.classList.add('hidden');
}
}
if (this.isEditor) {
if (this.mode === 'draw_polygon') {
this.tempPoints.push([Math.round(pos.x), Math.round(pos.y)]);
this.drawMap();
return;
}
if (this.mode === 'place_poi') {
this.tempPoints = [[Math.round(pos.x), Math.round(pos.y)]];
this.mode = 'view'; 
document.getElementById('map-editor-status').textContent = '放置完成。请保存修改。';
this.drawMap(); 
return;
}
}
this.selectedPoint = pos;
let locationString = "未知之地";
let mainRegion = null, subRegion = null, poi = null;
const poiRadius = 10 / this.scale;
for (const p of this._mapData.points_of_interest) { // 使用 _mapData
if (Math.sqrt(Math.pow(pos.x - p.x, 2) + Math.pow(pos.y - p.y, 2)) < poiRadius) {
poi = p; break;
}
}
if (poi) {
mainRegion = this._mapData.main_regions.find(r => r.name === poi.main_region); // 使用 _mapData
subRegion = this._mapData.sub_regions.find(r => r.name === poi.sub_region); // 使用 _mapData
} else {
let smallestArea = Infinity, foundRegion = null;
[...this._mapData.sub_regions, ...this._mapData.main_regions].forEach(region => { // 使用 _mapData
if (this.isPointInPolygon(pos, region.points)) {
const area = this.getPolygonArea(region.points);
if (area < smallestArea) { smallestArea = area; foundRegion = region; }
}
});
if (foundRegion) {
if (this._mapData.sub_regions.includes(foundRegion)) { // 使用 _mapData
subRegion = foundRegion;
mainRegion = this._mapData.main_regions.find(r => r.name === subRegion.main_region); // 使用 _mapData
} else { mainRegion = foundRegion; }
}
}
if (mainRegion) {
locationString = subRegion ? `${mainRegion.name}/${subRegion.name}` : mainRegion.name;
if (poi) locationString += `|(${poi.name}) `;
}
const finalLocation = `${locationString}|${Math.round(pos.x)},${Math.round(pos.y)}`;
this.selectedRegionInfo = { locationString, finalLocation, mainRegion, subRegion, poi };
if (this.infoPanel) this.updateInfoPanel();
this.drawMap();
}

setMode(newMode) {
this.mode = newMode;
this.tempPoints = []; 
this.drawMap();
if (this.isEditor && this.mode === 'view') {
this.canvas.style.cursor = 'grab';
} else if (this.isEditor && (this.mode === 'draw_polygon' || this.mode === 'place_poi')) {
this.canvas.style.cursor = 'crosshair';
}
}

getPolygonArea(points) {
if (!points) return Infinity;
let area = 0;
for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
area += (points[j][0] + points[i][0]) * (points[j][1] - points[i][1]);
}
return Math.abs(area / 2);
}
updateInfoPanel(mousePos = null) {
if (!this.infoPanel) return;
if (this.selectedRegionInfo) {
const { locationString, finalLocation, mainRegion, subRegion, poi } = this.selectedRegionInfo;
let description = mainRegion ? mainRegion.description : '';
if (subRegion) description += `<br><br><strong>${subRegion.name}:</strong> ${subRegion.description}`;
if (poi) description += `<br><br><strong>${poi.name}:</strong> ${poi.description}`;
let distanceText = '', distance = 0;
if (this.isWorldMap && this.playerData && this.playerData.fullLocationString) {
const locationString = this.playerData.fullLocationString;
const coordMatch = locationString.match(/\d+,\d+/);
if (coordMatch) {
const playerCoords = coordMatch[0].split(',').map(Number);
const targetCoords = [this.selectedPoint.x, this.selectedPoint.y];
distance = Math.round(Math.sqrt(Math.pow(playerCoords[0] - targetCoords[0], 2) + Math.pow(playerCoords[1] - targetCoords[1], 2)) * 10);
distanceText = `<br><br><strong>距离:</strong> ${distance.toLocaleString()} 公里`;
}
}
this.infoPanel.innerHTML = `<h4>已选择: ${locationString.split('|')[0]}</h4><p>${description}${distanceText}</p><button id="confirm-location-btn" class="major-action-button">${this.isWorldMap ? '前往此处' : '确认此地'}</button>`;
document.getElementById('confirm-location-btn').onclick = () => { this.onSelectCallback(finalLocation, distance); };
} else if (mousePos) {
this.infoPanel.innerHTML = `<p>坐标: (${Math.round(mousePos.x)}, ${Math.round(mousePos.y)})</p>`;
} else {
this.infoPanel.innerHTML = `<p>在地图上点击选择一个${this.isWorldMap ? '目标' : '出生点'}。</p>`;
}
}
}

async function openMapManagement() {
const mapListContainer = document.getElementById('map-list-container');
mapListContainer.innerHTML = '<p style="text-align:center; opacity:0.7;">正在加载地图列表...</p>';

const archives = await db.archives.orderBy('name').toArray();
let mapItems = [];

// 添加默认初始地图
mapItems.push({
id: 'default-initial-map',
name: '初始默认地图',
preview: '内置的初始地图',
data: DEFAULT_WORLD_MAP_DATA,
isDefault: (currentDefaultMapArchiveName === 'default-initial-map')
});

// 读取每个存档的地图数据
for (const archive of archives) {
const mapData = archive.data.state?.worldMap || DEFAULT_WORLD_MAP_DATA;
mapItems.push({
id: archive.name,
name: archive.name,
preview: `包含 ${mapData.main_regions.length} 个主疆域`,
data: mapData,
isDefault: (currentDefaultMapArchiveName === archive.name)
});
}

mapListContainer.innerHTML = '';
mapItems.forEach(item => {
const div = document.createElement('div');
div.className = 'archive-selection-item'; // 复用样式
div.dataset.mapId = item.id;
div.innerHTML = `
<input type="radio" name="defaultMapSelection" id="map-radio-${item.id}" value="${item.id}" ${item.isDefault ? 'checked' : ''}>
<label for="map-radio-${item.id}" class="archive-name">${item.name}</label>
<span style="font-size: 0.8em; color: var(--text-secondary); margin-left: auto;">${item.preview}</span>
`;
mapListContainer.appendChild(div);
});

// 绑定选择事件，启用或禁用“设为默认地图”按钮
mapListContainer.addEventListener('change', (e) => {
if (e.target.name === 'defaultMapSelection') {
document.getElementById('set-default-map-btn').disabled = false;
}
});

document.getElementById('map-management-overlay').classList.add('visible');
}

// 【新增】设置默认地图
async function setDefaultMap() {
const selectedRadio = document.querySelector('#map-list-container input[name="defaultMapSelection"]:checked');
if (!selectedRadio) {
await showCustomAlert('请选择一个地图。');
return;
}

const mapId = selectedRadio.value;
let mapDataToSet = null;

if (mapId === 'default-initial-map') {
mapDataToSet = DEFAULT_WORLD_MAP_DATA;
} else {
const archive = await db.archives.get(mapId);
if (archive) {
mapDataToSet = archive.data.state?.worldMap || DEFAULT_WORLD_MAP_DATA;
}
}

if (mapDataToSet) {
WORLD_MAP_DATA = mapDataToSet; // 更新全局 WORLD_MAP_DATA
currentDefaultMapArchiveName = mapId; // 更新默认地图 ID
await dbSet(DEFAULT_MAP_KEY, mapId); // 保存到数据库
await showCustomAlert(`"${selectedRadio.nextElementSibling.textContent}" 已设为默认地图！`);
document.getElementById('map-management-overlay').classList.remove('visible');
} else {
await showCustomAlert('无法加载所选地图数据。');
}
}


async function loadDefaultMapSetting() {
currentDefaultMapArchiveName = await dbGet(DEFAULT_MAP_KEY);
if (currentDefaultMapArchiveName && currentDefaultMapArchiveName !== 'default-initial-map') {
const archive = await db.archives.get(currentDefaultMapArchiveName);
if (archive) {
WORLD_MAP_DATA = archive.data.state?.worldMap || DEFAULT_WORLD_MAP_DATA;
} else {
// 如果存档不存在，回退到默认初始地图
WORLD_MAP_DATA = DEFAULT_WORLD_MAP_DATA;
currentDefaultMapArchiveName = 'default-initial-map';
await dbSet(DEFAULT_MAP_KEY, 'default-initial-map');
}
} else {
WORLD_MAP_DATA = DEFAULT_WORLD_MAP_DATA;
currentDefaultMapArchiveName = 'default-initial-map';
await dbSet(DEFAULT_MAP_KEY, 'default-initial-map');
}
}

function showErrorReport(errors, rawResponse) {
const contentEl = document.getElementById('error-report-content');
contentEl.innerHTML = '';


const issuesContainer = document.createElement('div');
issuesContainer.className = 'error-report-section'; 
const issuesHeader = document.createElement('h5');
issuesHeader.textContent = '检测到以下问题:';
issuesContainer.appendChild(issuesHeader);

const errorList = document.createElement('ul');
errors.forEach(err => {
const listItem = document.createElement('li');
const titleStrong = document.createElement('strong');
titleStrong.textContent = `${err.title}: `;
const detailsTextNode = document.createTextNode(err.details);
listItem.appendChild(titleStrong);
listItem.appendChild(detailsTextNode);
errorList.appendChild(listItem);
});
issuesContainer.appendChild(errorList);
contentEl.appendChild(issuesContainer);

const rawResponseContainer = document.createElement('div');
rawResponseContainer.className = 'error-report-section';

const rawHeaderContainer = document.createElement('div');
rawHeaderContainer.style.display = 'flex';
rawHeaderContainer.style.justifyContent = 'space-between';
rawHeaderContainer.style.alignItems = 'center';
rawHeaderContainer.style.marginBottom = '10px';

const rawHeader = document.createElement('h5');
rawHeader.textContent = '原始AI回复:';
rawHeader.style.margin = '0';
rawHeaderContainer.appendChild(rawHeader);

const copyButton = document.createElement('button');
copyButton.className = 'major-action-button small-font-btn';
copyButton.innerHTML = '<i class="fas fa-copy"></i> 复制';
copyButton.onclick = () => {
const textarea = document.getElementById('error-report-raw-response-textarea');
if (textarea) {
textarea.select(); 
document.execCommand('copy'); 
showCustomAlert('原始AI回复已复制到剪贴板！');
} else {
showCustomAlert('复制失败，无法找到文本区域。');
}
};
rawHeaderContainer.appendChild(copyButton);
rawResponseContainer.appendChild(rawHeaderContainer);


const textareaElement = document.createElement('textarea');
textareaElement.id = 'error-report-raw-response-textarea'; 
textareaElement.value = rawResponse; 
textareaElement.readOnly = true; 
textareaElement.style.width = '100%'; 
textareaElement.style.minHeight = '100px'; 
textareaElement.style.resize = 'vertical'; 
textareaElement.style.backgroundColor = 'var(--input-bg)';
textareaElement.style.border = '1px solid var(--input-border)';
textareaElement.style.color = 'var(--text-primary)';
textareaElement.style.padding = '8px';
textareaElement.style.borderRadius = '4px';
textareaElement.style.fontFamily = 'inherit';
textareaElement.style.boxSizing = 'border-box';


rawResponseContainer.appendChild(textareaElement); // 【修改】追加 textarea
contentEl.appendChild(rawResponseContainer);

errorReportOverlay.classList.add('visible');
}
errorReportOverlay.querySelector('.modal-close-btn').addEventListener('click', () => {
errorReportOverlay.classList.remove('visible');
});
document.getElementById('workshop-set-key-btn').addEventListener('click', openWorkshopKeyModal);
document.getElementById('workshop-manage-works-btn').addEventListener('click', openWorkshopManagement);

document.getElementById('workshop-key-overlay').querySelector('.modal-close-btn').addEventListener('click', () => {
document.getElementById('workshop-key-overlay').classList.remove('visible');
});
document.getElementById('save-workshop-key-btn').addEventListener('click', async () => {
const keyInput = document.getElementById('workshop-key-input');
const key = keyInput.value;
if (!/^\d{6}$/.test(key)) {
await showCustomAlert('密钥必须是6位数字！');
keyInput.focus();
return;
}
localStorage.setItem(WORKSHOP_KEY, key);
await showCustomAlert('密钥已保存！');
document.getElementById('workshop-key-overlay').classList.remove('visible');
});

document.getElementById('workshop-management-overlay').querySelector('.modal-close-btn').addEventListener('click', () => {
document.getElementById('workshop-management-overlay').classList.remove('visible');
});
document.getElementById('workshop-preview-overlay').querySelector('.modal-close-btn').addEventListener('click', () => {
document.getElementById('workshop-preview-overlay').classList.remove('visible');
});
document.getElementById('workshop-selection-overlay').querySelector('.modal-close-btn').addEventListener('click', () => {
document.getElementById('workshop-selection-overlay').classList.remove('visible');
});

    setupEventListeners();
    initPanel();

const RECURSION_DEPTH = 4;
const DISPLACEMENT_FACTOR = 0.35; 

function seededRandom(seed) {
let x = Math.sin(seed) * 10000;
return x - Math.floor(x);
}

function subdivide(p1, p2, recursionLevel, seed, outputPoints) {
if (recursionLevel === 0) {
outputPoints.push(p2);
return;
}

const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
const dx = p2.x - p1.x;
const dy = p2.y - p1.y;
const len = Math.sqrt(dx * dx + dy * dy);

if (len < 1) { // Avoid division by zero and huge displacements on tiny segments
outputPoints.push(p2);
return;
}

const displacement = (seededRandom(seed) - 0.5) * len * DISPLACEMENT_FACTOR;

mid.x += (dy / len) * displacement;
mid.y -= (dx / len) * displacement;

subdivide(p1, mid, recursionLevel - 1, seed * 1.7, outputPoints);
subdivide(mid, p2, recursionLevel - 1, seed * 2.3, outputPoints);
}

function generateNaturalBoundaryPoints(points, seed = 1) {
if (!points || points.length < 2) return [];

const detailedPoints = [{x: points[0][0], y: points[0][1]}];

for (let i = 0; i < points.length; i++) {
const p1Array = points[i];
const p2Array = points[(i + 1) % points.length];
const p1 = { x: p1Array[0], y: p1Array[1] };
const p2 = { x: p2Array[0], y: p2Array[1] };


if (p1.x < p2.x || (p1.x === p2.x && p1.y < p2.y)) {
segmentSeed = seed + p1.x * 13 + p1.y * 31 + p2.x * 47 + p2.y * 61;
} else {
segmentSeed = seed + p2.x * 13 + p2.y * 31 + p1.x * 47 + p1.y * 61;
}

subdivide(p1, p2, RECURSION_DEPTH, segmentSeed, detailedPoints);
}


return detailedPoints.map(p => [p.x, p.y]);
}

const RETRO_COLORS = [
'#C8B89A', '#A1887F', '#8D6E63', '#795548', '#607D8B', '#78909C',
'#81C784', '#AED581', '#FFB74D', '#FF8A65', '#9575CD', '#7986CB'
];

async function getCustomMapColors() {
return await dbGet(CUSTOM_MAP_COLORS_KEY) || [];
}

async function saveCustomMapColors(colors) {
await dbSet(CUSTOM_MAP_COLORS_KEY, colors);
}

function hexToRgba(hex, alpha = 1) {
if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
return `rgba(139, 69, 19, ${alpha})`; // 返回一个默认的棕色
}
let c = hex.substring(1).split('');
if (c.length === 3) {
c = [c[0], c[0], c[1], c[1], c[2], c[2]];
}
c = '0x' + c.join('');
return `rgba(${[(c>>16)&255, (c>>8)&255, c&255].join(',')},${alpha})`;
}
async function deleteSelectedMapItems() {
const selectedCheckboxes = document.querySelectorAll('#map-editor-controls input[type="checkbox"]:checked');
if (selectedCheckboxes.length === 0) {
await showCustomAlert('请先选择要删除的项目。');
return;
}

const itemsToDelete = {
main_region: new Set(),
sub_region: new Set(),
poi: new Set()
};

selectedCheckboxes.forEach(cb => {
itemsToDelete[cb.dataset.type].add(cb.dataset.id);
});

// 级联删除：如果删除了主疆域，其下的所有子区域和兴趣点也应被删除
itemsToDelete.main_region.forEach(mainRegionName => {
WORLD_MAP_DATA.sub_regions.forEach(sub => {
if (sub.main_region === mainRegionName) {
itemsToDelete.sub_region.add(sub.name);
}
});
WORLD_MAP_DATA.points_of_interest.forEach(poi => {
if (poi.main_region === mainRegionName) {
itemsToDelete.poi.add(poi.name);
}
});
});

let confirmMessage = '确定要永久删除以下项目吗？\n此操作不可撤销！\n';
if (itemsToDelete.main_region.size > 0) confirmMessage += `\n主疆域: ${[...itemsToDelete.main_region].join(', ')}`;
if (itemsToDelete.sub_region.size > 0) confirmMessage += `\n下辖区域: ${[...itemsToDelete.sub_region].join(', ')}`;
if (itemsToDelete.poi.size > 0) confirmMessage += `\n兴趣点: ${[...itemsToDelete.poi].join(', ')}`;

if (await showCustomConfirm(confirmMessage)) {
WORLD_MAP_DATA.main_regions = WORLD_MAP_DATA.main_regions.filter(item => !itemsToDelete.main_region.has(item.name));
WORLD_MAP_DATA.sub_regions = WORLD_MAP_DATA.sub_regions.filter(item => !itemsToDelete.sub_region.has(item.name));
WORLD_MAP_DATA.points_of_interest = WORLD_MAP_DATA.points_of_interest.filter(item => !itemsToDelete.poi.has(item.name));

// 刷新UI
populateMapEditorLists();
document.getElementById('map-editor-form-container').classList.add('hidden');
mapEditorState.currentEditingItem = null;
activeMapEditorRenderer.setEditingItem(null);
activeMapEditorRenderer.drawMap();
await showCustomAlert('选中的项目已删除。');
}
}

function openMapEditor() {
systemSettingsOverlay.classList.remove('visible');
mapEditorState = {
currentEditingItem: null,
tempPoints: [],
};
if (!activeMapEditorRenderer) {
activeMapEditorRenderer = new MapRenderer(
document.getElementById('map-editor-canvas'),
WORLD_MAP_DATA,
null, // No select callback needed for editor
true, // Treat it like a world map for rendering purposes
true // isEditor = true
);
} else {
activeMapEditorRenderer.setMapData(WORLD_MAP_DATA);
}

populateMapEditorLists();
document.getElementById('map-editor-form-container').classList.add('hidden');
mapEditorOverlay.classList.add('visible');
activeMapEditorRenderer.drawMap();


const deleteSelectedBtn = document.getElementById('map-editor-delete-selected-btn');
// 移除旧监听器以防重复绑定
deleteSelectedBtn.replaceWith(deleteSelectedBtn.cloneNode(true));
document.getElementById('map-editor-delete-selected-btn').addEventListener('click', deleteSelectedMapItems);
}
function populateMapEditorLists() {
const lists = {
main_region: document.getElementById('main-region-list'),
sub_region: document.getElementById('sub-region-list'),
poi: document.getElementById('poi-list'),
};
Object.values(lists).forEach(list => list.innerHTML = '');

const createLi = (item, type) => {
const li = document.createElement('li');
li.dataset.type = type;
li.dataset.id = item.name;

// 新增：复选框
const checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.dataset.id = item.name;
checkbox.dataset.type = type;
checkbox.style.marginRight = '10px';
li.appendChild(checkbox);

if (type !== 'poi') {
const swatch = document.createElement('div');
swatch.className = 'map-item-color-swatch';
swatch.style.backgroundColor = item.color || '#ccc';
li.appendChild(swatch);
}
const nameSpan = document.createElement('span');
nameSpan.textContent = item.name;
nameSpan.style.flexGrow = '1'; // 让名字占据剩余空间
li.appendChild(nameSpan);

// 修改：将点击事件绑定到名字上，而不是整个li
nameSpan.addEventListener('click', () => editMapItem(type, item.name));
return li;
};

WORLD_MAP_DATA.main_regions.forEach(item => lists.main_region.appendChild(createLi(item, 'main_region')));
WORLD_MAP_DATA.sub_regions.forEach(item => lists.sub_region.appendChild(createLi(item, 'sub_region')));
WORLD_MAP_DATA.points_of_interest.forEach(item => lists.poi.appendChild(createLi(item, 'poi')));
}

async function editMapItem(type, id) {
let item;
if (id) {
const key = type === 'poi' ? 'points_of_interest' : (type === 'sub_region' ? 'sub_regions' : 'main_regions');
item = WORLD_MAP_DATA[key].find(i => i.name === id);
} else {
item = { name: '', description: '' }; // New item
}

mapEditorState.currentEditingItem = { type, id: id, data: { ...item } }; // Use a copy

document.querySelectorAll('.map-item-list li').forEach(li => {
li.classList.toggle('selected', li.dataset.id === id && li.dataset.type === type);
});

const formContainer = document.getElementById('map-editor-form-container');
const formTitle = document.getElementById('map-editor-form-title');
const nameInput = document.getElementById('map-editor-name');
const descInput = document.getElementById('map-editor-desc');
const colorPickerContainer = document.getElementById('map-editor-color-picker');
const subRegionSelector = document.getElementById('map-editor-sub-region-selector');
const parentRegionSelect = document.getElementById('map-editor-parent-region');

formTitle.textContent = id ? `编辑 ${item.name}` : `新增 ${type}`;
nameInput.value = item.name;
descInput.value = item.description;

colorPickerContainer.classList.toggle('hidden', type === 'poi');
if (type !== 'poi') {
await renderColorPalette(item.color || RETRO_COLORS[0]);
}

subRegionSelector.classList.toggle('hidden', type !== 'sub_region' && type !== 'poi');
if (type === 'sub_region' || type === 'poi') {
parentRegionSelect.innerHTML = WORLD_MAP_DATA.main_regions.map(r => `<option value="${r.name}">${r.name}</option>`).join('');
parentRegionSelect.value = item.main_region || WORLD_MAP_DATA.main_regions[0]?.name;
}

formContainer.classList.remove('hidden');
activeMapEditorRenderer.setEditingItem(item);
}

async function renderColorPalette(selectedColor) {
const paletteContainer = document.getElementById('retro-palette-container');
const hiddenColorInput = document.getElementById('map-editor-color');
paletteContainer.innerHTML = '';
hiddenColorInput.value = selectedColor;

const customColors = await getCustomMapColors();
const allColors = [...RETRO_COLORS, ...customColors];

const createSwatch = (color, isCustom = false) => {
const swatch = document.createElement('div');
swatch.className = 'retro-color-swatch';
swatch.style.backgroundColor = color;
swatch.dataset.color = color;
if (color === selectedColor) {
swatch.classList.add('selected');
}

swatch.addEventListener('click', () => {
hiddenColorInput.value = color;
paletteContainer.querySelector('.selected')?.classList.remove('selected');
swatch.classList.add('selected');
});

if (isCustom) {
const handleDelete = async (e) => {
e.preventDefault();
if (await showCustomConfirm(`确定要删除这个自定义颜色 (${color}) 吗？`)) {
const updatedColors = (await getCustomMapColors()).filter(c => c !== color);
await saveCustomMapColors(updatedColors);
// 如果删除的是当前选中的颜色，则默认选中第一个颜色
const newSelectedColor = (hiddenColorInput.value === color) ? RETRO_COLORS[0] : hiddenColorInput.value;
await renderColorPalette(newSelectedColor);
}
};
swatch.addEventListener('contextmenu', handleDelete);

let longPressTimer;
swatch.addEventListener('touchstart', (e) => {
longPressTimer = setTimeout(() => {
e.preventDefault();
handleDelete(e);
}, 500);
}, { passive: false });
swatch.addEventListener('touchend', () => clearTimeout(longPressTimer));
swatch.addEventListener('touchmove', () => clearTimeout(longPressTimer));
}

return swatch;
};

allColors.forEach(color => paletteContainer.appendChild(createSwatch(color, customColors.includes(color))));

// Add the "Add New Color" button
const addSwatch = document.createElement('div');
addSwatch.className = 'retro-color-swatch add-color-swatch';
addSwatch.innerHTML = '<i class="fas fa-plus"></i>';

const colorInput = document.createElement('input');
colorInput.type = 'color';
colorInput.className = 'custom-color-input';

colorInput.addEventListener('input', async (e) => {
const newColor = e.target.value;
const currentCustomColors = await getCustomMapColors();
if (!currentCustomColors.includes(newColor)) {
currentCustomColors.push(newColor);
await saveCustomMapColors(currentCustomColors);
}
await renderColorPalette(newColor);
});

addSwatch.appendChild(colorInput);
paletteContainer.appendChild(addSwatch);
}

function saveMapItem() {
if (!mapEditorState.currentEditingItem) return;

const { type, id, data } = mapEditorState.currentEditingItem;
const name = document.getElementById('map-editor-name').value.trim();
if (!name) {
showCustomAlert('名称不能为空！');
return;
}

const key = type === 'poi' ? 'points_of_interest' : (type === 'sub_region' ? 'sub_regions' : 'main_regions');

if (!id && WORLD_MAP_DATA[key].some(i => i.name === name)) {
showCustomAlert('该名称已存在！');
return;
}

data.name = name;
data.description = document.getElementById('map-editor-desc').value.trim();

if (type !== 'poi') {
data.color = document.getElementById('map-editor-color').value;
}
if (type === 'sub_region' || type === 'poi') {
data.main_region = document.getElementById('map-editor-parent-region').value;
}

if (activeMapEditorRenderer.tempPoints.length > 0) {
if (type === 'poi') {
data.x = activeMapEditorRenderer.tempPoints[0][0];
data.y = activeMapEditorRenderer.tempPoints[0][1];
} else {
data.points = activeMapEditorRenderer.tempPoints;
}
} else if (!id) {
showCustomAlert('请先在地图上绘制坐标！');
return;
}

if (!id) { // Is new item
WORLD_MAP_DATA[key].push(data);
} else { // Is editing existing
const index = WORLD_MAP_DATA[key].findIndex(i => i.name === id);
if (index > -1) {
WORLD_MAP_DATA[key][index] = data;
}
}

populateMapEditorLists();
activeMapEditorRenderer.setMode('view');
activeMapEditorRenderer.setEditingItem(null);
activeMapEditorRenderer.drawMap();
document.getElementById('map-editor-form-container').classList.add('hidden');
mapEditorState.currentEditingItem = null;


if (activeWorldMapRenderer) {
activeWorldMapRenderer.setMapData(WORLD_MAP_DATA);
}
}

function deleteMapItem() {
if (!mapEditorState.currentEditingItem || !mapEditorState.currentEditingItem.id) return;

const { type, id } = mapEditorState.currentEditingItem;
const key = type === 'poi' ? 'points_of_interest' : (type === 'sub_region' ? 'sub_regions' : 'main_regions');

WORLD_MAP_DATA[key] = WORLD_MAP_DATA[key].filter(i => i.name !== id);

populateMapEditorLists();
activeMapEditorRenderer.setMode('view');
activeMapEditorRenderer.setEditingItem(null);
activeMapEditorRenderer.drawMap();
document.getElementById('map-editor-form-container').classList.add('hidden');
mapEditorState.currentEditingItem = null;


if (activeWorldMapRenderer) {
activeWorldMapRenderer.setMapData(WORLD_MAP_DATA);
}
}

function importMapData() {
const input = document.createElement('input');
input.type = 'file';
input.accept = '.json';
input.onchange = (e) => {
const file = e.target.files[0];
if (!file) return;
const reader = new FileReader();
reader.onload = async (event) => {
try {
const importedData = JSON.parse(event.target.result);
if (!importedData.main_regions || !importedData.sub_regions || !importedData.points_of_interest) {
throw new Error('导入文件格式不正确。');
}
WORLD_MAP_DATA = importedData;
await saveCurrentState();
openMapEditor(); // Re-open to refresh everything
await showCustomAlert('地图数据导入成功！');
} catch (err) {
await showCustomAlert(`导入失败: ${err.message}`);
}
};
reader.readAsText(file);
};
input.click();
}

function exportMapData() {
const dataStr = JSON.stringify(WORLD_MAP_DATA, null, 2);
const dataBlob = new Blob([dataStr], {type: "application/json"});
const url = URL.createObjectURL(dataBlob);
const a = document.createElement('a');
a.href = url;
a.download = `${currentArchiveName}_map_data.json`;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
}

function openBehaviorInteraction() {
stackedHandContainer.classList.remove('hidden');
stackedHandContainer.classList.remove('expanded');
cardLibraryPanel.classList.add('hidden');
interactionChoicePanel.classList.add('hidden');
behaviorInteractionOverlay.classList.add('visible');
}
function closeBehaviorInteraction() {
behaviorInteractionOverlay.classList.remove('visible');
setTimeout(() => {
stackedHandContainer.classList.remove('hidden');
stackedHandContainer.classList.remove('expanded');
cardLibraryPanel.classList.add('hidden');
interactionChoicePanel.classList.add('hidden');
}, 300); // 300ms 对应 overlay 的 transition 时间
}

function openCardLibrary(category) {
stackedHandContainer.classList.add('hidden');
cardLibraryPanel.classList.remove('hidden');
cardLibraryGrid.innerHTML = '';

let items = [];
let title = '';

switch (category) {
case 'equipment':
title = '装备库';
const equipmentSlots = ['weapon', 'armor', 'technique', 'treasure'];
items = equipmentSlots.flatMap(slotKey =>
(currentPlayerData[slotKey] || []).filter(item => item)
);
break;
case 'inventory':
title = '物品库';
items = inventoryItems;
break;
case 'skills':
title = '技能库';
items = Object.values(currentState['8'] || []).map(s => ({
id: s['0'], name: s['1'], type: '技能',
details: `等级: ${s['2']}\n属性: ${s['3']}\n描述: ${s['4']}\n效果: ${s['5']}`
}));
break;
case 'beasts':
title = '灵兽库';
items = Object.values(currentState['7'] || []).map(b => ({
id: b['0'], name: b['1'], type: '灵兽',
details: `等级: ${b['2']}\n外貌: ${b['3']}\n性格: ${b['4']}\n技能: ${b['5']}`
}));
break;
}

cardLibraryTitle.textContent = title;

if (items.length === 0) {
cardLibraryGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; opacity: 0.7;">空空如也...</p>`;
return;
}

items.forEach(item => {
const card = document.createElement('div');
card.className = 'library-card';
card.draggable = true;
card.dataset.itemName = item.name;
card.dataset.itemType = item.type;
card.dataset.isDragging = 'false';

const detailsHTML = (item.details || item.description + '\n效果: ' + item.effect)
.split('\n')
.map(line => {
const parts = line.split(':');
if (parts.length > 1) {
return `<div class="library-card-detail-title">${parts[0]}</div><p>${parts.slice(1).join(':')}</p>`;
}
return `<p>${line}</p>`;
}).join('');

card.innerHTML = `
<div class="library-card-face card-back">
<i class="fas ${itemIconMap[item.type] || 'fa-question-circle'} library-card-icon"></i>
<span class="library-card-name">${item.name}</span>
</div>
<div class="library-card-face card-front">
<h5 class="library-card-name">${item.name}</h5>
${detailsHTML}
</div>
`;

card.addEventListener('click', () => {
if (card.dataset.isDragging === 'true') {
card.dataset.isDragging = 'false';
return;
}
card.classList.toggle('flipped');
});

card.addEventListener('dragstart', (e) => {
card.dataset.isDragging = 'true';
e.dataTransfer.setData('text/plain', JSON.stringify({ name: item.name, type: item.type }));
cardLibraryPanel.classList.add('drag-active');
setTimeout(() => card.classList.add('hidden'), 0);
});

card.addEventListener('dragend', () => {
card.classList.remove('hidden');
cardLibraryPanel.classList.remove('drag-active');
setTimeout(() => { card.dataset.isDragging = 'false'; }, 100);
});

cardLibraryGrid.appendChild(card);
});
}
function showInteractionChoicePanel(cardData) {
cardLibraryPanel.classList.add('hidden');
interactionChoicePanel.classList.remove('hidden');
interactionChoiceTitle.textContent = `对 [${cardData.name}] 进行...`;
interactionChoiceButtons.innerHTML = '';

const actions = ['攻击', '防御', '交互', '参悟'];
actions.forEach(action => {
const btn = document.createElement('button');
btn.className = 'major-action-button';
btn.textContent = action;
btn.onclick = () => {
messageInput.value = `使用 ${cardData.name} ${action}`;
closeBehaviorInteraction();
};
interactionChoiceButtons.appendChild(btn);
});

const customBtn = document.createElement('button');
customBtn.className = 'major-action-button';
customBtn.innerHTML = '<i class="fas fa-plus"></i> 自定义';
customBtn.onclick = async () => {
const customAction = await showCustomPrompt(`对 [${cardData.name}] 进行的自定义行为是？`);
if (customAction) {
messageInput.value = `使用 ${cardData.name} ${customAction}`;
closeBehaviorInteraction();
}
};
interactionChoiceButtons.appendChild(customBtn);
}

behaviorInteractionOverlay.addEventListener('dragover', (e) => {
e.preventDefault();
});

behaviorInteractionOverlay.addEventListener('drop', (e) => {
e.preventDefault();
const cardData = JSON.parse(e.dataTransfer.getData('text/plain'));
showInteractionChoicePanel(cardData);
});

behaviorInteractionOverlay.addEventListener('click', (e) => {
if (e.target === behaviorInteractionOverlay) {
closeBehaviorInteraction();
}
});

stackedHandContainer.addEventListener('click', (e) => {
const card = e.target.closest('.hand-card');
if (stackedHandContainer.classList.contains('expanded') && card) {
openCardLibrary(card.dataset.type);
} else {
stackedHandContainer.classList.toggle('expanded');
}
});

cardLibraryPanel.querySelector('.modal-close-btn').addEventListener('click', () => {
cardLibraryPanel.classList.add('hidden');
stackedHandContainer.classList.remove('hidden');
});

interactionChoicePanel.querySelector('.modal-close-btn').addEventListener('click', () => {
interactionChoicePanel.classList.add('hidden');
cardLibraryPanel.classList.remove('hidden');
});

async function handleExportPreset() {
try {
const presetData = {
customBirths: await dbGet(CUSTOM_BIRTHS_KEY) || [],
customRaces: await dbGet(CUSTOM_RACES_KEY) || [],
customTraits: await dbGet(CUSTOM_TRAITS_KEY) || [],
bondedCharacters: await dbGet(CUSTOM_BONDED_CHARS_KEY) || []
};

if (Object.values(presetData).every(arr => arr.length === 0)) {
await showCustomAlert('没有可导出的开局预设数据。');
return;
}

const dataStr = JSON.stringify(presetData, null, 2);
const dataBlob = new Blob([dataStr], {type: "application/json"});
const url = URL.createObjectURL(dataBlob);
const a = document.createElement('a');
a.href = url;
a.download = 'cultivation_opening_preset.json';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
splashIoMenuOverlay.classList.remove('visible');
} catch (error) {
console.error("导出预设失败:", error);
await showCustomAlert(`导出预设失败: ${error.message}`);
}
}

function handleImportPreset() {
genericImportInput.onchange = async (e) => {
const file = e.target.files[0];
if (!file) return;
const reader = new FileReader();
reader.onload = async (event) => {
try {
const importedPreset = JSON.parse(event.target.result);
const requiredKeys = ['customBirths', 'customRaces', 'customTraits', 'bondedCharacters'];
if (!requiredKeys.every(key => Array.isArray(importedPreset[key]))) {
throw new Error('预设文件格式不正确或已损坏。');
}

if (!await showCustomConfirm('检测到开局预设文件。是否要导入？\n（将合并数据，ID相同的项不会被覆盖）')) {
return;
}

const mergeData = async (dbKey, importedItems) => {
if (!importedItems || importedItems.length === 0) return 0;
const currentItems = await dbGet(dbKey) || [];
const currentIds = new Set(currentItems.map(item => item.id));
const newItems = importedItems.filter(item => item.id && !currentIds.has(item.id));
if (newItems.length > 0) {
await dbSet(dbKey, [...currentItems, ...newItems]);
}
return newItems.length;
};

let importCount = 0;
importCount += await mergeData(CUSTOM_BIRTHS_KEY, importedPreset.customBirths);
importCount += await mergeData(CUSTOM_RACES_KEY, importedPreset.customRaces);
importCount += await mergeData(CUSTOM_TRAITS_KEY, importedPreset.customTraits);
importCount += await mergeData(CUSTOM_BONDED_CHARS_KEY, importedPreset.bondedCharacters);

await showCustomAlert(`开局预设导入完成！\n共新增 ${importCount} 条数据。`);
splashIoMenuOverlay.classList.remove('visible');

} catch (err) {
await showCustomAlert(`导入预设失败: ${err.message}`);
} finally {
genericImportInput.value = '';
}
};
reader.readAsText(file);
};
genericImportInput.click();
}


function openWorkshopKeyModal() {
const keyInput = document.getElementById('workshop-key-input');
keyInput.value = localStorage.getItem(WORKSHOP_KEY) || '';
document.getElementById('workshop-key-overlay').classList.add('visible');
}

async function openWorkshopManagement() {
    const personalKey = localStorage.getItem(WORKSHOP_KEY);
    if (!personalKey) {
        await showCustomAlert('请先设置您的6位数字密钥才能管理作品！');
        openWorkshopKeyModal();
        return;
    }

    const listEl = document.getElementById('my-workshop-list');
    listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">正在查询我的作品...</p>';
    document.getElementById('workshop-management-overlay').classList.add('visible');

    try {
        const response = await fetch(`${API_BASE_URL}/workshop/my-items?userKey=${personalKey}`);
        const result = await response.json();
        if (!result.success) throw new Error(result.message);

        const myWorks = result.items;
        listEl.innerHTML = '';
        if (myWorks.length === 0) {
            listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">你还没有上传任何作品。</p>';
            return;
        }

        myWorks.forEach(work => {
            const item = document.createElement('div');
            item.className = 'workshop-item'; // Re-use style
            item.innerHTML = `
                <div class="workshop-item-name">${sanitizeHTML(work.name)}</div>
                <div class="workshop-item-meta">
                    <span><i class="fas fa-download fa-fw"></i> ${work.downloads}</span>
                    <span><i class="fas fa-clock fa-fw"></i> ${new Date(work.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="workshop-item-actions">
                    <button class="major-action-button re-upload-btn" data-id="${work.id}"><i class="fas fa-upload"></i> 更新</button>
                    <button class="major-action-button delete-work-btn" data-id="${work.id}" style="border-color:#e57373; color:#e57373;"><i class="fas fa-trash"></i> 删除</button>
                </div>
            `;
            listEl.appendChild(item);
        });

        listEl.querySelectorAll('.delete-work-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteWorkshopItem(btn.dataset.id));
        });
        listEl.querySelectorAll('.re-upload-btn').forEach(btn => {
            btn.addEventListener('click', () => reUploadWorkshopItem(btn.dataset.id));
        });

    } catch (error) {
        console.error("查询我的作品失败:", error);
        listEl.innerHTML = `<p style="text-align:center; color: #e57373;">查询失败: ${error.message}</p>`;
    }
}

async function deleteWorkshopItem(objectId) {
if (!await showCustomConfirm('确定要从创意工坊永久删除这个作品吗？')) return;
try {
const work = AV.Object.createWithoutData('PresetWorkshop', objectId);
await work.destroy();
await showCustomAlert('作品已删除！');
await openWorkshopManagement(); // Refresh the list
updateWorkshopCategoryCounts();
} catch (error) {
console.error("删除作品失败:", error);
await showCustomAlert(`删除失败: ${error.message}`);
}
}

async function reUploadWorkshopItem(objectId) {
    const personalKey = localStorage.getItem(WORKSHOP_KEY);
    try {
        const res = await fetch(`${API_BASE_URL}/workshop/item/${objectId}`);
        const result = await res.json();
        if (!result.success) throw new Error(result.message);
        const work = result.item;

        const category = work.category;
        const config = categoryConfig[category];

        let dataToUpload;
        if (category === 'preset') {
            dataToUpload = await getPresetDataForExport();
        } else if (category === 'world_book') {
            await showCustomAlert('世界书不支持在线更新，请删除后重新上传新版本。');
            return;
        } else {
            dataToUpload = await dbGet(config.dbKey) || [];
        }

        const dataLength = Array.isArray(dataToUpload) ? dataToUpload.length : Object.keys(dataToUpload).length;
        if (dataLength === 0) {
            await showCustomAlert(`你本地没有“${config.name}”数据，无法更新。`);
            return;
        }

        const name = await showCustomPrompt('请输入新的名称:', work.name);
        if (!name) return;
        const description = await showCustomPrompt('请输入新的描述:', work.description);
        if (description === null) return;
        const tagsStr = await showCustomPrompt('请输入新的标签 (用逗号或空格分隔):', (work.tags || []).join(', '));
        if (tagsStr === null) return;

        const tags = tagsStr.split(/[\s,，]+/).filter(Boolean);
        const dataString = JSON.stringify(dataToUpload);

        const updateData = {
            name, description, tags,
            presetData: dataString,
            version: '8.6',
            userKey: personalKey
        };

        const updateResponse = await fetch(`${API_BASE_URL}/workshop/item/${objectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        const updateResult = await updateResponse.json();
        if (!updateResult.success) throw new Error(updateResult.message);

        await showCustomAlert('作品更新成功！');
        await openWorkshopManagement();

    } catch (error) {
        console.error("更新作品失败:", error);
        await showCustomAlert(`更新失败: ${error.message}`);
    }
}

async function deleteWorkshopItem(objectId) {
    if (!await showCustomConfirm('确定要从创意工坊永久删除这个作品吗？')) return;
    const personalKey = localStorage.getItem(WORKSHOP_KEY);
    try {
        const response = await fetch(`${API_BASE_URL}/workshop/item/${objectId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userKey: personalKey })
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);

        await showCustomAlert('作品已删除！');
        await openWorkshopManagement();
        updateWorkshopCategoryCounts();
    } catch (error) {
        console.error("删除作品失败:", error);
        await showCustomAlert(`删除失败: ${error.message}`);
    }
}


async function openWorkshop() {
splashIoMenuOverlay.classList.remove('visible');
document.getElementById('workshop-main-view').classList.remove('hidden');
document.getElementById('workshop-list-view').classList.add('hidden');
workshopOverlay.classList.add('visible');
updateWorkshopCategoryCounts(); 
}

async function updateWorkshopCategoryCounts() {
    const categories = ['preset', 'birth', 'race', 'trait', 'bondedCharacter', 'world_book'];
    try {
        const response = await fetch(`${API_BASE_URL}/workshop/counts`);
        const result = await response.json();
        if (result.success) {
            categories.forEach(category => {
                const countEl = document.getElementById(`${category}-upload-count`);
                if (countEl) {
                    countEl.textContent = result.counts[category] || 0;
                }
            });
        }
    } catch (error) {
        console.error('获取分类数量失败:', error);
        categories.forEach(category => {
            const countEl = document.getElementById(`${category}-upload-count`);
            if (countEl) countEl.textContent = 'N/A';
        });
    }
}



function getWorkshopCache(key) { 
    const cache = JSON.parse(localStorage.getItem(WORKSHOP_CACHE_KEY) || '{}');
    return cache[key];
}

function setWorkshopCache(key, data) { 
    const cache = JSON.parse(localStorage.getItem(WORKSHOP_CACHE_KEY) || '{}');
    cache[key] = data;
    localStorage.setItem(WORKSHOP_CACHE_KEY, JSON.stringify(cache));
}


async function fetchAndRenderWorkshopPresets(forceRefresh = false) {
    const listEl = document.getElementById('workshop-list');

    // 随机排序时总是强制刷新
    if (workshopSortBy === 'random') {
        forceRefresh = true;
    }

    // 尝试从缓存加载数据
    const cacheKey = `${workshopCurrentCategory}-${workshopSortBy}-${workshopPaginationState[workshopCurrentCategory]}-${workshopSearchTerm}`;
    if (!forceRefresh) {
        const cachedData = getWorkshopCache(cacheKey);
        if (cachedData) {
            listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">正在从本地缓存加载...</p>';
            // 延迟一小段时间以模拟加载，并让UI有机会更新
            setTimeout(() => {
                renderWorkshopPresets(cachedData.items);
                renderWorkshopPagination(cachedData.total);
            }, 50);
            return;
        }
    }
    
    // 如果没有缓存或强制刷新，则从网络获取
    listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">正在从云端获取内容...</p>';

    try {
        const params = new URLSearchParams({
            category: workshopCurrentCategory,
            sortBy: workshopSortBy,
            page: workshopPaginationState[workshopCurrentCategory],
            search: workshopSearchTerm
        });
        const response = await fetch(`${API_BASE_URL}/workshop/items?${params.toString()}`);
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message);
        }

        // 非随机排序时缓存结果
        if (workshopSortBy !== 'random') {
            setWorkshopCache(cacheKey, { items: result.items, total: result.total });
        }

        renderWorkshopPresets(result.items);
        renderWorkshopPagination(result.total);

    } catch (error) {
        console.error("获取工坊预设失败:", error);
        listEl.innerHTML = `<p style="text-align:center; color: #e57373;">获取失败: ${error.message}</p>`;
    }
}

function renderWorkshopPresets(presets) {
    const listEl = document.getElementById('workshop-list');
    listEl.innerHTML = '';
    if (presets.length === 0) {
        listEl.innerHTML = '<p style="text-align:center; opacity:0.7;">工坊里空空如也...</p>';
        return;
    }

    presets.forEach(preset => {
        const item = document.createElement('div');
        item.className = 'workshop-item';
        // 关键修复：从 preset.get('key') 改为 preset.key
        // 同时增加对 tags 可能是字符串的健壮性处理
        const tags = typeof preset.tags === 'string' ? JSON.parse(preset.tags) : (preset.tags || []);
        item.innerHTML = `
            <div class="workshop-item-name">${sanitizeHTML(preset.name)}</div>
            <div class="workshop-item-meta">
                <span><i class="fas fa-user fa-fw"></i> ${sanitizeHTML(preset.author)}</span>
                <span><i class="fas fa-download fa-fw"></i> ${preset.downloads}</span>
                <span><i class="fas fa-clock fa-fw"></i> ${new Date(preset.createdAt).toLocaleDateString()}</span>
            </div>
            <p class="workshop-item-desc">${sanitizeHTML(preset.description)}</p>
            <div class="workshop-item-tags">
                ${tags.map(tag => `<span class="tag">${sanitizeHTML(tag)}</span>`).join('')}
            </div>
            <div class="workshop-item-actions" style="flex-direction: row; align-items: center;">
                <button class="major-action-button preview-preset-btn" data-id="${preset.id}" style="flex: 1;"><i class="fas fa-eye"></i> 预览</button>
                <button class="major-action-button download-preset-btn" data-id="${preset.id}" style="flex: 1;"><i class="fas fa-download"></i> 下载</button>
            </div>
        `;
        listEl.appendChild(item);
    });

    // 事件绑定部分无需修改，保持原样
    listEl.querySelectorAll('.download-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => handleDownloadFromWorkshop(btn.dataset.id));
    });
    listEl.querySelectorAll('.preview-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => previewWorkshopItem(btn.dataset.id));
    });
}

function renderWorkshopPagination(totalCount) {
    const paginationEl = document.getElementById('workshop-pagination');
    paginationEl.innerHTML = '';

    if (workshopSortBy === 'random') {
        const randomInfo = document.createElement('span');
        randomInfo.textContent = '随机结果';
        paginationEl.appendChild(randomInfo);
        return;
    }

    const totalPages = Math.ceil(totalCount / WORKSHOP_PAGE_SIZE);

    if (totalPages <= 1) return;
    
    const currentPageForCategory = workshopPaginationState[workshopCurrentCategory] || 1;

    const prevBtn = document.createElement('button');
    prevBtn.className = 'major-action-button';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = currentPageForCategory === 1;
    prevBtn.onclick = () => {
        workshopPaginationState[workshopCurrentCategory]--;
        fetchAndRenderWorkshopPresets();
    };

    const pageInfo = document.createElement('span');
    pageInfo.textContent = `第 ${currentPageForCategory} / ${totalPages} 页`;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'major-action-button';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPageForCategory === totalPages;
    nextBtn.onclick = () => {
        workshopPaginationState[workshopCurrentCategory]++;
        fetchAndRenderWorkshopPresets();
    };

    paginationEl.append(prevBtn, pageInfo, nextBtn);
}

async function handleDownloadFromWorkshop(objectId) {
    try {
        const response = await fetch(`${API_BASE_URL}/workshop/item/${objectId}`);
        const result = await response.json();
        if (!result.success) throw new Error(result.message);

        const workshopObject = result.item;
        const category = workshopObject.category || 'preset';
        
        // 异步更新下载计数，不阻塞用户操作
        fetch(`${API_BASE_URL}/workshop/download/${objectId}`, { method: 'POST' }).catch(console.error);
        
        if (category === 'world_book') {
            const dataString = workshopObject.presetData;
            const fileName = workshopObject.fileName || `${workshopObject.name}.json`;
            
            const dataBlob = new Blob([dataString], {type: "application/json"});
            const url = URL.createObjectURL(dataBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            await showCustomAlert(`世界书 "${workshopObject.name}" 已开始下载！`);
            fetchAndRenderWorkshopPresets();
            updateWorkshopCategoryCounts();
            return;
        }

        const mergeStrategy = await showCustomDialog({
            title: '选择导入模式',
            message: '请选择如何合并下载的数据：',
            buttons: [
                { text: '取消', value: () => null },
                { text: '覆盖', value: () => 'overwrite' },
                { text: '新增', value: () => 'add' }
            ]
        });

        if (mergeStrategy === null) return;
        
        const downloadedData = JSON.parse(workshopObject.presetData);

        const mergeAndSave = async (dbKey, importedItems, strategy) => {
            if (!importedItems || importedItems.length === 0) return { added: 0, updated: 0 };

            const currentItems = await dbGet(dbKey) || [];
            
            if (strategy === 'add') {
                const currentIds = new Set(currentItems.map(item => item.id));
                const newItems = importedItems.filter(item => item.id && !currentIds.has(item.id));
                if (newItems.length > 0) {
                    await dbSet(dbKey, [...currentItems, ...newItems]);
                }
                return { added: newItems.length, updated: 0 };
            } else { // 'overwrite'
                const itemsMap = new Map(currentItems.map(item => [item.id, item]));
                let updatedCount = 0;
                let addedCount = 0;
                
                importedItems.forEach(item => {
                    if (item.id) {
                        if (itemsMap.has(item.id)) updatedCount++;
                        else addedCount++;
                        itemsMap.set(item.id, item);
                    }
                });
                
                await dbSet(dbKey, Array.from(itemsMap.values()));
                return { added: addedCount, updated: updatedCount };
            }
        };

        let totalAdded = 0;
        let totalUpdated = 0;
        const processCategory = async (dbKey, data) => {
            const result = await mergeAndSave(dbKey, data, mergeStrategy);
            totalAdded += result.added;
            totalUpdated += result.updated;
        };

        if (category === 'preset') {
            await processCategory(CUSTOM_BIRTHS_KEY, downloadedData.customBirths);
            await processCategory(CUSTOM_RACES_KEY, downloadedData.customRaces);
            await processCategory(CUSTOM_TRAITS_KEY, downloadedData.customTraits);
            await processCategory(CUSTOM_BONDED_CHARS_KEY, downloadedData.bondedCharacters);
        } else {
            const dbKeyMap = {
                birth: CUSTOM_BIRTHS_KEY, race: CUSTOM_RACES_KEY,
                trait: CUSTOM_TRAITS_KEY, bondedCharacter: CUSTOM_BONDED_CHARS_KEY
            };
            await processCategory(dbKeyMap[category], downloadedData);
        }
        
        let alertMessage = `"${workshopObject.name}" 下载并合并成功！`;
        if (totalAdded > 0) alertMessage += `\n新增了 ${totalAdded} 条数据。`;
        if (totalUpdated > 0) alertMessage += `\n覆盖了 ${totalUpdated} 条数据。`;
        if (totalAdded === 0 && totalUpdated === 0) alertMessage += `\n本地数据已是最新，无需改动。`;
        
        await showCustomAlert(alertMessage);
        fetchAndRenderWorkshopPresets();
        updateWorkshopCategoryCounts();

    } catch (error) {
        console.error("下载失败:", error);
        await showCustomAlert(`下载失败: ${error.message}`);
    }
}


async function getPresetDataForExport() {
return {
customBirths: await dbGet(CUSTOM_BIRTHS_KEY) || [],
customRaces: await dbGet(CUSTOM_RACES_KEY) || [],
customTraits: await dbGet(CUSTOM_TRAITS_KEY) || [],
bondedCharacters: await dbGet(CUSTOM_BONDED_CHARS_KEY) || []
};
}

async function handleUploadToWorkshop() {
const personalKey = localStorage.getItem(WORKSHOP_KEY);
if (!personalKey) {
await showCustomAlert('请先在“个人管理”中设置您的6位数字密钥才能上传！');
openWorkshopKeyModal();
return;
}

const config = categoryConfig[workshopCurrentCategory];

const confirmUpload = async (dataToUpload, fileName = null) => {
let dataLength = 0;
if (Array.isArray(dataToUpload)) {
dataLength = dataToUpload.length;
} else if (dataToUpload && dataToUpload.entries) {
dataLength = Object.keys(dataToUpload.entries).length;
} else if (dataToUpload && typeof dataToUpload === 'object' && !Array.isArray(dataToUpload)) {
dataLength = (dataToUpload.customBirths?.length || 0) + (dataToUpload.customRaces?.length || 0) + (dataToUpload.customTraits?.length || 0) + (dataToUpload.bondedCharacters?.length || 0);
}
if (dataLength === 0) {
await showCustomAlert(`选择的内容为空，无法上传。`);
return;
}

const name = await showCustomPrompt(`请输入要上传的“${config.name}”的名称:`, fileName ? fileName.replace('.json', '') : '');
if (!name) return;
const author = await showCustomPrompt('请输入你的署名:', '匿名道友');
if (!author) return;
const description = await showCustomPrompt('请输入简短描述:');
if (description === null) return;
const tagsStr = await showCustomPrompt('请输入标签 (用逗号或空格分隔):', '通用');
if (tagsStr === null) return;

const tags = tagsStr.split(/[\s,，]+/).filter(Boolean);
const dataString = JSON.stringify(dataToUpload);

try {
const uploadData = {
id: crypto.randomUUID(), name, author, description, tags,
category: workshopCurrentCategory, presetData: dataString,
version: '8.6', userKey: personalKey, fileName
};
const response = await fetch(`${API_BASE_URL}/workshop/upload`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(uploadData)
});
const result = await response.json();
if (!result.success) throw new Error(result.message);

await showCustomAlert('内容上传成功！感谢你的分享！');
await fetchAndRenderWorkshopPresets();
updateWorkshopCategoryCounts();

} catch (error) {
console.error("上传失败:", error);
await showCustomAlert(`上传失败: ${error.message}`);
}
};

if (workshopCurrentCategory === 'preset') {
const data = await getPresetDataForExport();
await confirmUpload(data);
} else if (workshopCurrentCategory === 'world_book') {
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.json';
fileInput.onchange = (e) => {
const file = e.target.files[0];
if (!file) return;
const reader = new FileReader();
reader.onload = async (event) => {
try {
const worldBookData = JSON.parse(event.target.result);
if (!worldBookData.entries) throw new Error('无效的世界书格式，缺少 "entries" 键。');
await confirmUpload(worldBookData, file.name);
} catch (err) {
await showCustomAlert(`文件读取或解析错误: ${err.message}`);
}
};
reader.readAsText(file);
};
fileInput.click();
} else {
const allData = await dbGet(config.dbKey) || [];
await openUploadSelectionModal(workshopCurrentCategory, allData, confirmUpload);
}
}

async function previewWorkshopItem(objectId) {
    const previewOverlay = document.getElementById('workshop-preview-overlay');
    const titleEl = document.getElementById('workshop-preview-title');
    const contentEl = document.getElementById('workshop-preview-content');

    titleEl.textContent = '内容预览';
    contentEl.innerHTML = '<p style="text-align:center; opacity:0.7;">正在加载预览...</p>';
    previewOverlay.classList.add('visible');

    try {
        const response = await fetch(`${API_BASE_URL}/workshop/item/${objectId}`);
        const result = await response.json();
        if (!result.success) throw new Error(result.message);

        const workshopObject = result.item;
        const data = JSON.parse(workshopObject.presetData);
        const category = workshopObject.category;

        titleEl.textContent = `预览: ${sanitizeHTML(workshopObject.name)}`;
        contentEl.innerHTML = formatWorkshopDataForPreview(data, category);

    } catch (error) {
        console.error("预览失败:", error);
        contentEl.innerHTML = `<p style="text-align:center; color: #e57373;">加载预览失败: ${error.message}</p>`;
    }
}

function formatWorkshopDataForPreview(data, category) {
let html = '';
const createSection = (title, items, formatter) => {
if (!items || items.length === 0) return '';
return `<h5>${title} (${items.length})</h5><ul>${items.map(formatter).join('')}</ul>`;
};

if (category === 'preset') {
html += createSection('自定义出身', data.customBirths, item => `<li><strong>${item.tag}</strong>: ${item.description}</li>`);
html += createSection('自定义种族', data.customRaces, item => `<li><strong>${item.tag}</strong>: ${item.description}</li>`);
html += createSection('自定义词条', data.customTraits, item => `<li><strong>[${item.rarity}] ${item.name}</strong>: ${item.desc}</li>`);
html += createSection('羁绊人物', data.bondedCharacters, item => `<li><strong>${item.name}</strong> (${item.identity})</li>`);
} else if (category === 'world_book') {
if (data && data.entries) {
const entries = Object.values(data.entries);
html += `<h5>世界书条目 (${entries.length})</h5>`;
html += '<ul>';
entries.forEach(entry => {
const comment = entry.comment ? `<em>(${sanitizeHTML(entry.comment)})</em>` : '';
const keys = (entry.key && entry.key.length > 0) ? `<strong>关键词:</strong> ${entry.key.join(', ')}` : '';
html += `<li>${comment} ${keys}</li>`;
});
html += '</ul>';
}
} else {
const formatters = {
birth: item => `<li><strong>${item.tag}</strong>: ${item.description}</li>`,
race: item => `<li><strong>${item.tag}</strong>: ${item.description}</li>`,
trait: item => `<li><strong>[${item.rarity}] ${item.name}</strong>: ${item.desc}</li>`,
bondedCharacter: item => `<li><strong>${item.name}</strong> (${item.identity})</li>`
};
html = createSection('内容列表', data, formatters[category]);
}
return html || '<p>此作品内容为空或格式无法识别。</p>';
}

async function openUploadSelectionModal(category, data, onConfirm) {
const selectionOverlay = document.getElementById('workshop-selection-overlay');
const titleEl = document.getElementById('workshop-selection-title');
const listEl = document.getElementById('workshop-selection-list');
const confirmBtn = document.getElementById('workshop-confirm-selection-btn');

titleEl.textContent = `选择要上传的 ${categoryConfig[category].name}`;
listEl.innerHTML = '';

if (data.length === 0) {
listEl.innerHTML = `<p style="text-align:center; opacity:0.7;">你还没有任何可上传的“${categoryConfig[category].name}”数据。</p>`;
confirmBtn.disabled = true;
} else {
confirmBtn.disabled = false;
data.forEach(item => {
const div = document.createElement('div');
div.className = 'archive-selection-item'; // Re-use style
div.innerHTML = `
<input type="checkbox" id="ws-select-${item.id}" data-id="${item.id}">
<label for="ws-select-${item.id}">${item.name || item.tag}</label>
`;
listEl.appendChild(div);
});
}

confirmBtn.onclick = () => {
const selectedIds = Array.from(listEl.querySelectorAll('input:checked')).map(cb => cb.dataset.id);
if (selectedIds.length === 0) {
showCustomAlert('请至少选择一项内容进行上传。');
return;
}
const selectedData = data.filter(item => selectedIds.includes(item.id));
onConfirm(selectedData);
selectionOverlay.classList.remove('visible');
};

selectionOverlay.classList.add('visible');
}
});