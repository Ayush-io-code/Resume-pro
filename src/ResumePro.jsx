import { useState, useRef, useCallback } from "react";

/* ── Google Fonts ── */
const GFONTS = "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;700&family=Fraunces:wght@400;700&family=IBM+Plex+Mono:wght@400;600&display=swap');";

const FONT_OPTIONS = [
  { label: "Playfair Display",   value: "'Playfair Display', serif" },
  { label: "Cormorant Garamond", value: "'Cormorant Garamond', serif" },
  { label: "Fraunces",           value: "'Fraunces', serif" },
  { label: "DM Sans",            value: "'DM Sans', sans-serif" },
  { label: "Lato",               value: "'Lato', sans-serif" },
  { label: "IBM Plex Mono",      value: "'IBM Plex Mono', monospace" },
];

const TEMPLATES = {
  executive: { label:"Executive", emoji:"🏛️", header:"#1a1a2e", accent:"#c9a84c", text:"#1a1a1a", bg:"#faf8f4", skillBg:"#f0ece3", border:"#d4c9a8", headerFont:"'Playfair Display', serif",   bodyFont:"'Lato', sans-serif",        layout:"classic"  },
  modern:    { label:"Modern",    emoji:"⚡",  header:"#0d3b66", accent:"#ee6c4d", text:"#1a1a1a", bg:"#f0f5fb", skillBg:"#e0eaf5", border:"#b0c8e8", headerFont:"'DM Sans', sans-serif",        bodyFont:"'DM Sans', sans-serif",      layout:"sidebar"  },
  minimal:   { label:"Minimal",   emoji:"◻",  header:"#ffffff", accent:"#111111", text:"#222222", bg:"#ffffff", skillBg:"#f5f5f5", border:"#e0e0e0", headerFont:"'Cormorant Garamond', serif", bodyFont:"'Lato', sans-serif",        layout:"minimal"  },
  tech:      { label:"Tech",      emoji:"💻", header:"#0d1117", accent:"#58a6ff", text:"#e6edf3", bg:"#161b22", skillBg:"#21262d", border:"#30363d", headerFont:"'IBM Plex Mono', monospace",  bodyFont:"'IBM Plex Mono', monospace", layout:"tech"     },
  editorial: { label:"Editorial", emoji:"📰", header:"#f5f0e8", accent:"#8b1a1a", text:"#1a1a1a", bg:"#fdfaf5", skillBg:"#f0e8d8", border:"#c8b89a", headerFont:"'Fraunces', serif",           bodyFont:"'Lato', sans-serif",        layout:"editorial"},
};

const PRESET_PALETTES = [
  { name:"Midnight Gold",  header:"#1a1a2e", accent:"#c9a84c", bg:"#faf8f4", text:"#1a1a1a", border:"#d4c9a8", skillBg:"#f0ece3" },
  { name:"Ocean Blue",     header:"#0d3b66", accent:"#ee6c4d", bg:"#f0f5fb", text:"#1a1a1a", border:"#b0c8e8", skillBg:"#e0eaf5" },
  { name:"Forest Green",   header:"#1a3a2a", accent:"#5cb85c", bg:"#f5faf5", text:"#1a1a1a", border:"#b0d8b0", skillBg:"#e0f0e0" },
  { name:"Rose Gold",      header:"#3d1a1a", accent:"#c9777a", bg:"#fdf5f5", text:"#1a1a1a", border:"#e8c0c0", skillBg:"#f5e0e0" },
  { name:"Slate Purple",   header:"#2d1b69", accent:"#9b59b6", bg:"#f8f5ff", text:"#1a1a1a", border:"#c8b0e8", skillBg:"#ede0f5" },
  { name:"Charcoal",       header:"#2c2c2c", accent:"#e0e0e0", bg:"#f5f5f5", text:"#1a1a1a", border:"#cccccc", skillBg:"#e8e8e8" },
  { name:"Dark Terminal",  header:"#0d1117", accent:"#58a6ff", bg:"#161b22", text:"#e6edf3", border:"#30363d", skillBg:"#21262d" },
  { name:"Warm Cream",     header:"#f5f0e8", accent:"#8b1a1a", bg:"#fdfaf5", text:"#1a1a1a", border:"#c8b89a", skillBg:"#f0e8d8" },
  { name:"Teal Minimal",   header:"#ffffff", accent:"#008080", bg:"#ffffff", text:"#222222", border:"#b0d8d8", skillBg:"#e0f5f5" },
  { name:"Sunset Orange",  header:"#7c2d12", accent:"#f97316", bg:"#fff7ed", text:"#1a1a1a", border:"#fed7aa", skillBg:"#ffedd5" },
  { name:"Cobalt & Lime",  header:"#1e3a5f", accent:"#a3e635", bg:"#f0f4ff", text:"#1a1a1a", border:"#93c5fd", skillBg:"#dbeafe" },
  { name:"Monochrome",     header:"#000000", accent:"#555555", bg:"#ffffff", text:"#000000", border:"#cccccc", skillBg:"#f0f0f0" },
];

/* ── Section config ── */
const SECTION_META = {
  summary:        { label:"Summary",        icon:"📝", removable:false },
  experience:     { label:"Experience",     icon:"💼", removable:false },
  education:      { label:"Education",      icon:"🎓", removable:false },
  skills:         { label:"Skills",         icon:"⚡", removable:false },
  certifications: { label:"Certifications", icon:"🏅", removable:true  },
  achievements:   { label:"Achievements",   icon:"🏆", removable:true  },
  projects:       { label:"Projects",       icon:"🚀", removable:true  },
  languages:      { label:"Languages",      icon:"🌐", removable:true  },
  volunteer:      { label:"Volunteer",      icon:"🤝", removable:true  },
  custom:         { label:"Custom",         icon:"✏️", removable:true  },
};

/* ── ATS ── */
function calcATS(data) {
  const text = [data.name, data.title, data.summary,
    ...data.experience.flatMap(e => [e.role, e.company, ...e.bullets]),
    ...data.education.map(e => e.degree), data.skills,
    ...(data.certifications||[]).map(c => c.name),
    ...(data.achievements||[]).map(a => a.text),
  ].join(" ").toLowerCase();

  const bulletCount = data.experience.flatMap(e => e.bullets.filter(b => b.trim())).length;
  const actionVerbs = ["led","managed","built","developed","created","improved","increased","decreased","launched","designed","implemented","delivered","collaborated","optimized","reduced","achieved","spearheaded","drove","generated","executed"].filter(v => text.includes(v));
  const summaryLen  = data.summary.trim().split(/\s+/).length;

  const checks = [
    { label:"Full name present",                  pass:data.name.trim().length>0,                      weight:5,  fix:'Add your full name in Personal Info.' },
    { label:"Professional title",                 pass:data.title.trim().length>0,                     weight:5,  fix:'Add a title e.g. "Senior Software Engineer".' },
    { label:"Email address",                      pass:/\S+@\S+/.test(data.email),                     weight:5,  fix:"Add a professional email address." },
    { label:"Phone number",                       pass:data.phone.trim().length>6,                     weight:5,  fix:"Add your phone number." },
    { label:"Location (City, State)",             pass:data.location.trim().length>0,                  weight:3,  fix:'Add city & state, e.g. "Austin, TX".' },
    { label:"LinkedIn profile",                   pass:data.linkedin.trim().length>0,                  weight:3,  fix:"Add your LinkedIn URL." },
    { label:"Summary (80+ characters)",           pass:data.summary.trim().length>80,                  weight:10, fix:'Write 2-3 sentences. Try: "Results-driven [title] with X years in [field]."' },
    { label:"Ideal summary length (30-80 words)", pass:summaryLen>=30&&summaryLen<=80,                 weight:4,  fix:"Aim for 30-80 words — concise but impactful." },
    { label:"Work experience added",              pass:data.experience.some(e=>e.company&&e.role),     weight:15, fix:"Add at least one role with company & title." },
    { label:"Education section",                  pass:data.education.some(e=>e.institution),          weight:10, fix:"Add your degree, institution, and year." },
    { label:"Skills listed",                      pass:data.skills.trim().length>10,                   weight:10, fix:"List 6-12 skills separated by commas." },
    { label:"4+ achievement bullet points",       pass:bulletCount>=4,                                 weight:10, fix:"Add 3-5 bullets per role." },
    { label:"Quantified achievements",            pass:/\d+%|\$\d+|\d+x|\d+ (people|team|users|clients|projects|employees)/i.test(text), weight:10, fix:'Add numbers: "Increased sales by 35%", "Managed 8 engineers".' },
    { label:"Action verbs used (3+)",             pass:actionVerbs.length>=3,                          weight:5,  fix:"Start bullets with: Led, Built, Increased, Designed, Delivered, Launched." },
  ];

  const score = checks.reduce((s,c)=>s+(c.pass?c.weight:0),0);
  return { score, checks, tips:checks.filter(c=>!c.pass), actionVerbs };
}

/* ── Default data ── */
const uid = () => Date.now() + Math.random();
const emptyExp  = () => ({ id:uid(), company:"", role:"", period:"", bullets:["",""] });
const emptyEdu  = () => ({ id:uid(), institution:"", degree:"", year:"" });
const emptyCert = () => ({ id:uid(), name:"", issuer:"", year:"" });
const emptyAch  = () => ({ id:uid(), text:"" });
const emptyProj = () => ({ id:uid(), name:"", desc:"", link:"" });
const emptyLang = () => ({ id:uid(), language:"", level:"" });
const emptyVol  = () => ({ id:uid(), role:"", org:"", period:"", desc:"" });
const emptyCustom=() => ({ id:uid(), title:"Custom Section", items:[""] });

const defaultData = {
  name:"", title:"", email:"", phone:"", location:"", linkedin:"", website:"",
  summary:"",
  experience:[emptyExp()],
  education:[emptyEdu()],
  skills:"",
  certifications:[],
  achievements:[],
  projects:[],
  languages:[],
  volunteer:[],
  customSections:[],
};

/* ── Default section layout ──
   Each row = array of section ids. Multiple ids in a row = parallel columns. */
const defaultLayout = [
  ["summary"],
  ["experience"],
  ["education"],
  ["skills"],
];

/* ════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════ */
export default function ResumePro() {
  const [data, setData]                 = useState(defaultData);
  const [templateKey, setTemplateKey]   = useState("executive");
  const [customStyle, setCustomStyle]   = useState({});
  const [activeSection, setActiveSection] = useState("personal");
  const [activeTab, setActiveTab]       = useState("form");
  const [sectionLayout, setSectionLayout] = useState(defaultLayout); // array of rows
  const [enabledSections, setEnabledSections] = useState(["summary","experience","education","skills"]);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError]   = useState("");
  const [aiLoading, setAiLoading]       = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiError, setAiError]           = useState("");
  const [dragInfo, setDragInfo]         = useState(null);
  // JD Optimizer
  const [jdText, setJdText]             = useState("");
  const [jdLoading, setJdLoading]       = useState(false);
  const [jdResult, setJdResult]         = useState(null); // { matchScore, missingSkills, suggestedSkills, newSummary, newBullets:[{expIndex,bullets:[]}], keywords:[], titleMatch }
  const [jdError, setJdError]           = useState("");
  const [jdApplied, setJdApplied]       = useState({});
  const fileRef = useRef();

  const T      = { ...TEMPLATES[templateKey], ...customStyle };
  const ats    = calcATS(data);
  const skills = data.skills.split(",").map(s=>s.trim()).filter(Boolean);

  /* ── Data setters ── */
  const set          = (f,v) => setData(d=>({...d,[f]:v}));
  const setExp       = (id,f,v) => setData(d=>({...d,experience:d.experience.map(e=>e.id===id?{...e,[f]:v}:e)}));
  const setBullet    = (id,i,v) => setData(d=>({...d,experience:d.experience.map(e=>e.id===id?{...e,bullets:e.bullets.map((b,j)=>j===i?v:b)}:e)}));
  const addBullet    = id => setData(d=>({...d,experience:d.experience.map(e=>e.id===id?{...e,bullets:[...e.bullets,""]}:e)}));
  const removeBullet = (id,i) => setData(d=>({...d,experience:d.experience.map(e=>e.id===id?{...e,bullets:e.bullets.filter((_,j)=>j!==i)}:e)}));
  const addExp       = () => setData(d=>({...d,experience:[...d.experience,emptyExp()]}));
  const removeExp    = id => setData(d=>({...d,experience:d.experience.filter(e=>e.id!==id)}));
  const setEdu       = (id,f,v) => setData(d=>({...d,education:d.education.map(e=>e.id===id?{...e,[f]:v}:e)}));
  const addEdu       = () => setData(d=>({...d,education:[...d.education,emptyEdu()]}));
  const removeEdu    = id => setData(d=>({...d,education:d.education.filter(e=>e.id!==id)}));
  const setCert      = (id,f,v) => setData(d=>({...d,certifications:d.certifications.map(c=>c.id===id?{...c,[f]:v}:c)}));
  const addCert      = () => setData(d=>({...d,certifications:[...d.certifications,emptyCert()]}));
  const removeCert   = id => setData(d=>({...d,certifications:d.certifications.filter(c=>c.id!==id)}));
  const setAch       = (id,v) => setData(d=>({...d,achievements:d.achievements.map(a=>a.id===id?{...a,text:v}:a)}));
  const addAch       = () => setData(d=>({...d,achievements:[...d.achievements,emptyAch()]}));
  const removeAch    = id => setData(d=>({...d,achievements:d.achievements.filter(a=>a.id!==id)}));
  const setProj      = (id,f,v) => setData(d=>({...d,projects:d.projects.map(p=>p.id===id?{...p,[f]:v}:p)}));
  const addProj      = () => setData(d=>({...d,projects:[...d.projects,emptyProj()]}));
  const removeProj   = id => setData(d=>({...d,projects:d.projects.filter(p=>p.id!==id)}));
  const setLang      = (id,f,v) => setData(d=>({...d,languages:d.languages.map(l=>l.id===id?{...l,[f]:v}:l)}));
  const addLang      = () => setData(d=>({...d,languages:[...d.languages,emptyLang()]}));
  const removeLang   = id => setData(d=>({...d,languages:d.languages.filter(l=>l.id!==id)}));
  const setVol       = (id,f,v) => setData(d=>({...d,volunteer:d.volunteer.map(v2=>v2.id===id?{...v2,[f]:v}:v2)}));
  const addVol       = () => setData(d=>({...d,volunteer:[...d.volunteer,emptyVol()]}));
  const removeVol    = id => setData(d=>({...d,volunteer:d.volunteer.filter(v2=>v2.id!==id)}));
  const addCustom    = () => {
    const sec = emptyCustom();
    setData(d=>({...d,customSections:[...d.customSections,sec]}));
    setEnabledSections(prev=>[...prev,`custom_${sec.id}`]);
    setSectionLayout(prev=>[...prev,[`custom_${sec.id}`]]);
  };
  const setCustomSec = (id,f,v) => setData(d=>({...d,customSections:d.customSections.map(s=>s.id===id?{...s,[f]:v}:s)}));
  const setCustomItem= (id,i,v) => setData(d=>({...d,customSections:d.customSections.map(s=>s.id===id?{...s,items:s.items.map((x,j)=>j===i?v:x)}:s)}));
  const addCustomItem= id => setData(d=>({...d,customSections:d.customSections.map(s=>s.id===id?{...s,items:[...s.items,""]}:s)}));
  const removeCustomSec = id => {
    setData(d=>({...d,customSections:d.customSections.filter(s=>s.id!==id)}));
    const key=`custom_${id}`;
    setEnabledSections(prev=>prev.filter(s=>s!==key));
    setSectionLayout(prev=>prev.map(row=>row.filter(s=>s!==key)).filter(row=>row.length>0));
  };

  /* ── Toggle / add section ── */
  const toggleSection = (secId) => {
    if (enabledSections.includes(secId)) {
      if (!SECTION_META[secId]?.removable) return;
      setEnabledSections(prev=>prev.filter(s=>s!==secId));
      setSectionLayout(prev=>prev.map(row=>row.filter(s=>s!==secId)).filter(row=>row.length>0));
    } else {
      setEnabledSections(prev=>[...prev,secId]);
      setSectionLayout(prev=>[...prev,[secId]]);
      setActiveSection(secId);
    }
  };

  /* ── Layout drag-and-drop ── */
  const dragRow = useRef(null);
  const moveRowUp   = (i) => { if(i===0) return; setSectionLayout(prev=>{const r=[...prev];[r[i-1],r[i]]=[r[i],r[i-1]];return r;}); };
  const moveRowDown = (i) => { setSectionLayout(prev=>{if(i>=prev.length-1)return prev;const r=[...prev];[r[i],r[i+1]]=[r[i+1],r[i]];return r;}); };
  const splitRow    = (rowIdx, colIdx) => {
    setSectionLayout(prev=>{
      const next=[...prev];
      const row=[...next[rowIdx]];
      const [sec]=row.splice(colIdx,1);
      next.splice(rowIdx,1,...(row.length?[row]:[]),[sec]);
      return next;
    });
  };
  const mergeRight  = (rowIdx, colIdx) => {
    // merge this section into the row below as a parallel column
    setSectionLayout(prev=>{
      if(rowIdx>=prev.length-1) return prev;
      const next=[...prev];
      const row=[...next[rowIdx]];
      const [sec]=row.splice(colIdx,1);
      const below=[...next[rowIdx+1],sec];
      if(row.length===0) next.splice(rowIdx,2,below);
      else { next.splice(rowIdx,2,row,below); }
      return next;
    });
  };

  /* ── Import ── */
  const handleImport = async (file) => {
    if(!file) return;
    setImportLoading(true); setImportError("");
    try {
      let text="";
      if(file.type==="application/pdf"){
        const base64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(file);});
        const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:'Extract resume and return ONLY JSON: {name,title,email,phone,location,linkedin,website,summary,experience:[{company,role,period,bullets:[]}],education:[{institution,degree,year}],skills,certifications:[{name,issuer,year}],achievements:[{text}],projects:[{name,desc,link}],languages:[{language,level}]}',messages:[{role:"user",content:[{type:"document",source:{type:"base64",media_type:"application/pdf",data:base64}},{type:"text",text:"Extract resume data into JSON."}]}]})});
        const d=await resp.json();text=d.content?.map(b=>b.text||"").join("")||"";
      } else {
        text=await file.text();
        const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:'Extract resume and return ONLY JSON: {name,title,email,phone,location,linkedin,website,summary,experience:[{company,role,period,bullets:[]}],education:[{institution,degree,year}],skills,certifications:[{name,issuer,year}],achievements:[{text}],projects:[{name,desc,link}],languages:[{language,level}]}',messages:[{role:"user",content:text}]})});
        const d=await resp.json();text=d.content?.map(b=>b.text||"").join("")||"";
      }
      const p=JSON.parse(text.replace(/```json|```/g,"").trim());
      const newData={
        name:p.name||"",title:p.title||"",email:p.email||"",phone:p.phone||"",
        location:p.location||"",linkedin:p.linkedin||"",website:p.website||"",
        summary:p.summary||"",
        experience:(p.experience||[]).map(e=>({...emptyExp(),...e})),
        education:(p.education||[]).map(e=>({...emptyEdu(),...e})),
        skills:p.skills||"",
        certifications:(p.certifications||[]).map(e=>({...emptyCert(),...e})),
        achievements:(p.achievements||[]).map(e=>({...emptyAch(),...e})),
        projects:(p.projects||[]).map(e=>({...emptyProj(),...e})),
        languages:(p.languages||[]).map(e=>({...emptyLang(),...e})),
        volunteer:[],customSections:[],
      };
      setData(newData);
      // auto-enable imported sections
      const toEnable=[];
      if(newData.certifications.length) toEnable.push("certifications");
      if(newData.achievements.length)   toEnable.push("achievements");
      if(newData.projects.length)       toEnable.push("projects");
      if(newData.languages.length)      toEnable.push("languages");
      if(toEnable.length){
        setEnabledSections(prev=>[...new Set([...prev,...toEnable])]);
        setSectionLayout(prev=>[...prev,...toEnable.filter(s=>!prev.flat().includes(s)).map(s=>[s])]);
      }
      setActiveTab("form");
    } catch { setImportError("Could not parse. Try a .txt file."); }
    setImportLoading(false);
  };

  /* ── AI ATS Suggestions ── */
  const getAISuggestions = async () => {
    setAiLoading(true); setAiError(""); setAiSuggestions([]);
    const failed=ats.tips.map(c=>c.label).join(", ");
    const resume=`Name:${data.name}, Title:${data.title}\nSummary:${data.summary}\nExp:${data.experience.map(e=>`${e.role} at ${e.company}: ${e.bullets.filter(b=>b).join("; ")}`).join(" | ")}\nSkills:${data.skills}\nFailed checks:${failed||"none"}`;
    try {
      const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:'You are an expert resume coach. Return ONLY a JSON array: [{section:"Summary"|"Skills"|"Experience"|"Certifications"|"Personal",issue:"short description",suggestion:"exact ready-to-use text"}]. Be specific to their role. No markdown.',messages:[{role:"user",content:resume}]})});
      const d=await resp.json();
      const raw=d.content?.map(b=>b.text||"").join("")||"";
      setAiSuggestions(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    } catch { setAiError("Could not generate suggestions. Fill in some content first."); }
    setAiLoading(false);
  };

  const applySuggestion = s => {
    if(s.section==="Summary") set("summary",s.suggestion);
    else if(s.section==="Skills") set("skills",s.suggestion);
  };

  /* ── JD Optimizer ── */
  const runJDOptimizer = async () => {
    if(!jdText.trim()) return;
    setJdLoading(true); setJdError(""); setJdResult(null); setJdApplied({});
    const resumeSnap = [
      "Name: "+data.name+" | Title: "+data.title,
      "Summary: "+data.summary,
      "Skills: "+data.skills,
      "Experience:",
      ...data.experience.map((e,i)=>"["+i+"] "+e.role+" at "+e.company+"\n"+e.bullets.filter(b=>b).map(b=>"  - "+b).join("\n"))
    ].join("\n");
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:"You are an expert resume optimizer. Given a resume and a job description (JD), analyze the match and return ONLY valid JSON (no markdown, no backticks) with this exact shape: {matchScore:<0-100>,titleMatch:<string>,keywords:[<strings>],missingSkills:[<strings>],suggestedSkills:<comma-separated string>,newSummary:<2-3 sentences tailored to JD using candidate background>,newBullets:[{expIndex:<number>,bullets:[<strings>]}],gaps:[<strings>],tips:[<strings>]}. Keep bullets honest, grounded in actual experience.",
          messages:[{role:"user",content:"JOB DESCRIPTION:\n"+jdText+"\n\nRESUME:\n"+resumeSnap}]
        })
      });
      const d = await resp.json();
      const raw = d.content?.map(b=>b.text||"").join("")||"";
      setJdResult(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    } catch { setJdError("Could not analyze. Make sure your resume has content and try again."); }
    setJdLoading(false);
  };

  const applyJDChange = (key, value) => {
    if(key==="summary")     { set("summary",value); setJdApplied(p=>({...p,summary:true})); }
    else if(key==="skills") { set("skills",value);  setJdApplied(p=>({...p,skills:true}));  }
    else if(key.startsWith("bullets_")) {
      const idx = parseInt(key.replace("bullets_",""));
      const expId = data.experience[idx]?.id;
      if(expId) { setData(d=>({...d,experience:d.experience.map(e=>e.id===expId?{...e,bullets:value}:e)})); setJdApplied(p=>({...p,[key]:true})); }
    }
  };

  /* ── Style ── */
  const setStyle     = (k,v) => setCustomStyle(prev=>({...prev,[k]:v}));
  const applyPalette = p => setCustomStyle(prev=>({...prev,header:p.header,accent:p.accent,bg:p.bg,text:p.text,border:p.border,skillBg:p.skillBg}));

  const inp = {width:"100%",background:"#0f0f0f",border:"1px solid #252525",borderRadius:8,padding:"9px 12px",color:"#f0ede6",fontSize:13,fontFamily:"Lato,sans-serif",outline:"none",boxSizing:"border-box",transition:"border-color .2s"};
  const lbl = {fontSize:10,color:"#666",textTransform:"uppercase",letterSpacing:".1em",marginBottom:5,display:"block"};
  const scoreColor = ats.score>=80?"#22c55e":ats.score>=55?"#f59e0b":"#ef4444";

  const allFormSections = [
    "personal","summary","experience","education","skills",
    "certifications","achievements","projects","languages","volunteer",
    ...data.customSections.map(s=>`custom_${s.id}`),
  ];

  return (
    <div style={{fontFamily:"Lato,sans-serif",minHeight:"100vh",background:"#080808",color:"#f0ede6",display:"flex",flexDirection:"column"}}>
      <style>{`
        ${GFONTS}
        *{box-sizing:border-box}
        input:focus,textarea:focus,select:focus{border-color:#c9a84c!important;outline:none}
        input::placeholder,textarea::placeholder{color:#333}
        select option{background:#1a1a1a;color:#f0ede6}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#222;border-radius:3px}
        .hov-red:hover{color:#ff6b6b!important;border-color:#ff6b6b!important}
        .hov-gold:hover{color:#c9a84c!important;border-color:#c9a84c55!important}
        .hov-dim:hover{background:#1a1a1a!important}
        .palette-btn:hover{border-color:#c9a84c!important;background:#c9a84c11!important}
        .apply-btn:hover{background:#c9a84c!important;color:#000!important}
        .layout-btn:hover{border-color:#c9a84c!important;color:#c9a84c!important}
        .row-ctrl:hover{background:#1e1e1e!important}
        .tab-btn:hover{color:#c9a84c88!important}
        @keyframes pulse{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fadeIn .25s ease forwards}
        @media print{body *{visibility:hidden}#resume-print,#resume-print *{visibility:visible}#resume-print{position:fixed;top:0;left:0;width:100%;z-index:9999}}
      `}</style>

      {/* ── Header ── */}
      <header style={{background:"#0d0d0d",borderBottom:"1px solid #1a1a1a",padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,background:"linear-gradient(135deg,#c9a84c,#e8c97a)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>✦</div>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:"#e8c97a",fontWeight:700}}>ResuméPro</div>
            <div style={{fontSize:10,color:"#444",letterSpacing:".1em",textTransform:"uppercase"}}>Import · Style · ATS · JD Match</div>
          </div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
          <button onClick={()=>fileRef.current.click()} disabled={importLoading} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #333",background:"transparent",color:importLoading?"#555":"#aaa",cursor:"pointer",fontSize:12}}>
            {importLoading?"⏳ Importing…":"📂 Import Resume"}
          </button>
          <input ref={fileRef} type="file" accept=".pdf,.txt" style={{display:"none"}} onChange={e=>handleImport(e.target.files[0])} />
          {importError&&<span style={{fontSize:11,color:"#ef4444"}}>{importError}</span>}
          <button onClick={()=>window.print()} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #c9a84c",background:"transparent",color:"#c9a84c",cursor:"pointer",fontSize:12,fontWeight:"bold"}}>🖨 Print / PDF</button>
        </div>
      </header>

      {/* ── Tab bar ── */}
      <div style={{background:"#0d0d0d",borderBottom:"1px solid #1a1a1a",display:"flex",padding:"0 12px",overflowX:"auto"}}>
        {[{id:"form",label:"✏️ Edit"},{id:"preview",label:"👁 Preview"},{id:"ats",label:`📊 ATS ${ats.score}`},{id:"jd",label:"🎯 JD Match"},{id:"arrange",label:"⇅ Arrange"},{id:"style",label:"🎨 Style"}].map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)} className="tab-btn" style={{padding:"10px 16px",border:"none",background:"transparent",color:activeTab===t.id?"#c9a84c":"#555",fontSize:13,cursor:"pointer",whiteSpace:"nowrap",borderBottom:activeTab===t.id?"2px solid #c9a84c":"2px solid transparent",fontFamily:"Lato,sans-serif",transition:"all .2s"}}>{t.label}</button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:4,padding:"4px 0"}}>
          {Object.entries(TEMPLATES).map(([k,v])=>(
            <button key={k} onClick={()=>{setTemplateKey(k);setCustomStyle({});}} style={{padding:"4px 10px",borderRadius:20,border:"1px solid",borderColor:templateKey===k?"#c9a84c":"#222",background:templateKey===k?"#c9a84c22":"transparent",color:templateKey===k?"#c9a84c":"#555",fontSize:11,cursor:"pointer",whiteSpace:"nowrap"}}>{v.emoji} {v.label}</button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{flex:1,display:"flex",overflow:"hidden",height:"calc(100vh - 107px)"}}>

        {/* ══════ EDIT FORM ══════ */}
        {activeTab==="form"&&(
          <div style={{width:"100%",maxWidth:440,display:"flex",flexDirection:"column",borderRight:"1px solid #1a1a1a",background:"#0a0a0a"}}>
            {/* Section tabs — scrollable */}
            <div style={{display:"flex",borderBottom:"1px solid #1a1a1a",overflowX:"auto",flexShrink:0}}>
              {["personal",...enabledSections].filter((s,i,a)=>a.indexOf(s)===i).map(s=>{
                const isCustom=s.startsWith("custom_");
                const cid=isCustom?parseInt(s.replace("custom_","")):null;
                const label=isCustom?(data.customSections.find(x=>x.id===cid)?.title||"Custom"):SECTION_META[s]?.label||s;
                const icon=isCustom?"✏️":SECTION_META[s]?.icon||"•";
                return(
                  <button key={s} onClick={()=>setActiveSection(s)} className="hov-dim" style={{padding:"9px 12px",border:"none",background:"transparent",color:activeSection===s?"#c9a84c":"#555",fontSize:12,cursor:"pointer",whiteSpace:"nowrap",borderBottom:activeSection===s?"2px solid #c9a84c":"2px solid transparent",fontFamily:"Lato,sans-serif",flexShrink:0}}>
                    {icon} {label}
                  </button>
                );
              })}
            </div>

            <div style={{flex:1,overflowY:"auto",padding:18}}>
              {/* ── Personal ── */}
              {activeSection==="personal"&&(
                <div className="fade-in">
                  <FH>Personal Info</FH>
                  {[["name","Full Name","text"],["title","Professional Title","text"],["email","Email","email"],["phone","Phone","tel"],["location","City, State","text"],["linkedin","LinkedIn URL","text"],["website","Website / Portfolio","text"]].map(([f,p,t])=>(
                    <div key={f} style={{marginBottom:13}}><label style={lbl}>{f}</label><input type={t} placeholder={p} value={data[f]} onChange={e=>set(f,e.target.value)} style={inp}/></div>
                  ))}
                  {/* Add section buttons */}
                  <div style={{marginTop:20}}>
                    <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Add / Remove Sections</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {Object.entries(SECTION_META).filter(([k])=>k!=="summary"&&k!=="experience"&&k!=="education"&&k!=="skills").map(([k,v])=>{
                        const on=enabledSections.includes(k);
                        return(
                          <button key={k} onClick={()=>toggleSection(k)} style={{padding:"4px 12px",borderRadius:16,border:"1px solid",borderColor:on?"#c9a84c":"#252525",background:on?"#c9a84c11":"transparent",color:on?"#c9a84c":"#555",fontSize:11,cursor:v.removable?"pointer":"default",transition:"all .15s"}}>
                            {v.icon} {v.label} {on?"✓":"＋"}
                          </button>
                        );
                      })}
                      <button onClick={addCustom} style={{padding:"4px 12px",borderRadius:16,border:"1px dashed #333",background:"transparent",color:"#555",fontSize:11,cursor:"pointer"}}>＋ Custom</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Summary ── */}
              {activeSection==="summary"&&(
                <div className="fade-in"><FH>Professional Summary</FH>
                  <p style={{fontSize:12,color:"#555",marginBottom:12,lineHeight:1.6}}>2-3 sentences. Use action words and quantify impact.</p>
                  <textarea rows={7} placeholder="Results-driven engineer with 6+ years building scalable systems..." value={data.summary} onChange={e=>set("summary",e.target.value)} style={{...inp,resize:"vertical",lineHeight:1.65}}/>
                  <div style={{marginTop:6,fontSize:11,color:"#555"}}>{data.summary.trim().split(/\s+/).filter(Boolean).length} words (aim for 30-80)</div>
                </div>
              )}

              {/* ── Experience ── */}
              {activeSection==="experience"&&(
                <div className="fade-in"><FH>Work Experience</FH>
                  {data.experience.map((exp,idx)=>(
                    <div key={exp.id} style={{background:"#111",borderRadius:10,padding:14,marginBottom:14,border:"1px solid #1e1e1e"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                        <span style={{fontSize:11,color:"#c9a84c",fontWeight:"bold"}}>Position {idx+1}</span>
                        {data.experience.length>1&&<button className="hov-red" onClick={()=>removeExp(exp.id)} style={{fontSize:11,padding:"2px 8px",borderRadius:5,border:"1px solid #333",background:"transparent",color:"#555",cursor:"pointer"}}>✕</button>}
                      </div>
                      {[["role","Job Title"],["company","Company"],["period","Jan 2022 – Present"]].map(([f,p])=>(
                        <div key={f} style={{marginBottom:10}}><label style={lbl}>{f}</label><input placeholder={p} value={exp[f]} onChange={e=>setExp(exp.id,f,e.target.value)} style={inp}/></div>
                      ))}
                      <label style={lbl}>Bullet Points</label>
                      {exp.bullets.map((b,i)=>(
                        <div key={i} style={{display:"flex",gap:6,marginBottom:6}}>
                          <input placeholder={`Achievement ${i+1}…`} value={b} onChange={e=>setBullet(exp.id,i,e.target.value)} style={{...inp,flex:1}}/>
                          {exp.bullets.length>1&&<button className="hov-red" onClick={()=>removeBullet(exp.id,i)} style={{width:28,borderRadius:6,border:"1px solid #252525",background:"transparent",color:"#444",cursor:"pointer"}}>×</button>}
                        </div>
                      ))}
                      <button className="hov-gold" onClick={()=>addBullet(exp.id)} style={{fontSize:11,padding:"3px 10px",borderRadius:6,border:"1px dashed #252525",background:"transparent",color:"#555",cursor:"pointer",marginTop:2}}>+ bullet</button>
                    </div>
                  ))}
                  <button className="hov-gold" onClick={addExp} style={{width:"100%",padding:9,borderRadius:8,border:"1px dashed #2a2a2a",background:"transparent",color:"#c9a84c88",cursor:"pointer",fontSize:13}}>+ Add Position</button>
                </div>
              )}

              {/* ── Education ── */}
              {activeSection==="education"&&(
                <div className="fade-in"><FH>Education</FH>
                  {data.education.map((edu,idx)=>(
                    <div key={edu.id} style={{background:"#111",borderRadius:10,padding:14,marginBottom:14,border:"1px solid #1e1e1e"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                        <span style={{fontSize:11,color:"#c9a84c",fontWeight:"bold"}}>Degree {idx+1}</span>
                        {data.education.length>1&&<button className="hov-red" onClick={()=>removeEdu(edu.id)} style={{fontSize:11,padding:"2px 8px",borderRadius:5,border:"1px solid #333",background:"transparent",color:"#555",cursor:"pointer"}}>✕</button>}
                      </div>
                      {[["degree","BSc Computer Science"],["institution","University Name"],["year","2022"]].map(([f,p])=>(
                        <div key={f} style={{marginBottom:10}}><label style={lbl}>{f}</label><input placeholder={p} value={edu[f]} onChange={e=>setEdu(edu.id,f,e.target.value)} style={inp}/></div>
                      ))}
                    </div>
                  ))}
                  <button className="hov-gold" onClick={addEdu} style={{width:"100%",padding:9,borderRadius:8,border:"1px dashed #2a2a2a",background:"transparent",color:"#c9a84c88",cursor:"pointer",fontSize:13}}>+ Add Education</button>
                </div>
              )}

              {/* ── Skills ── */}
              {activeSection==="skills"&&(
                <div className="fade-in"><FH>Skills</FH>
                  <p style={{fontSize:12,color:"#555",marginBottom:12,lineHeight:1.6}}>Comma-separated. Mix technical and soft skills.</p>
                  <textarea rows={5} placeholder="React, Node.js, Python, SQL, Leadership, Agile…" value={data.skills} onChange={e=>set("skills",e.target.value)} style={{...inp,resize:"vertical",lineHeight:1.7}}/>
                  {skills.length>0&&<div style={{marginTop:12,display:"flex",flexWrap:"wrap",gap:6}}>{skills.map((s,i)=><span key={i} style={{fontSize:11,padding:"3px 10px",background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:20,color:"#c9a84c"}}>{s}</span>)}</div>}
                </div>
              )}

              {/* ── Certifications ── */}
              {activeSection==="certifications"&&(
                <div className="fade-in"><FH>Certifications</FH>
                  {data.certifications.map((c,i)=>(
                    <div key={c.id} style={{background:"#111",borderRadius:10,padding:14,marginBottom:12,border:"1px solid #1e1e1e"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                        <span style={{fontSize:11,color:"#c9a84c",fontWeight:"bold"}}>Cert {i+1}</span>
                        <button className="hov-red" onClick={()=>removeCert(c.id)} style={{fontSize:11,padding:"2px 8px",borderRadius:5,border:"1px solid #333",background:"transparent",color:"#555",cursor:"pointer"}}>✕</button>
                      </div>
                      {[["name","Certification Name"],["issuer","Issued By (e.g. AWS, Google)"],["year","Year"]].map(([f,p])=>(
                        <div key={f} style={{marginBottom:9}}><label style={lbl}>{f}</label><input placeholder={p} value={c[f]} onChange={e=>setCert(c.id,f,e.target.value)} style={inp}/></div>
                      ))}
                    </div>
                  ))}
                  <button className="hov-gold" onClick={addCert} style={{width:"100%",padding:9,borderRadius:8,border:"1px dashed #2a2a2a",background:"transparent",color:"#c9a84c88",cursor:"pointer",fontSize:13}}>+ Add Certification</button>
                </div>
              )}

              {/* ── Achievements ── */}
              {activeSection==="achievements"&&(
                <div className="fade-in"><FH>Achievements</FH>
                  <p style={{fontSize:12,color:"#555",marginBottom:12,lineHeight:1.6}}>Awards, recognitions, notable accomplishments.</p>
                  {data.achievements.map((a,i)=>(
                    <div key={a.id} style={{display:"flex",gap:6,marginBottom:8}}>
                      <input placeholder={`Achievement ${i+1}…`} value={a.text} onChange={e=>setAch(a.id,e.target.value)} style={{...inp,flex:1}}/>
                      <button className="hov-red" onClick={()=>removeAch(a.id)} style={{width:28,borderRadius:6,border:"1px solid #252525",background:"transparent",color:"#444",cursor:"pointer"}}>×</button>
                    </div>
                  ))}
                  <button className="hov-gold" onClick={addAch} style={{width:"100%",padding:9,borderRadius:8,border:"1px dashed #2a2a2a",background:"transparent",color:"#c9a84c88",cursor:"pointer",fontSize:13}}>+ Add Achievement</button>
                </div>
              )}

              {/* ── Projects ── */}
              {activeSection==="projects"&&(
                <div className="fade-in"><FH>Projects</FH>
                  {data.projects.map((p,i)=>(
                    <div key={p.id} style={{background:"#111",borderRadius:10,padding:14,marginBottom:12,border:"1px solid #1e1e1e"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                        <span style={{fontSize:11,color:"#c9a84c",fontWeight:"bold"}}>Project {i+1}</span>
                        <button className="hov-red" onClick={()=>removeProj(p.id)} style={{fontSize:11,padding:"2px 8px",borderRadius:5,border:"1px solid #333",background:"transparent",color:"#555",cursor:"pointer"}}>✕</button>
                      </div>
                      {[["name","Project Name"],["link","GitHub / Live URL"],["desc","Short description…"]].map(([f,pl])=>(
                        <div key={f} style={{marginBottom:9}}><label style={lbl}>{f}</label><input placeholder={pl} value={p[f]} onChange={e=>setProj(p.id,f,e.target.value)} style={inp}/></div>
                      ))}
                    </div>
                  ))}
                  <button className="hov-gold" onClick={addProj} style={{width:"100%",padding:9,borderRadius:8,border:"1px dashed #2a2a2a",background:"transparent",color:"#c9a84c88",cursor:"pointer",fontSize:13}}>+ Add Project</button>
                </div>
              )}

              {/* ── Languages ── */}
              {activeSection==="languages"&&(
                <div className="fade-in"><FH>Languages</FH>
                  {data.languages.map((l,i)=>(
                    <div key={l.id} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
                      <input placeholder="Language" value={l.language} onChange={e=>setLang(l.id,"language",e.target.value)} style={{...inp,flex:2}}/>
                      <input placeholder="Level (Fluent)" value={l.level} onChange={e=>setLang(l.id,"level",e.target.value)} style={{...inp,flex:1}}/>
                      <button className="hov-red" onClick={()=>removeLang(l.id)} style={{width:28,borderRadius:6,border:"1px solid #252525",background:"transparent",color:"#444",cursor:"pointer",flexShrink:0}}>×</button>
                    </div>
                  ))}
                  <button className="hov-gold" onClick={addLang} style={{width:"100%",padding:9,borderRadius:8,border:"1px dashed #2a2a2a",background:"transparent",color:"#c9a84c88",cursor:"pointer",fontSize:13}}>+ Add Language</button>
                </div>
              )}

              {/* ── Volunteer ── */}
              {activeSection==="volunteer"&&(
                <div className="fade-in"><FH>Volunteer Work</FH>
                  {data.volunteer.map((v,i)=>(
                    <div key={v.id} style={{background:"#111",borderRadius:10,padding:14,marginBottom:12,border:"1px solid #1e1e1e"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                        <span style={{fontSize:11,color:"#c9a84c",fontWeight:"bold"}}>Role {i+1}</span>
                        <button className="hov-red" onClick={()=>removeVol(v.id)} style={{fontSize:11,padding:"2px 8px",borderRadius:5,border:"1px solid #333",background:"transparent",color:"#555",cursor:"pointer"}}>✕</button>
                      </div>
                      {[["role","Role / Position"],["org","Organization"],["period","Year / Period"],["desc","Description"]].map(([f,p])=>(
                        <div key={f} style={{marginBottom:9}}><label style={lbl}>{f}</label><input placeholder={p} value={v[f]} onChange={e=>setVol(v.id,f,e.target.value)} style={inp}/></div>
                      ))}
                    </div>
                  ))}
                  <button className="hov-gold" onClick={addVol} style={{width:"100%",padding:9,borderRadius:8,border:"1px dashed #2a2a2a",background:"transparent",color:"#c9a84c88",cursor:"pointer",fontSize:13}}>+ Add Role</button>
                </div>
              )}

              {/* ── Custom sections ── */}
              {activeSection.startsWith("custom_")&&(()=>{
                const cid=parseInt(activeSection.replace("custom_",""));
                const sec=data.customSections.find(s=>s.id===cid);
                if(!sec) return null;
                return(
                  <div className="fade-in">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                      <FH style={{margin:0,padding:0,border:"none"}}>Custom Section</FH>
                      <button className="hov-red" onClick={()=>removeCustomSec(cid)} style={{fontSize:11,padding:"3px 10px",borderRadius:6,border:"1px solid #333",background:"transparent",color:"#555",cursor:"pointer"}}>Remove</button>
                    </div>
                    <div style={{marginBottom:13}}><label style={lbl}>Section Title</label><input value={sec.title} onChange={e=>setCustomSec(cid,"title",e.target.value)} style={inp}/></div>
                    <label style={lbl}>Items</label>
                    {sec.items.map((item,i)=>(
                      <div key={i} style={{display:"flex",gap:6,marginBottom:8}}>
                        <input placeholder={`Item ${i+1}…`} value={item} onChange={e=>setCustomItem(cid,i,e.target.value)} style={{...inp,flex:1}}/>
                      </div>
                    ))}
                    <button className="hov-gold" onClick={()=>addCustomItem(cid)} style={{width:"100%",padding:9,borderRadius:8,border:"1px dashed #2a2a2a",background:"transparent",color:"#c9a84c88",cursor:"pointer",fontSize:13}}>+ Add Item</button>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ══════ PREVIEW ══════ */}
        {activeTab==="preview"&&(
          <div style={{flex:1,overflowY:"auto",background:"#1a1a1a",padding:"28px 16px"}}>
            <ResumeDoc data={data} T={T} skills={skills} layout={sectionLayout} enabledSections={enabledSections}/>
          </div>
        )}

        {/* ══════ ATS ══════ */}
        {activeTab==="ats"&&(
          <div style={{flex:1,overflowY:"auto",padding:24,maxWidth:720,margin:"0 auto",width:"100%"}}>
            <FH>ATS Score Analysis</FH>
            <div style={{textAlign:"center",padding:"28px 0 20px"}}>
              <svg width={130} height={130} viewBox="0 0 130 130" style={{transform:"rotate(-90deg)"}}>
                <circle cx={65} cy={65} r={54} fill="none" stroke="#1e1e1e" strokeWidth={13}/>
                <circle cx={65} cy={65} r={54} fill="none" stroke={scoreColor} strokeWidth={13} strokeDasharray={`${2*Math.PI*54}`} strokeDashoffset={`${2*Math.PI*54*(1-ats.score/100)}`} strokeLinecap="round" style={{transition:"stroke-dashoffset .8s ease"}}/>
              </svg>
              <div style={{marginTop:-90,fontSize:34,fontWeight:"bold",color:scoreColor,fontFamily:"'Playfair Display',serif"}}>{ats.score}</div>
              <div style={{fontSize:11,color:"#555",marginTop:2}}>out of 100</div>
              <div style={{marginTop:74,fontSize:13,color:scoreColor,fontWeight:"bold"}}>{ats.score>=80?"🟢 Excellent — ATS Ready":ats.score>=55?"🟡 Good — Needs Minor Fixes":"🔴 Low — Needs Work"}</div>
            </div>

            <div style={{background:"#0f0f0f",borderRadius:12,border:"1px solid #1e1e1e",overflow:"hidden",marginBottom:20}}>
              {ats.checks.map((c,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"11px 16px",borderBottom:i<ats.checks.length-1?"1px solid #1a1a1a":"none"}}>
                  <span style={{fontSize:14,marginTop:1}}>{c.pass?"✅":"❌"}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,color:c.pass?"#aaa":"#777"}}>{c.label}</div>
                    {!c.pass&&<div style={{fontSize:11,color:"#555",marginTop:3,lineHeight:1.5}}>→ {c.fix}</div>}
                  </div>
                  <span style={{fontSize:11,color:c.pass?"#22c55e":"#333",whiteSpace:"nowrap"}}>+{c.weight}</span>
                </div>
              ))}
            </div>

            <button onClick={getAISuggestions} disabled={aiLoading} style={{width:"100%",padding:"12px 20px",borderRadius:10,border:"1px solid #c9a84c44",background:aiLoading?"#111":"linear-gradient(135deg,#1a1500,#0d0d0d)",color:aiLoading?"#555":"#c9a84c",cursor:aiLoading?"default":"pointer",fontSize:13,fontWeight:"bold",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:16}}>
              {aiLoading?(<><span style={{display:"flex",gap:4}}>{[0,1,2].map(n=><span key={n} style={{width:6,height:6,borderRadius:"50%",background:"#c9a84c",display:"inline-block",animation:`pulse 1.2s ${n*.2}s infinite`}}/>)}</span>Generating AI suggestions…</>):"✨ Get AI-Powered Suggestions"}
            </button>
            {aiError&&<div style={{marginBottom:12,fontSize:12,color:"#ef4444",textAlign:"center"}}>{aiError}</div>}

            {aiSuggestions.length>0&&(
              <div>
                <div style={{fontSize:12,color:"#c9a84c",fontWeight:"bold",textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>✨ AI Recommendations</div>
                {aiSuggestions.map((s,i)=>(
                  <div key={i} className="fade-in" style={{background:"#0f0f0f",border:"1px solid #252525",borderRadius:10,padding:14,marginBottom:10,animationDelay:`${i*0.07}s`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:"#1e1e1e",color:"#888",textTransform:"uppercase",letterSpacing:".08em"}}>{s.section}</span>
                      {(s.section==="Summary"||s.section==="Skills")&&(
                        <button onClick={()=>applySuggestion(s)} className="apply-btn" style={{fontSize:11,padding:"3px 10px",borderRadius:6,border:"1px solid #c9a84c44",background:"transparent",color:"#c9a84c",cursor:"pointer",transition:"all .2s"}}>Apply →</button>
                      )}
                    </div>
                    <div style={{fontSize:12,color:"#666",marginBottom:6}}>{s.issue}</div>
                    <div style={{fontSize:13,color:"#ccc",lineHeight:1.6,background:"#1a1a1a",borderRadius:6,padding:"8px 10px",borderLeft:"2px solid #c9a84c"}}>{s.suggestion}</div>
                  </div>
                ))}
              </div>
            )}

            {ats.actionVerbs.length>0&&(
              <div style={{marginTop:16,background:"#0a120a",border:"1px solid #1a3a1a",borderRadius:12,padding:16}}>
                <div style={{fontSize:12,color:"#22c55e",fontWeight:"bold",marginBottom:10,textTransform:"uppercase",letterSpacing:".08em"}}>✅ Action Verbs Detected</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{ats.actionVerbs.map((v,i)=><span key={i} style={{fontSize:12,padding:"2px 10px",background:"#1a3a1a",borderRadius:20,color:"#22c55e"}}>{v}</span>)}</div>
              </div>
            )}
          </div>
        )}


        {/* ══════ JD MATCH ══════ */}
        {activeTab==="jd"&&(
          <div style={{flex:1,display:"flex",overflow:"hidden"}}>
            {/* Left: JD input */}
            <div style={{width:340,display:"flex",flexDirection:"column",borderRight:"1px solid #1a1a1a",background:"#0a0a0a"}}>
              <div style={{padding:"14px 16px",borderBottom:"1px solid #1a1a1a"}}>
                <div style={{fontSize:13,color:"#c9a84c",fontWeight:"bold",marginBottom:2}}>🎯 JD Match Optimizer</div>
                <div style={{fontSize:11,color:"#555",lineHeight:1.6}}>Paste a job description and AI will tailor your resume to match it.</div>
              </div>
              <div style={{flex:1,display:"flex",flexDirection:"column",padding:14,gap:10}}>
                <textarea
                  value={jdText}
                  onChange={e=>setJdText(e.target.value)}
                  placeholder={"Paste the full job description here...\n\nExample:\nWe are looking for a Senior React Developer with experience in Node.js, AWS, and agile teams..."}
                  style={{flex:1,background:"#0f0f0f",border:"1px solid #252525",borderRadius:8,padding:"10px 12px",color:"#f0ede6",fontSize:12,fontFamily:"Lato,sans-serif",outline:"none",resize:"none",lineHeight:1.65}}
                />
                <button onClick={runJDOptimizer} disabled={jdLoading||!jdText.trim()}
                  style={{padding:"11px 20px",borderRadius:10,border:"1px solid #c9a84c44",background:jdLoading||!jdText.trim()?"#111":"linear-gradient(135deg,#1a1500,#0d0d0d)",color:jdLoading||!jdText.trim()?"#555":"#c9a84c",cursor:jdLoading||!jdText.trim()?"default":"pointer",fontSize:13,fontWeight:"bold",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s"}}>
                  {jdLoading?(<><span style={{display:"flex",gap:4}}>{[0,1,2].map(n=><span key={n} style={{width:6,height:6,borderRadius:"50%",background:"#c9a84c",display:"inline-block",animation:`pulse 1.2s ${n*.2}s infinite`}}/>)}</span>Analyzing…</>):"🎯 Analyze & Optimize"}
                </button>
                {jdError&&<div style={{fontSize:12,color:"#ef4444",textAlign:"center"}}>{jdError}</div>}
              </div>
            </div>

            {/* Right: Results */}
            <div style={{flex:1,overflowY:"auto",padding:24,background:"#080808"}}>
              {!jdResult&&!jdLoading&&(
                <div style={{textAlign:"center",padding:"80px 20px",color:"#333"}}>
                  <div style={{fontSize:48,marginBottom:14}}>🎯</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:"#444",marginBottom:8}}>Paste a Job Description</div>
                  <div style={{fontSize:13,color:"#333",lineHeight:1.7,maxWidth:340,margin:"0 auto"}}>The AI will analyze your resume against the JD and generate tailored suggestions you can apply with one click.</div>
                </div>
              )}
              {jdLoading&&(
                <div style={{textAlign:"center",padding:"80px 20px"}}>
                  <div style={{fontSize:40,marginBottom:16}}>🔍</div>
                  <div style={{fontSize:14,color:"#c9a84c",marginBottom:8}}>Analyzing your resume against the JD…</div>
                  <div style={{fontSize:12,color:"#444"}}>Comparing keywords, skills, and experience</div>
                </div>
              )}
              {jdResult&&(
                <div className="fade-in">
                  {/* Match Score */}
                  <div style={{display:"flex",gap:16,marginBottom:20,flexWrap:"wrap"}}>
                    <div style={{flex:1,minWidth:140,background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:12,padding:"16px 20px",textAlign:"center"}}>
                      <div style={{fontSize:36,fontWeight:"bold",fontFamily:"'Playfair Display',serif",color:jdResult.matchScore>=70?"#22c55e":jdResult.matchScore>=45?"#f59e0b":"#ef4444"}}>{jdResult.matchScore}<span style={{fontSize:18,color:"#555"}}>/100</span></div>
                      <div style={{fontSize:11,color:"#555",marginTop:4,textTransform:"uppercase",letterSpacing:".1em"}}>Match Score</div>
                    </div>
                    {jdResult.titleMatch&&(
                      <div style={{flex:2,minWidth:180,background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:12,padding:"16px 20px"}}>
                        <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Suggested Title</div>
                        <div style={{fontSize:15,color:"#c9a84c",fontWeight:"bold"}}>{jdResult.titleMatch}</div>
                        <button onClick={()=>{set("title",jdResult.titleMatch);setJdApplied(p=>({...p,title:true}));}} style={{marginTop:8,fontSize:11,padding:"3px 10px",borderRadius:6,border:`1px solid ${jdApplied.title?"#22c55e":"#c9a84c44"}`,background:"transparent",color:jdApplied.title?"#22c55e":"#c9a84c",cursor:"pointer"}}>{jdApplied.title?"✓ Applied":"Apply →"}</button>
                      </div>
                    )}
                  </div>

                  {/* Keywords */}
                  {jdResult.keywords?.length>0&&(
                    <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:12,padding:"14px 16px",marginBottom:16}}>
                      <div style={{fontSize:11,color:"#c9a84c",fontWeight:"bold",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>🔑 Key JD Keywords</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                        {jdResult.keywords.map((k,i)=>{
                          const inResume=[data.summary,data.skills,...data.experience.flatMap(e=>[...e.bullets,e.role])].join(" ").toLowerCase().includes(k.toLowerCase());
                          return <span key={i} style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:inResume?"#0a2a0a":"#2a0a0a",border:`1px solid ${inResume?"#1a4a1a":"#4a1a1a"}`,color:inResume?"#22c55e":"#ef4444"}}>{inResume?"✓":""} {k}</span>;
                        })}
                      </div>
                      <div style={{marginTop:8,fontSize:11,color:"#444"}}>🟢 Already in resume &nbsp;|&nbsp; 🔴 Missing from resume</div>
                    </div>
                  )}

                  {/* Missing Skills */}
                  {jdResult.missingSkills?.length>0&&(
                    <div style={{background:"#120800",border:"1px solid #3a1800",borderRadius:12,padding:"14px 16px",marginBottom:16}}>
                      <div style={{fontSize:11,color:"#f59e0b",fontWeight:"bold",textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>⚠️ Skills Gap</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
                        {jdResult.missingSkills.map((s,i)=><span key={i} style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:"#2a1800",border:"1px solid #5a3800",color:"#f59e0b"}}>{s}</span>)}
                      </div>
                      <div style={{fontSize:11,color:"#555"}}>These are required by the JD but not found in your resume.</div>
                    </div>
                  )}

                  {/* Suggested Skills */}
                  {jdResult.suggestedSkills&&(
                    <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:12,padding:"14px 16px",marginBottom:16}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                        <div style={{fontSize:11,color:"#c9a84c",fontWeight:"bold",textTransform:"uppercase",letterSpacing:".08em"}}>⚡ Optimized Skills List</div>
                        <button onClick={()=>applyJDChange("skills",jdResult.suggestedSkills)} style={{fontSize:11,padding:"3px 10px",borderRadius:6,border:`1px solid ${jdApplied.skills?"#22c55e":"#c9a84c44"}`,background:"transparent",color:jdApplied.skills?"#22c55e":"#c9a84c",cursor:"pointer"}}>{jdApplied.skills?"✓ Applied":"Apply →"}</button>
                      </div>
                      <div style={{fontSize:12,color:"#888",lineHeight:1.6,background:"#1a1a1a",borderRadius:6,padding:"8px 10px",borderLeft:"2px solid #c9a84c"}}>{jdResult.suggestedSkills}</div>
                    </div>
                  )}

                  {/* New Summary */}
                  {jdResult.newSummary&&(
                    <div style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:12,padding:"14px 16px",marginBottom:16}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                        <div style={{fontSize:11,color:"#c9a84c",fontWeight:"bold",textTransform:"uppercase",letterSpacing:".08em"}}>📝 JD-Tailored Summary</div>
                        <button onClick={()=>applyJDChange("summary",jdResult.newSummary)} style={{fontSize:11,padding:"3px 10px",borderRadius:6,border:`1px solid ${jdApplied.summary?"#22c55e":"#c9a84c44"}`,background:"transparent",color:jdApplied.summary?"#22c55e":"#c9a84c",cursor:"pointer"}}>{jdApplied.summary?"✓ Applied":"Apply →"}</button>
                      </div>
                      <div style={{fontSize:13,color:"#ccc",lineHeight:1.7,background:"#1a1a1a",borderRadius:6,padding:"10px 12px",borderLeft:"2px solid #c9a84c"}}>{jdResult.newSummary}</div>
                    </div>
                  )}

                  {/* New Bullets per experience */}
                  {jdResult.newBullets?.map((nb,i)=>{
                    const exp=data.experience[nb.expIndex];
                    if(!exp) return null;
                    const key=`bullets_${nb.expIndex}`;
                    return(
                      <div key={i} style={{background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:12,padding:"14px 16px",marginBottom:16}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                          <div>
                            <div style={{fontSize:11,color:"#c9a84c",fontWeight:"bold",textTransform:"uppercase",letterSpacing:".08em"}}>💼 Rewritten Bullets</div>
                            <div style={{fontSize:12,color:"#555",marginTop:2}}>{exp.role} @ {exp.company}</div>
                          </div>
                          <button onClick={()=>applyJDChange(key,nb.bullets)} style={{fontSize:11,padding:"3px 10px",borderRadius:6,border:`1px solid ${jdApplied[key]?"#22c55e":"#c9a84c44"}`,background:"transparent",color:jdApplied[key]?"#22c55e":"#c9a84c",cursor:"pointer"}}>{jdApplied[key]?"✓ Applied":"Apply →"}</button>
                        </div>
                        <div style={{background:"#1a1a1a",borderRadius:6,padding:"10px 12px",borderLeft:"2px solid #c9a84c"}}>
                          {nb.bullets.map((b,j)=><div key={j} style={{fontSize:13,color:"#ccc",lineHeight:1.65,marginBottom:j<nb.bullets.length-1?6:0}}>• {b}</div>)}
                        </div>
                      </div>
                    );
                  })}

                  {/* Gaps & Tips */}
                  {jdResult.gaps?.length>0&&(
                    <div style={{background:"#0d0d0d",border:"1px solid #1e1e1e",borderRadius:12,padding:"14px 16px",marginBottom:16}}>
                      <div style={{fontSize:11,color:"#ef4444",fontWeight:"bold",textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>🚧 Experience Gaps</div>
                      {jdResult.gaps.map((g,i)=><div key={i} style={{fontSize:13,color:"#888",marginBottom:5,paddingLeft:10}}>→ {g}</div>)}
                    </div>
                  )}
                  {jdResult.tips?.length>0&&(
                    <div style={{background:"#080d08",border:"1px solid #1a3a1a",borderRadius:12,padding:"14px 16px",marginBottom:16}}>
                      <div style={{fontSize:11,color:"#22c55e",fontWeight:"bold",textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>💡 Optimization Tips</div>
                      {jdResult.tips.map((t,i)=><div key={i} style={{fontSize:13,color:"#888",marginBottom:5,paddingLeft:10}}>→ {t}</div>)}
                    </div>
                  )}

                  <div style={{textAlign:"center",padding:"12px 0 4px",fontSize:12,color:"#333"}}>Apply changes above, then check Preview to see your tailored resume.</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════ ARRANGE ══════ */}
        {activeTab==="arrange"&&(
          <div style={{flex:1,display:"flex",gap:0,overflow:"hidden"}}>
            {/* Left: controls */}
            <div style={{width:320,display:"flex",flexDirection:"column",borderRight:"1px solid #1a1a1a",overflowY:"auto",background:"#0a0a0a"}}>
              <div style={{padding:"14px 16px",borderBottom:"1px solid #1a1a1a"}}>
                <div style={{fontSize:13,color:"#c9a84c",fontWeight:"bold",marginBottom:2}}>⇅ Section Arranger</div>
                <div style={{fontSize:11,color:"#555",lineHeight:1.6}}>Move rows up/down. Split a section to its own row, or merge it below as a parallel column.</div>
              </div>
              <div style={{padding:14,flex:1}}>
                {sectionLayout.map((row,rowIdx)=>(
                  <div key={rowIdx} style={{marginBottom:8}}>
                    <div style={{fontSize:10,color:"#444",marginBottom:4,letterSpacing:".08em"}}>ROW {rowIdx+1} {row.length>1?"(parallel columns)":""}</div>
                    <div style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:10,padding:10}}>
                      {/* Row order arrows */}
                      <div style={{display:"flex",justifyContent:"flex-end",gap:4,marginBottom:8}}>
                        <button className="row-ctrl" onClick={()=>moveRowUp(rowIdx)} disabled={rowIdx===0} style={{padding:"2px 8px",borderRadius:5,border:"1px solid #252525",background:"transparent",color:rowIdx===0?"#333":"#777",cursor:rowIdx===0?"default":"pointer",fontSize:12}}>↑ Up</button>
                        <button className="row-ctrl" onClick={()=>moveRowDown(rowIdx)} disabled={rowIdx===sectionLayout.length-1} style={{padding:"2px 8px",borderRadius:5,border:"1px solid #252525",background:"transparent",color:rowIdx===sectionLayout.length-1?"#333":"#777",cursor:rowIdx===sectionLayout.length-1?"default":"pointer",fontSize:12}}>↓ Down</button>
                      </div>
                      {row.map((secId,colIdx)=>{
                        const isCustom=secId.startsWith("custom_");
                        const cid=isCustom?parseInt(secId.replace("custom_","")):null;
                        const label=isCustom?(data.customSections.find(x=>x.id===cid)?.title||"Custom"):SECTION_META[secId]?.label||secId;
                        const icon=isCustom?"✏️":SECTION_META[secId]?.icon||"•";
                        return(
                          <div key={colIdx} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",background:"#1a1a1a",borderRadius:7,marginBottom:colIdx<row.length-1?6:0,border:"1px solid #252525"}}>
                            <span style={{fontSize:14}}>{icon}</span>
                            <span style={{flex:1,fontSize:13,color:"#c9a84c"}}>{label}</span>
                            <div style={{display:"flex",gap:4}}>
                              {row.length>1&&(
                                <button onClick={()=>splitRow(rowIdx,colIdx)} title="Split to own row" style={{fontSize:10,padding:"2px 7px",borderRadius:5,border:"1px solid #333",background:"transparent",color:"#666",cursor:"pointer"}}>⊡ Split</button>
                              )}
                              {rowIdx<sectionLayout.length-1&&(
                                <button onClick={()=>mergeRight(rowIdx,colIdx)} title="Merge into row below as parallel column" style={{fontSize:10,padding:"2px 7px",borderRadius:5,border:"1px solid #333",background:"transparent",color:"#666",cursor:"pointer"}}>⊞ Parallel↓</button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div style={{marginTop:16,padding:12,background:"#0d0d0d",borderRadius:8,border:"1px dashed #1e1e1e"}}>
                  <div style={{fontSize:11,color:"#444",lineHeight:1.7}}>
                    <strong style={{color:"#666"}}>Tips:</strong><br/>
                    • <strong style={{color:"#555"}}>↑ / ↓</strong> — reorder rows<br/>
                    • <strong style={{color:"#555"}}>⊞ Parallel↓</strong> — place section side-by-side with the row below<br/>
                    • <strong style={{color:"#555"}}>⊡ Split</strong> — move section to its own row<br/>
                    • Add sections from the Edit → Personal tab
                  </div>
                </div>
              </div>
            </div>
            {/* Right: live preview */}
            <div style={{flex:1,overflowY:"auto",background:"#1a1a1a",padding:"28px 16px"}}>
              <ResumeDoc data={data} T={T} skills={skills} layout={sectionLayout} enabledSections={enabledSections}/>
            </div>
          </div>
        )}

        {/* ══════ STYLE ══════ */}
        {activeTab==="style"&&(
          <div style={{flex:1,display:"flex",overflow:"hidden"}}>
            <div style={{width:300,display:"flex",flexDirection:"column",borderRight:"1px solid #1a1a1a",overflowY:"auto",background:"#0a0a0a"}}>
              <div style={{padding:"14px 16px",borderBottom:"1px solid #1a1a1a"}}>
                <div style={{fontSize:13,color:"#c9a84c",fontWeight:"bold",marginBottom:2}}>🎨 Style Editor</div>
                <div style={{fontSize:11,color:"#555"}}>Full control — colors, fonts, layout</div>
              </div>

              {/* Palettes */}
              <div style={{padding:"14px 16px",borderBottom:"1px solid #1a1a1a"}}>
                <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Preset Palettes</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                  {PRESET_PALETTES.map((p,i)=>(
                    <button key={i} className="palette-btn" onClick={()=>applyPalette(p)} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 8px",borderRadius:8,border:"1px solid #1e1e1e",background:"transparent",cursor:"pointer",transition:"all .15s",textAlign:"left"}}>
                      <div style={{display:"flex",gap:2,flexShrink:0}}>{[p.header,p.accent,p.bg].map((c,j)=><div key={j} style={{width:9,height:16,borderRadius:3,background:c,border:"1px solid #333"}}/>)}</div>
                      <span style={{fontSize:10,color:"#666",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color pickers */}
              <div style={{padding:"14px 16px",borderBottom:"1px solid #1a1a1a"}}>
                <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Custom Colors</div>
                {[["header","Header BG"],["accent","Accent"],["bg","Page BG"],["text","Body Text"],["border","Border"],["skillBg","Tag BG"]].map(([key,label])=>(
                  <div key={key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9}}>
                    <span style={{fontSize:12,color:"#666"}}>{label}</span>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:10,color:"#444",fontFamily:"monospace"}}>{T[key]||"#000000"}</span>
                      <input type="color" value={T[key]||"#000000"} onChange={e=>setStyle(key,e.target.value)} style={{width:26,height:26,border:"1px solid #333",borderRadius:6,cursor:"pointer",padding:2,background:"transparent"}}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fonts */}
              <div style={{padding:"14px 16px",borderBottom:"1px solid #1a1a1a"}}>
                <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Fonts</div>
                {[["headerFont","Heading Font"],["bodyFont","Body Font"]].map(([key,label])=>(
                  <div key={key} style={{marginBottom:12}}>
                    <label style={{...lbl,marginBottom:6}}>{label}</label>
                    <select value={T[key]} onChange={e=>setStyle(key,e.target.value)} style={{...inp,cursor:"pointer"}}>
                      {FONT_OPTIONS.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                    <div style={{marginTop:5,fontSize:15,color:"#555",fontFamily:T[key]}}>The quick brown fox</div>
                  </div>
                ))}
              </div>

              {/* Layout */}
              <div style={{padding:"14px 16px"}}>
                <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Header Layout</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                  {[["classic","Classic"],["sidebar","Sidebar"],["minimal","Minimal"],["tech","Terminal"],["editorial","Editorial"]].map(([l,label])=>(
                    <button key={l} className="layout-btn" onClick={()=>setStyle("layout",l)} style={{padding:"8px 6px",borderRadius:8,border:"1px solid",borderColor:T.layout===l?"#c9a84c":"#1e1e1e",background:T.layout===l?"#c9a84c11":"transparent",color:T.layout===l?"#c9a84c":"#555",fontSize:11,cursor:"pointer",transition:"all .15s"}}>{label}</button>
                  ))}
                </div>
                <button onClick={()=>setCustomStyle({})} style={{marginTop:12,width:"100%",padding:7,borderRadius:8,border:"1px dashed #2a2a2a",background:"transparent",color:"#444",cursor:"pointer",fontSize:11}}>↺ Reset to template defaults</button>
              </div>
            </div>

            {/* Live preview */}
            <div style={{flex:1,overflowY:"auto",background:"#1a1a1a",padding:"28px 16px"}}>
              <ResumeDoc data={data} T={T} skills={skills} layout={sectionLayout} enabledSections={enabledSections}/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FH({children}){
  return <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:"#c9a84c",marginBottom:16,paddingBottom:8,borderBottom:"1px solid #1a1a1a"}}>{children}</div>;
}

/* ════════════════════════════════════════════════════════
   RESUME DOCUMENT — renders sections in user-defined layout
════════════════════════════════════════════════════════ */
function ResumeDoc({data,T,skills,layout,enabledSections}){
  const isEmpty=!data.name&&!data.summary&&data.experience.every(e=>!e.company);
  return(
    <div id="resume-print" style={{maxWidth:700,margin:"0 auto"}}>
      {isEmpty
        ?<div style={{textAlign:"center",padding:"80px 20px",color:"#333"}}><div style={{fontSize:40,marginBottom:12}}>✦</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:"#444"}}>Fill in the Edit tab to see your live preview</div></div>
        :<ResumeShell data={data} T={T} skills={skills} layout={layout} enabledSections={enabledSections}/>
      }
    </div>
  );
}

function ResumeShell({data,T,skills,layout,enabledSections}){
  const renderSection=(secId)=>{
    if(!enabledSections.includes(secId)&&secId!=="summary"&&secId!=="experience"&&secId!=="education"&&secId!=="skills") return null;
    if(secId==="summary")        return <SummarySection key={secId} data={data} T={T}/>;
    if(secId==="experience")     return <ExpSection key={secId} data={data} T={T}/>;
    if(secId==="education")      return <EduSection key={secId} data={data} T={T}/>;
    if(secId==="skills")         return <SkillSection key={secId} skills={skills} T={T}/>;
    if(secId==="certifications") return <CertSection key={secId} data={data} T={T}/>;
    if(secId==="achievements")   return <AchSection key={secId} data={data} T={T}/>;
    if(secId==="projects")       return <ProjSection key={secId} data={data} T={T}/>;
    if(secId==="languages")      return <LangSection key={secId} data={data} T={T}/>;
    if(secId==="volunteer")      return <VolSection key={secId} data={data} T={T}/>;
    if(secId.startsWith("custom_")){
      const cid=parseInt(secId.replace("custom_",""));
      const sec=data.customSections.find(s=>s.id===cid);
      return sec?<CustomSection key={secId} sec={sec} T={T}/>:null;
    }
    return null;
  };

  // Header varies by layout
  const Header=()=>{
    if(T.layout==="sidebar") return(
      <div style={{display:"flex",minHeight:900,fontFamily:T.bodyFont,color:T.text}}>
        <div style={{width:220,background:T.header,padding:"36px 22px",color:T.header==="#ffffff"?T.text:"#eee",flexShrink:0}}>
          <div style={{fontFamily:T.headerFont,fontSize:20,fontWeight:700,marginBottom:4,lineHeight:1.3}}>{data.name||"Your Name"}</div>
          <div style={{fontSize:11,color:T.accent,letterSpacing:".1em",textTransform:"uppercase",marginBottom:22}}>{data.title}</div>
          <div style={{fontSize:11,lineHeight:1.9,color:T.header==="#ffffff"?"#555":"#bbb"}}>
            {data.email&&<div>✉ {data.email}</div>}{data.phone&&<div>☎ {data.phone}</div>}{data.location&&<div>◎ {data.location}</div>}{data.linkedin&&<div>in {data.linkedin}</div>}{data.website&&<div>🔗 {data.website}</div>}
          </div>
          {skills.length>0&&<><div style={{marginTop:24,fontSize:10,fontWeight:"bold",letterSpacing:".1em",textTransform:"uppercase",color:T.accent,marginBottom:10}}>Skills</div>{skills.map((s,i)=><div key={i} style={{fontSize:11,marginBottom:5,color:T.header==="#ffffff"?"#444":"#ddd"}}>• {s}</div>)}</>}
        </div>
        <div style={{flex:1,padding:"32px 30px",background:T.bg}}>
          {layout.map((row,ri)=>(
            <div key={ri} style={{display:"flex",gap:20,marginBottom:0}}>
              {row.map((secId,ci)=>(
                <div key={ci} style={{flex:1}}>{renderSection(secId)}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );

    const headerTextColor=T.layout==="minimal"||T.layout==="editorial"?T.text:(T.header==="#ffffff"?T.text:"#fff");
    const contactColor   =T.layout==="minimal"||T.layout==="editorial"?"#888":(T.header==="#ffffff"?"#666":"#aaa");

    return(
      <div style={{background:"#fff",fontFamily:T.bodyFont,color:T.text}}>
        {/* Header block */}
        {T.layout==="minimal"?(
          <div style={{padding:"48px 52px 24px",borderBottom:`2px solid ${T.accent}`}}>
            <div style={{fontFamily:T.headerFont,fontSize:34,fontWeight:700,marginBottom:4}}>{data.name||"Your Name"}</div>
            <div style={{fontSize:13,color:"#888",letterSpacing:".08em",marginBottom:14}}>{data.title}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"4px 20px",fontSize:12,color:"#aaa"}}>
              {data.email&&<span>{data.email}</span>}{data.phone&&<span>{data.phone}</span>}{data.location&&<span>{data.location}</span>}{data.linkedin&&<span>{data.linkedin}</span>}{data.website&&<span>{data.website}</span>}
            </div>
          </div>
        ):T.layout==="editorial"?(
          <div style={{background:T.header,borderBottom:`4px solid ${T.accent}`,padding:"40px 48px 28px"}}>
            <div style={{fontSize:10,letterSpacing:".3em",textTransform:"uppercase",color:T.accent,marginBottom:8}}>Curriculum Vitae</div>
            <div style={{fontFamily:T.headerFont,fontSize:38,fontWeight:700,marginBottom:6,color:T.text,lineHeight:1.1}}>{data.name||"Your Name"}</div>
            <div style={{fontSize:14,color:"#888",fontStyle:"italic",marginBottom:18}}>{data.title}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"4px 22px",fontSize:12,color:"#999"}}>{data.email&&<span>{data.email}</span>}{data.phone&&<span>{data.phone}</span>}{data.location&&<span>{data.location}</span>}{data.linkedin&&<span>{data.linkedin}</span>}{data.website&&<span>{data.website}</span>}</div>
          </div>
        ):T.layout==="tech"?(
          <div style={{background:T.header,borderBottom:`1px solid ${T.border}`,padding:"28px 36px"}}>
            <div style={{color:T.accent,fontSize:12,marginBottom:4}}>{"// "}{data.title||"professional_title"}</div>
            <div style={{fontFamily:T.headerFont,fontSize:28,fontWeight:600,marginBottom:12}}>{data.name||"Your Name"}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"4px 18px",fontSize:11,color:"#888"}}>{data.email&&<span>{data.email}</span>}{data.phone&&<span>{data.phone}</span>}{data.location&&<span>{data.location}</span>}{data.linkedin&&<span>{data.linkedin}</span>}{data.website&&<span>{data.website}</span>}</div>
          </div>
        ):(
          <div style={{background:T.header,color:headerTextColor,padding:"38px 44px 28px"}}>
            <div style={{fontFamily:T.headerFont,fontSize:30,fontWeight:700,marginBottom:4}}>{data.name||"Your Name"}</div>
            <div style={{fontSize:13,color:T.accent,letterSpacing:".13em",textTransform:"uppercase",marginBottom:18}}>{data.title||"Professional Title"}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px 20px",fontSize:12,color:contactColor}}>{data.email&&<span>✉ {data.email}</span>}{data.phone&&<span>☎ {data.phone}</span>}{data.location&&<span>◎ {data.location}</span>}{data.linkedin&&<span>in {data.linkedin}</span>}{data.website&&<span>🔗 {data.website}</span>}</div>
          </div>
        )}

        {/* Body — section rows */}
        <div style={{padding:T.layout==="minimal"?"28px 52px 48px":T.layout==="editorial"?"34px 48px":"28px 44px",background:T.bg}}>
          {layout.map((row,ri)=>(
            <div key={ri} style={{display:"flex",gap:24}}>
              {row.map((secId,ci)=>(
                <div key={ci} style={{flex:1,minWidth:0}}>{renderSection(secId)}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return(
    <div style={{boxShadow:"0 8px 40px rgba(0,0,0,0.3)"}}>
      <Header/>
    </div>
  );
}

/* ── Section renderers ── */
function RSection({title,T,children}){
  return(
    <div style={{marginBottom:22}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:T.accent,whiteSpace:"nowrap"}}>{title}</div>
        <div style={{flex:1,height:1,background:T.border||"#e0e0e0"}}/>
      </div>
      {children}
    </div>
  );
}

function SummarySection({data,T}){
  if(!data.summary.trim()) return null;
  return <RSection title="Summary" T={T}><p style={{margin:0,fontSize:13.5,lineHeight:1.8,color:"#444"}}>{data.summary}</p></RSection>;
}

function ExpSection({data,T}){
  const exps=data.experience.filter(e=>e.company||e.role);
  if(!exps.length) return null;
  return(
    <RSection title="Experience" T={T}>
      {exps.map((exp,i)=>(
        <div key={exp.id} style={{marginBottom:i<exps.length-1?18:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:2}}>
            <div style={{fontWeight:700,fontSize:14}}>{exp.role}</div>
            <div style={{fontSize:11,color:"#999",whiteSpace:"nowrap"}}>{exp.period}</div>
          </div>
          <div style={{fontSize:12.5,color:T.accent,marginBottom:6,fontStyle:"italic"}}>{exp.company}</div>
          <ul style={{margin:0,paddingLeft:16}}>{exp.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} style={{fontSize:13,lineHeight:1.7,color:"#555",marginBottom:2}}>{b}</li>)}</ul>
        </div>
      ))}
    </RSection>
  );
}

function EduSection({data,T}){
  const edus=data.education.filter(e=>e.institution||e.degree);
  if(!edus.length) return null;
  return(
    <RSection title="Education" T={T}>
      {edus.map(edu=>(
        <div key={edu.id} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
          <div><div style={{fontWeight:700,fontSize:14}}>{edu.degree}</div><div style={{fontSize:13,color:"#888",fontStyle:"italic"}}>{edu.institution}</div></div>
          <div style={{fontSize:11,color:"#999"}}>{edu.year}</div>
        </div>
      ))}
    </RSection>
  );
}

function SkillSection({skills,T}){
  if(!skills.length) return null;
  return(
    <RSection title="Skills" T={T}>
      <div style={{display:"flex",flexWrap:"wrap",gap:7}}>{skills.map((s,i)=><span key={i} style={{fontSize:12,padding:"4px 13px",background:T.skillBg,border:`1px solid ${T.border||"#ddd"}`,borderRadius:20,color:T.text}}>{s}</span>)}</div>
    </RSection>
  );
}

function CertSection({data,T}){
  const certs=data.certifications.filter(c=>c.name);
  if(!certs.length) return null;
  return(
    <RSection title="Certifications" T={T}>
      {certs.map(c=>(
        <div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:7}}>
          <div><div style={{fontWeight:700,fontSize:13}}>{c.name}</div>{c.issuer&&<div style={{fontSize:12,color:"#888",fontStyle:"italic"}}>{c.issuer}</div>}</div>
          {c.year&&<div style={{fontSize:11,color:"#999",whiteSpace:"nowrap"}}>{c.year}</div>}
        </div>
      ))}
    </RSection>
  );
}

function AchSection({data,T}){
  const achs=data.achievements.filter(a=>a.text);
  if(!achs.length) return null;
  return(
    <RSection title="Achievements" T={T}>
      <ul style={{margin:0,paddingLeft:16}}>{achs.map(a=><li key={a.id} style={{fontSize:13,lineHeight:1.7,color:"#555",marginBottom:4}}>{a.text}</li>)}</ul>
    </RSection>
  );
}

function ProjSection({data,T}){
  const projs=data.projects.filter(p=>p.name);
  if(!projs.length) return null;
  return(
    <RSection title="Projects" T={T}>
      {projs.map(p=>(
        <div key={p.id} style={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
            <div style={{fontWeight:700,fontSize:13,color:T.text}}>{p.name}</div>
            {p.link&&<div style={{fontSize:11,color:T.accent}}>{p.link}</div>}
          </div>
          {p.desc&&<div style={{fontSize:12.5,color:"#666",marginTop:2,lineHeight:1.6}}>{p.desc}</div>}
        </div>
      ))}
    </RSection>
  );
}

function LangSection({data,T}){
  const langs=data.languages.filter(l=>l.language);
  if(!langs.length) return null;
  return(
    <RSection title="Languages" T={T}>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{langs.map(l=><span key={l.id} style={{fontSize:12,padding:"4px 12px",background:T.skillBg,border:`1px solid ${T.border||"#ddd"}`,borderRadius:20,color:T.text}}>{l.language}{l.level?` · ${l.level}`:""}</span>)}</div>
    </RSection>
  );
}

function VolSection({data,T}){
  const vols=data.volunteer.filter(v=>v.org||v.role);
  if(!vols.length) return null;
  return(
    <RSection title="Volunteer" T={T}>
      {vols.map(v=>(
        <div key={v.id} style={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
            <div style={{fontWeight:700,fontSize:13}}>{v.role}</div>
            <div style={{fontSize:11,color:"#999"}}>{v.period}</div>
          </div>
          <div style={{fontSize:12.5,color:T.accent,fontStyle:"italic"}}>{v.org}</div>
          {v.desc&&<div style={{fontSize:12,color:"#666",marginTop:2}}>{v.desc}</div>}
        </div>
      ))}
    </RSection>
  );
}

function CustomSection({sec,T}){
  const items=sec.items.filter(i=>i.trim());
  if(!items.length) return null;
  return(
    <RSection title={sec.title||"Custom"} T={T}>
      <ul style={{margin:0,paddingLeft:16}}>{items.map((item,i)=><li key={i} style={{fontSize:13,lineHeight:1.7,color:"#555",marginBottom:3}}>{item}</li>)}</ul>
    </RSection>
  );
}
