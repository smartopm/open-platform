import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next';

export default function I18Initializer(){
    const { i18n } = useTranslation();
    // get authState here
    const savedLang = localStorage.getItem('default-language');
  
    useEffect(() => {
      // we can also check from the db here for the default language
      i18n.changeLanguage(savedLang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savedLang]);
  
    return <></>;
}