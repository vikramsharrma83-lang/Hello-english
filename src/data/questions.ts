import { Question } from '../types';

export const PRACTICE_QUESTIONS: Question[] = [
  // =========================================================================
  // 1. WORKPLACE (Workplace, Shifts, Logistics, Supervisors, Duties)
  // =========================================================================
  // Level 1: Short Words
  {
    id: 'wp-l1-what-is-time',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: 'What is the time right now?',
    questionHi: 'अभी क्या समय हुआ है?',
    hintEn: 'Say: "It is 2:30 PM" or "Shift starts at 9 o\'clock."',
    hintHi: 'समय बताएं: "अभी 2:30 बजे हैं" या "शिफ्ट 9 बजे शुरू होगी।"',
    level: 'Level 1',
    samplePhrases: [
      'It is 3 o\'clock now.',
      'Current time is 4:15 PM.',
      'It is half past two.'
    ],
    sampleLearnerSpoken: 'Time is now 3 PM sir.',
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'clock'
  },
  {
    id: 'wp-l1-where-is-parcel',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: 'Where is the customer parcel?',
    questionHi: 'ग्राहक का पार्सल कहाँ है?',
    hintEn: 'Say: "It is on shelf number 3" or "Inside the delivery bag."',
    hintHi: 'स्थान बताएं: "यह शेल्फ नंबर 3 पर है" या "डिलीवरी बैग में है।"',
    level: 'Level 1',
    samplePhrases: [
      'It is in my delivery bag.',
      'Placed on rack B near the gate.',
      'Parcel is at reception desk.'
    ],
    sampleLearnerSpoken: 'Parcel is inside my bag sir.',
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'package'
  },
  {
    id: 'wp-l1-is-task-done',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: 'Is your packing task completed?',
    questionHi: 'क्या आपकी पैकिंग का काम पूरा हो गया है?',
    hintEn: 'Say: "Yes sir, all 20 boxes are packed!" or "Almost done, 5 minutes more."',
    hintHi: 'कहें: "हाँ सर, सभी 20 बॉक्स पैक हैं!" या "बस 5 मिनट में पूरा होगा।"',
    level: 'Level 1',
    samplePhrases: [
      'Yes sir, packing is finished.',
      'Almost done, 5 boxes left.',
      'All orders ready for dispatch.'
    ],
    sampleLearnerSpoken: 'Yes sir, packing done 100 percent.',
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'check'
  },
  {
    id: 'wp-l1-who-is-supervisor',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: 'Who is the supervisor on duty today?',
    questionHi: 'आज ड्यूटी पर सुपरवाइजर कौन हैं?',
    hintEn: 'Say: "Mr. Sharma is managing today\'s morning shift."',
    hintHi: 'बताएं: "आज सुबह की शिफ्ट मिस्टर शर्मा देख रहे हैं।"',
    level: 'Level 1',
    samplePhrases: [
      'Sir Sharma is on duty.',
      'Supervisor Rajesh is in warehouse.',
      'Madam Priya is shift manager today.'
    ],
    sampleLearnerSpoken: 'Rajesh sir is shift manager today.',
    cardColor: 'from-[#FAF5FF] to-[#EDE9FE]',
    iconType: 'user-check'
  },

  // Level 2: Little More Words (Sentences)
  {
    id: 'wp-l2-where-were-you-yesterday',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: 'Where were you yesterday during the evening shift?',
    questionHi: 'आप कल शाम की शिफ्ट के दौरान कहाँ थे?',
    hintEn: 'Explain clearly: "I was unwell yesterday and had informed the shift lead."',
    hintHi: 'स्पष्ट कारण बताएं: "कल मेरी तबीयत ठीक नहीं थी और मैंने टीम को सूचित किया था।"',
    level: 'Level 2',
    samplePhrases: [
      'Sir, I had a doctor appointment yesterday.',
      'I was on approved sick leave yesterday.',
      'My bike had a breakdown on highway yesterday.'
    ],
    sampleLearnerSpoken: 'Yesterday I have fever so not came shift.',
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'help-circle'
  },
  {
    id: 'wp-l2-why-late-shift',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: 'Why were you late for your shift this morning?',
    questionHi: 'आज सुबह आप अपनी शिफ्ट के लिए लेट क्यों हुए?',
    hintEn: 'Apologize politely: "Sorry sir, there was heavy traffic due to rain."',
    hintHi: 'विनम्रता से कारण बताएं: "माफ कीजिए सर, बारिश के कारण भारी ट्रैफिक था।"',
    level: 'Level 2',
    samplePhrases: [
      'Sorry sir, there was huge traffic jam.',
      'My bus got delayed due to heavy rain.',
      'Bike tyre got punctured on the way.'
    ],
    sampleLearnerSpoken: 'Sorry sir, heavy traffic road so 15 min late.',
    cardColor: 'from-[#FDF0F6] to-[#FCE1EE]',
    iconType: 'clock'
  },
  {
    id: 'wp-l2-ask-help-machine',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: 'How would you ask your senior colleague to teach you how to use this barcode scanner?',
    questionHi: 'आप अपने सीनियर सहकर्मी से इस बारकोड स्कैनर का उपयोग सिखाने का अनुरोध कैसे करेंगे?',
    hintEn: 'Ask politely: "Could you please show me how this scanner works?"',
    hintHi: 'विनम्रता से पूछें: "क्या आप कृपया मुझे दिखा सकते हैं कि यह स्कैनर कैसे काम करता है?"',
    level: 'Level 2',
    samplePhrases: [
      'Bhaiya, can you please show me scanner steps once?',
      'Could you demonstrate how to scan parcels?',
      'I am new to this machine, please help me.'
    ],
    sampleLearnerSpoken: 'Sir please teach me barcode machine one time.',
    cardColor: 'from-[#EBF3FF] to-[#DBE8FD]',
    iconType: 'help-circle'
  },
  {
    id: 'wp-l2-shift-handover',
    category: 'workplace',
    categoryLabel: 'Workplace',
    categoryHindi: 'कार्यस्थल',
    questionEn: 'How would you explain the pending tasks to the colleague taking over your next shift?',
    questionHi: 'अगली शिफ्ट संभालने वाले अपने साथी को आप बचे हुए काम कैसे समझाएंगे?',
    hintEn: 'Explain clearly: "Rack A is completed, Rack B needs barcode scanning."',
    hintHi: 'स्पष्ट बताएं: "रैक A पूरा हो गया है, रैक B की स्कैनिंग बाकी है।"',
    level: 'Level 2',
    samplePhrases: [
      'I finished 50 orders, 10 orders pending for invoice.',
      'Rack A is done, please complete rack B scanning.',
      'All urgent packages are dispatched already.'
    ],
    sampleLearnerSpoken: 'Rack 1 finished, you please scan rack 2.',
    cardColor: 'from-[#F0FDF4] to-[#DCFCE7]',
    iconType: 'repeat'
  },

  // Level 3: Hard - Scenarios ("What will you do if this happens?")
  {
    id: 'wp-l3-damaged-parcel-scenario',
    category: 'workplace',
    categoryLabel: 'Workplace Scenarios',
    categoryHindi: 'कार्यस्थल की स्थितियां',
    questionEn: 'What will you do if a customer parcel arrives heavily torn and leaking oil or liquid?',
    questionHi: 'अगर कोई ग्राहक पार्सल बुरी तरह फटा हुआ और उसमें से लिक्विड लीक होता हुआ मिले, तो आप क्या करेंगे?',
    hintEn: 'Explain: Take photos, inform supervisor, mark as damaged in system, and do not dispatch.',
    hintHi: 'समझाएं: फोटो खींचेंगे, सुपरवाइजर को बताएंगे, सिस्टम में डैमेज मार्क करेंगे और आगे नहीं भेजेंगे।',
    level: 'Level 3',
    samplePhrases: [
      'I will take photos and report to supervisor immediately.',
      'I will hold the parcel and raise a damaged ticket.',
      'I will not deliver it and inform customer care.'
    ],
    sampleLearnerSpoken: 'I take photo of broken box and call supervisor not deliver.',
    cardColor: 'from-[#FFE4E6] to-[#FECDD3]',
    iconType: 'alert-triangle'
  },
  {
    id: 'wp-l3-bike-breakdown-delivery',
    category: 'workplace',
    categoryLabel: 'Workplace Scenarios',
    categoryHindi: 'कार्यस्थल की स्थितियां',
    questionEn: 'What will you do if your delivery bike gets a flat tyre during an urgent express parcel delivery?',
    questionHi: 'अगर एक जरूरी पार्सल डिलीवरी के दौरान आपकी बाइक का टायर पंक्चर हो जाए, तो आप क्या करेंगे?',
    hintEn: 'State actions: Call rider support for reassignment or find nearest mechanic quickly.',
    hintHi: 'कदम बताएं: सपोर्ट टीम को कॉल करके पार्सल री-असाइन कराएंगे या तुरंत मैकेनिक ढूंढेंगे।',
    level: 'Level 3',
    samplePhrases: [
      'I will immediately inform team lead and call rider support.',
      'I will request reassignment so customer gets it on time.',
      'I will find a nearby puncture shop within 10 minutes.'
    ],
    sampleLearnerSpoken: 'I call support center to send another rider for urgent box.',
    cardColor: 'from-[#E8F8F2] to-[#D5F3E8]',
    iconType: 'navigation'
  },
  {
    id: 'wp-l3-unallowed-discount-request',
    category: 'workplace',
    categoryLabel: 'Workplace Scenarios',
    categoryHindi: 'कार्यस्थल की स्थितियां',
    questionEn: 'What will you say if a store customer firmly demands an extra discount that is not allowed by policy?',
    questionHi: 'अगर कोई ग्राहक दुकान में ऐसा एक्स्ट्रा डिस्काउंट मांगता है जो पॉलिसी के खिलाफ है, तो आप उसे क्या समझाएंगे?',
    hintEn: 'Politely explain company policy and offer existing available coupon offers.',
    hintHi: 'विनम्रता से कंपनी पॉलिसी समझाएं और उपलब्ध अन्य ऑफर्स की जानकारी दें।',
    level: 'Level 3',
    samplePhrases: [
      'Sir, our prices are fixed, but you can use this 5% app coupon.',
      'I understand sir, but company system does not permit extra discount.',
      'I am really sorry sir, billing software automatically locks final prices.'
    ],
    sampleLearnerSpoken: 'Sir company policy not allow manual discount, sorry for inconvenience.',
    cardColor: 'from-[#EDF6FF] to-[#D8ECFE]',
    iconType: 'help-circle'
  },
  {
    id: 'wp-l3-two-urgent-tasks',
    category: 'workplace',
    categoryLabel: 'Workplace Scenarios',
    categoryHindi: 'कार्यस्थल की स्थितियां',
    questionEn: 'What will you do if two different supervisors give you two urgent tasks at the exact same time?',
    questionHi: 'अगर दो अलग-अलग सुपरवाइजर आपको एक ही समय में दो जरूरी काम दे दें, तो आप क्या करेंगे?',
    hintEn: 'Explain: Inform both supervisors transparently and ask which task to complete first.',
    hintHi: 'समझाएं: दोनों सुपरवाइजरों को स्पष्ट बताएंगे और पूछेंगे कि पहले किसे पूरा करना है।',
    level: 'Level 3',
    samplePhrases: [
      'Sir, supervisor Amit gave me dispatch packing, which task is top priority?',
      'I will inform both supervisors so they can decide priority.',
      'I can complete task A in 15 minutes, then start task B.'
    ],
    sampleLearnerSpoken: 'I tell both managers and ask which job first I should finish.',
    cardColor: 'from-[#FFEBEF] to-[#FFD8E3]',
    iconType: 'repeat'
  },

  // =========================================================================
  // 2. DAILY ROUTINE (Commute, Shopping, Appointments, Orders, Travel)
  // =========================================================================
  // Level 1: Short Words
  {
    id: 'dr-l1-are-you-coming',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक दिनचर्या',
    questionEn: 'Are you coming today?',
    questionHi: 'क्या आप आज आ रहे हैं?',
    hintEn: 'Say: "Yes, I am coming in 10 minutes" or "No, I am on leave today."',
    hintHi: 'सरल उत्तर दें: "हाँ, मैं 10 मिनट में आ रहा हूँ" या "नहीं, मैं आज नहीं आ रहा।"',
    level: 'Level 1',
    samplePhrases: [
      'Yes, I am coming right now.',
      'Yes, reaching in 5 minutes.',
      'Sorry, I cannot come today.'
    ],
    sampleLearnerSpoken: 'Yes I am coming 10 minutes.',
    cardColor: 'from-[#FFF0F0] to-[#FFE0E0]',
    iconType: 'clock'
  },
  {
    id: 'dr-l1-where-are-you-going',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक दिनचर्या',
    questionEn: 'Where are you going right now?',
    questionHi: 'आप अभी कहाँ जा रहे हैं?',
    hintEn: 'Say: "I am going to the market" or "I am heading home."',
    hintHi: 'बताएं: "मैं बाजार जा रहा हूँ" या "मैं घर जा रहा हूँ।"',
    level: 'Level 1',
    samplePhrases: [
      'I am going for delivery now.',
      'Heading to the tea stall.',
      'Going home after my shift.'
    ],
    sampleLearnerSpoken: 'I go to market now.',
    cardColor: 'from-[#E8F8F2] to-[#D5F3E8]',
    iconType: 'navigation'
  },
  {
    id: 'dr-l1-what-time-bus',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक दिनचर्या',
    questionEn: 'What time is the next bus arriving?',
    questionHi: 'अगली बस कितने बजे आ रही है?',
    hintEn: 'Say: "The next bus is in 10 minutes" or "Bus number 201 arrives at 5 PM."',
    hintHi: 'बताएं: "अगली बस 10 मिनट में है" या "बस नंबर 201 शाम 5 बजे आएगी।"',
    level: 'Level 1',
    samplePhrases: [
      'Next bus is in 10 minutes.',
      'Bus arrives at 5:30 PM.',
      'It comes every 15 minutes.'
    ],
    sampleLearnerSpoken: 'Bus coming in 10 minutes bhaiya.',
    cardColor: 'from-[#FEF3C7] to-[#FDE68A]',
    iconType: 'clock'
  },
  {
    id: 'dr-l1-how-much-tea',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक दिनचर्या',
    questionEn: 'How much for this cup of tea and biscuit?',
    questionHi: 'इस चाय और बिस्कुट के कितने रुपये हुए?',
    hintEn: 'Say: "It is 15 rupees in total. Do you accept UPI?"',
    hintHi: 'पूछें: "कुल 15 रुपये हुए। क्या आप यूपीआई लेते हैं?"',
    level: 'Level 1',
    samplePhrases: [
      'Total is 15 rupees.',
      '20 rupees for tea and snack.',
      'Can I pay via PhonePe QR code?'
    ],
    sampleLearnerSpoken: 'How much for tea, 10 rupees?',
    cardColor: 'from-[#FFEDD5] to-[#FED7AA]',
    iconType: 'coffee'
  },

  // Level 2: Little More Words (Sentences)
  {
    id: 'dr-l2-send-delivery-address',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक दिनचर्या',
    questionEn: 'Can you please send me your exact delivery address and landmark?',
    questionHi: 'क्या आप कृपया मुझे अपना सही डिलीवरी पता और लैंडमार्क भेज सकते हैं?',
    hintEn: 'Request politely: "Sir, please share your building name and flat number on WhatsApp."',
    hintHi: 'अनुरोध करें: "सर, कृपया अपनी बिल्डिंग का नाम और फ्लैट नंबर भेजें।"',
    level: 'Level 2',
    samplePhrases: [
      'Please send flat number and nearby landmark.',
      'Could you share your live location on WhatsApp?',
      'I am near the gate, which tower is yours?'
    ],
    sampleLearnerSpoken: 'Sir please send WhatsApp location and house number.',
    cardColor: 'from-[#E8F8F2] to-[#D5F3E8]',
    iconType: 'map-pin'
  },
  {
    id: 'dr-l2-how-much-bill',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक दिनचर्या',
    questionEn: 'How much is the total bill for these grocery items?',
    questionHi: 'इन किराना सामान का कुल बिल कितना हुआ?',
    hintEn: 'State total & payment method: "The total is 450 rupees. You can pay by UPI or cash."',
    hintHi: 'कुल राशि बताएं: "कुल 450 रुपये हुए। आप यूपीआई या कैश से भुगतान कर सकते हैं।"',
    level: 'Level 2',
    samplePhrases: [
      'Total amount is 450 rupees sir.',
      'It comes to 320 rupees, UPI QR code is here.',
      'After discount, total is 500 rupees.'
    ],
    sampleLearnerSpoken: 'Total bill 450 rupees, you can do GPay.',
    cardColor: 'from-[#FFF6D6] to-[#FFECA8]',
    iconType: 'help-circle'
  },
  {
    id: 'dr-l2-daily-commute',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक दिनचर्या',
    questionEn: 'How do you travel to work every day, and how long does it take?',
    questionHi: 'आप रोज़ काम पर कैसे जाते हैं, और इसमें कितना समय लगता है?',
    hintEn: 'Mention your transport (bike, bus, metro) and time in minutes or hours.',
    hintHi: 'अपने वाहन (बाइक, बस, मेट्रो) और लगने वाले समय (मिनट/घंटे) का उल्लेख करें।',
    level: 'Level 2',
    samplePhrases: [
      'I go by metro, takes 30 minutes every morning.',
      'Daily I ride my bike, about 45 minutes in traffic.',
      'Bus takes one hour from my home to the hub.'
    ],
    sampleLearnerSpoken: 'Daily I go on bike, taking 45 minutes in traffic.',
    cardColor: 'from-[#FDF2F8] to-[#FCE7F3]',
    iconType: 'navigation'
  },
  {
    id: 'dr-l2-doctor-appointment',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine',
    categoryHindi: 'दैनिक दिनचर्या',
    questionEn: 'How would you ask the clinic receptionist for a doctor appointment this evening?',
    questionHi: 'आप क्लिनिक के रिसेप्शनिस्ट से आज शाम के डॉक्टर अपॉइंटमेंट के लिए कैसे पूछेंगे?',
    hintEn: 'Ask politely: "Hello, is Dr. Verma available for consultation at 6 PM today?"',
    hintHi: 'पूछें: "नमस्ते, क्या डॉक्टर आज शाम 6 बजे उपलब्ध हैं?"',
    level: 'Level 2',
    samplePhrases: [
      'Hello, can I book an appointment for fever checkup?',
      'Is the doctor available between 6 and 8 PM?',
      'I need a token for general physician consultation.'
    ],
    sampleLearnerSpoken: 'Hello sister, I want doctor token for evening 6 PM.',
    cardColor: 'from-[#EFF6FF] to-[#DBEAFE]',
    iconType: 'calendar'
  },

  // Level 3: Hard - Scenarios ("What will you do if this happens?")
  {
    id: 'dr-l3-angry-delayed-customer',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine Scenarios',
    categoryHindi: 'दैनिक ग्राहक स्थितियां',
    questionEn: 'What will you tell an angry customer whose food delivery order is 25 minutes late because of heavy rain?',
    questionHi: 'अगर भारी बारिश के कारण खाने का ऑर्डर 25 मिनट लेट हो जाए और ग्राहक नाराज हो, तो आप क्या कहेंगे?',
    hintEn: 'Apologize sincerely, explain rain delay respectfully, and reassure fresh delivery.',
    hintHi: 'सच्चे दिल से क्षमा मांगें, बारिश की वजह बताएं और सुरक्षित डिलीवरी का भरोसा दें।',
    level: 'Level 3',
    samplePhrases: [
      'I sincerely apologize for the delay due to waterlogging.',
      'Sir, safety on flooded roads caused delay, food is packed hot.',
      'Extremely sorry sir, I rode carefully in heavy rain.'
    ],
    sampleLearnerSpoken: 'Sorry sir, road is full water and heavy rain, please understand.',
    cardColor: 'from-[#FFF1DE] to-[#FFE3CB]',
    iconType: 'utensils'
  },
  {
    id: 'dr-l3-wrong-medicine-delivered',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine Scenarios',
    categoryHindi: 'दैनिक ग्राहक स्थितियां',
    questionEn: 'What will you do if an online pharmacy delivers the wrong medicine package to your house for your parents?',
    questionHi: 'अगर ऑनलाइन फार्मेसी आपके घर माता-पिता के लिए गलत दवा का पैकेट डिलीवर कर दे, तो आप क्या करेंगे?',
    hintEn: 'Explain: Check bill, do not open medicine seals, contact helpline, and request urgent replacement.',
    hintHi: 'समझाएं: बिल चेक करेंगे, सील नहीं खोलेंगे, कस्टमर केयर पर कॉल करके तुरंत सही दवा मंगाएंगे।',
    level: 'Level 3',
    samplePhrases: [
      'I will check invoice, contact customer care, and ask for urgent replacement.',
      'I will not open the seal and raise an immediate wrong item ticket.',
      'I will explain to support that it is urgent medicine for my parents.'
    ],
    sampleLearnerSpoken: 'I call pharmacy helpline and tell send correct tablet immediately.',
    cardColor: 'from-[#FFE4E6] to-[#FECDD3]',
    iconType: 'alert-triangle'
  },
  {
    id: 'dr-l3-lost-wallet-metro',
    category: 'daily_routine',
    categoryLabel: 'Daily Routine Scenarios',
    categoryHindi: 'दैनिक ग्राहक स्थितियां',
    questionEn: 'What will you do if you realize you lost your wallet with cash and ID cards inside a crowded metro station?',
    questionHi: 'अगर आपको पता चले कि भीड़भाड़ वाले मेट्रो स्टेशन पर आपका पर्स, कैश और आईडी कार्ड खो गया है, तो आप क्या करेंगे?',
    hintEn: 'Explain: Report to Metro Station Control Room, check lost and found, and block bank cards via phone app.',
    hintHi: 'समझाएं: मेट्रो कंट्रोल रूम को बताएंगे, लॉस्ट एंड फाउंड चेक करेंगे और फोन ऐप से बैंक कार्ड ब्लॉक करेंगे।',
    level: 'Level 3',
    samplePhrases: [
      'I will immediately go to station customer care and report lost wallet.',
      'I will use mobile banking app to block my ATM cards immediately.',
      'I will file a lost report with metro security police.'
    ],
    sampleLearnerSpoken: 'I go to metro office and block my debit card on mobile.',
    cardColor: 'from-[#FDF2F8] to-[#FCE7F3]',
    iconType: 'help-circle'
  },

  // =========================================================================
  // 3. FRIENDS CONVERSATION (Casual Chats, Weekend Plans, Social Situations)
  // =========================================================================
  // Level 1: Short Words
  {
    id: 'fr-l1-how-are-you',
    category: 'friends',
    categoryLabel: 'Friends Conversation',
    categoryHindi: 'दोस्तों से बातचीत',
    questionEn: 'How are you doing today?',
    questionHi: 'आप आज कैसे हैं?',
    hintEn: 'Say: "I am good, thank you! How about you?"',
    hintHi: 'कहें: "मैं अच्छा हूँ, धन्यवाद! आप कैसे हैं?"',
    level: 'Level 1',
    samplePhrases: [
      'I am doing great, thank you!',
      'All good brother, how are you?',
      'I am fine today, what about you?'
    ],
    sampleLearnerSpoken: 'I am good, you tell brother.',
    cardColor: 'from-[#EBF3FF] to-[#DBE8FD]',
    iconType: 'users'
  },
  {
    id: 'fr-l1-what-is-your-name',
    category: 'friends',
    categoryLabel: 'Friends & Intro',
    categoryHindi: 'परिचय',
    questionEn: 'What is your name and where do you live?',
    questionHi: 'आपका क्या नाम है और आप कहाँ रहते हैं?',
    hintEn: 'Say: "My name is [Name] and I live in [Area]."',
    hintHi: 'अपना नाम और इलाका बताएं: "मेरा नाम [नाम] है और मैं [स्थान] में रहता हूँ।"',
    level: 'Level 1',
    samplePhrases: [
      'My name is Rahul, I live in Bangalore.',
      'I am Amit from Delhi.',
      'Hi, I am Priya, staying near metro station.'
    ],
    sampleLearnerSpoken: 'My name is Suresh, living in Mumbai.',
    cardColor: 'from-[#F3EDFD] to-[#E5D7FA]',
    iconType: 'users'
  },
  {
    id: 'fr-l1-did-you-have-lunch',
    category: 'friends',
    categoryLabel: 'Friends Conversation',
    categoryHindi: 'दोस्तों से बातचीत',
    questionEn: 'Did you finish your lunch?',
    questionHi: 'क्या आपने दोपहर का खाना खा लिया?',
    hintEn: 'Say: "Yes, I just had lunch" or "Not yet, let\'s eat together."',
    hintHi: 'कहें: "हाँ, मैंने अभी लंच किया" या "अभी नहीं, चलो साथ खाते हैं।"',
    level: 'Level 1',
    samplePhrases: [
      'Yes, I had lunch just now.',
      'Not yet, let us eat together!',
      'Yes, had roti and sabzi.'
    ],
    sampleLearnerSpoken: 'Yes lunch finish already, you ate?',
    cardColor: 'from-[#FFF6D6] to-[#FFECA8]',
    iconType: 'utensils'
  },
  {
    id: 'fr-l1-what-are-you-doing-evening',
    category: 'friends',
    categoryLabel: 'Friends Conversation',
    categoryHindi: 'दोस्तों से बातचीत',
    questionEn: 'What are you doing this evening after 7 PM?',
    questionHi: 'आज शाम 7 बजे के बाद आप क्या कर रहे हैं?',
    hintEn: 'Say: "I am free, let\'s catch up for tea" or "I am going to the gym."',
    hintHi: 'कहें: "मैं फ्री हूँ, चलो चाय पीते हैं" या "मैं जिम जा रहा हूँ।"',
    level: 'Level 1',
    samplePhrases: [
      'I am free, let us meet for tea.',
      'Going home to relax and watch cricket.',
      'Heading to market with family.'
    ],
    sampleLearnerSpoken: 'Evening I am free brother, we drink tea.',
    cardColor: 'from-[#E0E7FF] to-[#C7D2FE]',
    iconType: 'coffee'
  },

  // Level 2: Little More Words (Sentences)
  {
    id: 'fr-l2-weekend-plans',
    category: 'friends',
    categoryLabel: 'Friends Conversation',
    categoryHindi: 'दोस्तों से बातचीत',
    questionEn: 'Are we meeting this Sunday for a cricket match or tea?',
    questionHi: 'क्या हम इस रविवार को क्रिकेट मैच या चाय के लिए मिल रहे हैं?',
    hintEn: 'Reply with your availability: "Yes, I am free on Sunday afternoon!"',
    hintHi: 'अपनी उपलब्धता बताएं: "हाँ, मैं रविवार दोपहर में फ्री हूँ!"',
    level: 'Level 2',
    samplePhrases: [
      'Yes, let us meet at 4 PM in the ground!',
      'Sunday evening is perfect for cricket.',
      'I have shift till 2 PM, then I can join.'
    ],
    sampleLearnerSpoken: 'Yes brother Sunday 4 PM we meet ground.',
    cardColor: 'from-[#F3EDFD] to-[#E5D7FA]',
    iconType: 'users'
  },
  {
    id: 'fr-l2-recommend-movie',
    category: 'friends',
    categoryLabel: 'Friends Conversation',
    categoryHindi: 'दोस्तों से बातचीत',
    questionEn: 'Which new movie or web series did you watch recently, and was it good?',
    questionHi: 'आपने हाल ही में कौन सी नई फिल्म या वेब सीरीज देखी, और क्या वह अच्छी थी?',
    hintEn: 'Share your review: "I watched an action movie on Netflix, the story was very exciting!"',
    hintHi: 'बताएं: "मैंने नेटफ्लिक्स पर एक एक्शन फिल्म देखी, कहानी बहुत रोमांचक थी!"',
    level: 'Level 2',
    samplePhrases: [
      'I watched the new action movie, acting was amazing.',
      'I saw a comedy series, it was super entertaining.',
      'I watched cricket highlights, great match yesterday.'
    ],
    sampleLearnerSpoken: 'I watch new movie on phone, very nice action.',
    cardColor: 'from-[#FEF3C7] to-[#FDE68A]',
    iconType: 'users'
  },
  {
    id: 'fr-l2-new-phone-advice',
    category: 'friends',
    categoryLabel: 'Friends Conversation',
    categoryHindi: 'दोस्तों से बातचीत',
    questionEn: 'How would you ask your tech-savvy friend for advice before buying a new smartphone under 15,000 rupees?',
    questionHi: '15,000 रुपये के बजट में नया स्मार्टफोन खरीदने से पहले आप अपने समझदार दोस्त से सलाह कैसे मांगेंगे?',
    hintEn: 'Ask: "Brother, which phone has the best battery and camera in this budget?"',
    hintHi: 'पूछें: "भाई, इस बजट में सबसे अच्छी बैटरी और कैमरे वाला कौन सा फोन है?"',
    level: 'Level 2',
    samplePhrases: [
      'Bhaiya, which phone should I buy under 15k with good battery?',
      'Can you recommend a reliable phone for delivery work and camera?',
      'Is 5G phone worth buying right now?'
    ],
    sampleLearnerSpoken: 'Brother please tell good mobile under 15 thousand for heavy use.',
    cardColor: 'from-[#E0F2FE] to-[#BAE6FD]',
    iconType: 'help-circle'
  },

  // Level 3: Hard - Scenarios ("What will you do if this happens?")
  {
    id: 'fr-l3-friend-money-refusal',
    category: 'friends',
    categoryLabel: 'Friends Scenarios',
    categoryHindi: 'दोस्तों से बातचीत',
    questionEn: 'What will you do if a close friend asks you to lend ten thousand rupees, but you do not have extra money this month?',
    questionHi: 'अगर कोई करीबी दोस्त आपसे दस हजार रुपये उधार मांगे, लेकिन इस महीने आपके पास अतिरिक्त पैसे न हों, तो आप क्या कहेंगे?',
    hintEn: 'Politely and honestly explain your tight monthly budget without feeling guilty.',
    hintHi: 'ईमानदारी से अपनी महीने की तंगी बताएं ताकि दोस्ती में गलतफहमी न हो।',
    level: 'Level 3',
    samplePhrases: [
      'Brother, I have tight medical expenses this month so I cannot lend.',
      'I wish I could help, but all my salary went into family rent.',
      'Sorry my friend, I am completely tight on funds right now.'
    ],
    sampleLearnerSpoken: 'Brother I really want to help, but this month my salary already finished in rent.',
    cardColor: 'from-[#F3EDFD] to-[#E5D7FA]',
    iconType: 'users'
  },
  {
    id: 'fr-l3-friend-missed-wedding',
    category: 'friends',
    categoryLabel: 'Friends Scenarios',
    categoryHindi: 'दोस्तों से बातचीत',
    questionEn: 'What will you say to apologize and make it up to your best friend whose wedding you missed due to an urgent job shift?',
    questionHi: 'अगर जरूरी जॉब शिफ्ट के कारण आप अपने सबसे अच्छे दोस्त की शादी में न जा पाए हों, तो आप उससे माफी कैसे मांगेंगे और रिश्ते को कैसे संभालेंगे?',
    hintEn: 'Congratulate warmly, explain the unavoidable work constraint sincerely, and plan an in-person dinner visit.',
    hintHi: 'बधाई दें, मजबूरी बताएं और घर जाकर साथ खाना खाने व गिफ्ट देने का प्लान बनाएं।',
    level: 'Level 3',
    samplePhrases: [
      'I am truly sorry I missed your big day due to urgent work; let me take you and bhabhi out for dinner this weekend!',
      'Congratulations brother! I felt terrible missing the wedding, coming to your house on Sunday.',
      'Please forgive me brother, company emergency duty got locked; sending lots of love and gifts.'
    ],
    sampleLearnerSpoken: 'Sorry brother I could not come wedding because shift emergency, I come your house Sunday.',
    cardColor: 'from-[#FFE4E6] to-[#FECDD3]',
    iconType: 'users'
  },
  {
    id: 'fr-l3-friend-risky-business',
    category: 'friends',
    categoryLabel: 'Friends Scenarios',
    categoryHindi: 'दोस्तों से बातचीत',
    questionEn: 'What will you tell your friend who is pressuring you to leave your stable job and invest all your savings into a risky new business?',
    questionHi: 'अगर आपका दोस्त आप पर अपनी स्थिर नौकरी छोड़ने और सारी बचत एक जोखिम भरे नए बिजनेस में लगाने का दबाव डाले, तो आप उसे समझदारी से क्या कहेंगे?',
    hintEn: 'Respect their enthusiasm, explain your family financial responsibilities, and suggest starting part-time first.',
    hintHi: 'उनके विचार का सम्मान करें, अपनी पारिवारिक जिम्मेदारियां बताएं और पहले पार्ट-टाइम शुरू करने की सलाह दें।',
    level: 'Level 3',
    samplePhrases: [
      'I support your dream brother, but I have family responsibilities and cannot risk my full savings.',
      'Why don\'t we test this business part-time on weekends first before quitting jobs?',
      'I appreciate the offer, but right now I need monthly fixed salary stability.'
    ],
    sampleLearnerSpoken: 'Your idea is good brother, but I have family loan so I cannot leave job right now.',
    cardColor: 'from-[#FEF3C7] to-[#FDE68A]',
    iconType: 'alert-triangle'
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Situations', hindi: 'सभी स्थितियां', icon: 'sparkles' },
  { id: 'workplace', label: 'Workplace', hindi: 'कार्यस्थल', icon: 'briefcase' },
  { id: 'daily_routine', label: 'Daily Routine', hindi: 'दैनिक जीवन', icon: 'coffee' },
  { id: 'friends', label: 'Friends Conversation', hindi: 'दोस्तों से बातचीत', icon: 'users' },
];


