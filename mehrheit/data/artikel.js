/* =====================================================================
   data/artikel.js – die Artikel des Gesetzentwurfs (Abschnitt 5.2 und 6)
   ---------------------------------------------------------------------
   Phase 1 enthält nur Artikel 4 als Probe für das 3D-Papier und das
   Glasmodell. Alle sieben Artikel folgen in Phase 2.

   Jede Option hat:
     kurz:     Kurzname für Knöpfe (höchstens vier Wörter)
     text:     Wortlaut im Gesetzestext (höchstens drei Zeilen)
     streichen: true = der Artikel/Absatz fällt weg
     dafuer / dagegen: je ein bis zwei Sätze
     haltung:  je Fraktion -2 (lehnt stark ab) bis +2 (will das unbedingt)
               (die Fraktion Brücke stimmt immer mit der Spielfigur)
     wirkung:  je Achse -2 bis +2 – wissen, durchsetzung, aufwand, recht
               (bei „aufwand“ heißt +2: viel Arbeit für Betriebe)
     jurist:   Randbemerkung des Juristischen Dienstes (optional)
     echt / vergleich: entspricht etwa der echten Richtlinie → Fakt-ID
   ===================================================================== */
var DATA = window.DATA || {};

DATA.artikel = [
  {
    id: "auskunft",
    titel: "Artikel 4 – Auskunftsrecht und Verschwiegenheit",
    einleitung: "Was dürfen Beschäftigte über die Bezahlung in ihrem Betrieb erfahren?",
    schrauben: [
      {
        id: "auskunft_umfang",
        frage: "Was dürfen Beschäftigte erfahren?",
        start: "durchschnitt",
        optionen: [
          { id: "nichts", kurz: "Kein Auskunftsrecht", streichen: true, text: "",
            dafuer: "Betriebe müssen keine neuen Auskünfte vorbereiten.",
            dagegen: "Beschäftigte wissen weiterhin nicht, ob sie fair bezahlt werden.",
            haltung: { GZL: -2, ASG: -2, BFW: 1, EVM: 0, BSN: 1, FU: -1 },
            wirkung: { wissen: -2, durchsetzung: -1, aufwand: -2, recht: 0 } },
          { id: "durchschnitt", kurz: "Auskunft auf Antrag", echt: true, vergleich: "rl_auskunft",
            text: "Die Beschäftigten haben das Recht, auf Antrag Auskunft über ihre eigene Entgelthöhe und über die durchschnittliche Entgelthöhe zu erhalten, aufgeschlüsselt nach Geschlecht, für Gruppen, die gleiche oder gleichwertige Arbeit verrichten.",
            dafuer: "Wer fragt, bekommt eine Antwort – ohne dass einzelne Gehälter offenliegen.",
            dagegen: "Viele wissen nicht, dass sie fragen dürfen. Nachfragen kostet Mut.",
            haltung: { GZL: 1, ASG: 1, BFW: 0, EVM: 1, BSN: -1, FU: 1 },
            wirkung: { wissen: 1, durchsetzung: 1, aufwand: 1, recht: 1 } },
          { id: "durchschnitt_info", kurz: "Auskunft plus jährlicher Hinweis", echt: true, vergleich: "rl_auskunft",
            text: "Die Beschäftigten haben das Recht, auf Antrag Auskunft über die durchschnittliche Entgelthöhe nach Geschlecht für gleiche oder gleichwertige Arbeit zu erhalten. Die Arbeitgeber informieren alle Beschäftigten jährlich über dieses Recht.",
            dafuer: "Alle erfahren von ihrem Recht – auch wer sich nicht traut zu fragen.",
            dagegen: "Ein weiterer Pflichtbrief im Jahr. Kleine Betriebe sehen darin Bürokratie.",
            haltung: { GZL: 2, ASG: 2, BFW: -1, EVM: 1, BSN: -1, FU: 1 },
            wirkung: { wissen: 2, durchsetzung: 1, aufwand: 1, recht: 1 } },
          { id: "offen", kurz: "Offene Gehaltslisten",
            text: "Die Arbeitgeber legen die Entgelte aller Beschäftigten innerhalb des Betriebs offen. Jede beschäftigte Person kann die vollständige Liste einsehen.",
            dafuer: "Mehr Transparenz geht nicht. Ungleiche Bezahlung fällt sofort auf.",
            dagegen: "Einzelne Gehälter werden für alle sichtbar. Viele empfinden das als Eingriff in ihre Privatsphäre.",
            haltung: { GZL: 1, ASG: 1, BFW: -2, EVM: -2, BSN: -2, FU: -1 },
            wirkung: { wissen: 2, durchsetzung: 1, aufwand: 2, recht: -1 },
            jurist: "Vollständig offene Gehaltslisten berühren den Datenschutz der einzelnen Beschäftigten. So formuliert ist das vor Gericht angreifbar." }
        ]
      },
      {
        id: "verschwiegenheit",
        frage: "Dürfen Arbeitsverträge Schweigen über das eigene Gehalt verlangen?",
        start: "verboten",
        optionen: [
          { id: "erlaubt", kurz: "Schweigeklauseln erlaubt",
            text: "Arbeitgeber dürfen mit Beschäftigten vereinbaren, dass diese über ihr Entgelt Stillschweigen bewahren.",
            dafuer: "Betriebe behalten ihre Gehaltspolitik für sich.",
            dagegen: "Wer nicht darüber reden darf, erfährt nie von einer Lücke.",
            haltung: { GZL: -2, ASG: -2, BFW: 1, EVM: 0, BSN: 1, FU: -1 },
            wirkung: { wissen: -1, durchsetzung: -1, aufwand: -1, recht: 0 } },
          { id: "verboten", kurz: "Schweigeklauseln verboten", echt: true, vergleich: "rl_auskunft",
            text: "Vertragsklauseln, die Beschäftigte daran hindern, ihr eigenes Entgelt offenzulegen, sind unzulässig.",
            dafuer: "Kolleg*innen dürfen über ihr Gehalt sprechen, wenn sie es wollen.",
            dagegen: "Manche Betriebe fürchten Unruhe im Team.",
            haltung: { GZL: 2, ASG: 2, BFW: -1, EVM: 0, BSN: -1, FU: 1 },
            wirkung: { wissen: 1, durchsetzung: 1, aufwand: 0, recht: 1 } }
        ]
      }
    ]
  }
];
