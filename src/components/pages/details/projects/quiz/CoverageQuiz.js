import MapContainer from "components/map/MapContainer";
import { Feature } from "ol";
import { Circle } from "ol/geom";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import React, { useEffect, useState } from "react";
import unidecode from "unidecode";

const purify = text => {
  const unascii = unidecode(text);
  return unascii
    .replaceAll(' ', '')
    .toLowerCase()
    .replace(/__.*/gi, '')
    .replace(/[^0-9a-z]/gi, '')
    .replace('school', '')
    .replace('saint', 'st');
}

const circleStyle = new Style({
  fill: new Fill({
    color: 'rgba(127, 127, 255, 0.2)' // Fill color with 20% opacity (red in this case)
  }),
  stroke: new Stroke({
    color: 'blue', // Stroke color
    width: 2 // Stroke width
  })
});

const CoverageQuiz = ({ data, constructor }) => {
  const [features, setFeatures] = useState([]);
  const [itemPositions, setItemPositions] = useState({});
  const [items, setItems] = useState({});
  const [completed, setCompleted] = useState({});
  const [covered, setCovered] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [grade, setGrade] = useState('');
  const [willRecenter, setRecenter] = useState(false);
  const [withOverlay, setWithOverlay] = useState(false);
  
  useEffect(() => {
    setCorrect(0);
    setCompleted({});
    setGrade('');
    setRecenter(true);
    const allItems = Object.entries(data).map(([k, v], index) => {
      const key = purify(v.title);
      if (!!itemPositions[key]) {
        itemPositions[key].push(index);
      } else {
        itemPositions[key] = [index];
      }
      setItemPositions(itemPositions);
      const item = constructor(v);
      return item;
    });
    setItems(allItems);
    setFeatures([]);
  }, [itemPositions, constructor, data]);

  const handleGuess = event => {
    setRecenter(false);
    const guess = purify(event.target.value);
    const positionsToChange = itemPositions[guess];
    if (!!positionsToChange) {
      if (!!completed[guess]) {
        return;
      }

      completed[guess] = true;
      setCompleted(completed);

      const positionsToCover = new Set([...covered]);
      const circles = [];
      for (let p of positionsToChange) {
        const loc = items[p];
        const circle = new Feature(new Circle([loc.longitude, loc.latitude], 0.0089));
        circle.setStyle(circleStyle);
        circles.push(circle);
        items.forEach((_, i) => {
          const dist = Math.pow(Math.pow(items[i].latitude - loc.latitude, 2) + Math.pow(items[i].longitude - loc.longitude, 2), 0.5) * 111.33;
          if (dist < 1 && !positionsToCover.has(i)) {
            positionsToCover.add(i);
          }
        })
      }

      setCovered([...covered, ...positionsToCover]);

      const totalCorrect = positionsToCover.size;
      setCorrect(totalCorrect);
      
      const newPositions = Array.from(positionsToCover).map(p => items[p].getFeature())
      // setFeatures(items.filter((_, i) => positionsToCover.has(i)).map(item => item.getFeature()));
      setFeatures([...circles, ...features, ...newPositions]);
      event.target.value = '';
      if (totalCorrect === items.length) {
        handleGiveUp(true)();
      }
    };
  };

  const getGrade = percentage => {
    switch (true) {
      case percentage > 0.9:
        return 'A for Average';
      case percentage > 0.8:
        return 'B for BBC Food';
      case percentage > 0.7:
        return 'C for Colander';
      case percentage > 0.6:
        return 'D for Disowned';
      case percentage > 0.5:
        return 'E for Emotional Damage';
      case percentage > 0.4:
        return 'F for Failure';
      default:
        return 'J for Jamie Oliver';
    }
  };

  const handleGiveUp = isComplete => _ => {
    setGrade(getGrade(isComplete ? 1 : correct/items.length));
    setWithOverlay(true);
  }

  return <div className='text-start'>
    <div className='form-group'>
      <label htmlFor='guess'><b>Enter answer here:</b></label>
      <input
        type='text'
        id='guess'
        name='guess'
        className='form-control my-2'
        onChange={handleGuess}
      />
    </div>
    <p>{`${correct}/${items.length}`} guessed <button onClick={handleGiveUp()} className='btn btn-danger py-1 ms-2'>Give Up</button></p>
    {!!grade && <p><b>Grade:</b><br/>{grade}</p>}
    <MapContainer category='projects' features={features} willRecenter={willRecenter} withOverlay={withOverlay}/>
  </div>
};

export default CoverageQuiz;