export interface TimelineEvent {
  id: number;
  year: string;
  name: string;
  title: string;
  talambuhay: string;
  buodNgPagibig: string;
  mgaSinulatNiRizal: string;
  epektoKayRizal: string;
  kontekstongPagkasaysayan: string;
  imageKey: string;
  // backgroundKey: string;
  position: { x: number; y: number };
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    year: "1877",
    name: "Julia Celeste Smith",
    title: "Ang Dalaga sa Ilog Dampalit",
    talambuhay:
      "Isang dalaga na nakilala ni Rizal\nhabang naglalakad sa tabi ng\nIlog Dampalit sa Los Baños, Laguna.",
    buodNgPagibig:
      "Noong 15 taong gulang pa lamang si\nRizal, nakita niya si Julia habang pinapatuyo\nang kanyang mga paa sa ilog. Naakit siya ngunit\nhindi ito hinabol. Isang panandaliang sulyap na\nnag-iwan ng matamis na alaala.",
    mgaSinulatNiRizal:
      "Walang direktang pagbanggit sa kanyang mga akda, ngunit binanggit ng mga historyador ang sandaling ito bilang simula ng kanyang pagkahumaling sa kagandahan ng mga dalaga.",
    epektoKayRizal:
      "Isa ito sa kanyang pinakaunang karanasan sa pag-ibig, na maaaring nakaimpluwensya sa kanyang pagpapahalaga sa kagandahan at panandaliang pag-ibig.",
    kontekstongPagkasaysayan:
      "Si Rizal ay isang mag-aaral pa lamang sa Ateneo nang mangyari ito.",
    imageKey: "julia-celeste-smith",
    position: { x: 200, y: 637 },
  },
  {
    id: 2,
    year: "1877",
    name: "Segunda Katigbak",
    title: "Unang Pag-ibig",
    talambuhay:
      "Isang dalaga mula sa Lipa, Batangas,\nna kinikilala bilang unang pag-ibig\nni Rizal.",
    buodNgPagibig:
      "Nagkakilala sila noong 16 taong gulang\nsi Rizal, ngunit nakatakda nang ikasal\nsi Segunda. Isang pag-ibig na\nhindi natuloy.",
    mgaSinulatNiRizal:
      "Isinulat niya ang tungkol sa kanya sa kanyang mga alaala, inilarawan bilang isang 'maliit na babae na may makahulugang mga mata.'",
    epektoKayRizal:
      "Ang kanyang unang pagkabigo sa pag-ibig, na humubog sa kanyang pananaw tungkol dito.",
    kontekstongPagkasaysayan:
      "Nag-aaral si Rizal sa Ateneo noong panahong ito.",
    imageKey: "segunda_katigbak",
    position: { x: 350, y: 150 },
  },
  {
    id: 3,
    year: "1878-1880",
    name: "Leonor Valenzuela",
    title: "Orang",
    talambuhay:
      "Kapitbahay ni Rizal sa Intramuros\n(Orang) na nakilala sa kanilang\npalitan ng mga liham ng pag-ibig.",
    buodNgPagibig:
      "Gumamit si Rizal ng hindi nakikitang tinta\nna gawa sa tubig-alat upang sumulat\nng mga liham, na kailangang painitan upang\nmabasa. Ang paggamit ng invisible ink ay\nnagpapakita ng pagiging malikhain ni Rizal.",
    mgaSinulatNiRizal: "Mga liham ng pag-ibig.",
    epektoKayRizal:
      "Natuto siyang maging malikhain sa pagpapahayag ng pag-ibig, ngunit kalaunan ay nawala ang kanilang relasyon.",
    kontekstongPagkasaysayan:
      "Noo'y isang mag-aaral ng medisina si Rizal sa UST.",
    imageKey: "leonor-valenzuela",
    position: { x: 500, y: 200 },
  },
  {
    id: 4,
    year: "1880-1891",
    name: "Leonor Rivera",
    title: "Ang Hindi Niya Nakamit",
    talambuhay:
      'Pinsan ni Rizal at itinuturing\nniyang "pinakamahal," ang naging\ninspirasyon ni María Clara.',
    buodNgPagibig:
      "Nagtagal ang kanilang relasyon ng\n11 taon ngunit natapos nang pilitin siyang\nipakasal sa isang Ingles. Isang malalim na\npag-ibig na nasira ng mga pangyayari.",
    mgaSinulatNiRizal:
      'Mga liham ng pag-ibig at inspirasyon sa "Noli Me Tangere."',
    epektoKayRizal:
      "Malalim siyang nasaktan sa pagkawala nito at madalas niyang sinusulat ang tungkol sa nawalang pag-ibig. Ang pagkawala ni Leonor ay nagdulot ng malalim na lungkot kay Rizal.",
    kontekstongPagkasaysayan:
      "Naglalakbay si Rizal sa ibang bansa sa halos buong panahon ng kanilang relasyon.",
    imageKey: "leonor-rivera",
    position: { x: 650, y: 250 },
  },
  {
    id: 5,
    year: "1882-1883",
    name: "Consuelo Ortiga y Rey",
    title: "Panandaliang Pag-ibig sa Madrid",
    talambuhay: "Anak ng isang opisyal na Kastila\nsa Madrid.",
    buodNgPagibig:
      "Humanga si Rizal sa kanyang kagandahan\nat talino ngunit hindi itinuloy ang relasyon\nbilang respeto sa kaibigang si Eduardo\nde Lete. Ang pagpapakita ng pagiging marangal\nat tapat sa pagkakaibigan.",
    mgaSinulatNiRizal: 'Tula na "A La Señorita C.O. y R."',
    epektoKayRizal: "Natuto siya ng pagpipigil at katapatan sa pagkakaibigan.",
    kontekstongPagkasaysayan: "Aktibo si Rizal sa Kilusang Propaganda.",
    imageKey: "consuelo-ortiga",
    position: { x: 800, y: 300 },
  },
  {
    id: 6,
    year: "1888",
    name: "O-Sei-San",
    title: "Ang Haponang Pag-ibig",
    talambuhay:
      "Anak ng isang samurai sa Japan,\ntunay na pangalan ay Seiko Usui.",
    buodNgPagibig:
      "Napamahal si Rizal sa kanyang kabaitan\nat talino habang nasa Japan ngunit iniwan\nito upang bumalik sa Pilipinas.\nAng paghanga sa kulturang Hapones.",
    mgaSinulatNiRizal: "Inilarawan siya sa kanyang talaarawan.",
    epektoKayRizal: "Natutunan niyang pahalagahan ang kulturang Hapones.",
    kontekstongPagkasaysayan: "Nasa Japan si Rizal papuntang U.S.",
    imageKey: "o-sei-san",
    position: { x: 950, y: 200 },
  },
  {
    id: 7,
    year: "1888-1889",
    name: "Gertrude Beckett",
    title: "Panandaliang Pag-iibigan sa London",
    talambuhay: "Anak ng landlord ni Rizal sa London.",
    buodNgPagibig:
      "Inibig siya ni Gertrude, ngunit pinili ni Rizal\nna pagtuunan ng pansin ang kanyang\ngawain kaysa sa pag-ibig.\nAng dedikasyon sa misyon kaysa sa personal na\npag-ibig.",
    mgaSinulatNiRizal: "Gumawa siya ng iskultura para sa kanya.",
    epektoKayRizal:
      "Pinakita ang kanyang dedikasyon sa misyon kaysa sa personal na pag-ibig.",
    kontekstongPagkasaysayan:
      'Iniaakda ni Rizal ang "Sucesos de las Islas Filipinas."',
    imageKey: "gertrude-beckett",
    position: { x: 1100, y: 150 },
  },
  {
    id: 8,
    year: "1890-1891",
    name: "Nelly Boustead",
    title: "Mataas na Lipunan sa Paris",
    talambuhay: "Isang Filipina mestiza na naninirahan\nsa Europa.",
    buodNgPagibig:
      "May pagtingin sila sa isa't isa, ngunit tumutol\nang ina ni Nelly at nais nitong magpalit si Rizal\nng relihiyon sa Protestantismo.\nAng pag-ibig na hindi lumampas sa pagkakaiba\nng paniniwala.",
    mgaSinulatNiRizal: "Mga banggit sa kanyang mga liham.",
    epektoKayRizal:
      "Napagtanto niyang hindi palaging kaya ng pag-ibig lampasan ang pagkakaiba ng paniniwala.",
    kontekstongPagkasaysayan: "Kabilang si Rizal sa Kilusang La Solidaridad.",
    imageKey: "nelly-boustead",
    position: { x: 1250, y: 250 },
  },
  {
    id: 9,
    year: "1890-1891",
    name: "Suzanne Jacoby",
    title: "Pag-ibig sa Belgium",
    talambuhay:
      "Si Suzanne Jacoby ay pamangkin ng may-ari\nng paupahang tinutuluyan ni Rizal noong\nsiya ay nasa Brussels, Belgium.",
    buodNgPagibig:
      "Noong si Rizal ay labis na nakakaramdam\nng kalungkutan at pag-aalala sa kanyang\npamilya sa Pilipinas, si Suzanne\nang kanyang naging sandalan upang kahit papaano ay\nmapawi ang pag-aalala na nararamdaman\nnito. Nagkaroon sila ng maikling romansa, ngunit iniwan\nsiya ni Rizal upang lumipat sa Madrid.\nAng kanilang relasyon ay nagpakita ng suporta at\naliw sa panahon ng pagdadalamhati ni Rizal.\nAng pag-ibig na isinakripisyo para sa misyon.",
    mgaSinulatNiRizal:
      'Sinasabing inialay ni Rizal kay Suzanne ang dalawang sanaysay na pinamagatang "Filipinas Dentro de Cien Anos" at ang "Sobre de la Indolencia de los Filipinos"',
    epektoKayRizal:
      "Si Suzanne ang nagbigay suporta kay Rizal sa panahon ng kalungkutan at naging dahilan kung bakit pinili ni Rizal maging aktibo sa pagsulat ng nobela at sanaysay kahit na ito ay nag-aalala.",
    kontekstongPagkasaysayan:
      "Ipinagpatuloy isulat ni Rizal ang kanyang ikalawang nobela at mga sanaysay para sa La Solidaridad noong panahong ito.",
    imageKey: "suzanne-jacoby",
    position: { x: 1400, y: 300 },
  },
  {
    id: 10,
    year: "1894-1896",
    name: "Pastora Necesario",
    title: "Usap-usapang Pag-ibig sa Dapitan",
    talambuhay:
      "Isang dalaga mula sa Dapitan, na\nsinasabing isa sa mga hinangaan ni\nRizal habang siya'y nakadestiyero.",
    buodNgPagibig:
      "Wala pang matibay na ebidensya ng\nmalalim nilang relasyon, ngunit\nsinasabing isa siya sa mga nagkagusto\nkay Rizal.",
    mgaSinulatNiRizal: "Walang matibay na dokumentasyon.",
    epektoKayRizal:
      "Kung totoo, pinapatunayang patuloy siyang hinangaan ng mga babae kahit nasa Dapitan.",
    kontekstongPagkasaysayan:
      "Nasa Dapitan si Rizal, kung saan niya nakilala si Josephine Bracken.",
    imageKey: "pastora-necesario",
    position: { x: 1550, y: 200 },
  },
  {
    id: 11,
    year: "1895-1896",
    name: "Josephine Bracken",
    title: "Ang Kanyang Huling Kasama",
    talambuhay: "Isang Irish na dumalaw kay\nRizal sa Dapitan.",
    buodNgPagibig:
      "Inalagaan niya si Rizal habang ito'y nasa\ndestiyero, at itinuring nilang mag-asawa\nang isa't isa kahit\nwalang basbas ng simbahan.\nAng kanyang huling pag-ibig.",
    mgaSinulatNiRizal:
      'Ang tula niyang "Mi Último Adiós" ay sinasabing para sa kanya.',
    epektoKayRizal: "Siya ang naging huling kasama ni Rizal bago ito barilin.",
    kontekstongPagkasaysayan:
      "Nasa Dapitan si Rizal bago siya ipapatay sa Bagumbayan.",
    imageKey: "josephine-bracken",
    position: { x: 1700, y: 250 },
  },
];
