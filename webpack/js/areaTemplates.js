pickerTemplate =
  '<div class="country-picker picker relative inline-block"> <button @focus="toggled = true" @blur="toggled = false" class="btn border-hr-blue p2 grey-dark pointer-cursor"> <span>{{ pickedText }}</span> <i class="icon-arrow-drop-down right"></i> </button> <ul v-show="toggled" class="z2 m0 absolute bg-hr-blue list-reset"> <li v-for="c in choices"> <a @mousedown="pick(c.name, c.code, $event)">{{ c.name | localize }}</a> </li> </ul> </div>';

pickerText = {
  pleaseChoose: {
    hr: "Molimo Odaberite",
    en: "Please Choose"
  },
  choosePA: {
    hr: "Odaberite ZP",
    en: "Choose PA"
  }
};

countryTemplates = {
  country: {
    hr: "Prikaz {VALUE} u {PA_CNT} zaštićenih područja u {COUNTRY}",
    en: "{VALUE} in {PA_CNT} protected areas in {COUNTRY}"
  },
  country_with_pa: {
    hr: "Prikaz {VALUE} u zaštićenom području {PA}",
    en: "{VALUE} in {PA}"
  }
};

graphNameTemplates = {
  en: {
    overall: "Overall values",
    overall_econ: "Overall economic values",
    flow_econ: "Flow of economic value",
    potentials: "Main potentials"
  },
  hr: {
    overall: "svih vrijednosti",
    overall_econ: "glavnih ekonomskih vrijednosti",
    flow_econ: "tijeka prihoda dionicima",
    potentials: "glavnih potencijala"
  }
};

countriesList = {
  ALB: { en: "Albania", hr: "Albaniji" },
  BIH: { en: "Bosnia & Herzegovina", hr: "Bosni i Hercegovini" },
  HRV: { en: "Croatia", hr: "Hrvatskoj" },
  MKD: { en: "Macedonia", hr: "Makedoniji" },
  MNE: { en: "Montenegro", hr: "Crnoj Gori" },
  SRB: { en: "Serbia", hr: "Srbiji" },
  SLV: { en: "Slovenia", hr: "Sloveniji" },
  KOS: { en: "Kosovo", hr: "Kosovu" }
};
