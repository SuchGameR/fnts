let currentLang = 'en';
const supportedLangs = ['ja', 'en'];

async function loadLanguageData(pageName = 'common') {
    const stored = localStorage.getItem('fnts-lang');
    const userLang = (navigator.language || navigator.userLanguage).split('-')[0];
    currentLang = stored || (supportedLangs.includes(userLang) ? userLang : 'en');

    let translations = {};
    let fallbackTranslations = {};

    try {
        try {
            const fallbackRes = await fetch(`locales/en/${pageName}.json`);
            if (fallbackRes.ok) fallbackTranslations = await fallbackRes.json();
        } catch (e) {
            console.warn('英語（フォールバック）の読み込みに失敗しました');
        }

        if (currentLang !== 'en') {
            try {
                const response = await fetch(`locales/${currentLang}/${pageName}.json`);
                if (response.ok) {
                    translations = await response.json();
                } else {
                    console.warn(`メイン言語(${currentLang})のファイルが見つからないため、英語を表示します。`);
                }
            } catch (e) {
                console.warn(`メイン言語(${currentLang})の読み込み中にエラーが発生しました`);
            }
        } else {
            translations = fallbackTranslations;
        }

        applyTranslations(translations, fallbackTranslations);
        updateToggleLabel();

    } catch (error) {
        console.error('致命的なエラー:', error);
    }
}

function applyTranslations(mainData, fallbackData) {
    document.querySelectorAll('.i18n').forEach(el => {
        const keyPath = el.getAttribute('data-key');

        const getValue = (obj) => {
            return keyPath.split('.').reduce((target, key) => {
                return target && target[key] !== undefined ? target[key] : null;
            }, obj);
        };

        let value = getValue(mainData);

        if (!value || typeof value !== 'string') {
            value = getValue(fallbackData);
        }

        if (value && typeof value === 'string') {
            el.textContent = value;
        }
    });
}

function updateToggleLabel() {
    const btn = document.querySelector('.language-toggle');
    if (btn) {
        btn.textContent = currentLang === 'ja' ? 'EN' : 'JA';
        btn.setAttribute('aria-label', currentLang === 'ja' ? 'Switch to English' : '日本語に切替');
    }
}

function switchLanguage(lang) {
    if (!supportedLangs.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem('fnts-lang', lang);
    document.documentElement.lang = lang;
    loadLanguageData('common');
}

window.addEventListener('DOMContentLoaded', () => {
    loadLanguageData('common');

    const toggleBtn = document.querySelector('.language-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            switchLanguage(currentLang === 'ja' ? 'en' : 'ja');
        });
    }
});
