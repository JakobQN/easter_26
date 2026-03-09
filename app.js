(function () {
  'use strict';

  var CART_KEY = 'englar_cart';
  var AGE_KEY = 'englar_age_verified';

  function getCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (e) {
      console.warn('Cart could not be loaded', e);
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Cart could not be saved', e);
    }
  }

  function updateCartCount(cart) {
    var countEl = document.querySelector('[data-cart-count]');
    if (!countEl) return;
    var cartData = cart || getCart();
    var count = cartData.reduce(function (sum, item) {
      return sum + (item.quantity || 0);
    }, 0);
    countEl.textContent = count;
  }

  function showNotification(message) {
    var el = document.getElementById('notification');
    if (!el) return;
    el.textContent = message;
    el.classList.add('visible');
    setTimeout(function () {
      el.classList.remove('visible');
    }, 2200);
  }

  function checkAgeGate() {
    if (localStorage.getItem(AGE_KEY)) return;
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('snipcart') || userAgent.includes('bot') || userAgent.includes('crawler') || userAgent.includes('spider')) {
      localStorage.setItem(AGE_KEY, 'true');
      return;
    }
    var overlay = document.getElementById('age-gate');
    if (overlay) overlay.style.display = 'flex';
  }

  function addToCart(item) {
    var cart = getCart();
    var index = cart.findIndex(function (existing) {
      return existing.id === item.id && existing.packageSize === item.packageSize;
    });

    if (index > -1) {
      cart[index].quantity = (cart[index].quantity || 0) + (item.quantity || 1);
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        packageSize: item.packageSize,
        price: item.price,
        quantity: item.quantity || 1
      });
    }

    saveCart(cart);
    updateCartCount(cart);
    showNotification(t('common.added_to_cart'));
  }

  function removeFromCart(indexToRemove) {
    var cart = getCart();
    if (indexToRemove < 0 || indexToRemove >= cart.length) return;
    cart.splice(indexToRemove, 1);
    saveCart(cart);
    updateCartCount(cart);
  }

  var TRANSLATIONS = {
    en: {
      common: {
        logo_subtitle: 'Wine Estate',
        back_to_overview: 'Back to overview',
        cart_empty: 'Your cart is currently empty.',
        added_to_cart: 'Added to cart',
        item_removed: 'Item removed',
        checkout_soon: 'Checkout via Stripe will be available soon.',
        related_wines: 'Further recommendations from our wine cellar.',
        wine_age: 'Vine age',
        elevation: 'Elevation',
        soil: 'Soil'
      },
      age: {
        title: 'Age Verification',
        question: 'Are you over 18?',
        yes: 'Yes',
        no: 'No',
        denied_title: 'Access Denied',
        denied_message: 'You must be over 18 to access this site.',
        back_home: 'Back to Home'
      },
      pages: {
        index: {
          intro_title: 'Dear wine lovers, welcome to Schloss Englar',
          intro_text: 'With the first warm rays of sunshine and the awakening of nature, a special time of year begins, bringing anticipation for shared moments with family and friends. The coming spring weeks and the Easter season invite you to prepare festive tables and look forward to these occasions with pleasure. With this Easter offer, we would like to present you with a carefully curated selection from our family winery, so that you are perfectly prepared for the upcoming holidays and enjoyable moments of spring.',
          hero_label: 'A spring for good wine!',
          cta_text: 'Take me to the offer',
          offer_pinot_title: 'Rosé de Castel',
          offer_pinot_text: 'A delicate Rosé capturing the freshness of spring. Elegant and refined—perfect for long days in the sun.',
          offer_lumiere_title: 'Leon (Vernatsch)',
          offer_lumiere_text: 'Authentic South Tyrol in a glass! The Vernatsch combines tradition with modern enjoyment. Fruity, lively, with fine herbal notes — a superb companion for festive tables.',
          offer_magnum_title: 'Berg (Pinot Blanc)',
          offer_magnum_text: 'Elegance from the mountains! The Pinot Blanc Berg is the noble classic for lovers of fine white wines. With floral notes and perfect minerality – a dignified introduction to festive meals.',
          offer_pinot_price: '15,00€',
          offer_lumiere_price: '19,00€',
          offer_magnum_price: '19,00€',
          cta_rose: 'Discover Rosé',
          cta_leon: 'Discover Leon',
          cta_berg: 'Discover Berg'
        },
        rose: {
          details_title: 'Wine Details',
          page_title: 'Rosé de Castel',
          page_text: 'Our South Tyrolean Rosé is the fruit of sun-drenched mountain slopes and is crafted with passion. This delicate, elegant Rosé captivates with lively strawberry notes, fine minerality and wonderful freshness. With effervescent fruity characteristics and subtle floral nuances, this wine is the perfect companion for long days and sunny hours. A wine that unites the elegance and tradition of South Tyrolean winemaking – ideal for lovers of fine Rosé wines.',
            package_title: 'Rosé de Castel - 2023',
            package_description: '',
            package_weinbrief: '<a href="doc/Rosé 2023.pdf" target="_blank" rel="noopener noreferrer">Weinbrief</a>',
          cta_button1: 'Add to cart',
          cta_button2: 'Add to cart',
          option_bottle: '0,75 l Bottle',
          option_case: 'Case (6 Bottles)',
          shipping_disclaimer: 'Free shipping on orders over €150.; All prices include VAT.'
        },
        berg: {
          details_title: 'Wine details',
          page_title: 'Berg (Pinot Blanc) - 2024',
          page_text: 'Our Pinot Blanc represents the elegance and sophistication of South Tyrolean winemaking. Carefully crafted from the finest grapes of our mountain vineyards, this white wine impresses with complex aromas of apple, pear, and delicate citrus blossom. The mineral structure and fine acidity speak of sunny mountain slopes and limestone-rich soil. A white wine for discerning palates, ideal for refined dining and special occasions – a wine that dignifies the festivity of Easter meals.',
          package_title: 'Berg (Pinot Blanc)',
          package_description: '',
          package_weinbrief: '<a href="doc/Berg 2024.pdf" target="_blank" rel="noopener noreferrer">Weinbrief</a>',
          cta_button1: 'Add to cart',
          cta_button2: 'Add to cart',
          option_bottle: '0,75 l Bottle',
          option_case: 'Case (6 Bottles)',
          shipping_disclaimer: 'Free shipping on orders over €150.; All prices include VAT.'
        },

        leon: {
          details_title: 'Wine details',
          page_title: 'Leon (Vernatsch)',
          page_text: 'Our interpretation of this historic South Tyrolean varietal is based on extended aging in French oak, through which its character reaches its full expression. The result is not heaviness, but clarity: varietal-typical floral and fruity aromas emerge transparently, and on the palate it presents itself as a finely structured, harmonious wine.',
          package_title: 'Leon (Vernatsch) - 2021',
          package_description: '',
          package_weinbrief: '<a href="doc/Leon 2021.pdf" target="_blank" rel="noopener noreferrer">Weinbrief</a>',
          cta_button1: 'Add to cart',
          cta_button2: 'Add to cart',
          option_bottle: '0,75 l Bottle',
          option_case: 'Case (6 Bottles)',
          shipping_disclaimer: 'Free shipping on orders over €150.; All prices include VAT.'
        },
        cart: {}
      }
    },
    de: {
      common: {
        logo_subtitle: 'Weingut',
        back_to_overview: 'Zurück zur Übersicht',
        cart_empty: 'Ihr Warenkorb ist derzeit leer.',
        added_to_cart: 'In den Warenkorb gelegt',
        item_removed: 'Artikel entfernt',
        checkout_soon: 'Checkout via Stripe wird bald verfügbar sein.',
        related_wines: 'Weitere Empfehlungen aus unserem Weinkeller.',
        wine_age: 'Alter Rebstöcke',
        elevation: 'Höhe',
        soil: 'Böden'
      },
      age: {
        title: 'Altersüberprüfung',
        question: 'Bitte bestätigen Sie, dass Sie 18 Jahre oder älter sind.',
        yes: 'Ja',
        no: 'Nein',
        denied_title: 'Zugriff verweigert',
        denied_message: 'Sie müssen über 18 sein, um auf diese Seite zuzugreifen.',
        back_home: 'Zurück zur Startseite'
      },
      pages: {
        index: {
          intro_title: 'Ostergrüße aus Schloss Englar',
          intro_text: 'Mit den ersten warmen Sonnenstrahlen und dem Erwachen der Natur beginnt eine besondere Zeit des Jahres, die Vorfreude auf gemeinsame Stunden mit Familie und Freunden weckt. Die kommenden Frühlingswochen und die Osterzeit laden dazu ein, festliche Tafeln zu planen und sich genussvoll auf diese Anlässe vorzubereiten. Mit diesem Osterangebot möchten wir Ihnen eine sorgfältig zusammengestellte Auswahl aus unserem Familienweingut an die Hand geben, damit Sie für die kommenden Feiertage und genussvollen Frühlingsmomente bestens vorbereitet sind.',
          hero_label: 'Ein Frühling für guten Wein!',
          cta_text: 'Entdecke das Angebot',
          offer_pinot_title: 'Rosé de Castel',
          offer_pinot_text: 'Unser zarter Rosé besticht durch lebendige Erdbeernoten und feine Mineralität. Ein eleganter Wein für die länger werdenden Frühlingstage.',
          offer_lumiere_title: 'León (Vernatsch)',
          offer_lumiere_text: 'Authentisches Südtirol im Glas! Der Vernatsch vereint Tradition mit modernem Genuss. Fruchtig, lebendig, mit feinen Kräuternoten – ein würdiger Begleiter für festliche Tafeln.',
          offer_magnum_title: 'Eppan-Berg (Pinot Blanc)',
          offer_magnum_text: 'Eleganz aus den Bergen! Unser Pinot Blanc ist der edle Klassiker für Liebhaber feiner Weißweine. Mit floralen Noten und perfekter Mineralität – ein würdevoller Auftakt zu festlichen Menüs.',
          offer_pinot_price: '15,00€',
          offer_lumiere_price: '19,00€',
          offer_magnum_price: '19,00€',
          cta_rose: 'Rosé entdecken',
          cta_leon: 'León entdecken',
          cta_berg: 'Eppan-Berg entdecken'
        },
        rose: {
          details_title: 'Weindetails',
          page_title: 'Rosé de Castel',
          page_text: 'Unser Rosé ist die Frucht sonnenverwöhnter Berglagen und wird mit Leidenschaft gekeltert. Dieser zarte, elegante Rosé besticht durch lebendige Erdbeernoten, feine Mineralität und eine wunderbare Frische. Mit spritzig-fruchtigen Charakterzügen und subtilen floralen Nuancen ist dieser Wein der vollkommene Begleiter für lange Tage und sonnige Stunden. Ein Wein, der die Eleganz und Tradition des Südtiroler Weinbaus vereint.',
          package_title: 'Rosé de Castel - 2023',
            package_description: '',
            package_weinbrief: '<a href="doc/Rosé 2023.pdf" target="_blank" rel="noopener noreferrer">Weinbrief</a>',
          cta_button1: 'In den Warenkorb',
          cta_button2: 'In den Warenkorb',
          option_bottle: '0,75 l Flasche',
          option_case: 'Karton (6er)',
          shipping_disclaimer: 'Kostenloser Versand ab €150 Bestellwert; Alle Preise enthalten MwSt.'
        },
        berg: {
          details_title: 'Weindetails',
          page_title: 'Eppan-Berg (Pinot Blanc)',
          page_text: 'Unser Pinot Blanc repräsentiert die Eleganz und Raffinesse Südtiroler Weinbaus. Sorgfältig gekeltert aus den besten Trauben unserer Berg-Lagen, besticht dieser Weißwein durch komplexe Aromen von Apfel, Birne und zartem Zitrusblatt. Die mineralische Struktur und feine Säure erzählen von sonnigen Berglagen und kalkhaltigem Boden. Ein Weißwein für anspruchsvolle Gaumen, ideal für gehobene Tafelrunden und besondere Momente – ein Wein, der die Festlichkeit der Ostertage würdevoll erhebt.',
          package_title: 'Eppan-Berg (Pinot Blanc) - 2024',
          package_description: '',
          package_weinbrief: '<a href="doc/Berg 2024.pdf" target="_blank" rel="noopener noreferrer">Weinbrief</a>',
          shipping_disclaimer: 'Kostenloser Versand ab €150 Bestellwert; Alle Preise enthalten MwSt.',
          cta_button1: 'In den Warenkorb',
          cta_button2: 'In den Warenkorb',
          option_bottle: '0,75 l Flasche',
          option_case: 'Karton (6er)',
        },
        leon: {
          details_title: 'Weindetails',
          page_title: 'Leon (Vernatsch)',
          page_text: 'Unsere Interpretation dieser historischen Südtiroler Rebsorte basiert auf der langen Reifung in französischer Eiche, wodurch ihr Charakter seine volle Entfaltung erreicht. Das Ergebnis ist keine Schwere, sondern Klarheit: Sortentypische florale und fruchtige Aromen treten transparent hervor, und am Gaumen präsentiert sich ein fein strukturierter, harmonischer Wein.',
          package_title: 'Leon (Vernatsch) - 2021',
          package_description: '',
          package_weinbrief: '<a href="doc/Leon 2021.pdf" target="_blank" rel="noopener noreferrer">Weinbrief</a>',
          cta_button1: 'In den Warenkorb',
          cta_button2: 'In den Warenkorb',
          option_bottle: '0,75 l Flasche',
          option_case: 'Karton (6er)',
          shipping_disclaimer: 'Kostenloser Versand ab €150 Bestellwert; Alle Preise enthalten MwSt.'
        },
        cart: {}
      }
    },
    it: {
      common: {
        logo_subtitle: 'Azienda vinicola',
        back_to_overview: 'Torna indietro',
        cart_empty: 'Il tuo carrello è vuoto.',
        added_to_cart: 'Aggiunto al carrello',
        item_removed: 'Elemento rimosso',
        checkout_soon: 'Il checkout tramite Stripe sarà disponibile a breve.',
        related_wines: 'Altri consigli dalla nostra cantina.',
        wine_age: 'Età viti',
        elevation: 'Altitudine',
        soil: 'Terreno'
      },
      age: {
        title: 'Verifica dell\'età',
        question: 'Hai più di 18 anni?',
        yes: 'Sì',
        no: 'No',
        denied_title: 'Accesso negato',
        denied_message: 'Devi avere più di 18 anni per accedere a questo sito.',
        back_home: 'Torna alla home'
      },
      pages: {
        index: {
          intro_title: 'Cari appassionati di vino, benvenuti a Schloss Englar',
          intro_text: 'Con i primi caldi raggi di sole e il risveglio della natura inizia un periodo speciale dell’anno, che accende l’attesa di momenti condivisi con famiglia e amici. Le prossime settimane primaverili e il periodo pasquale invitano a preparare tavole festive e a pregustare con piacere queste occasioni. Con questa offerta pasquale desideriamo metterVi a disposizione una selezione accuratamente composta della nostra azienda vinicola di famiglia, affinché siate perfettamente preparati per le prossime festività e i piacevoli momenti della primavera.',
          hero_label: 'Una primavera per il buon vino!',
          cta_text: 'Scopri l\'offerta',
          offer_pinot_title: 'Rosé de Castel',
          offer_pinot_text: 'Un elegante rosato che cattura la freschezza della primavera. Delicato e raffinato – perfetto per lunghe giornate al sole.',
          offer_lumiere_title: 'Leon (Vernatsch)',
          offer_lumiere_text: 'L\'autentico Alto Adige in un bicchiere! Il Vernatsch unisce tradizione e piacere moderno. Fruttato, vivace, con delicate note erbacee – un ottimo compagno per tavole festose.',
          offer_magnum_title: 'Berg (Pinot Blanc)',
          offer_magnum_text: 'Eleganza dalle montagne! Il Pinot Blanc Berg è il classico nobile per gli amanti dei vini bianchi fini. Con note floreali e mineralità perfetta – un dignitoso inizio per pasti festivi.',
          offer_pinot_price: '15,00€',
          offer_lumiere_price: '19,00€',
          offer_magnum_price: '19,00€',
          cta_rose: 'Scopri Rosé',
          cta_leon: 'Scopri Leon',
          cta_berg: 'Scopri Berg'
        },
        rose: {
          details_title: 'Dettagli del vino',
          page_title: 'Rosé de Castel',
          page_text: 'Il nostro rosato altoatesino è il frutto di pendii montani baciati dal sole ed è vinificato con passione. Questo rosato delicato ed elegante conquista con note di fragola vivaci, fine mineralità e una meravigliosa freschezza. Con caratteristiche fruttate spumeggianti e sottili sfumature floreali, questo vino è il compagno perfetto per lunghe giornate e ore di sole. Un vino che unisce eleganza e tradizione della vinificazione altoatesina – ideale per gli amanti dei rosati di qualità.',
          package_title: 'Rosé de Castel - 2023',
            package_description: '',
            package_weinbrief: '<a href="doc/Rosé 2023.pdf" target="_blank" rel="noopener noreferrer">Weinbrief</a>',
          cta_button1: 'Aggiungi al carello',
          cta_button2: 'Aggiungi al carello',
          option_bottle: '0,70 l Bottiglia',
          option_case: 'Cartone (6 bottiglie)',
          shipping_disclaimer: 'Spedizione gratuita per ordini superiori a €150; Tutti i prezzi sono compresi di IVA.'
        },
        berg: {
          details_title: 'Dettagli del vino',
          page_title: 'Berg (Pinot Blanc)',
          page_text: 'Il nostro Pinot Blanc rappresenta l\'eleganza e la raffinatezza della vinificazione altoatesina. Ottenuto con cura dalle migliori uve dei nostri vigneti di montagna, questo vino bianco affascina con aromi complessi di mela, pera e delicati fiori di agrumi. La struttura minerale e la fine acidità raccontano di pendii assolati e terreni ricchi di calcare. Un vino bianco per palati esigenti, ideale per tavole raffinate e momenti speciali – un vino che glorifica la festività della Pasqua.',
          package_title: 'Berg (Pinot Blanc) - 2024',
          package_description: '',
          package_weinbrief: '<a href="doc/Berg 2024.pdf" target="_blank" rel="noopener noreferrer">Weinbrief</a>',
          cta_button1: 'Aggiungi al carello',
          cta_button2: 'Aggiungi al carello',
          option_bottle: '0,70 l Bottiglia',
          option_case: 'Cartone (6 bottiglie)',
          shipping_disclaimer: 'Spedizione gratuita per ordini superiori a €150; Tutti i prezzi sono compresi di IVA.'
        },
        leon: {
          details_title: 'Dettagli del vino',
          page_title: 'Leon (Vernatsch)',
          page_text: 'La nostra interpretazione di questo vitigno altoatesino storico si basa su un lungo invecchiamento in rovere francese, attraverso il quale il suo carattere raggiunge la piena espressione. Il risultato non è pesantezza, ma chiarezza: gli aromi floreali e fruttati tipici del vitigno emergono in modo trasparente, e al palato si presenta come un vino finemente strutturato e armonico.',
          package_title: 'Leon (Vernatsch) - 2021',
          package_description: '',
          package_weinbrief: '<a href="doc/Leon 2021.pdf" target="_blank" rel="noopener noreferrer">Weinbrief</a>',
          cta_button1: 'Aggiungi al carello',
          cta_button2: 'Aggiungi al carello',
          option_bottle: '0,70 l Bottiglia',
          option_case: 'Cartone (6 bottiglie)',
          shipping_disclaimer: 'Spedizione gratuita per ordini superiori a €150; Tutti i prezzi sono compresi di IVA.'
        },
        cart: {}
      }
    }
  };

  var CURRENT_LANG = localStorage.getItem('englar_lang') || 'de';

  function t(key) {
    var parts = key.split('.');
    var cur = TRANSLATIONS[CURRENT_LANG] || TRANSLATIONS.en;
    for (var i = 0; i < parts.length; i++) {
      if (!cur) return '';
      cur = cur[parts[i]];
    }
    return cur || '';
  }

  function applyPageTranslations() {
    // Common translations
    var logoSubtitle = document.querySelector('.logo-subtitle');
    if (logoSubtitle) logoSubtitle.textContent = t('common.logo_subtitle');

    var backLink = document.querySelector('.back-to-overview');
    if (backLink) {
      backLink.innerHTML = '<span class="arrow" aria-hidden="true">&larr;</span> ' + t('common.back_to_overview');
    }

    // Apply all data-i18n attributes
    var i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var translation = t(key);
      if (translation) {
        // If the translation contains HTML tags (e.g. <br>), set as HTML,
        // otherwise set as plain text to avoid accidental HTML injection.
        if (translation.indexOf('<') !== -1) {
          el.innerHTML = translation;
        } else {
          // For buttons and links, use textContent; for other elements, use textContent as well
          el.textContent = translation;
        }
      }
    });

    // Page specific
    var page = (document.body && document.body.getAttribute('data-page')) || '';
    if (page && TRANSLATIONS[CURRENT_LANG].pages[page]) {
      var pageTrans = TRANSLATIONS[CURRENT_LANG].pages[page];
      var hero = document.querySelector('.sub-hero h1');
      if (hero && pageTrans.page_title) hero.textContent = pageTrans.page_title;

      var detailsHeading = document.querySelector('.product-specs h2');
      if (detailsHeading && pageTrans.details_title) detailsHeading.textContent = pageTrans.details_title;

      var packageHeading = document.querySelector('.product-packages h2');
      if (packageHeading && pageTrans.package_title) packageHeading.textContent = pageTrans.package_title;

      var packagePara = document.querySelector('.product-packages p[data-i18n]');
      if (packagePara) {
        var wbContainer = packagePara.parentNode.querySelector('.weinbrief-link');
        if (!wbContainer) {
          wbContainer = document.createElement('div');
          wbContainer.className = 'weinbrief-link';
          packagePara.parentNode.insertBefore(wbContainer, packagePara);
        }
        if (pageTrans.package_weinbrief) wbContainer.innerHTML = pageTrans.package_weinbrief;
        else wbContainer.innerHTML = '';
        if (pageTrans.package_description) {
          packagePara.innerHTML = pageTrans.package_description;
          packagePara.style.display = '';
        } else {
          packagePara.style.display = 'none';
        }
      }
    }

    // Cart count badge aria-label
    var cartLink = document.querySelector('.cart-link');
    if (cartLink) cartLink.setAttribute('aria-label', (CURRENT_LANG === 'de' ? 'Warenkorb' : (CURRENT_LANG === 'it' ? 'Carrello' : 'Cart')));

    // Update any notification text placeholders if present
  }

  function setLanguage(lang) {
    CURRENT_LANG = lang;
    try { localStorage.setItem('englar_lang', lang); } catch (e) { /* ignore */ }
    var langCurrent = document.querySelector('[data-lang-current]');
    if (langCurrent) langCurrent.textContent = lang.toUpperCase();
    applyPageTranslations();
  }

  function initI18nControls() {
    var switchers = document.querySelectorAll('.lang-switcher');
    switchers.forEach(function (sw) {
      var btn = sw.querySelector('.lang-toggle');
      var menu = sw.querySelector('.lang-options');
      if (!btn || !menu) return;

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', (!expanded).toString());
        menu.hidden = expanded;
      });

      var options = sw.querySelectorAll('.lang-option');
      options.forEach(function (opt) {
        opt.addEventListener('click', function (e) {
          var lang = opt.getAttribute('data-lang');
          setLanguage(lang);
          menu.hidden = true;
          btn.setAttribute('aria-expanded', 'false');
        });
      });
    });

    // initialize current indicator
    var langCurrent = document.querySelector('[data-lang-current]');
    if (langCurrent) langCurrent.textContent = (CURRENT_LANG || 'de').toUpperCase();
  }

  function renderCartPage() {
    var tableBody = document.getElementById('cart-items');
    if (!tableBody) return;

    var cart = getCart();
    var totalEl = document.getElementById('cart-total');

    tableBody.innerHTML = '';
    var total = 0;

    if (!cart.length) {
      var emptyRow = document.createElement('tr');
      var emptyCell = document.createElement('td');
      emptyCell.colSpan = 6;
      emptyCell.className = 'cart-empty';
      emptyCell.textContent = t('common.cart_empty');
      emptyRow.appendChild(emptyCell);
      tableBody.appendChild(emptyRow);
      if (totalEl) totalEl.textContent = '€0.00';
      return;
    }

    cart.forEach(function (item, index) {
      var lineTotal = (item.price || 0) * (item.quantity || 0);
      total += lineTotal;

      var tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.name || ''}</td>
        <td>${item.packageSize || ''}-bottle</td>
        <td>${item.quantity || 0}</td>
        <td>€${(item.price || 0).toFixed(2)}</td>
        <td>€${lineTotal.toFixed(2)}</td>
        <td><button class="btn-link cart-remove-btn" data-index="${index}">${t('common.item_removed') ? 'Remove' : 'Remove'}</button></td>
      `;
      tableBody.appendChild(tr);
    });

    if (totalEl) {
      totalEl.textContent = '€' + total.toFixed(2);
    }

    var removeButtons = document.querySelectorAll('.cart-remove-btn');
    removeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-index'), 10);
        removeFromCart(idx);
        renderCartPage();
        showNotification(t('common.item_removed'));
      });
    });
  }

  function initAddToCartButtons() {
    var buttons = document.querySelectorAll('[data-add-to-cart]');
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.disabled) return;
        var productEl = btn.closest('[data-product]');
        if (!productEl) return;

        var id = productEl.getAttribute('data-product-id');
        var name = productEl.getAttribute('data-product-name');
        var packageSize = btn.getAttribute('data-package-size');
        var price = parseFloat(btn.getAttribute('data-price') || '0');

        if (!id || !name || !packageSize || !price) return;

        addToCart({
          id: id,
          name: name,
          packageSize: packageSize,
          price: price,
          quantity: 1
        });
      });
    });
  }

  function initPackageSelectors() {
    var containers = document.querySelectorAll('.product-packages[data-product]');
    if (!containers.length) return;

    containers.forEach(function (container) {
      var packageBtns = container.querySelectorAll('[data-package-select]');
      var addBtn = container.querySelector('[data-add-to-cart]');

      if (!packageBtns.length || !addBtn) return;

      // Make sure add button is disabled until a selection is made
      addBtn.disabled = true;

      packageBtns.forEach(function (btn) {
        // Ensure default visuals (white outline)
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');

        btn.setAttribute('aria-pressed', 'false');

        btn.addEventListener('click', function () {
          // Clear previous selections
          packageBtns.forEach(function (b) {
            b.classList.remove('btn-primary');
            b.classList.add('btn-outline');
            b.setAttribute('aria-pressed', 'false');
          });

          // Mark this one as selected
          btn.classList.remove('btn-outline');
          btn.classList.add('btn-primary');
          btn.setAttribute('aria-pressed', 'true');

          // Enable add button and set its package attributes
          addBtn.disabled = false;
          addBtn.setAttribute('aria-disabled', 'false');
          // Visual appearance: change Add to basket from outline to the secondary color
          addBtn.classList.remove('btn-outline');
          addBtn.classList.add('btn-secondary');
          addBtn.setAttribute('data-package-size', btn.getAttribute('data-package-size'));
          addBtn.setAttribute('data-price', btn.getAttribute('data-price'));
          // Move keyboard focus to the enabled Add to basket button for accessibility
          try { addBtn.focus(); } catch (e) { /* ignore focus errors */ }
        });
      });
    });
  }

  function initProductImageParallax() {
    // Parallax removed per user request; images should remain stationary.
    // This stub preserves the function call so it can be safely invoked elsewhere.
    return;
  }

  function initDisableSubpageCTAs() {
    var page = (document.body && document.body.getAttribute('data-page')) || '';
    var subpages = ['rose', 'berg', 'leon'];
    if (!subpages.includes(page)) return;

    // Disabled: previously blocked buy buttons on subpages. Now intentionally left empty so Snipcart works.
  }

  // Adjust wine data cards value font size when the content is lengthy
  function adjustWineDataCards() {
    var values = document.querySelectorAll('.wine-data-card .card-value');
    values.forEach(function(el) {
      if (el.textContent.trim().length > 18) {
        el.classList.add('small');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateCartCount(getCart());
    initPackageSelectors();
    initAddToCartButtons();
    initDisableSubpageCTAs();
    renderCartPage();
    initProductImageParallax();

    // adjust wine-data-cards font sizes if necessary
    adjustWineDataCards();

    // Initialize translations and language controls
    initI18nControls();
    setLanguage(CURRENT_LANG);

    checkAgeGate();

    var ageYes = document.getElementById('age-yes');
    if (ageYes) {
      ageYes.addEventListener('click', function() {
        localStorage.setItem(AGE_KEY, 'true');
        var overlay = document.getElementById('age-gate');
        if (overlay) overlay.style.display = 'none';
      });
    }
    var ageNo = document.getElementById('age-no');
    if (ageNo) {
      ageNo.addEventListener('click', function() {
        window.location.href = 'age-denied.html';
      });
    }

    var checkoutBtn = document.querySelector('.cart-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function () {
        showNotification(t('common.checkout_soon'));
      });
    }
  });

  // Hide header on mobile when Snipcart modals are open
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        var html = mutation.target;
        var hasSnipcartClass = html.classList.contains('snipcart-modal-opened') ||
                               html.classList.contains('snipcart-modal--opened') ||
                               html.classList.contains('snipcart-cart-opened') ||
                               html.classList.contains('snipcart-checkout-modal-opened') ||
                               html.classList.contains('snipcart-checkout-modal--opened') ||
                               html.classList.contains('snipcart-modal-open') ||
                               html.classList.contains('snipcart-cart--opened');
        var header = document.querySelector('.site-header');
        if (header) {
          if (hasSnipcartClass && window.innerWidth <= 768) {
            header.style.display = 'none';
          } else {
            header.style.display = '';
          }
        }
      }
    });
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
})();