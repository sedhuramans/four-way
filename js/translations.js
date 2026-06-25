/**
 * translations.js — English / French i18n for Fourways International Trading
 * Usage: include this file, then call window.i18n.apply(lang) or toggleLanguage().
 */
(function () {
  const translations = {
    en: {
      /* ── Navigation ── */
      nav_home:        'Home',
      nav_products:    'Products',
      nav_gallery:     'Gallery',
      nav_story:       'Our Story',
      nav_contact:     'Contact',
      nav_about:       'About Us',
      lang_switch:     'Français',   // label shown on the button

      /* ── Trust bar (index) ── */
      trust_1: 'Free Shipping Pan India',
      trust_2: '100% Organic Certified',
      trust_3: 'Export Grade Quality',
      trust_4: 'COD Available',

      /* ── Features strip (index) ── */
      feat1_title: 'Free Shipping',
      feat1_sub:   'Pan India Delivery',
      feat2_title: '100% Organic',
      feat2_sub:   'Certified natural products',
      feat3_title: 'Export Grade',
      feat3_sub:   'International quality standards',
      feat4_title: 'Hassle-Free',
      feat4_sub:   'COD & Easy Enquiry',

      /* ── Sustainability section (index) ── */
      sust_label:  'Our Philosophy',
      sust_title:  'The Art of Sustainability',
      sust_sub:    'Crafted with conscience, designed for the future.',
      sust1_title: 'Purely Organic',
      sust1_text:  'Sourced from the heart of nature, untouched by synthetics or chemicals.',
      sust2_title: 'Zero Waste',
      sust2_text:  'A closed-loop philosophy that honours the earth and reduces footprint.',
      sust3_title: 'Global Standards',
      sust3_text:  'Excellence delivered to discerning clients across the world.',

      /* ── About strip (index) ── */
      about_label:   'Who We Are',
      about_years:   'Years of Excellence',
      about_title:   'Premium Natural Products, Rooted in Purpose',
      about_p1:      'Fourways International Trading is a Tamil Nadu-based exporter of premium cocopeat, bamboo, and eco-friendly products. We combine traditional knowledge with modern quality standards to deliver nature\'s best to homes and farms worldwide.',
      about_p2:      'Every product we craft is a promise — to the earth, to our customers, and to a sustainable future.',
      stat1_label:   'Happy Customers',
      stat2_label:   'Products',
      stat3_label:   'States Served',
      stat4_label:   'Organic',
      about_cta:     'Discover Our Story',

      /* ── Hero slides (index) ── */
      slide1_label: 'Premium Export Quality',
      slide1_h1:    'Nature\'s Finest<br>Cocopeat Solutions',
      slide1_p:     'High-purity substrate for stronger roots, better yield,<br>and a greener tomorrow.',
      slide1_btn1:  'Shop Now',
      slide1_btn2:  'Our Story',
      slide2_label: 'Sustainable Living',
      slide2_h1:    'Sustainable Bamboo<br>Products',
      slide2_p:     'Eco-friendly alternatives crafted for a plastic-free,<br>conscious lifestyle.',
      slide2_btn1:  'Explore Products',
      slide2_btn2:  'Contact Us',
      slide3_label: '100% Organic & Natural',
      slide3_h1:    'Pure. Organic.<br>Export-Grade.',
      slide3_p:     'Nurturing the planet with biodegradable solutions<br>trusted by global buyers.',
      slide3_btn1:  'Get Premium Quality',
      slide3_btn2:  'View Gallery',

      /* ── CTA Banner (index) ── */
      cta_title:  'Ready to Go Green?',
      cta_p:      'Explore our full range of premium organic and eco-friendly products.<br>Export-grade quality, delivered to your door.',
      cta_btn1:   'Shop All Products',
      cta_btn2:   'Get in Touch',

      /* ── Footer ── */
      footer_tagline:    'India\'s trusted exporter of premium cocopeat, bamboo & eco-friendly natural products.',
      footer_quick:      'Quick Links',
      footer_contact:    'Contact Info',
      footer_copyright:  '© 2025 Fourways International Trading. All rights reserved.',
      footer_admin:      'Admin Portal',

      /* ── Contact page ── */
      contact_reach_eyebrow: 'Reach Us',
      contact_info_h2: 'We\'d Love to Hear<br>From You',
      contact_bc:        'Contact',
      contact_p:         'Whether you have a bulk inquiry, export question, or simply wish to connect — our team is ready to assist with the care and elegance you deserve.',
      contact_name:      'Full Name',
      contact_email:     'Email Address',
      contact_interest:  'Interested In',
      contact_opt0:      'General Inquiry',
      contact_opt1:      'Cocopeat Products',
      contact_opt2:      'Grow Bags',
      contact_opt3:      'Bamboo Products',
      contact_opt4:      'Request Bulk Quote',
      contact_msg:       'Your Message',
      contact_ph_msg:    'Tell us about your requirements...',
      contact_send:      'Send Message',
      contact_email_lbl: 'Email Us',
      contact_call_lbl:  'Call Us',
      contact_hours:     'Mon – Sat, 9am – 6pm',
      contact_address_lbl: 'Our Address',
      contact_address:   '33 Avenue des Chartreux, 13004 Marseille, France',
      contact_alert:     'Thank you for your inquiry! Your email client will open with the message pre-filled. Please send it to complete your inquiry.',

      /* ── Products page ── */
      products_h1:   'Discover Our<br><em>Curated Collection</em>',
      products_p:    'Explore our range of sustainable coir and bamboo products.',
      products_eyebrow: 'Premium Collection',
      products_craft_eyebrow: 'Each product is a work of craft',
      filter_all:    'All',
      filter_coco:   'Cocopeat',
      filter_bamboo: 'Bamboo',
      filter_eco:    'Eco-Care',
      loading:       'Loading collection...',

      /* ── Gallery page ── */
      gallery_h1:  'Our Gallery',
      gallery_p:   'Explore our manufacturing processes and final products.',
      filter_photos: 'Photos',
      filter_videos: 'Videos',

      /* ── About page ── */
      about_bc:       'About Us',
      about_hero_eyebrow: 'Heritage & Vision',
      about_hero_h1:  'Heritage, Passion,<br><em>and French Craftsmanship</em>',
      about_identity_eyebrow: 'Our Identity',
      about_values_eyebrow: 'Our Values',
      about_btn_products: 'Explore Products',
      about_btn_quote: 'Get a Quote',
      about_who_h1:   'Who We Are',
      about_who_p1:   'We are a forward-thinking company committed to delivering high-quality products and exceptional service to customers worldwide. With a strong foundation built on innovation, reliability, and sustainability, we aim to create solutions that not only meet today\'s needs but also shape a better tomorrow.',
      about_who_p2:   'Our team consists of passionate professionals who bring expertise, creativity, and dedication to every project. We believe in long-term relationships, transparency, and continuous improvement, ensuring that every client experiences trust and value in every interaction.',
      about_sust_h2:  'Our Sustainability Promise',
      about_sust_p1:  'We are committed to a zero-waste manufacturing process. Our coir products are 100% biodegradable and sourced from ethically managed farms.',
      about_sust_p2:  'Every product you buy supports eco-friendly farming practices and helps reduce your carbon footprint. We believe in transparency, quality, and a greener future for generations to come.',
      about_cert_h2:  'Our Certifications & Compliance',      cert1_h3:       'ISO 9001:2015',
      cert1_p:        'Quality Management System Standard',
      cert2_h3:       'ISO 22000:2018',
      cert2_p:        'Food Safety Management System',
      cert3_h3:       'Verified Certificate of Trust',
      cert3_p:        'Ethical Business Practices & Reliability',
      cert4_h3:       'Official Certification',
      cert4_p:        'Registration & Compliance Document (2 Pages)',
      cert4_btn_1:    'View Page 2',
      cert4_btn_2:    'View Page 1',
      modal_page:     'Page',
      modal_of:       'of',

      /* ── Home — Carousel slides ── */
      home_slide1_eyebrow: 'Premium Cocopeat Solutions',
      home_slide1_title:   'The Art of<br><em>Sustainable Luxury</em>',
      home_slide1_sub:     'Export-grade cocopeat crafted from the heart of Tamil Nadu, delivered with French precision and ecological responsibility.',
      home_slide1_btn1:    'Explore Cocopeat',
      home_slide1_btn2:    'Request Quote',

      home_slide2_eyebrow: 'Sustainable Bamboo Products',
      home_slide2_title:   'Rooted in<br><em>French Elegance</em>',
      home_slide2_sub:     'Eco-friendly bamboo alternatives crafted for a plastic-free future — timeless, sustainable, and beautifully presented.',
      home_slide2_btn1:    'Discover Bamboo',
      home_slide2_btn2:    'Our Heritage',

      home_slide3_eyebrow: '100% Organic & Natural',
      home_slide3_title:   'Nature Is<br><em>The Highest Luxury</em>',
      home_slide3_sub:     'Nurturing the planet with biodegradable solutions. Every product honours the earth, trusted by 5000+ clients in 15+ countries.',
      home_slide3_btn1:    'View Gallery',
      home_slide3_btn2:    'Shop Collection',

      home_slide4_eyebrow: 'Pure Coir Heritage',
      home_slide4_title:   'Crafted from<br><em>Earth\'s Finest Fibre</em>',
      home_slide4_sub:     'From the golden husk of coconut to premium grow media — our coir products redefine what sustainable agriculture looks like.',
      home_slide4_btn1:    'See All Products',
      home_slide4_btn2:    'Our Story',

      home_slide5_eyebrow: 'Eco-Conscious Excellence',
      home_slide5_title:   'Growing a<br><em>Greener Tomorrow</em>',
      home_slide5_sub:     'ISO-certified, zero-waste, globally trusted. We bring the richness of Indian nature to the world — one sustainable product at a time.',
      home_slide5_btn1:    'Get in Touch',
      home_slide5_btn2:    'Browse Collection',

      /* ── Home — Features strip ── */
      home_feat1_label: 'Rooted in Marseille',
      home_feat1_sub:   'France-based, globally trusted',
      home_feat2_label: 'ISO Certified',
      home_feat2_sub:   'ISO 9001 & ISO 22000 compliant',
      home_feat3_label: '15+ Countries',
      home_feat3_sub:   'Global export network',
      home_feat4_label: '5000+ Happy Clients',
      home_feat4_sub:   'Premium quality, every order',

      /* ── Home — Collection section ── */
      home_col_eyebrow:  'Premium Selection',
      home_col_title:    'Curated<br><em>Collection</em>',
      home_col_sub:      'Each product is a testament to our commitment — where organic purity meets French refinement.',
      home_col_cat1:     'Cocopeat',
      home_col_name1:    'Premium Cocopeat Blocks',
      home_col_link1:    'Explore Collection',
      home_col_cat2:     'Eco-Care',
      home_col_name2:    'Coco Grow Bags',
      home_col_link2:    'Discover More',
      home_col_cat3:     'Bamboo',
      home_col_name3:    'Bamboo Essentials',
      home_col_link3:    'View Range',
      home_col_cta:      'View Full Catalogue',

      /* ── Home — About teaser ── */
      home_about_eyebrow: 'Our Heritage',
      home_about_title:   'French Precision,<br><em>Nature\'s Purity</em>',
      home_about_p:       'Born from the coconut farms of Tamil Nadu and guided by French precision, Fourways International Trading brings the finest organic products to discerning clients worldwide. We believe luxury and sustainability are not opposites — they are complementary.',
      home_about_stat1:   'Happy Clients',
      home_about_stat2:   'Products',
      home_about_stat3:   'Countries',
      home_about_btn1:    'Our Story',
      home_about_btn2:    'Get in Touch',
      home_about_badge:   'Years of<br>Excellence',

      /* ── Home — Sustainability ── */
      home_sust_eyebrow:  'The Art of Sustainability',
      home_sust_title:    'Crafted with Conscience,<br><em>Designed for the Future</em>',
      home_sust1_title:   'Purely Organic',
      home_sust1_text:    'Sourced from the heart of nature, untouched by synthetics. Every product carries the purity of its origin.',
      home_sust2_title:   'Zero Waste',
      home_sust2_text:    'A closed-loop philosophy that honours the earth. Our manufacturing process leaves nothing behind.',
      home_sust3_title:   'Global Standards',
      home_sust3_text:    'Excellence delivered to discerning clients worldwide. ISO certified for quality and food safety.',

      /* ── Home — Testimonials ── */
      home_test_eyebrow:  'Client Voices',
      home_test_title:    'Trusted by<br><em>Discerning Clients</em>',

      /* ── Home — CTA Banner ── */
      home_cta_eyebrow:   'Begin Your Journey',
      home_cta_title:     'Ready to Experience<br><em>Premium Craftsmanship?</em>',
      home_cta_p:         'Explore our curated collection or speak directly with our team for custom bulk orders and export inquiries.',
      home_cta_btn1:      'Browse Products',
      home_cta_btn2:      'Contact Us',

      /* ── Home — Footer products col ── */
      home_fp_title:      'Products',
      home_fp_1:          'Cocopeat Blocks',
      home_fp_2:          'Grow Bags',
      home_fp_3:          'Bamboo Products',
      home_fp_4:          'Eco Essentials',
      bc_gallery:  'Gallery',
      bc_products: 'Products',
      bc_about:    'About Us',
      bc_contact:  'Contact Us',
      bc_home:     'Home',
    },

    fr: {
      /* ── Navigation ── */
      nav_home:        'Accueil',
      nav_products:    'Produits',
      nav_gallery:     'Galerie',
      nav_story:       'Notre Histoire',
      nav_contact:     'Contact',
      nav_about:       'À Propos',
      lang_switch:     'English',

      /* ── Trust bar ── */
      trust_1: 'Livraison Gratuite en Inde',
      trust_2: '100% Bio Certifié',
      trust_3: 'Qualité Export',
      trust_4: 'Paiement à la Livraison',

      /* ── Features strip ── */
      feat1_title: 'Livraison Gratuite',
      feat1_sub:   'Livraison dans toute l\'Inde',
      feat2_title: '100% Biologique',
      feat2_sub:   'Produits naturels certifiés',
      feat3_title: 'Qualité Export',
      feat3_sub:   'Normes de qualité internationales',
      feat4_title: 'Sans Tracas',
      feat4_sub:   'Paiement livraison & Demande facile',

      /* ── Sustainability ── */
      sust_label:  'Notre Philosophie',
      sust_title:  'L\'Art de la Durabilité',
      sust_sub:    'Fabriqué avec conscience, conçu pour l\'avenir.',
      sust1_title: 'Purement Biologique',
      sust1_text:  'Issu du cœur de la nature, sans synthétiques ni produits chimiques.',
      sust2_title: 'Zéro Déchet',
      sust2_text:  'Une philosophie en circuit fermé qui respecte la terre et réduit l\'empreinte carbone.',
      sust3_title: 'Standards Mondiaux',
      sust3_text:  'L\'excellence livrée à des clients exigeants du monde entier.',

      /* ── About strip ── */
      about_label:   'Qui Sommes-Nous',
      about_years:   'Années d\'Excellence',
      about_title:   'Produits Naturels Premium, Ancrés dans un But',
      about_p1:      'Fourways International Trading est un exportateur basé au Tamil Nadu, spécialisé dans la fibre de coco, le bambou et les produits écologiques premium. Nous combinons le savoir traditionnel et les normes de qualité modernes pour livrer le meilleur de la nature aux foyers et aux fermes du monde entier.',
      about_p2:      'Chaque produit que nous fabriquons est une promesse — envers la terre, nos clients, et un avenir durable.',
      stat1_label:   'Clients Satisfaits',
      stat2_label:   'Produits',
      stat3_label:   'États Servis',
      stat4_label:   'Biologique',
      about_cta:     'Découvrir Notre Histoire',

      /* ── Hero slides ── */
      slide1_label: 'Qualité Export Premium',
      slide1_h1:    'Les Meilleures Solutions<br>de Fibre de Coco',
      slide1_p:     'Substrat haute pureté pour des racines plus fortes, un meilleur rendement,<br>et un avenir plus vert.',
      slide1_btn1:  'Commander',
      slide1_btn2:  'Notre Histoire',
      slide2_label: 'Vie Durable',
      slide2_h1:    'Produits en Bambou<br>Durables',
      slide2_p:     'Alternatives écologiques conçues pour un mode de vie<br>sans plastique et responsable.',
      slide2_btn1:  'Explorer les Produits',
      slide2_btn2:  'Nous Contacter',
      slide3_label: '100% Biologique & Naturel',
      slide3_h1:    'Pur. Biologique.<br>Qualité Export.',
      slide3_p:     'Nourrir la planète avec des solutions biodégradables<br>approuvées par les acheteurs mondiaux.',
      slide3_btn1:  'Obtenir Qualité Premium',
      slide3_btn2:  'Voir la Galerie',

      /* ── CTA Banner ── */
      cta_title:  'Prêt à Passer au Vert ?',
      cta_p:      'Découvrez notre gamme complète de produits biologiques et écologiques premium.<br>Qualité export, livré à votre porte.',
      cta_btn1:   'Voir Tous les Produits',
      cta_btn2:   'Nous Contacter',

      /* ── Footer ── */
      footer_tagline:    'Exportateur de confiance de fibre de coco premium, bambou et produits naturels écologiques.',
      footer_quick:      'Liens Rapides',
      footer_contact:    'Coordonnées',
      footer_copyright:  '© 2025 Fourways International Trading. Tous droits réservés.',
      footer_admin:      'Portail Admin',

      /* ── Contact page ── */
      contact_reach_eyebrow: 'Nous Contacter',
      contact_info_h2: 'Nous Serions Ravis<br>de Vous Entendre',
      contact_bc:        'Contact',
      contact_p:         'Que vous ayez une demande en gros, une question d\'exportation, ou simplement souhaitez nous contacter — notre équipe est prête à vous aider avec le soin et l\'élégance que vous méritez.',
      contact_name:      'Nom Complet',
      contact_email:     'Adresse E-mail',
      contact_interest:  'Intéressé Par',
      contact_opt0:      'Demande Générale',
      contact_opt1:      'Produits en Fibre de Coco',
      contact_opt2:      'Sacs de Culture',
      contact_opt3:      'Produits en Bambou',
      contact_opt4:      'Demander un Devis Groupé',
      contact_msg:       'Votre Message',
      contact_ph_msg:    'Parlez-nous de vos besoins...',
      contact_send:      'Envoyer le Message',
      contact_email_lbl: 'Envoyez-Nous un E-mail',
      contact_call_lbl:  'Appelez-Nous',
      contact_hours:     'Lun – Sam, 9h – 18h',
      contact_address_lbl: 'Notre Adresse',
      contact_address:   '33 Avenue des Chartreux, 13004 Marseille, France',
      contact_alert:     'Merci pour votre demande ! Votre client de messagerie s\'ouvrira avec le message pré-rempli. Veuillez l\'envoyer pour compléter votre demande.',

      /* ── Products page ── */
      products_h1:   'Découvrez Notre<br><em>Collection Sélectionnée</em>',
      products_p:    'Explorez notre gamme de produits durables en coco et bambou.',
      products_eyebrow: 'Collection Premium',
      products_craft_eyebrow: 'Chaque produit est une œuvre d\'artisanat',
      filter_all:    'Tous',
      filter_coco:   'Fibre de Coco',
      filter_bamboo: 'Bambou',
      filter_eco:    'Éco-Soins',
      loading:       'Chargement de la collection...',

      /* ── Gallery page ── */
      gallery_h1:    'Notre Galerie',
      gallery_p:     'Découvrez nos processus de fabrication et nos produits finis.',
      filter_photos: 'Photos',
      filter_videos: 'Vidéos',

      /* ── About page ── */
      about_bc:       'À Propos',
      about_hero_eyebrow: 'Héritage & Vision',
      about_hero_h1:  'Héritage, Passion,<br><em>et Artisanat Français</em>',
      about_identity_eyebrow: 'Notre Identité',
      about_values_eyebrow: 'Nos Valeurs',
      about_btn_products: 'Explorer les Produits',
      about_btn_quote: 'Obtenir un Devis',
      about_who_h1:   'Qui Sommes-Nous',
      about_who_p1:   'Nous sommes une entreprise innovante engagée à fournir des produits de haute qualité et un service exceptionnel à nos clients du monde entier. Avec une base solide construite sur l\'innovation, la fiabilité et la durabilité, nous créons des solutions qui répondent aux besoins actuels et façonnent un avenir meilleur.',
      about_who_p2:   'Notre équipe est composée de professionnels passionnés apportant expertise, créativité et dévouement à chaque projet. Nous croyons aux relations à long terme, à la transparence et à l\'amélioration continue, garantissant que chaque client ressent confiance et valeur dans chaque interaction.',
      about_sust_h2:  'Notre Engagement pour la Durabilité',
      about_sust_p1:  'Nous nous engageons dans un processus de fabrication zéro déchet. Nos produits en coco sont 100% biodégradables et proviennent de fermes gérées de manière éthique.',
      about_sust_p2:  'Chaque produit que vous achetez soutient des pratiques agricoles écologiques et contribue à réduire votre empreinte carbone. Nous croyons en la transparence, la qualité et un avenir plus vert pour les générations à venir.',
      about_cert_h2:  'Nos Certifications & Conformité',
      cert1_h3:       'ISO 9001:2015',
      cert1_p:        'Norme de Système de Management de la Qualité',
      cert2_h3:       'ISO 22000:2018',
      cert2_p:        'Système de Management de la Sécurité Alimentaire',
      cert3_h3:       'Certificat de Confiance Vérifié',
      cert3_p:        'Pratiques Commerciales Éthiques & Fiabilité',
      cert4_h3:       'Certification Officielle',
      cert4_p:        'Document d\'Enregistrement & de Conformité (2 Pages)',
      cert4_btn_1:    'Voir Page 2',
      cert4_btn_2:    'Voir Page 1',
      modal_page:     'Page',
      modal_of:       'sur',

      /* ── Breadcrumbs ── */
      bc_home:     'Accueil',
      bc_gallery:  'Galerie',
      bc_products: 'Produits',
      bc_about:    'À Propos',
      bc_contact:  'Contactez-Nous',

      /* ── Home — Carousel slides ── */
      home_slide1_eyebrow: 'Solutions Cocopeat Premium',
      home_slide1_title:   'L\'Art du<br><em>Luxe Durable</em>',
      home_slide1_sub:     'Cocopeat de qualité export du cœur du Tamil Nadu, livré avec précision française et responsabilité écologique.',
      home_slide1_btn1:    'Explorer le Cocopeat',
      home_slide1_btn2:    'Demander un Devis',

      home_slide2_eyebrow: 'Produits en Bambou Durables',
      home_slide2_title:   'Ancré dans<br><em>l\'Élégance Française</em>',
      home_slide2_sub:     'Alternatives écologiques en bambou conçues pour un avenir sans plastique — intemporelles, durables et magnifiquement présentées.',
      home_slide2_btn1:    'Découvrir le Bambou',
      home_slide2_btn2:    'Notre Héritage',

      home_slide3_eyebrow: '100% Biologique & Naturel',
      home_slide3_title:   'La Nature Est<br><em>Le Plus Grand Luxe</em>',
      home_slide3_sub:     'Nourrir la planète avec des solutions biodégradables. Chaque produit honore la terre, approuvé par 5000+ clients dans 15+ pays.',
      home_slide3_btn1:    'Voir la Galerie',
      home_slide3_btn2:    'Acheter la Collection',

      home_slide4_eyebrow: 'Héritage de la Fibre de Coco',
      home_slide4_title:   'Fabriqué à partir de<br><em>la Plus Fine Fibre de la Terre</em>',
      home_slide4_sub:     'De l\'enveloppe dorée de la noix de coco aux meilleurs substrats de culture — nos produits coir redéfinissent l\'agriculture durable.',
      home_slide4_btn1:    'Voir Tous les Produits',
      home_slide4_btn2:    'Notre Histoire',

      home_slide5_eyebrow: 'Excellence Écologique',
      home_slide5_title:   'Construire un<br><em>Avenir Plus Vert</em>',
      home_slide5_sub:     'Certifié ISO, zéro déchet, mondialement approuvé. Nous apportons la richesse de la nature indienne au monde — un produit durable à la fois.',
      home_slide5_btn1:    'Nous Contacter',
      home_slide5_btn2:    'Parcourir la Collection',

      /* ── Home — Features strip ── */
      home_feat1_label: 'Ancré à Marseille',
      home_feat1_sub:   'Basé en France, approuvé mondialement',
      home_feat2_label: 'Certifié ISO',
      home_feat2_sub:   'Conforme ISO 9001 & ISO 22000',
      home_feat3_label: '15+ Pays',
      home_feat3_sub:   'Réseau d\'exportation mondial',
      home_feat4_label: '5000+ Clients Satisfaits',
      home_feat4_sub:   'Qualité premium, chaque commande',

      /* ── Home — Collection section ── */
      home_col_eyebrow:  'Sélection Premium',
      home_col_title:    'Collection<br><em>Sélectionnée</em>',
      home_col_sub:      'Chaque produit témoigne de notre engagement — où la pureté organique rencontre le raffinement français.',
      home_col_cat1:     'Cocopeat',
      home_col_name1:    'Blocs de Cocopeat Premium',
      home_col_link1:    'Explorer la Collection',
      home_col_cat2:     'Éco-Soins',
      home_col_name2:    'Sacs de Culture Coco',
      home_col_link2:    'Découvrir Plus',
      home_col_cat3:     'Bambou',
      home_col_name3:    'Essentiels en Bambou',
      home_col_link3:    'Voir la Gamme',
      home_col_cta:      'Voir le Catalogue Complet',

      /* ── Home — About teaser ── */
      home_about_eyebrow: 'Notre Héritage',
      home_about_title:   'Précision Française,<br><em>Pureté de la Nature</em>',
      home_about_p:       'Née des fermes de noix de coco du Tamil Nadu et guidée par la précision française, Fourways International Trading apporte les meilleurs produits biologiques à des clients exigeants du monde entier. Nous croyons que luxe et durabilité ne sont pas des opposés — ils sont complémentaires.',
      home_about_stat1:   'Clients Satisfaits',
      home_about_stat2:   'Produits',
      home_about_stat3:   'Pays',
      home_about_btn1:    'Notre Histoire',
      home_about_btn2:    'Nous Contacter',
      home_about_badge:   'Années<br>d\'Excellence',

      /* ── Home — Sustainability ── */
      home_sust_eyebrow:  'L\'Art de la Durabilité',
      home_sust_title:    'Fabriqué avec Conscience,<br><em>Conçu pour l\'Avenir</em>',
      home_sust1_title:   'Purement Biologique',
      home_sust1_text:    'Issu du cœur de la nature, sans synthétiques. Chaque produit porte la pureté de son origine.',
      home_sust2_title:   'Zéro Déchet',
      home_sust2_text:    'Une philosophie en circuit fermé qui honore la terre. Notre processus de fabrication ne laisse rien derrière.',
      home_sust3_title:   'Standards Mondiaux',
      home_sust3_text:    'L\'excellence livrée à des clients exigeants du monde entier. Certifié ISO pour la qualité et la sécurité alimentaire.',

      /* ── Home — Testimonials ── */
      home_test_eyebrow:  'Témoignages Clients',
      home_test_title:    'Approuvé par<br><em>des Clients Exigeants</em>',

      /* ── Home — CTA Banner ── */
      home_cta_eyebrow:   'Commencez Votre Voyage',
      home_cta_title:     'Prêt à Vivre<br><em>l\'Artisanat Premium ?</em>',
      home_cta_p:         'Explorez notre collection sélectionnée ou parlez directement à notre équipe pour des commandes en gros personnalisées et des demandes d\'exportation.',
      home_cta_btn1:      'Parcourir les Produits',
      home_cta_btn2:      'Nous Contacter',

      /* ── Home — Footer products col ── */
      home_fp_title:      'Produits',
      home_fp_1:          'Blocs de Cocopeat',
      home_fp_2:          'Sacs de Culture',
      home_fp_3:          'Produits en Bambou',
      home_fp_4:          'Éco Essentiels',
    }
  };

  /**
   * Apply translations to any element carrying a [data-i18n] attribute.
   * Supports:
   *   data-i18n="key"            → sets innerText (or innerHTML if key contains <br>)
   *   data-i18n-placeholder="key" → sets placeholder attribute
   *   data-i18n-label="key"      → sets aria-label attribute
   */
  function apply(lang) {
    const t = translations[lang] || translations.en;
    document.documentElement.lang = lang;

    // innerHTML / innerText
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        // Use innerHTML if value contains any HTML tag
        if (/<[a-z][\s\S]*>/i.test(t[key])) {
          el.innerHTML = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });

    // placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) el.placeholder = t[key];
    });

    // aria-label
    document.querySelectorAll('[data-i18n-label]').forEach(el => {
      const key = el.getAttribute('data-i18n-label');
      if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
    });

    // persist
    localStorage.setItem('fw_lang', lang);
  }

  function toggleLanguage() {
    const current = localStorage.getItem('fw_lang') || 'en';
    const next = current === 'en' ? 'fr' : 'en';
    apply(next);
    // Update all lang switcher buttons on the page
    document.querySelectorAll('#langSwitcher, .lux-nav__lang, .lux-nav__lang--mobile').forEach(btn => {
      btn.textContent = next === 'fr' ? 'English' : 'Français';
    });
  }

  function getCurrentLang() {
    return localStorage.getItem('fw_lang') || 'en';
  }

  function t(key) {
    const lang = getCurrentLang();
    return (translations[lang] || translations.en)[key] || key;
  }

  // Expose
  window.i18n = { apply, toggleLanguage, getCurrentLang, t, translations };
})();
