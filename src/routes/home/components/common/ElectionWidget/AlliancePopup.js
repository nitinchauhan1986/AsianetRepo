import React from 'react';
import s from './ElectionState.scss';

const AlliancePopup = ({ allianceMap, toggleAllianceInfoPopup }) => (
  <div className={s.alliancePopup}>
    <div className={s.inner}>
      <h4>Alliances </h4>
      <span className={s.closeBtn} onClick={toggleAllianceInfoPopup} />

      <div className={s.content}>
        <div className={s.partyHeader}>
          {allianceMap &&
            allianceMap.map((item, index) => (
              <div className={s.data} key={index}>
                <strong style={{ color: item.color }}>{item.name}</strong>
              </div>
            ))}
        </div>
        <div className={s.innerContent}>
          {allianceMap &&
            allianceMap.map((item, index) => (
              <div className={s.innerData} key={index}>
                {item.data &&
                  item.data.map((item1, index1) => (
                    <div className={s.data} key={index1}>
                      <p>{item1.an}</p>
                      <strong>{item1.ls + item1.ws}</strong>
                    </div>
                  ))}
              </div>
            ))}
        </div>
        <div className={s.total}>
          {allianceMap &&
            allianceMap.map((item, index) => (
              <div className={s.data} key={index}>
                <strong>{item.totalSeats}</strong>
              </div>
            ))}
        </div>
      </div>
    </div>
  </div>
);

export default AlliancePopup;
