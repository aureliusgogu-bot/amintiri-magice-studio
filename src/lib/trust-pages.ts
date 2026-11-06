import { BUSINESS_ID, SITE_ORIGIN } from "./site-seo";

export const trustPages = {
  about: {
    path: "/about",
    heading: "Despre noi",
    title: "Studio foto și video în Domnești, Ilfov | #facemceneplace",
    description: "Descoperă #facemceneplace: peste 20 de ani de fotografie și video pentru nunți, botezuri și cununii în Domnești, Ilfov și toată România.",
    paragraphs: [
      "#facemceneplace înseamnă fotografie și video pentru nunți, botezuri, cununii civile, majorate și evenimente. De peste 20 de ani, transformăm clipe în amintiri. Suntem în Domnești, Ilfov, și ne deplasăm în toată țara pentru poveștile care ne sunt încredințate.",
      "De peste 20 de ani, nu doar fotografiem și filmăm. Păstrăm emoții. Păstrăm povești. Păstrăm oameni. În tot acest timp, am învățat că cele mai frumoase momente nu se repetă. Un zâmbet, o privire, o îmbrățișare, o lacrimă de fericire… sunt clipe care trec într-o secundă, dar care pot rămâne pentru o viață.",
      "În portofoliul de pe pagina principală poți vedea fotografiile studioului, grupate pe tipuri de evenimente. Pe pagina Recenzii sunt publicate părerile aprobate ale clienților. Pentru detalii despre un eveniment și o ofertă personală, discută direct cu echipa prin modalitățile de contact afișate pe site.",
      "Serviciile sunt oferite de FACEM CE NE PLACE S.R.L, C.U.I. 52881469. Adresa confirmată a studioului este Strada Tudor Vladimirescu, Domnești, Ilfov 077090, România. Nu publicăm o listă standard de prețuri: oferta se stabilește împreună, în funcție de eveniment.",
    ],
  },
  contact: {
    path: "/contact",
    heading: "Contact",
    title: "Contact fotograf nuntă și botez Ilfov | #facemceneplace",
    description: "Cauți fotograf pentru nuntă, botez sau cununie? Contactează #facemceneplace prin telefon, email ori WhatsApp. Studio în Domnești, Ilfov.",
    paragraphs: [
      "Fiecare poveste începe cu un salut. Pentru fotografii și filmări la nuntă, botez, cununie civilă, majorat sau un alt eveniment, sună-ne ori scrie-ne. Spune-ne tipul evenimentului, data și localitatea, precum și ce amintire vrei să păstrăm. Disponibilitatea și oferta se discută direct cu echipa; vizitarea site-ului nu reprezintă o rezervare.",
      "Studioul #facemceneplace are sediul în Domnești, Ilfov, și se deplasează în toată România. Adresa confirmată este Strada Tudor Vladimirescu, Domnești, Ilfov 077090. Programul afișat este non-stop (24/7). Serviciile sunt oferite de FACEM CE NE PLACE S.R.L, C.U.I. 52881469.",
      "Formularul din secțiunea Contact a paginii principale deschide aplicația ta de email cu numele, adresa de email și mesajul completate. Mesajul nu este trimis automat de site: trebuie să confirmi trimiterea în aplicația de email. Dacă nu ai o aplicație configurată, poți folosi WhatsApp sau numerele de telefon de mai jos.",
      "Oferta și prețurile le stabilim împreună, în funcție de eveniment. Poți consulta portofoliul înainte de a ne contacta și poți citi recenziile clienților pe pagina dedicată. Linkurile către Facebook și Instagram deschid profilurile externe ale echipei, unde poți urmări fotografii și noutăți.",
    ],
  },
  privacy: {
    path: "/privacy",
    heading: "Confidențialitate",
    title: "Confidențialitate și date personale | #facemceneplace",
    description: "Află cum sunt folosite datele de contact și recenziile pe #facemceneplace și cum poți contacta studioul pentru întrebări despre datele tale.",
    paragraphs: [
      "Această pagină explică funcționarea formularelor de pe site-ul #facemceneplace, al FACEM CE NE PLACE S.R.L, C.U.I. 52881469. Pentru întrebări despre datele tale sau despre informații publicate pe site, contactează studioul la adresa de email afișată mai jos. Nu include informații sensibile în mesaje sau în recenzii.",
      "Formularul de contact solicită numele, adresa de email și un mesaj. Aceste câmpuri sunt folosite în browser pentru a pregăti un email în aplicația vizitatorului. Formularul nu trimite și nu salvează aceste câmpuri într-o bază de date a site-ului. Emailul ajunge la studio numai dacă vizitatorul confirmă trimiterea în propria aplicație; corespondența trimisă este apoi disponibilă în serviciile de email ale participanților.",
      "Formularul de recenzii solicită numele, textul recenziei, o notă de la 1 la 5 și, opțional, tipul evenimentului. Recenzia trimisă este păstrată într-o zonă privată pentru verificare de către administratorii autorizați. Ea nu apare automat pe site. După aprobare, numele, textul, nota și tipul evenimentului pot fi afișate public în secțiunea Recenzii și pe pagina dedicată.",
      "Nu scrie numere de telefon, adrese de email sau alte informații personale în textul unei recenzii, deoarece textul aprobat devine public. Dacă dorești să discuți o modificare sau eliminarea unei recenzii, scrie studioului și precizează recenzia la care te referi. Durata de păstrare și detaliile procedurii trebuie confirmate direct cu studioul; această pagină nu promite un termen care nu a fost stabilit.",
      "Butoanele pentru Google, Facebook, Instagram și WhatsApp duc la servicii externe, care aplică propriile reguli de confidențialitate. Apelurile și emailurile folosesc aplicațiile dispozitivului tău. Fotografiile și recenziile aprobate afișate în portofoliul public pot fi consultate de vizitatori și de motoarele de căutare.",
    ],
  },
} as const;

export type TrustPageKey = keyof typeof trustPages;

export function trustPageHead(key: TrustPageKey) {
  const page = trustPages[key];
  return {
    meta: [
      { title: page.title },
      { name: "description", content: page.description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: page.title },
      { property: "og:description", content: page.description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ro_RO" },
      { property: "og:url", content: `${SITE_ORIGIN}${page.path}` },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: page.title },
      { name: "twitter:description", content: page.description },
    ],
    links: [{ rel: "canonical", href: `${SITE_ORIGIN}${page.path}` }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": key === "about" ? "AboutPage" : key === "contact" ? "ContactPage" : "WebPage",
      name: page.title, description: page.description, url: `${SITE_ORIGIN}${page.path}`,
      inLanguage: "ro", about: { "@id": BUSINESS_ID },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "#facemceneplace", item: `${SITE_ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: page.heading, item: `${SITE_ORIGIN}${page.path}` },
        ],
      },
    }) }],
  };
}