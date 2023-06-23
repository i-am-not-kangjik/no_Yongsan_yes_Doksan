/*eslint-disable*/
import React, { useEffect, useRef, useState } from 'react';
import Detail from "./detail";

function useOutsideAlerter(ref, setd, setblur) {
  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      setd(false);
      setblur('blurOff');
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, setd, setblur]);

}

export default function OutsideAlerter(props) {
  const { setd, setblur } = props;
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setd, setblur);

  useEffect(() => {
    // Delay the appearance of the OutsideAlerter for demonstration purposes
    const timeout = setTimeout(() => {
      setVisible(true);
    }, 10);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`outside-alerter ${visible ? 'show' : ''}`}
      style={{ width: '75%' }}
    >
      <Detail updateCd={props.updateCd} setCd={props.setCd} cd={props.cd} id={props.id} setRecentList={props.setRecentList} recentList={props.recentList}/>
    </div>
  );
}