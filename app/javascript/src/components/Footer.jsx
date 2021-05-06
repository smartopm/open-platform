/* eslint-disable */
import React from 'react'
import { useTranslation } from 'react-i18next';

export function Footer({ position }) {
  const { t } = useTranslation(['common']);
  return (
    <p
      style={{
        textAlign: 'center',
        color: '#8c8c93',
        marginTop: position
      }}
      className="text-center"
    >
      {t('common:misc.powered_by_dgdp')} {' '}
    </p>
  )
}
