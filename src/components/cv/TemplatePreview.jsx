// src/components/cv/TemplatePreview.jsx
const PREVIEWS = {
  'modern-tech': (
    <svg viewBox="0 0 160 210" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="48" height="210" fill="#1e40af" />
      <circle cx="24" cy="32" r="16" fill="#3b82f6" />
      <circle cx="24" cy="27" r="6"  fill="#93c5fd" />
      <path d="M10 46 Q24 38 38 46" fill="#93c5fd" />
      <rect x="8" y="56" width="32" height="3" rx="1.5" fill="#93c5fd" opacity="0.8" />
      <rect x="8" y="63" width="28" height="2" rx="1"   fill="#bfdbfe" opacity="0.6" />
      <rect x="8" y="68" width="30" height="2" rx="1"   fill="#bfdbfe" opacity="0.6" />
      <rect x="8" y="80" width="32" height="3" rx="1.5" fill="#93c5fd" opacity="0.8" />
      <rect x="8" y="87" width="26" height="2" rx="1"   fill="#bfdbfe" opacity="0.6" />
      <rect x="8" y="92" width="30" height="2" rx="1"   fill="#bfdbfe" opacity="0.6" />
      <rect x="8" y="104" width="20" height="4" rx="2"  fill="#60a5fa" opacity="0.7" />
      <rect x="8" y="112" width="32" height="2" rx="1"  fill="#bfdbfe" opacity="0.5" />
      <rect x="8" y="117" width="24" height="2" rx="1"  fill="#bfdbfe" opacity="0.5" />
      <rect x="8" y="130" width="20" height="4" rx="2"  fill="#60a5fa" opacity="0.7" />
      <rect x="8" y="138" width="30" height="2" rx="1"  fill="#bfdbfe" opacity="0.5" />
      <rect x="56" y="16" width="88" height="6"   rx="3"    fill="#1e293b" />
      <rect x="56" y="26" width="60" height="3"   rx="1.5"  fill="#3b82f6" />
      <rect x="56" y="34" width="80" height="2"   rx="1"    fill="#94a3b8" />
      <line x1="56" y1="44" x2="148" y2="44" stroke="#e2e8f0" strokeWidth="0.5" />
      <rect x="56" y="50" width="40" height="3"   rx="1.5"  fill="#1e40af" />
      <rect x="56" y="59" width="85" height="2.5" rx="1.25" fill="#1e293b" />
      <rect x="56" y="65" width="55" height="2"   rx="1"    fill="#64748b" />
      <rect x="56" y="71" width="80" height="1.5" rx="0.75" fill="#94a3b8" />
      <rect x="56" y="75" width="70" height="1.5" rx="0.75" fill="#94a3b8" />
      <rect x="56" y="85" width="40" height="3"   rx="1.5"  fill="#1e40af" />
      <rect x="56" y="93" width="85" height="2.5" rx="1.25" fill="#1e293b" />
      <rect x="56" y="99" width="55" height="2"   rx="1"    fill="#64748b" />
      <rect x="56" y="105" width="80" height="1.5" rx="0.75" fill="#94a3b8" />
      <rect x="56"  y="118" width="28" height="5" rx="2.5" fill="#dbeafe" />
      <rect x="88"  y="118" width="22" height="5" rx="2.5" fill="#dbeafe" />
      <rect x="114" y="118" width="30" height="5" rx="2.5" fill="#dbeafe" />
    </svg>
  ),
  corporate: (
    <svg viewBox="0 0 160 210" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="160" height="210" fill="#fff" />
      <rect width="160" height="52" fill="#1e293b" />
      <rect x="12" y="12" width="70" height="6" rx="2"   fill="#f8fafc" />
      <rect x="12" y="22" width="45" height="3" rx="1.5" fill="#94a3b8" />
      <rect x="12" y="29" width="60" height="2" rx="1"   fill="#64748b" />
      <rect x="100" y="14" width="48" height="2" rx="1"  fill="#64748b" />
      <rect x="100" y="19" width="40" height="2" rx="1"  fill="#64748b" />
      <rect x="0"  y="52" width="160" height="3" fill="#b45309" />
      <rect x="12" y="62" width="50" height="3"   rx="1.5"  fill="#1e293b" />
      <line x1="12" y1="68" x2="148" y2="68" stroke="#e2e8f0" strokeWidth="0.5" />
      <rect x="12" y="73" width="80" height="2.5" rx="1.25" fill="#1e293b" />
      <rect x="12" y="78" width="45" height="2"   rx="1"    fill="#b45309" />
      <rect x="12" y="84" width="130" height="1.5" rx="0.75" fill="#94a3b8" />
      <rect x="12" y="88" width="115" height="1.5" rx="0.75" fill="#94a3b8" />
      <rect x="12" y="97" width="75" height="2.5" rx="1.25" fill="#1e293b" />
      <rect x="12" y="102" width="40" height="2"  rx="1"    fill="#b45309" />
      <rect x="12" y="108" width="120" height="1.5" rx="0.75" fill="#94a3b8" />
      <rect x="12" y="120" width="40" height="3"   rx="1.5"  fill="#1e293b" />
      <line x1="12" y1="126" x2="148" y2="126" stroke="#e2e8f0" strokeWidth="0.5" />
      <rect x="12" y="131" width="90" height="2.5" rx="1.25" fill="#1e293b" />
      <rect x="12" y="137" width="60" height="2"   rx="1"    fill="#64748b" />
      <rect x="12"  y="150" width="34" height="5" rx="2" fill="#f1f5f9" />
      <rect x="50"  y="150" width="28" height="5" rx="2" fill="#f1f5f9" />
      <rect x="82"  y="150" width="40" height="5" rx="2" fill="#f1f5f9" />
    </svg>
  ),
  minimal: (
    <svg viewBox="0 0 160 210" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="160" height="210" fill="#fafafa" />
      <rect x="30" y="18" width="100" height="7"  rx="3.5"  fill="#0f172a" />
      <rect x="50" y="29" width="60"  height="3"  rx="1.5"  fill="#94a3b8" />
      <line x1="60" y1="38" x2="100" y2="38" stroke="#cbd5e1" strokeWidth="0.75" />
      <rect x="20"  y="44" width="36" height="2" rx="1" fill="#94a3b8" />
      <rect x="62"  y="44" width="36" height="2" rx="1" fill="#94a3b8" />
      <rect x="104" y="44" width="36" height="2" rx="1" fill="#94a3b8" />
      <rect x="12" y="56" width="30" height="2.5" rx="1.25" fill="#0f172a" />
      <line x1="12" y1="62" x2="148" y2="62" stroke="#0f172a" strokeWidth="0.75" />
      <rect x="12" y="67" width="100" height="2.5" rx="1.25" fill="#334155" />
      <rect x="12" y="73" width="130" height="1.5" rx="0.75" fill="#cbd5e1" />
      <rect x="12" y="77" width="115" height="1.5" rx="0.75" fill="#cbd5e1" />
      <rect x="12" y="89"  width="40"  height="2.5" rx="1.25" fill="#0f172a" />
      <line x1="12" y1="95" x2="148" y2="95" stroke="#0f172a" strokeWidth="0.75" />
      <rect x="12" y="100" width="90"  height="2.5" rx="1.25" fill="#334155" />
      <rect x="12" y="106" width="55"  height="2"   rx="1"    fill="#94a3b8" />
      <rect x="12" y="112" width="130" height="1.5" rx="0.75" fill="#cbd5e1" />
      <rect x="12" y="116" width="100" height="1.5" rx="0.75" fill="#cbd5e1" />
      <rect x="12" y="128" width="32"  height="2.5" rx="1.25" fill="#0f172a" />
      <line x1="12" y1="134" x2="148" y2="134" stroke="#0f172a" strokeWidth="0.75" />
      <rect x="12" y="139" width="80"  height="2.5" rx="1.25" fill="#334155" />
      <rect x="12" y="145" width="55"  height="2"   rx="1"    fill="#94a3b8" />
    </svg>
  ),
  creative: (
    <svg viewBox="0 0 160 210" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="160" height="210" fill="#0f172a" />
      <rect width="160" height="4" fill="#f59e0b" />
      <rect x="12" y="14" width="80" height="7" rx="2"   fill="#f8fafc" />
      <rect x="12" y="25" width="55" height="3" rx="1.5" fill="#f59e0b" />
      <line x1="12" y1="36" x2="148" y2="36" stroke="#1e293b" strokeWidth="1" />
      <line x1="85" y1="42" x2="85" y2="200" stroke="#1e293b" strokeWidth="1" />
      <rect x="12" y="44" width="32" height="2.5" rx="1.25" fill="#f59e0b" />
      <rect x="12" y="51" width="62" height="2"   rx="1"    fill="#334155" />
      <rect x="12" y="51" width="48" height="2"   rx="1"    fill="#f59e0b" opacity="0.8" />
      <rect x="12" y="56" width="62" height="2"   rx="1"    fill="#334155" />
      <rect x="12" y="56" width="38" height="2"   rx="1"    fill="#f59e0b" opacity="0.6" />
      <rect x="12" y="61" width="62" height="2"   rx="1"    fill="#334155" />
      <rect x="12" y="61" width="55" height="2"   rx="1"    fill="#f59e0b" opacity="0.9" />
      <rect x="12" y="74" width="32" height="2.5" rx="1.25" fill="#f59e0b" />
      <rect x="12" y="81" width="62" height="2"   rx="1"    fill="#334155" />
      <rect x="12" y="81" width="58" height="2"   rx="1"    fill="#f59e0b" opacity="0.85" />
      <rect x="12" y="86" width="62" height="2"   rx="1"    fill="#334155" />
      <rect x="12" y="86" width="40" height="2"   rx="1"    fill="#f59e0b" opacity="0.65" />
      <rect x="92" y="44"  width="40" height="2.5" rx="1.25" fill="#f59e0b" />
      <rect x="92" y="52"  width="4"  height="4"   rx="1"    fill="#f59e0b" />
      <rect x="100" y="52" width="55" height="2.5" rx="1.25" fill="#e2e8f0" />
      <rect x="100" y="58" width="40" height="2"   rx="1"    fill="#64748b" />
      <rect x="100" y="63" width="58" height="1.5" rx="0.75" fill="#334155" />
      <rect x="92" y="76"  width="4"  height="4"   rx="1"    fill="#f59e0b" />
      <rect x="100" y="76" width="50" height="2.5" rx="1.25" fill="#e2e8f0" />
      <rect x="100" y="82" width="38" height="2"   rx="1"    fill="#64748b" />
      <rect x="92" y="102" width="40" height="2.5" rx="1.25" fill="#f59e0b" />
      <rect x="92" y="110" width="4"  height="4"   rx="1"    fill="#f59e0b" />
      <rect x="100" y="110" width="55" height="2.5" rx="1.25" fill="#e2e8f0" />
      <rect x="100" y="116" width="45" height="2"   rx="1"    fill="#64748b" />
    </svg>
  ),
}

export function TemplatePreview({ id }) {
  return PREVIEWS[id] ?? null
}
