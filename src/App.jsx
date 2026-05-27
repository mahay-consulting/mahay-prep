import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0F0F1A",
  card: "#1A1A2E",
  accent: "#FFD700",
  accent2: "#FF6B35",
  accent3: "#00D9A3",
  text: "#F0F0FF",
  muted: "#8888AA",
  border: "#2A2A4A",
};

const stages = [
  { id: "cv", icon: "📄", label: "Ton CV", color: "#FFD700", points: 100 },
  { id: "candidature", icon: "✉️", label: "Candidater", color: "#FF6B35", points: 150 },
  { id: "entretien", icon: "🎤", label: "L'entretien", color: "#00D9A3", points: 200 },
  { id: "reseaux", icon: "🌐", label: "Réseaux", color: "#FF6B35", points: 120 },
  { id: "salaire", icon: "💰", label: "Le salaire", color: "#34D399", points: 130 },
  { id: "contribution", icon: "📣", label: "Contribuer", color: "#FFD700", points: 80 },
  { id: "premium", icon: "⭐", label: "Espace Expert", color: "#FFD700", points: 0 },
];

const cvTips = [
  { id: 1, title: "Une page maximum", desc: "Une page pour les profils juniors, deux pages maximum pour les profils expérimentés. Les recruteurs passent en moyenne 6 secondes sur un CV.", done: false },
  { id: 2, title: "Photo professionnelle", desc: "Fond neutre, tenue soignée, sourire naturel. Évite les selfies ou photos de vacances.", done: false },
  { id: 3, title: "Email sérieux", desc: "prenom.nom@email.com plutôt que skybluegirl2004@hotmail.fr !", done: false },
  { id: 4, title: "Mots-clés du secteur", desc: "Lis bien l'offre et reprends les termes exacts utilisés par l'entreprise.", done: false },
  { id: 5, title: "Compétences concrètes", desc: "Plutôt que 'dynamique et motivé', cite des réalisations concrètes : chiffres, projets menés, résultats obtenus.", done: false },
];

const quizQuestions = [
  {
    q: "Quel est le délai idéal pour relancer après l'envoi d'un CV ?",
    options: ["24h", "1 semaine", "1 mois", "Jamais relancer"],
    correct: 1,
    explication: "Une relance après 1 semaine montre ta motivation sans paraître impatient(e)."
  },
  {
    q: "Quelle est la première chose qu'un recruteur regarde sur LinkedIn ?",
    options: ["Tes diplômes", "Ta photo et ton titre", "Tes recommandations", "Tes centres d'intérêt"],
    correct: 1,
    explication: "La photo et le titre sont visibles en premier. Soigne ces deux éléments en priorité."
  },
  {
    q: "Que faire si tu ne connais pas la réponse à une question en entretien ?",
    options: ["Inventer quelque chose", "Rester silencieux(se)", "Dire honnêtement que tu ne sais pas mais que tu apprendras", "Changer de sujet"],
    correct: 2,
    explication: "L'honnêteté et la volonté d'apprendre sont toujours appréciées. Mieux vaut reconnaître une lacune que d'inventer une réponse."
  },
  {
    q: "Combien de CV personnalisés vaut-il mieux envoyer plutôt qu'un seul CV générique ?",
    options: ["Aucun, un CV générique suffit", "5 CV ciblés", "50 CV identiques", "100 CV génériques"],
    correct: 1,
    explication: "Mieux vaut 5 candidatures ciblées et personnalisées que 50 envois en masse, quel que soit ton niveau d'expérience."
  },
];

const secteurs = [
  {
    id: "meca", label: "Maintenance mécanique", icon: "⚙️", color: "#FF6B35",
    questions: [
      "Décris une panne ou un dysfonctionnement que tu as diagnostiqué. Quelle était la situation, quelle méthode tu as utilisée pour identifier la cause, et quel a été le résultat ?",
      "Raconte-moi une intervention de maintenance menée dans l'urgence. Comment tu as priorisé et sécurisé la situation ?",
      "Tu arrives sur un équipement inconnu sans documentation. Comment tu procèdes pour comprendre son fonctionnement avant d'intervenir ?",
      "Donne-moi un exemple où tu as proposé une action préventive qui a évité une panne. Quelle était la situation et quel a été l'impact ?",
    ],
  },
  {
    id: "indus", label: "Maintenance industrielle", icon: "🏭", color: "#FFD700",
    questions: [
      "Raconte-moi une intervention sur une ligne de production à l'arrêt. Comment tu as organisé le diagnostic et la remise en service, et quel était le délai ?",
      "Donne-moi un exemple où tu as appliqué ou amélioré un plan de maintenance préventive. Quelle méthode et quels résultats ?",
      "Tu constates une anomalie sur un équipement en cours de production. Comment tu évalues si tu arrêtes la ligne ou si tu continues ?",
      "Parle-moi d'une situation où tu as dû coordonner plusieurs corps de métier pour résoudre un problème. Comment tu as géré ça ?",
    ],
  },
  {
    id: "clim", label: "Génie climatique", icon: "❄️", color: "#5BC8D4",
    questions: [
      "Décris une intervention sur une installation CVC complexe. Quelle était la panne, comment tu l'as diagnostiquée et résolue ?",
      "Raconte-moi une mise en service d'une installation que tu as réalisée. Quelles étapes tu as suivies et quelles difficultés tu as rencontrées ?",
      "Un client signale une installation qui ne chauffe pas suffisamment malgré plusieurs interventions précédentes. Comment tu aborde le diagnostic ?",
      "Donne-moi un exemple où tu as dû expliquer une intervention technique à un client non spécialiste. Comment tu as adapté ton discours ?",
    ],
  },
  {
    id: "prod", label: "Production industrielle", icon: "🔩", color: "#E8963A",
    questions: [
      "Raconte-moi une situation où tu as détecté un problème qualité sur la ligne. Comment tu as réagi et quelle a été la suite ?",
      "Donne-moi un exemple où tu as contribué à améliorer un process ou à réduire les pertes sur un poste de production. Quelle était ta démarche ?",
      "Tu es opérateur sur une machine et tu remarques un réglage qui dérive. Que fais-tu, et comment tu traces l'incident ?",
      "Parle-moi d'une période de forte cadence ou de rush de production. Comment tu as maintenu la qualité tout en tenant le rythme ?",
    ],
  },
  {
    id: "compta", label: "Cabinet comptable", icon: "📊", color: "#D4956A",
    questions: [
      "Décris une situation où tu as détecté une erreur ou une incohérence dans des données comptables. Comment tu l'as identifiée et corrigée ?",
      "Raconte-moi une période de clôture ou de forte charge de travail. Comment tu as organisé tes priorités pour respecter les délais ?",
      "Un client ne comprend pas pourquoi sa TVA à décaisser est plus élevée que prévu. Comment tu lui expliques la situation ?",
      "Donne-moi un exemple où tu as dû monter en compétence rapidement sur un logiciel ou une réglementation. Comment tu as procédé ?",
    ],
  },
  {
    id: "paie", label: "Gestionnaire de paie", icon: "💶", color: "#C8622A",
    questions: [
      "Raconte-moi une situation où tu as détecté une anomalie de paie avant l'envoi des bulletins. Quelle était l'erreur, comment tu l'as trouvée et corrigée ?",
      "Un salarié conteste un élément de son bulletin de paie. Comment tu gères cet échange et quelle est ta démarche de vérification ?",
      "Donne-moi un exemple où une évolution réglementaire (convention collective, loi) t'a obligé(e) à modifier des pratiques de paie. Comment tu t'es organisé(e) ?",
      "Parle-moi d'une période de clôture de paie sous pression. Comment tu t'assures de la fiabilité des données malgré les délais courts ?",
    ],
  },
  {
    id: "vente", label: "Commerce / Vente", icon: "🤝", color: "#F4A261",
    questions: [
      "Raconte-moi une vente ou une négociation que tu as menée — même dans un contexte scolaire ou associatif. Quelle était la situation, ton approche, et le résultat ?",
      "Donne-moi un exemple où un client ou interlocuteur était réticent ou difficile. Comment tu as géré la situation ?",
      "Tu dois prospecter un nouveau secteur que tu ne connais pas. Comment tu t'organises pour identifier les bons interlocuteurs et préparer ton approche ?",
      "Parle-moi d'un objectif commercial que tu n'as pas atteint. Qu'est-ce qui s'est passé et qu'est-ce que tu en as tiré ?",
    ],
  },
  {
    id: "adv", label: "ADV / Administration des ventes", icon: "📋", color: "#E76F51",
    questions: [
      "Raconte-moi une situation où tu as dû gérer une commande urgente ou un client mécontent lié à un retard de livraison. Comment tu as géré ça ?",
      "Donne-moi un exemple où tu as détecté une erreur sur une commande ou une facture avant qu'elle parte. Comment tu l'as traitée ?",
      "Tu as plusieurs commandes prioritaires à traiter en même temps avec des délais différents. Comment tu priorises et t'organises ?",
      "Parle-moi d'une situation où tu as dû coordonner plusieurs services internes (commercial, logistique, comptabilité) pour débloquer une commande. Quel était ton rôle ?",
    ],
  },
  {
    id: "achat", label: "Achats / Approvisionnement", icon: "🛒", color: "#2A9D8F",
    questions: [
      "Raconte-moi une négociation avec un fournisseur que tu as menée ou observée. Quels étaient les enjeux, la stratégie adoptée et le résultat ?",
      "Donne-moi un exemple où un fournisseur n'a pas respecté ses engagements (délai, qualité, prix). Comment tu as géré la situation ?",
      "Tu dois sourcer un nouveau fournisseur pour un composant critique. Quelles étapes tu suis pour évaluer et sélectionner le bon partenaire ?",
      "Parle-moi d'une situation où tu as contribué à réduire les coûts d'achat sans dégrader la qualité. Quelle était ta démarche ?",
    ],
  },
];

function XPBar({ xp, maxXP }) {
  const pct = Math.min((xp / maxXP) * 100, 100);
  return (
    <div style={{ background: COLORS.border, borderRadius: 99, height: 10, overflow: "hidden", width: "100%" }}>
      <div style={{
        height: "100%",
        width: `${pct}%`,
        background: `linear-gradient(90deg, #FFD700, #FF6B35)`,
        borderRadius: 99,
        transition: "width 0.8s cubic-bezier(.4,2,.6,1)",
        boxShadow: `0 0 16px #FFD70088`
      }} />
    </div>
  );
}

function Badge({ label, color }) {
  return (
    <span style={{
      background: color + "22",
      border: `1px solid ${color}55`,
      color: color,
      borderRadius: 99,
      padding: "2px 12px",
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: 1,
    }}>{label}</span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 20,
      padding: 24,
      
      ...style,
    }}>{children}</div>
  );
}

function Btn({ children, onClick, color = COLORS.accent, secondary = false, style = {} }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: secondary ? "transparent" : (hover ? color + "DD" : color),
        color: secondary ? color : "#0F0F1A",
        border: secondary ? `2px solid ${color}` : "none",
        borderRadius: 12,
        padding: "12px 24px",
        fontWeight: 800,
        fontSize: 15,
        cursor: "pointer",
        transition: "all 0.2s",
        transform: hover ? "translateY(-2px)" : "none",
        boxShadow: hover ? `0 8px 24px ${color}44` : "none",
        fontFamily: "inherit",
        ...style,
      }}
    >{children}</button>
  );
}

// ---- SCREENS ----

function HomeScreen({ onNav, xp, level }) {
  return (
    <div style={{ textAlign: "center", padding: "0 8px" }}>
      {/* Logo Mahay Consulting */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, marginTop: 8 }}>
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAE62lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CiAgICAgICAgPHJkZjpSREYgeG1sbnM6cmRmPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjJz4KCiAgICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICAgICAgICB4bWxuczpkYz0naHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8nPgogICAgICAgIDxkYzp0aXRsZT4KICAgICAgICA8cmRmOkFsdD4KICAgICAgICA8cmRmOmxpIHhtbDpsYW5nPSd4LWRlZmF1bHQnPk1haGF5IC0gMTwvcmRmOmxpPgogICAgICAgIDwvcmRmOkFsdD4KICAgICAgICA8L2RjOnRpdGxlPgogICAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgoKICAgICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogICAgICAgIHhtbG5zOkF0dHJpYj0naHR0cDovL25zLmF0dHJpYnV0aW9uLmNvbS9hZHMvMS4wLyc+CiAgICAgICAgPEF0dHJpYjpBZHM+CiAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSdSZXNvdXJjZSc+CiAgICAgICAgPEF0dHJpYjpDcmVhdGVkPjIwMjQtMDctMDE8L0F0dHJpYjpDcmVhdGVkPgogICAgICAgIDxBdHRyaWI6RXh0SWQ+ZDU0NWY4ZmMtYmJiMC00MGNkLWEyOGYtYWI3OGJiMjc4ZTQyPC9BdHRyaWI6RXh0SWQ+CiAgICAgICAgPEF0dHJpYjpGYklkPjUyNTI2NTkxNDE3OTU4MDwvQXR0cmliOkZiSWQ+CiAgICAgICAgPEF0dHJpYjpUb3VjaFR5cGU+MjwvQXR0cmliOlRvdWNoVHlwZT4KICAgICAgICA8L3JkZjpsaT4KICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgPC9BdHRyaWI6QWRzPgogICAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgoKICAgICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogICAgICAgIHhtbG5zOnBkZj0naHR0cDovL25zLmFkb2JlLmNvbS9wZGYvMS4zLyc+CiAgICAgICAgPHBkZjpBdXRob3I+QW5kcmlhbmluYSBSPC9wZGY6QXV0aG9yPgogICAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgoKICAgICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogICAgICAgIHhtbG5zOnhtcD0naHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyc+CiAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5DYW52YSAoUmVuZGVyZXIpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgICAgICAgCiAgICAgICAgPC9yZGY6UkRGPgogICAgICAgIDwveDp4bXBtZXRhPtZeM4sAAFRrSURBVHic7NqxblZ1HMfhH22gdIChk7ErRB1ccQdvw2vwEkyvwdsh7OqmAwOE7U1oYjrAUCptXwcr6U5Ojn7e57mC75k+53/+5852u90OAPC/trf2AADg8wk6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoABAg6AAQIOgAECDoA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Agg6AAQQdAAIIOgAEEDQASCAoANAAEEHgACCDgABBB0AAgg6AAQQdAAIIOgAEEDQASCAoANAAEEHgACCDgABBB0AAgg6AAQQdAAIIOgAEEDQASCAoANAAEEHgACCDgABBB0AAgg6AAQQdAAIIOgAEEDQASCAoANAAEEHgACCDgABBB0AAgg6AAQQdAAIIOgAEEDQASCAoANAAEEHgACCDgABBB0AAgg6AAQQdAAIIOgAEEDQASCAoANAAEEHgACCDgABBB0AAgg6AAQQdAAIIOgAEEDQASCAoANAAEEHgACCDgABBB0AAgg6AAQQdAAIIOgAEEDQASCAoANAAEEHgACCDgABBB0AAgg6AAQQdAAIIOgAEEDQASCAoANAAEEHgACCDgABBB0AAgg6AAQQdAAIIOgAEEDQASCAoANAAEEHgACCDgABBB0AAgg6AAQQdAAIIOgAEEDQASCAoANAAEEHgACCDgABBB0AAgg6AAQQdAAIIOgAEEDQASCAoANAAEEHgACCDgABBB0AAgg6AAQQdAAIIOgAEEDQASCAoANAAEEHgACCDgABBB0AAgg6AAQQdAAI8CHhoAQPXrzQJwAAAABJRU5ErkJggg=="
          alt="Mahay Consulting"
          style={{
            width: 200,
            height: "auto",
            background: "#FFFFFF",
            borderRadius: 16,
            padding: "14px 24px",
            boxShadow: "0 4px 24px rgba(200,98,42,0.35)",
          }}
        />
      </div>
      <h1 style={{
        fontSize: 44,
        fontWeight: 300,
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
        background: "linear-gradient(135deg, #FFD700, #FF6B35)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        margin: "0 0 6px",
        letterSpacing: 8,
        textTransform: "uppercase",
      }}>Mahay Prep</h1>
      <p style={{ color: COLORS.muted, fontSize: 15, marginBottom: 28 }}>
        Prépare-toi. Ouvre les portes.
      </p>

      <Card style={{ marginBottom: 24, textAlign: "left" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ color: COLORS.text, fontWeight: 700 }}>Niveau {level}</span>
          <Badge label={`${xp} XP`} color={COLORS.accent} />
        </div>
        <XPBar xp={xp} maxXP={level * 200} />
        <p style={{ color: COLORS.muted, fontSize: 13, marginTop: 8 }}>
          Encore {Math.max(0, level * 200 - xp)} XP pour le niveau {level + 1}
        </p>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
        {stages.map(s => (
          <Card key={s.id} style={{ cursor: "pointer", textAlign: "center", transition: "transform 0.2s" }}
            onClick={() => onNav(s.id)}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ color: s.color, fontWeight: 600, fontSize: 14, fontFamily: "'Jost', sans-serif" }}>{s.label}</div>
            <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>+{s.points} XP</div>
          </Card>
        ))}
      </div>

      <Btn onClick={() => onNav("simulateur")} color="#FFD700" style={{ width: "100%", marginBottom: 12 }}>
        🔍 Check ton CV avant de l'envoyer
      </Btn>
      <Btn onClick={() => onNav("quiz")} style={{ width: "100%", marginBottom: 12 }}>
        🧩 Quiz du jour — Teste tes connaissances
      </Btn>
      <Btn onClick={() => onNav("entretien")} color={COLORS.accent3} style={{ width: "100%", marginBottom: 12 }}>
        🎤 Simuler un entretien IA
      </Btn>
      <div onClick={() => onNav("premium")} style={{ cursor: "pointer", background: "linear-gradient(135deg, #C8622A22, #C8622A08)", border: "1px solid #C8622A55", borderRadius: 16, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "#F472B6", fontWeight: 900, fontSize: 15, marginBottom: 2 }}>⭐ Espace Expert</div>
          <div style={{ color: COLORS.muted, fontSize: 13 }}>Le regard d'une recruteuse, pas d'une IA</div>
        </div>
        <span style={{ color: "#F472B6", fontSize: 20 }}>→</span>
      </div>
    </div>
  );
}

function CVScreen({ onBack, onXP }) {
  const [tips, setTips] = useState(cvTips);
  const [awarded, setAwarded] = useState(false);

  const toggle = (id) => {
    setTips(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const allDone = tips.every(t => t.done);

  useEffect(() => {
    if (allDone && !awarded) {
      onXP(100);
      setAwarded(true);
    }
  }, [allDone, awarded]);

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 14, marginBottom: 16, fontFamily: "inherit" }}>
        ← Retour
      </button>
      <h2 style={{ color: COLORS.accent, fontSize: 30, fontWeight: 500, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: 1, marginBottom: 4 }}>📄 Ton CV</h2>
      <p style={{ color: COLORS.muted, marginBottom: 24 }}>Coche les bonnes pratiques que tu as appliquées</p>

      {tips.map(tip => (
        <Card key={tip.id} style={{ marginBottom: 14, cursor: "pointer", borderColor: tip.done ? COLORS.accent3 + "66" : COLORS.border }}
          onClick={() => toggle(tip.id)}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: tip.done ? COLORS.accent3 : "transparent",
              border: `2px solid ${tip.done ? COLORS.accent3 : COLORS.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, fontSize: 16, transition: "all 0.3s"
            }}>
              {tip.done ? "✓" : ""}
            </div>
            <div>
              <div style={{ color: COLORS.text, fontWeight: 700, marginBottom: 4 }}>{tip.title}</div>
              <div style={{ color: COLORS.muted, fontSize: 14 }}>{tip.desc}</div>
            </div>
          </div>
        </Card>
      ))}

      {allDone && (
        <Card style={{ background: COLORS.accent3 + "22", borderColor: COLORS.accent3, textAlign: "center", marginTop: 8 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
          <div style={{ color: COLORS.accent3, fontWeight: 800 }}>CV maîtrisé ! +100 XP gagnés</div>
        </Card>
      )}
    </div>
  );
}

function QuizScreen({ onBack, onXP }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [awarded, setAwarded] = useState(false);

  const q = quizQuestions[current];

  const choose = (i) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore(s => s + 1);
  };

  const next = () => {
    if (current + 1 < quizQuestions.length) {
      setCurrent(c => c + 1);
      setSelected(null);
    } else {
      setDone(true);
      if (!awarded) {
        onXP(score * 25 + 50);
        setAwarded(true);
      }
    }
  };

  if (done) return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 14, marginBottom: 16, fontFamily: "inherit" }}>← Retour</button>
      <Card style={{ textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{score >= 3 ? "🏆" : score >= 2 ? "🌟" : "💪"}</div>
        <h2 style={{ color: COLORS.accent, fontWeight: 900, marginBottom: 8 }}>
          {score} / {quizQuestions.length} bonnes réponses
        </h2>
        <p style={{ color: COLORS.muted, marginBottom: 20 }}>
          {score === 4 ? "Parfait ! Tu maîtrises les bases !" : score >= 2 ? "Bien joué, continue comme ça !" : "Continue à apprendre, tu y arriveras !"}
        </p>
        <Badge label={`+${score * 25 + 50} XP gagnés`} color={COLORS.accent} />
        <div style={{ marginTop: 20 }}>
          <Btn onClick={onBack}>Retour à l'accueil</Btn>
        </div>
      </Card>
    </div>
  );

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 14, marginBottom: 16, fontFamily: "inherit" }}>← Retour</button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ color: COLORS.accent, fontSize: 26, fontWeight: 500, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: 1, margin: 0 }}>🧩 Quiz</h2>
        <Badge label={`${current + 1}/${quizQuestions.length}`} color={COLORS.accent2} />
      </div>

      <Card style={{ marginBottom: 20 }}>
        <p style={{ color: COLORS.text, fontSize: 18, fontWeight: 700, lineHeight: 1.4 }}>{q.q}</p>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correct;
          const isSelected = i === selected;
          let borderColor = COLORS.border;
          let bg = COLORS.card;
          if (selected !== null) {
            if (isCorrect) { borderColor = COLORS.accent3; bg = COLORS.accent3 + "22"; }
            else if (isSelected) { borderColor = COLORS.accent2; bg = COLORS.accent2 + "22"; }
          }
          return (
            <button key={i} onClick={() => choose(i)} style={{
              background: bg,
              border: `2px solid ${borderColor}`,
              borderRadius: 14,
              padding: "14px 18px",
              color: COLORS.text,
              textAlign: "left",
              cursor: selected === null ? "pointer" : "default",
              fontFamily: "inherit",
              fontSize: 15,
              fontWeight: 600,
              transition: "all 0.3s",
            }}>
              {isSelected && !isCorrect ? "✗ " : isCorrect && selected !== null ? "✓ " : ""}{opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <Card style={{ background: COLORS.accent3 + "11", borderColor: COLORS.accent3 + "55", marginBottom: 16 }}>
          <p style={{ color: COLORS.accent3, fontWeight: 700, margin: 0 }}>💡 {q.explication}</p>
        </Card>
      )}

      {selected !== null && (
        <Btn onClick={next} style={{ width: "100%" }}>
          {current + 1 < quizQuestions.length ? "Question suivante →" : "Voir mes résultats"}
        </Btn>
      )}
    </div>
  );
}

function EntretienScreen({ onBack, onXP }) {
  const [secteur, setSecteur] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [awarded, setAwarded] = useState(false);
  const messagesEndRef = useRef(null);

  const startScenario = (q) => {
    setScenario(q);
    setMessages([{ role: "assistant", content: `🎤 Recruteur : "${q}"\n\nRéponds en utilisant la méthode STAR : Situation → Tâche → Action → Résultat. Appuie-toi sur des expériences réelles, qu'elles soient pro, associatives ou personnelles. Je vais t'évaluer et te coacher !` }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: `Tu es un coach de recrutement bienveillant qui aide des candidats français (tous niveaux : débutants, reconversions, retours à l'emploi, évolutions de carrière) à préparer leurs entretiens dans le secteur : ${secteur?.label}.
Tu évalues leurs réponses selon la méthode STAR (Situation, Tâche, Action, Résultat). Après chaque réponse :
1. Identifie ce qui était bien structuré (STAR)
2. Indique ce qui manque ou pourrait être renforcé, avec un exemple concret
3. Si la réponse est incomplète, pose une question de relance ciblée (ex: "Et quel a été le résultat concret ?")
Reste encourageant, précis, professionnel. Maximum 130 mots. Réponds en français.`,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "Une erreur est survenue.";
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
      if (!awarded) { onXP(60); setAwarded(true); }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Erreur de connexion. Réessaie !" }]);
    }
    setLoading(false);
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Étape 1 : choix du secteur
  if (!secteur) return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 14, marginBottom: 16, fontFamily: "inherit" }}>← Retour</button>
      <h2 style={{ color: COLORS.accent3, fontSize: 30, fontWeight: 500, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: 1, marginBottom: 4 }}>🎤 Simulation d'entretien</h2>
      <p style={{ color: COLORS.muted, marginBottom: 8 }}>Dans quel secteur tu postules ou évolues ?</p>
      <Card style={{ background: COLORS.accent3 + "11", borderColor: COLORS.accent3 + "44", marginBottom: 20 }}>
        <p style={{ color: COLORS.accent3, fontSize: 13, margin: 0, fontWeight: 600 }}>
          ⭐ Méthode STAR — Les questions sont basées sur des situations réelles. Réponds avec : Situation → Tâche → Action → Résultat.
        </p>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {secteurs.map(s => (
          <Card key={s.id} style={{ cursor: "pointer", textAlign: "center", borderColor: s.color + "33" }} onClick={() => setSecteur(s)}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ color: s.color, fontWeight: 800, fontSize: 13 }}>{s.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );

  // Étape 2 : choix de la question
  if (!scenario) return (
    <div>
      <button onClick={() => setSecteur(null)} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 14, marginBottom: 16, fontFamily: "inherit" }}>← Changer de secteur</button>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 24 }}>{secteur.icon}</span>
        <h2 style={{ color: secteur.color, fontSize: 22, fontWeight: 900, margin: 0 }}>{secteur.label}</h2>
      </div>
      <p style={{ color: COLORS.muted, marginBottom: 20 }}>Choisis une question STAR :</p>
      {secteur.questions.map((q, i) => (
        <Card key={i} style={{ marginBottom: 12, cursor: "pointer", borderColor: secteur.color + "33" }} onClick={() => startScenario(q)}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ color: secteur.color, fontWeight: 900, fontSize: 13, marginTop: 2, flexShrink: 0 }}>Q{i + 1}</span>
            <span style={{ color: COLORS.text, fontWeight: 600, fontSize: 14, lineHeight: 1.5 }}>{q}</span>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 180px)" }}>
      <button onClick={() => { setScenario(null); setMessages([]); }} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 14, marginBottom: 8, fontFamily: "inherit", textAlign: "left" }}>← Autre question</button>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 18 }}>{secteur.icon}</span>
        <h2 style={{ color: secteur.color, fontSize: 18, fontWeight: 900, margin: 0 }}>{secteur.label}</h2>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "85%",
              background: m.role === "user" ? COLORS.accent + "22" : COLORS.card,
              border: `1px solid ${m.role === "user" ? COLORS.accent + "55" : COLORS.border}`,
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "12px 16px",
              color: COLORS.text,
              fontSize: 14,
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
            }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex" }}>
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: "18px 18px 18px 4px", padding: "12px 16px" }}>
              <span style={{ color: COLORS.muted }}>⏳ Le coach réfléchit...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Ta réponse..."
          style={{
            flex: 1, background: "#0F0F1A", border: `1px solid ${COLORS.border}`,
            borderRadius: 12, padding: "12px 16px", color: COLORS.text,
            fontFamily: "'Jost', inherit", fontSize: 15, outline: "none",
          }}
        />
        <Btn onClick={sendMessage} color={COLORS.accent3} style={{ padding: "12px 20px" }}>→</Btn>
      </div>
    </div>
  );
}

function CandidatureScreen({ onBack, onXP }) {
  const [awarded, setAwarded] = useState(false);
  const steps = [
    { icon: "🔍", title: "Cherche les offres", desc: "LinkedIn, Indeed, Welcome to the Jungle, site officiel des entreprises." },
    { icon: "📝", title: "Personnalise ton CV", desc: "Adapte-le pour chaque offre. Utilise les mots-clés de l'annonce." },
    { icon: "✉️", title: "Lettre de motivation", desc: "3 paragraphes : pourquoi eux, pourquoi toi, ce que tu apportes." },
    { icon: "📬", title: "Envoie & note tout", desc: "Tiens un tableau de suivi : entreprise, date, statut." },
    { icon: "⏰", title: "Relance après 1 semaine", desc: "Un email court et poli pour montrer ton intérêt." },
  ];

  useEffect(() => {
    if (!awarded) { setTimeout(() => { onXP(80); setAwarded(true); }, 1500); }
  }, []);

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 14, marginBottom: 16, fontFamily: "inherit" }}>← Retour</button>
      <h2 style={{ color: COLORS.accent2, fontSize: 30, fontWeight: 500, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: 1, marginBottom: 4 }}>✉️ Candidater</h2>
      <p style={{ color: COLORS.muted, marginBottom: 24 }}>Le processus de candidature, étape par étape</p>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: COLORS.accent2 + "22",
            border: `1px solid ${COLORS.accent2}44`, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 22, flexShrink: 0
          }}>{s.icon}</div>
          <div>
            <div style={{ color: COLORS.text, fontWeight: 700, marginBottom: 4 }}>{s.title}</div>
            <div style={{ color: COLORS.muted, fontSize: 14 }}>{s.desc}</div>
          </div>
        </div>
      ))}
      <Card style={{ background: COLORS.accent2 + "11", borderColor: COLORS.accent2, marginTop: 8 }}>
        <p style={{ color: COLORS.accent2, fontWeight: 700, margin: 0 }}>💡 Conseil pro : 5 candidatures ciblées et personnalisées valent mieux que 50 envois génériques — à tous les niveaux de carrière.</p>
      </Card>
    </div>
  );
}

function ReseauxScreen({ onBack, onXP }) {
  const [awarded, setAwarded] = useState(false);
  useEffect(() => { if (!awarded) { setTimeout(() => { onXP(60); setAwarded(true); }, 1000); } }, []);

  const tips = [
    { platform: "LinkedIn", icon: "💼", tip: "Photo pro + titre clair + résumé qui reflète ton parcours. Connecte-toi avec tes anciens collègues, managers, clients et partenaires." },
    { platform: "Portfolio", icon: "🎨", tip: "Si tu as des projets, créer un portfolio (GitHub, Behance, etc.) te différencie énormément." },
    { platform: "Événements", icon: "🤝", tip: "Job datings, forums étudiants, meetups : 80% des emplois se trouvent via le réseau !" },
    { platform: "Cold messaging", icon: "📩", tip: "N'hésite pas à contacter directement des professionnels ou recruteurs sur LinkedIn. Un message personnalisé et concis peut ouvrir des portes inattendues." },
  ];

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 14, marginBottom: 16, fontFamily: "inherit" }}>← Retour</button>
      <h2 style={{ color: "#FF6B35", fontSize: 30, fontWeight: 500, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: 1, marginBottom: 4 }}>🌐 Réseaux</h2>
      <p style={{ color: COLORS.muted, marginBottom: 24 }}>Développe et activie ton réseau professionnel</p>
      {tips.map((t, i) => (
        <Card key={i} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>{t.icon}</span>
            <span style={{ color: "#FF6B35", fontWeight: 800 }}>{t.platform}</span>
          </div>
          <p style={{ color: COLORS.muted, fontSize: 14, margin: 0 }}>{t.tip}</p>
        </Card>
      ))}
    </div>
  );
}

function SalaireScreen({ onBack, onXP }) {
  const [tab, setTab] = useState("grilles");
  const [awarded, setAwarded] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    if (!awarded) { setTimeout(() => { onXP(70); setAwarded(true); }, 1200); }
  }, []);

  const grilles = [
    {
      secteur: "Maintenance mécanique / industrielle",
      icon: "⚙️",
      color: "#FF6B35",
      postes: [
        { poste: "Technicien de maintenance (débutant)", fourchette: "24 000 – 28 000 €", note: "Avec habilitations (électrique, CACES), la fourchette monte." },
        { poste: "Technicien de maintenance (2-5 ans)", fourchette: "28 000 – 36 000 €", note: "Les astreintes et primes de nuit peuvent représenter +15 à 20%." },
        { poste: "Responsable maintenance", fourchette: "38 000 – 55 000 €", note: "Variable selon taille du site et secteur (agroalimentaire, automobile…)." },
      ],
    },
    {
      secteur: "Génie climatique / CVC",
      icon: "❄️",
      color: "#00D9A3",
      postes: [
        { poste: "Technicien CVC débutant", fourchette: "24 000 – 29 000 €", note: "Le permis B est souvent indispensable. Paniers repas et véhicule de service fréquents." },
        { poste: "Technicien CVC confirmé", fourchette: "30 000 – 40 000 €", note: "L'attestation fluides frigorigènes (Cat. 1) est un vrai levier de négociation." },
        { poste: "Chargé d'affaires / chef de projet", fourchette: "40 000 – 55 000 €", note: "Part variable fréquente selon les affaires gagnées." },
      ],
    },
    {
      secteur: "Production industrielle",
      icon: "🔩",
      color: "#FF6B35",
      postes: [
        { poste: "Opérateur de production", fourchette: "22 000 – 26 000 €", note: "Les primes de poste (2x8, 3x8, week-end) peuvent représenter +20 à 30% du brut." },
        { poste: "Conducteur de ligne", fourchette: "26 000 – 32 000 €", note: "Le CACES et les formations internes sont des atouts valorisés." },
        { poste: "Responsable d'îlot / chef d'équipe", fourchette: "32 000 – 42 000 €", note: "La prime de responsabilité s'ajoute souvent au fixe." },
      ],
    },
    {
      secteur: "Cabinet d'expertise comptable",
      icon: "📊",
      color: "#34D399",
      postes: [
        { poste: "Assistant comptable (débutant)", fourchette: "22 000 – 26 000 €", note: "Les cabinets proposent souvent la formation au DCG/DSCG en alternance." },
        { poste: "Collaborateur comptable (2-5 ans)", fourchette: "28 000 – 38 000 €", note: "La taille du cabinet et la zone géographique influencent fortement la fourchette." },
        { poste: "Chef de mission / responsable portefeuille", fourchette: "38 000 – 52 000 €", note: "Le titre d'Expert-Comptable stagiaire ouvre des négociations bien supérieures." },
      ],
    },
    {
      secteur: "Gestionnaire de paie",
      icon: "💶",
      color: "#FFD700",
      postes: [
        { poste: "Gestionnaire de paie junior", fourchette: "24 000 – 28 000 €", note: "La maîtrise d'un logiciel (Silae, ADP, Sage) est un vrai différenciateur dès le départ." },
        { poste: "Gestionnaire de paie confirmé", fourchette: "30 000 – 40 000 €", note: "Le volume de bulletins gérés et la maîtrise des conventions collectives font la différence." },
        { poste: "Responsable paie / RH", fourchette: "40 000 – 55 000 €", note: "Périmètre multi-sites ou international = levier important." },
      ],
    },
    {
      secteur: "Commerce / Vente / ADV",
      icon: "🤝",
      color: "#FFD700",
      postes: [
        { poste: "Commercial sédentaire / ADV junior", fourchette: "24 000 – 30 000 €", note: "Le variable (commissions) peut représenter 10 à 30% du total selon le secteur." },
        { poste: "Commercial terrain (débutant)", fourchette: "26 000 – 35 000 € + variable", note: "Véhicule de fonction et remboursement de frais souvent inclus. Négocier les deux." },
        { poste: "Acheteur / Approvisionneur junior", fourchette: "28 000 – 36 000 €", note: "Les savings réalisés sont un argument béton pour négocier une augmentation." },
      ],
    },
  ];

  const quizSalaire = [
    {
      q: "Tu passes un entretien et le recruteur te demande : 'Quelles sont vos prétentions salariales ?' Quelle est la meilleure réponse ?",
      options: [
        "Je n'ai pas encore réfléchi à ça.",
        "Donnez-moi une offre et je verrai.",
        "Je vise entre X et Y €, en cohérence avec le marché et le poste.",
        "Je veux le maximum possible.",
      ],
      correct: 2,
      explication: "Annoncer une fourchette préparée et justifiée montre que tu connais le marché. Évite les extrêmes : trop vague = manque de préparation, trop directif = mauvaise image.",
    },
    {
      q: "Le salaire brut annuel est de 28 000 €. Quel sera approximativement ton salaire net mensuel ?",
      options: ["2 333 € net/mois", "1 820 € net/mois", "2 100 € net/mois", "1 500 € net/mois"],
      correct: 1,
      explication: "En France, le net représente environ 78% du brut pour un salarié (cotisations salariales ~22%). 28 000 × 0,78 / 12 ≈ 1 820 € net/mois.",
    },
    {
      q: "Parmi ces éléments, lesquels peut-on négocier en plus du salaire fixe ?",
      options: [
        "Seulement le salaire fixe, rien d'autre.",
        "Les tickets restaurant uniquement.",
        "Les primes, jours de RTT, télétravail, véhicule, formation.",
        "Uniquement le nombre de congés.",
      ],
      correct: 2,
      explication: "Le package global comprend bien plus que le fixe : mutuelle, primes, RTT, télétravail, formation, véhicule de fonction… Ces éléments ont une vraie valeur monétaire.",
    },
    {
      q: "Quand est le bon moment pour parler du salaire en entretien ?",
      options: [
        "Dès les premières minutes pour gagner du temps.",
        "Jamais, c'est au recruteur d'aborder le sujet.",
        "Plutôt en fin d'entretien, une fois que tu as montré ta valeur.",
        "Uniquement par email après l'entretien.",
      ],
      correct: 2,
      explication: "Aborder le salaire après avoir présenté tes compétences et ton intérêt pour le poste te donne une position plus forte. Tu n'es plus juste un candidat, tu es une valeur ajoutée.",
    },
  ];

  const conseils = [
    { icon: "🔍", title: "Renseigne-toi avant l'entretien", desc: "Consulte les grilles de salaire (APEC, HelloWork, Glassdoor, INSEE). Vise une fourchette réaliste : ni trop basse (tu te dévalorise) ni trop haute (tu te grilles)." },
    { icon: "📐", title: "Annonce toujours une fourchette", desc: "Donne une fourchette avec le bas à ton minimum acceptable. Ex : 'Je vise entre 26 000 et 29 000 €'. Ça laisse de la marge pour négocier." },
    { icon: "💡", title: "Justifie avec des arguments concrets", desc: "Diplôme, habilitations, logiciels maîtrisés, expériences (stages, alternance) : chaque argument solide renforce ta demande." },
    { icon: "🎁", title: "Pense au package global", desc: "Tickets restaurant, mutuelle, RTT, télétravail, prime d'intéressement, véhicule de fonction : tout ça a une valeur. Un fixe un peu plus bas peut être compensé." },
    { icon: "⏳", title: "Ne cède pas trop vite", desc: "Si l'employeur propose en dessous de ta fourchette, ne dis pas oui immédiatement. Tu peux répondre : 'Pouvez-vous vous rapprocher de X ?' Une négociation, c'est normal." },
    { icon: "🚫", title: "Évite ces erreurs classiques", desc: "Ne t'excuse pas de poser la question. Si tu es en poste, ton salaire actuel peut être demandé — sois prêt(e) à y répondre honnêtement. Et ne mens jamais sur tes prétentions passées." },
  ];

  const q = quizSalaire[quizIdx];

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 14, marginBottom: 16, fontFamily: "inherit" }}>← Retour</button>
      <h2 style={{ color: "#34D399", fontSize: 30, fontWeight: 500, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: 1, marginBottom: 4 }}>💰 Le salaire</h2>
      <p style={{ color: COLORS.muted, marginBottom: 20 }}>Comprends le marché, négocie avec confiance</p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
        {[
          { id: "grilles", label: "📊 Grilles" },
          { id: "conseils", label: "💡 Conseils" },
          { id: "quiz", label: "🧩 Quiz" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id ? "#34D399" : "transparent",
            border: `2px solid ${tab === t.id ? "#34D399" : COLORS.border}`,
            borderRadius: 10, padding: "8px 16px",
            color: tab === t.id ? "#FFFFFF" : COLORS.muted,
            fontWeight: 800, fontSize: 13, cursor: "pointer",
            fontFamily: "inherit", whiteSpace: "nowrap", transition: "all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Grilles de salaires */}
      {tab === "grilles" && (
        <div>
          <Card style={{ background: "#34D39911", borderColor: "#34D39944", marginBottom: 12 }}>
            <p style={{ color: "#34D399", fontSize: 13, fontWeight: 600, margin: 0 }}>
              📍 Fourchettes brutes annuelles en France (2024-2025), tous niveaux d'expérience confondus. Elles varient selon la région, la taille de l'entreprise et tes habilitations.
            </p>
          </Card>
          <Card style={{ background: "#FFD70011", borderColor: "#FFD70044", marginBottom: 20 }}>
            <p style={{ color: "#FFD700", fontSize: 12, fontWeight: 600, margin: 0, lineHeight: 1.6 }}>
              ⚠️ Données indicatives basées sur les tendances du marché français. Vérifie les fourchettes pour ta région et ton secteur sur{" "}
              <a href="https://www.hellowork.com/fr-fr/barometre-salaires/" target="_blank" rel="noopener noreferrer" style={{ color: "#FFD700", textDecoration: "underline" }}>HelloWork</a>,{" "}
              <a href="https://www.indeed.com/salaries" target="_blank" rel="noopener noreferrer" style={{ color: "#FFD700", textDecoration: "underline" }}>Indeed</a> ou{" "}
              <a href="https://www.apec.fr/candidat/salary.html" target="_blank" rel="noopener noreferrer" style={{ color: "#FFD700", textDecoration: "underline" }}>l'APEC</a>.
            </p>
          </Card>
          {grilles.map((g, i) => (
            <Card key={i} style={{ marginBottom: 16, borderColor: g.color + "33" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 22 }}>{g.icon}</span>
                <span style={{ color: g.color, fontWeight: 800, fontSize: 15 }}>{g.secteur}</span>
              </div>
              {g.postes.map((p, j) => (
                <div key={j} style={{ marginBottom: j < g.postes.length - 1 ? 14 : 0, paddingBottom: j < g.postes.length - 1 ? 14 : 0, borderBottom: j < g.postes.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                    <span style={{ color: COLORS.text, fontWeight: 700, fontSize: 14 }}>{p.poste}</span>
                    <span style={{ color: g.color, fontWeight: 900, fontSize: 13, whiteSpace: "nowrap", flexShrink: 0 }}>{p.fourchette}</span>
                  </div>
                  <p style={{ color: COLORS.muted, fontSize: 12, margin: 0, lineHeight: 1.5 }}>💬 {p.note}</p>
                </div>
              ))}
            </Card>
          ))}
        </div>
      )}

      {/* Conseils négociation */}
      {tab === "conseils" && (
        <div>
          <Card style={{ background: "#34D39911", borderColor: "#34D39944", marginBottom: 20 }}>
            <p style={{ color: "#34D399", fontSize: 13, fontWeight: 600, margin: 0 }}>
              🎯 Parler salaire en entretien ne s'improvise pas. Voici les règles du jeu.
            </p>
          </Card>
          {conseils.map((c, i) => (
            <Card key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{c.icon}</span>
                <div>
                  <div style={{ color: COLORS.text, fontWeight: 700, marginBottom: 6 }}>{c.title}</div>
                  <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.6 }}>{c.desc}</div>
                </div>
              </div>
            </Card>
          ))}
          <Card style={{ background: "#FFD70011", borderColor: "#FFD70044", marginTop: 8 }}>
            <p style={{ color: "#FFD700", fontWeight: 700, margin: 0, fontSize: 14 }}>
              💬 Phrase clé à retenir : "Selon mes recherches sur le marché et mon profil, je me positionne entre X et Y €. Est-ce en ligne avec votre budget ?"
            </p>
          </Card>
        </div>
      )}

      {/* Quiz salaire */}
      {tab === "quiz" && !quizDone && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ color: COLORS.muted, fontSize: 14, fontWeight: 700 }}>Question {quizIdx + 1} / {quizSalaire.length}</span>
            <Badge label={`${quizScore} pts`} color="#34D399" />
          </div>
          <Card style={{ marginBottom: 20 }}>
            <p style={{ color: COLORS.text, fontSize: 16, fontWeight: 700, lineHeight: 1.5, margin: 0 }}>{q.q}</p>
          </Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correct;
              const isSelected = i === quizSelected;
              let borderColor = COLORS.border, bg = COLORS.card;
              if (quizSelected !== null) {
                if (isCorrect) { borderColor = "#34D399"; bg = "#34D39922"; }
                else if (isSelected) { borderColor = "#FF6B35"; bg = "#FF6B3522"; }
              }
              return (
                <button key={i} onClick={() => { if (quizSelected === null) { setQuizSelected(i); if (i === q.correct) setQuizScore(s => s + 1); } }} style={{
                  background: bg, border: `2px solid ${borderColor}`, borderRadius: 12,
                  padding: "13px 16px", color: COLORS.text, textAlign: "left",
                  cursor: quizSelected === null ? "pointer" : "default",
                  fontFamily: "inherit", fontSize: 14, fontWeight: 600, transition: "all 0.3s",
                }}>
                  {isSelected && !isCorrect ? "✗ " : isCorrect && quizSelected !== null ? "✓ " : ""}{opt}
                </button>
              );
            })}
          </div>
          {quizSelected !== null && (
            <>
              <Card style={{ background: "#34D39911", borderColor: "#34D39955", marginBottom: 14 }}>
                <p style={{ color: "#34D399", fontWeight: 700, margin: 0, fontSize: 14 }}>💡 {q.explication}</p>
              </Card>
              <Btn onClick={() => {
                if (quizIdx + 1 < quizSalaire.length) { setQuizIdx(i => i + 1); setQuizSelected(null); }
                else setQuizDone(true);
              }} color="#34D399" style={{ width: "100%" }}>
                {quizIdx + 1 < quizSalaire.length ? "Question suivante →" : "Voir mon score"}
              </Btn>
            </>
          )}
        </div>
      )}

      {tab === "quiz" && quizDone && (
        <Card style={{ textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{quizScore >= 3 ? "🏆" : quizScore >= 2 ? "🌟" : "💪"}</div>
          <h2 style={{ color: "#34D399", fontWeight: 900, marginBottom: 8 }}>{quizScore} / {quizSalaire.length} bonnes réponses</h2>
          <p style={{ color: COLORS.muted, marginBottom: 20 }}>
            {quizScore === 4 ? "Tu maîtrises le sujet, négocie avec confiance !" : quizScore >= 2 ? "Bonne base, relis les conseils pour aller plus loin." : "Prends le temps de lire les grilles et les conseils !"}
          </p>
          <Badge label={`+${quizScore * 20 + 50} XP`} color="#34D399" />
          <div style={{ marginTop: 20 }}>
            <Btn onClick={() => { setQuizIdx(0); setQuizSelected(null); setQuizScore(0); setQuizDone(false); }} color="#34D399" secondary>Recommencer le quiz</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}

function ContributionScreen({ onBack, onXP }) {
  const [form, setForm] = useState({ secteur: "", poste: "", salaireBrut: "", region: "", experience: "", typeContrat: "", consentement: false });
  const [submitted, setSubmitted] = useState(false);
  const [contributions, setContributions] = useState([]);
  const [awarded, setAwarded] = useState(false);
  const [tab, setTab] = useState("form");

  const regions = ["Île-de-France", "Auvergne-Rhône-Alpes", "Nouvelle-Aquitaine", "Occitanie", "Hauts-de-France", "Grand Est", "Provence-Alpes-Côte d'Azur", "Bretagne", "Normandie", "Pays de la Loire", "Bourgogne-Franche-Comté", "Centre-Val de Loire", "Corse", "DOM-TOM"];
  const experiences = ["Moins d'1 an", "1 à 3 ans", "3 à 5 ans", "5 à 10 ans", "Plus de 10 ans"];
  const contrats = ["CDI", "CDD", "Alternance", "Stage", "Intérim", "Freelance"];
  const secteursList = ["Maintenance mécanique", "Maintenance industrielle", "Génie climatique", "Production industrielle", "Cabinet comptable", "Gestionnaire de paie", "Commerce / Vente", "ADV / Administration des ventes", "Achats / Approvisionnement", "Autre"];

  const handleSubmit = () => {
    if (!form.secteur || !form.poste || !form.salaireBrut || !form.region || !form.experience || !form.typeContrat || !form.consentement) return;
    const entry = { ...form, date: new Date().toLocaleDateString("fr-FR") };
    setContributions(prev => [...prev, entry]);
    setSubmitted(true);
    if (!awarded) { onXP(80); setAwarded(true); }
  };

  const inputStyle = {
    width: "100%", background: "#0F0F1A", border: `1px solid ${COLORS.border}`,
    borderRadius: 10, padding: "11px 14px", color: COLORS.text,
    fontFamily: "inherit", fontSize: 14, outline: "none", marginTop: 6,
  };
  const selectStyle = { ...inputStyle, cursor: "pointer" };
  const labelStyle = { color: COLORS.muted, fontSize: 13, fontWeight: 700, display: "block", marginTop: 14 };

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 14, marginBottom: 16, fontFamily: "inherit" }}>← Retour</button>
      <h2 style={{ color: "#FFD700", fontSize: 26, fontWeight: 900, marginBottom: 4 }}>📣 Contribuer</h2>
      <p style={{ color: COLORS.muted, marginBottom: 20 }}>Partage ton salaire pour aider les autres candidats</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[{ id: "form", label: "📝 Mon salaire" }, { id: "data", label: `📊 Contributions (${contributions.length})` }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id ? "#FFD700" : "transparent",
            border: `2px solid ${tab === t.id ? "#FFD700" : COLORS.border}`,
            borderRadius: 10, padding: "8px 16px",
            color: tab === t.id ? "#FFFFFF" : COLORS.muted,
            fontWeight: 800, fontSize: 13, cursor: "pointer",
            fontFamily: "inherit", whiteSpace: "nowrap", transition: "all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>

      {tab === "form" && !submitted && (
        <div>
          <Card style={{ background: "#FFD70011", borderColor: "#FFD70044", marginBottom: 20 }}>
            <p style={{ color: "#FFD700", fontSize: 13, fontWeight: 600, margin: 0, lineHeight: 1.6 }}>
              🔒 Ces données sont anonymes et utilisées uniquement pour mettre à jour les grilles de salaires de l'application. Aucune information personnelle identifiable n'est collectée.
            </p>
          </Card>

          <label style={labelStyle}>Secteur *</label>
          <select value={form.secteur} onChange={e => setForm(f => ({ ...f, secteur: e.target.value }))} style={selectStyle}>
            <option value="">Sélectionne ton secteur</option>
            {secteursList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <label style={labelStyle}>Intitulé du poste *</label>
          <input value={form.poste} onChange={e => setForm(f => ({ ...f, poste: e.target.value }))} placeholder="Ex : Technicien de maintenance, Gestionnaire de paie..." style={inputStyle} />

          <label style={labelStyle}>Salaire brut annuel (€) *</label>
          <input type="number" value={form.salaireBrut} onChange={e => setForm(f => ({ ...f, salaireBrut: e.target.value }))} placeholder="Ex : 32000" style={inputStyle} />

          <label style={labelStyle}>Région *</label>
          <select value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} style={selectStyle}>
            <option value="">Sélectionne ta région</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <label style={labelStyle}>Expérience dans le métier *</label>
          <select value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} style={selectStyle}>
            <option value="">Sélectionne ton niveau</option>
            {experiences.map(e => <option key={e} value={e}>{e}</option>)}
          </select>

          <label style={labelStyle}>Type de contrat *</label>
          <select value={form.typeContrat} onChange={e => setForm(f => ({ ...f, typeContrat: e.target.value }))} style={selectStyle}>
            <option value="">Sélectionne le type de contrat</option>
            {contrats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <div style={{ marginTop: 24, padding: "16px", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                onClick={() => setForm(f => ({ ...f, consentement: !f.consentement }))}
                style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0, cursor: "pointer",
                  background: form.consentement ? "#FFD700" : "transparent",
                  border: `2px solid ${form.consentement ? "#FFD700" : COLORS.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, transition: "all 0.2s", marginTop: 1,
                }}>
                {form.consentement ? "✓" : ""}
              </div>
              <p style={{ color: COLORS.muted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                J'accepte de partager ces informations salariales de manière anonyme afin d'aider d'autres candidats. Je comprends que ces données seront utilisées uniquement pour mettre à jour les grilles de salaires de Mahay Prep. *
              </p>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <Btn
              onClick={handleSubmit}
              color="#FFD700"
              style={{ width: "100%", opacity: (!form.consentement || !form.secteur || !form.poste || !form.salaireBrut || !form.region || !form.experience || !form.typeContrat) ? 0.4 : 1 }}
            >
              Contribuer anonymement →
            </Btn>
          </div>
          <p style={{ color: COLORS.muted, fontSize: 11, textAlign: "center", marginTop: 10 }}>* Champs obligatoires</p>
        </div>
      )}

      {tab === "form" && submitted && (
        <Card style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🙏</div>
          <h3 style={{ color: "#FFD700", fontWeight: 900, marginBottom: 8 }}>Merci pour ta contribution !</h3>
          <p style={{ color: COLORS.muted, marginBottom: 20 }}>Ton salaire a été ajouté aux données de cette session. Il aidera les prochains candidats à mieux se positionner.</p>
          <Badge label="+80 XP gagnés" color="#FFD700" />
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            <Btn onClick={() => { setSubmitted(false); setForm({ secteur: "", poste: "", salaireBrut: "", region: "", experience: "", typeContrat: "", consentement: false }); }} color="#FFD700" secondary>
              Ajouter une autre contribution
            </Btn>
            <Btn onClick={() => setTab("data")} color="#FFD700">
              Voir les contributions →
            </Btn>
          </div>
        </Card>
      )}

      {tab === "data" && (
        <div>
          {contributions.length === 0 ? (
            <Card style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <p style={{ color: COLORS.muted }}>Aucune contribution pour cette session encore. Sois le premier à partager ton salaire !</p>
              <div style={{ marginTop: 16 }}>
                <Btn onClick={() => setTab("form")} color="#FFD700">Contribuer maintenant</Btn>
              </div>
            </Card>
          ) : (
            <div>
              <Card style={{ background: "#FFD70011", borderColor: "#FFD70044", marginBottom: 20 }}>
                <p style={{ color: "#FFD700", fontSize: 13, fontWeight: 600, margin: 0 }}>
                  {contributions.length} contribution{contributions.length > 1 ? "s" : ""} cette session — données anonymes, visibles uniquement ici.
                </p>
              </Card>
              {contributions.map((c, i) => (
                <Card key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 14 }}>{c.poste}</div>
                      <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{c.secteur} · {c.region}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ color: "#FFD700", fontWeight: 900, fontSize: 15 }}>{parseInt(c.salaireBrut).toLocaleString("fr-FR")} €</div>
                      <div style={{ color: COLORS.muted, fontSize: 11 }}>brut/an</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Badge label={c.experience} color="#FFD700" />
                    <Badge label={c.typeContrat} color={COLORS.accent} />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PremiumScreen({ onBack, onXP, isPremium, onUnlock }) {
  const [activeContent, setActiveContent] = useState(null);

  const offres = [
    {
      id: "decouverte",
      nom: "Découverte",
      prix: "14,99 €",
      facturation: "paiement unique",
      couleur: "#FFD700",
      description: "Ce que les recruteurs ne te diront jamais — 14,99 €",
      contenu: [
        "✦ Coulisses du recrutement — le regard brut de l'experte en recrutement",
        "✦ Grilles d'évaluation — ce qu'on note vraiment sur toi en entretien",
        "✦ Quiz d'auto-évaluation exclusif — résultat détaillé et personnalisé",
        "✦ Checklist de préparation d'entretien par secteur (maintenance, production, commerce...)",
        "✦ Communauté WhatsApp — canal conseils + groupe d'entraide (10 jours)",
      ],
      note: "⏱ Accès WhatsApp limité à 10 jours après activation.",
      ratio: "Soit moins de 0,50 € / jour — et 14,99 € déduits de ton 1er mois si tu passes au plan Suivi.",
    },
    {
      id: "suivi",
      nom: "Suivi",
      prix: "23,99 €",
      facturation: "/ mois",
      couleur: "#C8622A",
      badge: "Le plus complet",
      description: "Un accompagnement régulier avec l'experte à tes côtés.",
      contenu: [
        "✦ Tout le plan Découverte",
        "✦ Vidéos experts — format 1'30, un sujet, une clé",
        "✦ 2 sessions collectives / mois (6-10 personnes, questions/réponses avec l'experte)",
        "✦ Communauté WhatsApp illimitée — pendant toute la durée de l'abonnement",
      ],
      note: "♾ Accès WhatsApp illimité pendant toute la durée de l'abonnement. Si tu viens du plan Découverte, tes 14,99 € sont déduits de ce premier mois.",
      ratio: "Soit moins de 0,90 € / jour pour un accompagnement complet.",
    },
    {
      id: "coaching",
      nom: "Coaching Intensif",
      prix: "Sur devis",
      facturation: "",
      couleur: "#00D9A3",
      description: "Un accompagnement sur mesure pour les moments clés de ta carrière.",
      contenu: [
        "✦ Tout le plan Suivi",
        "✦ Sessions one-to-one avec un consultant certifié Mahay",
        "✦ Calls et visios à la demande — selon ta progression",
        "✦ Travail sur ta posture, ton discours, ton vocabulaire métier",
        "✦ Suivi personnalisé jusqu'à la signature de ton contrat",
      ],
      note: "🔒 5 places disponibles par mois — liste d'attente si complet.",
    },
  ];

  const coulisses = [
    {
      titre: "Ce que je regarde vraiment sur un CV — les 10 premières secondes",
      teaser: "Avant même de lire une ligne, je cherche des informations précises. Voici mon regard de recruteuse, dans l'ordre exact où il se pose.",
      contenuPremium: [
        "📌 1. Le nom, le prénom et les coordonnées. C'est la toute première chose. Un mail et un numéro de téléphone doivent être visibles immédiatement. Et si le poste implique de l'itinérance, je cherche aussi le permis de conduire — son absence peut être éliminatoire avant même la lecture.",
        "📌 2. La photo. Je la regarde, mais une photo non professionnelle ne me fera pas passer au suivant. C'est mon métier de lire les CV jusqu'au bout. En revanche, une belle photo soignée crée d'emblée une impression positive. C'est un détail qui compte, sans être décisif.",
        "📌 3. Les expériences professionnelles. C'est le cœur du CV. J'aime quand elles sont détaillées : durée de mission ou de contrat, missions précises, et des éléments en gras — parce que mon œil s'y pose naturellement. Un CV sans mise en forme, c'est un CV où je dois chercher l'info. Mauvais signe.",
        "📌 4. Les diplômes et formations continues. Selon le poste, les diplômes peuvent être indispensables ou secondaires. Mais les formations suivies en cours de carrière, elles, m'intéressent toujours — elles montrent une volonté de progresser.",
        "📌 5. Le bloc compétences. Je regarde ce que la personne met en avant et si c'est concret. Des logiciels maîtrisés, des outils métier, des certifications — oui. 'Anglais scolaire' — non. Si tu ne maîtrises pas une langue, ne la mets pas. Un CV doit contenir uniquement ce que tu peux assumer en entretien. Tout le reste fragilise ta crédibilité.",
      ],
    },
    {
      titre: "Pourquoi tu ne reçois pas de réponse après ta candidature",
      teaser: "En tant que recruteuse, je ne rappelle pas tous les candidats. Voici les vraies raisons — sans détour.",
      contenuPremium: [
        "📌 La raison numéro 1 : ton CV ne correspond pas aux attentes du poste. Pas parce que tu n'es pas compétent(e) — mais parce que tu n'as pas pris le temps de vérifier l'adéquation avant d'envoyer.",
        "📌 Beaucoup de candidats postulent en masse sans lire réellement le contenu de l'annonce. Les attendus sont pourtant écrits noir sur blanc. Quand le profil ne colle pas, la candidature n'est pas traitée — le volume ne le permet pas.",
        "📌 L'autre raison fréquente : un CV trop peu renseigné. Si je ne peux pas déterminer si tu as déjà effectué telle ou telle tâche, je ne peux pas te positionner sur le poste. Le doute profite rarement au candidat.",
        "📌 Ce que ça veut dire concrètement : chaque candidature doit être ciblée. Lis l'annonce en entier. Identifie les 3 ou 4 compétences clés attendues. Vérifie que ton CV y répond clairement — avec des missions, des durées, des contextes précis.",
        "📌 Le silence n'est pas un jugement sur ta valeur. C'est souvent le signal que la candidature n'était pas assez alignée avec le poste. La bonne nouvelle : c'est entièrement corrigeable.",
      ],
    },
    {
      titre: "Les questions pièges : un mythe à déconstruire",
      teaser: "On entend souvent parler de questions pièges en entretien. Voici ce qu'une recruteuse en pense vraiment — et ce que ça change pour toi.",
      contenuPremium: [
        "📌 La réalité du terrain : de nos jours, les questions pièges sont de moins en moins utilisées, surtout lors d'un premier entretien. Elles appartiennent davantage au passé qu'aux pratiques actuelles.",
        "📌 Ma position est claire : je ne suis pas partisane des questions pièges. Le but d'un recrutement, c'est de trouver un futur collaborateur — pas de lui tendre des embûches. Commencer une relation professionnelle par un piège, ce n'est pas fair-play, et ça biaise les résultats.",
        "📌 Une question piège met le candidat en posture de méfiance, pas de confiance. Or c'est dans un climat de confiance qu'on obtient les réponses les plus authentiques — et donc les plus utiles pour évaluer un profil.",
        "📌 Ce qui existe en revanche : des questions qui invitent à la réflexion, qui sortent le candidat de sa zone de confort sans le piéger. La nuance est importante. L'objectif n'est pas de déstabiliser, c'est d'observer comment la personne pense et réagit.",
        "📌 Et surtout : en entretien, il n'y a pas de bonne ou de mauvaise réponse. Il y a uniquement les réponses liées au vécu professionnel du candidat. Un recruteur qui cherche 'la bonne réponse' passe à côté de l'essentiel.",
      ],
    },
    {
      titre: "Ce que j'observe vraiment quand tu parles",
      teaser: "Au-delà des mots, je regarde comment tu réponds. C'est souvent plus révélateur que le contenu lui-même.",
      contenuPremium: [
        "📌 La spontanéité des réponses est l'un de mes premiers indicateurs. Une réponse fluide, naturelle, qui vient sans hésitation excessive — c'est le signe que la personne a réellement vécu ce qu'elle décrit. Une réponse trop construite ou trop hésitante sur une tâche censée être maîtrisée, ça interpelle.",
        "📌 La façon de s'exprimer compte autant que le fond. Je n'attends pas un langage soutenu — j'attends de la clarté, de la cohérence, et une capacité à raconter son expérience avec des mots précis. Quelqu'un qui a vraiment fait le travail sait en parler.",
        "📌 Je creuse toujours là où ça résiste. Quand une réponse est vague ou générique, je pose une question de relance. La façon dont le candidat gère ce deuxième niveau de questionnement m'en dit beaucoup sur la réalité de son expérience.",
        "📌 Un bon signe que j'observe peu souvent : le candidat qui me donne envie de poser d'autres questions. Quand une réponse ouvre naturellement sur d'autres sujets, quand la conversation prend de la profondeur — c'est exactement ce que je cherche.",
        "📌 À l'inverse, un candidat qui ne suscite aucune curiosité supplémentaire chez moi a peu de chances de passer à la suite du processus. Ce n'est pas une question de sympathie — c'est une question de substance. Si tout est plat et fermé, il n'y a rien à creuser.",
      ],
    },
  ];

  const grilles = [
    {
      critere: "Alignement avec les attentes du poste",
      icone: "🎯",
      niveaux: [
        { note: "❌ Signal d'arrêt", desc: "Le candidat n'a pas compris ce que le poste implique réellement. Ses attentes et celles du client ne se croisent pas." },
        { note: "⚠️ Insuffisant", desc: "Il y a quelques points communs mais des décalages importants sur des critères clés — rémunération, missions, environnement de travail." },
        { note: "✅ Prometteur", desc: "Les attentes sont globalement alignées. Quelques points à clarifier mais rien de rédhibitoire." },
        { note: "⭐ Excellent", desc: "Le candidat a bien lu l'offre, comprend le contexte du client et ce qu'on attend de lui. Ses propres attentes sont cohérentes avec le poste." },
      ],
    },
    {
      critere: "Structure du discours et compréhension du poste",
      icone: "🗣️",
      niveaux: [
        { note: "❌ Signal d'arrêt", desc: "Le candidat parle de son parcours sans faire le lien avec le poste. Son discours est décousu, il ne se projette pas." },
        { note: "⚠️ Insuffisant", desc: "Le parcours est présenté mais de façon chronologique et mécanique, sans mise en perspective avec le poste visé." },
        { note: "✅ Prometteur", desc: "Le candidat structure correctement. On sent qu'il a compris les enjeux du poste et fait des liens avec son expérience." },
        { note: "⭐ Excellent", desc: "Le discours est fluide, ciblé, spontané. Le candidat se projette naturellement sur le poste et donne envie de poser d'autres questions." },
      ],
    },
    {
      critere: "Posture — profil junior",
      icone: "🌱",
      niveaux: [
        { note: "❌ Signal d'arrêt", desc: "Mutisme, incapacité à répondre aux questions de base, aucune projection possible même avec des relances bienveillantes." },
        { note: "⚠️ Insuffisant", desc: "Très hésitant(e), manque de clarté sur ses propres expériences, même courtes. Le stress prend le dessus sur le fond." },
        { note: "✅ Prometteur", desc: "Des hésitations normales pour un profil junior, mais une volonté de bien faire visible. Le fond compense la forme." },
        { note: "⭐ Excellent", desc: "Malgré peu d'expérience en entretien, le candidat est présent, à l'écoute, et sait valoriser ce qu'il a vécu. La posture inspire confiance." },
      ],
    },
    {
      critere: "Posture — profil confirmé",
      icone: "💼",
      niveaux: [
        { note: "❌ Signal d'arrêt", desc: "Manque de recul sur son propre parcours, arguments flous, incapacité à défendre ses choix de carrière. Pas à la hauteur du niveau attendu." },
        { note: "⚠️ Insuffisant", desc: "L'expérience est là mais le candidat ne sait pas la valoriser. Les réponses sont plates, sans structure ni conviction." },
        { note: "✅ Prometteur", desc: "Bonne maîtrise du fond, posture professionnelle. Quelques réponses manquent encore de précision ou de hauteur de vue." },
        { note: "⭐ Excellent", desc: "Discours structuré, arguments solides, posture assurée sans arrogance. Le candidat sait où il va et pourquoi. Il donne envie d'aller plus loin." },
      ],
    },
    {
      critere: "Adéquation personnalité / culture client",
      icone: "🤝",
      niveaux: [
        { note: "❌ Signal d'arrêt", desc: "La personnalité du candidat est clairement incompatible avec l'environnement du client — valeurs, mode de fonctionnement, style relationnel. L'entretien s'arrête là." },
        { note: "⚠️ Insuffisant", desc: "Quelques signaux qui interrogent. La personnalité ne semble pas naturellement alignée avec ce que le client recherche dans ses équipes." },
        { note: "✅ Prometteur", desc: "Le candidat semble pouvoir s'adapter à l'environnement du client. Pas de red flag, quelques points à valider avec le client directement." },
        { note: "⭐ Excellent", desc: "La personnalité colle parfaitement à ce que le client recherche — style de communication, valeurs, manière de travailler. C'est ce critère qui, souvent, fait la différence finale." },
      ],
    },
    {
      critere: "Réelle motivation à changer de poste",
      icone: "🔍",
      niveaux: [
        { note: "❌ Signal d'arrêt", desc: "Le candidat n'a pas de vraie raison de bouger. Il a mis son CV en ligne par réflexe ou par curiosité, sans intention réelle. Inutile d'aller plus loin — ce n'est pas le bon moment pour lui." },
        { note: "⚠️ Insuffisant", desc: "La motivation existe mais elle est floue ou principalement financière. Pas de réflexion sur le projet professionnel, pas d'urgence à changer. Le risque de désistement en cours de process est élevé." },
        { note: "✅ Prometteur", desc: "Le candidat a une raison claire de vouloir bouger. La démarche est sincère même si le projet n'est pas encore totalement arrêté." },
        { note: "⭐ Excellent", desc: "La motivation est réelle, réfléchie et ancrée dans un projet professionnel cohérent. Le candidat sait pourquoi il cherche, ce qu'il veut et pourquoi maintenant. C'est un candidat sérieux." },
      ],
    },
  ];

  const videos = [
    { titre: "Les 5 erreurs qui te font éliminer en 30 secondes", duree: "8 min", niveau: "Tous niveaux" },
    { titre: "Comment négocier ton salaire sans te dévaloriser", duree: "12 min", niveau: "Intermédiaire" },
    { titre: "Décoder une offre d'emploi comme un recruteur", duree: "6 min", niveau: "Tous niveaux" },
    { titre: "Gérer le stress avant et pendant l'entretien", duree: "10 min", niveau: "Tous niveaux" },
    { titre: "LinkedIn : les paramètres que 90% des candidats ignorent", duree: "9 min", niveau: "Tous niveaux" },
  ];

  if (activeContent) {
    const item = activeContent.type === "coulisse"
      ? coulisses.find(c => c.titre === activeContent.id)
      : grilles.find(g => g.critere === activeContent.id);

    return (
      <div>
        <button onClick={() => setActiveContent(null)} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 14, marginBottom: 16, fontFamily: "inherit" }}>← Retour</button>

        {activeContent.type === "coulisse" && item && (
          <div>
            <h3 style={{ color: "#FFD700", fontWeight: 900, fontSize: 19, marginBottom: 8, lineHeight: 1.4 }}>{item.titre}</h3>
            <Card style={{ background: "#FFD70011", borderColor: "#FFD70044", marginBottom: 20 }}>
              <p style={{ color: COLORS.muted, fontStyle: "italic", margin: 0, fontSize: 14, lineHeight: 1.6 }}>"{item.teaser}"</p>
            </Card>
            <Card style={{ background: "#1A1A2E", borderColor: "#FFD70044" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>🤫</span>
                <span style={{ color: "#FFD700", fontWeight: 900, fontSize: 15 }}>Ce que les recruteurs ne disent jamais</span>
              </div>
              {item.contenuPremium.map((point, i) => (
                <div key={i} style={{ padding: "12px 0", borderBottom: i < item.contenuPremium.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                  <p style={{ color: COLORS.text, fontSize: 14, margin: 0, lineHeight: 1.7 }}>{point}</p>
                </div>
              ))}
            </Card>
          </div>
        )}

        {activeContent.type === "grille" && item && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 26 }}>{item.icone}</span>
              <h3 style={{ color: "#FFD700", fontWeight: 900, fontSize: 19, margin: 0 }}>{item.critere}</h3>
            </div>
            {item.niveaux.map((n, i) => (
              <Card key={i} style={{ marginBottom: 12, borderColor: i === 3 ? "#FFD70044" : i === 0 ? "#FF6B3544" : COLORS.border }}>
                <div style={{ color: i === 3 ? "#FFD700" : i === 0 ? "#FF6B35" : i === 1 ? "#FF9944" : "#00D9A3", fontWeight: 800, marginBottom: 6, fontSize: 14 }}>{n.note}</div>
                <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.6 }}>{n.desc}</div>
              </Card>
            ))}
            <Card style={{ background: "#FFD70011", borderColor: "#FFD70044", marginTop: 8 }}>
              <p style={{ color: "#FFD700", fontSize: 13, fontWeight: 600, margin: 0 }}>💡 Ce critère est évalué dès les premières minutes de l'entretien. Soigne-le avant même de répondre à la première question.</p>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 14, marginBottom: 16, fontFamily: "inherit" }}>← Retour</button>
      <h2 style={{ color: "#FFD700", fontSize: 26, fontWeight: 900, marginBottom: 4 }}>⭐ Espace Expert</h2>
      <p style={{ color: COLORS.muted, marginBottom: 20 }}>Ce que les recruteurs ne te diront jamais</p>

      {!isPremium ? (
        <div>
          <Card style={{ background: "linear-gradient(135deg, #FFD70011, #FF6B3511)", borderColor: "#FFD70055", marginBottom: 24, textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 8 }}>🔒</div>
            <h3 style={{ color: "#FFD700", fontWeight: 900, marginBottom: 8 }}>Contenu exclusif</h3>
            <p style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.6, marginBottom: 0 }}>
              Ce que tu trouves ici ne vient pas d'une IA ni d'un article générique. C'est l'expérience brute d'une recruteuse qui a évalué des milliers de candidats dans l'industrie, les services techniques et les métiers commerciaux.
            </p>
          </Card>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
            {offres.map(o => (
              <Card key={o.id} style={{ borderColor: o.couleur + "55", position: "relative", overflow: "hidden" }}>
                {o.badge && (
                  <div style={{ position: "absolute", top: 12, right: 12, background: o.couleur, color: "#FFFFFF", borderRadius: 99, padding: "3px 10px", fontSize: 11, fontWeight: 900 }}>{o.badge}</div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <span style={{ color: o.couleur, fontWeight: 900, fontSize: 17, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: 1 }}>{o.nom}</span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: COLORS.text, fontWeight: 800, fontSize: 16 }}>{o.prix}</div>
                    {o.facturation && <div style={{ color: COLORS.muted, fontSize: 11 }}>{o.facturation}</div>}
                  </div>
                </div>
                <p style={{ color: COLORS.muted, fontSize: 13, fontStyle: "italic", marginBottom: 14, lineHeight: 1.5 }}>{o.description}</p>
                {o.contenu.map((c, i) => (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <span style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6 }}>{c}</span>
                  </div>
                ))}
                {o.note && (
                  <div style={{ background: o.couleur + "11", border: `1px solid ${o.couleur}33`, borderRadius: 8, padding: "8px 12px", marginTop: 10 }}>
                    <span style={{ color: o.couleur, fontSize: 12, fontWeight: 600 }}>{o.note}</span>
                    {o.ratio && <div style={{ color: o.couleur, fontSize: 12, fontWeight: 700, marginTop: 4, opacity: 0.85 }}>💡 {o.ratio}</div>}
                  </div>
                )}
                <div style={{ marginTop: 14 }}>
                  <Btn onClick={onUnlock} color={o.couleur} style={{ width: "100%", fontSize: 14 }}>
                    {o.prix === "Sur devis" ? "Nous contacter" : `Débloquer — ${o.prix}`}
                  </Btn>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <Card style={{ background: "#FFD70011", borderColor: "#FFD70044", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>✅</span>
              <div>
                <div style={{ color: "#FFD700", fontWeight: 900 }}>Accès Premium actif</div>
                <div style={{ color: COLORS.muted, fontSize: 13 }}>Tout le contenu expert est débloqué</div>
              </div>
            </div>
          </Card>

          {/* Coulisses */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 20 }}>🤫</span>
              <h3 style={{ color: "#FFD700", fontWeight: 900, fontSize: 17, margin: 0 }}>Coulisses du recrutement</h3>
            </div>
            {coulisses.map((c, i) => (
              <Card key={i} style={{ marginBottom: 12, cursor: "pointer", borderColor: "#FFD70033" }} onClick={() => setActiveContent({ type: "coulisse", id: c.titre })}>
                <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 14, marginBottom: 6, lineHeight: 1.4 }}>{c.titre}</div>
                <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.5, marginBottom: 10 }}>{c.teaser}</div>
                <span style={{ color: "#FFD700", fontSize: 13, fontWeight: 700 }}>Lire l'analyse →</span>
              </Card>
            ))}
          </div>

          {/* Grilles recruteur */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 20 }}>📋</span>
              <h3 style={{ color: "#FFD700", fontWeight: 900, fontSize: 17, margin: 0 }}>Grilles d'évaluation recruteur</h3>
            </div>
            <Card style={{ background: "#FFD70011", borderColor: "#FFD70044", marginBottom: 14 }}>
              <p style={{ color: "#FFD700", fontSize: 13, fontWeight: 600, margin: 0 }}>Ce sont les critères réels utilisés pour te noter pendant un entretien. Connais-les avant d'y aller.</p>
            </Card>
            {grilles.map((g, i) => (
              <Card key={i} style={{ marginBottom: 12, cursor: "pointer", borderColor: "#FFD70033" }} onClick={() => setActiveContent({ type: "grille", id: g.critere })}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 20 }}>{g.icone}</span>
                  <span style={{ color: COLORS.text, fontWeight: 700, fontSize: 14 }}>{g.critere}</span>
                </div>
                <span style={{ color: "#FFD700", fontSize: 13, fontWeight: 700 }}>Voir la grille →</span>
              </Card>
            ))}
          </div>

          {/* Vidéos */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 20 }}>🎥</span>
              <h3 style={{ color: "#00D9A3", fontWeight: 900, fontSize: 17, margin: 0 }}>Vidéos & conseils experts</h3>
            </div>
            {videos.map((v, i) => (
              <Card key={i} style={{ marginBottom: 12, borderColor: "#00D9A333" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 14, marginBottom: 6, lineHeight: 1.4 }}>{v.titre}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Badge label={v.duree} color="#00D9A3" />
                      <Badge label={v.niveau} color={COLORS.muted} />
                    </div>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#00D9A322", border: `1px solid #00D9A355`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, cursor: "pointer" }}>▶️</div>
                </div>
              </Card>
            ))}
            <Card style={{ background: "#00D9A311", borderColor: "#00D9A344" }}>
              <p style={{ color: "#00D9A3", fontSize: 13, fontWeight: 600, margin: 0 }}>🎥 Les vidéos seront disponibles dès la mise en ligne officielle de l'app.</p>
            </Card>
          </div>

          {/* Coaching */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 20 }}>📞</span>
              <h3 style={{ color: "#FF6B35", fontWeight: 900, fontSize: 17, margin: 0 }}>Coaching 1-1</h3>
            </div>
            <Card style={{ borderColor: "#FF6B3555" }}>
              <p style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
                Le coaching 1-1 s'adresse à des profils précis — ceux qui ont besoin d'un regard expert et bienveillant à un moment charnière de leur parcours.
              </p>
              <Card style={{ background: "#FF6B3511", borderColor: "#FF6B3544", marginBottom: 16 }}>
                <p style={{ color: "#FF6B35", fontSize: 13, fontWeight: 700, margin: "0 0 10px" }}>Ce coaching est fait pour toi si :</p>
                {[
                  "Tu cherches ton premier emploi après une alternance ou des études et tu ne sais pas par où commencer.",
                  "Tu es en reconversion professionnelle et tu n'as pas passé d'entretien depuis longtemps — les codes ont changé.",
                  "Tu n'as pas fait de recherche active depuis plusieurs années et tu veux te remettre en confiance avant de te lancer.",
                  "Tu doutes de ta posture en entretien et tu veux un regard extérieur pour identifier ce qui coince et comment le corriger.",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: i < 3 ? 8 : 0 }}>
                    <span style={{ color: "#FF6B35", fontWeight: 900, flexShrink: 0, fontSize: 13 }}>→</span>
                    <span style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </Card>
              <p style={{ color: "#FF6B35", fontSize: 14, fontWeight: 800, margin: "0 0 10px" }}>Ce qu'on travaille ensemble :</p>
              <div style={{ marginBottom: 14 }}>
                {[
                  "La perception de soi : comment tu te vois, et comment tu dois être perçu(e) par le recruteur en face. Ces deux images ne sont pas toujours alignées — c'est souvent là que tout se joue.",
                  "Le discours en entretien : construire une présentation claire, structurée, qui parle le bon langage. Chaque secteur a son vocabulaire — utiliser les bons mots montre que tu appartiens au milieu.",
                  "Le registre de langage : exit le vocabulaire familier, l'argot et les tics de langage. Ce sont des signaux faibles qui fragilisent une candidature sans que le candidat s'en rende compte.",
                  "La posture globale : travailler la façon de se tenir, de répondre, de gérer le silence — pour que la forme soit à la hauteur du fond.",
                ].map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                    <span style={{ color: "#FF6B35", fontWeight: 900, flexShrink: 0 }}>✓</span>
                    <span style={{ color: COLORS.muted, fontSize: 14 }}>{p}</span>
                  </div>
                ))}
              </div>
              <Btn color="#FF6B35" style={{ width: "100%" }} onClick={() => {}}>Réserver une session →</Btn>
            </Card>
          </div>

          {/* Sessions collectives */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 20 }}>👥</span>
              <h3 style={{ color: "#FFD700", fontWeight: 500, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, letterSpacing: 1, margin: 0 }}>Sessions collectives</h3>
            </div>
            <Card style={{ background: "#FFD70011", borderColor: "#FFD70033" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ color: "#FFD700", fontWeight: 700, fontSize: 15 }}>Plan Suivi — inclus</span>
                <Badge label="2 / mois" color="#FFD700" />
              </div>
              <p style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>
                Chaque mois, deux sessions collectives en visio avec l'experte — 6 à 10 personnes max, format questions/réponses. Tu poses tes questions sur ton secteur, ton CV, tes entretiens en cours. Un espace pour avancer ensemble sans être seul(e).
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                {["Format 60 min — questions/réponses en direct", "6 à 10 participants maximum pour garder la qualité", "Animées par l'experte en recrutement ou un consultant certifié Mahay", "Replay disponible pour les absents"].map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: "#FFD700", flexShrink: 0 }}>✓</span>
                    <span style={{ color: COLORS.muted, fontSize: 13 }}>{p}</span>
                  </div>
                ))}
              </div>
              <Btn color="#FFD700" style={{ width: "100%" }} onClick={() => {}}>Voir les prochaines sessions →</Btn>
            </Card>
          </div>

          {/* Communauté */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 20 }}>💬</span>
              <h3 style={{ color: "#FF6B35", fontWeight: 500, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, letterSpacing: 1, margin: 0 }}>Communauté privée</h3>
            </div>
            <Card style={{ borderColor: "#FF6B3555" }}>
              <p style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                La communauté Mahay Prep est accessible à tous les abonnés — dès le plan Essentiel. Deux formats complémentaires sur WhatsApp pour ne jamais chercher seul(e).
              </p>

              {/* Canal WhatsApp */}
              <div style={{ background: "#FF6B3511", border: "1px solid #FF6B3533", borderRadius: 14, padding: "14px 16px", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 22 }}>📢</span>
                  <span style={{ color: "#FF6B35", fontWeight: 700, fontSize: 15 }}>Canal Mahay Prep</span>
                </div>
                <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6, margin: "0 0 4px" }}>
                  Tu reçois directement les conseils, les coulisses du recrutement et les actualités du cabinet. Un flux de contenu exclusif, diffusé par l'experte.
                </p>
                <p style={{ color: COLORS.muted, fontSize: 12, fontStyle: "italic", margin: 0 }}>Format canal — tu lis, tu ne réponds pas.</p>
              </div>

              {/* Groupe WhatsApp */}
              <div style={{ background: "#FF6B3511", border: "1px solid #FF6B3533", borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 22 }}>💬</span>
                  <span style={{ color: "#FF6B35", fontWeight: 700, fontSize: 15 }}>Groupe d'entraide</span>
                </div>
                <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6, margin: "0 0 4px" }}>
                  Un groupe privé entre membres premium pour partager tes retours d'entretiens, poser tes questions et avancer entouré(e). L'experte intervient régulièrement.
                </p>
                <p style={{ color: COLORS.muted, fontSize: 12, fontStyle: "italic", margin: 0 }}>Accessible dès le plan Essentiel — sur validation.</p>
              </div>

              <Btn color="#FF6B35" style={{ width: "100%" }} onClick={() => {}}>Rejoindre la communauté WhatsApp →</Btn>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function SimulateurCVScreen({ onBack, onXP }) {
  const [step, setStep] = useState("secteur");
  const [secteur, setSecteur] = useState(null);
  const [reponses, setReponses] = useState({});
  const [resultat, setResultat] = useState(null);
  const [awarded, setAwarded] = useState(false);

  const secteursTech = [
    { id: "meca", label: "Maintenance mécanique", icon: "⚙️", color: "#FF6B35" },
    { id: "indus", label: "Maintenance industrielle", icon: "🏭", color: "#FFD700" },
    { id: "clim", label: "Génie climatique", icon: "❄️", color: "#5BC8D4" },
    { id: "prod", label: "Production industrielle", icon: "🔩", color: "#E8963A" },
  ];

  const questions = {
    meca: [
      {
        id: "titre", categorie: "Présentation générale",
        question: "Ton titre de poste apparaît-il clairement en haut du CV ?",
        detail: "Ex : Technicien de maintenance, Technicien SAV, Mécanicien, Technicien itinérant",
        tip: "Ajoute ton titre exact juste sous ton nom. Le recruteur doit identifier ton métier en moins de 3 secondes."
      },
      {
        id: "coordonnees", categorie: "Présentation générale",
        question: "Tes coordonnées complètes sont-elles visibles ? (téléphone + email)",
        tip: "Place tes coordonnées juste sous ton nom et prénom. Un recruteur qui ne trouve pas ton numéro passe au suivant."
      },
      {
        id: "permis", categorie: "Présentation générale",
        question: "As-tu mentionné ton permis de conduire (A, B ou autre) ?",
        tip: "Le permis B est obligatoire pour la plupart des postes en maintenance. Mentionne-le explicitement dans ta présentation ou dans le bloc compétences."
      },
      {
        id: "photo", categorie: "Présentation générale",
        question: "Si tu as une photo, est-elle neutre et professionnelle ?",
        detail: "Fond neutre, tenue correcte. Pas de photo de soirée, de cérémonie ou de selfie.",
        tip: "Si tu n'as pas de photo professionnelle, mieux vaut ne pas en mettre du tout."
      },
      {
        id: "competences_premier", categorie: "Expériences professionnelles",
        question: "Ton bloc COMPÉTENCES apparaît-il AVANT tes expériences ?",
        tip: "Les recruteurs en maintenance technique regardent d'abord ce que tu sais faire. Place tes compétences en premier bloc, avant le détail de tes expériences."
      },
      {
        id: "experiences_ordre", categorie: "Expériences professionnelles",
        question: "Tes expériences sont-elles présentées du plus récent au plus ancien ?",
        tip: "Commence toujours par ton poste actuel ou le plus récent. Plus tu recules dans le temps, moins tu as besoin de détailler."
      },
      {
        id: "details_missions", categorie: "Expériences professionnelles",
        question: "Chaque expérience récente décrit-elle les équipements sur lesquels tu as travaillé ?",
        detail: "Type de machines, marques d'engins, environnement technique (mécanique lourde, légère, hydraulique...)",
        tip: "En 2-3 lignes par poste : 'Maintenance préventive et curative sur engins de chantier (Caterpillar, Komatsu), intervention sur systèmes hydrauliques et moteurs diesel.'"
      },
      {
        id: "type_contrat", categorie: "Expériences professionnelles",
        question: "Le type de contrat est-il indiqué pour chaque expérience ? (CDI, CDD, intérim, alternance...)",
        tip: "Précise toujours le type de contrat. Un CDI de 5 ans montre ta stabilité. Une alternance montre ta formation terrain."
      },
      {
        id: "mecanique", categorie: "Compétences techniques",
        question: "La mécanique apparaît-elle explicitement dans ton bloc compétences ?",
        tip: "C'est une compétence OBLIGATOIRE pour ce type de poste. Si elle n'apparaît pas, le recruteur ne peut pas valider ton profil."
      },
      {
        id: "habilitations", categorie: "Compétences techniques",
        question: "As-tu listé tes habilitations et certifications ? (électrique, CACES, etc.)",
        tip: "Les habilitations électriques (B1, BR, BC...) sont un vrai différenciateur. Liste-les avec leur niveau exact."
      },
      {
        id: "hydraulique", categorie: "Compétences techniques",
        question: "As-tu mentionné tes connaissances en hydraulique si tu en as ?",
        tip: "Même des notions de base en hydraulique sont appréciées. Si tu maîtrises, indique-le clairement : 'Lecture de schémas hydrauliques, dépannage circuits basse/haute pression.'"
      },
      {
        id: "coherence", categorie: "Cohérence avec le poste visé",
        question: "As-tu une expérience dans un secteur ou sur des équipements similaires au poste visé ?",
        tip: "Mets en avant les environnements techniques proches du poste. Un recruteur qui voit qu'il a travaillé chez un concurrent ou sur les mêmes machines passe automatiquement à l'étape suivante."
      },
      {
        id: "diplome", categorie: "Cohérence avec le poste visé",
        question: "As-tu un diplôme ou une formation en lien avec la maintenance mécanique ?",
        detail: "Bac Pro MEI, BTS Maintenance, CAP mécanique, CFAI, formation interne qualifiante...",
        tip: "Même une formation interne ou un titre professionnel compte. Mentionne-le avec l'année d'obtention."
      },
    ],
    indus: [
      { id: "titre", categorie: "Présentation générale", question: "Ton titre de poste est-il visible en haut du CV ?", detail: "Ex : Technicien de maintenance industrielle, Technicien de maintenance, Agent de maintenance, Technicien électromécanique", tip: "Le titre doit être immédiatement lisible. Place-le sous ton nom. Précise ta spécialité si tu en as une (électrique, automatisme, mécanique)." },
      { id: "coordonnees", categorie: "Présentation générale", question: "Tes coordonnées complètes apparaissent-elles ? (téléphone + email)", tip: "Indispensable. Sans coordonnées claires, pas de contact possible." },
      { id: "permis", categorie: "Présentation générale", question: "Le permis B est-il mentionné ?", tip: "Obligatoire pour la majorité des postes en maintenance industrielle. À indiquer dans la présentation ou dans le bloc compétences." },
      { id: "photo", categorie: "Présentation générale", question: "Si tu as une photo, est-elle neutre et professionnelle ?", detail: "Fond neutre, tenue correcte. Pas de photo de soirée ou de selfie.", tip: "Si tu n'as pas de photo professionnelle, mieux vaut ne pas en mettre du tout." },
      { id: "competences_premier", categorie: "Expériences professionnelles", question: "Ton bloc COMPÉTENCES apparaît-il AVANT tes expériences ?", tip: "En maintenance industrielle, les compétences techniques priment. Place-les en premier bloc : environnements maîtrisés, logiciels, habilitations." },
      { id: "experiences_ordre", categorie: "Expériences professionnelles", question: "Tes expériences sont-elles présentées du plus récent au plus ancien ?", tip: "Commence toujours par ton poste actuel ou le plus récent. Plus tu recules dans le temps, moins tu as besoin de détailler — sauf si c'est pertinent pour le poste visé." },
      { id: "type_machine", categorie: "Expériences professionnelles", question: "As-tu précisé les types de machines et équipements sur lesquels tu es intervenu ?", detail: "Lignes de production, automates, chaînes de froid, convoyeurs, robots, compresseurs, pompes, infrastructure (électricité, plomberie, CVC)...", tip: "Cite le type d'équipement ET la marque si possible. Ex : 'Maintenance curative sur automates Siemens S7, lignes de conditionnement Coesia, compresseurs Atlas Copco.' C'est ce qui valide ton expérience concrète." },
      { id: "type_contrat", categorie: "Expériences professionnelles", question: "Le type de contrat est-il indiqué pour chaque expérience ? (CDI, CDD, intérim, alternance...)", tip: "Précise toujours le type de contrat. Un CDI de plusieurs années montre ta stabilité et ton intégration réussie." },
      { id: "missions_detail", categorie: "Expériences professionnelles", question: "As-tu décrit tes missions en 2-3 lignes pour chaque poste récent ?", detail: "Type d'intervention (préventive, curative, amélioratrice), équipements, environnement technique...", tip: "Ex : 'Maintenance préventive et curative sur lignes de production agroalimentaire — électricité industrielle, pneumatique, mécanique — utilisation GMAO Maximo.' Concret et structuré." },
      { id: "env_electrique", categorie: "Compétences techniques", question: "As-tu précisé ton niveau en électricité industrielle ?", detail: "Lecture de schémas électriques, câblage armoires, dépannage moteurs, variateurs de vitesse...", tip: "L'électricité industrielle est une compétence fondamentale en maintenance. Précise ce que tu sais faire : lecture de schémas, câblage, dépannage. Si tu as les habilitations électriques, indique leur niveau (B1, BR, BC...)." },
      { id: "env_automatisme", categorie: "Compétences techniques", question: "As-tu mentionné tes compétences en automatisme ?", detail: "Programmation ou supervision d'automates (Siemens S7/TIA Portal, Schneider Unity/EcoStruxure, Allen Bradley...)", tip: "Même des notions de base en automatisme sont valorisées. Si tu sais lire un programme ladder ou intervenir sur un pupitre opérateur, dis-le. La maîtrise d'un logiciel de supervision (WinCC, Intouch, Vijeo...) est un vrai plus." },
      { id: "env_mecanique", categorie: "Compétences techniques", question: "As-tu précisé tes compétences en mécanique industrielle ?", detail: "Roulements, accouplements, réducteurs, courroies, pneumatique, hydraulique...", tip: "La mécanique est souvent la base du profil. Précise les domaines : pneumatique, hydraulique, mécanique générale, lecture de plans... Plus c'est détaillé, plus tu es crédible." },
      { id: "gmao", categorie: "Compétences techniques", question: "As-tu mentionné les logiciels GMAO ou de supervision utilisés ?", detail: "GMAO : SAP PM, Maximo, Coswin, Infor, Carl... Supervision : WinCC, Intouch, Vijeo Citect, iFix...", tip: "La GMAO est aujourd'hui incontournable en maintenance industrielle. Si tu en as utilisé une, indique-la avec ton niveau de maîtrise. Un recruteur utilisant SAP sera rassuré de voir que tu le connais." },
      { id: "preventive_curative", categorie: "Compétences techniques", question: "As-tu mentionné la maintenance préventive ET curative ?", tip: "Les deux types de maintenance doivent apparaître sur le CV. La préventive montre ton organisation, la curative montre ta réactivité face aux pannes." },
      { id: "habilitations", categorie: "Compétences techniques", question: "Tes habilitations sont-elles listées avec leur niveau ? (électrique, CACES, travail en hauteur...)", tip: "Les habilitations électriques (B1V, BR, BC...) et le CACES sont très demandés. Liste-les avec leur niveau exact et leur date de validité." },
      { id: "coherence", categorie: "Cohérence avec le poste visé", question: "As-tu une expérience dans un secteur industriel similaire au poste visé ?", detail: "Agroalimentaire, automobile, chimie, pharmaceutique, plasturgie, métallurgie, logistique...", tip: "Un recruteur dans l'agroalimentaire sera directement rassuré par une expérience dans le même secteur. Si c'est ton cas, mets-le en avant dès la première ligne de chaque expérience concernée." },
      { id: "diplome", categorie: "Cohérence avec le poste visé", question: "As-tu un diplôme ou une formation en lien avec la maintenance industrielle ?", detail: "BTS MAI, BTS MI, BTS Électrotechnique, Bac Pro MSMA/MEI/ELEEC, Licence pro maintenance, titre professionnel...", tip: "Indique ton diplôme avec l'année et l'établissement. Une formation continue certifiante (AFPA, GRETA, CFA industriel) compte autant qu'un diplôme initial." },
    ],
    clim: [
      { id: "titre", categorie: "Présentation générale", question: "Ton titre de poste apparaît-il clairement en haut du CV ?", detail: "Ex : Technicien frigoriste, Technicien CVC, Technicien génie climatique, Monteur-dépanneur froid commercial/industriel", tip: "Précise ta spécialité dans le titre si possible : froid commercial, froid industriel, climatisation, CVC... Le recruteur doit identifier ton cœur de métier en 3 secondes." },
      { id: "coordonnees", categorie: "Présentation générale", question: "Tes coordonnées complètes sont-elles visibles ? (téléphone + email)", tip: "Indispensable. Ajoute aussi ta ville — pour les postes itinérants, la localisation géographique compte." },
      { id: "permis", categorie: "Présentation générale", question: "Le permis B est-il mentionné ?", tip: "Obligatoire en génie climatique — les techniciens interviennent chez les clients avec un véhicule de service. À mentionner dans la présentation ou dans le bloc compétences." },
      { id: "attestation_fluides", categorie: "Compétences techniques", question: "As-tu mentionné ton attestation de manipulation des fluides frigorigènes ?", detail: "Catégorie I (tous fluides, y compris HFO et HC) ou Catégorie II (fluides HFC uniquement)", tip: "C'est LA certification réglementaire OBLIGATOIRE pour intervenir sur les circuits frigorifiques. Son absence sur un CV de frigoriste est rédhibitoire. Si tu es en cours d'obtention, indique-le explicitement." },
      { id: "habilitations", categorie: "Compétences techniques", question: "As-tu listé toutes tes habilitations et certificats d'aptitude ?", detail: "Habilitations électriques, CACES nacelle, travail en hauteur, espace confiné, habilitation fluides...", tip: "Chaque habilitation montre que tu exerces en connaissance des impératifs réglementaires de ton métier. Liste-les toutes avec leur niveau et leur date de validité. C'est un signal fort de professionnalisme." },
      { id: "securite", categorie: "Compétences techniques", question: "As-tu mentionné la notion de sécurité au travail ou les EPI utilisés ?", detail: "Respect des consignes de sécurité, port des EPI, intervention en zones à risques, procédures de consignation...", tip: "Le génie climatique est un métier dangereux (risque électrique, fluides sous pression, travail en hauteur, espaces confinés). Un candidat qui mentionne la sécurité montre qu'il a conscience des risques. C'est rare et très apprécié." },
      { id: "equipements", categorie: "Compétences techniques", question: "As-tu listé les équipements et marques sur lesquels tu es intervenu ?", detail: "Groupes froids (Carrier, Trane, Climaveneta), VRV/VRF (Daikin, Mitsubishi, LG), PAC, CTA, chaudières (De Dietrich, Viessmann, Atlantic)...", tip: "Cite les marques et types d'équipements précisément. Un recruteur qui utilise Daikin sera rassuré de voir que tu connais ces équipements." },
      { id: "type_froid", categorie: "Expériences professionnelles", question: "As-tu précisé ton orientation : froid commercial, froid industriel ou tertiaire/collectivité ?", detail: "Froid commercial : supermarchés, linéaires de froid, aéroports, centrales d'achat. Froid industriel : industries agroalimentaires, pharmaceutiques, logistique du froid. Tertiaire : bureaux, hôtels, collectivités.", tip: "C'est le premier élément que le recruteur regarde pour situer ton profil. Précise clairement dans chaque expérience le type de clients ou d'environnement. Un parcours mixte (commercial + industriel) est un vrai atout — mets-le en avant." },
      { id: "type_client", categorie: "Expériences professionnelles", question: "As-tu indiqué le type de clients ou de sites sur lesquels tu es intervenu ?", detail: "Supermarchés, hypermarchés, aéroports, centrales électriques, usines agroalimentaires, entrepôts frigorifiques, hôpitaux, hôtels...", tip: "Le type de client qualifie directement ton expérience terrain. Un technicien habitué aux interventions en supermarché sait gérer les contraintes d'ouverture et l'urgence. Cite des exemples concrets de sites ou d'enseignes si possible." },
      { id: "astreintes", categorie: "Expériences professionnelles", question: "As-tu mentionné les astreintes sur ton CV ?", tip: "Les astreintes sont quasi-systématiques en génie climatique, surtout en froid commercial. Les mentionner montre que tu es opérationnel(le) sur ce rythme et que tu l'acceptes. C'est un critère de sélection important pour beaucoup de postes." },
      { id: "type_intervention", categorie: "Expériences professionnelles", question: "As-tu précisé les types d'interventions effectuées ?", detail: "Installation, mise en service, maintenance préventive, dépannage, suivi de contrats de maintenance...", tip: "Distingue clairement installation, mise en service, maintenance et dépannage. Chaque type d'intervention a sa valeur. Un profil orienté dépannage n'est pas le même qu'un profil installation." },
      { id: "coherence", categorie: "Cohérence avec le poste visé", question: "Ton parcours montre-t-il une expérience dans le froid ou le génie climatique ?", tip: "Les métiers du froid sont en tension — si tu as une expérience dans le domaine, quelle que soit la spécialité (commercial, industriel, tertiaire), tu as les bases pour t'adapter. Mets en avant ta polyvalence et ta motivation à monter en compétence sur une nouvelle spécialité si besoin." },
      { id: "diplome", categorie: "Cohérence avec le poste visé", question: "As-tu mentionné tes diplômes et formations en génie climatique ?", detail: "CAP Froid et climatisation, Bac Pro TMSEC, BTS FED, BTS Fluides énergies domotique, Licence pro, titre professionnel monteur-dépanneur frigoriste...", tip: "Le diplôme est le premier critère que je regarde sur un CV de frigoriste — il valide la formation de base. Indique-le avec l'année et l'établissement. Les formations continues (AFPAC, recyclage fluides...) comptent aussi." },
    ],
    prod: [
      { id: "titre", categorie: "Présentation générale", question: "Ton titre de poste est-il visible en haut du CV ?", detail: "Ex : Opérateur de production, Conducteur de ligne, Agent de fabrication, Opérateur régleur, Agent de conditionnement", tip: "Précise ton niveau exact (opérateur, conducteur, régleur) — ce n'est pas le même profil pour le recruteur. Place-le juste sous ton nom." },
      { id: "coordonnees", categorie: "Présentation générale", question: "Tes coordonnées complètes sont-elles visibles ? (téléphone + email)", tip: "Indispensable. Sans coordonnées claires, le recruteur ne peut pas te contacter. Place-les juste sous ton nom et prénom." },
      { id: "permis", categorie: "Présentation générale", question: "As-tu mentionné ton permis de conduire si tu en as un ?", tip: "Selon le poste, le permis B peut être requis. Mentionne-le dans ta présentation ou dans le bloc compétences." },
      { id: "photo", categorie: "Présentation générale", question: "Si tu as une photo, est-elle neutre et professionnelle ?", detail: "Fond neutre, tenue correcte. Pas de photo de soirée, de cérémonie ou de selfie.", tip: "Si tu n'as pas de photo professionnelle, mieux vaut ne pas en mettre du tout." },
      { id: "competences_premier", categorie: "Expériences professionnelles", question: "Ton bloc COMPÉTENCES apparaît-il AVANT tes expériences ?", tip: "Place tes compétences techniques en premier — machines maîtrisées, CACES, habilitations. C'est ce que le recruteur cherche en priorité." },
      { id: "experiences_ordre", categorie: "Expériences professionnelles", question: "Tes expériences sont-elles présentées du plus récent au plus ancien ?", tip: "Commence toujours par ton poste actuel ou le plus récent. Plus tu recules dans le temps, moins tu as besoin de détailler." },
      { id: "secteur_industrie", categorie: "Expériences professionnelles", question: "As-tu précisé le secteur d'activité de chaque entreprise ?", detail: "Agroalimentaire, métallurgie, automobile, plasturgie, chimie, pharmaceutique, cosmétique, électronique...", tip: "C'est un critère clé en production : le recruteur cherche quelqu'un qui connaît son secteur. Si tu as travaillé dans le même secteur que le poste visé, mets-le en avant dès la première ligne de chaque expérience." },
      { id: "type_contrat", categorie: "Expériences professionnelles", question: "Le type de contrat est-il indiqué pour chaque expérience ? (CDI, CDD, intérim, alternance...)", tip: "Précise toujours le type de contrat. Un CDI de 3 ans montre ta stabilité et ton intégration réussie." },
      { id: "missions_detail", categorie: "Expériences professionnelles", question: "As-tu décrit tes missions en 2-3 lignes pour chaque poste récent ?", detail: "Type de production, équipements conduits, cadences, rôle dans la qualité...", tip: "Ex : 'Conduite de ligne de conditionnement automatisée (1 200 unités/h), contrôle qualité en autocontrôle, respect des procédures HACCP.' Concret et chiffré, c'est ce qui convainc." },
      { id: "type_machine", categorie: "Expériences professionnelles", question: "As-tu précisé le type de machines ou de lignes de production sur lesquelles tu as travaillé ?", detail: "Ex : ligne d'embouteillage, ligne de découpe, presse à injection, ligne de conditionnement, machine de soudure, robot de palettisation...", tip: "Le type de machine est un critère de sélection direct. Un recruteur qui cherche quelqu'un habitué aux lignes automatisées de grande cadence ne retient pas le même profil que pour une production artisanale. Sois précis sur l'équipement et la marque si possible." },
      { id: "cadence", categorie: "Expériences professionnelles", question: "As-tu indiqué les cadences ou volumes de production que tu as tenus ?", detail: "Ex : 5 000 boîtes/jour en conserverie, 300 pièces/h en injection plastique, 30 réparations/jour en SAV électronique...", tip: "Le volume produit dit beaucoup sur l'environnement de travail. Une cadence élevée montre que tu sais gérer la pression et le rythme. Chiffre tes expériences : unités produites, pièces usinées, colis conditionnés... c'est concret et vérifiable." },
      { id: "horaires", categorie: "Expériences professionnelles", question: "As-tu mentionné les horaires pratiqués ? (2x8, 3x8, nuit, week-end)", tip: "La flexibilité horaire est très recherchée. Indique clairement les rythmes que tu as pratiqués et que tu acceptes." },
      { id: "caces", categorie: "Compétences techniques", question: "As-tu listé tes CACES si tu en possèdes ?", detail: "CACES R489 (chariots cat. 1, 3, 5), R484 (ponts roulants), R486 (nacelles)...", tip: "Liste tes CACES avec leur catégorie et leur date de validité. Un CACES valide est un critère de sélection direct pour beaucoup de postes." },
      { id: "machines", categorie: "Compétences techniques", question: "As-tu mentionné les machines et équipements que tu sais conduire ?", tip: "Cite les équipements précis : ligne d'embouteillage, presse injection, machine de découpe, robot de soudure... Plus c'est spécifique, plus c'est crédible." },
      { id: "qualite", categorie: "Compétences techniques", question: "As-tu mentionné les normes qualité ou process que tu maîtrises ?", detail: "HACCP, BPF, ISO 9001, 5S, autocontrôle, SPC...", tip: "Les normes qualité sont très valorisées, surtout en agroalimentaire et pharmaceutique. Mentionne celles que tu connais même si c'est basique." },
      { id: "coherence_secteur", categorie: "Cohérence avec le poste visé", question: "As-tu une expérience dans le même secteur industriel que le poste visé ?", detail: "Ex : tu postules en agroalimentaire → as-tu travaillé dans une usine agroalimentaire ? En métallurgie → as-tu une expérience en fonderie, forge, usinage ?", tip: "C'est LE critère principal en production. Si tu as travaillé dans le même secteur, mets-le en avant dès la première ligne de ton CV. Si non, identifie les points communs entre ton parcours et le poste (process similaire, normes communes, même type d'équipements)." },
      { id: "diplome", categorie: "Cohérence avec le poste visé", question: "As-tu un diplôme ou une formation en lien avec la production industrielle ?", detail: "Bac Pro PSPA, TIPA, MSMA, BTS CRSA, CAP opérateur, titre professionnel...", tip: "Indique ton diplôme avec l'année et l'établissement. Une formation continue ou un titre professionnel obtenu en cours de carrière est aussi valorisant." },
    ],
  };

  const getQuestions = () => questions[secteur?.id] || [];
  const getCategories = () => [...new Set(getQuestions().map(q => q.categorie))];

  const calculerResultat = () => {
    const qs = getQuestions();
    const total = qs.length;
    const oui = qs.filter(q => reponses[q.id] === "oui").length;
    const score = Math.round((oui / total) * 100);
    const parCategorie = getCategories().map(cat => {
      const catQs = qs.filter(q => q.categorie === cat);
      const catOui = catQs.filter(q => reponses[q.id] === "oui").length;
      const catScore = Math.round((catOui / catQs.length) * 100);
      const tips = catQs.filter(q => reponses[q.id] === "non").map(q => q.tip);
      return { categorie: cat, score: catScore, tips };
    });
    return {
      score,
      verdict: score >= 70 ? "retenu" : "à améliorer",
      parCategorie,
    };
  };

  const getScoreColor = (s) => s >= 75 ? "#00D9A3" : s >= 50 ? "#FFD700" : "#FF6B35";

  const qs = getQuestions();
  const answered = qs.filter(q => reponses[q.id]).length;
  const progress = qs.length > 0 ? Math.round((answered / qs.length) * 100) : 0;

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 14, marginBottom: 16, fontFamily: "inherit" }}>← Retour</button>
      <h2 style={{ color: "#FFD700", fontSize: 30, fontWeight: 500, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: 1, marginBottom: 4 }}>📋 Simulateur CV</h2>
      <p style={{ color: COLORS.muted, marginBottom: 24 }}>Teste ton CV avant d'envoyer ta candidature</p>

      {/* STEP 1 — Choix secteur */}
      {step === "secteur" && (
        <div>
          <Card style={{ background: "#FFD70011", borderColor: "#FFD70033", marginBottom: 20 }}>
            <p style={{ color: "#FFD700", fontSize: 13, fontWeight: 600, margin: 0, lineHeight: 1.6 }}>
              🎯 Réponds aux questions sur ton CV — tu reçois un score par critère et des conseils personnalisés pour l'améliorer.
            </p>
          </Card>
          <p style={{ color: COLORS.text, fontWeight: 700, marginBottom: 14 }}>Dans quel secteur tu postules ?</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {secteursTech.map(s => (
              <div key={s.id} onClick={() => { setSecteur(s); setReponses({}); setStep("questions"); }}
                style={{ background: COLORS.card, border: `2px solid ${s.color}44`, borderRadius: 20, padding: 20, cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ color: s.color, fontWeight: 700, fontSize: 13 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2 — Questions */}
      {step === "questions" && secteur && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>{secteur.icon}</span>
            <span style={{ color: secteur.color, fontWeight: 700 }}>{secteur.label}</span>
            <button onClick={() => setStep("secteur")} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 12, fontFamily: "inherit", marginLeft: "auto" }}>Changer</button>
          </div>

          {/* Barre de progression */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: COLORS.muted, fontSize: 12 }}>{answered} / {qs.length} questions</span>
              <span style={{ color: secteur.color, fontWeight: 700, fontSize: 12 }}>{progress}%</span>
            </div>
            <div style={{ background: COLORS.border, borderRadius: 99, height: 6 }}>
              <div style={{ width: progress + "%", height: "100%", borderRadius: 99, background: secteur.color, transition: "width 0.3s" }} />
            </div>
          </div>

          {getCategories().map(cat => (
            <div key={cat} style={{ marginBottom: 24 }}>
              <div style={{ color: secteur.color, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>{cat}</div>
              {qs.filter(q => q.categorie === cat).map(q => (
                <Card key={q.id} style={{ marginBottom: 10, borderColor: reponses[q.id] === "oui" ? "#00D9A344" : reponses[q.id] === "non" ? "#FF6B3544" : COLORS.border }}>
                  <p style={{ color: COLORS.text, fontWeight: 600, fontSize: 14, margin: "0 0 4px", lineHeight: 1.4 }}>{q.question}</p>
                  {q.detail && <p style={{ color: COLORS.muted, fontSize: 12, margin: "0 0 10px", lineHeight: 1.5 }}>{q.detail}</p>}
                  {!q.detail && <div style={{ marginBottom: 10 }} />}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setReponses(r => ({ ...r, [q.id]: "oui" }))}
                      style={{ flex: 1, padding: "8px", borderRadius: 8, border: `2px solid ${reponses[q.id] === "oui" ? "#00D9A3" : COLORS.border}`, background: reponses[q.id] === "oui" ? "#00D9A322" : "transparent", color: reponses[q.id] === "oui" ? "#00D9A3" : COLORS.muted, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>
                      ✓ Oui
                    </button>
                    <button onClick={() => setReponses(r => ({ ...r, [q.id]: "non" }))}
                      style={{ flex: 1, padding: "8px", borderRadius: 8, border: `2px solid ${reponses[q.id] === "non" ? "#FF6B35" : COLORS.border}`, background: reponses[q.id] === "non" ? "#FF6B3522" : "transparent", color: reponses[q.id] === "non" ? "#FF6B35" : COLORS.muted, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>
                      ✗ Non
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          ))}

          <Btn onClick={() => { setResultat(calculerResultat()); setStep("resultat"); if (!awarded) { onXP(90); setAwarded(true); } }}
            color={secteur.color}
            style={{ width: "100%", opacity: answered < qs.length ? 0.5 : 1, marginTop: 8 }}>
            {answered < qs.length ? `Réponds à toutes les questions (${qs.length - answered} restantes)` : "Voir mon analyse →"}
          </Btn>
        </div>
      )}

      {/* STEP 3 — Résultats */}
      {step === "resultat" && resultat && (
        <div>
          <Card style={{ textAlign: "center", marginBottom: 20, background: resultat.verdict === "retenu" ? "#00D9A311" : "#FF6B3511", borderColor: resultat.verdict === "retenu" ? "#00D9A355" : "#FF6B3555" }}>
            <div style={{ fontSize: 44, marginBottom: 8 }}>{resultat.verdict === "retenu" ? "✅" : "💪"}</div>
            <div style={{ color: resultat.verdict === "retenu" ? "#00D9A3" : "#FF6B35", fontWeight: 500, fontSize: 22, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: 1, marginBottom: 8 }}>
              {resultat.verdict === "retenu" ? "CV solide !" : "CV à améliorer"}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ flex: 1, maxWidth: 180, background: COLORS.border, borderRadius: 99, height: 8 }}>
                <div style={{ width: resultat.score + "%", height: "100%", borderRadius: 99, background: getScoreColor(resultat.score) }} />
              </div>
              <span style={{ color: getScoreColor(resultat.score), fontWeight: 900, fontSize: 22 }}>{resultat.score}/100</span>
            </div>
            <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>
              {resultat.score >= 70 ? "Ton CV a de bonnes bases. Quelques ajustements et il sera redoutable." : "Des améliorations importantes sont nécessaires. Suis les conseils ci-dessous."}
            </p>
          </Card>

          {resultat.parCategorie.map((cat, i) => (
            <Card key={i} style={{ marginBottom: 14, borderColor: getScoreColor(cat.score) + "44" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ color: COLORS.text, fontWeight: 700, fontSize: 14 }}>{cat.categorie}</span>
                <span style={{ color: getScoreColor(cat.score), fontWeight: 900, fontSize: 16 }}>{cat.score}/100</span>
              </div>
              <div style={{ background: COLORS.border, borderRadius: 99, height: 6, marginBottom: 10 }}>
                <div style={{ width: cat.score + "%", height: "100%", borderRadius: 99, background: getScoreColor(cat.score) }} />
              </div>
              {cat.tips.length > 0 && cat.tips.map((tip, j) => (
                <div key={j} style={{ background: getScoreColor(cat.score) + "11", border: `1px solid ${getScoreColor(cat.score)}33`, borderRadius: 8, padding: "8px 12px", marginBottom: j < cat.tips.length - 1 ? 8 : 0 }}>
                  <span style={{ color: getScoreColor(cat.score), fontSize: 12, fontWeight: 600, lineHeight: 1.5 }}>💡 {tip}</span>
                </div>
              ))}
              {cat.tips.length === 0 && <p style={{ color: "#00D9A3", fontSize: 13, margin: 0, fontWeight: 600 }}>✓ Ce critère est bien maîtrisé</p>}
            </Card>
          ))}

          {/* Bloc payant — Check CV par l'experte en recrutement */}
          {resultat.score < 70 && (
            <div style={{
              background: "linear-gradient(135deg, #C8622A22, #FFD70011)",
              border: "2px solid #C8622A55",
              borderRadius: 20, padding: 20, marginTop: 8, marginBottom: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 24 }}>👁️</span>
                <div>
                  <div style={{ color: "#C8622A", fontWeight: 900, fontSize: 15, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: 0.5 }}>Pas sûr(e) de ton CV ?</div>
                  <div style={{ color: COLORS.muted, fontSize: 12 }}>Fais-le checker par l'experte en recrutement</div>
                </div>
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <div style={{ color: "#C8622A", fontWeight: 900, fontSize: 18 }}>4,99 €</div>
                  <div style={{ color: COLORS.muted, fontSize: 11 }}>paiement unique</div>
                </div>
              </div>
              <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>
                Envoie ton CV corrigé à l'experte en recrutement via WhatsApp. Tu reçois un retour personnalisé — message ou vocal — sous 48h. Elle te dit si ton CV est prêt à être envoyé ou ce qu'il faut encore ajuster.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                {["✦ Retour personnalisé par message ou vocal WhatsApp", "✦ Réponse sous 48h ouvrées", "✦ Validation ou ajustements concrets avant envoi"].map((p, i) => (
                  <div key={i} style={{ color: COLORS.muted, fontSize: 13 }}>{p}</div>
                ))}
              </div>
              <a
                href={"https://wa.me/33XXXXXXXXX?text=" + encodeURIComponent("Bonjour, je souhaite faire checker mon CV avant envoi (service à 4,99€). Voici mon CV corrigé en pièce jointe. Poste visé : " + (secteur?.label || "") + ".")}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}>
                <Btn color="#C8622A" style={{ width: "100%" }}>
                  📲 Envoyer mon CV sur WhatsApp — 4,99 €
                </Btn>
              </a>
              <p style={{ color: COLORS.muted, fontSize: 11, textAlign: "center", marginTop: 8 }}>
                Le paiement sera demandé par l'experte en recrutement via lien de paiement sécurisé après réception de ton CV.
              </p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            <Btn onClick={() => { setStep("secteur"); setResultat(null); setReponses({}); setSecteur(null); }} color="#FFD700" style={{ width: "100%" }}>
              Tester un autre secteur →
            </Btn>
            <Btn onClick={onBack} color="#FFD700" secondary style={{ width: "100%" }}>
              Retour à l'accueil
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}


// ---- MAIN APP ----

export default function App() {
  const [screen, setScreen] = useState("home");
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [toast, setToast] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  const addXP = (amount) => {
    setXp(prev => {
      const newXP = prev + amount;
      const newLevel = Math.floor(newXP / 200) + 1;
      if (newLevel > level) setLevel(newLevel);
      return newXP;
    });
    setToast(`+${amount} XP !`);
    setTimeout(() => setToast(null), 2500);
  };

  const screens = {
    home: <HomeScreen onNav={setScreen} xp={xp} level={level} />,
    cv: <CVScreen onBack={() => setScreen("home")} onXP={addXP} />,
    simulateur: <SimulateurCVScreen onBack={() => setScreen("home")} onXP={addXP} />,
    quiz: <QuizScreen onBack={() => setScreen("home")} onXP={addXP} />,
    entretien: <EntretienScreen onBack={() => setScreen("home")} onXP={addXP} />,
    candidature: <CandidatureScreen onBack={() => setScreen("home")} onXP={addXP} />,
    reseaux: <ReseauxScreen onBack={() => setScreen("home")} onXP={addXP} />,
    salaire: <SalaireScreen onBack={() => setScreen("home")} onXP={addXP} />,
    contribution: <ContributionScreen onBack={() => setScreen("home")} onXP={addXP} />,
    premium: <PremiumScreen onBack={() => setScreen("home")} onXP={addXP} isPremium={isPremium} onUnlock={() => { setIsPremium(true); setToast("🔓 Accès Premium débloqué !"); }} />,
  };

  return (
    <div style={{
      background: COLORS.bg,
      minHeight: "100vh",
      color: COLORS.text,
      fontFamily: "'Jost', 'Segoe UI', sans-serif",
      padding: "32px 40px 80px",
      maxWidth: 800,
      margin: "0 auto",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Jost:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        h1, h2, h3 { font-family: 'Cormorant Garamond', Georgia, serif; letter-spacing: 0.5px; }
        button, input, select, p, span, div { font-family: 'Jost', 'Segoe UI', sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 99px; }
        input::placeholder { color: ${COLORS.muted}; }
      `}</style>

      {toast && (
        <div style={{
          position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
          background: COLORS.accent, color: "#0F0F1A", padding: "10px 24px",
          borderRadius: 99, fontWeight: 900, fontSize: 16, zIndex: 999,
          boxShadow: `0 8px 32px ${COLORS.accent}66`,
          animation: "slideDown 0.3s ease",
        }}>{toast}</div>
      )}

      {screens[screen] || screens.home}

      {screen === "home" && (
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 480,
          background: COLORS.card,
          borderTop: `1px solid ${COLORS.border}`,
          padding: "12px 24px",
          display: "flex", justifyContent: "space-around",
        }}>
          {[
            { icon: "🏠", label: "Accueil", nav: "home" },
            { icon: "🧩", label: "Quiz", nav: "quiz" },
            { icon: "🎤", label: "Entretien", nav: "entretien" },
          ].map(tab => (
            <button key={tab.nav} onClick={() => setScreen(tab.nav)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: screen === tab.nav ? COLORS.accent : COLORS.muted,
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 4, fontFamily: "inherit", fontSize: 11, fontWeight: 700,
            }}>
              <span style={{ fontSize: 22 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
