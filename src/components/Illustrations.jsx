// Ilustraciones SVG inline estilo flat/comunitario

export function HomeIllustration() {
  return (
    <svg viewBox="0 0 360 160" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto">
      {/* Cielo */}
      <rect width="360" height="160" fill="none"/>
      {/* Nubes */}
      <ellipse cx="60" cy="30" rx="28" ry="14" fill="white" opacity="0.6"/>
      <ellipse cx="80" cy="26" rx="22" ry="12" fill="white" opacity="0.6"/>
      <ellipse cx="290" cy="35" rx="24" ry="12" fill="white" opacity="0.5"/>
      <ellipse cx="310" cy="30" rx="18" ry="10" fill="white" opacity="0.5"/>

      {/* Casa */}
      <polygon points="155,55 200,25 245,55" fill="#1565C0" opacity="0.9"/>
      <rect x="165" y="55" width="70" height="55" fill="#1976D2"/>
      <rect x="190" y="80" width="20" height="30" fill="#0D47A1" rx="3"/>
      <rect x="170" y="62" width="18" height="16" fill="#90CAF9" rx="2"/>
      <rect x="212" y="62" width="18" height="16" fill="#90CAF9" rx="2"/>

      {/* Trabajador electricista (izquierda) */}
      <circle cx="90" cy="65" r="14" fill="#FFB74D"/>
      <rect x="76" y="79" width="28" height="36" fill="#1565C0" rx="4"/>
      <rect x="70" y="82" width="10" height="22" fill="#1565C0" rx="3"/>
      <rect x="104" y="82" width="10" height="22" fill="#1565C0" rx="3"/>
      <rect x="79" y="115" width="11" height="20" fill="#424242" rx="3"/>
      <rect x="94" y="115" width="11" height="20" fill="#424242" rx="3"/>
      {/* Rayo electricista */}
      <polygon points="112,60 106,72 111,72 105,84 116,68 111,68" fill="#FFD54F"/>
      {/* Casco */}
      <ellipse cx="90" cy="56" rx="15" ry="9" fill="#FFD54F"/>

      {/* Trabajadora jardinera (derecha) */}
      <circle cx="270" cy="65" r="14" fill="#FFCC80"/>
      <rect x="256" y="79" width="28" height="36" fill="#43A047" rx="4"/>
      <rect x="250" y="82" width="10" height="22" fill="#43A047" rx="3"/>
      <rect x="284" y="82" width="10" height="22" fill="#43A047" rx="3"/>
      <rect x="259" y="115" width="11" height="20" fill="#424242" rx="3"/>
      <rect x="274" y="115" width="11" height="20" fill="#424242" rx="3"/>
      {/* Planta */}
      <rect x="290" y="95" width="6" height="20" fill="#5D4037" rx="2"/>
      <ellipse cx="293" cy="88" rx="12" ry="10" fill="#43A047"/>
      <ellipse cx="285" cy="93" rx="9" ry="8" fill="#2E7D32"/>
      {/* Sombrero jardinera */}
      <ellipse cx="270" cy="57" rx="18" ry="7" fill="#8D6E63"/>
      <rect x="262" y="51" width="16" height="8" fill="#795548" rx="3"/>

      {/* Vecino adulto mayor (centro frente a casa) */}
      <circle cx="200" cy="95" r="11" fill="#FFCC80"/>
      <rect x="190" y="106" width="20" height="28" fill="#9E9E9E" rx="3"/>
      <rect x="185" y="109" width="8" height="18" fill="#9E9E9E" rx="3"/>
      <rect x="207" y="109" width="8" height="18" fill="#9E9E9E" rx="3"/>
      {/* Bastón */}
      <rect x="215" y="118" width="3" height="22" fill="#795548" rx="1"/>
      <ellipse cx="216" cy="118" rx="5" ry="3" fill="#795548"/>
      {/* Pelo canoso */}
      <ellipse cx="200" cy="89" rx="11" ry="7" fill="#E0E0E0"/>

      {/* Pasto */}
      <rect x="0" y="135" width="360" height="25" fill="#43A047" opacity="0.4" rx="4"/>
      <ellipse cx="90" cy="135" rx="30" ry="8" fill="#43A047" opacity="0.3"/>
      <ellipse cx="270" cy="135" rx="30" ry="8" fill="#43A047" opacity="0.3"/>
    </svg>
  )
}

export function WorkersIllustration() {
  return (
    <svg viewBox="0 0 360 130" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto">
      <rect width="360" height="130" fill="none"/>
      {/* Nubes */}
      <ellipse cx="50" cy="25" rx="25" ry="12" fill="white" opacity="0.5"/>
      <ellipse cx="300" cy="20" rx="22" ry="11" fill="white" opacity="0.5"/>

      {/* Trabajador 1 - Plomero */}
      <circle cx="70" cy="50" r="13" fill="#FFB74D"/>
      <ellipse cx="70" cy="42" rx="13" ry="8" fill="#1565C0"/>
      <rect x="57" y="63" width="26" height="32" fill="#1565C0" rx="4"/>
      <rect x="51" y="66" width="9" height="20" fill="#1565C0" rx="3"/>
      <rect x="76" y="66" width="9" height="20" fill="#1565C0" rx="3"/>
      <rect x="60" y="95" width="10" height="18" fill="#37474F" rx="3"/>
      <rect x="74" y="95" width="10" height="18" fill="#37474F" rx="3"/>
      {/* Llave inglesa */}
      <rect x="82" y="58" width="18" height="5" fill="#9E9E9E" rx="2"/>
      <ellipse cx="82" cy="60" rx="5" ry="5" fill="#9E9E9E"/>

      {/* Trabajador 2 - Electricista (centro-izq) */}
      <circle cx="145" cy="48" r="13" fill="#FFCC80"/>
      <ellipse cx="145" cy="40" rx="14" ry="9" fill="#FFD54F"/>
      <rect x="132" y="61" width="26" height="32" fill="#F57F17" rx="4"/>
      <rect x="126" y="64" width="9" height="20" fill="#F57F17" rx="3"/>
      <rect x="151" y="64" width="9" height="20" fill="#F57F17" rx="3"/>
      <rect x="135" y="93" width="10" height="18" fill="#37474F" rx="3"/>
      <rect x="149" y="93" width="10" height="18" fill="#37474F" rx="3"/>
      {/* Rayo */}
      <polygon points="160,44 154,56 159,56 153,68 164,52 159,52" fill="#FFD54F"/>

      {/* Trabajadora 3 - Limpieza (centro) */}
      <circle cx="220" cy="48" r="13" fill="#FFAB91"/>
      <rect x="207" y="61" width="26" height="32" fill="#00897B" rx="4"/>
      <rect x="201" y="64" width="9" height="20" fill="#00897B" rx="3"/>
      <rect x="226" y="64" width="9" height="20" fill="#00897B" rx="3"/>
      <rect x="210" y="93" width="10" height="18" fill="#37474F" rx="3"/>
      <rect x="224" y="93" width="10" height="18" fill="#37474F" rx="3"/>
      {/* Escoba */}
      <rect x="232" y="45" width="3" height="40" fill="#8D6E63" rx="1"/>
      <ellipse cx="238" cy="83" rx="10" ry="5" fill="#8D6E63" opacity="0.7"/>
      {/* Pelo */}
      <ellipse cx="220" cy="40" rx="13" ry="9" fill="#6D4C41"/>

      {/* Trabajador 4 - Carpintero */}
      <circle cx="295" cy="50" r="13" fill="#FFB74D"/>
      <ellipse cx="295" cy="42" rx="13" ry="8" fill="#5D4037"/>
      <rect x="282" y="63" width="26" height="32" fill="#5D4037" rx="4"/>
      <rect x="276" y="66" width="9" height="20" fill="#5D4037" rx="3"/>
      <rect x="301" y="66" width="9" height="20" fill="#5D4037" rx="3"/>
      <rect x="285" y="95" width="10" height="18" fill="#37474F" rx="3"/>
      <rect x="299" y="95" width="10" height="18" fill="#37474F" rx="3"/>
      {/* Martillo */}
      <rect x="307" y="58" width="5" height="20" fill="#9E9E9E" rx="2"/>
      <rect x="303" y="56" width="13" height="8" fill="#9E9E9E" rx="2"/>

      {/* Pasto */}
      <rect x="0" y="113" width="360" height="17" fill="#43A047" opacity="0.35" rx="4"/>
    </svg>
  )
}

export function RegisterIllustration() {
  return (
    <svg viewBox="0 0 360 120" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto">
      <rect width="360" height="120" fill="none"/>
      {/* Nube */}
      <ellipse cx="60" cy="22" rx="26" ry="12" fill="white" opacity="0.5"/>
      <ellipse cx="300" cy="25" rx="22" ry="11" fill="white" opacity="0.5"/>

      {/* Trabajador con planilla */}
      <circle cx="130" cy="45" r="16" fill="#FFB74D"/>
      <ellipse cx="130" cy="35" rx="16" ry="10" fill="#1565C0"/>
      <rect x="114" y="61" width="32" height="40" fill="#1565C0" rx="5"/>
      <rect x="107" y="65" width="11" height="25" fill="#1565C0" rx="4"/>
      <rect x="139" y="65" width="11" height="25" fill="#1565C0" rx="4"/>
      <rect x="117" y="101" width="12" height="19" fill="#37474F" rx="3"/>
      <rect x="131" y="101" width="12" height="19" fill="#37474F" rx="3"/>

      {/* Planilla/clipboard */}
      <rect x="148" y="55" width="50" height="62" fill="white" rx="5" opacity="0.95"/>
      <rect x="162" y="50" width="22" height="10" fill="#1565C0" rx="3"/>
      <rect x="154" y="68" width="38" height="4" fill="#E3F2FD" rx="2"/>
      <rect x="154" y="76" width="38" height="4" fill="#E3F2FD" rx="2"/>
      <rect x="154" y="84" width="30" height="4" fill="#E3F2FD" rx="2"/>
      <rect x="154" y="92" width="38" height="4" fill="#E3F2FD" rx="2"/>
      <rect x="154" y="100" width="24" height="4" fill="#E3F2FD" rx="2"/>
      {/* Lapicera */}
      <rect x="195" y="88" width="5" height="28" fill="#FFD54F" rx="2" transform="rotate(-20 195 88)"/>
      <polygon points="191,112 196,110 193,116" fill="#37474F"/>

      {/* Vecina sonriente (derecha) */}
      <circle cx="255" cy="48" r="15" fill="#FFCC80"/>
      <ellipse cx="255" cy="39" rx="15" ry="10" fill="#6D4C41"/>
      <rect x="241" y="63" width="28" height="37" fill="#E91E63" rx="5"/>
      <rect x="235" y="67" width="10" height="22" fill="#E91E63" rx="4"/>
      <rect x="263" y="67" width="10" height="22" fill="#E91E63" rx="4"/>
      <rect x="244" y="100" width="11" height="18" fill="#37474F" rx="3"/>
      <rect x="258" y="100" width="11" height="18" fill="#37474F" rx="3"/>
      {/* Estrella de aprobación */}
      <circle cx="278" cy="45" r="14" fill="#FFD54F"/>
      <text x="278" y="50" textAnchor="middle" fontSize="14" fill="#F57F17">✓</text>

      {/* Pasto */}
      <rect x="0" y="110" width="360" height="10" fill="#43A047" opacity="0.35" rx="3"/>
    </svg>
  )
}

export function RatingIllustration() {
  return (
    <svg viewBox="0 0 360 120" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto">
      <rect width="360" height="120" fill="none"/>
      {/* Estrellas grandes decorativas */}
      <text x="60" y="65" fontSize="40" fill="#FFD54F" opacity="0.8">★</text>
      <text x="108" y="55" fontSize="52" fill="#FFD54F">★</text>
      <text x="165" y="48" fontSize="60" fill="#FFD54F">★</text>
      <text x="228" y="55" fontSize="52" fill="#FFD54F">★</text>
      <text x="285" y="65" fontSize="40" fill="#FFD54F" opacity="0.8">★</text>

      {/* Vecina calificando */}
      <circle cx="120" cy="88" r="13" fill="#FFCC80"/>
      <ellipse cx="120" cy="80" rx="13" ry="8" fill="#6D4C41"/>
      <rect x="108" y="101" width="24" height="19" fill="#9C27B0" rx="4"/>

      {/* Trabajador recibiendo */}
      <circle cx="240" cy="88" r="13" fill="#FFB74D"/>
      <ellipse cx="240" cy="80" rx="13" ry="8" fill="#1565C0"/>
      <rect x="228" y="101" width="24" height="19" fill="#1565C0" rx="4"/>

      {/* Flecha entre ellos */}
      <line x1="145" y1="88" x2="215" y2="88" stroke="#FFD54F" strokeWidth="3" strokeDasharray="6,3"/>
      <polygon points="215,84 225,88 215,92" fill="#FFD54F"/>

      {/* Burbuja con estrellas */}
      <rect x="155" y="70" width="50" height="24" fill="white" rx="8" opacity="0.9"/>
      <text x="180" y="87" textAnchor="middle" fontSize="14" fill="#FFB300">★★★★★</text>
    </svg>
  )
}

export function ServiceIllustration() {
  return (
    <svg viewBox="0 0 360 120" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto">
      <rect width="360" height="120" fill="none"/>
      {/* Nube */}
      <ellipse cx="80" cy="22" rx="28" ry="13" fill="white" opacity="0.5"/>

      {/* Casa con problema */}
      <polygon points="180,20 230,50 130,50" fill="#1565C0" opacity="0.85"/>
      <rect x="140" y="50" width="80" height="55" fill="#1976D2"/>
      <rect x="165" y="75" width="20" height="30" fill="#0D47A1" rx="2"/>
      <rect x="145" y="57" width="16" height="14" fill="#90CAF9" rx="2"/>
      <rect x="199" y="57" width="16" height="14" fill="#90CAF9" rx="2"/>
      {/* Signo de problema */}
      <circle cx="215" cy="45" r="14" fill="#F44336"/>
      <text x="215" y="51" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold">!</text>

      {/* Vecino llamando */}
      <circle cx="80" cy="65" r="13" fill="#FFCC80"/>
      <ellipse cx="80" cy="57" rx="13" ry="8" fill="#5D4037"/>
      <rect x="68" y="78" width="24" height="32" fill="#607D8B" rx="4"/>
      <rect x="62" y="81" width="9" height="20" fill="#607D8B" rx="3"/>
      <rect x="87" y="81" width="9" height="20" fill="#607D8B" rx="3"/>
      {/* Teléfono */}
      <rect x="56" y="75" width="10" height="18" fill="#37474F" rx="3"/>
      <circle cx="61" cy="76" r="2" fill="#90CAF9"/>

      {/* Trabajador yendo */}
      <circle cx="295" cy="65" r="13" fill="#FFB74D"/>
      <ellipse cx="295" cy="57" rx="14" ry="9" fill="#FFD54F"/>
      <rect x="282" y="78" width="26" height="32" fill="#1565C0" rx="4"/>
      <rect x="276" y="81" width="9" height="20" fill="#1565C0" rx="3"/>
      <rect x="301" y="81" width="9" height="20" fill="#1565C0" rx="3"/>
      {/* Caja de herramientas */}
      <rect x="305" y="88" width="22" height="16" fill="#9E9E9E" rx="3"/>
      <rect x="309" y="85" width="14" height="6" fill="#9E9E9E" rx="2"/>

      {/* Flecha de whatsapp */}
      <line x1="100" y1="75" x2="130" y2="75" stroke="#25D366" strokeWidth="3"/>
      <polygon points="130,71 140,75 130,79" fill="#25D366"/>

      {/* Pasto */}
      <rect x="0" y="108" width="360" height="12" fill="#43A047" opacity="0.35" rx="3"/>
    </svg>
  )
}

export function AdminIllustration() {
  return (
    <svg viewBox="0 0 360 120" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto">
      <rect width="360" height="120" fill="none"/>

      {/* Monitor/pantalla */}
      <rect x="120" y="20" width="130" height="80" fill="white" rx="8" opacity="0.95"/>
      <rect x="128" y="28" width="114" height="60" fill="#E3F2FD" rx="4"/>
      {/* Gráficos en pantalla */}
      <rect x="135" y="65" width="10" height="18" fill="#1565C0" rx="2"/>
      <rect x="150" y="55" width="10" height="28" fill="#43A047" rx="2"/>
      <rect x="165" y="48" width="10" height="35" fill="#1565C0" rx="2"/>
      <rect x="180" y="58" width="10" height="25" fill="#43A047" rx="2"/>
      <rect x="195" y="44" width="10" height="39" fill="#F57F17" rx="2"/>
      <rect x="210" y="52" width="10" height="31" fill="#1565C0" rx="2"/>
      {/* Líneas de tabla */}
      <rect x="135" y="33" width="100" height="6" fill="#BBDEFB" rx="2"/>
      <rect x="135" y="42" width="70" height="4" fill="#E3F2FD" rx="2"/>
      {/* Base monitor */}
      <rect x="172" y="100" width="26" height="8" fill="#BDBDBD" rx="2"/>
      <rect x="162" y="106" width="46" height="5" fill="#9E9E9E" rx="2"/>

      {/* Admin persona izquierda */}
      <circle cx="85" cy="55" r="15" fill="#FFCC80"/>
      <ellipse cx="85" cy="45" rx="15" ry="9" fill="#1A237E"/>
      <rect x="71" y="70" width="28" height="35" fill="#283593" rx="5"/>
      <rect x="65" y="74" width="10" height="22" fill="#283593" rx="4"/>
      <rect x="95" y="74" width="10" height="22" fill="#283593" rx="4"/>
      {/* Tablet en mano */}
      <rect x="96" y="68" width="18" height="24" fill="white" rx="3"/>
      <rect x="98" y="70" width="14" height="18" fill="#90CAF9" rx="2"/>

      {/* Vecina derecha */}
      <circle cx="275" cy="58" r="14" fill="#FFAB91"/>
      <ellipse cx="275" cy="49" rx="14" ry="9" fill="#AD1457"/>
      <rect x="262" y="72" width="26" height="33" fill="#C2185B" rx="5"/>
      <rect x="256" y="76" width="9" height="20" fill="#C2185B" rx="4"/>
      <rect x="282" y="76" width="9" height="20" fill="#C2185B" rx="4"/>
      {/* Check de aprobación */}
      <circle cx="258" cy="62" r="12" fill="#43A047"/>
      <text x="258" y="67" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">✓</text>
    </svg>
  )
}
