import React from 'react';

import styles from './IonicHeaderComponent.scss';

export interface IonicHeaderComponentProps {
  prop?: string;
}

export function IonicHeaderComponent({prop = 'default value'}: IonicHeaderComponentProps) {
  return <div className={styles.IonicHeaderComponent}>IonicHeaderComponent {prop}</div>;
}
