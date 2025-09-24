import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'lv';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  en: {
    // Hero Section
    'hero.title': 'RunAI',
    'hero.subtitle': 'Your hyper-personalized AI running coach that adapts daily to your sleep, recovery, and performance data',
    'hero.startTraining': 'Start Training',
    'hero.viewDemo': 'View Demo',
    'hero.adaptiveCoach.title': 'Adaptive AI Coach',
    'hero.adaptiveCoach.description': 'Plans update daily based on your sleep, HRV, stress, and recovery data',
    'hero.smartAdaptation.title': 'Smart Adaptation',
    'hero.smartAdaptation.description': 'Auto-reschedule workouts and adjust pace based on fatigue signals',
    'hero.injuryPrevention.title': 'Injury Prevention',
    'hero.injuryPrevention.description': 'Early detection of injury risk with personalized recovery routines',
    
    // Navigation
    'nav.getStarted': 'Get Started',
    
    // Auth Page
    'auth.title': 'Welcome to RunAI',
    'auth.subtitle': 'Your AI-powered running companion',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.loading': 'Loading...',
    'auth.signInButton': 'Sign In',
    'auth.signUpButton': 'Sign Up',
    'auth.success': 'Success!',
    'auth.error': 'Error',
    
    // Dashboard
    'dashboard.overview': 'Overview',
    'dashboard.aiCoach': 'AI Coach',
    'dashboard.devices': 'Devices',
    'dashboard.training': 'Training',
    'dashboard.welcome': 'Welcome to your training dashboard',
    'dashboard.todaysWorkout': "Today's Workout",
    'dashboard.completeWorkout': 'Complete Workout',
    'dashboard.workoutCompleted': 'Workout Completed!',
    'dashboard.congratulations': 'Congratulations on completing your workout!',
    'dashboard.close': 'Close',
    
    // Coach
    'coach.selectStyle': 'Select your coach style:',
    'coach.selectCoach': 'Select Coach',
    'coach.motivational': 'Motivational',
    'coach.analytical': 'Analytical',
    'coach.supportive': 'Supportive',
    'coach.tough': 'Tough',
    'coach.chatPlaceholder': 'Ask your AI coach anything...',
    'coach.send': 'Send',
    
    // Wearable Integration
    'wearable.title': 'Wearable Devices',
    'wearable.subtitle': 'Connect your devices for personalized insights',
    'wearable.connected': 'Connected',
    'wearable.connect': 'Connect',
    'wearable.lastSync': 'Last sync: 2 minutes ago',
    'wearable.privacy': 'Your data is encrypted and secure',
    
    // Integration Section
    'integration.title': 'Seamless Integration',
    'integration.subtitle': 'Connect with your favorite wearables and get personalized insights',
    'integration.connectedDevices': 'Connected Devices',
    'integration.dataQuality': 'Data Quality Score',
    'integration.heartRate': 'Heart Rate',
    'integration.sleepQuality': 'Sleep Quality',
    'integration.steps': 'Steps',
    'integration.calories': 'Calories',
    'integration.privacy': 'Your data is encrypted and secure with end-to-end protection',
    'integration.realTimeMonitoring': 'Real-time Monitoring',
    'integration.realTimeDesc': 'Track your performance metrics in real-time',
    'integration.nutritionSync': 'Nutrition Sync',
    'integration.nutritionDesc': 'Automatically log meals and track nutrition',
    'integration.sleepOptimization': 'Sleep Optimization',
    'integration.sleepDesc': 'Get personalized sleep recommendations',
    
    // 404 Page
    'notFound.title': '404',
    'notFound.message': 'Oops! Page not found',
    'notFound.returnHome': 'Return to Home',
    onboarding: {
      title: "RunAI Assessment", 
      subtitle: "Complete your personalized running assessment to create your perfect training plan",
      experienceTitle: "What's your running experience?",
      experienceDescription: "This helps us create the perfect training plan for you.",
      goalTitle: "What's your main running goal?",
      goalDescription: "Choose what you're training for.",
      weeklyTitle: "How much time can you dedicate?",
      weeklyDescription: "How many hours per week do you want to train?",
      coachTitle: "Choose your coaching style",
      coachDescription: "What kind of motivation works best for you?",
      experience: {
        beginner: "Beginner",
        intermediate: "Intermediate", 
        advanced: "Advanced",
        professional: "Professional"
      },
      experienceDesc: {
        beginner: "New to running or less than 6 months",
        intermediate: "6 months to 2 years of regular running",
        advanced: "2+ years with competitive experience", 
        professional: "Elite level with professional training"
      },
      goal: {
        fitness: "General Fitness",
        "5k": "5K Race",
        "10k": "10K Race",
        half_marathon: "Half Marathon",
        marathon: "Marathon",
        ultra: "Ultra Marathon"
      },
      coach: {
        supportive: "Supportive & Encouraging",
        motivational: "High Energy & Motivational",
        analytical: "Data-Driven & Analytical",
        tough: "Tough Love & Discipline"
      },
      coachDesc: {
        supportive: "Gentle guidance with positive reinforcement",
        motivational: "Energetic motivation to push your limits",
        analytical: "Focus on metrics and scientific approach",
        tough: "Direct feedback and challenging targets"
      },
      hoursPerWeek: "hours/week",
      hour: "hour",
      hours: "hours",
      selectHours: "Select training hours per week",
      back: "Back",
      next: "Next",
      complete: "Complete Setup",
      completing: "Setting up...",
      success: "Assessment completed!",
      successDescription: "Your profile has been updated successfully.",
      planGenerated: "Your personalized 4-week training plan has been created!",
      error: "Setup Error"
    }
  },
  lv: {
    // Hero Section
    'hero.title': 'RunAI',
    'hero.subtitle': 'Jūsu hiperpersonalizētais AI skrējiena treneris, kas katru dienu pielāgojas jūsu miega, atjaunošanās un snieguma datiem',
    'hero.startTraining': 'Sākt Trenēties',
    'hero.viewDemo': 'Skatīt Demo',
    'hero.adaptiveCoach.title': 'Adaptīvs AI Treneris',
    'hero.adaptiveCoach.description': 'Plāni tiek atjaunināti katru dienu, pamatojoties uz jūsu miega, HRV, stresa un atjaunošanās datiem',
    'hero.smartAdaptation.title': 'Viedā Pielāgošana',
    'hero.smartAdaptation.description': 'Automātiski pārplāno treniņus un pielāgo tempu, pamatojoties uz noguruma signāliem',
    'hero.injuryPrevention.title': 'Traumu Profilakse',
    'hero.injuryPrevention.description': 'Agrīna traumu riska noteikšana ar personalizētām atjaunošanās rutīnām',
    
    // Navigation
    'nav.getStarted': 'Sākt',
    
    // Auth Page
    'auth.title': 'Laipni lūdzam RunAI',
    'auth.subtitle': 'Jūsu AI darbināmais skrējiena palīgs',
    'auth.signIn': 'Pieteikties',
    'auth.signUp': 'Reģistrēties',
    'auth.email': 'E-pasts',
    'auth.password': 'Parole',
    'auth.loading': 'Ielādē...',
    'auth.signInButton': 'Pieteikties',
    'auth.signUpButton': 'Reģistrēties',
    'auth.success': 'Veiksmīgi!',
    'auth.error': 'Kļūda',
    
    // Dashboard
    'dashboard.overview': 'Pārskats',
    'dashboard.aiCoach': 'AI Treneris',
    'dashboard.devices': 'Ierīces',
    'dashboard.training': 'Treniņi',
    'dashboard.welcome': 'Laipni lūdzam jūsu treniņu panelī',
    'dashboard.todaysWorkout': 'Šodienas Treniņš',
    'dashboard.completeWorkout': 'Pabeigt Treniņu',
    'dashboard.workoutCompleted': 'Treniņš Pabeigts!',
    'dashboard.congratulations': 'Apsveicam ar treniņa pabeigšanu!',
    'dashboard.close': 'Aizvērt',
    
    // Coach
    'coach.selectStyle': 'Izvēlieties sava trenera stilu:',
    'coach.selectCoach': 'Izvēlēties Treneri',
    'coach.motivational': 'Motivējošs',
    'coach.analytical': 'Analītisks',
    'coach.supportive': 'Atbalstošs',
    'coach.tough': 'Stingrs',
    'coach.chatPlaceholder': 'Jautājiet savam AI trenerim jebko...',
    'coach.send': 'Sūtīt',
    
    // Wearable Integration
    'wearable.title': 'Valkājamās Ierīces',
    'wearable.subtitle': 'Pievienojiet savas ierīces personalizētiem ieskatos',
    'wearable.connected': 'Pievienots',
    'wearable.connect': 'Pievienot',
    'wearable.lastSync': 'Pēdējā sinhronizācija: pirms 2 minūtēm',
    'wearable.privacy': 'Jūsu dati ir šifrēti un drošībā',
    
    // Integration Section
    'integration.title': 'Nevainojama Integrācija',
    'integration.subtitle': 'Savienojieties ar savām iecienītākajām valkājamajām ierīcēm un saņemiet personalizētus ieskatus',
    'integration.connectedDevices': 'Pievienotās Ierīces',
    'integration.dataQuality': 'Datu Kvalitātes Reitings',
    'integration.heartRate': 'Sirds Ritms',
    'integration.sleepQuality': 'Miega Kvalitāte',
    'integration.steps': 'Soļi',
    'integration.calories': 'Kalorijas',
    'integration.privacy': 'Jūsu dati ir šifrēti un droši ar pilnīgu aizsardzību',
    'integration.realTimeMonitoring': 'Reāllaika Monitorings',
    'integration.realTimeDesc': 'Sekojiet saviem snieguma rādītājiem reāllaikā',
    'integration.nutritionSync': 'Uztura Sinhronizācija',
    'integration.nutritionDesc': 'Automātiski reģistrējiet ēdienreizes un sekojiet uzturvielām',
    'integration.sleepOptimization': 'Miega Optimizācija',
    'integration.sleepDesc': 'Saņemiet personalizētus miega ieteikumus',
    
    // 404 Page
    'notFound.title': '404',
    'notFound.message': 'Ups! Lapa nav atrasta',
    'notFound.returnHome': 'Atgriezties Sākumlapā',
    
    onboarding: {
      title: "RunAI Novērtējums",
      subtitle: "Pabeidziet savu personalizēto skrējiena novērtējumu, lai izveidotu savu ideālo treniņu plānu",
      experienceTitle: "Kāda ir jūsu skrējiena pieredze?",
      experienceDescription: "Tas palīdz mums izveidot ideālu treniņu plānu.",
      goalTitle: "Kāds ir jūsu galvenais skrējiena mērķis?",
      goalDescription: "Izvēlieties, kam gatavojaties.",
      weeklyTitle: "Cik daudz laika varat veltīt?",
      weeklyDescription: "Cik stundu nedēļā vēlaties trenēties?",
      coachTitle: "Izvēlieties trenera stilu",
      coachDescription: "Kāda veida motivācija jums darbojas vislabāk?",
      experience: {
        beginner: "Iesācējs",
        intermediate: "Vidējs līmenis",
        advanced: "Augstākais līmenis",
        professional: "Profesionālis"
      },
      experienceDesc: {
        beginner: "Jauns skrējienos vai mazāk par 6 mēnešiem",
        intermediate: "6 mēneši līdz 2 gadi regulāru skrējienu",
        advanced: "2+ gadi ar sacensību pieredzi",
        professional: "Elites līmenis ar profesionālu trenēšanos"
      },
      goal: {
        fitness: "Vispārējā fiziskā sagatavotība",
        "5k": "5K sacensības",
        "10k": "10K sacensības",
        half_marathon: "Pusmaratons",
        marathon: "Maratons",
        ultra: "Ultramaratons"
      },
      coach: {
        supportive: "Atbalstošs un iedrošinošs",
        motivational: "Augsta enerģija un motivējošs",
        analytical: "Datu vadīts un analītisks",
        tough: "Stingra pieeja un disciplīna"
      },
      coachDesc: {
        supportive: "Maigs vadījums ar pozitīvu atbalstu",
        motivational: "Enerģiska motivācija robežu pārvarēšanai",
        analytical: "Fokuss uz metriku un zinātnisko pieeju",
        tough: "Tiešs atgriezeniskais sakars un izaicinoši mērķi"
      },
      hoursPerWeek: "stundas/nedēļā",
      hour: "stunda", 
      hours: "stundas",
      selectHours: "Izvēlieties treniņu stundas nedēļā",
      back: "Atpakaļ",
      next: "Tālāk",
      complete: "Pabeigt iestatīšanu",
      completing: "Iestata...",
      success: "Novērtējums pabeigts!",
      successDescription: "Jūsu profils ir veiksmīgi atjaunināts.",
      planGenerated: "Jūsu personalizētais 4 nedēļu treniņu plāns ir izveidots!",
      error: "Iestatīšanas kļūda"
    }
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'lv'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};